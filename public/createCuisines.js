// Const values for cuisine type menu components
const cuisineCheckClass = "cuisine-type-check";
const cuisineCheckStyle = "float: right; margin-top: 10px; margin-right: 15px;";
const cuisineButtonClass = "cuisine-type";

// Holds cuisines to generate menu components
var cuisineTypes = [
    'Mexican',
    'Vietnamese',
    'Indian',
    'Italian',
    'Chinese',
    'Thai',
    'Greek',
    'Middle Eastern',
    'Korean',
    'Japanese',
    'African',
    'Latin',
    'American'
]

// Create components for cuisine options inside Cuisine Type Menu
cuisineTypes.map(function(cuisine) {
    // Build selected division associated with cuisine option
    console.log(cuisine)
    var cuisineOption = document.createElement('div')
    cuisineOption.setAttribute('class', cuisineCheckClass);
    cuisineOption.setAttribute('id', cuisine);
    cuisineOption.setAttribute('style', cuisineCheckStyle);

    // Build cuisine button for sparking query
    var cuisineButton = document.createElement('a');
    cuisineButton.setAttribute('class', cuisineButtonClass);
    cuisineButton.innerText = cuisine;

    // Attach cuisine check and button to cuisine type menu
    var cuisineTypeMenu = document.getElementById('mySidenav');
    cuisineTypeMenu.appendChild(cuisineOption);
    cuisineTypeMenu.appendChild(cuisineButton);
    console.log(cuisineTypeMenu)
});
