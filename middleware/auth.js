const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function(req, res, next){
  // Get token from header
  const token = req.header('x-auth-token')
  // Check if no token
  if(!token){
    return res.status(401).json({ message: 'No token, authorization denied.' })
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get('JWT_SECRET'))
    // assign a user property to request to be the decoded token 'user' payload value
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token not valid.' })
  }
}