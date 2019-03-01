const express = require("express");
const cors = require("cors");
const got = require("got");
const sharp = require("sharp")

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    const thumbnailResizer = sharp()
        .resize(req.query.width ? parseInt(req.query.width) : null, req.query.height ? parseInt(req.query.height) : null)
        .rotate()
        .png();

    const imageStream = got.stream(req.query.url);
    imageStream.on("error", ()=>res.status(404).send("Image not found"))
    imageStream.pipe(thumbnailResizer).pipe(res)
});

app.listen(process.env.PORT || 3000, ()=> console.log("listening to requests"));
