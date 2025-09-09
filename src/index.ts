import express from "express";
import db from "./db/index.js";
import authRouter from "./routes/auth/route.js";
import { verifyToken } from "./middlewares/authMiddleware.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth", authRouter);

app.get("/", verifyToken, (req, res) => {
  res.json({ message: "Verified!", user: req.userId });
});

app.listen(port, async () => {
  console.log(`Listening to ${port}`);
});
