import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Cliente {
  nome: string;
  telefone: string;
  cep: string;
  estado: string;
  endereco: string;
  bairro: string;
  cidade: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private clienteSubject = new BehaviorSubject<Cliente | null>(null);
  public cliente$ = this.clienteSubject.asObservable();

  constructor() {
    this.carregarClienteDoSessionStorage();
  }

  private carregarClienteDoSessionStorage(): void {
    const dadosSalvos = sessionStorage.getItem('cliente');
    if (dadosSalvos) {
      const cliente = JSON.parse(dadosSalvos);
      this.clienteSubject.next(cliente);
    }
  }


  salvarCliente(cliente: Cliente): void {
    sessionStorage.setItem('cliente', JSON.stringify(cliente));
    this.clienteSubject.next(cliente);
  }


  obterCliente(): Cliente | null {
    return this.clienteSubject.value;
  }


  temCliente(): boolean {
    return this.clienteSubject.value !== null;
  }


  removerCliente(): void {
    sessionStorage.removeItem('cliente');
    this.clienteSubject.next(null);
  }
}
