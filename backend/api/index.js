import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("EXPRESS WORKS");
});

export default (req, res) => {
  app(req, res);
};
