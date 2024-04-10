import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, notify }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !author.trim() || !url.trim()) {
      notify('Title, author, and URL must not be empty', 'error')
      return
    }

    try {
      await createBlog({ title, author, url })
      notify(`A new blog '${title}' by ${author} added`, 'success')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      notify('Failed to add new blog', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
                title: <input id="title-input" name="title" type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
              author: <input id="author-input" name="author" type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
              url: <input id="url-input" name="url" type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button id="create-blog-button" type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default BlogForm

