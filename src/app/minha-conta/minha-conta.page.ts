import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClienteService, Cliente } from '../services/cliente.service';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.page.html',
  styleUrls: ['./minha-conta.page.scss'],
})
export class MinhaContaPage implements OnInit, OnDestroy {
  cliente: Cliente | null = null;
  carregando = false;
  private clienteSubscription?: Subscription;

  constructor(private router: Router, private clienteService: ClienteService) {}

  ngOnInit() {
    this.carregarDadosCliente();
  }

  ngOnDestroy() {
    if (this.clienteSubscription) {
      this.clienteSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.carregarDadosCliente();
  }

  carregarDadosCliente() {
    this.carregando = true;

    setTimeout(() => {
      this.cliente = this.clienteService.obterCliente();
      this.carregando = false;
    }, 500);

    this.clienteSubscription = this.clienteService.cliente$.subscribe(
      (cliente) => {
        this.cliente = cliente;
      }
    );
  }

  navegarParaCadastro() {
    this.router.navigate(['/cadastro-cliente']);
  }

  navegarParaEdicao() {
    this.router.navigate(['/cadastro-cliente'], {
      queryParams: { modo: 'edicao' },
    });
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }

  formatarCEP(cep: string): string {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
