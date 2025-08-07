import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormControl, FormGroup,FormBuilder, FormArray } from '@angular/forms';
import { ProductsServices } from '../../services/products/productsServices';
import { Product } from '../../models/Product';
import { Observable, startWith, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PlansServices } from '../../services/plans/plansServices';
import { NewPlan } from '../../models/NewPlan';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    MatSelectModule, 
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    FlexLayoutModule
  ],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class Calculator implements OnInit{
    response: any = undefined
    targetProductsForm: FormGroup;
    productOptions: Product[] = [];
    filteredOptions: Observable<Product[]>[] = [];
    rawMaterials:any[] = []
    products: any[] = []
    plans: any[] =[]

  
    constructor(private productServices: ProductsServices,private plansServices:PlansServices, private fb: FormBuilder) {
        this.targetProductsForm = this.fb.group({
        TargetProducts: this.fb.array([]),
        savePlan: [false]
        });
        this.loadProducts()
        this.addTargetProduct()
    }
    ngOnInit(): void {
      this.handleSavePlanPressed()
    }

    get newTargetProductInput(){
        return this.fb.group({
            name: [''],
            quantity: ['']})
    }
    
    addTargetProduct(){
        const newInput = this.newTargetProductInput
        this.targetProducts.push(newInput)
        const TargetProductsControl = newInput.get('name') as FormControl;
        const filtered = TargetProductsControl.valueChanges.pipe(
        startWith(''),
        map(value =>{ return this.filterProducts(value || '') })
        );
        this.filteredOptions.push(filtered);
        this.loadProducts();
    }
  
   removeMaterial(index: number) {
    const materialsArray = this.targetProductsForm.get('TargetProducts') as FormArray;
    materialsArray.removeAt(index);               // Remove form group
    this.filteredOptions.splice(index, 1);        // Remove autocomplete Observable
  }

  filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase();
      return this.productOptions.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
    }

  get targetProducts(): FormArray
  {
    return this.targetProductsForm.get('TargetProducts') as FormArray;
  }

  loadProducts()
  {
    this.productServices.getProducts().subscribe({
        next: (products: Product[]) => { this.productOptions = products},
        error: (err:any) => console.error('Failed to fetch products:', err)
    })
    
  }
  handleSubmit() {
    this.products = []
    this.rawMaterials = []
    const targetProductsArray = this.targetProductsForm.get("TargetProducts") as FormArray;
    
    const targetProducts = targetProductsArray.controls.map((group: AbstractControl) => ({
    name: group.get('name')?.value,
    quantity: group.get('quantity')?.value
    }));
    targetProducts.forEach(targetProduct=>{
        const filtered = this.productOptions.filter(product => product.name === targetProduct.name);
        const product = filtered[0]
        const numberOfProducts = Number(targetProduct.quantity)
        this.gettingRawMaterials(product,numberOfProducts)
    })
    const savePlan = this.targetProductsForm.get("savePlan")?.value
    this.savePlan2(savePlan)
    }

    handleSavePlanPressed()
    {
      this.targetProductsForm.get("savePlan")!.valueChanges.subscribe((isChecked: boolean) => {
      
      if (isChecked) {
        this.targetProductsForm.addControl('Plan Name', this.fb.control(''));
        if (this.plans.length ==0) this.plansServices.get_plans()
      }
      else this.targetProductsForm.removeControl('Plan Name');
    
      })
     
    }
    savePlan2(savePlan:boolean)
    {
      console.log(savePlan)
      if (savePlan)
      {
        const name = this.targetProductsForm.get("Plan Name")?.value
        let productsPlan: any[] = []

        const targetProductsArray = this.targetProductsForm.get("TargetProducts") as FormArray;
        const targetProducts = targetProductsArray.controls.map((group: AbstractControl) => ({
          name: group.get('name')?.value,
          quantity: group.get('quantity')?.value
          }))

        targetProducts.forEach(targetProduct=>{
          const filtered = this.productOptions.filter(product => product.name === targetProduct.name);
          const product = filtered[0]
          const numberOfProducts = Number(targetProduct.quantity)
          productsPlan.push({
              "product_id": product._id, 
              "quantity": numberOfProducts
          })
          })
        const result = this.plansServices.save_plan(new NewPlan(name, productsPlan))
        result.subscribe(data=>alert(data.Message))
      }
    }

    getProductObject(name:string){
        return this.productOptions.filter((product:any)=> product.name === name)[0]
    }
    gettingRawMaterials(product:any, NumberOfProducts:any){

        if (product.composition.length>0){
            this.addOrUpdateItem(this.products, {"productName":product.name, "quantity": NumberOfProducts})
            product.composition.forEach((rawMaterial:any)=>{
                const myRawProduct = JSON.parse(JSON.stringify(rawMaterial))
                const nextProduct = this.getProductObject(myRawProduct.name)
                this.gettingRawMaterials(nextProduct,NumberOfProducts*Number(rawMaterial.quantity))    

            })
        }
        else
        {
            this.addOrUpdateItem(this.rawMaterials, {"productName":product.name, "quantity": NumberOfProducts})
        }
        
    }

    addOrUpdateItem(list: { "productName": string; quantity: number }[], item: { "productName": string; quantity: number }) {
        const existing = list.find(i => i.productName === item.productName);

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            list.push(item);
        }
        }
}
