const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const secretKey = "secretKey";

const sql = require("mssql");
const { get } = require("http");
const getConnection = require("../connection/config");

app.get("/users", async (req, res) => {
  try {
    // Check if token is valid
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey); // Verify the token synchronously

    // Get user from database
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM [dbo].[user]");
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

app.post("/signup", async (req, res) => {
  try {
    const { pharmacyName, username, password } = req.body;
    console.log(req.body);
    const request = new sql.Request();

    // Check if username exists
    let result = await request
      .input("username", sql.VarChar, username)
      .query(`SELECT * FROM [dbo].[Pharmacies] WHERE username = @username`);
    if (result.recordset.length > 0) {
      return res.status(400).send("Username is already taken");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await request.query(
      `INSERT INTO [dbo].[pharmacies] (pharmacyName,username, password) 
      VALUES ('${pharmacyName}', '${username}', '${hashedPassword}')`
    );

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);

    const result = await request.query(
      `SELECT * FROM [dbo].[user] WHERE username = @username`
    );
    if (result.recordset.length === 0) {
      return res.status(400).send("Username or password is incorrect");
    }

    // Compare hashed password
    const validPassword = await bcrypt.compare(
      password,
      result.recordset[0].password
    );
    if (!validPassword) {
      return res.status(400).send("Username or password is incorrect");
    }

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    // Send the token as a response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//get all pharmacies
app.get("/pharmacies", async (req, res) => {
  try {
    // Check if token is valid
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey); // Verify the token synchronously

    // Get user from database
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM [dbo].[pharmacies]");
    console.log(result);
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
