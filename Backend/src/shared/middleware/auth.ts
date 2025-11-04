import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;


console.log("Auth Middleware: JWT_SECRET cargado:", process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 5)}...` : 'NO CARGADO');
interface AuthRequest extends Request {
    user?: { id: number; username: string; role: 'admin' | 'client' };
}

// Verifica si el token es válido
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'El secreto del servidor no está configurado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: 'admin' | 'client' };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado.' });
    }
}

// Verifica si el usuario autenticado es un administrador
export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
}