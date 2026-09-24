import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../data/users.json" with { type: "json" };

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const payload = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return res.status(200).json({ token });
});

export default router;