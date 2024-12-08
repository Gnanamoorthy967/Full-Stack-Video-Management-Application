require("dotenv").config();
const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs");
const { log } = require("console");
const vedioRoutes = require("./routes/video");





const app = express()
const PORT = process.env.PORT || 5000


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve vedios directly
app.use("/vedios",express.static(path.join(__dirname, process.env.VIDEO_DIR)));

//api routes
app.use("/api", vedioRoutes);

//vedio directory creation or exits
const vedioDir = path.join(__dirname, process.env.VIDEO_DIR);
if (!fs.existsSync(vedioDir)) {
    fs.mkdirSync(vedioDir);{
        console.log("vedio directory created");
    }
}
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});