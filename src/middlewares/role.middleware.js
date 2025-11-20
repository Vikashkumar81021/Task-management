const authorizeRoles = (...roles) => {
  return (req, res, next) => {
   console.log("user",req.user)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

export {
    authorizeRoles
};
