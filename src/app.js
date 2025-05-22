import express from "express";
import cors from "cors";
import connection from "./db.js";
import multer from "multer";
import cookieParser from "cookie-parser"; 
import jwt from "jsonwebtoken";
import db from "./db.js";

const app = express();
const CHAVE = "chave-muito-segura-nem-um-pouco-hackeavel";

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }))

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/validar", (req, res) => {
  // Aqui ele vai validar se o usuário está logado ou não
  // Ele vai receber o token que foi enviado no login e vai verificar se ele é válido
  // Se for válido, retorna 200, e se não for, retorna 401
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, CHAVE, (err, decoded) => {
    if (err) {
      console.log("Erro ao verificar token:", err);
      return res.status(403).json({ error: "Token inválido." });
    }
    res.json({ message: "Usuário autenticado com sucesso", usuario: decoded });
  });
});

// Valida se o login é válido
app.post("/login", (req, res) => {
  // Recebe um JSON com duas propriedades: "login_usuario", com o login, e "senha_usuario", com a senha
  // Retorna um JSON com os dados do usuário, caso o login e senha estejam corretos, ou um erro, caso contrário
  // Em caso de sucesso, retorna 200, e em caso de erro, retorna 401
  // Exemplo de JSON de entrada: {"login_usuario": "usuario", "senha_usuario": "senha"}
  const { login_usuario, senha_usuario } = req.body;

  if (!login_usuario || !senha_usuario) {
    return res.status(400).json({ error: "Login e senha são obrigatórios." });
  }

  const sql = `SELECT * FROM usuario WHERE login_usuario = ? AND senha_usuario = ?`;
  connection.query(sql, [login_usuario, senha_usuario], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro ao validar usuário" });
      return;
    }
    if (results.length > 0) {
      const payload = {
        usuario: login_usuario,
        tipo_usuario: results[0].tipo_usuario,
      }

      const token = jwt.sign(payload, CHAVE, { expiresIn: "2h" });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        path: "/",
        maxAge: 2 * 60 * 60 * 1000
      });
      
      res.json(results[0]);
    } else {
      res.status(401).json({ error: "Usuário ou senha inválidos." });
    }
  });

})

// Middleware para validar o token que foi enviado no login
function verificaToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, CHAVE, (err, decoded) => {
    if (err) {
      console.log("Erro ao verificar token:", err);
      return res.status(403).json({ error: "Token inválido." });
    }
    req.user = decoded;
    next();
  });
}

// Buscar usuários
app.get("/usuarios/:id", verificaToken, (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM usuario WHERE id_empresa_usuario = ?`;


  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro ao buscar usuários" });
      return;
    }
    res.json(results);
  });
});

//Busca qual a empresa do usuário
app.post("/empresa", verificaToken, (req, res) => {
  // Recebe como parâmetro o id_empresa_usuario, que é o id da empresa do usuário
  // Isso será feito depois que um usuário logar, enviando o "id_empresa_usuario" que foi retornado do login
  // Recebendo esse id, ele vai buscar o nome da empresa e retornar em formato JSON
  // Exemplo de JSON de entrada: {"id_empresa_usuario": 1}
  // Exemplo de JSON de saída: {"nome_empresa": "Nome da empresa"}
  const { id_empresa_usuario } = req.body;

  if (!id_empresa_usuario) {
    return res.status(400).json({ error: "ID da empresa é obrigatório." });
  }

  const sql = `SELECT nome_empresa FROM empresa WHERE id_empresa = ?`;
  connection.query(sql, [id_empresa_usuario], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro ao buscar empresa" });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "Empresa não encontrada." });
    }
  });
})

// Buscar produtos
app.get("/produtos", (req, res) => {
  // Não precisa de parâmetros, apenas retorna todos os produtos, em formato json
  // Vai precisar de algo pra converter o retorno da imagem pra imagem de fato, mas isso pode ser feito no front-end
  connection.query("SELECT * FROM produto", (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro ao buscar usuários" });
      return;
    }
    res.json(results);
  });
});

app.get("/produtos/:id", verificaToken, (req, res) => {
  // Não precisa de parâmetros, apenas retorna todos os produtos por empresa, em formato JSON, recebendo o ID
  const { id } = req.params;

  const sql = `SELECT * FROM produto WHERE id_empresa_produto = ?`;
  
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro ao buscar usuários" });
      return;
    }
    res.json(results);
  });
});

// Enviar produto
app.post("/produtos", verificaToken, upload.single("imagem_produto"), (req, res) => {
  // Aqui ele recebe como parâmetro as informações do produto e uma imagem
  // Ele transforma a imagem e envia tudo junto pro banco de dados, cadastrando o produto
  const { nome_produto, preco_produto, quantidade_estoque, descricao_produto, id_empresa_produto } = req.body;
  const imagem_produto = req.file?.buffer;

  if (!nome_produto || !preco_produto || !quantidade_estoque || !id_empresa_produto || !descricao_produto || !imagem_produto) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  const sql = `
    INSERT INTO produto (nome_produto, preco_produto, quantidade_estoque, imagem_produto, descricao_produto, id_empresa_produto)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome_produto, preco_produto, quantidade_estoque, imagem_produto, descricao_produto, id_empresa_produto], (err, result) => {
    if (err) {
      console.error("Erro ao inserir produto:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar produto." });
    }

    res.status(201).json({ mensagem: "Produto cadastrado com sucesso!", id: result.insertId });
  });
});


