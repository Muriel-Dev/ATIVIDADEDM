import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/produto.model';
import { ItemCarrinho } from '../models/item-carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itensCarrinho: ItemCarrinho[] = [];
  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor() {
    this.carregarCarrinhoLocalStorage();
  }

  adicionarProduto(produto: Produto, quantidade: number = 1): void {
    const itemExistente = this.itensCarrinho.find(item => item.produto.codigo === produto.codigo);
    
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.produto.valorComDesconto;
    } else {
      const novoItem: ItemCarrinho = {
        produto: produto,
        quantidade: quantidade,
        subtotal: quantidade * produto.valorComDesconto
      };
      this.itensCarrinho.push(novoItem);
    }
    
    this.salvarCarrinhoLocalStorage();
    this.carrinhoSubject.next([...this.itensCarrinho]);
  }

  removerProduto(codigo: string): void {
    this.itensCarrinho = this.itensCarrinho.filter(item => item.produto.codigo !== codigo);
    this.salvarCarrinhoLocalStorage();
    this.carrinhoSubject.next([...this.itensCarrinho]);
  }

  atualizarQuantidade(codigo: string, novaQuantidade: number): void {
    const item = this.itensCarrinho.find(item => item.produto.codigo === codigo);
    
    if (item && novaQuantidade > 0) {
      item.quantidade = novaQuantidade;
      item.subtotal = item.quantidade * item.produto.valorComDesconto;
      
      this.salvarCarrinhoLocalStorage();
      this.carrinhoSubject.next([...this.itensCarrinho]);
    } else if (item && novaQuantidade <= 0) {
      this.removerProduto(codigo);
    }
  }

  obterItens(): ItemCarrinho[] {
    return [...this.itensCarrinho];
  }

  obterQuantidadeTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  obterValorTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.subtotal, 0);
  }

  obterQuantidadeProduto(codigo: string): number {
    const item = this.itensCarrinho.find(item => item.produto.codigo === codigo);
    return item ? item.quantidade : 0;
  }

  produtoEstaNoCarrinho(codigo: string): boolean {
    return this.itensCarrinho.some(item => item.produto.codigo === codigo);
  }

  limparCarrinho(): void {
    this.itensCarrinho = [];
    this.salvarCarrinhoLocalStorage();
    this.carrinhoSubject.next([]);
  }

  private salvarCarrinhoLocalStorage(): void {
    try {
      localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
    } catch (error) {
      console.warn('Erro ao salvar carrinho no localStorage:', error);
    }
  }

  private carregarCarrinhoLocalStorage(): void {
    try {
      const carrinhoSalvo = localStorage.getItem('carrinho');
      if (carrinhoSalvo) {
        this.itensCarrinho = JSON.parse(carrinhoSalvo);
        this.carrinhoSubject.next([...this.itensCarrinho]);
      }
    } catch (error) {
      console.warn('Erro ao carregar carrinho do localStorage:', error);
      this.itensCarrinho = [];
    }
  }

  debug(): void {
    console.log('Itens no carrinho:', this.itensCarrinho);
    console.log('Quantidade total:', this.obterQuantidadeTotal());
    console.log('Valor total:', this.obterValorTotal());
  }
}