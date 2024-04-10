const jwt = require('jsonwebtoken')
const User = require('../models/user')

const loginUser = async (req, res) => {
  const { username, password } = req.body
  const user = await User.authenticate(username, password)

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
  res.status(200).json({ token, username: user.username, name: user.name })
}

module.exports = { loginUser }