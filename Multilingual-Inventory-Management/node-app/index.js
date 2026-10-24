const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

async function main() {
    let inventory = [];

    while (true) {
        console.log("\n--- Inventory Management (Node.js) ---");
        console.log("1. Add Product\n2. View Inventory\n3. Delete Product\n4. Exit");
        const choice = await rl.question("Select an option: ");

        if (choice === '1') {
            const id = await rl.question("Enter ID: ");
            const name = await rl.question("Enter Name: ");
            const price = await rl.question("Enter Price: ");
            inventory.push({ id, name, price });
            console.log("Added successfully!");
        } 
        else if (choice === '2') {
            console.log("\n--- Inventory ---");
            if (inventory.length === 0) console.log("Empty.");
            inventory.forEach(p => console.log(`ID: ${p.id} | Name: ${p.name} | Price: $${p.price}`));
        } 
        else if (choice === '3') {
            const id = await rl.question("Enter ID to delete: ");
            const originalLength = inventory.length;
            inventory = inventory.filter(p => p.id !== id);
            console.log(inventory.length < originalLength ? "Deleted." : "Not found.");
        } 
        else if (choice === '4') {
            rl.close();
            break;
        }
    }
}

main();
