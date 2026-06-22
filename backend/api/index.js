import express from "express";

const app = express();

app.get("/api/", (req, res) => {
  res.send("EXPRESS WORKS");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

export default (req, res) => {
  app(req, res);
};
