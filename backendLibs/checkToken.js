import jwt from "jsonwebtoken";

//warning : this is just a function not a route!
//return {username: "...", isAdmin : ...} or null
export function checkToken(req) {
  if (typeof req.headers.authorization !== "string") return null;
  const splited = req.headers.authorization.split(" ");
  const token = splited[1];
  const secret = process.env.JWT_SECRET;

  try {
    const result = jwt.verify(token, secret);
    return {
      username: result.username,
      isAdmin: result.isAdmin,
    };
  } catch (e) {
    return null;
  }
}
