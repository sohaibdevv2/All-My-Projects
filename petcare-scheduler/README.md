# 🐾 PetCare Scheduler

**PetCare Scheduler** is a console-based Java application for managing pet registrations and veterinary appointments. It helps pet owners and clinics keep track of pets and their scheduled visits.

## ✨ Features

- Register pets with unique ID, name, breed, age, owner info
- Schedule appointments (Vet Visit, Grooming, Vaccination, etc.)
- View all registered pets
- View appointments for a specific pet
- Display upcoming and past appointments
- Generate useful reports:
    - Appointments in the next 7 days
    - Overdue pets (no visit in last 6 months)
- Automatic save and load using serialization

## 🛠️ Technologies

- Java (JDK 8+)
- `java.time` API for date/time handling
- Object Serialization (`pets.ser`)
- Collections Framework

## 🚀 How to Run

### Prerequisites
- JDK 8 or higher

### Compile and Run

```bash
# Compile
javac -d . com/petCare/*.java

# Run
java com.petCare.App

## 📂 Project Structure
PetCare/
├── com/
│   └── petCare/
│       ├── App.java
│       ├── Pet.java
│       └── Appointment.java
├── pets.ser              # Auto-generated data file
├── README.md
└── .gitignore

```
