export const validateBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No se proporciona body.",
      data: null,
    });
  }

  next();
};
