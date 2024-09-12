

import { catchAsyncErrors } from "../middelwares/catchAsyncErrors.js";
import ErrorHandler from "../middelwares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName
  ) {
    return next(new ErrorHandler("Compila almeno nome e cognome", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Dottore",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Non ho trovato nessun dottore", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "È stato rilevato un conflitto, contattaci!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(201).json({
    success: true,
    message: "Appuntamento creato con successo!",
    appointment: {
      id: appointment._id,
      date: appointment.appointment_date,
      doctor: `${doctor_firstName} ${doctor_lastName}`,
      department: appointment.department
    }
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find().sort({ appointment_date: -1 });
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appuntamento non trovato!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Stato dell'appuntamento aggiornato con successo!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appuntamento non trovato!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appuntamento eliminato con successo!",
  });
});