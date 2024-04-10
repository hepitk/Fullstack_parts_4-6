import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const detailedStyle = { display: visible ? '' : 'none' }

  const handleLike = (event) => {
    event.stopPropagation()
    likeBlog(blog.id)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    const confirmDelete = window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)
    if (confirmDelete) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div id="blog-list" style={blogStyle} onClick={toggleVisibility}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div style={detailedStyle}>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>Added by {blog.user ? blog.user.name : 'Unknown'}</p>
          {blog.user && user && blog.user.username === user.username && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
}

export default Blog