import express from 'express';
import { getCharactersWithID,getCharactersPagination,getFilteredCharacters } from '../controllers/characterController';

const router = express.Router();

router.get('/characters/:id', getCharactersWithID);
router.get('/characters/pagination' , getCharactersPagination);
router.get('/characters/filter', getFilteredCharacters);

export default router;