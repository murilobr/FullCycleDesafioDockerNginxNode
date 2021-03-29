const express = require("express");
const app = express();
const port = 3000;
const config = {
  host: process.env.DB_HOST,
  user: "root",
  password: "root",
  database: "nodedb",
};
const mysql = require("mysql2");
const connection = mysql.createConnection(config);
const faker = require("faker");
faker.locale = "pt_BR";

function createName() {
  const nomeAleatorio = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const sql = `INSERT INTO people (name) values ('${nomeAleatorio}')`;
  connection.query(sql);
}

function getPeople() {
  return new Promise((resolve, reject) => {
    const sql = `select * from people`;
    connection.query(sql, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

app.get("/", async (req, res) => {
  createName();

  const result = await getPeople();
  let peopleList = result
    .map((person) => {
      return `<li>${person.id}: ${person.name}</li>`;
    })
    .join("");

  const people = `<ul>${peopleList}</ul>`;
  const html = `<h1>Full Cycle Rocks!</h1>${people}`;

  res.send(html);
});

app.listen(port, () => {
  connection.query(`CREATE TABLE IF NOT EXISTS people (
    id int AUTO_INCREMENT,
    name varchar(255) not null,
    PRIMARY KEY (id)
  )`);

  console.log(`Rodando na porta ${port}`);
});
