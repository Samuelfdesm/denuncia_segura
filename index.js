const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
// const Quiz = require("./engine/quiz"); //Database

// Estou dizendo para o Express usar o EJS como View Engine
app.set('view engine','ejs');
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Sessões no Express
app.use(
    session({
        secret: "Dados do visitante",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
)


//Rotas

app.get("/", (req, res) => {
    res.render("informacoes");
});

app.get("/sobre", (req, res) => {
    res.render("sobre");
});


app.listen(80, () => {console.log("App rodando!");});


