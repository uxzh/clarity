const validate = (schema) => {
  return async (req, res, next) => {
    try {
      let data = {...req.body};
      try {
        await schema.validate(data, { abortEarly: false, stripUnknown: true });
      } catch (error) {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        return res.status(400).send(errors);
      }
      next();
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
}

module.exports = validate;