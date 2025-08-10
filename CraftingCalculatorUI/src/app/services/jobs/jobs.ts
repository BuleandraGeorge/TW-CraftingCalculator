import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobsServices {
  constructor (private http:HttpClient){}
  url = 'http://localhost:5000'

  updateJobsList(jobs:string[])
  {
   return this.http.post(`${this.url}/update-jobs-list`, jobs)
  }
}
