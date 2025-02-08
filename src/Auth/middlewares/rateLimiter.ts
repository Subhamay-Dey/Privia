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
