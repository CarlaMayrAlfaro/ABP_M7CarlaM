const ADMIN_CREDENTIALS = {
  correo: "admin@admin.com",
  password: "admin123",
  nombre: "Administrador",
};

export const viewLogin = (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("login", {
    error: null,
  });
};

export const login = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.render("login", {
      error: "Por favor ingresa correo y contraseña.",
    });
  }

  if (
    correo === ADMIN_CREDENTIALS.correo &&
    password === ADMIN_CREDENTIALS.password
  ) {
    res.cookie("admin", "true", {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
    });

    return res.redirect("/");
  }

  res.render("login", {
    error: "Credenciales inválidas. Intenta nuevamente.",
  });
};

export const logout = (req, res) => {
  res.clearCookie("admin");
  res.redirect("/login");
};
