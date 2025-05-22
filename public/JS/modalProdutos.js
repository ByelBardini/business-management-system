// Selecionar elementos
const modal = document.getElementById("productModal");
const openModalBtn = document.getElementById("adicionarProdutoBtn");
const closeBtn = document.querySelector(".fechar");
const cancelButton = document.querySelector(".cancelar");
const imagePreview = document.getElementById("imagePreview");
const productImageInput = document.getElementById("productImage");
const productForm = document.getElementById("productForm");
const ProductListContainer = document.getElementById("listaproduto-raiz");
const successNotification = document.getElementById("Notificacao-sucesso");

let editandoProduto = null;

// Função para abrir o modal
function openModal() {
  modal.style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
  modal.style.display = "none";
  productForm.reset();
  imagePreview.style.backgroundImage = "";
  imagePreview.textContent = "+";
  editandoProduto = null;
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

// Evento de submit do formulário
productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nomeProduto = document.getElementById("productName").value;
  const descricaoProduto = document.getElementById("productDescription").value;
  const precoProduto = document.getElementById("productPrice").value;
  const quantidadeProduto = document.getElementById("productQuantity").value;
  const imagemProduto = productImageInput.files[0];
  const idEmpresa = localStorage.getItem("id_empresa_usuario");

  if (
    !nomeProduto ||
    !descricaoProduto ||
    !precoProduto ||
    !quantidadeProduto ||
    !idEmpresa ||
    !imagemProduto
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const formData = new FormData();
  formData.append("nome_produto", nomeProduto);
  formData.append("preco_produto", precoProduto);
  formData.append("quantidade_estoque", quantidadeProduto);
  formData.append("imagem_produto", imagemProduto);
  formData.append("descricao_produto", descricaoProduto);
  formData.append("id_empresa_produto", idEmpresa);

  const url = editandoProduto
    ? `http://localhost:3000/produtos/${editandoProduto}`
    : "http://localhost:3000/produtos";

  const method = editandoProduto ? "PUT" : "POST";

  fetch(url, {
    method: method,
    credentials: "include",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao salvar produto");
      return response.json();
    })
    .then((data) => {
      showNotification(data.mensagem || "Produto salvo com sucesso!");
      window.location.reload();
      closeModal();
    })
    .catch((error) => {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto.");
    });
});

// Eventos
openModalBtn.addEventListener("click", function () {
  editedProductElement = null;
  openModal();
});
closeBtn.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

// Fechar modal quando clicar fora do conteúdo
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Ação ao clicar na pré-visualização da imagem
imagePreview.addEventListener("click", function () {
  productImageInput.click();
});

// Mostrar a imagem selecionada na pré-visualização
productImageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.style.backgroundImage = `url(${e.target.result})`;
      imagePreview.innerHTML = "";
    };
    reader.readAsDataURL(file);
  }
});

function deleta(id_produto) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  const id = id_produto;
  fetch(`http://localhost:3000/produtos/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      showNotification("Produto excluído com sucesso!");
      window.location.reload();
    } else {
      throw new Error("Erro ao excluir produto");
    }
  });
}

function edita(id_produto) {
  const produto = produtoMap.get(id_produto);
  if (!produto) return;

  editandoProduto = id_produto;

  document.getElementById("productName").value = produto.nome_produto;
  document.getElementById("productDescription").value =
    produto.descricao_produto;
  document.getElementById("productPrice").value = produto.preco_produto;
  document.getElementById("productQuantity").value = produto.quantidade_estoque;

  if (produto.imagem_produto?.data) {
    const base64 = arrayBufferToBase64(produto.imagem_produto.data);
    imagePreview.style.backgroundImage = `url(data:image/jpeg;base64,${base64})`;
    imagePreview.innerHTML = "";
  } else {
    imagePreview.style.backgroundImage = `url('/images/placeholder.png')`;
    imagePreview.innerHTML = "";
  }

  openModal();
}
