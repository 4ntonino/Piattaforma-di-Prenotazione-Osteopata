import jwt from "jsonwebtoken";

/**
 * Genera un token JWT, lo imposta come cookie e invia una risposta JSON
 * @param {Object} user - L'oggetto utente
 * @param {string} message - Il messaggio da includere nella risposta
 * @param {number} statusCode - Il codice di stato HTTP da inviare
 * @param {Object} res - L'oggetto response di Express
 */
export const generateToken = (user, message, statusCode, res) => {
  // Genera il token JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  // Configura le opzioni del cookie
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Converti giorni in millisecondi
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  // Determina il nome del cookie in base al ruolo dell'utente
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  // Invia la risposta con il cookie e i dati JSON
  res.status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .json({
      success: true,
      message,
      token, // Incluso per il debug, considerare la rimozione in produzione
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
};