import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsView } from './components/products/view/view';
import { CreateProduct } from './components/products/create/create';
import { Calculator } from './components/calculator/calculator';

export const routes: Routes = [
    { path: 'products', component: ProductsView },
    { path: 'create-product', component: CreateProduct },
    { path: 'calculator', component: Calculator },
    { path: '', redirectTo: 'calculator', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}