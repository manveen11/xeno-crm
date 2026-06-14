import { Redis } from 'ioredis'

// BullMQ requires a standard Redis TCP/TLS connection (rediss://)
// Note: If you only have the Upstash REST URL (https://...), you need to grab 
// the "Redis CLI" or "Node.js" connection string from the Upstash dashboard.
if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error("Missing UPSTASH_REDIS_URL in environment variables");
}

// Ensure the URL works with ioredis by parsing it or passing tls explicitly
const url = process.env.UPSTASH_REDIS_URL;

export const redis = new Redis(url, {
  maxRetriesPerRequest: null, // Required by BullMQ
  family: 0, // Prevent IPv6 DNS resolution issues with Upstash
  tls: { rejectUnauthorized: false } // Force TLS for Upstash
})
