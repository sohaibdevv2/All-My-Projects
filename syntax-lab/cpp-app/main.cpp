// --- C++ Syntax Guide ---
// 1. Headers: #include loads files before the code is compiled.
// 2. IO: Uses 'Streams' (cin >> and cout <<) instead of functions.
// 3. Return: 'int main' must return an integer (usually 0).

#include <iostream>
#include <vector>
#include <string>

using namespace std; // Avoids typing 'std::' before every command

struct Book {
    string title;
    string author;
};

int main() {
    vector<Book> library; // Vectors are C++'s dynamic arrays
    int choice;

    while (true) {
        // << operator "pushes" data to the console output
        cout << "\n[C++ SYNTAX] 1:Add, 2:View, 3:Delete, 4:Exit: ";
        cin >> choice; // >> operator "pulls" data from keyboard

        if (choice == 1) {
            Book b;
            cout << "Title: "; cin >> b.title;
            cout << "Author: "; cin >> b.author;
            library.push_back(b);
        }
        else if (choice == 2) {
            // Iteration: 'auto' automatically detects the data type
            for (const auto& b : library) {
                cout << b.title << " by " << b.author << endl;
            }
        }
        else if (choice == 3) {
            string t;
            cout << "Delete Title: "; cin >> t;
            // Manual loop: Deleting in C++ requires careful iterator management
            for (int i = 0; i < library.size(); i++) {
                if (library[i].title == t) {
                    library.erase(library.begin() + i);
                }
            }
        }
        else if (choice == 4) return 0; // Ends the program execution
    }
}
