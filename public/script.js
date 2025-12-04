const API_URL = "http://localhost:3001";

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-blue-700', 'font-bold', 'border-b-4', 'border-yellow-400', 'opacity-100');
        el.classList.add('opacity-80');
    });

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-${tabName}`);
    activeBtn.classList.add('bg-blue-700', 'font-bold', 'border-b-4', 'border-yellow-400', 'opacity-100');
    activeBtn.classList.remove('opacity-80');

    if (tabName === 'alunos') fetchAlunos();
    if (tabName === 'disciplinas') fetchDisciplinas();
    if (tabName === 'notas') { fetchNotas(); carregarSelects(); }
}

function showMessage(msg, type = 'success') {
    const box = document.getElementById('message-box');
    box.textContent = msg;
    box.className = `p-4 mb-6 rounded-lg shadow-md transition-all text-white text-center font-bold ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3000);
}

function resetForm(tipo) {
    document.getElementById(`form-${tipo}`).reset();
    document.getElementById(`${tipo}-id`).value = ''; 
    
    const btn = document.getElementById(`btn-salvar-${tipo}`);
    const btnCancel = document.getElementById(`btn-cancel-${tipo}`);
    
    if(tipo === 'aluno') {
        btn.innerHTML = '<i class="fas fa-save mr-1"></i> Salvar';
        btn.className = "w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-bold shadow";
    }
    if(tipo === 'disc') { 
        btn.innerHTML = '<i class="fas fa-save mr-1"></i> Salvar';
        btn.className = "w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-bold shadow";
    }
    if(tipo === 'nota') {
        btn.innerHTML = '<i class="fas fa-check mr-1"></i> Lançar';
        btn.className = "bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition font-bold shadow";
    }

    if(btnCancel) btnCancel.classList.add('hidden');
}

