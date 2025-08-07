
export class Product{
    _id: string = ""
    name: string = ""
    composition: string[] = []
    constructor(id:string, name:string, composition:string[]){
        this._id = id
        this.name = name
        this.composition = composition
    }
}