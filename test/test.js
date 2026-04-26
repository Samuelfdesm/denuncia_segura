const connection = require("./database/connection"); // ajusta o caminho

(async () => {
  try {
    await connection.authenticate();
    console.log("🔥 Conectado ao SQL Server!");
  } catch (err) {
    console.error("💥 Erro:", err);
  }
})();