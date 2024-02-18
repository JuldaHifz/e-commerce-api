export const validateAddToCart = (req, res, next) => {
  const { product_id, quantity } = req.body;

  if (!req.user) {
    return res.status(422).json({ error: "Req.user is required" });
  }

  if (!product_id) {
    return res.status(422).json({ error: "Product ID is required" });
  }

  if (!quantity) {
    return res.status(422).json({ error: "Quantity is required" });
  }

  next();
};

export const validateTokenRequest = (req, res, next) => {
  const errors = {};

  if (!req.body.email) {
    errors.email = "Email is required";
  }

  if (!req.body.password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  }

  next();
};
