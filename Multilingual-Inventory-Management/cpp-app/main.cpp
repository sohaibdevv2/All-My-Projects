#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Product {
    std::string id;
    std::string name;
    double price;
};

int main() {
    std::vector<Product> inventory;
    int choice;

    while (true) {
        std::cout << "\n--- Inventory Management (C++) ---\n1. Add\n2. View\n3. Delete\n4. Exit\nChoice: ";
        std::cin >> choice;

        if (choice == 1) {
            Product p;
            std::cout << "ID: "; std::cin >> p.id;
            std::cout << "Name: "; std::cin >> p.name;
            std::cout << "Price: "; std::cin >> p.price;
            inventory.push_back(p);
        } 
        else if (choice == 2) {
            for (const auto& item : inventory) {
                std::cout << "ID: " << item.id << " | Name: " << item.name << " | Price: $" << item.price << "\n";
            }
        } 
        else if (choice == 3) {
            std::string id;
            std::cout << "ID to delete: "; std::cin >> id;
            auto it = std::remove_if(inventory.begin(), inventory.end(), [&](Product& p) {
                return p.id == id;
            });
            if (it != inventory.end()) {
                inventory.erase(it, inventory.end());
                std::cout << "Deleted.\n";
            } else std::cout << "Not found.\n";
        } 
        else if (choice == 4) break;
    }
    return 0;
}
