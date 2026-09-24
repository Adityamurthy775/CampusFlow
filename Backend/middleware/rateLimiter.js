// Rate Limiting Middleware
// Enforces a rate limit of 300 requests per minute per client IP address
// Returns HTTP 429 (Too Many Requests) when the limit is exceeded

// In-memory store to track request timestamps for each IP address
// Structure: Map<ipAddress, Array<number>>
// Note: For production, use Redis or similar for distributed rate limiting
const rateLimitStore = new Map()

/**
 * Rate limiting middleware function
 * Allows 300 requests per 60000ms (1 minute) per client IP
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const rateLimit = (req, res, next) => {
  // Determine client IP address (supports proxies)
  const clientIp = req.ip || req.connection.remoteAddress || "unknown"
  const now = Date.now()
  const windowMs = 60000 // 1 minute in milliseconds
  const maxRequests = 300 // 300 requests per minute (sane for dev)

  // Retrieve request timestamps for this IP, or initialize empty array
  const requestTimes = rateLimitStore.get(clientIp) || []

  // Remove timestamps that are outside the current window
  const recentRequests = requestTimes.filter((time) => now - time < windowMs)

  // If the client has already made the maximum allowed requests in this window
  if (recentRequests.length >= maxRequests) {
    const oldestRequest = recentRequests[0]
    const resetTime = new Date(oldestRequest + windowMs)
    return res.status(429).json({
      message: "Too many requests. Rate limit exceeded.",
      limit: `${maxRequests} requests per ${windowMs / 1000} seconds`,
      retryAfter: `${Math.ceil((resetTime.getTime() - now) / 1000)} seconds`,
      resetAt: resetTime.toISOString(),
    })
  }

  // Record the current request timestamp for this IP
  recentRequests.push(now)
  rateLimitStore.set(clientIp, recentRequests)

  // Periodically clean up expired entries to prevent memory leaks
  if (rateLimitStore.size > 10000) {
    for (const [ip, times] of rateLimitStore.entries()) {
      const filtered = times.filter((time) => now - time < windowMs)
      if (filtered.length === 0) {
        rateLimitStore.delete(ip)
      } else {
        rateLimitStore.set(ip, filtered)
      }
    }
  }

  // Proceed to next middleware/route handler
  next()
}

/**
 * Middleware factory to apply rate limiting to specific API routes
 * Usage: app.use('/user-api', rateLimit, userApp)
 */
export default rateLimit
