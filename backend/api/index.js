import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default serverless(app);
