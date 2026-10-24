def main():
    inventory = []

    while True:
        print("\n--- Inventory Management (Python) ---")
        print("1. Add Product\n2. View Inventory\n3. Delete Product\n4. Exit")
        choice = input("Select an option: ")

        if choice == '1':
            # Adding a product as a dictionary
            prod_id = input("Enter Product ID: ")
            name = input("Enter Product Name: ")
            price = input("Enter Price: ")
            inventory.append({"id": prod_id, "name": name, "price": price})
            print("Product added successfully!")

        elif choice == '2':
            # Viewing products
            print("\n--- Current Inventory ---")
            if not inventory:
                print("Inventory is empty.")
            for item in inventory:
                print(f"ID: {item['id']} | Name: {item['name']} | Price: ${item['price']}")

        elif choice == '3':
            # Deleting via list comprehension
            prod_id = input("Enter Product ID to delete: ")
            initial_count = len(inventory)
            inventory = [item for item in inventory if item['id'] != prod_id]
            if len(inventory) < initial_count:
                print("Product deleted.")
            else:
                print("Product ID not found.")

        elif choice == '4':
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
