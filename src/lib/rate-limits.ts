// Simple in-memory rate limiter for Next.js API routes
interface RateLimitEntry {
    count: number;
    resetTime: number;
  }
  
  const store: Map<string, RateLimitEntry> = new Map();
  
  export interface RateLimitOptions {
    windowMs?: number; // Time window in milliseconds
    maxRequests?: number; // Maximum requests per window
  }
  
  export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }
  
  export function rateLimit(options: RateLimitOptions = {}) {
    const windowMs = options.windowMs || 60000; // Default: 1 minute
    const maxRequests = options.maxRequests || 30; // Default: 30 requests per minute
  
    return {
      check: (identifier: string): RateLimitResult => {
        const now = Date.now();
        const key = identifier;
  
        // Get or create entry
        let entry = store.get(key);
  
        // Reset if window has expired
        if (!entry || now >= entry.resetTime) {
          entry = {
            count: 0,
            resetTime: now + windowMs
          };
          store.set(key, entry);
        }
  
        // Check if limit exceeded
        if (entry.count >= maxRequests) {
          return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime,
            retryAfter: Math.ceil((entry.resetTime - now) / 1000)
          };
        }
  
        // Increment counter
        entry.count++;
        store.set(key, entry);
  
        return {
          success: true,
          remaining: maxRequests - entry.count,
          resetTime: entry.resetTime
        };
      },
  
      // Helper method to get current status without incrementing
      status: (identifier: string): RateLimitResult => {
        const now = Date.now();
        const entry = store.get(identifier);
  
        if (!entry || now >= entry.resetTime) {
          return {
            success: true,
            remaining: maxRequests,
            resetTime: now + windowMs
          };
        }
  
        const isLimited = entry.count >= maxRequests;
        return {
          success: !isLimited,
          remaining: Math.max(0, maxRequests - entry.count),
          resetTime: entry.resetTime,
          retryAfter: isLimited ? Math.ceil((entry.resetTime - now) / 1000) : undefined
        };
      }
    };
  }
  
  // Helper function to get client IP from request
  export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    // Fallback for development
    return 'unknown';
  }
  
  // Pre-configured rate limiters for common use cases
  export const chatRateLimit = rateLimit({
    windowMs: 60000, // 1 minute
    maxRequests: 30   // 30 messages per minute
  });
  
  export const apiRateLimit = rateLimit({
    windowMs: 60000, // 1 minute  
    maxRequests: 100  // 100 requests per minute
  });
  
  // Cleanup function to remove expired entries (call periodically)
  export function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now >= entry.resetTime) {
        store.delete(key);
      }
    }
  }
  
  // Auto-cleanup every 5 minutes
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);