// Deletar produto
app.delete("/produtos/:id", verificaToken, (req, res) => {
  // Aqui ele recebe como parâmetro o id do produto e deleta do banco de dados
  // Exemplo de JSON de entrada: {"id": 1}
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do produto é obrigatório." });
  }

  const sql = `DELETE FROM produto WHERE id_produto = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar produto:", err);
      res.status(500).json({ error: "Erro ao deletar produto" });
      return;
    }
    res.json({ message: "Produto deletado com sucesso" });
  });
});

app.put("/produtos/:id", verificaToken, upload.single("imagem_produto"), (req, res) => { 
  // Aqui ele recebe como parâmetro o id do produto e as informações do produto
  // Ele atualiza as informações do produto no banco de dados
  // Exemplo de JSON de entrada: {"id": 1, "nome_produto": "Nome do produto", "preco_produto": 10.00, "quantidade_estoque": 100, "imagem_produto": "imagem", "id_empresa_produto": 1}
  const { id } = req.params;
  const { nome_produto, descricao_produto, preco_produto, quantidade_estoque } = req.body;
  const imagem_produto = req.file?.buffer;

  if (!id || !nome_produto || !descricao_produto || !preco_produto || !quantidade_estoque) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    UPDATE produto
    SET nome_produto = ?, preco_produto = ?, quantidade_estoque = ?, imagem_produto = ?, descricao_produto = ?
    WHERE id_produto = ?
  `;

  db.query(sql, [nome_produto, preco_produto, quantidade_estoque, imagem_produto, descricao_produto, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar produto:", err);
      return res.status(500).json({ error: "Erro ao atualizar produto." });
    }

    res.json({ message: "Produto atualizado com sucesso!" });
  });
});

// Criar usuário
app.post("/usuarios", verificaToken, (req, res) => {
  // Aqui ele recebe como parâmetro as informações do usuário e cadastra no banco de dados
  // Ele recebe inclusive o login e senha, que serão usados pra validar o login depois
  // A recomendação é no front não tem opção de mudar o "id_empresa_usuario", recebendo o do usuário logado
  // Exemplo de JSON de entrada: {"nome_usuario": "Nome do usuário", "login_usuario": "usuario", "senha_usuario": "senha", "tipo_usuario": "0 para admin, 1 para usuário normal", "id_empresa_usuario": 1}
  const {nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario} = req.body;

  if (!nome_usuario || !login_usuario || !senha_usuario || !tipo_usuario || !id_empresa_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `INSERT INTO usuario (nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario) VALUES (?, ?, ?, ?, ?)`;
  const values = [nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario];
  console.log("Valores:", values);
  console.log("SQL:", sql);
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err);
      res.status(500).json({ error: "Erro ao inserir usuário" });
      return;
    }
    res.status(201).json({ message: "Usuário criado com sucesso" });
  });
})

// Editar usuário
app.put("/usuarios/:id", verificaToken, (req, res) => {
  // Aqui ele recebe como parâmetro o id do usuário e as informações do usuário
  // Ele atualiza as informações do usuário no banco de dados
  // Exemplo de JSON de entrada: {"id": 1, "nome_usuario": "Nome do usuário", "login_usuario": "usuario", "senha_usuario": "senha", "tipo_usuario": "0 para admin, 1 para usuário normal", "id_empresa_usuario": 1}
  const { id } = req.params;
  const { nome_usuario, login_usuario, senha_usuario, tipo_usuario } = req.body;

  if (!id || !nome_usuario || !login_usuario || !senha_usuario || !tipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }


  const sql = `UPDATE usuario SET nome_usuario = ?, login_usuario = ?, senha_usuario = ?, tipo_usuario = ? WHERE id_usuario = ?`;
  const values = [nome_usuario, login_usuario, senha_usuario, tipo_usuario, id];
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
      return;
    }
    res.json({ message: "Usuário atualizado com sucesso" });
  });
});

// Deletar usuário
app.delete("/usuarios/:id", verificaToken, (req, res) => {
  // Aqui ele recebe como parâmetro o id do usuário e deleta do banco de dados
  // Exemplo de JSON de entrada: {"id": 1}
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  const sql = `DELETE FROM usuario WHERE id_usuario = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro ao deletar usuário" });
      return;
    }
    res.json({ message: "Usuário deletado com sucesso" });
  });
});

// Fazer logout
app.post("/logout", (req, res) => {
  //Sempre chamar esse endpoint quando o usuário fizer logout
  // Ele vai deletar o cookie que foi criado no login com o token
  res.clearCookie("token");
  res.json({ mensagem: "Logout realizado com sucesso" });
});

app.get("/debug", (req, res) => {
  console.log("Cookies recebidos:", req.cookies);
  res.json({ cookies: req.cookies });
});

app.listen(3000, () => {
  console.log("Server aberto na porta 3000");
});
