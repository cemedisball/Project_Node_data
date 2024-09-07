const course = require('../models/course');
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


//Get all
exports.getcourses = async (req, res) => { 
    try { 
        const courses = await course.find(); 
        res.status(200).json(courses); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
}; 

// Get a specific course by ID
exports.getcourse = async (req, res) => {
    try { 
        const { id } = req.params;
        const course = await course.findById(id);
        if (!course) return res.status(404).json({ message: 'course name not found' }); 
        res.json(course); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};
    
// Create a new course
exports.createcourse = async (req, res) => {
    const { course_name, course_detail, course_place,date,time } = req.body;
    console.log("Uploaded file: ", req.file); // ตรวจสอบข้อมูลไฟล์ที่ถูกอัปโหลด

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path; // ถ้ามีไฟล์ภาพ ให้เก็บเส้นทางของภาพ
        console.log("Image Path: ", imagePath); // ตรวจสอบเส้นทางไฟล์
    }

    const course = new course({
        course_name,
        course_detail,
        course_place,   
        date,
        time,
        image: imagePath // บันทึกเส้นทางภาพในฐานข้อมูล
    });

    try { 
        const newcourse = await course.save();
        res.status(201).json(newcourse); 
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// Update a course by ID
exports.updatecourse = async (req, res) => {
    try {
        const { id } = req.params;

        let imagePath = req.body.image; // ใช้เส้นทางภาพเดิมหากไม่มีการอัปโหลดใหม่
        if (req.file) {
            imagePath = req.file.path; // ถ้ามีการอัปโหลดใหม่ ให้ใช้ภาพใหม่
        }

        const updatedcourse = await course.findByIdAndUpdate(id, 
            {...req.body,
                image: imagePath
            } , { new: true });

        if (!updatedcourse) return res.status(404).json({ message: 'course not found' });
        res.status(200).json(updatedcourse);
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// Delete a course by ID
exports.deletecourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedcourse = await course.findByIdAndDelete(id);
        if (!deletedcourse) return res.status(404).json({ message: 'course not found' });
        res.status(200).json({ message: 'course deleted successfully' });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};



//getHomepage
exports.getHomepage = async (req, res) => {
    try {
        const courses = await course.find(); // ดึงข้อมูลค่ายทั้งหมดจากฐานข้อมูล
        res.render("course_homepage", { courses }); // ส่งข้อมูลค่ายไปยัง view
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.upload = upload.single('image'); // ใช้กับการอัปโหลดไฟล์เดี่ยว