const express = require("express");
const app = express();
const cors = require("cors");
const authenticationRouter = require("./routes/auth");
const prescriptionRouter = require("./routes/prescription");
const getConnection = require("./connection/config");
const PORT = 3001;

let pool = null;
console.log(pool);

async function dbConnectionMiddleware(req, res, next) {
  try {
    if (pool == null) {
      console.log("Connecting to the Azure SQL database SERVERJS");
      pool = await getConnection();
      console.log("Database connected!");
    }
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).send("Internal Server Error");
  }
}

app.get("/", async (req, res) => {
  res.status(200).send("API Server is running!");
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(dbConnectionMiddleware);
app.use("/auth", authenticationRouter);
app.use("/prescription", prescriptionRouter);

if (process.env.VERCEL == "1") {
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
