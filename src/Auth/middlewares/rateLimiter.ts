import rateLimit from "express-rate-limit";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Function to get request count from the database
const getRequestCount = async (ip: string) => {
  const result = await pool.query(
    "SELECT requests FROM rate_limits WHERE ip_address = $1 AND updated_at > NOW() - INTERVAL '15 minutes'",
    [ip]
  );
  return result.rows[0]?.requests || 0;
};

// Function to update request count in the database
const updateRequestCount = async (ip: string) => {
  await pool.query(
    `INSERT INTO rate_limits (ip_address, requests, updated_at) 
     VALUES ($1, 1, NOW())
     ON CONFLICT (ip_address) 
     DO UPDATE SET requests = rate_limits.requests + 1, updated_at = NOW()`,
    [ip]
  );
};

// Global Rate Limiter (Applies to all routes)
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  keyGenerator: (req: any) => req.ip!,
  handler: (req: any, res: any) => {
    res.status(429).json({ error: "Too many requests, slow down!" });
  },
  async requestWasSuccessful(req: any) {
    const ip = req.ip!;
    const currentRequests = await getRequestCount(ip);
    if (currentRequests < 200) {
      await updateRequestCount(ip);
      return true;
    }
    return false;
  },
});

// Login/Register Rate Limiter (Stricter limits for authentication routes)
export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit login/register to 10 attempts per IP
  keyGenerator: (req: any) => req.ip!,
  handler: (req: any, res: any) => {
    res.status(429).json({ error: "Too many login attempts, try again later." });
  },
  async requestWasSuccessful(req: any) {
    const ip = req.ip!;
    const currentRequests = await getRequestCount(ip);
    if (currentRequests < 10) {
      await updateRequestCount(ip);
      return true;
    }
    return false;
  },
});

// User-Specific Rate Limiter (For authenticated users)
export const userRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Limit each authenticated user to 500 requests per hour
  keyGenerator: (req: any) => req.user?.id || req.ip!, // Identify users by user ID if logged in, else IP
  handler: (req: any, res: any) => {
    res.status(429).json({ error: "You have reached your request limit." });
  },
  async requestWasSuccessful(req: any) {
    const userKey = req.user?.id || req.ip!;
    const currentRequests = await getRequestCount(userKey);
    if (currentRequests < 500) {
      await updateRequestCount(userKey);
      return true;
    }
    return false;
  },
});
