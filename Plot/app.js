// app.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/upload', upload.single('excelFile'), (req, res) => {
    // Handle the uploaded file (req.file.buffer)
    // Call R script with data from the file
    // Display the result on the webpage
    // ...

    // Example: Run R script
    const rScript = `"C:/Program Files/R/R-4.1.2/bin/Rscript.exe" ${path.join(__dirname, '/script/processData.R')}`;
    exec(rScript, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing R script:', error);
            res.status(500).send('Error executing R script');
            return;
        }

        const result = stdout.trim();
        
        // Send the result to the webpage
        res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Result</title>
        </head>
        <body>
            <h2>Result: ${result}</h2>
            <img src="/plot.png" alt="Result Plot">
        </body>
        </html>
    `);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
