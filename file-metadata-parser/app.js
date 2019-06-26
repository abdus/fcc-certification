const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: path.resolve(__dirname, 'files') });

app.use(express.static(path.resolve(__dirname, 'static')));
app.post('/', upload.single('user-file'), (req, res) => {
  if (req.file) {
    const fileStats = fs.lstatSync(
      path.resolve(req.file.destination, req.file.path)
    );
    fs.unlinkSync(path.resolve(req.file.destination, req.file.path));

    fileStats.size = (fileStats.size / 1024).toFixed(2) + ' KB';

    res.json({
      name: req.file.originalname,
      encoding: req.file.encoding,
      size: fileStats.size,
      mimetype: req.file.mimetype,
    });

    delete fileStats;
    delete req.file;
  } else {
    res.json({ msg: 'Please Upload a file' });
  }
});

app.listen(process.env.PORT || 3000);
