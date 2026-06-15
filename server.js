const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123", // Change as per your DB password
    database: "votingdb"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/vote", (req, res) => {

    const voterName = req.body.voterName;
    const age = Number(req.body.age);
    const candidate = req.body.candidate;

    if (age < 18) {
        return res.send(`
        <h1>Voting Not Allowed</h1>
        <h3>${voterName}, you are not eligible to vote.</h3>
        <p>Minimum age required is 18 years.</p>
        <a href="/">Go Back</a>
        `);
    }

    const sql =
        "INSERT INTO votes(voter_name, age, candidate) VALUES (?, ?, ?)";

    db.query(
        sql,
        [voterName, age, candidate],
        (err) => {

            if (err) {
                return res.send(`
                <h1>You Already Voted!</h1>
                <a href="/">Go Back</a>
                `);
            }

            res.send(`
            <h1>Vote Submitted Successfully</h1>

            <p><strong>Name:</strong> ${voterName}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Candidate:</strong> ${candidate}</p>

            <br>

            <a href="/results">
                View Results
            </a>
            `);
        }
    );
});

app.get("/results", (req, res) => {

    const sql = `
    SELECT
        candidate,
        COUNT(*) AS total_votes
    FROM votes
    GROUP BY candidate
    ORDER BY total_votes DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.send("Error Fetching Results");
        }

        let html = `
        <html>
        <head>
        <title>Voting Results</title>
        <link rel="stylesheet" href="/style.css">
        </head>
        <body>

        <div class="container">

        <h1>Voting Results</h1>

        <table>
        <tr>
            <th>Candidate</th>
            <th>Total Votes</th>
        </tr>
        `;

        results.forEach(row => {
            html += `
            <tr>
                <td>${row.candidate}</td>
                <td>${row.total_votes}</td>
            </tr>
            `;
        });

        html += `
        </table>

        <br>

        <a href="/">Back To Voting</a>

        </div>

        </body>
        </html>
        `;

        res.send(html);
    });
});

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});