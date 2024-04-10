import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testblog.com',
  likes: 3,
  user: {
    username: 'testuser',
    name: 'Test User',
    id: 'testuserid123'
  }
}

describe('Blog component tests', () => {
  test('5.13: renders blog title and author, but not url or likes by default', () => {
    const component = render(<Blog blog={blog} likeBlog={() => { }} deleteBlog={() => { }} user={blog.user} />)
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.queryByText(blog.url)).toBeNull()
    expect(component.queryByText(`likes ${blog.likes}`)).toBeNull()
  })

  test('5.14: blog\'s url and number of likes are shown when view button is clicked', async () => {
    const component = render(<Blog blog={blog} likeBlog={() => { }} deleteBlog={() => { }} user={blog.user} />)
    const user = userEvent.setup()
    const viewButton = component.getByText('view')
    await user.click(viewButton)
    expect(component.getByText(blog.url)).toBeDefined()
    expect(component.getByText(`Likes: ${blog.likes}`)).toBeDefined()
  })

  test('5.15: if the like button is clicked twice, the event handler is called twice', async () => {
    const mockHandler = vi.fn()
    const component = render(<Blog blog={blog} likeBlog={mockHandler} deleteBlog={() => { }} user={blog.user} />)
    const user = userEvent.setup()
    const viewButton = component.getByText('view')
    await user.click(viewButton)
    const likeButton = component.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
  describe('BlogForm component tests', () => {
    test('5.16: form calls the event handler it received as props with the right details when a new blog is created', async () => {
      const createBlog = vi.fn()
      const notify = vi.fn()
      const component = render(<BlogForm createBlog={createBlog} notify={notify} />)
      const user = userEvent.setup()

      const titleInput = component.container.querySelector('input[name="title"]')
      const authorInput = component.container.querySelector('input[name="author"]')
      const urlInput = component.container.querySelector('input[name="url"]')

      await user.type(titleInput, 'New Blog Title')
      await user.type(authorInput, 'New Author')
      await user.type(urlInput, 'http://newblog.com')

      const submitButton = component.getByText('create')
      await user.click(submitButton)

      expect(createBlog).toHaveBeenCalledWith({
        title: 'New Blog Title',
        author: 'New Author',
        url: 'http://newblog.com'
      })
    })
  })
})