const express = require("express");
const app = express();
const morgan = require("morgan");
const { Pool } = require("pg");
require("dotenv").config();

let pool = new Pool();

const port = process.env.PORT;

app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
    <form action="/info/get" method="GET">
        <input type="submit" value="GET">
    </form>
    <form action="/info/add" method="POST">
        <label for="add">ADD: </label>
        <input type="text" value="ADD" name="add" id="add">
        <input type="submit" value="ADD">
    </form>
    <form action="/info/delete" method="POST">
        <label for="delete">DELETE: </label>
        <input type="text"  name="delete" id="delete">
        <input type="submit" value="DELETE">
    </form>
    <form action="/info/update" method="POST">
        <label for="oldValue">oldValue: </label>
        <input type="text"  name="oldValue" id="oldValue">
        <label for="newValue">newValue: </label>
        <input type="text"  name="newValue" id="newValue">
        <input type="submit" value="UPDATE">
    </form>
    </body>
    </html>`);
})

app.get("/info/get", (req, res) => {
    try {
    pool.connect(async (error, client, realease) => {
        let resp = await client.query(`SELECT * FROM test`);
        realease();
        res.send(resp.rows);
    });
    } catch(error) {
        console.log(error);
    }
});

app.post("/info/add", (req, res) => {
    // res.send(req.body);
     try {
    pool.connect(async (error, client, realease) => {
        let resp = await client.query(`INSERT INTO test (name) VALUES ('${req.body.add}')`);
        res.redirect('/info/get');
    });
    } catch(error) {
        console.log(error);
    } 
});

app.post("/info/delete", (req, res) => {
    // res.send(req.body);
     try {
    pool.connect(async (error, client, realease) => {
        let resp = await client.query(`DELETE FROM test WHERE name = '${req.body.delete}'`);
        res.redirect('/info/get');
    });
    } catch(error) {
        console.log(error);
    } 
});

app.post("/info/update", (req, res) => {
    // res.send(req.body);
     try {
    pool.connect(async (error, client, realease) => {
        let resp = await client.query(`UPDATE test SET name = '${req.body.newValue}' WHERE name = '${req.body.oldValue}' `);
        res.redirect('/info/get');
    });
    } catch(error) {
        console.log(error);
    } 
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port} `);
})