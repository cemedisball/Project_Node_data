const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, {
})
.then(() => {
    console.log("Mongo Connected");
    
})
.catch((err) => console.error(err.message));

//config routes
const courseRoute = require("./routes/course")
app.use("/api",courseRoute);

const authRoute = require ("./routes/auth");
app.use("/api/auth",authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

