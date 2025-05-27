import jwt from "jsonwebtoken";

const CHAVE = "chave-muito-segura-nem-um-pouco-hackeavel";

export function verificaToken(req, res, next) {
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