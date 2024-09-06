import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Il nome è obbligatorio"],
        minLength: [3, "Il nome deve avere almeno tre caratteri!"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Il cognome è obbligatorio"],
        minLength: [3, "Il cognome deve avere almeno tre caratteri!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
        validate: [validator.isEmail, "Inserisci un indirizzo email valido"],
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "Il numero di telefono è obbligatorio"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} non è un numero di telefono valido! Deve contenere esattamente 10 cifre.`
        }
    },
    message: {
        type: String,
        required: [true, "Il messaggio è obbligatorio"],
        minLength: [15, "Il messaggio deve contenere almeno 15 caratteri!"],
        trim: true
    }
}, {
    timestamps: true // Aggiunge automaticamente campi createdAt e updatedAt
});

export const Message = mongoose.model("Message", messageSchema);