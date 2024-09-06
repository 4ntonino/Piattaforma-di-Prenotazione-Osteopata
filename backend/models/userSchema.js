import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
        unique: true,
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
    dob: {
        type: Date,
        required: [true, "Inserisci la tua data di nascita"],
        max: [new Date(), "La data di nascita non può essere nel futuro"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Uomo", "Donna"],
        uppercase: true
    },
    password: {
        type: String,
        minLength: [8, "La password deve contenere almeno 8 caratteri"],
        required: [true, "La password è obbligatoria"],
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Dottore", "Paziente"],
        default: "Paziente"
    },
    doctorDepartment: {
        type: String,
        required: function() { return this.role === "Dottore" }
    },
    docAvatar: {
        public_id: String,
        url: String,
    }
}, {
    timestamps: true // Aggiunge automaticamente campi createdAt e updatedAt
});

// Metodo pre-save per hashare la password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Metodo per confrontare le password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Metodo per generare il token JWT
userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);