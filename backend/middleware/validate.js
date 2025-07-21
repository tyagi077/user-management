function validateRequest(schema) {
  function middleware(req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  }

  return middleware;
}

module.exports = validateRequest;
