const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((obj, b) => {
    obj[b.author] = obj[b.author] ? obj[b.author] + 1 : 1
    return obj
  }, {})
  const maxBlogs = Math.max(...Object.values(authors))
  const author = Object.keys(authors).find(author => authors[author] === maxBlogs)
  return {
    author: author,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((obj, b) => {
    obj[b.author] = obj[b.author] ? obj[b.author] + b.likes : b.likes
    return obj
  }, {})
  const maxLikes = Math.max(...Object.values(authors))
  const author = Object.keys(authors).find(author => authors[author] === maxLikes)
  return {
    author: author,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  blogsInDb,
}

