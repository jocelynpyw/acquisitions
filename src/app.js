import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello from acquisition API!");
});

export default app;
