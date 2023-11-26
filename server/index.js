import express from "express";

const app = express();

app.get("/", async (req, res) => {
  res.send("Hello from Elite Estate");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080 http://localhost:8080");
});
