import React, { useState } from 'react'
import axios from 'axios'

const RegistrationForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleRegistration = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/users', {
        username,
        password,
        name,
      })
      console.log('Registration successful', response.data)

      setUsername('')
      setPassword('')
      setName('')
    } catch (error) {
      console.error('Registration failed:', error.response.data.error)
      setErrorMessage(error.response.data.error)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleRegistration}>
        <div>
                    Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
                    Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
                    Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegistrationForm