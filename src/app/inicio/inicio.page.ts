import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto.model';
import { CarrinhoService } from '../services/carrinho.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  produtos: Produto[] = [];
  quantidadeCarrinho: number = 0;

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarProdutos();
    this.monitorarCarrinho();
  }

  carregarProdutos() {
    this.produtos = this.produtoService.getProdutos();
  }

  monitorarCarrinho() {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.quantidadeCarrinho = this.carrinhoService.obterQuantidadeTotal();
    });
  }

  calcularDesconto(valorNormal: number, valorComDesconto: number): number {
    return Math.round(((valorNormal - valorComDesconto) / valorNormal) * 100);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  verDetalhes(produto: Produto) {
    this.router.navigate(['/produto', produto.codigo]);
  }

  adicionarAoCarrinho(produto: Produto, event: Event) {
    event.stopPropagation();
    
    this.carrinhoService.adicionarProduto(produto);
  }
}