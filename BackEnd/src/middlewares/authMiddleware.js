import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const { verify } = jwt;
dotenv.config();

const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default { protect };
