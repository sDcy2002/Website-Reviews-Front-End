const express = require('express');
const axios = require('axios');
const app = express();
var bodyParser = require('body-parser');
const path = require("path");

const base_url = 'http://localhost:3000';

// Set the template engine
app.set("views", path.join(__dirname, "/public/views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/movies');
        res.render("movies", { movies: response.data});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/movies/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/movies/' + req.params.id);
        res.render("movie", { movies: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/create_movie", (req, res) => {
    res.render("create_movie");
});

// เพิ่มข้อมูลหนังใหม่
app.post("/create_movie", async (req, res) => {
    try {
        const data = { movie_name: req.body.movie_name,
                       category: req.body.categoryID,
                       studio: req.body.studioID,
                       movie_detail: req.body.movie_detail,
                       Budget: req.body.flimmaking_funds,
                       movie_income: req.body.movie_income };
        await axios.post(base_url + '/movies', data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// ดึงข้อมูลเก่ามาโชว์
app.get("/update_movie/:id", async (req, res) => {
    try {
        const response = await axios.get(
        base_url + '/movies/' + req.params.id);
        res.render("update_movie", { movies: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/update_movie/:id", async (req, res) => {
    try {
        const data = { movie_name: req.body.movie_name,
            category: req.body.categoryID,
            studio: req.body.studioID,
            movie_detail: req.body.movie_detail,
            Budget: req.body.flimmaking_funds,
            movie_income: req.body.movie_income };
        await axios.put(base_url + '/movies/' + req.params.id, data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/delete_movie/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/movies/' + req.params.id);
        res.redirect("/");
    } catch {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.listen(5500, () => {
    console.log('Server stated on port 5500');
});
