document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("darkMode") === "true") {
    document.querySelector("html").classList.add("dark-mode");
  }
});

// document.querySelector(".botao-voltar").addEventListener("click", voltar);

// function voltar() {
//   console.log("Voltar clicado");
//   window.location.href = "produtos.html";
// }

const id_empresa = parseInt(localStorage.getItem("id_empresa_usuario"));

let usuarioMap = new Map(); // usado também no modalUsuarios.js

document.addEventListener("DOMContentLoaded", async () => {

  const div = document.getElementById("voltar");
    const botao = document.createElement("button");
    botao.className = "botao-voltar";
    botao.textContent = "Voltar";
    botao.addEventListener("click", function () {
      window.location.href = "produtos.html";
  });

  div.appendChild(botao);

  const tipo_usuario = localStorage.getItem("tipo_usuario");

  // Bloqueio de acesso
  if (tipo_usuario != 0) {
    alert("Você não tem permissão para acessar esta página.");
    window.location.href = "produtos.html";
    return;
  }

  // Botão de adicionar (abre o modal)
  document.getElementById("adicionarUserBtn").addEventListener("click", () => {
    document.getElementById("Form").reset();
    editandoUser = null;
    document.getElementById("userModal").style.display = "flex";
  });

  // Carrega usuários
  try {
    const resposta = await fetch(
      `http://localhost:3000/usuarios/${id_empresa}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!resposta.ok) throw new Error("Erro ao buscar usuários");

    const usuarios = await resposta.json();
    usuarios.forEach(adicionarUsuarioNaTela);
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    alert("Erro ao carregar usuários.");
  }
});

function adicionarUsuarioNaTela(usuario) {
  const tabela = document.getElementById("tabelaUsuarios");
  const tr = document.createElement("tr");
  tr.className = "usuario";

  const tdNome = document.createElement("td");
  tdNome.textContent = usuario.nome_usuario;
  tr.appendChild(tdNome);

  const tdLogin = document.createElement("td");
  tdLogin.textContent = usuario.login_usuario;
  tr.appendChild(tdLogin);

  const tdTipo = document.createElement("td");
  tdTipo.textContent = usuario.tipo_usuario == 0 ? "Administrador" : "Usuário";
  tr.appendChild(tdTipo);

  const tdAcoes = document.createElement("td");

  const botaoEditar = document.createElement("button");
  botaoEditar.textContent = "Editar";
  botaoEditar.className = "botaoEditar";
  botaoEditar.addEventListener("click", () => editaUsuario(usuario.id_usuario));
  tdAcoes.appendChild(botaoEditar);

  const botaoExcluir = document.createElement("button");
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.className = "botaoExcluir";
  botaoExcluir.addEventListener("click", () =>
    excluirUsuario(usuario.id_usuario)
  );
  tdAcoes.appendChild(botaoExcluir);

  tr.appendChild(tdAcoes);
  tabela.appendChild(tr);

  usuarioMap.set(usuario.id_usuario, usuario);
}

document.addEventListener('DOMContentLoaded', () => {
document.documentElement.classList.remove('preload');})