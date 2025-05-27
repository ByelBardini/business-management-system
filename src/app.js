import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rotas
app.use(authRoutes);
app.use(usuarioRoutes);
app.use(produtoRoutes);

export default app;
