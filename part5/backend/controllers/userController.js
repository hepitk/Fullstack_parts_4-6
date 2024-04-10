const User = require('../models/user')
const bcrypt = require('bcrypt')

const createUser = async (req, res) => {
  const { username, password, name } = req.body
  if (!username || !password || !name || username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'Username and password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users)
}

module.exports = { createUser, getAllUsers }