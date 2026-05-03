let aura = 0;
let cliqueValor = 1;
let autoCliqueValor = 0;
let faccaoEscolhida = null;

// ITENS REAIS DO SEU PROJETO PYTHON
const lojaItens = [
    {nome: "Criança chinesa farmadora", custo: 50, ganho: 1, tipo: "auto", faccao: 0, max: 20},
    {nome: "Guarda pó executivo", custo: 150, ganho: 2, tipo: "clique", faccao: 1},
    {nome: "Navalha de CP2", custo: 500, ganho: 5, tipo: "auto", faccao: 1},
    {nome: "Assistir aula de lógica", custo: 2000, ganho: 10, tipo: "clique", faccao: 2},
    {nome: "Usina de Aura do IFsul", custo: 8000, ganho: 50, tipo: "auto", faccao: 2},
    {nome: "Curso Confeccionador", custo: 25000, ganho: 500, tipo: "clique", unico: true, faccao: 1},
    {nome: "1 Talão de CS3", custo: 100000, ganho: 500, tipo: "auto", faccao: 1},
    {nome: "Sapateiro Robô do Senai", custo: 250000, ganho: 1000, tipo: "auto", faccao: 1},
    {nome: "Satélite de Aura do IFsul", custo: 750000, ganho: 5000, tipo: "auto", faccao: 2},
    {nome: "Lavagem de aura do Valter", custo: 2000000, ganho: 100000, tipo: "auto", faccao: 2}
];

// Lógica de Buff/Nerf (SENAI vs IFSUL)
function calcularM(item) {
    let c = item.custo; let g = item.ganho;
    if (faccaoEscolhida === "SENAI") {
        if (item.faccao === 1) { c *= 0.7; g *= 1.25; }
        else if (item.faccao === 2) { c *= 1.3; g *= 0.75; }
    } else if (faccaoEscolhida === "IFSUL") {
        if (item.faccao === 2) { c *= 0.7; g *= 1.25; }
        else if (item.faccao === 1) { c *= 1.3; g *= 0.75; }
    }
    return { c: Math.floor(c), g: Math.floor(g) };
}

// Loop de 1 segundo (Farm Automático)
setInterval(() => {
    aura += autoCliqueValor;
    document.getElementById('aura-display').innerText = `AURA: ${Math.floor(aura)}`;
}, 1000);
