const API_URL = "http://localhost:3000/alunos";
const D = document;
const alunosList = D.getElementById("alunos-list");
const alunoForm = D.getElementById("aluno-form");
const submitText = D.getElementById("submit-text");
const formTitle = D.getElementById("form-title");
const alunoIdInput = D.getElementById("aluno-id");
const nomeInput = D.getElementById("nome");
const matriculaInput = D.getElementById("matricula");
const cancelBtn = D.getElementById("cancel-button");
const msgBox = D.getElementById("message-box");

function customConfirm(message, onConfirm) {
  const modal = D.getElementById("confirm-modal");
  const msg = D.getElementById("confirm-message");
  const okBtn = D.getElementById("confirm-ok");
  const cancelBtn = D.getElementById("confirm-cancel");

  msg.textContent = message;
  modal.classList.remove("hidden");

  const removeListeners = () => {
    okBtn.removeEventListener("click", onOk);
    cancelBtn.removeEventListener("click", onCancel);
    modal.classList.add("hidden");
  };

  const onOk = () => {
    onConfirm(true);
    removeListeners();
  };

  const onCancel = () => {
    onConfirm(false);
    removeListeners();
  };

  okBtn.addEventListener("click", onOk, { once: true });
  cancelBtn.addEventListener("click", onCancel, { once: true });
}

function showMessage(message, type = "success") {
  msgBox.textContent = message;
  msgBox.className = `p-3 mb-6 rounded-lg shadow-md transition-opacity duration-300`;
    if (type === "success") {
    msgBox.classList.add("bg-green-100", "text-green-800");
  } else {
    msgBox.classList.add("bg-red-100", "text-red-800");
  }  
  msgBox.classList.remove("hidden"); 
  setTimeout(() => {
    msgBox.classList.add("hidden");
  }, 5000);
}

function resetForm() {
  alunoForm.reset();
  alunoIdInput.value = "";
  submitText.textContent = "Salvar Registro";
  formTitle.textContent = "Cadastrar Novo Registro";
  cancelBtn.classList.add("hidden");
}

async function fetchAlunos() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status} - ${response.statusText}`);
    }

    const alunos = await response.json();
    alunosList.innerHTML = "";

    if (alunos.length === 0) {
      alunosList.innerHTML =
        '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Nenhum registro cadastrado.</td></tr>';
      return;
    }

    alunos.forEach((a) => {
      const row = alunosList.insertRow();
      row.className = "hover:bg-gray-50 transition duration-100";

      row.insertCell(0).textContent = a.id;
      row.insertCell(1).textContent = a.nome;
      row.insertCell(2).textContent = a.matricula;

      const actionsCell = row.insertCell(3);
      actionsCell.className = "px-4 py-3 text-center whitespace-nowrap space-x-2";

      const editBtn = D.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.className =
        "text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-full";
      editBtn.onclick = () => loadAlunoForEdit(a);
      actionsCell.appendChild(editBtn);

      const deleteBtn = D.createElement("button");
      deleteBtn.textContent = "Excluir";
      deleteBtn.className =
        "text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-full ml-2";
      deleteBtn.onclick = () => deleteAluno(a.id, a.nome);
      actionsCell.appendChild(deleteBtn);
    });
  } catch (error) {
    console.error("Erro na Listagem:", error);
    // Mensagem aprimorada para erros de rede (Failed to fetch) ou erros HTTP
    showMessage(`Falha ao carregar lista. Verifique se a API está ativa: ${error.message}`, "error"); 
  }
}

function loadAlunoForEdit(aluno) {
  alunoIdInput.value = aluno.id;
  nomeInput.value = aluno.nome;
  matriculaInput.value = aluno.matricula;
  submitText.textContent = `Atualizar Registro ID ${aluno.id}`;
  formTitle.textContent = `Editar Registro ID ${aluno.id}`;
  cancelBtn.classList.remove("hidden");
}

function deleteAluno(id, nome) {
  customConfirm(`Tem certeza que deseja remover o registro ID ${id} - ${nome}?`, async (confirmed) => {
      if (!confirmed) return;

      try {
          const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

          if (response.status === 204) {
              showMessage(`Registro ID ${id} removido com sucesso!`);
              fetchAlunos();
          } else if (response.status === 404) {
              const data = await response.json(); 
              showMessage(`Erro 404: ${data.message}`, "error");
          } else {
              throw new Error(response.statusText);
          }
      } catch (error) {
          console.error("Erro na Exclusão:", error);
          showMessage(`Falha na exclusão: ${error.message}`, "error");
      }
  });
}

alunoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = alunoIdInput.value;
  const alunoData = { nome: nomeInput.value, matricula: matriculaInput.value };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alunoData),
    });

    // Se o PUT/POST foi bem-sucedido, o status 204 (No Content) ou 201/200 é esperado
    const data = response.status === 204 ? {} : await response.json();

    if (response.ok) {
      showMessage(
        `Registro de ${alunoData.nome} ${id ? "atualizado" : "inserido"} com sucesso!`
      );
      resetForm();
      fetchAlunos();
    } else {
      throw new Error(data.message || response.statusText);
    }
  } catch (error) {
    console.error(`Erro na requisição ${method}:`, error);
    showMessage(`Falha na requisição ${method}: ${error.message}`, "error");
  }
});

window.onload = fetchAlunos;