package com.petCare;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

public class App {
    private static final Scanner scanner = new Scanner(System.in);
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    private static Map<Integer, Pet> pets = new HashMap<>();

    public static void main(String[] args) {
        loadPetsInfo();
        boolean running = true;
        while (running) {
            System.out.println("======PetCare Scheduler======");
            System.out.println("1-Register Pet");
            System.out.println("2-Schedule an Appointment");
            System.out.println("3-Display all pets");
            System.out.println("4-Generate Reports");
            System.out.println("5-save and Exit");

            String userOption = scanner.nextLine();

            switch (userOption) {
                case "1":
                    registerPet();
                    break;
                case "2":
                    scheduleAppointment();
                    break;
                case "3":
                    displayAllPets();
                    break;
                case "4":
                    generateReports();
                    break;
                case "5":
                    savePetData();
                    running = false;
                    System.out.println("Thank you for using PetCare Application and GoodBye");
                    break;
                default:
                    System.out.println("Invalid option Please Choose Again");
            }

        }
    }

    private static void registerPet() {
        Pet newPet;
        System.out.println("Enter your Pet ID : ");
        int id = Integer.parseInt(scanner.nextLine());
        if (pets.containsKey(id)) {
            System.out.println("This ID IS Already Registered Try Again!");
            return;
        }
        System.out.println("Enter your Pet Name : ");
        String petName = scanner.nextLine();
        //loop until user select right number
        int petAge;
        while (true) {
            System.out.println("Enter your Pet Age : ");
            try {
                petAge = Integer.parseInt(scanner.nextLine());
                if (petAge <= 0) {
                    throw new IllegalArgumentException();
                }
                break;
            } catch (NumberFormatException e) {
                System.out.println("Invalid Pet Age Entered!");
            } catch (IllegalArgumentException e) {
                System.out.println("Age of Pet must be Positive");
            }
        }
        System.out.println("Enter your Pet Breed : ");
        String petBreed = scanner.nextLine();
        System.out.println("Enter your name As Owner of Pet :");
        String petOwner = scanner.nextLine();
        System.out.println("Enter contact info (Optional) :");
        String contactInfo = scanner.nextLine();
        if (contactInfo.isEmpty()) {
            newPet = new Pet(id, petName, petBreed, petAge, petOwner);
        } else {
            newPet = new Pet(id, petName, petBreed, petAge, petOwner, contactInfo);
        }

        pets.put(id, newPet);
        System.out.println("Your Pet successfully registered!");

    }

    private static void scheduleAppointment() {
        Appointment newAppointment;
        System.out.println("Enter your Pet ID : ");
        int id = Integer.parseInt(scanner.nextLine());
        if (!pets.containsKey(id)) {
            System.out.println("Your pet does not exist in system Please Register First !");
            return;
        }
        Pet registerPet = pets.get(id);
        int counter = 0;
        System.out.println("What's Your Appointment Type : ");
        for (Appointment.Type type : Appointment.Type.values()) {
            System.out.println(++counter + " - " + type);
        }
        int appointmentType;
        Appointment.Type appType;
        //Loop until choosing right Number
        while (true) {
            try {
                appointmentType = Integer.parseInt(scanner.nextLine()) - 1;
                appType = Appointment.Type.values()[appointmentType];
                break;
            } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("Please choose from Numbers in the List !");
            } catch (NumberFormatException e) {
                System.out.println("Invalid Option try again");
            }
        }

        //Validation of Input Date
        LocalDateTime appointmentDate;
        while (true) {
            try {
                System.out.println("What's Your Appointment Date in the format of (yyyy/MM/dd HH:mm:ss): ");
                String appointmentUser = scanner.nextLine();
                appointmentDate = LocalDateTime.parse(appointmentUser, DATE_TIME_FORMATTER);
                if (appointmentDate.isBefore(LocalDateTime.now())) {
                    System.out.println("Must Choose a Date in the Future your date is passed.");
                    continue;
                }
                break;
            } catch (DateTimeParseException e) {
                System.out.println("Invalid Appointment Date Entered try again!");
            }
        }
        System.out.println("Any Notes? : ");
        String userNotes = scanner.nextLine();
        if (userNotes.isEmpty()) {
            newAppointment = new Appointment(appType, appointmentDate);
        } else {
            newAppointment = new Appointment(appType, appointmentDate, userNotes);
        }

