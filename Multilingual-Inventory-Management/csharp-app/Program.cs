using System;
using System.Collections.Generic;
using System.Linq;

class Product {
    public string Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
}

class Program {
    static void Main() {
        List<Product> inventory = new List<Product>();

        while (true) {
            Console.WriteLine("\n--- Inventory Management (C#) ---");
            Console.WriteLine("1. Add Product\n2. View Inventory\n3. Delete Product\n4. Exit");
            string choice = Console.ReadLine();

            if (choice == "1") {
                Console.Write("Enter ID: ");
                string id = Console.ReadLine();
                Console.Write("Enter Name: ");
                string name = Console.ReadLine();
                Console.Write("Enter Price: ");
                double price = Convert.ToDouble(Console.ReadLine());
                
                inventory.Add(new Product { Id = id, Name = name, Price = price });
                Console.WriteLine("Product Added!");
            }
            else if (choice == "2") {
                Console.WriteLine("\n--- Inventory ---");
                if (inventory.Count == 0) Console.WriteLine("Empty.");
                foreach (var p in inventory) 
                    Console.WriteLine($"ID: {p.Id} | Name: {p.Name} | Price: ${p.Price}");
            }
            else if (choice == "3") {
                Console.Write("Enter ID to delete: ");
                string id = Console.ReadLine();
                int removed = inventory.RemoveAll(p => p.Id == id);
                Console.WriteLine(removed > 0 ? "Deleted." : "Not found.");
            }
            else if (choice == "4") break;
        }
    }
}
