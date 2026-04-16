const Sequelize = require("sequelize");
const connection = require("../database/database");

async function Perguntas(){

    const result = await connection.query(
        `SELECT
            p.idpergunta,
            p.pergunta
        FROM 
            quiz.perguntas AS p
        WHERE
            p.idpergunta <= 104;`,
        { raw: true }
    )

    return result[0]

}
    
async function Alternativas(){

    const result = await connection.query(
        `SELECT 
            a.idalternativas,
            a.pergunta_idpergunta, 
            a.alternativa 
        FROM quiz.alternativas AS a;`, 
        { raw: true }
    )

    return result[0]

}

async function Perguntas_Aleatorias(min, max, qtd){

    const perguntas = await Perguntas();

    let filtro = idsAleatorios(min, max, qtd);
    let result = perguntas.filter(o => filtro.has(o.idpergunta));

    return Promise.resolve(result)

}

async function Alternativas_Aleatorias() {

    const alternativas =  await Alternativas();

    let filtro = idsAleatorios(1 , alternativas.length, alternativas.length);

    let result = [];
    filtro.forEach(id => {
        result.push(alternativas.find(o => o.idalternativas == id))
    })

    return Promise.resolve(result)
    
}

async function Questionario(min, max, qtd){
    let perguntas = await Perguntas_Aleatorias(min, max, qtd)
    let alternativas = await Alternativas_Aleatorias()
    let questoes = []

    perguntas.forEach(pergunta => {
        let respostas = alternativas.filter(alternativa => {
            return alternativa.pergunta_idpergunta == pergunta.idpergunta
        })

        questoes.push(
            {
                id_pergunta: pergunta.idpergunta,
                pergunta: pergunta.pergunta,
                alternativas: respostas
            }
        )
    })

    return questoes

}



async function test() {
    const result = await Alternativas_Aleatorias();
    console.log(result);
}

async function ResponderPergunta(idusuario, idpergunta, idalternativa){

try{
    await connection.query(`
        INSERT INTO respostas_usuarios(
            usuarios_idusuario,
            pergunta_idpergunta,
            alternativas_idalternativas,
        datahora_resposta)
        VALUES (
            :idusuario,
            :idpergunta,
            :idalternativa,
            :datahoraresposta
        )`, 
    {
        replacements: {
            idusuario: idusuario,
            idpergunta: idpergunta,
            idalternativa: idalternativa,
            datahoraresposta: new Date()
        },
        type: Sequelize.QueryTypes.INSERT,
    });
} catch(e){
    return Promise.resolve(false)
}

return Promise.resolve(true)

}

async function CriarVisitante(visitante){

    const data_atual = new Date()


    await connection.query(`
        INSERT INTO usuarios(
            nome,
            setor,
            area,
            cargo,
            email,
            telefone,
            datacriacao)
        VALUES (
            :nome,
            :setor,
            :area,
            :cargo,
            :email,
            :telefone,
            :datahora
        )`, 
    {
        replacements: {
            nome: visitante.nome,
            setor: visitante.setor,
            area: visitante.area,
            cargo: visitante.cargo,
            email: visitante.email,
            telefone: visitante.telefone,
            datahora: data_atual
        },
        type: Sequelize.QueryTypes.INSERT,
    })


    const r = await connection.query(`
        SELECT 
            idusuario
        FROM
            usuarios u
        WHERE
            u.nome = '${visitante.nome}'
            AND
            u.datacriacao = '${data_atual.getFullYear()}-${Number(data_atual.getMonth()) + 1}-${data_atual.getDate()} ${data_atual.getHours()}:${data_atual.getMinutes()}:${data_atual.getSeconds()}';
    `,
    { raw: true })

    return Promise.resolve(...r[0])

}


async function Resultado(id_usuario){

    const result = await connection.query(
        `SELECT
            u.nome,
            IF(r.alternativas_idalternativas = c.alternativas_idalternativas, "Resposta certa", "Resposta errada") AS resultado,
            COUNT(*) AS quantidade
        FROM respostas_usuarios r
        INNER JOIN resposta_certa c ON r.pergunta_idpergunta = c.pergunta_idpergunta
        INNER JOIN usuarios u ON r.usuarios_idusuario = u.idusuario
        WHERE r.usuarios_idusuario = ${id_usuario}
        GROUP BY
            u.nome,
            resultado;`, 
        { raw: true }
    )

    return result[0]

}

async function RelatorioAvaliacao(id_usuario){

    const result = await connection.query(
        `SELECT
            z.pergunta,
            z.alternativa_escolhida,
            x.alternativa AS alternativa_certa,
            z.resultado,
            z.comentario
        FROM
            (SELECT
                p.pergunta,
                a.alternativa AS alternativa_escolhida,
                c.alternativas_idalternativas,
                IF(
                    r.alternativas_idalternativas = c.alternativas_idalternativas, 
                    "Resposta certa", 
                    "Resposta errada"
                ) AS resultado,
                c.comentario
            FROM respostas_usuarios r
            INNER JOIN perguntas p ON r.pergunta_idpergunta = p.idpergunta
            INNER JOIN alternativas a ON r.alternativas_idalternativas = a.idalternativas
            INNER JOIN resposta_certa c ON r.pergunta_idpergunta = c.pergunta_idpergunta
            WHERE r.usuarios_idusuario = '${id_usuario}') AS z
        INNER JOIN alternativas x ON z.alternativas_idalternativas = x.idalternativas;`, 
        { raw: true }
    )

    return result[0]

}


async function ListaItensCampo(id_campo){

    const result = await connection.query(
        `SELECT
            l.id_item,
            l.valor
        FROM
            lista_valores l
        WHERE
            l.id_campo = '${id_campo}'
            AND
	        l.ativo = "S"
        ORDER BY
            l.valor;`, 
        { raw: true }
    )

    // let r = ""

    // result[0].forEach(item => {
    //     r = r + `<option value="${item.id_item}">${item.valor}</option>`
    // })

    return result[0]

}










// Funções auxiliares

function aleatorioEntre(min, max){
    let numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroAleatorio;
}

function idsAleatorios(min, max, qtd){
    let ids = new Set();
    do
    {
      ids.add(aleatorioEntre(min, max))
    } 
    while (ids.size !== qtd)
  
    return ids;
}


// Exportação do objeto

const Quiz = {
    Perguntas,
    Alternativas,
    Perguntas_Aleatorias,
    Alternativas_Aleatorias,
    ResponderPergunta,
    CriarVisitante,
    Questionario,
    Resultado,
    RelatorioAvaliacao,
    ListaItensCampo
}


module.exports = Quiz