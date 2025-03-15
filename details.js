document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    if (!animeId) {
        document.querySelector(".animeDetails").innerHTML = "<p>Anime not found!</p>";
        return;
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        if (!response.ok) {
            throw new Error("Anime details not found");
        }

        const data = await response.json();
        const anime = data.data;
        console.log(anime);

        document.getElementById("animeTitle").textContent = anime.title;
        document.getElementById("animeImage").src = anime.images.jpg.image_url;
        document.getElementById("animeSynopsis").textContent = anime.synopsis || "No synopsis available.";
        document.getElementById("duration").textContent = `Duration: ${anime.duration}`;
        document.getElementById("episode").textContent = `Episodes: ${anime.episodes}`;
        document.getElementById("rank").textContent = `Rank: ${anime.rank}`;
        document.getElementById("rating").textContent = `Rating: ${anime.rating}`;
        document.getElementById("score").textContent = `Score: ${anime.score}`;
        document.getElementById("status").textContent = `Status: ${anime.status}`;

    } catch (error) {
        console.error("Error fetching anime details:", error);
        document.querySelector(".animeDetails").innerHTML = "<p>Error loading anime details.</p>";
    }
});
