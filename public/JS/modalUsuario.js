// Selecionar elementos
const modal = document.getElementById("userModal");
const openModalBtn = document.getElementById("adicionarUserBtn");
const closeBtn = document.querySelector(".fechar");
const cancelButton = document.querySelector(".cancelar");
const userForm = document.getElementById("Form");
const userListContainer = document.getElementById("listaUser-raiz");
const successNotification = document.getElementById("Notificacao-sucesso");

let editandoUser = null;

// Função para abrir o modal
function openModal() {
  modal.style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
  modal.style.display = "none";
  userForm.reset();
  editandoUser = null;
}

// Função de notificação
function showNotification(
  message = "Ação realizada com sucesso!",
  duration = 3000
) {
  successNotification.textContent = message;
  successNotification.classList.add("show");
  setTimeout(() => successNotification.classList.remove("show"), duration);
}

// Evento de submit do formulário (criar ou editar)
userForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nomeUsuario = document.getElementById("nomeUsuario").value;
  const loginUsuario = document.getElementById("loginUsuario").value;
  const senhaUsuario = document.getElementById("senhaUsuario").value;
  const tipoUsuario = document.getElementById("tipoUsuario").value;

  if (
    !nomeUsuario ||
    !loginUsuario ||
    !senhaUsuario ||
    !tipoUsuario ||
    !id_empresa
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const usuario = {
    nome_usuario: nomeUsuario,
    login_usuario: loginUsuario,
    senha_usuario: senhaUsuario,
    tipo_usuario: tipoUsuario,
    id_empresa_usuario: id_empresa,
  };

  const url = editandoUser
    ? `http://localhost:3000/usuarios/${editandoUser}`
    : "http://localhost:3000/usuarios";

  const method = editandoUser ? "PUT" : "POST";

  fetch(url, {
    method: method,
    credentials: "include",
    body: JSON.stringify(usuario),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao salvar usuário");
      return response.json();
    })
    .then((data) => {
      showNotification(data.mensagem || "Usuário salvo com sucesso!");
      closeModal();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário.");
    });
});

// Abrir modal ao clicar no botão
openModalBtn.addEventListener("click", function () {
  openModal();
});

// Fechar modal
closeBtn.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Função para excluir usuário
function excluirUsuario(id_usuario) {
  const user = usuarioMap.get(id_usuario);
  if (!user) {
    alert("Usuário não encontrado.");
    return;
  }

  if (user.tipo_usuario == 0) {
    alert("Você não tem permissão para excluir este usuário.");
    return;
  }

  fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao excluir usuário");
      return response.json();
    })
    .then((data) => {
      console.log("Usuário excluído com sucesso:", data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário.");
    });
}

// Função para iniciar edição de usuário
function editaUsuario(id_usuario) {
  const user = usuarioMap.get(id_usuario);
  if (!user) {
    alert("Usuário não encontrado.");
    return;
  }

  document.getElementById("nomeUsuario").value = user.nome_usuario;
  document.getElementById("loginUsuario").value = user.login_usuario;
  document.getElementById("senhaUsuario").value = user.senha_usuario;
  document.getElementById("tipoUsuario").value = user.tipo_usuario;

  editandoUser = id_usuario;
  openModal();
}
