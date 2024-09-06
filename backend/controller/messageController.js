import {catchAsyncErrors} from "../middelwares/catchAsyncErrors.js"
import {Message}  from "../models/messageSchema.js"
import ErrorHandler from "../middelwares/errorMiddleware.js"

// Funzione per inviare un nuovo messaggio
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, message} = req.body;

    // Controllo se tutti i campi sono stati compilati
    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Per favore, compila tutti i campi del form!", 400))
    }

    // Creazione del nuovo messaggio nel database
    await Message.create({firstName, lastName, email, phone, message});

    // Invio della risposta di successo
    res.status(200).json({
        success: true,
        message: "Messaggio inviato con successo!",
    });
});

// Funzione per recuperare tutti i messaggi
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    // Recupero di tutti i messaggi dal database
    const messages = await Message.find();

    // Invio della risposta con tutti i messaggi
    res.status(200).json({
        success: true,
        messages,
    });
});