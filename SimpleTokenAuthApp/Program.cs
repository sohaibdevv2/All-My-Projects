using System;

namespace SimpleTokenAuthApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var authManager = new AuthManager();
            var secureContentManager = new SecureContentManager(authManager);

            Console.WriteLine("Simple Token-Based Authentication App");
            while (true)
            {
                Console.WriteLine("\nChoose an option: 1. Register 2. Login 3. Access Secure Content 4. Exit");
                string choice = Console.ReadLine();
                switch (choice)
                {
                    case "1":
                        authManager.Register();
                        break;
                    case "2":
                        authManager.Login();
                        break;
                    case "3":
                        secureContentManager.AccessSecureContent();
                        break;
                    case "4":
                        return;
                    default:
                        Console.WriteLine("Invalid choice.");
                        break;
                }
            }
        }
    }
}