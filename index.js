const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const denuncia = require("./engine/denuncia");

// View engine
app.set('view engine','ejs');

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Sessão
app.use(
    session({
        secret: "Dados do visitante",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
);

// =========================
// FORM GET
// =========================

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

        const sucesso = req.session.sucesso;
        req.session.sucesso = null;

        res.render("form-denuncia", {
            tipo_violencia,
            frequencia,
            relacao_vitima,
            usa_alcool_drogas,
            existe_acesso_armas,
            sucesso,
            erros: null,
            dadosForm: {}
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar formulário");
    }
});

// =========================
// FORM POST
// =========================

app.post("/form-denuncia", async (req, res) => {

    let erros = [];

    // 🔴 NÃO usar para campos binários
    const invalido = (campo) => {
        return campo === undefined || campo === null || campo === "";
    };

    // ✅ específico para boolean (0 ou 1)
    const invalidoBinario = (campo) => {
        return campo !== "0" && campo !== "1";
    };

    // =====================
    // Validações
    // =====================

    // checkbox múltiplo
    if (invalido(req.body.tipos_violencia)) {
        erros.push({ texto: "Selecione ao menos um tipo de violência." });
    }


    // texto / select normal
    if (invalido(req.body.descricao)) erros.push({ texto: "Descrição inválida." });
    if (invalido(req.body.data_ocorrencia)) erros.push({ texto: "Data inválida." });
    if (invalido(req.body.frequencia)) erros.push({ texto: "Frequência inválida." });
    if (invalido(req.body.relacao_vitima)) erros.push({ texto: "Relação com a vítima inválida." });
    if (invalido(req.body.usa_alcool_drogas)) erros.push({ texto: "Uso de álcool/drogas inválido." });
    if (invalido(req.body.existe_acesso_armas)) erros.push({ texto: "Acesso a armas inválido." });


    // let tiposViolencia = req.body.tipos_violencia;

    // if (!tiposViolencia) {
    //     tiposViolencia = [];
    // } else if (!Array.isArray(tiposViolencia)) {
    //     tiposViolencia = [tiposViolencia];
    // }

    // tiposViolencia = tiposViolencia.map(String);

    // // opcional (recomendado)
    // req.body.tipos_violencia = tiposViolencia;

    // if (tiposViolencia.length === 0) {
    //     erros.push({ texto: "Selecione ao menos um tipo de violência." });
    // }

    // =====================
    // 🔵 CAMPOS BINÁRIOS (faltavam aqui)
    // =====================

    if (invalidoBinario(req.body.agressor_presente)) {
        erros.push({ texto: "Informe se o agressor está presente." });
    }

    if (invalidoBinario(req.body.risco_imediato)) {
        erros.push({ texto: "Informe se há risco imediato." });
    }

    if (invalidoBinario(req.body.crianca_idoso)) {
        erros.push({ texto: "Informe se há criança ou idoso envolvido." });
    }

    if (invalidoBinario(req.body.deseja_contato)) {
        erros.push({ texto: "Informe se deseja contato." });
    }

    // =====================
    // contato condicional
    // =====================

    if (req.body.deseja_contato === "1") {
        if (invalido(req.body.telefone) && invalido(req.body.email)) {
            erros.push({ texto: "Informe ao menos telefone ou email para contato." });
        }
    }

    // =====================
    // confirmação
    // =====================

    if (!req.body.confirmacao) {
        erros.push({ texto: "Você precisa confirmar a denúncia." });
    }


    //console.log("Enviados para validação:", req.body);

    // =========================
    // SE TIVER ERRO
    // =========================
    if (erros.length > 0) {

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

        return res.render("form-denuncia", {
            erros,
            sucesso: null,
            dadosForm: req.body, // 🔥 mantém dados
            tipo_violencia,
            frequencia,
            relacao_vitima,
            usa_alcool_drogas,
            existe_acesso_armas
        });
    }

    // =========================
    // SUCESSO
    // =========================
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
            confirmacao: true,
            tipos_violencia: Array.isArray(req.body.tipos_violencia)
                ? req.body.tipos_violencia
                : [req.body.tipos_violencia]
        };

        await denuncia.inserir_ocorrencia(dados);

        req.session.sucesso = "Denúncia registrada com sucesso!";
        res.redirect("/form-denuncia");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao registrar ocorrência");
    }

});

// =========================


app.get("/conteudo", async (req, res) => {
    res.render("conteudo");
    
})


// =========================

app.listen(3000, "0.0.0.0", () => {
    console.log("App rodando!");
});