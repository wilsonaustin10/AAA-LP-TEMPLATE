// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; firstAttempt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Maximum 5 attempts per window

export async function rateLimit(ip: string): Promise<{ success: boolean; retryAfter?: number }> {
  const now = Date.now();
  const userAttempts = attempts.get(ip);

  if (!userAttempts) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { success: true };
  }

  const timeSinceFirst = now - userAttempts.firstAttempt;

  if (timeSinceFirst > WINDOW_MS) {
    // Reset the window
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { success: true };
  }

  if (userAttempts.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - timeSinceFirst) / 1000);
    return { success: false, retryAfter };
  }

  userAttempts.count++;
  return { success: true };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  attempts.forEach((value, key) => {
    if (now - value.firstAttempt > WINDOW_MS) {
      attempts.delete(key);
    }
  });
}, WINDOW_MS);