const express = require('express');
const router = express.Router();
const authenticateToken = require("../middlewares/auth");


const { getCamps, getCamp, createCamp ,updateCamp, deleteCamp } = require ("../controller/campController");

router.get("/camps",authenticateToken,getCamps);
router.get("/camp/:id", authenticateToken,getCamp);
router.post("/camp", authenticateToken,createCamp);
router.put("/camp/:id", authenticateToken,updateCamp);
router.delete("/camp/:id", authenticateToken,deleteCamp);


module.exports = router;



