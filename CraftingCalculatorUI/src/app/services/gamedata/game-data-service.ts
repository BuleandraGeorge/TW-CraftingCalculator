import { Injectable } from '@angular/core';

import { HttpClient, httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameDataServices {
  
  constructor(private httpClient:HttpClient){}

  getSilverJobs(){
    return this.httpClient.get('https://tws.webspace.rocks/raw.php', {
    params: { worldId: 'en20' },
    responseType: 'text' // 👈 Tell Angular it's plain text
  })
  }
  
}
