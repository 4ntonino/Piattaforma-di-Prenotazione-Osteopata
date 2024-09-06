import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middelwares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

// Inizializzazione dell'applicazione Express
const app = express();

// Caricamento delle variabili d'ambiente
config({ path: "./config/config.env" });

// Configurazione CORS migliorata
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per il parsing dei cookie
app.use(cookieParser());

// Middleware per la gestione del caricamento dei file
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// Rotte API
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Connessione al database
dbConnection();

// Middleware per la gestione degli errori
app.use(errorMiddleware);

// Gestione delle rotte non trovate
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Rotta non trovata"
    });
});

// Gestione degli errori non catturati
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
});

export default app;