import rateLimit from "express-rate-limit";

export const taskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,                 
  message: {
    success: false,
    message: "Too many requests from this user, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