// Função responsável por buscar dados na API e atualizar a interface
async function fetchAlunos() {
    try {
        const res = await fetch(`${API_URL}/alunos`);
        const alunos = await res.json();
        const tbody = document.getElementById('lista-alunos');
        tbody.innerHTML = '';
        
        alunos.forEach(a => {
            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-6">${a.id}</td>
                    <td class="py-3 px-6 font-medium">${a.nome}</td>
                    <td class="py-3 px-6">${a.matricula}</td>
                    <td class="py-3 px-6 text-center space-x-2">
                        <button onclick="prepararEdicaoAluno(${a.id})" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                        <button onclick="deletarItem('alunos', ${a.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function prepararEdicaoAluno(id) {
    try {
        const res = await fetch(`${API_URL}/alunos/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar dados do aluno");
        
        const aluno = await res.json();

        document.getElementById('aluno-id').value = aluno.id || '';
        document.getElementById('aluno-nome').value = aluno.nome || '';
        document.getElementById('aluno-matricula').value = aluno.matricula || '';
        
        const btn = document.getElementById('btn-salvar-aluno');
        btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Atualizar';
        btn.className = "w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition font-bold shadow";
        
        document.getElementById('btn-cancel-aluno').classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error(error);
        showMessage("Não foi possível carregar o aluno para edição.", "error");
    }
}

document.getElementById('form-aluno').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('aluno-id').value;
    const nome = document.getElementById('aluno-nome').value.trim(); 
    const matriculaInput = document.getElementById('aluno-matricula').value.trim();

    const dados = {};

    if (nome) dados.nome = nome;

    if (matriculaInput !== "") {
        dados.matricula = Number(matriculaInput);
    }

    if (id) {
        await atualizar(`${API_URL}/alunos/${id}`, dados, fetchAlunos);
        resetForm('aluno'); 

    } else {
        if (!dados.nome || !dados.matricula) {
            showMessage("Para cadastrar, preencha Nome e Matrícula!", "error");
            return;
        }
        await cadastrar(`${API_URL}/alunos`, dados, fetchAlunos);
        resetForm('aluno');
    }
});

async function fetchDisciplinas() {
    try {
        const res = await fetch(`${API_URL}/disciplinas`);
        const discs = await res.json();
        const tbody = document.getElementById('lista-disciplinas');
        tbody.innerHTML = '';
        discs.forEach(d => {
            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-6">${d.id}</td>
                    <td class="py-3 px-6 font-medium">${d.nome}</td>
                    <td class="py-3 px-6">${d.professor}</td>
                    <td class="py-3 px-6 text-center space-x-2">
                        <button onclick="prepararEdicaoDisciplina(${d.id})" class="text-indigo-500 hover:text-indigo-700"><i class="fas fa-edit"></i></button>
                        <button onclick="deletarItem('disciplinas', ${d.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function prepararEdicaoDisciplina(id) {
    try {
        const res = await fetch(`${API_URL}/disciplinas`);
        if (!res.ok) throw new Error("Erro ao buscar disciplinas");
        
        const todas = await res.json();
        const disc = todas.find(d => d.id === id);

        if (!disc) throw new Error("Disciplina não encontrada localmente");

        document.getElementById('disc-id').value = disc.id;
        document.getElementById('disc-nome').value = disc.nome || '';
        document.getElementById('disc-prof').value = disc.professor || '';

        const btn = document.getElementById('btn-salvar-disc');
        btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Atualizar';
        btn.className = "w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition font-bold shadow";
        
        document.getElementById('btn-cancel-disc').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error(error);
        showMessage("Erro ao carregar disciplina.", "error");
    }
}

document.getElementById('form-disciplina').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('disc-id').value;
    const nome = document.getElementById('disc-nome').value;
    const professor = document.getElementById('disc-prof').value;
    const dados = { nome, professor };

    if(id) await atualizar(`${API_URL}/disciplinas/${id}`, dados, fetchDisciplinas);
    else await cadastrar(`${API_URL}/disciplinas`, dados, fetchDisciplinas);
    resetForm('disc'); 
    document.getElementById('btn-cancel-disc').classList.add('hidden');
});

async function carregarSelects() {
    const [resA, resD] = await Promise.all([fetch(`${API_URL}/alunos`), fetch(`${API_URL}/disciplinas`)]);
    const alunos = await resA.json();
    const discs = await resD.json();

    const selA = document.getElementById('nota-aluno-select');
    const selFiltro = document.getElementById('filtro-aluno');
    selA.innerHTML = '<option value="">Selecione...</option>';
    selFiltro.innerHTML = '<option value="">Mostrar Todos</option>';
    alunos.forEach(a => {
        const opt = `<option value="${a.id}">${a.nome}</option>`;
        selA.innerHTML += opt;
        selFiltro.innerHTML += opt;
    });

    const selD = document.getElementById('nota-disciplina-select');
    selD.innerHTML = '<option value="">Selecione...</option>';
    discs.forEach(d => selD.innerHTML += `<option value="${d.id}">${d.nome}</option>`);
}

async function filtrarBoletim() {
    const id = document.getElementById('filtro-aluno').value;
    fetchNotas(id ? `${API_URL}/notas/aluno/${id}` : null);
}

async function fetchNotas(customUrl = null) {
    try {
        const res = await fetch(customUrl || `${API_URL}/notas`);
        const notas = await res.json();
        const tbody = document.getElementById('lista-notas');
        tbody.innerHTML = '';

        notas.forEach(n => {
            let badge = "bg-gray-200 text-gray-800";
            if(n.status === 'Aprovado') badge = "bg-green-100 text-green-800";
            if(n.status === 'Reprovado') badge = "bg-red-100 text-red-800";
            if(n.status === 'Recuperação') badge = "bg-yellow-100 text-yellow-800";

            tbody.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">${n.aluno.nome}</td>
                    <td class="py-3 px-4">${n.disciplina.nome}</td>
                    <td class="py-3 px-2 text-center">${n.nota1}</td>
                    <td class="py-3 px-2 text-center">${n.nota2}</td>
                    <td class="py-3 px-2 text-center font-bold">${n.media}</td>
                    <td class="py-3 px-4 text-center"><span class="${badge} px-2 py-1 rounded text-xs font-bold uppercase">${n.status}</span></td>
                    <td class="py-3 px-4 text-center space-x-2">
                        <button onclick="prepararEdicaoNota(${n.id})" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                        <button onclick="deletarItem('notas', ${n.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function prepararEdicaoNota(id) {
    const res = await fetch(`${API_URL}/notas`);
    const todas = await res.json();
    const nota = todas.find(n => n.id === id);

    document.getElementById('nota-id').value = nota.id;
    document.getElementById('nota-aluno-select').value = nota.aluno.id;
    document.getElementById('nota-disciplina-select').value = nota.disciplina.id;
    document.getElementById('nota-n1').value = nota.nota1;
    document.getElementById('nota-n2').value = nota.nota2;

    const btn = document.getElementById('btn-salvar-nota');
    btn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Atualizar';
    btn.className = "bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition font-bold shadow";
    document.getElementById('btn-cancel-nota').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('form-nota').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('nota-id').value;
    const alunoId = document.getElementById('nota-aluno-select').value;
    const disciplinaId = document.getElementById('nota-disciplina-select').value;
    const nota1 = document.getElementById('nota-n1').value;
    const nota2 = document.getElementById('nota-n2').value;

    const dados = { alunoId: Number(alunoId), disciplinaId: Number(disciplinaId), nota1, nota2 };

    if(id) await atualizar(`${API_URL}/notas/${id}`, dados, fetchNotas);
    else await cadastrar(`${API_URL}/notas`, dados, fetchNotas);
    resetForm('nota');
});

async function cadastrar(url, data, cb) {
    try {
        const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
        if(res.ok) { showMessage("Salvo com sucesso!"); cb(); }
        else { const err = await res.json(); showMessage(`Erro: ${err.erro}`, 'error'); }
    } catch (e) { showMessage("Erro de conexão", 'error'); }
}

async function atualizar(url, data, cb) {
    try {
        const res = await fetch(url, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
        if(res.ok) { showMessage("Atualizado com sucesso!"); cb(); }
        else { const err = await res.json(); showMessage(`Erro: ${err.erro}`, 'error'); }
    } catch (e) { showMessage("Erro de conexão", 'error'); }
}

async function deletarItem(rota, id) {
    if(!confirm("Tem certeza?")) return;
    await fetch(`${API_URL}/${rota}/${id}`, { method: 'DELETE' });
    if(rota === 'alunos') fetchAlunos();
    if(rota === 'disciplinas') fetchDisciplinas();
    if(rota === 'notas') fetchNotas();
    showMessage("Removido.");
}

showTab('alunos');
