import {User} from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"

// Middleware per l'autenticazione degli amministratori
export const isAdminAuthenticated = catchAsyncErrors(async(req, res, next) => {
    // Ottieni il token dal cookie
    const token = req.cookies.adminToken;

    // Verifica se il token esiste
    if (!token) {
        return next(new ErrorHandler("Admin non autenticato", 401));
    }

    try {
        // Verifica e decodifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Trova l'utente nel database
        req.user = await User.findById(decoded.id);

        // Verifica se l'utente è un amministratore
        if (req.user.role !== "Admin") {
            return next(new ErrorHandler(`${req.user.role} non autorizzato ad accedere a questa risorsa`, 403));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Token non valido o scaduto", 401));
    }
});

// Middleware per l'autenticazione dei pazienti
export const isPatientAuthenticated = catchAsyncErrors(async(req, res, next) => {
    // Ottieni il token dal cookie
    const token = req.cookies.patientToken;

    // Verifica se il token esiste
    if (!token) {
        return next(new ErrorHandler("Paziente non autenticato", 401));
    }

    try {
        // Verifica e decodifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Trova l'utente nel database
        req.user = await User.findById(decoded.id);

        // Verifica se l'utente è un paziente
        if (req.user.role !== "Paziente") {
            return next(new ErrorHandler(`${req.user.role} non autorizzato ad accedere a questa risorsa`, 403));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Token non valido o scaduto", 401));
    }
});
