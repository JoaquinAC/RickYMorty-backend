import { Document , Model } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}
// Define un interface para el modelo para tipar los métodos estáticos
export interface UserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

  