const express = require('express')
const blogsController = require('../controllers/blogsController')
const middleware = require('../utils/middleware')

const router = express.Router()

router.get('/', blogsController.getAllBlogs)
router.post('/', middleware.userExtractor, blogsController.createBlog)
router.delete('/:id', middleware.userExtractor, blogsController.deleteBlog)
router.put('/:id', middleware.userExtractor, blogsController.updateBlog)

module.exports = router