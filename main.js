// Container, in dem die Pokémon-Karten hinzugefügt werden sollen
const pokemonContainer = document.getElementById('pokemon-container')
//const favoritePokemons = JSON.parse(localStorage.getItem('favorites'))
const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
let searchFlag = false;
let searched;
// console.log(typeof document.getElementById("pokesearch").value === "number")


//input
const pokemonSearch = document.getElementById("pokesearch")

pokemonSearch.addEventListener("input", function () {

    if (pokemonSearch.value === "") {
        searchFlag = false;
        //displayPokemons()

    }
    else {
        searchFlag = true;
    }
    console.log(pokemonSearch.value);
    pokemonContainer.innerHTML = "";
    //displayPokemons(pokemonSearch.value);
})

const searchBtn = document.getElementById('searchBtn')

searchBtn.classList.add("bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded")

searchBtn.onclick = y => {
    console.log("btn geklicked")
    console.log(pokemonSearch.value)
    displayPokemons(pokemonSearch.value)
    searchFlag = false
}


// Funktion, um die Daten eines einzelnen Pokémon von der API abzurufen
async function fetchPokemon(id) {
    if (id === undefined) {

        return
    }
    try {
        // Abruf der Pokémon-Daten anhand der ID
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json(); // Umwandlung der Antwort in ein JSON-Objekt
        // Die Daten des Pokémon werden zurückgegeben
        console.log(pokemon)
        return pokemon;
    } catch (error) {
        // Fehlerbehandlung, falls die API-Anfrage fehlschlägt
        console.error('Error fetching pokemons', error);
    }
}

async function fetchByName(pokemonName) {
    if (pokemonName === "") {
        return
    }
    try {
        // Abruf der Pokémon-Daten anhand der ID
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemon = await response.json(); // Umwandlung der Antwort in ein JSON-Objekt
        // Die Daten des Pokémon mit dem Namen wird zurückgegeben
        return pokemon;
    } catch (error) {
        // Fehlerbehandlung, falls die API-Anfrage fehlschlägt
        console.error('Error fetching pokemonName', error);
    }
}

//Naci
function removeItemFromFavorites(pokemonName) {
    let favorites = localStorage.getItem('favorites');

    favorites = favorites ? JSON.parse(favorites) : [];

    const updatedFavorites = favorites.filter(items => items.name !== pokemonName);

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    /*if (favorites.includes(pokemonName)) {
        favorites = favorites.filter(x => x != pokemonName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log(`${pokemonName}was deleted`);
    }
    else {
        console.log('it does not exist');
    }*/
}

