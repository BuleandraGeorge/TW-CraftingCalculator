

export class NewProduct{
    name: string = ""
    composition: string[] = []
    constructor( name:string, composition:string[]){
        this.name = name
        this.composition = composition
    }
}