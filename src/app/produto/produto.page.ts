import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ProdutoService } from '../services/produto.service';
import { CarrinhoService } from '../services/carrinho.service';
import { Produto } from '../models/produto.model';

@Component({
  selector: 'app-produto',
  standalone: false,
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  produto: Produto | undefined;
  quantidade: number = 1;
  carregando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit() {
    this.carregarProduto();
  }

  get temDesconto(): boolean {
    return !!(
      this.produto?.valorNormal &&
      this.produto?.valorComDesconto &&
      this.produto.valorNormal > this.produto.valorComDesconto
    );
  }

  get temPrecoUnico(): boolean {
    return !!(
      this.produto?.valorComDesconto &&
      (!this.produto?.valorNormal ||
        this.produto.valorNormal <= this.produto.valorComDesconto)
    );
  }

  get produtoValido(): boolean {
    return !!this.produto?.valorComDesconto;
  }

  carregarProduto() {
    try {
      const codigo = this.route.snapshot.paramMap.get('codigo');

      if (!codigo) {
        this.mostrarToast('Código do produto não informado', 'danger');
        this.voltarParaInicio();
        return;
      }

      this.produto = this.produtoService.getProdutoPorCodigo(codigo);

      if (!this.produto) {
        this.mostrarToast('Produto não encontrado', 'danger');
        this.voltarParaInicio();
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      this.mostrarToast('Erro ao carregar produto', 'danger');
      this.voltarParaInicio();
    } finally {
      this.carregando = false;
    }
  }

  calcularDesconto(valorNormal: number, valorComDesconto: number): number {
    if (valorNormal <= 0) return 0;
    return Math.round(((valorNormal - valorComDesconto) / valorNormal) * 100);
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

  aumentarQuantidade() {
    this.quantidade++;
  }

  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  async comprarAgora() {
    if (!this.produto) {
      await this.mostrarToast('Produto não disponível', 'danger');
      return;
    }

    if (this.quantidade <= 0) {
      await this.mostrarToast('Quantidade inválida', 'danger');
      return;
    }

    try {
      this.carrinhoService.adicionarProduto(this.produto, this.quantidade);

      await this.mostrarToast(
        `${this.quantidade} ${
          this.quantidade === 1 ? 'item adicionado' : 'itens adicionados'
        } ao carrinho!`,
        'success'
      );

      this.quantidade = 1;
      
    } catch (error) {
      console.error('Erro ao comprar agora:', error);
      await this.mostrarToast('Erro ao processar compra', 'danger');
    }
  }

  voltarParaInicio() {
    this.navCtrl.back();
  }

  private async mostrarToast(mensagem: string, cor: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'bottom',
    });

    await toast.present();
  }

  calcularSubtotal(): number {
    return this.produto?.valorComDesconto
      ? this.produto.valorComDesconto * this.quantidade
      : 0;
  }
}
