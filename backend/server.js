

    import app from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Carica le variabili d'ambiente
dotenv.config();

// Configura cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

// Funzione per avviare il server
const startServer = async () => {
  try {
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Il server gira sulla porta ${port}`);
    });
  } catch (error) {
    console.error("Errore durante l'avvio del server:", error);
    process.exit(1);
  }
};

// Avvia il server
startServer();

// Gestione degli errori non catturati
process.on('unhandledRejection', (err) => {
  console.log(`Errore: ${err.message}`);
  console.log('Chiusura del server dovuta a Unhandled Promise Rejection');
  process.exit(1);
});