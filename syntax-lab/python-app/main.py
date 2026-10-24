# --- Python Syntax Guide ---
# 1. Imports: Simply 'import module'
# 2. Indentation: Python uses 4 spaces (not { }) to define logic blocks.
# 3. Typing: Variables are created just by assigning values (no 'int' or 'string' needed).

def main():
    # List: A flexible dynamic array
    library = [] 

    while True:
        # Colons (:) start every block (if, while, for, def)
        print("\n[PYTHON SYNTAX] 1:Add, 2:View, 3:Delete, 4:Exit")
        choice = input("Choice: ")

        if choice == "1":
            # Variables are created at the moment of assignment
            title = input("Title: ")
            author = input("Author: ")
            
            # Dictionary: Key-value pairs inside { }
            book = {"t": title, "a": author}
            library.append(book)

        elif choice == "2":
            # Loop: 'for item in collection' syntax
            for b in library:
                # F-Strings: Use f"..." to inject variables directly into text
                print(f"Book: {b['t']} | Author: {b['a']}")

        elif choice == "3":
            t = input("Delete Title: ")
            # List Comprehension: A unique Python way to filter lists in one line
            library = [b for b in library if b['t'] != t]

        elif choice == "4":
            break # Breaks the while loop

if __name__ == "__main__":
    main() # Entry point of the script
