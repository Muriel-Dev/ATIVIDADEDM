import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClienteCadastroComponent } from './cliente-cadastro.component';
import { ClienteCadastroRoutingModule } from './cliente-cadastro-routing.module';

@NgModule({
  declarations: [ClienteCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClienteCadastroRoutingModule,
  ],
})
export class ClienteCadastroModule {}
