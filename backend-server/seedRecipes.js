const mysql = require('mysql2');

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'vaishak1234',
    password: '1234',
    database: 'recipe_database'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if there is a connection error
    }
    console.log('Connected to the database.');

    // Clear the table (if needed)
    db.query('TRUNCATE TABLE recipes', (err) => {
        if (err) {
            console.error('Error truncating table:', err);
        } else {
            console.log('Table cleared successfully.');

            // Seed recipes
            const recipes = [
                {
                    name: "High-Protein Cottage Cheese Omelet",
                    ingredients: JSON.stringify([
                        { ingredient: "cheese", quantity: 1 },
                        { ingredient: "egg", quantity: 1 }
                    ]),
                    instructions: "Cook a high-protein omelet with cottage cheese and eggs.",
                    link: "https://www.thekitchn.com/cottage-cheese-omelet-265026"
                },
                {
                    name: "Tomato Grilled Cheese Sandwich",
                    ingredients: JSON.stringify([
                        { ingredient: "tomato", quantity: 1 },
                        { ingredient: "cheese", quantity: 1 },
                        { ingredient: "bun", quantity: 1 }
                    ]),
                    instructions: "Grill a bun with tomato and cheese for a perfect sandwich.",
                    link: "https://www.thekitchn.com/how-to-make-the-best-tomato-grilled-cheese-sandwich-234170"
                },
                {
                    name: "Egg Salad Sandwiches",
                    ingredients: JSON.stringify([
                        { ingredient: "egg", quantity: 1 },
                        { ingredient: "cheese", quantity: 1 },
                        { ingredient: "bun", quantity: 1 }
                    ]),
                    instructions: "Prepare egg salad and serve it between buns.",
                    link: "https://www.thekitchn.com/egg-salad-sandwich-recipe-23392067"
                },
                {
                    name: "Perfect Hard Boiled Egg",
                    ingredients: JSON.stringify([
                        { ingredient: "egg", quantity: 1 }
                    ]),
                    instructions: "Learn to make the perfect hard-boiled egg every time.",
                    link: "https://www.thekitchn.com/how-to-boil-eggs-perfectly-every-time-video-202415"
                }
            ];

            recipes.forEach((recipe) => {
                db.query('INSERT INTO recipes SET ?', recipe, (err) => {
                    if (err) {
                        console.error('Error inserting recipe:', err);
                    }
                });
            });

            console.log('Recipes seeded successfully!');
        }

        // Close the connection
        db.end();
    });
});
