import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'
import arrayBuffer from 'buffer';

dotenv.config({
  path: path.join(process.cwd(), '../.env')
});

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/health', (req, res) => {
  res.send("Health: OK");
});

const upload = multer({ dest: "uploads/" });

app.use('/audio', upload.single('file'), async (req, res) => {
  let file = req.file;
  file = file.arrayBuffer()
  console.log(file);
});

app.use(express.static('uploads'));

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
});