        registerPet.getAppointmentList().add(newAppointment);
        System.out.println("Your Pet reservation has been successfully registered!");

    }

    private static void displayAllPets() {
        System.out.println("===Displaying Records===");
        System.out.println("1-All Registered Pets");
        System.out.println("2-All Appointments for a specific Pet");
        System.out.println("3-Upcoming appointment for All pets");
        System.out.println("4-Past Appointment history for each Pet");

        String userOption = scanner.nextLine();

        switch (userOption) {
            case "1":
                showAllPets();
                break;
            case "2":
                appointmentPet();
                break;
            case "3":
                upcomingAppointment();
                break;
            case "4":
                pastAppointment();
                break;
            default:
                System.out.println("Invalid Option Selected Please Choose Again");
        }

    }

    private static void showAllPets() {
        if (pets.isEmpty()) {
            System.out.println("There is no data registered");
            return;
        }
        for (Pet pet : pets.values()) {
            System.out.println(pet);
            System.out.println("=========");
        }
    }

    private static void appointmentPet() {
        System.out.println("Enter your Pet ID : ");
        int id = Integer.parseInt(scanner.nextLine());
        if (!pets.containsKey(id)) {
            System.out.println("No Pet with this ID exists Try AGAIN");
            return;
        }
        Pet registeredPet = pets.get(id);
        for (Appointment appointment : registeredPet.getAppointmentList()) {
            System.out.println(appointment);
            System.out.println("=========");
        }
    }

    private static void upcomingAppointment() {
        if (pets.isEmpty()) {
            System.out.println("No Records exists");
            return;
        }
        System.out.println("=====Upcoming Appointments====");
        LocalDateTime now = LocalDateTime.now();
        for (Pet pet : pets.values()) {
            for (Appointment appointment : pet.getAppointmentList()) {
                if (appointment.getDateTime().isAfter(now) || appointment.getDateTime().equals(now)) {
                    System.out.println("Pet " + pet.getName() + " Age : " + pet.getAge());
                    System.out.println("Appointment : " + appointment);
                }
            }
            System.out.println("====================================");
        }
    }

    private static void pastAppointment() {
        if (pets.isEmpty()) {
            System.out.println("No Records exists");
            return;
        }
        System.out.println("=====History Appointments====");
        LocalDateTime now = LocalDateTime.now();
        for (Pet pet : pets.values()) {
            for (Appointment appointment : pet.getAppointmentList()) {
                if (appointment.getDateTime().isBefore(now)) {
                    System.out.println("Pet " + pet.getName() + " Age : " + pet.getAge() +
                            " Owner : " + pet.getOwnerName());
                    System.out.println("Appointment : " + appointment);
                }
            }
            System.out.println("====================================");
        }
    }

    private static void generateReports() {
        List<Pet> overduePets = new ArrayList<>();
        System.out.println("Pets with upcoming appointments in the next week");
        if (!pets.isEmpty()) {
            LocalDateTime nextWeek = LocalDateTime.now().plusWeeks(1);
            for (Pet pet : pets.values()) {
                for (Appointment appointment : pet.getAppointmentList()) {
                    if (appointment.getDateTime().isBefore(nextWeek) ||
                            appointment.getDateTime().equals(nextWeek) &&
                                    appointment.getDateTime().isAfter(LocalDateTime.now())) {
                        System.out.println(pet);
                    }
                }
                System.out.println("========================");
            }
        }
        System.out.println("Pets overdue for a vet visit");
        LocalDateTime last6month = LocalDateTime.now().minusMonths(6);
        for (Pet pet : pets.values()) {
            LocalDateTime recentAppointment =
                    pet.getAppointmentList().getLast().getDateTime();
            if (recentAppointment.isBefore(last6month) || recentAppointment.isEqual(last6month)) {
                overduePets.add(pet);
            }
        }
        for (Pet overduPet : overduePets) {
            System.out.println("Pets that have no visit in the last 6 month : \n" + overduPet);
        }

    }

    private static void savePetData() {
        if (pets.isEmpty()) {
            System.out.println("There is no data registered");
            return;
        }
        System.out.println("====Saving All Pets Info====");

        try (ObjectOutputStream objectOutputStream =
                     new ObjectOutputStream(new FileOutputStream("pets.ser"))) {

            objectOutputStream.writeObject(pets);

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        System.out.println("Done.");
    }


    private static void loadPetsInfo() {
        System.out.println("==== Loading any saved data ====");
        String fileName = "pets.ser";
        try {
            ObjectInputStream objectRead = new ObjectInputStream(new FileInputStream(fileName));
            pets = (Map<Integer, Pet>) objectRead.readObject();
            System.out.println("Loading Done.");
        } catch (FileNotFoundException e) {
            System.out.println("No Saved data Found Starting FRESH");
        } catch (ClassNotFoundException | ClassCastException | IOException e) {
            System.out.println("Error while loading any saved data");
        }
    }

}
