const Camp = require('../models/camp');
const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");
const multer = require('multer');
const path = require('path');

//upload img
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, '../file_img'); // เปลี่ยนเป็นโฟลเดอร์ที่ต้องการเก็บไฟล์
        console.log("Saving to directory: ", dirPath); // ตรวจสอบว่าที่เก็บไฟล์ถูกต้อง
        cb(null, dirPath); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์ภาพ
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        console.log("Uploading file as: ", fileName); // ตรวจสอบชื่อไฟล์
        cb(null, fileName); // ตั้งชื่อไฟล์ตามเวลาและชื่อไฟล์ต้นฉบับ
    }
});


// กำหนดการอัปโหลดโดยใช้ multer
const upload = multer({ storage: storage });

// Get all camps
exports.getCamps = async (req, res) => { 
    try { 
        const camps = await Camp.find(); 
        res.status(200).json(camps); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
}; 

// Get a specific camp by ID
exports.getCamp = async (req, res) => {
    try { 
        const { id } = req.params;
        const camp = await Camp.findById(id);
        if (!camp) return res.status(404).json({ message: 'camp name not found' }); 
        res.json(camp); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};
    
// Create a new camp
exports.createCamp = async (req, res) => {
    const { camp_name, camp_detail, camp_place, camp_topic, date, time } = req.body;

    console.log("Uploaded file: ", req.file); // ตรวจสอบข้อมูลไฟล์ที่ถูกอัปโหลด

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path; // ถ้ามีไฟล์ภาพ ให้เก็บเส้นทางของภาพ
        console.log("Image Path: ", imagePath); // ตรวจสอบเส้นทางไฟล์
    }

    const camp = new Camp({
        camp_name,
        camp_detail,
        camp_place,
        camp_topic,
        date,
        time,
        image: imagePath // บันทึกเส้นทางภาพในฐานข้อมูล
    });

    try { 
        const newCamp = await camp.save();
        res.status(201).json(newCamp); 
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};


// Update a camp by ID
exports.updateCamp = async (req, res) => {
    try {
        const { id } = req.params;

        let imagePath = req.body.image; // ใช้เส้นทางภาพเดิมหากไม่มีการอัปโหลดใหม่
        if (req.file) {
            imagePath = req.file.path; // ถ้ามีการอัปโหลดใหม่ ให้ใช้ภาพใหม่
        }

        const updatedCamp = await Camp.findByIdAndUpdate(id, {
            ...req.body,
            image: imagePath
        }, { new: true });

        if (!updatedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json(updatedCamp);
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// Delete a camp by ID
exports.deleteCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCamp = await Camp.findByIdAndDelete(id);
        if (!deletedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json({ message: 'Camp deleted successfully' });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};
// Export the Multer upload middleware

//getHomepage
exports.getHomepage = async (req, res) => {
    try {
        const camps = await Camp.find(); // ดึงข้อมูลค่ายทั้งหมดจากฐานข้อมูล
        res.render("camp_homepage", { camps }); // ส่งข้อมูลค่ายไปยัง view
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.upload = upload.single('image'); // ใช้กับการอัปโหลดไฟล์เดี่ยว