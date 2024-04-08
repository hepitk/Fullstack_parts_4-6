const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

const userExtractor = (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET)
      if (decodedToken) {
        req.user = decodedToken
      }
    } catch (error) {
      return res.status(401).json({ error: 'token invalid or expired' })
    }
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }