import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cardapio = {
  cafe: { descricao: "Café", valor: 3.00 },
  chantily: { descricao: "Chantily (extra do Café)", valor: 1.50 },
  suco: { descricao: "Suco Natural", valor: 6.20 },
  sanduiche: { descricao: "Sanduíche", valor: 6.50 },
  queijo: { descricao: "Queijo (extra do Sanduíche)", valor: 2.00 },
  salgado: { descricao: "Salgado", valor: 7.25 },
  combo1: { descricao: "1 Suco e 1 Sanduíche", valor: 9.50 },
  combo2: { descricao: "1 Café e 1 Sanduíche", valor: 7.50 }
};

class CaixaDaLanchonete {
  calcularValorDaCompra(metodoDePagamento, itens) {
    if (itens.length === 0) {
      return "Não há itens no carrinho de compra!";
    }

    let valorTotal = 0;
    const carrinhoDaDB = [];

    for (let i = 0; i < itens.length; i++) {
      const item = this.validarItem(itens[i], carrinhoDaDB);

      if (typeof item === "string") {
        return item;
      }

      const { codigo, quantidade } = item;
      const valorItem = cardapio[codigo].valor * quantidade;

      valorTotal += valorItem;
    }

    const valorComDesconto = this.aplicarDesconto(valorTotal, metodoDePagamento);

    if (typeof valorComDesconto == "string") return valorComDesconto

    const valorFormatado = this.formatarValor(valorComDesconto)

    return "R$ " + valorFormatado;
  }

  validarItem(item, carrinhoDaDB) {
    if (!item.includes(',')) {
      return "Item inválido!";
    }

    const [codigo, quantidade] = item.split(',');

    if (isNaN(parseInt(quantidade)) || parseInt(quantidade) <= 0) {
      return "Quantidade inválida!";
    }

    if (!cardapio.hasOwnProperty(codigo)) {
      return "Item inválido!";
    }

    if (codigo === "chantily" && !carrinhoDaDB.find(item => item.codigo === "cafe")) {
      return "Item extra não pode ser pedido sem o principal";
    }

    if (codigo === "queijo" && !carrinhoDaDB.find(item => item.codigo === "sanduiche")) {
      return "Item extra não pode ser pedido sem o principal";
    }

    carrinhoDaDB.push({
      codigo,
      quantidade: parseInt(quantidade)
    });

    return { codigo, quantidade: parseInt(quantidade) };
  }

  aplicarDesconto(valorTotal, metodoDePagamento) {
    if (metodoDePagamento === "dinheiro") {
      valorTotal *= 0.95;
    } else if (metodoDePagamento === "credito") {
      valorTotal *= 1.03;
    } else if (metodoDePagamento !== "debito") {
      return "Forma de pagamento inválida!";
    }

    return valorTotal;
  }

  formatarValor(valorTotal) {
    
      return valorTotal.toFixed(2).replace(".", ",");
  }
}

export { CaixaDaLanchonete };

function displayCardapio() {
  console.log(`
            => CARDÁPIO DB LANCHONETE

            -----------------------------------------------------
            | CÓDIGO    | DESCRIÇÃO                   | VALOR   |
            |-----------|-----------------------------|---------|
            | cafe      | Café                        | R$ 3,00 |
            |-----------|-----------------------------|---------|
            | chantily  | Chantily (extra do Café)    | R$ 1,50 |
            |-----------|-----------------------------|---------|
            | suco      | Suco Natural                | R$ 6,20 |
            |-----------|-----------------------------|---------|
            | sanduiche | Sanduíche                   | R$ 6,50 |
            |-----------|-----------------------------|---------|
            | queijo    | Queijo (extra do Sanduíche) | R$ 2,00 |
            |-----------|-----------------------------|---------|
            | salgado   | Salgado                     | R$ 7,25 |
            |-----------|-----------------------------|---------|
            | combo1    | 1 Suco e 1 Sanduíche        | R$ 9,50 |
            |-----------|-----------------------------|---------|
            | combo2    | 1 Café e 1 Sanduíche        | R$ 7,50 |
            |---------------------------------------------------|
        
        `);
}

function lerInput() {
  const itensArray = [];

  const adicionarItem = () => {
    rl.question("Digite o código do item: ", (codigo) => {
      rl.question("Digite a quantidade: ", (quantidade) => {
        let item = `${codigo},${quantidade}`
        itensArray.push(item);

        rl.question("Deseja adicionar mais algum item? (S/N): ", (resposta) => {
          if (resposta.toLowerCase() === "s") {
            adicionarItem();
          } else {
            rl.question("Forma de pagamento: ", (metodoDePagamento) => {
              const valorDaCompra = new CaixaDaLanchonete().calcularValorDaCompra(metodoDePagamento, itensArray);
              console.log(valorDaCompra);
              rl.close();
            });
          }
        });
      });
    });
  };
  adicionarItem();
}

displayCardapio();
lerInput();