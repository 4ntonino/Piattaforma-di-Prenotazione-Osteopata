import { catchAsyncErrors } from "../middelwares/catchAsyncErrors.js";
import ErrorHandler from "../middelwares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// Registrazione di un nuovo paziente
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } = req.body;
  
  // Verifica che tutti i campi siano compilati
  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    return next(new ErrorHandler("Per favore, compila tutti i campi!", 400));
  }

  // Verifica se l'utente è già registrato
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Questo utente è già registrato", 400));
  }

  // Creazione del nuovo utente
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Paziente",
  });

  generateToken(user, "Utente registrato con successo!", 201, res);
});

// Login utente
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  
  // Verifica che tutti i campi siano compilati
  if (!email || !password || !role) {
    return next(new ErrorHandler("Per favore, compila tutti i campi!", 400));
  }

  // Trova l'utente nel database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Credenziali non valide", 401));
  }

  // Verifica la password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Credenziali non valide", 401));
  }

  // Verifica il ruolo
  if (role !== user.role) {
    return next(new ErrorHandler(`Nessun utente trovato con questo ruolo!`, 403));
  }

  generateToken(user, "Login effettuato con successo!", 200, res);
});

// Aggiunta di un nuovo amministratore
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } = req.body;
  
  // Verifica che tutti i campi siano compilati
  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
    return next(new ErrorHandler("Per favore, compila tutti i campi!", 400));
  }

  // Verifica se l'email è già registrata
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Esiste già un Admin con questa email!", 400));
  }

  // Creazione del nuovo admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "Nuovo admin registrato con successo!",
    admin,
  });
});

// Aggiunta di un nuovo dottore
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Verifica che sia stato caricato un avatar
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("È richiesto un avatar per il dottore!", 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Formato dell'immagine non supportato!", 400));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  // Verifica che tutti i campi siano compilati
  if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Per favore, compila tutti i campi", 400));
  }

  // Verifica se l'email è già registrata
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Esiste già un dottore con questa email!", 400));
  }

  // Caricamento dell'avatar su Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Errore Cloudinary:", cloudinaryResponse.error || "Errore Cloudinary sconosciuto");
    return next(new ErrorHandler("Errore nel caricamento dell'avatar del dottore", 500));
  }

  // Creazione del nuovo dottore
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Dottore",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Nuovo dottore registrato con successo!",
    doctor,
  });
});

// Ottieni tutti i dottori
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Dottore" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

// Ottieni i dettagli dell'utente
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Admin sloggato con successo.",
  });
});

// Logout paziente
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res.cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Paziente sloggato con successo!",
  });
});