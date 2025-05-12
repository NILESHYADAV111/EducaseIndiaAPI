const express = require("express");
const app = express();
const db = require("./db");
require('dotenv').config()
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/addSchool',(req,res)=>{
    const {name, address, latitude, longitude} = req.body;
    
    if(!name || !address || !latitude || !longitude){
        return res.status(400).json({message:"All fields are required"});
    };

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if(isNaN(lat) || isNaN(lon)){
        return res.status(400).json({message:"Latitude and Longitude must be valid numbers"});
    }

    if(lat < -90 || lat > 90){
        return res.status(400).json({message:"Latiitude must be between -90 and 90"});
    }

    if(lon < -180 && lon > 180){
        return res.status(400).json({message:"Longitude must be between -180 and 180"});
    }

    const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, address, latitude, longitude], (err,result)=>{
        if(err){
            return res.status(500).json({message:"DB Error"});
        }
        res.status(201).json({message:'School addes successfully',id:result.insertId});
    }); 
});



app.get("/listSchools",(req,res)=>{
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);
    
    if(isNaN(userLat) || isNaN(userLon)){
        return res.status(400).json({message:"Latitude and Longitude are required and must be numbers"});
    }

    const sql = `SELECT *,
    (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) As distance
     FROM schools ORDER BY distance ASC`;

     db.query(sql,[userLat, userLon, userLat], (err,result)=>{
        if(err) return res.status(500).json({message:"DB Error"});

        if(result.length === 0){
            return res.status(400).json({message:"No School found near your location"});
        }

        res.json(result);
     });
});

app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`);
})