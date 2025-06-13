import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface DadosCompra {
  subtotal: number;
  frete: number;
  total: number;
  valorEconomizado?: number;
  quantidadeItens: number;
  numeroPedido: string;
}

@Component({
  selector: 'app-resultado',
  standalone: false,
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit {
  dadosCompra: DadosCompra = {
    subtotal: 0,
    frete: 0,
    total: 0,
    quantidadeItens: 0,
    numeroPedido: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carregarDadosCompra();
  }

  private carregarDadosCompra() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {
      this.dadosCompra = {
        ...this.dadosCompra,
        ...navigation.extras.state,
      };
    } else {
      this.route.queryParams.subscribe((params) => {
        if (params['subtotal']) {
          this.dadosCompra = {
            subtotal: parseFloat(params['subtotal']) || 0,
            frete: parseFloat(params['frete']) || 0,
            total: parseFloat(params['total']) || 0,
            valorEconomizado: parseFloat(params['valorEconomizado']) || 0,
            quantidadeItens: parseInt(params['quantidadeItens']) || 0,
            numeroPedido: params['numeroPedido'] || this.gerarNumeroPedido(),
          };
        } else {
          this.voltarParaHome();
        }
      });
    }

    if (!this.dadosCompra.numeroPedido) {
      this.dadosCompra.numeroPedido = this.gerarNumeroPedido();
    }
  }

  private gerarNumeroPedido(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PED${timestamp}${random}`.substring(0, 12);
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

  get temEconomia(): boolean {
    return this.dadosCompra.valorEconomizado
      ? this.dadosCompra.valorEconomizado > 0
      : false;
  }

  voltarParaHome() {
    this.router.navigate(['/tabs/inicio']);
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
}
