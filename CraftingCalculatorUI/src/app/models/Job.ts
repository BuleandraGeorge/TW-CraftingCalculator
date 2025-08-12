
export class Job{
    id:string;
    name:string;
    drops: {product_id:string, drop_rate:Number}[];
    constructor(id:string, name:string, drops:{product_id:string, drop_rate:Number}[]){
        this.id = id
        this.name = name
        this.drops = drops
    }
}