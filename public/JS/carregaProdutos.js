const produtoMap = new Map();

document.querySelector(".botao-sair").addEventListener("click", logout);
document.querySelector(".dark-mode").addEventListener("click", darkMode);


document.addEventListener("DOMContentLoaded", () => {
  darkModeVerify();
  const tipoUsuario = localStorage.getItem("tipo_usuario");

  if (tipoUsuario == 0) {
    const div = document.getElementById("div");
    const botao = document.createElement("button");
    botao.className = "botao-usuario";
    botao.textContent = "Usuários";
    botao.addEventListener("click", function () {
      window.location.href = "usuarios.html";
    });

    div.appendChild(botao);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const nome = localStorage.getItem("nome_usuario");
  const idEmpresa = localStorage.getItem("id_empresa_usuario");

  document.getElementById("nomeUsuario").textContent = `Olá, ${nome}`;

  try {
    const validar = await fetch("http://localhost:3000/validar", {
      method: "GET",
      credentials: "include",
    });

    if ([401, 403].includes(validar.status)) {
      alert("Sessão inválida");
      window.location.href = "/public/html/login.html";
    }

    const empresaRes = await fetch("http://localhost:3000/empresa", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_empresa_usuario: parseInt(idEmpresa) }),
    });

    const { nome_empresa } = await empresaRes.json();
    document.getElementById("nomeEmpresa").innerText = nome_empresa;

    const produtosRes = await fetch(
      `http://localhost:3000/produtos/${idEmpresa}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const produtos = await produtosRes.json();
    produtos.forEach(adicionarProdutoNaTela);
  } catch (err) {
    console.error("Erro:", err);
    showNotification("Erro ao carregar dados.");
  }
});

function adicionarProdutoNaTela(produto) {
  const container = document.getElementById("listaproduto-raiz");
  const div = document.createElement("div");
  div.classList.add("product-item");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.nome_produto;

  const descricao = document.createElement("p");
  descricao.textContent = produto.descricao_produto;

  const preco = document.createElement("p");
  preco.innerHTML = `<strong>Preço:</strong> R$ ${produto.preco_produto.toFixed(
    2
  )}`;

  const estoque = document.createElement("p");
  estoque.innerHTML = `<strong>Estoque:</strong> ${produto.quantidade_estoque}`;

  const actions = document.createElement("div");
  actions.classList.add("product-actions");

  const botaoEditar = document.createElement("button");
  botaoEditar.className = "edit-btn";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => edita(produto.id_produto));

  const botaoDeletar = document.createElement("button");
  botaoDeletar.className = "delete-btn";
  botaoDeletar.textContent = "Excluir";
  botaoDeletar.addEventListener("click", () => deleta(produto.id_produto));

  actions.appendChild(botaoEditar);
  actions.appendChild(botaoDeletar);

  div.appendChild(titulo);
  div.appendChild(descricao);
  div.appendChild(preco);
  div.appendChild(estoque);

  if (produto.imagem_produto?.data) {
    const img = document.createElement("img");
    img.src = `data:image/jpeg;base64,${arrayBufferToBase64(
      produto.imagem_produto.data
    )}`;
    img.style.maxWidth = "100px";
    img.style.maxHeight = "100px";
    div.appendChild(img);
  }

  div.appendChild(actions);
  container.appendChild(div);

  produtoMap.set(produto.id_produto, produto);
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function showNotification(
  message = "Ação realizada com sucesso!",
  duration = 3000
) {
  const box = document.getElementById("Notificacao-sucesso");
  box.textContent = message;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), duration);
}

function logout() {
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
      } else {
        throw new Error("Erro ao fazer logout");
      }
    })
    .catch((error) => {
      console.error("Erro ao fazer logout:", error);
    });
}

function darkMode() {
  const $html = document.querySelector("html");

  const darkMode = sessionStorage.getItem("darkMode");

    if (darkMode === "false" || darkMode === null) {
      $html.classList.add("dark-mode");
      sessionStorage.setItem("darkMode", "true");
    } else {
      $html.classList.remove("dark-mode");
      sessionStorage.setItem("darkMode", "false");
    }
  }

function darkModeVerify() {
  const $html = document.querySelector("html");

  if (sessionStorage.getItem("darkMode") === "true") {
    $html.classList.add("dark-mode");
  } else {
    $html.classList.remove("dark-mode");
  }
}

document.documentElement.classList.remove('preload');
