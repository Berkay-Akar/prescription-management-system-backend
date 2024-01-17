const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const secretKey = "secretKey";

const sql = require("mssql");
const { get } = require("http");

app.get("/getPrescriptions", async (req, res) => {
  try {
    // Get user from database
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM [dbo].[prescription]");
    console.log(result.recordset);
    res.send(result.recordset); // Send the result
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/createPrescriptions", async (req, res) => {
  try {
    // Get user from database
    const request = new sql.Request();
    const result = await request.query(
      "INSERT INTO [dbo].[prescription] (id, name, description, price) VALUES ('" +
        req.body.id +
        "', '" +
        req.body.name +
        "', '" +
        req.body.description +
        "', '" +
        req.body.price +
        "')"
    );
    console.log(result.recordset);
    res.send(result.recordset); // Send the result
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

//get medicines
app.get("/getMedicines", async (req, res) => {
  try {
    // Get user from database
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM [dbo].[medicines]");
    console.log(result.recordset);
    res.send(result.recordset); // Send the result
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

//search medicines
app.get("/searchMedicines", async (req, res) => {
  try {
    // Get user from database
    const request = new sql.Request();
    const result = await request.query(
      "SELECT * FROM [dbo].[medicines] WHERE LOWER(MedicineName) LIKE LOWER('%" +
        req.query.name +
        "%')"
    );
    console.log("RESULT", result);
    console.log(result.recordset);
    res.send(result.recordset); // Send the result
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

//add medicines to cart
app.post("/addMedicinesToCart", async (req, res) => {
  try {
    // Get user from database
    const request = new sql.Request();
    const result = await request.query(
      "INSERT INTO [dbo].[cart] (id, medicineName, price) VALUES ('" +
        req.body.id +
        "', '" +
        req.body.medicineName +
        "', '" +
        req.body.price +
        "')"
    );
    console.log(result.recordset);
    res.send(result.recordset); // Send the result
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = app;
