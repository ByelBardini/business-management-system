import express from "express";
import { getUsuarios, getEmpresaUsuario, criaUsuario, atualizaUsuario, deletaUsuario } from "../controllers/usuarioController.js";  
import verificaToken from "../middlewares/verificaToken.js";

const router = express.Router();

router.get("/usuarios:id", verificaToken, getUsuarios);
router.get("/empresa:id", verificaToken, getEmpresaUsuario);
router.post("/usuarios", verificaToken, criaUsuario);
router.put("/usuarios/:id", verificaToken, atualizaUsuario);
router.delete("/usuarios/:id", verificaToken, deletaUsuario);

export default router;
