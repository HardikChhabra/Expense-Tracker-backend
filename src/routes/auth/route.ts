import { Router } from "express";
import {
  LoginUserSchema,
  RegisterUserSchema,
} from "../../db/validationSchema.js";
import validateData from "../../middlewares/validationMiddleware.js";
import db from "../../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = Router();

//login
router.post("/login", validateData(LoginUserSchema), async (req, res) => {
  try {
    //Extract email and password from the req body
    const { email, password } = req.cleanBody;

    //Find user with the same email from the db
    const user = await db.users.findUnique({
      where: {
        id: email,
      },
    });

    //If the user does'nt exist, return
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials! 1" });
    }

    //Match the user's password to the req
    const passwordMatch = await bcrypt.compare(password, user.password);

    //if passwords match, create and return a payload
    if (passwordMatch) {
      const payload = { id: user.id, name: user.name };
      const token = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: "30d",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid Credentials! 2" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//register
router.post("/register", validateData(RegisterUserSchema), async (req, res) => {
  try {
    //Extract user data from the request
    const userData = req.cleanBody;

    //Hash the password
    userData.password = await bcrypt.hash(userData.password, 10);

    //Try to create the user
    try {
      const user = await db.users.create({
        data: {
          id: userData.email,
          name: userData.name,
          password: userData.password,
        },
      });

      //user created in db, create and send the payload
      const payload = { id: user.id, name: user.name };
      const token = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: "30d",
      });
      res.json({ token });
    } catch (error) {
      console.error("Error creating user: ", error);
      res.status(403).json({ message: "User may already exist", error: error });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
