import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    //validate body

    const users = readUsersDB();

    //find users with username, password

    const secret = process.env.JWT_SECRET;

    //sign token

    //return response
  }
}
