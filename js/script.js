// TEMA CLARO E ESCURO

const botaoTema = document.getElementById("tema");

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "true") {
    document.body.classList.add("tema-escuro");
}

if (botaoTema) {
    botaoTema.addEventListener("click", function() {

        document.body.classList.toggle("tema-escuro");

        const temaAtivo = document.body.classList.contains("tema-escuro");

        localStorage.setItem("tema", temaAtivo);
    });
}


// FILTRO DOS PRODUTOS

const filtroCategoria = document.getElementById("categoria");

const produtos = document.querySelectorAll(".produto");

if (filtroCategoria) {

    filtroCategoria.addEventListener("change", function() {

        produtos.forEach(function(produto) {

            if (filtroCategoria.value === "todos" ||
                produto.dataset.categoria === filtroCategoria.value) {

                produto.style.display = "block";

            } else {

                produto.style.display = "none";
            }

        });

    });

    // FILTRO VINDO DA PÁGINA INICIAL

    const parametros = new URLSearchParams(window.location.search);

    const categoria = parametros.get("categoria");

    if (categoria === "chuteiras" ||
        categoria === "vestuario" ||
        categoria === "equipamentos" ||
        categoria === "acessorios") {

        filtroCategoria.value = categoria;

        filtroCategoria.dispatchEvent(new Event("change"));
    }

}


// CARRINHO

let produtoSelecionado = null;

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// ORGANIZA OS PRODUTOS SALVOS

const carrinhoOrganizado = [];

carrinho.forEach(function(produto) {

    const existente = carrinhoOrganizado.find(function(item) {
        return item.nome === produto.nome;
    });

    if (existente) {

        existente.quantidade += produto.quantidade || 1;

    } else {

        carrinhoOrganizado.push({
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: produto.quantidade || 1
        });
    }

});

carrinho = carrinhoOrganizado;

localStorage.setItem("carrinho", JSON.stringify(carrinho));


// CONTADOR DO CARRINHO

const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");

function atualizarContador() {

    let quantidadeTotal = 0;

    carrinho.forEach(function(produto) {
        quantidadeTotal += produto.quantidade;
    });

    if (quantidadeCarrinho) {
        quantidadeCarrinho.textContent = quantidadeTotal;
    }
}

atualizarContador();


// JANELA DE DETALHES DOS PRODUTOS

const janelaDetalhes = document.getElementById("detalhesProduto");

const botaoFechar = document.getElementById("fecharDetalhes");

if (janelaDetalhes && botaoFechar) {

    const botoesProdutos = document.querySelectorAll(".produto button");

    botoesProdutos.forEach(function(botao) {

        botao.addEventListener("click", function() {

            const produto = botao.closest(".produto");

            produtoSelecionado = produto;

            const nome = produto.querySelector("h3").textContent;
            const preco = produto.querySelector(".produto-info p").textContent;
            const imagem = produto.querySelector("img").src;
            const descricao = produto.dataset.descricao;

            document.getElementById("nomeDetalhes").textContent = nome;
            document.getElementById("precoDetalhes").textContent = preco;
            document.getElementById("imagemDetalhes").src = imagem;
            document.getElementById("descricaoDetalhes").textContent = descricao;

            janelaDetalhes.showModal();
        });

    });

    botaoFechar.addEventListener("click", function() {
        janelaDetalhes.close();
    });
}


// ADICIONAR PRODUTO AO CARRINHO

const botaoAdicionar = document.getElementById("adicionarCarrinho");

if (botaoAdicionar) {

    botaoAdicionar.addEventListener("click", function() {

        if (produtoSelecionado) {

            const nome = produtoSelecionado.querySelector("h3").textContent;
            const preco = produtoSelecionado.querySelector(".produto-info p").textContent;
            const imagem = produtoSelecionado.querySelector("img").src;

            const produtoExistente = carrinho.find(function(item) {
                return item.nome === nome;
            });

            if (produtoExistente) {

                produtoExistente.quantidade += 1;

            } else {

                const produto = {
                    nome: nome,
                    preco: preco,
                    imagem: imagem,
                    quantidade: 1
                };

                carrinho.push(produto);
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            atualizarContador();

            console.log("Carrinho atualizado:", carrinho);
        }

    });
}


// EXIBIR PRODUTOS NA PÁGINA DO CARRINHO

const listaCarrinho = document.getElementById("listaCarrinho");

if (listaCarrinho) {

    let total = 0;

    carrinho.forEach(function(produto, indice) {

        const valor = Number(
            produto.preco
                .replace("R$", "")
                .replace(/\s/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
        );

        total += valor * produto.quantidade;

        const card = document.createElement("article");

        card.classList.add("item-carrinho");

        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">

            <div>
                <h3>${produto.nome}</h3>
                <p>${produto.preco}</p>

                <div class="controle-quantidade">
                    <button class="diminuir">−</button>
                    <span>${produto.quantidade}</span>
                    <button class="aumentar">+</button>
                </div>

                <button class="remover-produto">Remover</button>
            </div>
        `;

        listaCarrinho.appendChild(card);

        const botaoAumentar = card.querySelector(".aumentar");
        const botaoDiminuir = card.querySelector(".diminuir");
        const botaoRemover = card.querySelector(".remover-produto");

        // AUMENTAR QUANTIDADE

        botaoAumentar.addEventListener("click", function() {

            produto.quantidade += 1;

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            location.reload();
        });

        // DIMINUIR QUANTIDADE

        botaoDiminuir.addEventListener("click", function() {

            if (produto.quantidade > 1) {
                produto.quantidade -= 1;
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            location.reload();
        });

        // REMOVER PRODUTO

        botaoRemover.addEventListener("click", function() {

            carrinho.splice(indice, 1);

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            location.reload();
        });

    });

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    const totalCarrinho = document.getElementById("totalCarrinho");

    if (totalCarrinho) {
        totalCarrinho.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
}


// ABRIR A PÁGINA DO CARRINHO

const botaoAbrirCarrinho = document.getElementById("abrirCarrinho");

if (botaoAbrirCarrinho) {

    botaoAbrirCarrinho.addEventListener("click", function() {
        window.location.href = "carrinho.html";
    });
}


// PAGAMENTO SIMULADO

const botaoFinalizar = document.getElementById("finalizarCompra");
const dialogPagamento = document.getElementById("dialogPagamento");

const pagamentoSim = document.getElementById("pagamentoSim");
const pagamentoNao = document.getElementById("pagamentoNao");

if (botaoFinalizar && dialogPagamento && pagamentoSim && pagamentoNao) {

    botaoFinalizar.addEventListener("click", function() {

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const total = document.getElementById("totalCarrinho").textContent;

        document.getElementById("totalPagamento").textContent = total;

        dialogPagamento.showModal();
    });

    pagamentoSim.addEventListener("click", function() {

        alert("Pagamento confirmado! Pedido realizado com sucesso!");

        carrinho = [];

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        atualizarContador();

        dialogPagamento.close();

        location.reload();
    });

    pagamentoNao.addEventListener("click", function() {

        dialogPagamento.close();
    });
}