import { Produto } from './produto.model';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

export class ItemCarrinhoClass implements ItemCarrinho {
  produto: Produto;
  quantidade: number;
  subtotal: number;

  constructor(produto: Produto, quantidade: number = 1) {
    this.produto = produto;
    this.quantidade = quantidade;
    this.subtotal = this.calcularSubtotal();
  }

  private calcularSubtotal(): number {
    return this.produto.valorComDesconto * this.quantidade;
  }

  atualizarQuantidade(novaQuantidade: number): void {
    if (novaQuantidade > 0) {
      this.quantidade = novaQuantidade;
      this.subtotal = this.calcularSubtotal();
    }
  }

  aumentarQuantidade(): void {
    this.quantidade++;
    this.subtotal = this.calcularSubtotal();
  }

  diminuirQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
      this.subtotal = this.calcularSubtotal();
    }
  }

  get valorUnitario(): number {
    return this.produto.valorComDesconto;
  }

  get temDesconto(): boolean {
    return this.produto.valorNormal !== undefined && 
           this.produto.valorNormal > this.produto.valorComDesconto;
  }

  get valorDescontoUnitario(): number {
    if (this.temDesconto && this.produto.valorNormal) {
      return this.produto.valorNormal - this.produto.valorComDesconto;
    }
    return 0;
  }

  get valorTotalDesconto(): number {
    return this.valorDescontoUnitario * this.quantidade;
  }

  get percentualDesconto(): number {
    if (this.temDesconto && this.produto.valorNormal) {
      return Math.round(((this.produto.valorNormal - this.produto.valorComDesconto) / this.produto.valorNormal) * 100);
    }
    return 0;
  }

  toJSON(): any {
    return {
      produto: this.produto,
      quantidade: this.quantidade,
      subtotal: this.subtotal
    };
  }

  static fromJSON(data: any): ItemCarrinhoClass {
    const item = new ItemCarrinhoClass(data.produto, data.quantidade);
    item.subtotal = data.subtotal;
    return item;
  }
}