# PYTHON FUNDAMENTALS Wisdom Library

def main():
    # 1. DATA STRUCTURE: A Dictionary organizing our data
    # Key = Religion/Category
    # Value = A List of strings (The Quotes/Verses)
    wisdom_data = {
        "Judaism": [
            "Moses (Musa): 'Love your neighbor as yourself.' (Leviticus 19:18)",
            "Moses (Musa): 'Justice, justice shall you pursue.' (Deuteronomy 16:20)",
            "Moses (Musa): 'The world stands on three things: truth, justice, and peace.'"
        ],
        "Christianity_Quranic":[
            "Jesus (Isa): 'Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet.' (Quran, Surah Maryam 19:30)",
            "Jesus (Isa): 'And He has made me blessed wherever I am and has enjoined upon me prayer and charity as long as I remain alive.' (Quran, Surah Maryam 19:31)",
            "Jesus (Isa): 'I said not to them except what You commanded me - to worship Allah, my Lord and your Lord.' (Quran, Surah Al-Ma'idah 5:117)"
        ],
        "Islam":[
            "Muhammad (SAW): 'O people, your Lord is one and your father Adam is one. There is no superiority of an Arab over a non-Arab, nor of a non-Arab over an Arab, nor of a white over a black, nor of a black over a white, except by piety and good action.' (Farewell Sermon, Musnad Ahmad)",
            "Muhammad (SAW): 'None of you truly believes until he loves for his brother what he loves for himself.' (Sahih Al-Bukhari)",
            "Muhammad (SAW): 'The best among you are those who have the best manners and character.' (Sahih Al-Bukhari)",
            "Muhammad (SAW): 'The strong person is not the good wrestler. Rather, the strong person is the one who controls himself when he is angry.' (Sahih Al-Bukhari)",
            "Muhammad (SAW): 'He who does not show mercy to people, Allah will not show mercy to him.' (Sahih Muslim)",
            "Muhammad (SAW): 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' (Sahih Al-Bukhari & Muslim)"
        ]
    }

    while True:
        # 2. MENU DISPLAY
        print("\n==============================")
        print("   PROPHETIC WISDOM CONSOLE   ")
        print("==============================")
        print("1. Judaism (Moses / Musa)")
        print("2. Jesus / Isa (From the Quran)")
        print("3. Islam (Muhammad SAW)")
        print("4. Exit")
        
        choice = input("\nSelect an option (1-4): ")

        # 3. LOGIC: Using Conditionals to display specific lists
        if choice == '1':
            print("\n--- Words from Moses (Musa) ---")
            for quote in wisdom_data["Judaism"]:
                print(f"• {quote}\n")

        elif choice == '2':
            print("\n--- Words of Jesus (Isa) in the Quran ---")
            for quote in wisdom_data["Christianity_Quranic"]:
                print(f"• {quote}\n")

        elif choice == '3':
            print("\n--- Words from Muhammad (SAW) ---")
            for quote in wisdom_data["Islam"]:
                print(f"• {quote}\n")

        elif choice == '4':
            print("Peace be upon you. Goodbye!")
            break # This exits the while loop safely
        
        else:
            print("Invalid choice. Please enter a number between 1 and 4.")

# 4. ENTRY POINT
if __name__ == "__main__":
    main()
