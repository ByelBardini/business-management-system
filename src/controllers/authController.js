import jwt from "jsonwebtoken";
import connection from "../config/db.js";

const CHAVE = "chave-muito-segura-nem-um-pouco-hackeavel";

export const login = (req, res) => {
  const { login_usuario, senha_usuario } = req.body;

  if (!login_usuario || !senha_usuario) {
    return res.status(400).json({ error: "Login e senha são obrigatórios." });
  }

  const sql = `SELECT * FROM usuario WHERE login_usuario = ? AND senha_usuario = ?`;
  connection.query(sql, [login_usuario, senha_usuario], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      return res.status(500).json({ error: "Erro ao validar usuário" });
    }

    if (results.length > 0) {
      const payload = {
        usuario: login_usuario,
        tipo_usuario: results[0].tipo_usuario,
      };

      const token = jwt.sign(payload, CHAVE, { expiresIn: "2h" });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
      });

      res.json(results[0]);
    } else {
      res.status(401).json({ error: "Usuário ou senha inválidos." });
    }
  });
};

export const validarToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  jwt.verify(token, CHAVE, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    res.json({ message: "Usuário autenticado com sucesso", usuario: decoded });
  });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ mensagem: "Logout realizado com sucesso" });
};
