const express = require('express');
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { upload } = require('../controller/campController'); // import multer upload middleware
//Homepage
const { getHomepage } = require('../controller/campController');
router.get('/', getHomepage);

//backend
const { getCamps, getCamp, createCamp, updateCamp, deleteCamp } = require("../controller/campController");
router.get("/camps", getCamps);
router.get("/camp/:id", getCamp);

// เพิ่ม middleware upload สำหรับการอัปโหลดไฟล์ภาพใน post และ put routes
router.post("/camp",  upload, authenticateToken,createCamp);
router.put("/camp/:id" , upload, authenticateToken,updateCamp);

router.delete("/camp/:id", authenticateToken, deleteCamp);

module.exports = router;
