// --- C# Syntax Guide ---
// 1. Namespaces: Organizes code into logical groups.
// 2. Static Typing: You must declare the Type (string, int) of every variable.
// 3. Braces: Logic is contained within { curly brackets }.

using System;
using System.Collections.Generic;

class Program {
    // Blueprint: Objects are defined as 'classes' or 'structs'
    class Book {
        public string Title; // Must define 'public' to access it elsewhere
        public string Author;
    }

    static void Main() {
        // Generics: List<Book> means this list can ONLY hold 'Book' objects
        List<Book> library = new List<Book>();

        while (true) {
            Console.Write("\n[C# SYNTAX] 1:Add, 2:View, 3:Delete, 4:Exit: ");
            string choice = Console.ReadLine(); // Every line ends with a ;

            if (choice == "1") {
                Book b = new Book(); // Use 'new' to create an instance of a class
                Console.Write("Title: "); b.Title = Console.ReadLine();
                Console.Write("Author: "); b.Author = Console.ReadLine();
                library.Add(b);
            }
            else if (choice == "2") {
                // Foreach: Explicitly tells the computer 'Book b' is the type
                foreach (Book b in library) {
                    Console.WriteLine($"Book: {b.Title} | Author: {b.Author}");
                }
            }
            else if (choice == "3") {
                string t = Console.ReadLine();
                // Lambda: (b => ...) is a "short-hand" function syntax
                library.RemoveAll(b => b.Title == t);
            }
            else if (choice == "4") break;
        }
    }
}
