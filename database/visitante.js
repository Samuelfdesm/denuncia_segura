const Sequelize = require("sequelize");
const connection = require("./database");

const Visitante = {
    Criar
}

function Criar(visitante){

    connection.query(`
        INSERT INTO usuarios(
            nome,
            empresa,
            area,
            cargo,
            email,
            telefone,
            datacriacao)
        VALUES (
            :nome,
            :empresa,
            :area,
            :cargo,
            :email,
            :telefone,
            :datahora
        )`, 
    {
        replacements: {
            nome: visitante.nome,
            empresa: visitante.empresa,
            area: visitante.area,
            cargo: visitante.cargo,
            email: visitante.email,
            telefone: visitante.telefone,
            datahora: new Date()
        },
        type: Sequelize.QueryTypes.INSERT,
    })
}

module.exports = Visitante

