

import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "Il nome deve avere almeno tre caratteri!"],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Il cognome deve avere almeno tre caratteri!"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Inserisci un indirizzo email valido"],
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Il numero di telefono deve contenere 10 caratteri"],
        maxLength: [10, "Il numero di telefono deve contenere 10 caratteri"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} non è un numero di telefono valido!`
        }
    },
    dob: {
        type: Date,
        required: [true, "Inserisci la tua data di nascita"],
        max: [new Date(), "La data di nascita non può essere nel futuro"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Uomo", "Donna"],
        lowercase: true
    },
    appointment_date: {
        type: Date,
        required: [/* true */, "Inserisci una data per l'appuntamento!"],
       
    },
    department: {
        type: String,
        required: [true, "Inserisci il reparto"],
        trim: true
    },
    doctor: {
        firstName: {
            type: String,
            required: [true, "Inserisci il nome del dottore!"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Inserisci il cognome del dottore!"],
            trim: true
        }
    },
    hasVisited: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: [true, "Inserisci l'indirizzo!"],
        trim: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Inserisci l'ID del dottore"],
        ref: "User"
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Inserisci l'ID del paziente"]
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);