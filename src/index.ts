import express from "express";
import db from "./db/index.js";
import authRouter from "./routes/auth/route.js";

const app = express();
const port = 3000;

app.use("/auth", authRouter);

app.listen(port, async () => {
  console.log(`Listening to ${port}`);
  const allUsers = await db.users.findMany();
  console.log(allUsers);
});
