import express from "express";

const app = express();
const port = 5555;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}! 🍄 `);
});
