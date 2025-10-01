const mysql = require('mysql2');
const dbConnection = require('./connection');
const { faker } = require('@faker-js/faker')

const connection = dbConnection()

let queries = "";

// ---------- USERS ----------
const userCount = 20;
let users = [];

for (let i = 1; i <= userCount; i++) {
  const prenom = faker.person.firstName();
  const nom = faker.person.lastName();
  const email = faker.internet.email({ firstName: prenom, lastName: nom });
  const password = faker.internet.password();

  queries += `INSERT INTO User (prenom, nom, email, password) VALUES ('${prenom}', '${nom}', '${email}', '${password}');`


  users.push(i); // stocker les IDs
}

// ---------- SELECTIONNEURS ----------
let selectionneurs = [];
for (let i = 1; i <= 3; i++) {
  const userId = users.pop(); // prendre un user

  queries += `INSERT INTO Selectionneurs (User_id) VALUES (${userId});`
  selectionneurs.push(userId);
}

// ---------- ORGANISATEURS ----------
let organisateurs = [];
for (let i = 1; i <= 2; i++) {
  const userId = users.pop();
  queries+= `INSERT INTO Organisateurs (User_id) VALUES (${userId});`
  organisateurs.push(userId);
}

// ---------- JOUEURS ----------
let joueurs = [];
for (let i = 1; i <= 10; i++) {
  const userId = users.pop();
  queries+= `INSERT INTO Joueurs (User_id) VALUES (${userId});`
  joueurs.push(userId);
}

// ---------- EQUIPES ----------
let equipes = [];
for (let i = 1; i <= 2; i++) {
  const nomEquipe = faker.company.name();
  const selId = selectionneurs[i - 1]; // un sélectionneur
  queries += `INSERT INTO Equipes (nom, Selectionneurs_id) VALUES ('${nomEquipe}', ${selId});`
  equipes.push(i);
}

connection.query(queries , [] , (err, results ,fields)=>{
    if(err) return console.log(err.message)
})
