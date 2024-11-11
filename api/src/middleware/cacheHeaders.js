const setCacheHeaders = (seconds) => (req, res, next) => {
  if (typeof seconds !== 'number') {
    return next(new Error('Seconds must be a number'));
  }
  res.set('Cache-Control', `max-age=0, s-maxage=${seconds}`);
  next();
};

module.exports = {
  setCacheHeaders,
}