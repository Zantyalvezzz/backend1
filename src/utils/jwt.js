import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    cart: user.cart,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};
