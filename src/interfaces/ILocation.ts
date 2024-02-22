import { Document } from "mongoose";

export interface Location extends Document{
    _id?:string,
    id?:number,
    name:string,
    type:string,
    dimension:string,
    residents:string[]
}

