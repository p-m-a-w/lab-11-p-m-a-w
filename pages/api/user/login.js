import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = JSON.parse(req.body);

    if (typeof username !== 'string' || typeof password !== 'string' || username.length === 0 || password.length === 0)
      return res.status(400).json({ ok: false, message: 'Username or password cannot be empty' })

    const users = readUsersDB();

    const foundUser = users.find(user => user.username === username && bcrypt.compareSync(password, user.password))
    if (foundUser == null)
      return res.status(400).json({ ok: false, message: 'Invalid Username or Password' })

    const secret = process.env.JWT_SECRET;

    //sign token
    const token = jwt.sign({
      username,
      isAdmin: foundUser.isAdmin
    }, secret);

    //return response
    return res.json({
      ok: true,
      username,
      isAdmin: foundUser.isAdmin,
      token,
    });
  }
}
