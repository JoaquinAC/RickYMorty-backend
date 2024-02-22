import express from 'express';
import { getLocationWithID,getLocationsPagination, getFilteredLocations } from '../controllers/locationController';

const router = express.Router();

router.get('/location/:id', getLocationWithID);
router.get('/location/pagination' , getLocationsPagination);
router.get('/location/filter', getFilteredLocations);

export default router;