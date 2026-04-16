const Sequelize = require("sequelize");
const connection = require("./database");
//const { QueryTypes } = require('sequelize');

connection.query(`
    INSERT INTO respostas_usuarios(
        usuarios_idusuario,
        pergunta_idpergunta,
        alternativas_idalternativas,
    datahora_resposta)
    VALUES (
        :idusuario,
        :idpergunta,
        :idalternativas,
        :datahoraresposta
    )`, 
{
    replacements: {
        idusuario: "1",
        idpergunta: "1",
        idalternativas: "3",
        datahoraresposta: "2025-03-09 13:00:00"
    },
    type: Sequelize.QueryTypes.INSERT,
});

