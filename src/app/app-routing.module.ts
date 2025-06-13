import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'produto/:codigo',
    loadChildren: () =>
      import('./produto/produto.module').then((m) => m.ProdutoPageModule),
  },
  {
    path: 'minha-conta',
    loadChildren: () =>
      import('./minha-conta/minha-conta.module').then(
        (m) => m.MinhaContaPageModule
      ),
  },
  {
    path: 'cliente-cadastro',
    loadChildren: () =>
      import('./cliente-cadastro/cliente-cadastro.module').then(
        (m) => m.ClienteCadastroModule
      ),
  },
  {
    path: 'carrinho',
    loadChildren: () => import('./carrinho/carrinho.module').then( m => m.CarrinhoPageModule)
  },
  {
    path: 'resultado',
    loadChildren: () => import('./resultado/resultado.module').then( m => m.ResultadoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
