import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private produtos: Produto[] = [
     {
    codigo: 'PROD-01',
    descricao: 'Smartphone Xiaomi Redmi Note 13',
    valorNormal: 1399.90,
    valorComDesconto: 1099.90,
    detalhes:
      'Smartphone com 256GB de armazenamento, câmera tripla de 108MP e tela AMOLED de 6.6 polegadas',
  },
  {
    codigo: 'PROD-02',
    descricao: 'Notebook Lenovo IdeaPad 3i',
    valorNormal: 2299.99,
    valorComDesconto: 1799.99,
    detalhes:
      'Notebook com processador Intel Core i3, 8GB RAM, SSD 512GB e tela antirreflexo de 15.6 polegadas',
  },
  {
    codigo: 'PROD-03',
    descricao: 'Smart TV Samsung Crystal UHD 65"',
    valorNormal: 3199.90,
    valorComDesconto: 2599.90,
    detalhes:
      'Smart TV 65" com resolução 4K, HDR, Alexa integrada e sistema Tizen',
  },
  {
    codigo: 'PROD-04',
    descricao: 'Fone de Ouvido Sony WH-CH520',
    valorNormal: 299.90,
    valorComDesconto: 219.90,
    detalhes:
      'Fone Bluetooth com bateria de até 50 horas, microfone integrado e compatível com assistente de voz',
  },
  {
    codigo: 'PROD-05',
    descricao: 'Tablet Samsung Galaxy Tab S9 FE',
    valorNormal: 2999.99,
    valorComDesconto: 2599.99,
    detalhes:
      'Tablet com tela de 10.9", 128GB, processador Exynos e suporte à S Pen',
  },
  {
    codigo: 'PROD-06',
    descricao: 'Console Xbox Series X 1TB',
    valorNormal: 4299.99,
    valorComDesconto: 3899.99,
    detalhes:
      'Console com suporte a 4K, SSD de 1TB, Ray Tracing e retrocompatibilidade',
  },
  {
    codigo: 'PROD-07',
    descricao: 'Relógio Amazfit GTS 4',
    valorNormal: 1199.90,
    valorComDesconto: 899.90,
    detalhes:
      'Smartwatch com GPS preciso, monitoramento de saúde 24h, tela AMOLED e até 8 dias de bateria',
  },
  {
    codigo: 'PROD-08',
    descricao: 'Máquina de Café Dolce Gusto Genio S',
    valorNormal: 599.90,
    valorComDesconto: 449.90,
    detalhes:
      'Máquina com design compacto, sistema multibebidas e controle de intensidade de café',
  },
  {
    codigo: 'PROD-09',
    descricao: 'Leitor de Livros Kobo Clara 2E',
    valorNormal: 649.90,
    valorComDesconto: 519.90,
    detalhes:
      'E-reader com tela de 6", luz ComfortLight PRO, resistência à água e suporte a vários formatos',
  },
  {
    codigo: 'PROD-10',
    descricao: 'Air Fryer Mondial Family IV',
    valorNormal: 429.90,
    valorComDesconto: 339.90,
    detalhes:
      'Fritadeira elétrica sem óleo com 4L de capacidade, controle de temperatura e timer de 60 minutos',
  },
  {
    codigo: 'PROD-11',
    descricao: 'Câmera GoPro HERO11 Black',
    valorNormal: 2699.90,
    valorComDesconto: 2299.90,
    detalhes:
      'Câmera de ação com gravação em 5.3K, estabilização HyperSmooth 5.0 e à prova d’água até 10m',
  },
  {
    codigo: 'PROD-12',
    descricao: 'Caixa de Som JBL Flip 6',
    valorNormal: 699.90,
    valorComDesconto: 559.90,
    detalhes:
      'Caixa portátil com Bluetooth, à prova d’água, até 12 horas de bateria e som JBL Original Pro',
  },
  ];

  constructor() {}

  getProdutos(): Produto[] {
    return this.produtos;
  }

  getProdutoPorCodigo(codigo: string): Produto | undefined {
    return this.produtos.find((p) => p.codigo === codigo);
  }
}
