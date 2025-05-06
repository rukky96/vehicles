const express = require("express");
const {Pool} = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const port = process.env.PORT || 3333;


app.use(cors());
app.use(express.json());

const pool = new Pool({
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    ssl: {
        rejectUnauthorized: false,
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const {first_name, last_name} = req.body;
        const extension = path.extname(file.originalname);

        cb(null, `${first_name.trim().toLowerCase()}-${last_name.trim().toLowerCase}${extension}`);
    }
});

const upload = multer({storage})

app.post('/api/uploads', upload.single('image'), (req, res) => {
    const {first_name, last_name} = req.body;

    if (!req.file) {
        res.status(400).json({message: "Image is required"})
    } else if (!first_name || !last_name){
        res.status(400).json({message: "All fields are required"});
    } else {
        req.file.filename = `${first_name.toLowerCase()}-${last_name.toLowerCase()}`;
        res.status(201).json({
            message: "Image successfully uploaded",
            first_name,
            last_name,
            filePath: `http://localhost:3333/uploads/${req.file.filename}`
        })
    }
})

app.get('/api/cars', async (req, res) =>  {
    try {
        const query = `SELECT * FROM cars ORDER BY id;`
        const connection = await pool.query(query);
        const results = connection.rows
        res.status(200).json(results);
        console.log('results')
    } catch(error){
        console.log(error)
        res.status(500).json({
            message: 'There was an internal server error'
        })
    }
})

app.get('/api/cars/:id', async (req, res)=> {
    const id = req.params.id;
    const query = `SELECT * FROM cars WHERE id = ${id};`
    try {
        const connection = await pool.query(query);
        const results = connection.rows
        res.status(200).json(results);
        console.log('results')
    } catch(error){
        console.log(error)
        res.status(500).json({
            message: 'There was an internal server error'
        })
    }
})

app.put('/api/cars/:id', async (req, res)=> {
    const id = req.params.id;
    const {brand, model, year, color} = req.body;
    const query = `
    UPDATE cars 
    SET brand = $1, model = $2, year = $3, color = $4
    WHERE id = ${id}
    RETURNING *;`

    if (!brand || !model || !year || !color) {
        res.status(0).json({message: 'Some fields are missing'})
    } else {
        try {
            const values = [brand, model, year, color];
            const connection = await pool.query(query, values);
            const results = connection.rows
            res.status(200).json(results);
            console.log('results')
        } catch(error){
            console.log(error)
            res.status(500).json({
                message: 'There was an internal server error'
            })
        }
    }
    
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(port, () => {
    console.log("Server is running");
})

module.exports = app;