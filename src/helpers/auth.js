export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Not Authorized.");
  res.redirect("/signin");
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.json({
        status: "error",
        message: "Necesitas estar autenticado",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.json({ status: "error", message: `No estas autorizado. Para acceder necesitas tener una cuenta: ${roles}` });
    }
    next();
  };
};
