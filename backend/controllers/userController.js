import { registerNewUser, authenticateUser } from "../services/userService.js";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const user = await registerNewUser(req.body);
    res.status(201).json({ message: "User registered", id: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const data = await authenticateUser(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};