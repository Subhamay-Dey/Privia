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