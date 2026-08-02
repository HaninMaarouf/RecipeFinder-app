const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const recipesContainer = document.getElementById("recipes");
const recipeDetails = document.getElementById("recipeDetails");

const API_URL =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=";



// Search button
searchBtn.addEventListener("click", searchRecipes);


// Search with Enter key
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchRecipes();

    }

});



// Fetch recipes
async function searchRecipes() {


    const searchTerm = searchInput.value.trim();


    if (searchTerm === "") {

        recipesContainer.innerHTML =
            "<p>Please enter a recipe name.</p>";

        return;

    }



    // Clear old data
    recipesContainer.innerHTML = "";
    recipeDetails.innerHTML = "";



    recipesContainer.innerHTML =
        "<p>Loading recipes...</p>";



    try {


        const response =
            await fetch(API_URL + searchTerm);



        if (!response.ok) {

            throw new Error("API request failed");

        }



        const data =
            await response.json();



        recipesContainer.innerHTML = "";



        if (!data.meals) {


            recipesContainer.innerHTML =
                "<p>No recipes found.</p>";


            return;

        }



        displayRecipes(data.meals);



    } catch (error) {


        recipesContainer.innerHTML =
            `
            <p>
                Something went wrong. Try again later.
            </p>
            `;


        console.error(error);

    }

}





// Create recipe cards
function displayRecipes(meals) {


    meals.forEach((meal) => {


        const card =
            document.createElement("div");


        card.classList.add("card");



        const image =
            document.createElement("img");


        image.src = meal.strMealThumb;

        image.alt = meal.strMeal;



        const title =
            document.createElement("h3");


        title.textContent =
            meal.strMeal;



        const category =
            document.createElement("p");


        category.textContent =
            `Category: ${meal.strCategory}`;



        const viewBtn =
            document.createElement("button");


        viewBtn.textContent =
            "View Recipe";



        viewBtn.addEventListener("click", () => {

            showRecipeDetails(meal);

        });



        card.appendChild(image);

        card.appendChild(title);

        card.appendChild(category);

        card.appendChild(viewBtn);



        recipesContainer.appendChild(card);


    });


}






// Show full recipe
function showRecipeDetails(meal) {


    const ingredients =
        getIngredients(meal);



    recipeDetails.innerHTML = `


        <div class="details-card">


            <img 
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >



            <h2>
                ${meal.strMeal}
            </h2>



            <p>
                Category: ${meal.strCategory}
            </p>



            <p>
                Area: ${meal.strArea}
            </p>




            <h3>
                Ingredients
            </h3>



            <ul>

                ${
                    ingredients
                    .map(
                        item => `<li>${item}</li>`
                    )
                    .join("")
                }

            </ul>




            <h3>
                Instructions
            </h3>



            <p>
                ${meal.strInstructions}
            </p>



        </div>


    `;



    recipeDetails.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });


}







// Extract ingredients
function getIngredients(meal) {


    const ingredients = [];



    for (let i = 1; i <= 20; i++) {


        const ingredient =
            meal[`strIngredient${i}`];



        const measure =
            meal[`strMeasure${i}`];



        if (ingredient) {


            ingredients.push(
                `${measure} ${ingredient}`
            );


        }

    }



    return ingredients;

}