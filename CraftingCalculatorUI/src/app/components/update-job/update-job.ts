import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { JobsServices } from '../../services/jobs/jobs';
import { Job } from '../../models/Job';
import { ProductsServices } from '../../services/products/productsServices';
import { Product } from '../../models/Product';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { startWith,map,Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-job',
  imports: [ 
    ReactiveFormsModule,
    MatSelectModule, 
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    FlexLayoutModule,
   MatIconModule],
  templateUrl: './update-job.html',
  styleUrl: './update-job.css'
})
export class UpdateJob implements OnInit {
  jobs: Job[] = [];
  products: Product[] = [];
  filteredJobs!: Observable<Job[]>;
  jobForm: FormGroup;
  jobLoaded: boolean = false;
  
  constructor(
    private fb: FormBuilder, 
    private jobServices: JobsServices, 
    private productServices: ProductsServices
  ) {
    this.jobForm = this.fb.group({
      job: this.fb.control<Job | null>(null), 
      name: this.fb.control(""),
      drops: this.fb.array<FormGroup>([])
    });
  }

  ngOnInit() {
    this.loadJobs();
    this.loadProducts();
  }

  loadJobSubmit() {
    console.log("Loading Product")
    console.log(this.jobForm.get("job")?.value)
    const selectedJob = this.jobs.find(
    (job: Job) => job.id === this.jobForm.get("job")?.value.id
    );
    this.jobLoaded=false
    if (selectedJob) {
      // Set simple fields
      this.jobForm.patchValue({ name: selectedJob.name });

      // Rebuild the FormArray
      const dropsFormArray = this.fb.array<FormGroup>([]);
      if (selectedJob.drops && selectedJob.drops.length > 0) {
          selectedJob.drops.forEach(drop => {
            dropsFormArray.push(
              this.fb.group({
                product_id: [drop.product_id],
                drop_rate: [drop.drop_rate]
              })
            );
          });
        }
      this.jobForm.setControl('drops', dropsFormArray);
      this.jobLoaded=true
    }
  }

  loadProducts() {
    this.productServices.getProducts().subscribe({
      next: (products: Product[]) => this.products = products,
      error: (err: any) => console.error('Failed to fetch products:', err)
    });
  }

  loadJobs() {
    this.jobServices.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs;
        this.addAutocomplete();
      },
      error: (err: any) => console.error('Failed to fetch jobs:', err)
    });
  }

  addAutocomplete() {
    this.filteredJobs = this.jobForm.get('job')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name || '';
        return this.filterJobs(name);
      })
    );
  }

  filterJobs(value: string): Job[] {
    const filterValue = value.toLowerCase();
    return this.jobs.filter(job => job.name.toLowerCase().includes(filterValue));
  }
  get get_product_drop_rate_input()
  {
    return this.fb.group({
            job_id: new FormControl(""),
            drop_rate: new FormControl(0)})
  }

  addDrop() {
    this.drops.push(
      this.fb.group({
        product_id: [''],
        drop_rate: [0]
      })
    );
  }

  removeDrop(index: number) {
    this.drops.removeAt(index);
  }

  updateJobSubmit() {
    const formValue = this.jobForm.value;
    console.log("Updated job data:", formValue);
    formValue.id = formValue.job.id
    delete formValue.job
    const result = this.jobServices.updateJob(formValue)
    alert(result.subscribe({next: response => alert(response)}))
  }

  displayJob (job: Job): string { 
    return job ? job.name : '';
    
  };

  get drops(): FormArray {
    return this.jobForm.get('drops') as FormArray;
  }
}