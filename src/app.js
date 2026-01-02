const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectRequest");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.use("/user", userRouter);

app.use("/profile", profileRouter);

app.use("/request", connectionRequestRouter)

connectDB()
  .then(() => {
    console.log("DataBase Connected successfullly");
    app.listen(PORT, () => {
      console.log("Server is successfully listening on", { PORT });
    });
  })
  .catch((err) => {
    console.log("DB Connection failed " + err);
  });
