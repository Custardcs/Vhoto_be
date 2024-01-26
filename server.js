const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const app = express();
const Database = require('better-sqlite3');

const uploadsDirectory = path.join(__dirname, 'uploads');

const db = new Database('filehashes.db', { verbose: console.log });
// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.all('/', (req, res) => {
    res.send('hello world');
})
app.post('/upload', upload.single('file'), async (req, res) => {
    const fileHash = await generateFileHash(req.file.path);

    if (checkFileHashInDatabase(fileHash)) {
        return res.status(409).send('File already uploaded');
    }

    insertFileHash(fileHash, req.file.originalname);

    res.json({ message: 'File uploaded successfully', fileHash: fileHash });
});


app.listen(3000, () => console.log('Server started on port 3000'));



function checkFileHashInDatabase(fileHash) {
    const stmt = db.prepare('SELECT hash FROM files WHERE hash = ?');
    const result = stmt.get(fileHash);
    return result !== undefined;
}
function insertFileHash(fileHash, filename) {
    const stmt = db.prepare('INSERT INTO files (hash, filename) VALUES (?, ?)');
    stmt.run(fileHash, filename);
}

function generateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        let hash = crypto.createHash('sha256');
        let stream = fs.createReadStream(filePath);
        stream.on('data', function (data) {
            hash.update(data, 'utf8');
        });
        stream.on('end', function () {
            resolve(hash.digest('hex'));
        });
        stream.on('error', reject);
    });
}

function getFilesFromDirectory(directory) {
    return fs.readdirSync(directory).filter(file => fs.statSync(path.join(directory, file)).isFile());
}

async function processFiles(directory) {
    const files = getFilesFromDirectory(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const fileHash = await generateFileHash(filePath);

        if (!checkFileHashInDatabase(fileHash)) {
            insertFileHash(fileHash, file);
        }
    }
}




// Run this once to set up the table
const setup = () => {
    try {
        const table = `
        CREATE TABLE IF NOT EXISTS files (
            hash TEXT PRIMARY KEY,
            filename TEXT
        )`;
        db.prepare(table).run();

        processFiles(uploadsDirectory).then(() => {
            console.log('Processed files in the uploads directory');
        });
        
    } catch (error) {
        console.log(error);
    }

};

setup();
