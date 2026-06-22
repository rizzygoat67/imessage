import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("EXPRESS WORKS");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default (req, res) => {
  app(req, res);
};
