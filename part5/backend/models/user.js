const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  passwordHash: { type: String, required: true },
  name: String
})

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.passwordHash
  return user
}

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user) return null
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  return passwordCorrect ? user : null
}

const User = mongoose.model('User', userSchema)

module.exports = User