const authorizeRoles = (...roles) => {
  return (req, res, next) => {
   console.log("user",req.user)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
console.log("user role",req.user.roles)
 
    const userRoles = req.user.roles || [];
    console.log(userRoles)
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
