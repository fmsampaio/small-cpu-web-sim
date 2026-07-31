const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// Fallback para aplicações React com roteamento no navegador
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor executando na porta ${port}`);
});