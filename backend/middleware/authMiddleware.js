const jwt = require('jsonwebtoken');
const user = require('../models/User');
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const adminProtect = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ADMIN")
    return makeResponse({ res, status: 403, message: "Unauthorized" });
  next();
});

module.exports = {protect, adminProtect}