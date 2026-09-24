import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { usermodel } from "../modules/User.js";

const { verify } = jwt;
config();

export const ALL_ROLES = ["admin", "teacher", "student", "hod", "placement-office"];

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return req.cookies?.token || bearerToken;
};

/**
 * Verify Token Middleware
 * Reads JWT token from HTTP-only cookie or Authorization header and validates it.
 * Then checks if the decoded user's role is in the allowed roles list.
 *
 * @param {...string} allowedRoles - List of roles allowed to access the route
 * @returns {function} Express middleware
 */
export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = extractToken(req);

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
 */
export const optionalAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = extractToken(req);
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
 */
export const getTokenUserId = (req) => {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "campusflow_super_secret_key_2026");
    return decoded.userId;
  } catch (err) {
    return null;
  }
};