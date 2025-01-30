// server-mysql/middleware/perms-check.js
const { apiPermissions, query, whiteListedAPIs } = require("../config/constants");

const middlewareForPermsCheck = async (req, res, next) => {
  if (whiteListedAPIs.includes(req.path)) return next()
  const { id } = req.user;
  const apiName = req.path.split("/")[1];
  const requiredApiPerm = apiPermissions[apiName];

  if (!requiredApiPerm) {
    return res
      .status(400)
      .json({ message: `No permission mapping found for API: ${apiName}` });
  }

  try {
    const [employee] = await query(`
        SELECT perms,isDeleted FROM tbl_user
        WHERE user_id = ?
      `, [id]);
    if (employee.isDeleted === 1) return res.status(419).json({ message: 'deleted user.' })
    req.user.perms = employee.perms.split(',')
    if (req.user.perms.includes(requiredApiPerm[0])) return next()
    return res
      .status(401)
      .json({ message: "Unauthorized: insufficient permissions." });
  } catch (error) {
    console.error("Permission check failed:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = middlewareForPermsCheck;
