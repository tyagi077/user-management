const { Client } = require("pg")

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'userManagement',
    user: 'postgres',
    password: 'root',
})

client.connect()
    .then(() => {
        console.log("POSTGRESQL Connected");
    })
    .catch(err => {
        console.log("DB error", err.message);
    })

module.exports = client;