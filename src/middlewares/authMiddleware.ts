import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token!, process.env.SECRET_KEY!, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token! 1" });
      } else {
        if (typeof decoded != "object" || !decoded?.id) {
          return res.status(401).json({ error: "Access Denied!" });
        }
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    return res.status(403).json({ message: "Invalid token! 2" });
  }
}
