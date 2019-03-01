const express = require("express");
const cors = require("cors");
const got = require("got");
const sharp = require("sharp")
const fs = require("fs")
const sanitize = require("sanitize-filename");


const app = express();
app.use(cors());

app.get("/", (req, res) => {
    if (!req.query.url) {
        res.send("you should pass a url parameter")
    }
    const filename = "./cache/" + sanitize(req.query.url) + "-" +req.query.width + "-" + req.query.height

    const thumbnailResizer = sharp()
        .resize(req.query.width ? parseInt(req.query.width) : null, req.query.height ? parseInt(req.query.height) : null)
        .rotate()
        .png();
    
    if (fs.existsSync(filename)) {
        fs.createReadStream(filename).pipe(res)
    } else {

        const imageStream = got.stream(req.query.url);
        imageStream.on("error", () => res.status(404).send("Image not found"))

        const convertedImageStream = imageStream.pipe(thumbnailResizer)
        convertedImageStream.pipe(res)
        convertedImageStream.pipe(fs.createWriteStream(filename))
        
    }
});

app.listen(process.env.PORT || 3000, ()=> console.log("listening to requests"));
