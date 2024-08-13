const jwt = require("jsonwebtoken");

const dotenv = require('dotenv');
dotenv.config();

function authenicateToken(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,admin)=>{
        if(err) return res.sendStatus(403).send("Accesss token expired");
        req.admin = admin;
        next();
    });
}
module.exports = authenicateToken;