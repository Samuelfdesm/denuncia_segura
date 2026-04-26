const Sequelize = require("sequelize");
const connection = require("../database/database");

async function valores_tipo_violencia(){

    const result = await connection.query(
        `SELECT
            l.id_valor,
            l.valor
        FROM
            lista_valores l
        WHERE
            l.id_campo = 1
            AND
            l.status = 1;`,
        { raw: true }
    )

    return result[0]

}
    


// Exportação do objeto

const Denuncia = {
    valores_tipo_violencia
}


module.exports = Denuncia