const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blogs App End To End Testing', () => {
    beforeEach(async ({ page, context }) => {
    //reset won't work for some reason
    await page.goto('http://localhost:3003/api/testing/reset', {
      method: 'POST'
    })

    await context.route('**/api/users', (route) => {
      route.post(async (request) => {
        await request.continue()
      })
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.waitForSelector('#login-form')
    expect(loginForm).toBeTruthy()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('#username-input', 'jari')
      await page.fill('#password-input', 'kari')
      await page.click('#login-button')
      await page.waitForSelector('#logged-in-message')
      const loggedInMessage = await page.$('#logged-in-message')
      expect(loggedInMessage).toBeTruthy()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('#username-input', 'incorrect_username')
      await page.fill('#password-input', 'incorrect_password')
      await page.click('#login-button')
      await page.waitForSelector('text=Invalid username or password')
      const errorMessage = await page.$('text=Invalid username or password')
      expect(errorMessage).toBeTruthy()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username-input', 'jari')
      await page.fill('#password-input', 'kari')
      await page.click('#login-button')
      await page.waitForSelector('#logged-in-message')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.click('text=Create new blog')
      await page.fill('#title-input', 'Test Blog')
      await page.fill('#author-input', 'Test Author')
      await page.fill('#url-input', 'http://testblog.com')
      await page.click('#create-blog-button')

      await page.waitForSelector('text=Test Blog')
      const blogTitle = await page.textContent('text=Test Blog')
      const blogAuthor = await page.textContent('text=Test Author')
      expect(blogTitle).toContain('Test Blog')
      expect(blogAuthor).toContain('Test Author')
    })
  })

  // Edit not implemented yet
  /*   describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.fill('#username-input', 'jari');
            await page.fill('#password-input', 'kari');
            await page.click('#login-button');
            await page.waitForSelector('#logged-in-message');
        });

        test('the blog can be edited', async ({ page }) => {
            await page.click('text=view');
            await page.click('text=edit');
            await page.fill('#title-input', 'Updated Blog Title');
            await page.fill('#author-input', 'Updated Author');
            await page.fill('#url-input', 'http://updatedblog.com');
            await page.click('text=Update Blog');

            await page.waitForSelector('text=Updated Blog Title');
            const updatedBlogTitle = await page.textContent('text=Updated Blog Title');
            const updatedBlogAuthor = await page.textContent('text=Updated Author');
            expect(updatedBlogTitle).toBe('Updated Blog Title');
            expect(updatedBlogAuthor).toBe('Updated Author');
        });
    });
*/
  //does not work
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username-input', 'jari')
      await page.fill('#password-input', 'kari')
      await page.click('#login-button')
      await page.waitForSelector('#logged-in-message')
    })

    test('the user who added the blog can delete the blog', async ({ page }) => {
      await page.click('text=Create new blog')
      await page.fill('#title-input', 'Test Blog')
      await page.fill('#author-input', 'Test Author')
      await page.fill('#url-input', 'http://testblog.com')
      await page.click('#create-blog-button')
      await page.click('text=view')
      await page.click('text=delete')
      await page.on('dialog', dialog => dialog.accept())
      await page.on('dialog', dialog => dialog.accept())

      await page.waitForFunction(
        () => !document.querySelector('text=Test Blog'),
        null,
        { polling: 'mutation' }
      )
    })
  })

  //does not work
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username-input', 'jari')
      await page.fill('#password-input', 'kari')
      await page.click('#login-button')
      await page.waitForSelector('#logged-in-message')
    })

    test('only the user who added the blog sees the blog\'s delete button', async ({ page }) => {
      await page.click('text=Create new blog')
      await page.fill('#title-input', 'Test Blog')
      await page.fill('#author-input', 'Test Author')
      await page.fill('#url-input', 'http://testblog.com')
      await page.click('#create-blog-button')
      await page.click('text=view')
      await page.waitForSelector('text=delete')

      await page.click('#logout-button')
      await page.fill('#username-input', 'henri')
      await page.fill('#password-input', 'hanri')
      await page.click('#login-button')
      await page.waitForSelector('#logged-in-message')

      await page.click('text=View')
      await page.waitForSelector('text=Delete', { state: 'hidden' })
    })
  })

  describe('Blogs are arranged according to likes', () => {
    test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page }) => {

      await page.goto('http://localhost:5173')

      const blogTitles = await page.$$eval('.blog-title', (elements) => elements.map((el) => el.textContent))
      const likeCounts = await page.$$eval('.like-count', (elements) => elements.map((el) => parseInt(el.textContent)))

      for (let i = 0; i < likeCounts.length - 1; i++) {
        expect(likeCounts[i]).toBeGreaterThanOrEqual(likeCounts[i + 1])
      }
    })
  })
})