// const express = require("express");
// const mysql = require("mysql2");
// const path = require("path");

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("Frontend"));

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "votinguser",
//     password: "Voting@123",
//     database: "votingdb"
// });

// db.connect((err) => {
//     if (err) {
//         console.log("Database Connection Failed");
//         console.log(err);
//     } else {
//         console.log("MySQL Connected");
//     }
// });

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "Frontend", "index.html"));
// });

// app.post("/vote", (req, res) => {

//     const voterName = req.body.voterName;
//     const age = Number(req.body.age);
//     const candidate = req.body.candidate;

//     if (age < 18) {
//         return res.send(`
//         <h1>Voting Not Allowed</h1>
//         <h3>${voterName}, you are not eligible to vote.</h3>
//         <p>Minimum age required is 18 years.</p>
//         <a href="/">Go Back</a>
//         `);
//     }

//     const sql =
//         "INSERT INTO votes(voter_name, age, candidate) VALUES (?, ?, ?)";

//     db.query(
//         sql,
//         [voterName, age, candidate],
//         (err) => {

//             if (err) {
//                 return res.send(`
//                 <h1>You Already Voted!</h1>
//                 <a href="/">Go Back</a>
//                 `);
//             }

//             res.send(`
//             <h1>Vote Submitted Successfully</h1>

//             <p><strong>Name:</strong> ${voterName}</p>
//             <p><strong>Age:</strong> ${age}</p>
//             <p><strong>Candidate:</strong> ${candidate}</p>

//             <br>

//             <a href="/results">
//                 View Results
//             </a>
//             `);
//         }
//     );
// });

// app.get("/results", (req, res) => {

//     const sql = `
//     SELECT
//         candidate,
//         COUNT(*) AS total_votes
//     FROM votes
//     GROUP BY candidate
//     ORDER BY total_votes DESC
//     `;

//     db.query(sql, (err, results) => {

//         if (err) {
//             return res.send("Error Fetching Results");
//         }

//         let html = `
//         <html>
//         <head>
//         <title>Voting Results</title>
//         <link rel="stylesheet" href="/style.css">
//         </head>
//         <body>

//         <div class="container">

//         <h1>Voting Results</h1>

//         <table>
//         <tr>
//             <th>Candidate</th>
//             <th>Total Votes</th>
//         </tr>
//         `;

//         results.forEach(row => {
//             html += `
//             <tr>
//                 <td>${row.candidate}</td>
//                 <td>${row.total_votes}</td>
//             </tr>
//             `;
//         });

//         html += `
//         </table>

//         <br>

//         <a href="/">Back To Voting</a>

//         </div>

//         </body>
//         </html>
//         `;

//         res.send(html);
//     });
// });

// app.listen(3000, () => {
//     console.log("Server Running on Port 3000");
// });

// Part2
// const express = require("express");
// const mysql = require("mysql2");
// const path = require("path");

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("Frontend"));

// const db = mysql.createConnection({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "votinguser",
//     password: process.env.DB_PASSWORD || "Voting@123",
//     database: "votingdb"
// });

// db.connect((err) => {

//     if (err) {
//         console.log("Database Connection Failed");
//         console.log(err);
//         return;
//     }

//     console.log("MySQL Connected");

//     db.query(
//         "CREATE DATABASE IF NOT EXISTS votingdb",
//         (err) => {

//             if (err) {
//                 console.log("Database Creation Failed");
//                 console.log(err);
//                 return;
//             }

//             console.log("Database Ready");

//             db.query("USE votingdb", (err) => {

//                 if (err) {
//                     console.log("Database Selection Failed");
//                     console.log(err);
//                     return;
//                 }

//                 const createTableQuery = `
//                 CREATE TABLE IF NOT EXISTS votes (
//                     id INT AUTO_INCREMENT PRIMARY KEY,
//                     voter_name VARCHAR(100) UNIQUE,
//                     age INT NOT NULL,
//                     candidate VARCHAR(100) NOT NULL
//                 )
//                 `;

//                 db.query(createTableQuery, (err) => {

//                     if (err) {
//                         console.log("Table Creation Failed");
//                         console.log(err);
//                         return;
//                     }

//                     console.log("Votes Table Ready");
//                 });
//             });
//         }
//     );
// });

const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("Frontend"));


const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "votinguser",
    password: process.env.DB_PASSWORD || "Voting@123"
});

function connectDB() {

    db.connect((err) => {

        if (err) {
            console.log("Database Connection Failed");
            console.log(err);

            console.log("Retrying in 5 seconds...");
            setTimeout(connectDB, 5000);

            return;
        }

        console.log("MySQL Connected");

        db.query(
            "CREATE DATABASE IF NOT EXISTS votingdb",
            (err) => {

                if (err) {
                    console.log("Database Creation Failed");
                    console.log(err);
                    return;
                }

                console.log("Database Ready");

                db.query("USE votingdb", (err) => {

                    if (err) {
                        console.log("Database Selection Failed");
                        console.log(err);
                        return;
                    }

                    const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS votes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        voter_name VARCHAR(100) UNIQUE,
                        age INT NOT NULL,
                        candidate VARCHAR(100) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    `;

                    db.query(createTableQuery, (err) => {

                        if (err) {
                            console.log("Table Creation Failed");
                            console.log(err);
                            return;
                        }

                        console.log("Votes Table Ready");
                    });
                });
            }
        );
    });
}

connectDB();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "index.html"));
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

        <table border="1" cellpadding="10">
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

app.listen(3000, "0.0.0.0", () => {
    console.log("Server Running on Port 3000");
});
