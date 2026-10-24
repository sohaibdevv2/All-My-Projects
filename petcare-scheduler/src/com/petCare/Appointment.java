package com.petCare;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

public class Appointment implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Type appointmentType;
    private LocalDateTime dateTime;
    private String notes;

    public Appointment(Type appointmentType, LocalDateTime dateTime, String notes) {
        this.appointmentType = appointmentType;
        this.dateTime = dateTime;
        this.notes = notes;
    }

    public Appointment(Type appointmentType, LocalDateTime dateTime) {
        this.appointmentType = appointmentType;
        this.dateTime = dateTime;
        this.notes = "";
    }

    public Type getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(Type appointmentType) {
        this.appointmentType = appointmentType;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "This Appointment Occurred in :" + getDateTime() +
                "\n The Reason of Appointment : " + getAppointmentType() +
                "\n Notes : " + getNotes();
    }

    public enum Type {
        VET_VISIT,
        VACATION,
        GROOMING
    }
}
