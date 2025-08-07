import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormControl, FormGroup,FormBuilder, FormArray } from '@angular/forms';
import { ProductsServices } from '../../../services/products/productsServices';
import { NewProduct } from '../../../models/NewProduct';
import { Product } from '../../../models/Product';
import { Observable, startWith, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    MatSelectModule, 
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class CreateProduct {
  response: any = undefined
  productForm: FormGroup;
  materialOptions: Product[] = [];
  filteredOptions: Observable<Product[]>[] = [];
  
  constructor(private productServices: ProductsServices, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: "",
      materials: this.fb.array([])
    });
   this.loadMaterialOptions()
  }


handleSubmit() {
  const name = this.productForm.get('name')?.value;
  const materialsArray = this.productForm.get('materials') as FormArray;

  const materials = materialsArray.controls.map((group: AbstractControl) => ({
    name: group.get('name')?.value,
    quantity: group.get('quantity')?.value
  }));

  const prod = new NewProduct(name, materials as []);

  this.productServices.addProduct(prod).subscribe(response => {
    alert(response["success"]);
  });
}

addMaterial(){
    const inputMaterial = this.fb.group({
        name: [''],
        quantity: ['']
      });
    this.materials.push(inputMaterial);

    // Set up autocomplete filter for this input
    const nameInputMaterial = inputMaterial.get('name') as FormControl;
    const filtered = nameInputMaterial.valueChanges.pipe(
      startWith(''),
      map(value =>{ return this.filterMaterials(value || '') })
    );

    this.filteredOptions.push(filtered);
    this.loadMaterialOptions();
  }
  
  removeMaterial(index: number) {
    const materialsArray = this.productForm.get('materials') as FormArray;
    materialsArray.removeAt(index);               // Remove form group
    this.filteredOptions.splice(index, 1);        // Remove autocomplete Observable
  }

  filterMaterials(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.materialOptions.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  get materials(): FormArray {
    return this.productForm.get('materials') as FormArray;
  }
  loadMaterialOptions()
  {
    this.productServices.getProducts().subscribe({
        next: products => { this.materialOptions = products},
        error: err => console.error('Failed to fetch products:', err)
    })
    
  }
}
