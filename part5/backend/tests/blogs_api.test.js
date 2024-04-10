const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.SECRET, { expiresIn: '1h' })
}

function generateUniqueUsername(baseUsername) {
  return `${baseUsername}_${Date.now()}`
}


async function setupTest() {
  const newUser = {
    username: generateUniqueUsername('testUser'),
    name: 'Test User',
    password: 'testPassword',
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds)


  const savedUser = await new User({
    username: newUser.username,
    name: newUser.name,
    passwordHash,
  }).save()


  const userForToken = {
    username: newUser.username,
    id: savedUser._id.toString(),
  }
  const token = generateToken(userForToken)

  return token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = listHelper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('4.3: Dummy test returns one', async () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('4.4: Total likes of all blogs is calculated correctly', async () => {
  const blogs = await Blog.find({})
  const result = listHelper.totalLikes(blogs)
  const expected = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  assert.strictEqual(result, expected)
})

test('4.5: Favorite blog finds the blog with the most likes', async () => {
  const blogs = await Blog.find({})
  const result = listHelper.favoriteBlog(blogs)
  const maxLikesBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  assert.deepStrictEqual(result, {
    title: maxLikesBlog.title,
    author: maxLikesBlog.author,
    likes: maxLikesBlog.likes
  })
})

test('4.6: Most blogs finds the author with the most blogs', async () => {
  // Given the initialBlogs setup, Robert C. Martin has the most blogs (2 blogs)
  const expected = {
    author: 'Robert C. Martin',
    blogs: 2
  }

  const blogs = listHelper.initialBlogs
  const result = listHelper.mostBlogs(blogs)
  assert.deepStrictEqual(result, expected, 'Should find the author with the most blogs correctly')
})

test('4.7: Most likes finds the author with the most likes', async () => {
  // Given the initialBlogs setup, Robert C. Martin also has the most likes (10 likes across all blogs)
  const expected = {
    author: 'Robert C. Martin',
    likes: 10
  }

  const blogs = listHelper.initialBlogs
  const result = listHelper.mostLikes(blogs)
  assert.deepStrictEqual(result, expected, 'Should find the author with the most likes correctly')
})

test('4.8: GET /api/blogs blogs are returned as json', async () => {
  await supertest(app)
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('4.9: Blog posts have id property instead of _id', async () => {
  const response = await supertest(app)
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('4.10: POST /api/blogs successfully creates a new blog post with authentication token', async () => {

  const newBlog = {
    title: 'Integration testing with supertest',
    author: 'Node Jedi',
    url: 'http://example.com/new-blog',
    likes: 5
  }


  const token = await setupTest()


  const initialBlogsResponse = await api.get('/api/blogs')
  const initialBlogsCount = initialBlogsResponse.body.length


  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const updatedBlogsResponse = await api.get('/api/blogs')
  const updatedBlogsCount = updatedBlogsResponse.body.length


  assert.strictEqual(updatedBlogsCount, initialBlogsCount + 1, 'The number of blogs did not increase by 1 after posting a new blog.')


  const newBlogExists = updatedBlogsResponse.body.some(blog => blog.title === newBlog.title && blog.author === newBlog.author)
  assert.strictEqual(newBlogExists, true, 'The new blog post does not exist in the updated list.')
})

test('4.11: Likes property defaults to 0 if missing', async () => {

  const newBlogWithoutLikes = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com/test-blog'
  }


  const token = await setupTest()


  const response = await supertest(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  assert.strictEqual(response.body.likes, 0, 'The \'likes\' property did not default to 0.')
})


test('4.12: Missing title or url properties result in 400 Bad Request', async () => {
  const newBlogWithoutTitle = {
    author: 'Test Author',
    url: 'http://example.com/test-blog'
  }

  const token = await setupTest()


  const responseWithoutTitle = await supertest(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)


  assert.strictEqual(responseWithoutTitle.body.error, 'Missing title or url', 'Expected to fail with 400 Bad Request due to missing title.')

  const newBlogWithoutUrl = {
    title: 'Test Blog',
    author: 'Test Author'
  }


  const responseWithoutUrl = await supertest(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)

  assert.strictEqual(responseWithoutUrl.body.error, 'Missing title or url', 'Expected to fail with 400 Bad Request due to missing url.')
})

test('4.13: DELETE /api/blogs/:id successfully deletes a blog post', async () => {
  const token = await setupTest()

  const newBlog = {
    title: 'Temporary Blog Post for Deletion',
    author: 'Test Author',
    url: 'http://example.com/temp-blog-for-deletion',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await listHelper.blogsInDb()
  const blogToDelete = blogsAtStart.find(blog => blog.title === newBlog.title)

  if (!blogToDelete) throw new Error('Newly created blog for deletion was not found.')

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfterDelete = await listHelper.blogsInDb()
  assert.strictEqual(blogsAfterDelete.length, blogsAtStart.length - 1, 'Blog post was not deleted successfully.')
})

test('4.14: PUT /api/blogs/:id successfully updates a blog post', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlogData).expect(200)

  const updatedBlog = await Blog.findById(blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

test('4.23: POST /api/blogs fails with 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
    title: 'Integration testing with supertest',
    author: 'Node Jedi',
    url: 'http://example.com/new-blog',
    likes: 5
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
