import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt , VerifiedCallback} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User'; // Asegúrate de crear un modelo de usuario

interface JwtPayload {
    id:string
}

// Estrategia Local para Login
passport.use(new LocalStrategy({
    usernameField: 'email', // Usar el email como 'username'
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !user.comparePassword(password)) {
            return done(null, false, { message: 'Credenciales incorrectas' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

if (!process.env.JWT_SECRET) {
    throw new Error('La clave secreta JWT_SECRET no está definida.');
}
// Configuración para la Estrategia JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Asegúrate de definir esto en tu .env
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload:JwtPayload, done: VerifiedCallback) => {
    try {
        const user = await User.findById(jwtPayload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
