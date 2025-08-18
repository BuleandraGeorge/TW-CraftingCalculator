import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsView } from './components/products/view/view';
import { CreateProduct } from './components/products/create/create';
import { Calculator } from './components/calculator/calculator';
import { FarmingAdvisor } from './components/farmingAdvisor/farming-advisor';
import { UpdateJob } from './components/update-job/update-job';
import { Inventory } from './components/inventory/inventory';

export const routes: Routes = [
    { path: 'products', component: ProductsView },
    { path: 'create-product', component: CreateProduct },
    { path: 'calculator', component: Calculator },
    { path: 'farming-advisor', component:FarmingAdvisor},
    { path: 'update-job', component:UpdateJob},
    { path: 'inventory', component:Inventory},
    { path: '', redirectTo: 'calculator', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}