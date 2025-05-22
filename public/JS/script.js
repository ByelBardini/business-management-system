const $html = document.querySelector("html");

document.querySelector(".botao-login").addEventListener("click", logaSistema);

function criaUsuario() {
  let nome = document.getElementById("nome").value;
  let login = document.getElementById("login").value;
  let senha = document.getElementById("senha").value;
  let tipoUsuario = document.getElementById("tipoUsuario").value;
  let usuario = {
    nome_usuario: nome,
    login_usuario: login,
    senha_usuario: senha,
    tipo_usuario: tipoUsuario,
    /*         id_empresa_usuario: 1 // Aqui você pode definir o id da empresa do usuário logado
     */
  };
  console.log(usuario);
}

function logaSistema() {
  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;
  const usuario = {
    login_usuario: login,
    senha_usuario: senha,
  };
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Login ou senha inválidos");
        throw new Error("Erro ao fazer login");
      }
    })
    .then((data) => {
      console.log("Login realizado com sucesso:", data);

      // Salvando dados no localStorage
      localStorage.setItem("nome_usuario", data.nome_usuario);
      localStorage.setItem("tipo_usuario", data.tipo_usuario);
      localStorage.setItem("id_empresa_usuario", data.id_empresa_usuario);

      window.location.href = "produtos.html";
    });
}

//Usando pra testar os cookies, ignora
function debug() {
  fetch("http://localhost:3000/debug", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro ao buscar cookies");
      }
    })
    .then((data) => {
      console.log("Cookies recebidos:", data);
    });
}
