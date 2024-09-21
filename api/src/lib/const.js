const HOST = process.env.NODE_ENV === 'vercel' ? '' : `http://localhost:${process.env.PORT}`;

module.exports = {
  HOST
};