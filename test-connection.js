const connection = require("./database/database");
const Denuncia = require("./engine/denuncia");

async function testarConexao() {
  let tentativas = 0;

  while (tentativas < 10) {
    try {
      await connection.authenticate();
      console.log("✅ Conectado ao SQL Server!");
      process.exit(0);
    } catch (err) {
      console.log("⏳ Tentando conectar...", err.message);
      tentativas++;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.log("❌ Não conseguiu conectar.");
  process.exit(1);
}

// testarConexao();

console.log("Testando função valores_tipo_violencia...");

Denuncia.valores_tipo_violencia()
  .then(result => {
    console.log("✅ Resultado:", result);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  });