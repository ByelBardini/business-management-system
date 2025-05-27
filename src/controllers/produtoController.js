import db from '../config/db.js';

export const getProdutos = (req, res) => {
  db.query("SELECT * FROM produto", (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar produtos" });
    res.json(results);
  });
};

export const getProdutosPorEmpresa = (req, res) => {
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
};

export const criaProduto = (req, res) => {
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
};

export const deletaProduto = (req, res) => {
    const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do produto é obrigatório." });
  }

  const sql = `DELETE FROM produto WHERE id_produto = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar produto:", err);
      res.status(500).json({ error: "Erro ao deletar produto" });
      return;
    }
    res.json({ message: "Produto deletado com sucesso" });
  });
};

export const atualizaProduto = (req, res) => {
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
};