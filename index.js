const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const denuncia = require("./engine/denuncia"); //Database

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

app.get("/conteudo", (req, res) => {
    res.render("conteudo");
});

app.get("/form-denuncia", async (req, res) => {
    const tipo_violencia = await denuncia.valores_tipo_violencia();

    res.render("form-denuncia", {
        tipo_violencia: tipo_violencia
    });

});

app.listen(3000, "0.0.0.0", () => {console.log("App rodando!");});


