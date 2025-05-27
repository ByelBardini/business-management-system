import express from "express";
import { getProdutos, getProdutosPorEmpresa, criaProduto, atualizaProduto, deletaProduto } from "../controllers/produtoController.js";
import verificaToken from "../middlewares/verificaToken.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/produtos", getProdutos);
router.get("/produtos/:id", verificaToken, getProdutosPorEmpresa);
router.post("/produtos", verificaToken, upload.single("imagem_produto"), criaProduto);
router.put("/produtos/:id", verificaToken, upload.single("imagem_produto"), atualizaProduto);
router.delete("/produtos/:id", verificaToken, deletaProduto);

export default router;
