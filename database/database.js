const Sequelize = require("sequelize");

const connection = new Sequelize(
  "denuncia_segura",
  "sa",
  "As,k71l;",
  {
    host: "db", // 🔥 aqui está o segredo
    dialect: "mssql",
    port: 1433,

    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },

    logging: false
  }
);

module.exports = connection;