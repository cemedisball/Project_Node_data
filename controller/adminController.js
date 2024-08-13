const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");
const Admin = require("../models/admin");

//Register
exports.register = async (req,res) => {
    const { user_name , password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ user_name, password: hashedPassword});
        await admin.save();
        res.status(201).send("User registered");
    }catch (err){
        res.status(400).send(err.message);
    }
};

//login
exports.login = async (req,res) =>{
    const {user_name ,password} = req.body;
    try{
    const admin = await Admin.findOne ({user_name});
    if(!admin) return res.status(400).send("User not found");
    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) return res.status(400).send("Invalid credentials");

    const accessToken = jwt.sign(
        { AdminId : admin._id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn :"5m"}
    );
    const refreshToken = jwt.sign(
        {AdminId: admin._id},
        process.env.REFRESH_TOKEN_SECRET,
    );
    res.json({accessToken, refreshToken});
    } catch (err){
        res.status(500).send(err.message);
    }
};

//refresh
exports.refresh = async (req,res) =>{
    const {token} = req.body;
    if(!token) return res.sendStatus(401);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {adminId : admin.adminId},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
            );
            res.json ({accessToken}); 
    });
};