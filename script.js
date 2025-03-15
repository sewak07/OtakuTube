document.addEventListener("DOMContentLoaded", () => {
    const recommendationsContainer = document.querySelector(".mainContent");
    const paginationContainer = document.querySelector(".pagination");

    const url2 = "https://api.jikan.moe/v4/recommendations/anime";
    const itemsPerPage = 16;
    let recommendationsData = [];
    let currentPageAnime = 1;

    const displayRecommendations = (data, page) => {
        recommendationsContainer.innerHTML = ""; 

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = data.slice(startIndex, endIndex);

        paginatedItems.forEach(anime => {
           // const genres = anime.genres.map(genre => genre.name).join(', ') || 'No genres available';
            recommendationsContainer.innerHTML += `
              <div class='insideRecommendations'>
                <img src='${anime.entry[0].images.jpg.image_url}' class='recommendationsImage' alt='${anime.entry[0].title}'><br><br>
                <h4>${anime.entry[0].title}</h4><br>
                
                <button class="readMore" data-id="${anime.entry[0].mal_id}">Read more</button>
              </div>
            `;
        });

        // Add event listener for "Read More" buttons
        document.querySelectorAll(".readMore").forEach(button => {
            button.addEventListener("click", (event) => {
                const animeId = event.target.getAttribute("data-id");
                if (animeId) {
                    // Redirect to the details page with anime ID
                    window.location.href = `animeDetails.html?id=${animeId}`;
                } else {
                    console.log("Error: animeId is missing.");
                }
            });
        });
    };

    const setupPagination = (data) => {
        paginationContainer.innerHTML = ""; 
        const totalPages = Math.ceil(data.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.innerText = i;

            if (i === currentPageAnime) {
                pageButton.classList.add("active");
            }

            pageButton.addEventListener("click", () => {
                currentPageAnime = i;
                displayRecommendations(recommendationsData, currentPageAnime);

                document.querySelectorAll(".pagination button").forEach(btn => {
                    btn.classList.remove("active");
                });
                pageButton.classList.add("active");
            });

            paginationContainer.appendChild(pageButton);
        }
    };

    const getRecommendations = async () => {
        try {
            let response = await fetch(url2);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            let data = await response.json();
            console.log(data);
            recommendationsData = data.data;

            displayRecommendations(recommendationsData, currentPageAnime);
            setupPagination(recommendationsData);

        } catch (error) {
            console.error("Error occurred:", error);
            recommendationsContainer.innerHTML = `<p>Error fetching recommendations: ${error.message}</p>`;
        }
    };

    getRecommendations();
});

// Search functionality
document.querySelector(".searchBtn").addEventListener("click", () => {
    performSearch();
});

// Trigger search when Enter key is pressed
document.querySelector("input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

// Function to perform search
function performSearch() {
    let query = document.querySelector("input").value.trim();
    
    if (query !== "") {
        localStorage.setItem("searchQuery", query); // Store the search query
        window.location.href = "search.html"; 
    }
}

// Manga recommendations section

const mangaId = 13; // Replace with the actual Manga ID
const mainContent = document.querySelector(".mangaMainContent");
const pagination = document.querySelector(".mangaPagination");

let recommendationsManga = [];
let currentPageManga = 1;
const itemsPerPageManga = 10;

async function fetchRecommendations(id) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
        const data = await response.json();

        if (!data.data.length) {
            mainContent.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        recommendationsManga = data.data.map(recommendation => recommendation.entry);
        displayRecommendationsManga();
        setupPaginationManga();
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        mainContent.innerHTML = `<p>Error fetching manga recommendations: ${error.message}</p>`;
    }
}

function displayRecommendationsManga() {
    mainContent.innerHTML = "";

    let startIndex = (currentPageManga - 1) * itemsPerPageManga;
    let endIndex = startIndex + itemsPerPageManga;
    let paginatedItems = recommendationsManga.slice(startIndex, endIndex);

    paginatedItems.forEach((manga) => {
        const mangaCard = document.createElement("div");
        mangaCard.classList.add("manga-card");

        mangaCard.innerHTML = `
        <div class="insideMangaRecommendations">
            <img src="${manga.images.jpg.image_url}" alt="${manga.title}" class="manga-image"><br><br>
            <h3>${manga.title}</h3><br><br>
            <a href="manga-details.html?id=${manga.mal_id}" class="readMore" style="text-decoration:none">Read More</a><br><br>
            </div>
        `;

        mainContent.appendChild(mangaCard);
    });
}

function setupPaginationManga() {
    pagination.innerHTML = "";

    let totalPages = Math.ceil(recommendationsManga.length / itemsPerPageManga);

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("page-btn");

        if (i === currentPageManga) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            currentPageManga = i;
            displayRecommendationsManga();
            setupPaginationManga();
        });

        pagination.appendChild(pageButton);
    }
}

fetchRecommendations(mangaId);

