const estados = {
  sp: {
    populacao: '45 milhões',
    nome: 'São Paulo',
  },
  mg: {
    populacao: '21 milhões',
    nome: 'Minas Gerais',
  },
  rj: {
    populacao: '17 milhões',
    nome: 'Rio de Janeiro',
  },
};

for (const estado in estados) {
  console.log(estados[estado].nome, estados[estado].populacao);
}
