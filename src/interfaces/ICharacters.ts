import { Document } from "mongoose";

export interface LocationOrigin {
    name: string;
    url: string;
}

export interface Characters extends Document{
    _id?:string;
    id?:number;
    name: string;
    status: string;
    species: string;
    type?: string;
    gender: string;
    origin: LocationOrigin;
    location: LocationOrigin;
    image: string;
    episode: string[];
    origen?: string; 
}
