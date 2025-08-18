import { CommonModule } from '@angular/common';
import { GameDataServices } from '../../services/gamedata/game-data-service';
import { JobsServices } from '../../services/jobs/jobs';
import { PlansServices } from '../../services/plans/plansServices';
import { Plan } from '../../models/Plan';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/Job';
import { ProductsServices } from '../../services/products/productsServices';
import { Product } from '../../models/Product';
import { FlexLayoutModule } from '@angular/flex-layout';
import { startWith,map,Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-farming-advisor',
  imports: [
    ReactiveFormsModule,
    MatSelectModule, 
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    FlexLayoutModule,
    MatIconModule
  ],
  templateUrl: './farming-advisor.html',
  styleUrl: './farming-advisor.css'
})
export class FarmingAdvisor implements OnInit{

  plans:Plan[] =[]
  products:Product[]= []
  silverJobs:{name:string, location:string}[]= [];
  selectPlanForm: FormGroup; 
  filteredPlans!:Observable<Plan[]>;
  rawMaterials:any[]=[];

  constructor(
    private gameDataServices:GameDataServices, 
    private jobsServices: JobsServices, 
    private planServices:PlansServices,
    private productServices:ProductsServices,
    private fb:FormBuilder
  ){
    this.loadSilverJobs()
    this.loadPlans()
    this.loadProducts()
    this.selectPlanForm = this.fb.group(
      {
        plan: new FormControl("")
      }
    )
    this.addAutocomplete()

  }
  
  ngOnInit(): void {
    const jobs = this.silverJobs.map(job => job.name)
    this.jobsServices.updateJobsList(jobs).subscribe({
      next:(response:any) =>console.log(response)
    })
  }

  loadPlans()
  {
    this.planServices.get_plans().subscribe({
      next: plans => this.plans = plans
    })
  }
  loadProducts()
  {
    this.productServices.getProducts().subscribe({
      next: products=>this.products=products
    })
  }
  loadSilverJobs()
  {
    this.gameDataServices.getSilverJobs().subscribe({
      next:(text) => {this.silverJobs=this.extractJobs(text)}
    })
  }

  extractJobs(text:string)
  {
    const something = text.split("\n")
    let jobLocations:{name:string, location:string}[] = []
    something.forEach(line => {
      const line_parts = line.split(";")
      jobLocations.push({"name": line_parts[0], "location": line_parts[2]})
    })
    
    return jobLocations
  }

  removeNumberInName(name:string)
  {
    const components = name.split(" ")
    try{
      Number(components[1])
      components.shift(); // removes first element
      return components.join(" ");
    }
    catch{
      return components.join(" "); // joins remaining elements with spaces
    }

  }
  loadPlanSubmit()
  {
    const plan:Plan = this.selectPlanForm.get("plan")?.value
    const rawMaterials:Product[] =[] 
    plan.products.forEach((planed_product:any)=>{

        const product = this.products.find(product => product._id === planed_product.product_id);
        const quantity = planed_product.quantity
        this.gettingRawMaterials(product,quantity)
    })
    //based on the necessary products look through the today jobs and tell which one is the one which necessasitates the most time
    //also show all time top job
    //take in account the current inventory
  }
  getProductObject(name:string){
        return this.products.find((product:Product)=> product.name === name)
  }
  addOrUpdateItem(list: { "productName": string; quantity: number }[], item: { "productName": string; quantity: number }) {
    const existing = list.find(i => i.productName === item.productName);
    if (existing) {
      existing.quantity += item.quantity;
    } 
    else 
    {
      list.push(item);
    }
  }
  gettingRawMaterials(product:any, NumberOfProducts:number){

        if (product.composition.length>0){
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

  addAutocomplete() {
    this.filteredPlans = this.selectPlanForm.get('plan')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name || '';
        return this.filterPlans(name);
      })
    );
  }

  filterPlans(value: string): Plan[] {
    const filterValue = value.toLowerCase();
    return this.plans.filter(plan => plan.name.toLowerCase().includes(filterValue));
  }

  displayPlanName(plan:Plan):string
  {
    console.log("Yes")
    return plan ? plan.name : ""
  }
}
