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


//--------------------------------------- Movies --------------------------------------- //
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/movies');
        res.render("movies", { movies: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});


app.get("/movies_reviews/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/movies/' + req.params.id);
        const reviewsResponse = await axios.get(base_url + '/review?movieID=' + req.params.id); // ปรับ URL ตาม API ของคุณ
        res.render("movies_reviews", { movie: response.data, review: reviewsResponse.data });
        // console.log(response.data)
        // console.log(reviewsResponse.data)
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
                       categoryID: req.body.categoryID,
                       studioID: req.body.studioID, 
                       director: req.body.director,
                       movie_detail: req.body.movie_detail,
                       flimmaking_funds: req.body.flimmaking_funds,
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
        res.render("update_movie", { movie: response.data});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/update_movie/:id", async (req, res) => {
    try {
        const data = { movie_name: req.body.movie_name,
            categoryID: req.body.categoryID,
            studioID: req.body.studioID,
            movie_detail: req.body.movie_detail,
            director: req.body.director,
            flimmaking_funds: req.body.flimmaking_funds,
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

//--------------------------------------- Reviews --------------------------------------- //
app.get("/reviews/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/review/' + req.params.id);
        res.render("reviews", { reviews: response.data });
        console.log(response.data); // ตรวจสอบข้อมูลที่ส่งไปยัง View
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/create_review", (req, res) => {
    res.render("create_review");
});

// เพิ่มข้อมูลหนังใหม่
app.post("/create_review", async (req, res) => {
    try {
        const data = { movieID: req.body.movieID,
                review_detail: req.body.review_detail,
                overall_score: req.body.overall_score, 
                reviewer: req.body.reviewer };
        await axios.post(base_url + '/review', data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// ดึงข้อมูลเก่ามาโชว์
app.get("/update_review/:id", async (req, res) => {
    try {
        const response = await axios.get(
        base_url + '/movie_detail&reviews/' + req.params.id);
        res.render("update_review", { reviews: response.data});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/update_review/:id", async (req, res) => {
    try {
        const data = { movieID: req.body.movieID,
            review_detail: req.body.review_detail,
            overall_score: req.body.overall_score, 
            reviewer: req.body.reviewer };
        await axios.put(base_url + '/review/' + req.params.id, data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/delete_review/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/review/' + req.params.id);
        res.redirect("/");
    } catch {
        console.error(err);
        res.status(500).send('Error');
    }
});



app.listen(5500, () => {
    console.log('Server stated on port 5500');
});


