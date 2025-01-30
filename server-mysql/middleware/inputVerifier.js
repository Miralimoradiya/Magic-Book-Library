// server-mysql-dev/middleware/inputVarifier.js
module.exports = function (requiredFields) {
  return (req, res, next) => {
      if (req.body.action === "update" && requiredFields.includes("password")) {
          requiredFields = requiredFields.filter(field => field !== "password");
      }

      for (let field of requiredFields) {
          if (
              !req.body[field] &&
              !req.query[field] &&
              !req.params[field] &&
              !req.user[field]
          ) {
              return res.status(400).json({ error: `${field} is required` });
          }
      }
      next();
  };
};