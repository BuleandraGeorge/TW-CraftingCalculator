
export class Plan {

    _id:string;
    name:string;
    products:string[];

    constructor(id:string, name:string, products:string[]) {
        this._id = id
        this.name = name
        this.products = products
    }
}