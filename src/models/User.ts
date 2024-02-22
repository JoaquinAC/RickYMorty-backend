import mongoose, { Schema, Document , Model} from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser , UserModel } from '../interfaces/IUser';


const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});

// Pre-save hook para encriptar la contraseña
UserSchema.pre<IUser>('save', async function(next) {
  // Solo encripta si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error as any);
  }
});

// Método para comparar las contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método estático findByCredentials
UserSchema.statics.findByCredentials = async function(email: string, password: string): Promise<IUser> {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  return user;
};

const User = mongoose.model<IUser, UserModel>('User', UserSchema);
export default User;
