const vm = new Vue({
  el: "#app",
  data() {
    return {
      produtos: [],
      produto: false,
      carrinho: [],
      mensagemAlerta: "Item Adicionado",
      alertaAtivo: false,
      carrinhoAtivo: false,
    };
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((json) => (this.produtos = json));
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((json) => (this.produto = json));
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false;
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alerta(`${nome} foi adicionado ao carrinho.`);
    },
    removerItem(idx) {
      this.carrinho.splice(idx, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(localStorage.carrinho);
      }
    },
    comparaEstoque() {
      const items = this.carrinho.filter(({ id }) => {
        if (id === this.produto.id) {
          // verifica se o produto que ta no carrinho é igual ao clicado
          return true; // retora verdadeiro caso sim
        }
      });

      this.produto.estoque -= items.length; // remove do estoque aqueles items que ja estão no carrinho
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash.replace("#", "");
      if (hash) {
        this.fetchProduto(hash);
      }
    },
    cliqueForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
  },
  watch: {
    carrinho() {
      localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    produto() {
      document.title = this.produto.nome || "Techno";
      const hashURL = this.produto.id || "";
      history.pushState(null, null, "#" + hashURL);

      if (this.produto) {
        this.comparaEstoque();
      }
    },
  },
  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  },
});
