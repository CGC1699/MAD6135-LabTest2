const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('labtest.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});



// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
    <title>WareHouse Tracking System.</title>
    <style>
      body {
        background: rgb(185, 235, 205);
      }
      h1 {
          text-align: center;
          margin-top: 20px;
      }
      form {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        margin-top: 30px;
        border-width: 8px;
        border-radius: 6px;
      }

      input[type="text"] {
        width: 250px;
        height: 46px;
        text-align:center;
        font-size: 20px;
        margin-bottom: 20px;
        padding-left: 20px;
        border-width: 8px;
        border-radius: 6px;
      }

      button[type="submit"] {
        width: 150px;
        height: 30px;
        font-size: 20px;
        background-color: rgba(16, 196, 88);
        border-width: 1px;
        border-radius: 7px;
        border-color: rgb(178, 178, 178);
        cursor: pointer;
      }

      #output {
        margin-top: 50px;
        font-size: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>

    <h1>Welcome To WareHouse Package Tracking</h1>
    <form action="/search" method="post">
    <input type="text" name="partNumber" placeholder="Enter Part Number">
    <button type="submit">Search</button>
    </form>
    <div id="output"></div>
  </body>
</html>
  `);
});

// Handle the form submission
app.post('/search', (req, res) => {
  const partNumber = req.body.partNumber;
  const query = `
    SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
    FROM PartNumber
    JOIN Bin ON PartNumber.BinID = Bin.BinID
    JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
    WHERE PartNumber.PartNumber = ?
  `;
  db.get(query, [partNumber], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.send(`
    <html>
    <head>
      <title>WareHouse Tracking System.</title>
      <style>
        body {
          background: rgb(185, 235, 205);
          text-align: center;
        }
        h1 {
            text-align: center;
            margin-top: 30px;
        }
        #data{
            text-align: center;
        }
        p{
            margin-top: 30px;
            font-size: 18px;
            font-family: Tahoma;

        }
        </style>
        </head>
        <body>
        <h1> Package Details </h1>
        <div id="data">
      <p>Shelf Number: ${row.ShelfLocation} <br>
      Bin Number: ${row.BinID} <br>
      Count: ${row['COUNT(PartNumber.PartNumberID)']}</p>
      </div>
        </body>
      </html>
    `);
    
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Connection Succesfull at http://localhost:${port}`);
});