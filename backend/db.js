require('dotenv').config()
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

connection.connect((err)=>{
    if(err){
        console.log("MySQL connection Error",err);
        
    }else{
        console.log("Connected to MySQL Databse!");
    }
});

module.exports = connection;

