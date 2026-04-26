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

// app.get("/form-denuncia", async (req, res) => {
//     const tipo_violencia = await denuncia.valores_tipo_violencia();

//     res.render("form-denuncia", {
//         tipo_violencia: tipo_violencia
//     });

// });

app.get("/form-denuncia", async (req, res) => {
    try {
        const [
            tipo_violencia,
            frequencia,
            relacao_vitima,
            usa_alcool_drogas,
            existe_acesso_armas
        ] = await Promise.all([
            denuncia.valores_tipo_violencia(),
            denuncia.valores_frequencia(),
            denuncia.valores_relacao_vitima(),
            denuncia.valores_usa_alcool_drogas(),
            denuncia.valores_existe_acesso_armas()
        ]);

        res.render("form-denuncia", {
            tipo_violencia,
            frequencia,
            relacao_vitima,
            usa_alcool_drogas,
            existe_acesso_armas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar formulário");
    }
});

app.post("/form-denuncia", async (req, res) => {
    try {
        const dados = {
            descricao: req.body.descricao,
            data_ocorrencia: req.body.data_ocorrencia,
            frequencia: req.body.frequencia,
            cidade: req.body.cidade,
            bairro: req.body.bairro,
            endereco: req.body.endereco,
            relacao_vitima: req.body.relacao_vitima,
            agressor_presente: req.body.agressor_presente === "1",
            usa_alcool_drogas: req.body.usa_alcool_drogas,
            risco_imediato: req.body.risco_imediato === "1",
            crianca_idoso: req.body.crianca_idoso === "1",
            existe_acesso_armas: req.body.existe_acesso_armas,
            deseja_contato: req.body.deseja_contato === "1",
            telefone: req.body.telefone,
            email: req.body.email,
            confirmacao: req.body.confirmacao === "1",

            // Pode vir como string ou array dependendo do form
            tipos_violencia: Array.isArray(req.body.tipos_violencia)
                ? req.body.tipos_violencia
                : [req.body.tipos_violencia]
        };

        const id = await denuncia.inserir_ocorrencia(dados);

        res.redirect(`/sucesso?id=${id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao registrar ocorrência");
    }
});

app.listen(3000, "0.0.0.0", () => {console.log("App rodando!");});


