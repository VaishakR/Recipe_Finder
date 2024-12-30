const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db'); // Importing the MariaDB connection pool

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Ingredients list
let ingredients = [];

// Broadcast updates to clients
const broadcastUpdates = () => {
    io.emit('update', { ingredients });
};

// Add ingredients
app.post("/ingredients", (req, res) => {
    const newIngredients = req.body.ingredients;
    console.log("Ingredients received:", newIngredients);

    // Add to ingredients list (avoid duplicates)
    newIngredients.forEach(ingredient => {
        if (!ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
        }
    });

    broadcastUpdates();
    res.status(200).json({ message: "Ingredients updated successfully" });
});

// Remove ingredients
app.post("/remove_ingredient", (req, res) => {
    const ingredientsToRemove = req.body.ingredients;
    console.log("Removing ingredients:", ingredientsToRemove);

    // Remove ingredients
    ingredients = ingredients.filter(ingredient => !ingredientsToRemove.includes(ingredient));

    broadcastUpdates();
    res.status(200).json({ message: "Ingredients removed successfully" });
});

// Fetch all ingredients
app.get("/ingredients", (req, res) => {
    res.json(ingredients);
});

// Fetch recipes from the database based on the ingredients available
app.get("/recipes", async (req, res) => {
    try {
        const matchingRecipes = await getMatchingRecipes(ingredients);
        if (matchingRecipes.length > 0) {
            res.json(matchingRecipes);
        } else {
            res.status(404).json({ message: "No recipes found for the available ingredients." });
        }
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Server error fetching recipes.' });
    }
});

// Function to get matching recipes from the database based on available ingredients
const getMatchingRecipes = async (ingredients) => {
    // SQL query to fetch recipes that match the available ingredients
    const query = `
        SELECT r.name AS recipe_name, r.instructions, ri.ingredient, ri.quantity
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE ri.ingredient IN (?) 
        GROUP BY r.id
    `;

    try {
        // Connect to the MariaDB database and fetch matching recipes
        const connection = await pool.getConnection();
        const results = await connection.query(query, [ingredients]);

        // Process and organize the results
        const recipes = results.reduce((acc, row) => {
            // Check if the recipe already exists in the accumulator
            if (!acc[row.recipe_name]) {
                acc[row.recipe_name] = {
                    name: row.recipe_name,
                    instructions: row.instructions,
                    ingredients: []
                };
            }
            acc[row.recipe_name].ingredients.push({ ingredient: row.ingredient, quantity: row.quantity });
            return acc;
        }, {});

        return Object.values(recipes); // Return the recipes as an array
    } catch (err) {
        console.error('Error fetching recipes from the database:', err);
        throw err;
    }
};

// Start server
server.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
