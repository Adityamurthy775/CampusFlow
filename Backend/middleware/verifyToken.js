import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { usermodel } from "../modules/User.js";

const { verify } = jwt;
config();

export const ALL_ROLES = ["admin", "teacher", "student", "hod", "placement-office"];

/**
 * Verify Token Middleware
 * Reads JWT token from HTTP-only cookie and validates it against the secret key.
 * Then checks if the decoded user's role is in the allowed roles list.
 *
 * @param {...string} allowedRoles - List of roles allowed to access the route
 * @returns {function} Express middleware
 *
 * Usage: app.use('/admin-api', verifyToken("ADMIN"), adminApp)
 *        Or on individual routes: router.get('/', verifyToken("USER"), handler)
 */
export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get token from httpOnly cookie (set by login endpoint)
      const token = req.cookies?.token;

      // If no token present, user is not logged in
      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }

      // Verify and decode the JWT token
      let decodedToken = verify(token, process.env.JWT_SECRET || "campusflow_super_secret_key_2026");

      // Check if the decoded user still exists in the database and is active
      const currentUser = await usermodel.findById(decodedToken.userId);
      if (!currentUser || currentUser.isActive === false) {
        return res.status(401).json({ message: "Account is deactivated. Please contact administrator" });

      }

      // Check if the user's role is in the allowed roles for this route
      if (!allowedRoles.includes(currentUser.role)) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }

      // Add the decoded token info to the request object for downstream handlers
      req.user = { ...decodedToken, role: currentUser.role };
      req.userId = decodedToken.userId;
      req.role = currentUser.role;

      // Proceed to the route handler
      next();
    } catch (err) {
      // Invalid, expired, or tampered token
      res.status(401).json({ message: "Invalid or expired token. Please login again" });
    }
  };
};

/**
 * Optional Auth Middleware
 * Like verifyToken, but does NOT block unauthenticated requests.
 * If a valid token exists, adds user info to req; otherwise continues without.
 * Useful for routes that show different views for logged-in vs anonymous users.
 *
 * @param {...string} allowedRoles - Roles that can access the data when authenticated
 * @returns {function} Express middleware
 */
export const optionalAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) return next();

      const decodedToken = verify(token, process.env.JWT_SECRET || "campusflow_super_secret_key_2026");
      if (!allowedRoles.includes(decodedToken.role)) return next();

      req.user = decodedToken;

      req.userId = decodedToken.userId;

      req.role = decodedToken.role;
    } catch (err) {
      // ignore invalid tokens
    }
    next();
  };
};

/**
 * Get User ID from request (helper utility)
 * Returns the userId from the decoded JWT token in the request
 */
export const getTokenUserId = (req) => {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "campusflow_super_secret_key_2026");
    return decoded.userId;
  } catch (err) {
    return null;
  }
};