import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Asegúrate de crear este modelo

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        
        if (!process.env.JWT_SECRET) {
            throw new Error('La clave secreta JWT_SECRET no está definida.');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};
