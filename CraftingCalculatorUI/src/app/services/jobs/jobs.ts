import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../../models/Job';
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
  getJobs():Observable<Job[]>
  {
    return this.http.get<[]>(`${this.url}/get-jobs`)
  }
  updateJob(job:Job)
  {
    return this.http.post(`${this.url}/update-job`,job)
  }
}
