package com.petCare;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Pet implements Serializable {
    @Serial
    private static final long serialVersionUID = 10L;
    private final int uniqueId;
    private final List<Appointment> appointmentList;
    private String name;
    private String species;
    private int age;
    private String ownerName;
    private String contactInfo;
    private LocalDate registrationDate;

    //Constructors
    public Pet(int uniqueId, String name, String species, int age, String ownerName, String contactInfo) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.species = species;
        this.age = age;
        this.ownerName = ownerName;
        this.contactInfo = contactInfo;
        this.registrationDate = LocalDate.now();
        this.appointmentList = new ArrayList<>();
    }

    public Pet(int uniqueId, String name, String species, int age, String ownerName) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.species = species;
        this.age = age;
        this.ownerName = ownerName;
        this.registrationDate = LocalDate.now();
        this.appointmentList = new ArrayList<>();
        this.contactInfo = "";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<Appointment> getAppointmentList() {
        return appointmentList;
    }

    public int getUniqueId() {
        return uniqueId;
    }

    public void addAppointment(Appointment appointment) {
        this.appointmentList.add(appointment);
    }

    @Override
    public String toString() {
        return "Pet with The name : " + getName()
                + "\n Breed : " + getSpecies()
                + "\n Age : " + getAge()
                + "\n Owner Name : " + getOwnerName()
                + "\n Registration Date : " + getRegistrationDate()
                + "\n Contact Info : " + getContactInfo()
                + "\n How Much visited PetCare : " + getAppointmentList().size();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj != null && !obj.equals("") && obj instanceof Pet otherPet) {
            return this.uniqueId == otherPet.uniqueId && this.name.equals(otherPet.name)
                    && this.species.equals(otherPet.species) && this.age == otherPet.age;
        }
        return false;
    }
}