//Bahman
function addToFavorites(pokemonName) {

    let favorites = localStorage.getItem('favorites');

    favorites = favorites ? JSON.parse(favorites) : [];

    const pokemonWithNote = {
        name: pokemonName,
        note: "",
        noteFlag: false
    };
    const isFavorited = favorites.some(items => items.name === pokemonName);
    if (!isFavorited) {
        favorites.push(pokemonWithNote);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    else {
        console.log(`Pokémon mit dem Namen ${pokemonName} ist bereits in der Favoritenliste.`);
    }

    /*if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName); // Name zur Liste hinzufügen
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Favoritenliste speichern
    } else {
        console.log(`Pokémon mit dem Namen ${pokemonName} ist bereits in der Favoritenliste.`);
    }*/
}

function pokemonCardCreator(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'border-2', 'p-4', 'text-center', 'flex', 'flex-col');
    pokemonCard.style.width = "300px";

    // Header: Pokémon adı ve HP
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
    header.style.borderBottom = "1px solid gray";
    header.style.paddingBottom = "5px";

    const pokemonName = document.createElement('h2');
    pokemonName.textContent = pokemon.name.toUpperCase();
    pokemonName.classList.add('text-xl', 'font-bold');

    const pokemonHP = document.createElement('span');
    const hpStat = pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat;
    pokemonHP.textContent = `HP: ${hpStat}`;
    pokemonHP.classList.add('font-semibold', 'text-red-500');

    header.appendChild(pokemonName);
    header.appendChild(pokemonHP);

    const pokeTypeUndfavorite = document.createElement('div');
    pokeTypeUndfavorite.classList.add('w-full', 'h-10', 'flex', 'items-center', 'justify-between');

    // Type 
    const typeDiv = document.createElement('p');
    const types = pokemon.types.map(type => type.type.name).join(', ').toUpperCase();
    typeDiv.textContent = `Type: ${types}`;
    typeDiv.classList.add('text-center', 'text-gray-600');

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add("bg-transparent", "text-4xl", "cursor-pointer", "text-gray-500");
    favoriteButton.textContent = "★";

    const isFavorited = Array.isArray(favoritesData)
        ? favoritesData.some(item => item.name === pokemon.name)
        : false;
    if (isFavorited) {
        favoriteButton.style.color = "gold";
    }

    // favorite Button click event
    favoriteButton.addEventListener('click', () => {
        if (favoriteButton.style.color === "gold") {
            favoriteButton.style.color = "gray";
            // call function to remove it into the favorites list
            removeItemFromFavorites(pokemon.name);
        } else {
            favoriteButton.style.color = "gold";
            // call function to add it into the favorites list
            addToFavorites(pokemon.name);
        }
    });

    pokeTypeUndfavorite.appendChild(typeDiv);
    pokeTypeUndfavorite.appendChild(favoriteButton);

    // image
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('w-full', 'h-40', 'flex', 'justify-center', 'mb-4');
    const pokemonImage = document.createElement('img');
    //pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default;
    pokemonImage.src = pokemon.sprites.other.showdown.front_shiny;
    pokemonImage.alt = pokemon.name;
    pokemonImage.style.width = "150px";
    imageDiv.appendChild(pokemonImage);

    // Attack and Defense
    const statsDiv = document.createElement('div');
    statsDiv.classList.add('text-sm', 'mb-4');
    const attackStat = pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
    const defenseStat = pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;
    statsDiv.innerHTML = `<p>Attack: ${attackStat} | Defense: ${defenseStat}</p>`;

    // Abilities
    const abilitiesDiv = document.createElement('div');
    abilitiesDiv.classList.add('text-sm', 'mb-4', 'text-left');
    abilitiesDiv.innerHTML = `
        <p><strong>Abilities:</strong></p>
        <ul>
            ${pokemon.abilities.map(ability => `<li>- ${ability.ability.name}</li>`).join('')}
        </ul>
    `;

    // height and weight
    const dimensionsDiv = document.createElement('div');
    dimensionsDiv.classList.add('text-sm', 'mb-4');
    dimensionsDiv.textContent = `Height: ${(pokemon.height / 10).toFixed(1)} m | Weight: ${(pokemon.weight / 10).toFixed(1)} kg`;


    pokemonCard.appendChild(header);
    pokemonCard.appendChild(pokeTypeUndfavorite)
    pokemonCard.appendChild(imageDiv);
    pokemonCard.appendChild(statsDiv);
    pokemonCard.appendChild(dimensionsDiv);
    pokemonCard.appendChild(abilitiesDiv);

    return pokemonCard;
}

// YAKUP Kalkan
// Funktion, um Pokémon-Karten anzuzeigen
async function displayPokemons(searched) {
    console.log(searched)

    if (searchFlag) {
        console.log(searchFlag);
        // Abrufen der Pokémon-Daten für die aktuelle ID
        const pokemon = await fetchByName(searched);
        console.log(pokemon);
        if (pokemon) {
            pokemonContainer.appendChild(pokemonCardCreator(pokemon));
        }
    }
    else {
        // Schleife, um die ersten 150 Pokémon (ID: 1 bis 150) zu durchlaufen
        for (let i = 1; i <= 150; i++) {
            // Abrufen der Pokémon-Daten für die aktuelle ID
            const pokemon = await fetchPokemon(i);

            // Nur fortfahren, wenn die Daten erfolgreich abgerufen wurden
            if (pokemon) {
                // Erstellen einer Karte für das Pokémon
                pokemonContainer.appendChild(pokemonCardCreator(pokemon));
            }
        }
    }
}

displayPokemons(pokemonSearch);
