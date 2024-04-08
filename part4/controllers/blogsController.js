const Blog = require('../models/blog')

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
}

const createBlog = async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'Missing title or url' })
  }
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const { title, author, url, likes } = req.body
  const { id: userId } = req.user

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: userId
  })

  try {
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteBlog = async (req, res) => {
  const { id: blogId } = req.params
  const userId = req.user?.id

  const blog = await Blog.findById(blogId)

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  if (!blog.user || blog.user.toString() !== userId) {
    return res.status(403).json({ error: 'Unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(blogId)
  res.status(204).end()
}

const updateBlog = async (req, res) => {
  const { id: blogId } = req.params
  const { title, author, url, likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, author, url, likes }, { new: true })

  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  res.json(updatedBlog)
}

module.exports = { getAllBlogs, createBlog, deleteBlog, updateBlog }
