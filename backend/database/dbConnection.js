import mongoose from "mongoose";


export const dbConnection =()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"prenotazione"
    }).then(()=>{
        console.log("connesso al db");
    }).catch(err=>{
        console.log(`errore di connessione al db: ${err}`);
    })
}