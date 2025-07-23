function validateRequest(schema) {
  return function middleware(req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      // Determine page context by referrer  (so that i can show error to that page only login or addUser)
      const ref = req.headers.referer || "";
      if (ref.includes("add-user")) {
        return res.render("addUser", { error: error.details[0].message, user: req.user });
      } else {
        return res.render("login", { error: error.details[0].message });
      }
    }
    next();
  }
}

module.exports = validateRequest;
