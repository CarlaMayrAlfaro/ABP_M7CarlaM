export const parseSession = (req, res, next) => {
  req.session = {
    isAuthenticated: false,
  };

  const rawCookies = req.headers.cookie;
  if (!rawCookies) {
    return next();
  }

  const cookies = Object.fromEntries(
    rawCookies.split(";").map((cookie) => cookie.trim().split("=", 2)),
  );

  req.session.isAuthenticated = cookies.admin === "true";
  next();
};

export const authGuard = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }

  res.redirect("/login");
};

