import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { CarrinhoService } from '../services/carrinho.service';
import { ItemCarrinho } from '../models/item-carrinho.model';

@Component({
  selector: 'app-carrinho',
  standalone: false,
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {
  itensCarrinho: ItemCarrinho[] = [];
  valorFrete: number = 21.54;
  carregando: boolean = true;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit() {
    this.carregarCarrinho();
  }

  ionViewWillEnter() {
    // Atualiza o carrinho sempre que a página for acessada
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    try {
      this.carregando = true;
      this.itensCarrinho = this.carrinhoService.obterItens();
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      this.mostrarToast('Erro ao carregar carrinho', 'danger');
    } finally {
      this.carregando = false;
    }
  }

  // Getters para cálculos do resumo
  get subtotalCarrinho(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.subtotal, 0);
  }

  get totalGeral(): number {
    return this.subtotalCarrinho + this.valorFrete;
  }

  get carrinhoVazio(): boolean {
    return this.itensCarrinho.length === 0;
  }

  get temDesconto(): boolean {
    return this.itensCarrinho.some(
      (item) =>
        item.produto.valorNormal &&
        item.produto.valorNormal > item.produto.valorComDesconto
    );
  }

  get valorEconomizado(): number {
    return this.itensCarrinho.reduce((economia, item) => {
      if (
        item.produto.valorNormal &&
        item.produto.valorNormal > item.produto.valorComDesconto
      ) {
        const descontoUnitario =
          item.produto.valorNormal - item.produto.valorComDesconto;
        return economia + descontoUnitario * item.quantidade;
      }
      return economia;
    }, 0);
  }

  get quantidadeTotal(): number {
    return this.itensCarrinho.reduce(
      (total, item) => total + item.quantidade,
      0
    );
  }

  formatarMoeda(valor: number): string {
    if (typeof valor !== 'number' || isNaN(valor)) {
      return 'R$ 0,00';
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  calcularDesconto(valorNormal: number, valorComDesconto: number): number {
    if (valorNormal <= 0) return 0;
    return Math.round(((valorNormal - valorComDesconto) / valorNormal) * 100);
  }

  aumentarQuantidade(index: number) {
    if (index >= 0 && index < this.itensCarrinho.length) {
      const item = this.itensCarrinho[index];

      // Adiciona mais 1 unidade do produto
      this.carrinhoService.adicionarProduto(item.produto, 1);

      // Recarrega os itens do carrinho
      this.carregarCarrinho();

      this.mostrarToast('Quantidade atualizada', 'success');
    }
  }

  diminuirQuantidade(index: number) {
    if (index >= 0 && index < this.itensCarrinho.length) {
      const item = this.itensCarrinho[index];

      if (item.quantidade > 1) {
        // Remove o produto e adiciona com quantidade - 1
        this.carrinhoService.removerProduto(item.produto.codigo);
        this.carrinhoService.adicionarProduto(
          item.produto,
          item.quantidade - 1
        );

        // Recarrega os itens do carrinho
        this.carregarCarrinho();

        this.mostrarToast('Quantidade atualizada', 'success');
      } else {
        // Se quantidade for 1, pergunta se quer remover
        this.confirmarRemocaoItem(index);
      }
    }
  }

  async atualizarQuantidadeManual(index: number, novaQuantidade: string) {
    const quantidade = parseInt(novaQuantidade);

    if (isNaN(quantidade) || quantidade < 1) {
      await this.mostrarToast(
        'Quantidade deve ser um número maior que zero',
        'warning'
      );
      return;
    }

    if (index >= 0 && index < this.itensCarrinho.length) {
      const item = this.itensCarrinho[index];

      // Remove o produto atual e adiciona com a nova quantidade
      this.carrinhoService.removerProduto(item.produto.codigo);
      this.carrinhoService.adicionarProduto(item.produto, quantidade);

      // Recarrega os itens do carrinho
      this.carregarCarrinho();

      this.mostrarToast('Quantidade atualizada', 'success');
    }
  }

  async confirmarRemocaoItem(index: number) {
    const item = this.itensCarrinho[index];

    const alert = await this.alertController.create({
      header: 'Remover Item',
      message: `Deseja remover "${item.produto.descricao}" do carrinho?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Remover',
          cssClass: 'danger',
          handler: () => {
            this.removerItem(index);
          },
        },
      ],
    });

    await alert.present();
  }

  removerItem(index: number) {
    if (index >= 0 && index < this.itensCarrinho.length) {
      const item = this.itensCarrinho[index];

      // Remove do serviço
      this.carrinhoService.removerProduto(item.produto.codigo);

      // Recarrega os itens do carrinho
      this.carregarCarrinho();

      this.mostrarToast('Item removido do carrinho', 'warning');
    }
  }

  async limparCarrinho() {
    if (this.carrinhoVazio) {
      await this.mostrarToast('Carrinho já está vazio', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Limpar Carrinho',
      message: 'Deseja remover todos os itens do carrinho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: () => {
            this.carrinhoService.limparCarrinho();
            this.carregarCarrinho();
            this.mostrarToast('Carrinho limpo com sucesso', 'success');
          },
        },
      ],
    });

    await alert.present();
  }

  async finalizarCompra() {
    if (this.carrinhoVazio) {
      await this.mostrarToast(
        'Adicione itens ao carrinho para continuar',
        'warning'
      );
      return;
    }

    try {
      // Validações básicas
      if (this.subtotalCarrinho <= 0) {
        await this.mostrarToast('Valor do carrinho inválido', 'danger');
        return;
      }

      // Confirma a finalização
      const alert = await this.alertController.create({
        header: 'Finalizar Compra',
        message: `Total: ${this.formatarMoeda(
          this.totalGeral
        )}\n\nDeseja finalizar a compra?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Confirmar',
            cssClass: 'primary',
            handler: () => {
              this.processarFinalizacao();
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      await this.mostrarToast('Erro ao processar compra', 'danger');
    }
  }

  private async processarFinalizacao() {
    await this.mostrarToast('Processando compra...', 'primary');

    // Captura os dados da compra antes de limpar o carrinho
    const dadosCompra = {
      subtotal: this.subtotalCarrinho,
      frete: this.valorFrete,
      total: this.totalGeral,
      valorEconomizado: this.temDesconto ? this.valorEconomizado : 0,
      quantidadeItens: this.quantidadeTotal,
      numeroPedido: this.gerarNumeroPedido(),
    };

    // Simula processamento
    setTimeout(async () => {
      try {
        // Limpa o carrinho após finalizar
        this.carrinhoService.limparCarrinho();
        this.carregarCarrinho();

        // Navega para página de resultado com os dados da compra
        await this.router.navigate(['/resultado'], {
          state: dadosCompra,
        });
      } catch (error) {
        console.error('Erro ao processar finalização:', error);
        await this.mostrarToast('Erro ao processar compra', 'danger');
      }
    }, 2000);
  }

  // Método auxiliar para gerar número do pedido
  private gerarNumeroPedido(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PED${timestamp}${random}`.substring(0, 12);
  }

  continuarComprando() {
    this.router.navigate(['/tabs/inicio']);
  }

  verDetalheProduto(produto: any) {
    // Navega para página de detalhes do produto
    this.router.navigate(['/produto-detalhe', produto.codigo]);
  }

  private async mostrarToast(mensagem: string, cor: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  // Método para atualizar dados quando houver mudanças
  refresh(event: any) {
    this.carregarCarrinho();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
