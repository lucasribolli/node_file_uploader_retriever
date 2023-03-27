const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const PORT = process.env.PORT || 3500;

const app = express();

const LOCAL_IMAGES_FOLDER = 'files';

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, LOCAL_IMAGES_FOLDER, files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)

app.get('/image', (req, res) => {
    var fileName = req.query.name;
    console.log("file name to return: " + fileName);
    return res.sendFile(path.join(__dirname, LOCAL_IMAGES_FOLDER, fileName));
}
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));