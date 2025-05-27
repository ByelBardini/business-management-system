import db from '../config/db.js';

export const getUsuarios = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM usuario WHERE id_empresa_usuario = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) {
        console.error("Erro na consulta:", err);
        res.status(500).json({ error: "Erro ao buscar usuários" });
        return;
        }
        res.json(results);
    });
};

export const getEmpresaUsuario = (req, res) => {
  const { id_empresa_usuario } = req.params;

  if (!id_empresa_usuario) {
    return res.status(400).json({ error: "ID da empresa é obrigatório." });
  }

  const sql = `SELECT nome_empresa FROM empresa WHERE id_empresa = ?`;
  db.query(sql, [id_empresa_usuario], (err, results) => {
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
};

export const criaUsuario = (req, res) => {
    const {nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario} = req.body;

  if (!nome_usuario || !login_usuario || !senha_usuario || !tipo_usuario || !id_empresa_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `INSERT INTO usuario (nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario) VALUES (?, ?, ?, ?, ?)`;
  const values = [nome_usuario, login_usuario, senha_usuario, tipo_usuario, id_empresa_usuario];
  console.log("Valores:", values);
  console.log("SQL:", sql);
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err);
      res.status(500).json({ error: "Erro ao inserir usuário" });
      return;
    }
    res.status(201).json({ message: "Usuário criado com sucesso" });
  });
};

export const atualizaUsuario = (req, res) => {
    const { id } = req.params;
  const { nome_usuario, login_usuario, senha_usuario, tipo_usuario } = req.body;

  if (!id || !nome_usuario || !login_usuario || !senha_usuario || !tipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }


  const sql = `UPDATE usuario SET nome_usuario = ?, login_usuario = ?, senha_usuario = ?, tipo_usuario = ? WHERE id_usuario = ?`;
  const values = [nome_usuario, login_usuario, senha_usuario, tipo_usuario, id];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
      return;
    }
    res.json({ message: "Usuário atualizado com sucesso" });
  });
};

export const deletaUsuario = (req, res) => {
    const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  const sql = `DELETE FROM usuario WHERE id_usuario = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro ao deletar usuário" });
      return;
    }
    res.json({ message: "Usuário deletado com sucesso" });
  });
};