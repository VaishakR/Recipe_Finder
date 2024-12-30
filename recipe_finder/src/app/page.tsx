'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function App() {
  const [page, setPage] = useState<'home' | 'recipeFinder'>('home');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const socket = io('http://172.22.233.70:5000'); // Updated with your backend IP address


    socket.on('update', ({ ingredients, recipes }) => {
      setIngredients(ingredients);
      setRecipes(recipes);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={appStyle}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <h1 style={logoStyle}>Gourmet Finder</h1>
        <div style={navLinksStyle}>
          <button onClick={() => setPage('home')} style={buttonStyle}>
            Home
          </button>
          <button onClick={() => setPage('recipeFinder')} style={buttonStyle}>
            Recipe Finder
          </button>
        </div>
      </nav>

      {/* Page Content */}
      {page === 'home' ? (
        <div style={homePageStyle}>
          <div style={heroSectionStyle}>
            <div style={textOverlayStyle}>
              <p style={subtitleStyle}>Welcome to Gourmet Finder</p>
              <h2 style={mainTextStyle}>Discover Recipes for Every Mood</h2>
              <p style={descriptionStyle}>
                Use our Recipe Finder to explore amazing dishes based on the ingredients you have.
              </p>
              <button style={exploreButtonStyle} onClick={() => setPage('recipeFinder')}>
                Explore Recipes
              </button>
            </div>
            <img
              src="/image/food_image.webp"
              alt="Delicious Food"
              style={heroImageStyle}
            />
          </div>
          <div style={aboutSectionStyle}>
            <h3 style={aboutTitleStyle}>About Gourmet Finder</h3>
            <p style={aboutTextStyle}>
              Gourmet Finder is a powerful tool designed to help you create amazing meals with ingredients you already have at home. Our recipe suggestions are tailored to your needs, ensuring no ingredient goes to waste!
            </p>
          </div>
        </div>
      ) : (
        <div className="container" style={{ marginTop: '20px' }}>
          <h1 style={{ color: 'black' }}>Recipe Finder</h1>

          <div className="ingredients-section">
            <h2 style={{ color: 'black' }}>Detected Ingredients</h2>
            {ingredients.length > 0 ? (
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index} style={{ color: 'black' }}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'black' }}>No ingredients detected yet.</p>
            )}
          </div>

          <div className="recipes-section" style={{ marginTop: '30px' }}>
            <h2 style={{ color: 'black' }}>Suggested Recipes</h2>
            {loading ? (
              <p style={{ color: 'black' }}>Loading recipes...</p>
            ) : recipes.length > 0 ? (
              <div style={recipeListStyle}>
                {recipes.map((recipe, index) => (
                  <div
                    key={index}
                    style={recipeCardStyle}
                    onClick={() => window.open(recipe.link, '_blank')}
                  >
                    <h3 style={recipeTitleStyle}>{recipe.name}</h3>
                    <p style={recipeIngredientsStyle}>
                      <strong>Ingredients:</strong> {recipe.ingredients.map((ing: any) => `${ing.ingredient} (${ing.quantity})`).join(', ')}
                    </p>
                    <p style={recipeInstructionsStyle}>
                      <strong>Instructions:</strong> {recipe.instructions}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'black' }}>No recipes found based on the detected ingredients.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles for the app
const appStyle = {
  backgroundColor: '#fffaf0',
  minHeight: '100vh',
  color: '#333',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#c0d4b4', // Update navbar color to HEX #c0d4b4
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'white', // Make the text inside navbar white
};

const navLinksStyle = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle = {
  background: 'transparent',
  color: 'white', // Text color white for navbar buttons
  padding: '5px 10px',
  borderRadius: '4px',
  outline: 'none', // Remove the orange outline
  transition: 'background-color 0.3s ease, color 0.3s ease',
};


const homePageStyle = {
  textAlign: 'center',
  padding: '20px',
};

const heroSectionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  height: '70vh',
};

const textOverlayStyle = {
  position: 'absolute',
  zIndex: 2,
  textAlign: 'center',
};

const subtitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
};

const mainTextStyle = {
  fontSize: '48px',
  fontWeight: '900', // Bolder text
  color: '#ffa500', // Orange color for "Discover Recipes for Every Mood"
  position: 'relative',
  display: 'inline-block',
  background: 'rgba(0, 0, 0, 0.7)', // Transparent black background
  borderRadius: '12px', // Curved edges
  padding: '10px 20px', // Padding for better spacing
};

const descriptionStyle = {
  fontSize: '18px',
  marginTop: '10px',
  marginBottom: '20px',
  color: '#ffffff',
};

const exploreButtonStyle = {
  backgroundColor: '#ffa500',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const heroImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'brightness(0.8)', // Slightly dim the image to make text pop
};

const aboutSectionStyle = {
  marginTop: '40px',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};

const aboutTitleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffa500', // Orange for the About title
};

const aboutTextStyle = {
  fontSize: '16px',
  color: '#333',
  lineHeight: '1.6',
};

const recipeListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
};

const recipeCardStyle = {
  backgroundColor: 'rgba(255, 165, 0, 0.2)', // Transparent orange background
  color: 'black', // Make the text black
  padding: '20px',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  width: '100%', // Ensures the card stretches to fit available space
  boxSizing: 'border-box', // Ensures padding and borders are included in the width
};

const recipeTitleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: 'black', // Ensures the title is black
  textDecoration: 'none', // Ensures no blue color for links
};

const recipeIngredientsStyle = {
  fontSize: '16px',
  marginBottom: '10px',
};

const recipeInstructionsStyle = {
  fontSize: '14px',
};
