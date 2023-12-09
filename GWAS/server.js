const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/pageTwo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pageTwo.html'));
});

app.post('/submit', upload.fields([
    { name: 'genotypeFile', maxCount: 1 },
    { name: 'phenotypeFile', maxCount: 1 }
  ]), (req, res) => {
    try {
      const genotypeFile = req.files['genotypeFile'][0].path;
      const phenotypeFile = req.files['phenotypeFile'][0].path;
      const genotypeFormat = req.body.genotypeFormat;
      const phenotypeFormat = req.body.phenotypeFormat;
      const statMethods = req.body.statMethod || [];
      const numberOfTraits = req.body.numberOfTraits;
      const traits = req.body.traits || [];
      const selectedModel = req.body.selectedModel;
  
      // Use spawn for better handling of command arguments
      const process = spawn('Rscript', ['script.R', genotypeFile, phenotypeFile, selectedModel, genotypeFormat]);
  
      process.on('close', (code) => {
        if (code === 0) {
          console.log('R script executed successfully');
          res.sendFile(path.join(__dirname, 'public', 'completion.html'));
        } else {
          console.error(`Error executing R script. Exit code: ${code}`);
          res.status(500).send('Internal Server Error');
        }
      });
    } catch (err) {
      console.error(`Error processing request: ${err}`);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
