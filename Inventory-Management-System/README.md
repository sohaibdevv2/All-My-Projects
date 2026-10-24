# Inventory Management system
## Technologies Used
![My Skills](https://go-skill-icons.vercel.app/api/icons?i=cs,git,githubcopilot&titles=true&theme=dark)

This is a basic console-based application built in C# that allows you to manage product inventory. You can add new products, update their stock quantities, view all products, and remove products from the inventory.

## Features

* **Add Products:** Easily add new products to your inventory with a name, price, and initial stock quantity.
* **Update Stock:** Adjust the stock level of existing products (increase for restock, decrease for sales).
* **View Inventory:** See a clear list of all products currently in your inventory, including their price and available stock.
* **Remove Products:** Delete products from your inventory when they are no longer needed.
* **Input Validation:** The system includes basic validation to ensure data integrity (e.g., positive prices, non-negative stock).

## Code Structure

The project is organized into three main classes:

* **`Product` Class:** Represents a single product with properties for **`Name`**, **`Price`**, and **`StockQuantity`**. It includes basic validation in its constructor and an overridden **`ToString()`** method for formatted output.
* **`InventoryManager` Class:** Handles all the core inventory logic. It maintains a list of **`Product`** objects and provides methods for **`AddProduct`**, **`FindProduct`**, **`UpdateStock`**, **`RemoveProduct`**, and **`ViewAllProducts`**.
* **`Program` Class:** Contains the **`Main`** method, which is the entry point of the application. It manages the console menu, user input, and calls the appropriate **`InventoryManager`** methods.
