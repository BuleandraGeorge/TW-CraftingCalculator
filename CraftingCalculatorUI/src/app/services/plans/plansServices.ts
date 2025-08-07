import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../../models/Plan';
import { NewPlan } from '../../models/NewPlan';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlansServices {
  constructor (private httpClient: HttpClient){}
  private apiUrl = 'http://localhost:5000'; // Flask runs on port 5000

  
  get_plans(): Observable<Plan[]>
  {
    return this.httpClient.get<[]>(`${this.apiUrl}/get-plans`).pipe(
      map((listOfPlans: any[])=> listOfPlans.map((plan: any) => new Plan(plan._id, plan.name, plan.products)))
    );
  }

  get_plan(plan_id:string): Observable<Plan>
  {
    return this.httpClient.post<{data:string, error:string}>(`${this.apiUrl}/get-plan`,plan_id).pipe(
      map((plan: any)=> new Plan(plan._id, plan.name, plan.products))
    );
  }

  save_plan(plan:NewPlan){
    return this.httpClient.post<{Message:string, id:string}>(`${this.apiUrl}/save-plan`,plan)
  }
}
