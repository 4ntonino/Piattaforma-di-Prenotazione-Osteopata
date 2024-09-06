// Classe personalizzata per la gestione degli errori
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Middleware per la gestione degli errori
export const errorMiddleware = (err, req, res, next) => {
    // Imposta valori predefiniti per il messaggio e lo statusCode
    err.message = err.message || "Errore del server";
    err.statusCode = err.statusCode || 500;

    // Gestione di errori specifici
    if (err.code === 11000) {
        // Errore di duplicazione (ad esempio, email già registrata)
        const message = `Valore duplicato inserito: ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        // Errore di token JWT non valido
        const message = "Il Json Web Token non è valido";
        err = new ErrorHandler(message, 401);
    }

    if (err.name === "TokenExpiredError") {
        // Errore di token JWT scaduto
        const message = "Il Token è scaduto";
        err = new ErrorHandler(message, 401);
    }

    if (err.name === "CastError") {
        // Errore di casting (ad esempio, ID non valido)
        const message = `Valore non valido per ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Gestione di errori di validazione multipli
    const errorMessage = err.errors 
        ? Object.values(err.errors).map(error => error.message).join(", ")
        : err.message;

    // Invia la risposta di errore
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;