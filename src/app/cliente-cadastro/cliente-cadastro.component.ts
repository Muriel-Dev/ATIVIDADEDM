import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-cliente-cadastro',
  standalone: false,
  templateUrl: './cliente-cadastro.component.html',
  styleUrls: ['./cliente-cadastro.component.scss'],
})
export class ClienteCadastroComponent implements OnInit {
  clienteForm: FormGroup;
  carregando: boolean = false;
  isEdicao: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      telefone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['modo'] === 'edicao' || params['edit'] === 'true') {
        this.carregarDadosParaEdicao();
      }
    });
  }

  carregarDadosParaEdicao() {
    const cliente = this.clienteService.obterCliente();
    if (cliente) {
      this.clienteForm.patchValue(cliente);
      this.isEdicao = true;
    }
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const dadosCliente = this.clienteForm.value;

      this.clienteService.salvarCliente(dadosCliente);

      console.log('Cliente salvo via service:', dadosCliente);

      this.router.navigate(['/tabs/minha-conta']);
    }
  }

  onCancel() {
    this.router.navigate(['/tabs/minha-conta']);
  }

  onTelefoneChange(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      this.clienteForm.get('telefone')?.setValue(value);
    }
  }

  onCepChange(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      this.clienteForm.get('cep')?.setValue(value);

      if (value.length === 9) {
        this.buscarEnderecoPorCep(value.replace('-', ''));
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clienteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clienteForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${
          field.errors['minlength'].requiredLength
        } caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      telefone: 'Telefone',
      cep: 'CEP',
      estado: 'Estado',
      endereco: 'Endereço',
      bairro: 'Bairro',
      cidade: 'Cidade',
    };
    return labels[fieldName] || fieldName;
  }

  private buscarEnderecoPorCep(cep: string) {
    this.carregando = true;

    setTimeout(() => {
      this.clienteForm.patchValue({
        endereco: 'Rua Exemplo',
        bairro: 'Centro',
        cidade: 'Cidade Exemplo',
        estado: 'GO',
      });
      this.carregando = false;
    }, 1000);
  }
}
