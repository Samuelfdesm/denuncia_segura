const Sequelize = require("sequelize");
const connection = require("../database/database");

// Função genérica
async function buscarValoresPorCampo(idCampo) {
    const result = await connection.query(
        `SELECT
            l.id_valor,
            l.valor
        FROM
            lista_valores l
        WHERE
            l.id_campo = :idCampo
            AND l.status = 1;`,
        {
            replacements: { idCampo },
            type: Sequelize.QueryTypes.SELECT
        }
    );

    return result;
}

async function inserirOcorrencia(dados) {
    const result = await connection.query(
        `EXEC dbo.sp_registrar_ocorrencia
            @descricao = :descricao,
            @data_ocorrencia = :data_ocorrencia,
            @frequencia = :frequencia,
            @cidade = :cidade,
            @bairro = :bairro,
            @endereco = :endereco,
            @relacao_vitima = :relacao_vitima,
            @agressor_presente = :agressor_presente,
            @usa_alcool_drogas = :usa_alcool_drogas,
            @risco_imediato = :risco_imediato,
            @crianca_idoso = :crianca_idoso,
            @existe_acesso_armas = :existe_acesso_armas,
            @deseja_contato = :deseja_contato,
            @telefone = :telefone,
            @email = :email,
            @confirmacao = :confirmacao,
            @tipos_violencia = :tipos_violencia;
        `,
        {
            replacements: {
                descricao: dados.descricao,
                data_ocorrencia: dados.data_ocorrencia,
                frequencia: dados.frequencia,
                cidade: dados.cidade || null,
                bairro: dados.bairro || null,
                endereco: dados.endereco || null,
                relacao_vitima: dados.relacao_vitima,
                agressor_presente: dados.agressor_presente,
                usa_alcool_drogas: dados.usa_alcool_drogas,
                risco_imediato: dados.risco_imediato,
                crianca_idoso: dados.crianca_idoso,
                existe_acesso_armas: dados.existe_acesso_armas,
                deseja_contato: dados.deseja_contato,
                telefone: dados.telefone || null,
                email: dados.email || null,
                confirmacao: dados.confirmacao,

                // 🔥 IMPORTANTE: array → string CSV
                tipos_violencia: Array.isArray(dados.tipos_violencia)
                    ? dados.tipos_violencia.join(',')
                    : dados.tipos_violencia
            }
        }
    );

    // A procedure retorna: SELECT @id_ocorrencia
    return result[0][0]; 
}

// Funções específicas (sem repetição de SQL)
const Denuncia = {
    valores_tipo_violencia: () => buscarValoresPorCampo(1),
    valores_frequencia: () => buscarValoresPorCampo(2),
    valores_relacao_vitima: () => buscarValoresPorCampo(4),
    valores_usa_alcool_drogas: () => buscarValoresPorCampo(5),
    valores_existe_acesso_armas: () => buscarValoresPorCampo(6),
    inserir_ocorrencia: (dados) => inserirOcorrencia(dados)
};

module.exports = Denuncia;