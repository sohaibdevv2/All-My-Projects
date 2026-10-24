// --- Node.js Syntax Guide ---
// 1. Require: Imports modules (libraries) into constants.
// 2. Async/Await: Handles tasks that take time (like waiting for user input).
// 3. Triple Equals (===): Used for strict comparison (value + type).

const readline = require('readline/promises').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    // 'let' defines a variable that can change. 'const' defines one that won't.
    let library = [];

    while (true) {
        console.log("\n[NODE SYNTAX] 1:Add, 2:View, 3:Delete, 4:Exit");
        // 'await' pauses the code until the user finishes typing
        const choice = await readline.question("Choice: ");

        if (choice === "1") {
            const title = await readline.question("Title: ");
            const author = await readline.question("Author: ");
            
            // Push: Adds an object { } to the array [ ]
            library.push({ title, author });
        }
        else if (choice === "2") {
            // Arrow Function: A modern, clean way to write loops
            library.forEach(b => {
                console.log(`Book: ${b.title} | Author: ${b.author}`);
            });
        }
        else if (choice === "3") {
            const t = await readline.question("Delete Title: ");
            // Filter: Creates a new array excluding the matches
            library = library.filter(b => b.title !== t);
        }
        else if (choice === "4") {
            process.exit(); // Explicitly kills the Node process
        }
    }
}

run(); // Executes the async function
