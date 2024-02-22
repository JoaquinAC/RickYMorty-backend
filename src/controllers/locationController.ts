import { Request, Response } from 'express';
import axios from 'axios';
import Locations from '../models/Location'; 
import {Location} from '../interfaces/ILocation';

export const getLocationWithID = async (req: Request, res: Response) => {
    try {
        let combinedResults: Location[] = [];

        let apiUrl = 'https://rickandmortyapi.com/api/location';
        if (req.params.id) {
            const ids = req.params.id;
            apiUrl += `/${ids}`;
        }

        // Consulta a la API de Rick y Morty
        const apiResponse = await axios.get(apiUrl);
        const apiLocation = apiResponse.data.results || [apiResponse.data];
        combinedResults = combinedResults.concat(apiLocation.map((char: any) => ({
            ...char,
            origen: 'API'
        })));

        // Consulta a la base de datos MongoDB
        const dbLocations = await Locations.find({});
        combinedResults = combinedResults.concat(dbLocations.map((doc: any) => ({
            ...doc.toObject(),
            origen: 'BD'
        })));

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener las locaciones';
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

export const getLocationsPagination = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default a 1 si no se proporciona
        let combinedResults: Location[] = [];

        if (page === 1) {
            // Trae los resultados de la base de datos
            const dbLocations = await Locations.find({});
            combinedResults = dbLocations.map((doc: any) => ({
                ...doc.toObject(),
                origen: 'BD'
            }));
        } else {
            // Utiliza la API de Rick y Morty para obtener los personajes por paginación
            const apiUrl = `https://rickandmortyapi.com/api/location?page=${page}`;
            const apiResponse = await axios.get(apiUrl);
            const apiLocation = apiResponse.data.results || [];
            combinedResults = apiLocation.map((char: any) => ({
                ...char,
                origen: 'API'
            }));
        }

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener las locaciones';
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

export const getFilteredLocations = async (req: Request, res: Response) => {
    try {
        // Inicializa el objeto de consulta para MongoDB con el tipo adecuado
        const dbQuery: Record<string, string> = {};
        
        // Filtrar y construir parámetros de consulta para la API y MongoDB
        const queryParams: (keyof Location)[] = ['name', 'type', 'dimension'];
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
        const { data } = await axios.get<{ results: Location[] }>(apiUrl);
        
        // Consulta a MongoDB con filtros múltiples
        const dbLocation = await Locations.find(dbQuery);

        // Combinar resultados y añadir origen
        const combinedResults = [
            ...data.results.map((char: Location) => ({ ...char, origen: 'API' })),
            ...dbLocation.map((doc) => ({
                ...doc.toObject(),
                origen: 'BD'
            })),
        ];

        res.json(combinedResults);
    } catch (error) {
        let errorMessage = 'Error desconocido al obtener las locaciones';
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