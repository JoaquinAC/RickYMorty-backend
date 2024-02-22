import mongoose, {Schema} from 'mongoose';
import { Characters } from '../interfaces/ICharacters';


const CharacterSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  species: { type: String, required: true },
  type: { type: String },
  gender: { type: String, required: true },
  origin: { type: Schema.Types.Mixed, required: true },
  location: { type: Schema.Types.Mixed, required: true }, 
  image: { type: String, required: true },
  episode: [{ type: String, required: true }],
});

const Character = mongoose.model<Characters>('Character',CharacterSchema);
export default Character