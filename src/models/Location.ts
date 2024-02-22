import mongoose, { Schema} from 'mongoose';
import { Location } from '../interfaces/ILocation';


const LocationsSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String , required: true},
  dimension: { type: String, required: true },
  residents: [{ type: String, required: true }],
});

const Locations = mongoose.model<Location>('Location',LocationsSchema);
export default Locations