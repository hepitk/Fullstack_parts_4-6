import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegistrationForm from './components/RegistrationForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

const App = () => {
  const [user, setUser] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [notification, setNotification] = useState({ message: null, type: null })
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const response = await fetch('/api/blogs')
    const blogs = await response.json()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) throw new Error('Invalid username or password')
      const user = await response.json()
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      notify('Login successful', 'success')
    } catch (error) {
      notify(error.toString(), 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notify('Logged out', 'info')
  }

  const createBlog = async (blogObject) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(blogObject),
      })
      if (!response.ok) throw new Error('Failed to add blog')
      const savedBlog = await response.json()
      savedBlog.user = { username: user.username, name: user.name, id: user.id }
      setBlogs(blogs.concat(savedBlog).sort((a, b) => b.likes - a.likes))
      notify(`A new blog '${savedBlog.title}' by ${savedBlog.author} added`, 'success')
    } catch (error) {
      notify(error.toString(), 'error')
    }
  }

  const likeBlog = async (id) => {
    try {
      const blogToLike = blogs.find(blog => blog.id === id)
      const updatedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
        user: blogToLike.user.id
      }

      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedBlog),
      })

      if (!response.ok) {
        throw new Error('Failed to update likes')
      }

      const returnedBlog = await response.json()

      setBlogs(blogs.map(blog => blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog))

      notify(`Liked '${blogToLike.title}' by ${blogToLike.author}`, 'success')
    } catch (error) {
      notify(error.toString(), 'error')
    }
  }

  const deleteBlog = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?')
    if (confirmed) {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Blog deletion failed')
        }

        setBlogs(blogs.filter(blog => blog.id !== id))

        notify('Blog deleted successfully', 'success')
      } catch (error) {
        notify(error.toString(), 'error')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        {showRegistration ? (
          <>
            <RegistrationForm />
            <button onClick={() => setShowRegistration(false)}>Go to Login</button>
          </>
        ) : (
          <>
            <LoginForm handleLogin={handleLogin} />
            <button onClick={() => setShowRegistration(true)}>Register</button>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        <>
          <Togglable buttonLabel="Login">
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
          <Togglable buttonLabel="Register">
            <RegistrationForm />
          </Togglable>
        </>
      ) : (
        <>
          <p id="logged-in-message">{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="Create new blog">
            <BlogForm createBlog={createBlog} notify={notify} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
          )}
        </>
      )}
    </div>
  )
}

export default App


