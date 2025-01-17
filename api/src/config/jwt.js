const _jwt = require('jsonwebtoken')

const privateKey = process.env.JWT_SECRET

const jwt = {
    sign: (payload) => _jwt.sign(payload, privateKey, {expiresIn: '72h'}),
    verify: (token) => _jwt.verify(token, privateKey)
  }

module.exports = jwt;