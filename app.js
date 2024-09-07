const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// ตั้งค่าให้ Express ใช้โฟลเดอร์ file_img สำหรับไฟล์ static
app.use('/file_img', express.static(path.join(__dirname, 'file_img')));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'camp_page', 'camp_homepage.html'));
});


app.use(express.static(path.join(__dirname, 'camp_page'))); // ตั้งค่าเส้นทางของไฟล์ HTML

app.get('/camp_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'camp_page', 'camp_login.html')); // เส้นทางของไฟล์ HTML
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, {})
    .then(() => {
        console.log("Mongo Connected");
    })
    .catch((err) => console.error(err.message));

// config routes
const campRoute = require("./routes/camp");
app.use("/api", campRoute);

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

// Serve EJS view (comment this out if not using EJS)
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'camp_page'));

// Comment out this line if you are serving an HTML file
// app.get("/", (req, res) => {
//     res.render("camp_homepage"); // ใช้ไฟล์ homepage.ejs ที่อยู่ในโฟลเดอร์ camp_page
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
