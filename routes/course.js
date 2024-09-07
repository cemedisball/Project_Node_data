const express = require('express');
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { upload } = require('../controller/courseController');

const { getHomepage } = require('../controller/courseController');
router.get('/', getHomepage);




const { getcourses, getcourse, createcourse ,updatecourse, deletecourse } = require ("../controller/courseController");


router.get("/courses",getcourses);
router.get("/course/:id",getcourse);

router.post("/course",upload, authenticateToken,createcourse);
router.put("/course/:id",upload, authenticateToken,updatecourse);
router.delete("/course/:id", authenticateToken,deletecourse);


module.exports = router;



