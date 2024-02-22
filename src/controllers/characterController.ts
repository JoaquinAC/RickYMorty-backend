import { Request, Response } from 'express';
import axios from 'axios';
import Character from '../models/Characters'; 
import { Characters , LocationOrigin} from '../interfaces/ICharacters';

export const getCharactersWithID = async (req: Request, res: Response) => {
    try {
        let combinedResults: Characters[] = [];

        let apiUrl = 'https://rickandmortyapi.com/api/character';
        if (req.params.id) {
            const ids = req.params.id;
            apiUrl += `/${ids}`;
        }

        // Consulta a la API de Rick y Morty
        const apiResponse = await axios.get(apiUrl);
        const apiCharacters = apiResponse.data.results || [apiResponse.data];
        combinedResults = combinedResults.concat(apiCharacters.map((char: any) => ({
            ...char,
            origin: { name: char.origin.name, url: char.origin.url },
            location: { name: char.location.name, url: char.location.url },
            origen: 'API'
        })));

        // Consulta a la base de datos MongoDB
        const dbCharacters = await Character.find({});
        combinedResults = combinedResults.concat(dbCharacters.map((doc: any) => ({
            ...doc.toObject(),
            origen: 'BD'
        })));

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener los personajes';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data.error || 'Error al comunicarse con la API de Rick y Morty';
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(statusCode).json({ message: errorMessage });
    }
};

export const getCharactersPagination = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default a 1 si no se proporciona
        let combinedResults: Characters[] = [];

        if (page === 1) {
            // Trae los resultados de la base de datos
            const dbCharacters = await Character.find({});
            combinedResults = dbCharacters.map((doc: any) => ({
                ...doc.toObject(),
                origen: 'BD'
            }));
        } else {
            // Utiliza la API de Rick y Morty para obtener los personajes por paginación
            const apiUrl = `https://rickandmortyapi.com/api/character/?page=${page}`;
            const apiResponse = await axios.get(apiUrl);
            const apiCharacters = apiResponse.data.results || [];
            combinedResults = apiCharacters.map((char: any) => ({
                ...char,
                origin: { name: char.origin?.name, url: char.origin?.url },
                location: { name: char.location?.name, url: char.location?.url },
                origen: 'API'
            }));
        }

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener los personajes';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            // Error específico de Axios
            errorMessage = error.response?.data.error || 'Error al comunicarse con la API de Rick y Morty';
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            // Error general o de MongoDB
            errorMessage = error.message;
        }

        res.status(statusCode).json({ message: errorMessage });
    }
};

export const getFilteredCharacters = async (req: Request, res: Response) => {
    try {
        // Inicializa el objeto de consulta para MongoDB con el tipo adecuado
        const dbQuery: Record<string, string> = {};
        
        // Filtrar y construir parámetros de consulta para la API y MongoDB
        const queryParams: (keyof Characters)[] = ['name', 'status', 'species', 'type', 'gender'];
        let apiQuery = '';
        queryParams.forEach(param => {
            const queryParam = req.query[param];
            if (typeof queryParam === 'string') {
                apiQuery += `${param}=${queryParam}&`;
                dbQuery[param] = queryParam;
            }
        });
        
        // Consulta a la API de Rick y Morty
        const apiUrl = `https://rickandmortyapi.com/api/character/?${apiQuery}`;
        const { data } = await axios.get<{ results: Characters[] }>(apiUrl);
        
        // Consulta a MongoDB con filtros múltiples
        const dbCharacters = await Character.find(dbQuery);

        // Combinar resultados y añadir origen
        const combinedResults = [
            ...data.results.map((char: Characters) => ({ ...char, origen: 'API' })),
            ...dbCharacters.map((doc) => ({
                ...doc.toObject(),
                origin: doc.origin as LocationOrigin,
                location: doc.location as LocationOrigin,
                origen: 'BD'
            })),
        ];

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener los personajes';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || 'Error al comunicarse con la API de Rick y Morty';
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(statusCode).json({ message: errorMessage });
    }
};
