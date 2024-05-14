const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const app = express();
const Database = require("better-sqlite3");
require("dotenv").config();

//engine
app.set("view engine", "pug");
//folder allowed to view.
app.set("views", path.join(__dirname, "pugview"));
// Add this line before your route definitions
app.use(express.urlencoded({ extended: true }));

// Define the uploads directory path
const uploadsDirectory = process.env.UPLOADS_DIRECTORY || path.join(__dirname, "uploads");

// Check if the uploads directory exists, and if not, create it
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
  console.log('Uploads directory created:', uploadsDirectory);
} else {
  console.log('Uploads directory already exists:', uploadsDirectory);
}


const db = new Database("filehashes.db", { verbose: console.log });
// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
app.all("/", (req, res) => {
  res.render("index", {
    _url: uploadsDirectory,
    _ip: 'xxx.xxx.xxx.xxx'
  });
});
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log('upload - YAY')
    const fileHash = await generateFileHash(req.file.path);

    if (checkFileHashInDatabase(fileHash)) {
      // File already exists, so delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(409).json({message: "File already uploaded"});
    }

    insertFileHash(fileHash, req.file.originalname);

    res.status(200).json({ message: "File uploaded successfully", fileHash: fileHash });
  } catch (err) {
    console.error(err);
  }
});

// Handle directory selection form submission
app.post("/select-directory", (req, res) => {
  try {
    const newDirectory = req["body"]["newDirectory"];
    // Update environment variable
    process.env.UPLOADS_DIRECTORY = newDirectory;
    // Save the new directory to an .env file
    const envContent = `UPLOADS_DIRECTORY=${newDirectory}\n`;
    fs.writeFileSync(path.join(__dirname, ".env"), envContent, "utf-8");

    res.send("Upload directory updated successfully");
  } catch (err) {
    console.error(err);
  }
});

app.listen(5489, () => console.log("Server started on port 5489"));

function checkFileHashInDatabase(fileHash) {
  try {
    const stmt = db.prepare("SELECT hash FROM files WHERE hash = ?");
    const result = stmt.get(fileHash);
    return result !== undefined;
  } catch (err) {
    console.error(err);
  }
}
function insertFileHash(fileHash, filename) {
  try {
    const stmt = db.prepare("INSERT INTO files (hash, filename) VALUES (?, ?)");
    stmt.run(fileHash, filename);
  } catch (err) {
    console.error(err);
  }
}
function generateFileHash(filePath) {
  try {
    return new Promise((resolve, reject) => {
      let hash = crypto.createHash("sha256");
      let stream = fs.createReadStream(filePath);
      stream.on("data", function (data) {
        hash.update(data, "utf8");
      });
      stream.on("end", function () {
        resolve(hash.digest("hex"));
      });
      stream.on("error", reject);
    });
  } catch (err) {
    console.error(err);
  }
}
function getFilesFromDirectory(directory) {
  try {
    return fs
      .readdirSync(directory)
      .filter((file) => fs.statSync(path.join(directory, file)).isFile());
  } catch (err) {
    console.error(err);
  }
}
async function processFiles(directory) {
  try {
    const files = getFilesFromDirectory(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileHash = await generateFileHash(filePath);

      if (!checkFileHashInDatabase(fileHash)) {
        insertFileHash(fileHash, file);
      }
    }
  } catch (err) {
    console.error(err);
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
      console.log("setup - Processed files in the uploads directory");
    });
  } catch (err) {
    console.log(err);
  }
};

setup();
