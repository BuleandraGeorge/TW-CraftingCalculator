import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsView } from './components/products/view/view';
import { CreateProduct } from './components/products/create/create';
import { Calculator } from './components/calculator/calculator';
import { FarmingAdvisor } from './components/farmingAdvisor/farming-advisor';

export const routes: Routes = [
    { path: 'products', component: ProductsView },
    { path: 'create-product', component: CreateProduct },
    { path: 'calculator', component: Calculator },
    { path: 'farming-advisor', component:FarmingAdvisor},
    { path: '', redirectTo: 'calculator', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}