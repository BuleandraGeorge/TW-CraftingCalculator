import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameDataServices } from '../../../services/gamedata/game-data-service';

@Component({
  selector: 'app-farming-advisor',
  imports: [CommonModule],
  templateUrl: './farming-advisor.html',
  styleUrl: './farming-advisor.css'
})
export class FarmingAdvisor {

  constructor(private gameDataServices:GameDataServices){
    this.loadSilverJobs()
  }

  silverJobs:{name:string, location:string}[]= [];
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
      console.log(components)
      components.shift(); // removes first element
      return components.join(" ");
    }
    catch{
      return components.join(" "); // joins remaining elements with spaces
    }

  }
}
