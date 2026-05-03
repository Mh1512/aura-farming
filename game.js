// --- VARIÁVEIS TIPO PYGAME ---
let aura = 0;
let nivel = 1;
let cliqueValor = 1;
let autoCliqueValor = 0;
let faccaoEscolhida = null;

const thresholds = [0, 100, 500, 1500, 5000, 15000, 50000, 150000, 500000, 1000000];
const nomesNiveis = ["Chão de Fábrica", "Usuário de Balancim", "Mestre dos GD's", "Chefe do Setor", "Arauto da Montagem", "Confeccionador de Calçados Premium", "Amigo Pessoal do Alcides", "Nem a Sora Larissa te Alcança", "Discípulo do Professor Xavier", "Mestre do IFsul, do SENAI e da AURA"];

// LISTA COMPLETA 100% IGUAL AO SEU PYTHON
let lojaItens = [
    {nome: "Criança chinesa farmadora", custo: 50, ganho: 1, tipo: "auto", nivel: 1, faccao: 0, max: 20},
    {nome: "Guarda pó executivo", custo: 150, ganho: 2, tipo: "clique", nivel: 1, faccao: 1},
    {nome: "Navalha de CP2", custo: 500, ganho: 5, tipo: "auto", nivel: 1, faccao: 1},
    {nome: "Assistir aula de lógica", custo: 2000, ganho: 10, tipo: "clique", nivel: 1, faccao: 2},
    {nome: "Usina de Aura do IFsul", custo: 8000, ganho: 50, tipo: "auto", nivel: 1, faccao: 2},
    {nome: "Curso Confeccionador", custo: 25000, ganho: 500, tipo: "clique", nivel: 1, unico: true, faccao: 1},
    {nome: "1 Talão de CS3", custo: 100000, ganho: 500, tipo: "auto", nivel: 1, faccao: 1},
    {nome: "Sapateiro Robô do Senai", custo: 250000, ganho: 1000, tipo: "auto", nivel: 1, faccao: 1},
    {nome: "Satélite de Aura do IFsul", custo: 750000, ganho: 5000, tipo: "auto", nivel: 1, faccao: 2},
    {nome: "Lavagem de aura do Valter", custo: 2000000, ganho: 100000, tipo: "auto", nivel: 1, faccao: 2}
];

// --- FUNÇÕES DE LÓGICA ---
function getModificadores(item) {
    let c = item.custo;
    let g = item.ganho;
    let modC = ""; let modG = "";
    let clrC = "white"; let clrG = "#ffd700";

    if (faccaoEscolhida === "SENAI") {
        if (item.faccao === 1) { c *= 0.7; g *= 1.25; modC = " (-30%)"; modG = " (+25%)"; clrC = "#50ff50"; clrG = "#50ff50"; }
        else if (item.faccao === 2) { c *= 1.3; g *= 0.75; modC = " (+30%)"; modG = " (-25%)"; clrC = "#ff5050"; clrG = "#ff5050"; }
    } else if (faccaoEscolhida === "IFSUL") {
        if (item.faccao === 2) { c *= 0.7; g *= 1.25; modC = " (-30%)"; modG = " (+25%)"; clrC = "#50ff50"; clrG = "#50ff50"; }
        else if (item.faccao === 1) { c *= 1.3; g *= 0.75; modC = " (+30%)"; modG = " (-25%)"; clrC = "#ff5050"; clrG = "#ff5050"; }
    }
    return { c: Math.floor(c), g: Math.floor(g), modC, modG, clrC, clrG };
}

function atualizarUI() {
    document.getElementById('aura-display').innerText = `AURA: ${Math.floor(aura)}`;
    for (let i = thresholds.length - 1; i >= 0; i--) { if (aura >= thresholds[i]) { nivel = i + 1; break; } }
    document.getElementById('nivel-texto').innerText = `Nível ${nivel}: ${nomesNiveis[nivel-1]}`;
    
    let pct = nivel < 10 ? ((aura - thresholds[nivel-1]) / (thresholds[nivel] - thresholds[nivel-1])) * 100 : 100;
    document.getElementById('progress-bar').style.width = `${Math.min(100, pct)}%`;
    document.getElementById('clique-seg-info').innerText = `Clique: ${cliqueValor} | Seg: ${autoCliqueValor}`;
    renderizarLoja();
}

function renderizarLoja() {
    const container = document.getElementById('loja-itens');
    container.innerHTML = "";
    lojaItens.forEach((item, index) => {
        const m = getModificadores(item);
        const travado = (item.unico && item.nivel > 1) || (item.max && (item.nivel-1) >= item.max);
        const div = document.createElement('div');
        div.className = `item-loja ${aura >= m.c && !travado ? '' : 'bloqueado'}`;
        
        if (travado) {
            div.innerHTML = `<strong>LIMITE OBTIDO</strong>`;
        } else {
            let nomeExibicao = item.max ? `${item.nome} (${(item.nivel-1).toString().padStart(2, '0')}/${item.max})` : `${item.nome} v${item.nivel}`;
            div.innerHTML = `
                <strong style="font-size: 14px">${nomeExibicao}</strong>
                <span style="font-size: 12px">Custo: ${m.c} <span style="color:${m.clrC}">${m.modC}</span></span>
                <span style="font-size: 12px; color:#ffd700">+${m.g} ${item.tipo === 'clique' ? 'Cliq' : 'Seg'} <span style="color:${m.clrG}">${m.modG}</span></span>
            `;
            div.onclick = () => {
                if (aura >= m.c) {
                    aura -= m.c;
                    item.nivel++;
                    if (item.tipo === "clique") cliqueValor += m.g;
                    else autoCliqueValor += m.g;
                    if(!item.unico) item.custo = Math.floor(item.custo * 1.7);
                    atualizarUI();
                }
            };
        }
        container.appendChild(div);
    });
}

// --- CONTROLES DE INTERAÇÃO (O QUE ESTAVA FALTANDO) ---
document.getElementById('cristal').onclick = () => {
    aura += cliqueValor;
    atualizarUI();
};

document.getElementById('btn-senai').onclick = () => abrirModal("SENAI");
document.getElementById('btn-ifsul').onclick = () => abrirModal("IFSUL");
document.getElementById('btn-jogar').onclick = () => {
    if(!faccaoEscolhida) abrirModal("NENHUMA");
    else iniciarJogo();
};
document.getElementById('btn-voltar-menu').onclick = () => {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'flex';
};

function abrirModal(f) {
    document.getElementById('modal-confirm').style.display = 'flex';
    document.getElementById('modal-title').innerText = `SE ALIAR AO ${f}?`;
    document.getElementById('confirm-sim').onclick = () => {
        faccaoEscolhida = f;
        document.getElementById('modal-confirm').style.display = 'none';
        iniciarJogo();
    };
    document.getElementById('confirm-nao').onclick = () => {
        document.getElementById('modal-confirm').style.display = 'none';
    };
}

function iniciarJogo() {
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    const cor = faccaoEscolhida === "SENAI" ? "var(--azul-senai)" : (faccaoEscolhida === "IFSUL" ? "var(--verde-ifsul)" : "var(--roxo-aura)");
    document.getElementById('cristal').style.background = cor;
    atualizarUI();
}

// LOOP DE TEMPO (FARM POR SEGUNDO)
setInterval(() => {
    aura += autoCliqueValor;
    atualizarUI();
}, 1000);