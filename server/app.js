// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.enable("trust proxy");

app.post("/api/fetchStockData", (req, res) => {
  // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
  const data = req.body;
  const date = data.date;
  const symbol = data.symbol;
  const adjusted = data.adjusted;
  console.log("Received data:", date, symbol, adjusted);

  const apiKey = process.env.API_KEY;
  const apiUrl = `https://api.polygon.io/v1/open-close/${symbol}/${date}?adjusted=${adjusted}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  axios
    .get(apiUrl, { headers })
    .then((response) => {
      // console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch((error) => {
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message;

        if (statusCode === 403) {
          // if date is in future
          return res.status(403).json({ message: "Forbidden" });
        }

        res.status(statusCode).json({ message: errorMessage });
      } else {
        // other server related errors
        // console.error("Axios Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
