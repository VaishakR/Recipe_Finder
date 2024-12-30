const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");

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
    methods: ["GET", "POST"],
  },
});

// Database connection configuration
const dbConfig = {
  host: "localhost",
  user: "vaishak1234",
  password: "1234",
  database: "recipe_database",
};

// Ingredients list
let ingredients = [];

// Helper function to fetch recipes from the database
const fetchRecipesFromDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute("SELECT * FROM recipes");
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      instructions: row.instructions,
      ingredients: JSON.parse(row.ingredients), // Parse the JSON-formatted ingredients
      link: row.link, // Get the link column
    }));
  } catch (error) {
    console.error("Error fetching recipes from database:", error);
    return [];
  } finally {
    await connection.end();
  }
};

// Broadcast updates
const broadcastUpdates = async () => {
  try {
    const recipes = await fetchRecipesFromDatabase();
    const matchingRecipes = recipes.filter((recipe) => {
      return recipe.ingredients.every(({ ingredient, quantity }) => {
        // Check if the ingredient exists and if we have enough quantity
        const ingredientCount = ingredients.filter((i) => i.includes(ingredient))
          .length;
        return ingredientCount >= quantity;
      });
    });
    io.emit("update", { ingredients, recipes: matchingRecipes });
  } catch (error) {
    console.error("Error broadcasting updates:", error);
  }
};

// Add ingredients
app.post("/ingredients", (req, res) => {
  const newIngredients = req.body.ingredients;
  console.log("Ingredients received:", newIngredients);

  // Add to ingredients list (avoid duplicates)
  newIngredients.forEach((ingredient) => {
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
  ingredients = ingredients.filter(
    (ingredient) => !ingredientsToRemove.includes(ingredient)
  );

  broadcastUpdates();
  res.status(200).json({ message: "Ingredients removed successfully" });
});

// Fetch all ingredients
app.get("/ingredients", (req, res) => {
  res.json(ingredients);
});

// Fetch recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await fetchRecipesFromDatabase();
    const matchingRecipes = recipes.filter((recipe) => {
      return recipe.ingredients.every(({ ingredient, quantity }) => {
        // Check if the ingredient exists and if we have enough quantity
        const ingredientCount = ingredients.filter((i) => i.includes(ingredient))
          .length;
        return ingredientCount >= quantity;
      });
    });

    if (matchingRecipes.length > 0) {
      res.json(matchingRecipes);
    } else {
      res
        .status(404)
        .json({ message: "No recipes found for the available ingredients." });
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// Start server
// Start server
server.listen(port, "172.22.233.70", () => {
    console.log(`Backend server running at http://172.22.233.70:${port}`);
  });
  