import React, { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submitLogin = (event) => {
    event.preventDefault()
    handleLogin(username, password)
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form id="login-form" onSubmit={submitLogin}>
        <div>
                    username
          <input id="username-input" type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
                    password
          <input id="password-input" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
