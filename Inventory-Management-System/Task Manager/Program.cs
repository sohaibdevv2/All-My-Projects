using System;
using System.Collections.Generic;


namespace InventoryManagementSystem
{
    // Represents a single product with its name, price, and stock.
    public class Product
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        // Constructor to create a new Product instance.
        public Product(string name, decimal price, int stockQuantity)
        {
            // Basic validation to ensure product data is valid.
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name cannot be empty.", nameof(name));
            if (price <= 0)
                throw new ArgumentOutOfRangeException(nameof(price), "Price must be greater than zero.");
            if (stockQuantity < 0)a
                throw new ArgumentOutOfRangeException(nameof(stockQuantity), "Stock quantity cannot be negative.");

            Name = name;
            Price = price;
            StockQuantity = stockQuantity;
        }

        // Provides a nice, formatted output for product details.
        public override string ToString()
        {
            return $"Product: {Name,-20} | Price: {Price,10:C} | Stock: {StockQuantity,5}";
        }
    }

    // Manages all inventory operations.
    public class InventoryManager
    {
        private List<Product> products = new List<Product>(); // Initialize directly

        // Adds a new product to the inventory.
        public void AddProduct(Product product)
        {
            // Check for duplicate product names manually.
            foreach (var existingProduct in products)
            {
                if (existingProduct.Name.Equals(product.Name, StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"Error: A product with the name '{product.Name}' already exists. Consider updating its stock instead.");
                    return;
                }
            }
            products.Add(product);
            Console.WriteLine($"Product '{product.Name}' added successfully.");
        }

        // Finds a product by its name (case-insensitive search).
        public Product FindProduct(string productName)
        {
            foreach (var product in products)
            {
                if (product.Name.Equals(productName, StringComparison.OrdinalIgnoreCase))
                {
                    return product;
                }
            }
            return null; // Product not found
        }

        // Updates the stock quantity for an existing product.
        public bool UpdateStock(string productName, int quantityChange)
        {
            Product product = FindProduct(productName);
            if (product == null)
            {
                Console.WriteLine($"Error: Product '{productName}' not found.");
                return false;
            }

            int newStock = product.StockQuantity + quantityChange;
            if (newStock < 0)
            {
                Console.WriteLine($"Error: Cannot reduce stock below zero. Current stock for '{product.Name}' is {product.StockQuantity}.");
                return false;
            }

            product.StockQuantity = newStock;
            Console.WriteLine($"Stock for '{product.Name}' updated to {product.StockQuantity}.");
            return true;
        }

        // Removes a product from the inventory.
        public bool RemoveProduct(string productName)
        {
            Product productToRemove = FindProduct(productName);
            if (productToRemove == null)
            {
                Console.WriteLine($"Error: Product '{productName}' not found.");
                return false;
            }

            products.Remove(productToRemove);
            Console.WriteLine($"Product '{productName}' removed successfully.");
            return true;
        }

        // Displays all products currently in the inventory.
        public void ViewAllProducts()
        {
            if (products.Count == 0)
            {
                Console.WriteLine("Inventory is currently empty. No products to display.");
                return;
            }

            Console.WriteLine("\n--- Current Inventory ---");
            foreach (var product in products)
            {
                Console.WriteLine(product);
            }
            Console.WriteLine("-------------------------\n");
        }
    }

    // Main program class for the console application.
    class Program
    {
        static InventoryManager inventory = new InventoryManager();

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to the Inventory Management System!");
            RunMenu();
        }

        // Manages the main application loop and user interaction.
        static void RunMenu()
        {
            bool running = true;
            while (running)
            {
                DisplayMenu();
                string choice = Console.ReadLine() ?? string.Empty;

                switch (choice)
                {
                    case "1": AddProductMenu(); break;
                    case "2": UpdateStockMenu(); break;
                    case "3": inventory.ViewAllProducts(); break;
                    case "4": RemoveProductMenu(); break;
                    case "5":
                        running = false;
                        Console.WriteLine("Exiting Inventory Management System. Goodbye!");
                        break;
                    default: Console.WriteLine("Invalid choice. Please enter a number between 1 and 5."); break;
                }
                Console.WriteLine("\nPress any key to continue...");
                Console.ReadKey();
                Console.Clear();
            }
        }

        // Displays the main menu options.
        static void DisplayMenu()
        {
            Console.WriteLine("--- Main Menu ---");
            Console.WriteLine("1. Add New Product");
            Console.WriteLine("2. Update Stock");
            Console.WriteLine("3. View All Products");
            Console.WriteLine("4. Remove Product");
            Console.WriteLine("5. Exit");
            Console.Write("Enter your choice: ");
        }

        // Handles adding a new product with input validation.
        static void AddProductMenu()
        {
            Console.WriteLine("\n--- Add New Product ---");
            Console.Write("Enter product name: ");
            string name = Console.ReadLine() ?? string.Empty;

            decimal price;
            // Shorter input loop: prompt is inside the loop, handles first and subsequent attempts.
            while (true)
            {
                Console.Write("Enter product price: ");
                if (decimal.TryParse(Console.ReadLine(), out price) && price > 0)
                    break;
                Console.WriteLine("Invalid price. Please enter a positive numeric value.");
            }

            int stockQuantity;
            // Shorter input loop: prompt is inside the loop, handles first and subsequent attempts.
            while (true)
            {
                Console.Write("Enter initial stock quantity: ");
                if (int.TryParse(Console.ReadLine(), out stockQuantity) && stockQuantity >= 0)
                    break;
                Console.WriteLine("Invalid quantity. Please enter a non-negative integer.");
            }

            try
            {
                Product newProduct = new Product(name, price, stockQuantity);
                inventory.AddProduct(newProduct);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Error adding product: {ex.Message}");
            }
            // catch (ArgumentOutOfRangeException ex)
            // {
                // Console.WriteLine($"Error adding product: {ex.Message}");
            // }
        }

        // Handles updating product stock.
        static void UpdateStockMenu()
        {
            Console.WriteLine("\n--- Update Product Stock ---");
            Console.Write("Enter the name of the product to update stock: ");
            string name = Console.ReadLine() ?? string.Empty;

            int quantityChange;
            // Shorter input loop: prompt is inside the loop, handles first and subsequent attempts.
            while (true)
            {
                Console.Write("Enter quantity change (positive for restock, negative for sale): ");
                if (int.TryParse(Console.ReadLine(), out quantityChange))
                    break;
                Console.WriteLine("Invalid quantity. Please enter an integer.");
            }
            inventory.UpdateStock(name, quantityChange);
        }

        // Handles removing a product.
        static void RemoveProductMenu()
        {
            Console.WriteLine("\n--- Remove Product ---");
            Console.Write("Enter the name of the product to remove: ");
            string name = Console.ReadLine() ?? string.Empty;
            inventory.RemoveProduct(name);
        }
    }
}