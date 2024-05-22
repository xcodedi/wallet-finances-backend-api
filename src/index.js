const express = require("express");
const db = require("./db"); // Updated path
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/users");
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Categories router
app.use("/categories", categoriesRouter);

// users router
app.use("/users", usersRouter);

app.listen(port, async () => {
  try {
    await db.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
  console.log(`Example app listening on port ${port}`);
});
