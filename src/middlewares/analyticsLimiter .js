import rateLimit from "express-rate-limit";

const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this user, please try again later."
});

export{
    analyticsLimiter
}
