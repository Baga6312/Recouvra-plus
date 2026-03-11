const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé, rôle requis : ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authorize };