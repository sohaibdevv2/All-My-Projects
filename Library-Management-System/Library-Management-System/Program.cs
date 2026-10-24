using System;
using System.Collections.Generic;

class LibraryManagementSystem
{
    static void Main()
    {
        const int MaxBooks = 5;
        const int MaxBorrowed = 3;
        List<string> books = new List<string>();
        List<string> borrowedBooks = new List<string>();

        while (true)
        {
            Console.WriteLine("Would you like to add, remove, borrow, return, search, checkin a book, or exit? (add/remove/borrow/return/search/checkin/exit)");
            string? actionInput = Console.ReadLine();
            string action = actionInput?.Trim().ToLower() ?? "";

            switch (action)
            {
                case "add":
                    if (books.Count >= MaxBooks)
                    {
                        Console.WriteLine("The library is full. No more books can be added.");
                    }
                    else
                    {
                        Console.WriteLine("Enter the title of the book to add:");
                        string? newBook = Console.ReadLine();
                        if (string.IsNullOrWhiteSpace(newBook))
                        {
                            Console.WriteLine("Book title cannot be empty.");
                        }
                        else
                        {
                            books.Add(newBook);
                            Console.WriteLine($"Book '{newBook}' added.");
                        }
                    }
                    break;

                case "remove":
                    Console.WriteLine("Enter the title of the book to remove:");
                    string? removeBook = Console.ReadLine();
                    if (books.Remove(removeBook ?? ""))
                    {
                        Console.WriteLine($"Book '{removeBook}' removed.");
                    }
                    else
                    {
                        Console.WriteLine("Book not found.");
                    }
                    break;

                case "borrow":
                    if (borrowedBooks.Count >= MaxBorrowed)
                    {
                        Console.WriteLine($"You have already borrowed the maximum of {MaxBorrowed} books.");
                        break;
                    }
                    Console.WriteLine("Enter the title of the book to borrow:");
                    string? borrowBook = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(borrowBook) && books.Contains(borrowBook))
                    {
                        if (borrowedBooks.Contains(borrowBook))
                        {
                            Console.WriteLine($"You have already borrowed '{borrowBook}'.");
                        }
                        else
                        {
                            borrowedBooks.Add(borrowBook);
                            Console.WriteLine($"You have borrowed '{borrowBook}'.");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Book '{borrowBook}' is not available in the collection.");
                    }
                    break;

                case "return":
                    Console.WriteLine("Enter the title of the book to return:");
                    string? returnBook = Console.ReadLine();
                    if (borrowedBooks.Remove(returnBook ?? ""))
                    {
                        Console.WriteLine($"You have returned '{returnBook}'.");
                    }
                    else
                    {
                        Console.WriteLine($"You have not borrowed '{returnBook}'.");
                    }
                    break;

                case "search":
                    Console.WriteLine("Enter the title of the book to search for:");
                    string? searchBook = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(searchBook) && books.Contains(searchBook))
                    {
                        Console.WriteLine($"Book '{searchBook}' is available in the collection.");
                    }
                    else
                    {
                        Console.WriteLine($"Book '{searchBook}' is not in the collection.");
                    }
                    break;

                case "checkin":
                    Console.WriteLine("Enter the title of the book to check in:");
                    string? checkinBook = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(checkinBook) && borrowedBooks.Contains(checkinBook))
                    {
                        borrowedBooks.Remove(checkinBook);
                        Console.WriteLine($"Book '{checkinBook}' has been checked in.");
                    }
                    else
                    {
                        Console.WriteLine($"Book '{checkinBook}' is not currently checked out.");
                    }
                    break;

                case "exit":
                    return;

                default:
                    Console.WriteLine("Invalid action. Please type 'add', 'remove', 'borrow', 'return', 'search', 'checkin', or 'exit'.");
                    break;
            }

            // Display the list of books
            Console.WriteLine("Available books:");
            if (books.Count == 0)
            {
                Console.WriteLine("The library is empty.");
            }
            else
            {
                foreach (var book in books)
                {
                    Console.WriteLine(book);
                }
            }

            // Display borrowed books
            Console.WriteLine($"You have borrowed {borrowedBooks.Count} book(s):");
            if (borrowedBooks.Count == 0)
            {
                Console.WriteLine("None");
            }
            else
            {
                foreach (var b in borrowedBooks)
                {
                    Console.WriteLine(b);
                }
            }
        }
    }
}
