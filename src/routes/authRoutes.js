import express from "express";
import { login, validarToken, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/validar", validarToken);
router.post("/logout", logout);

export default router;
