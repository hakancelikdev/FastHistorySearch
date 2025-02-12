document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("results");
    const urlCountElement = document.getElementById("url-count");

    function displayHistory(history) {
        resultsContainer.innerHTML = "";

        urlCountElement.textContent = `Toplam URL sayısı: ${history.length}`;

        history.forEach(item => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");

            link.textContent = `(${item.score}) ${item.title}`;
            link.style.fontWeight = "bold";
            link.style.color = "#333"; 
            link.style.fontSize = "16px";
            link.style.display = "inline-block";

            link.href = item.url;
            link.target = "_blank";

            listItem.appendChild(link);
            resultsContainer.appendChild(listItem);
        });
    }

    function searchHistory(query) {
        chrome.storage.local.get({ savedHistory: [] }, (data) => {
            let savedHistory = data.savedHistory;
            savedHistory.sort((a, b) => b.score - a.score);

            const filteredHistory = savedHistory.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.url.toLowerCase().includes(query.toLowerCase())
            );
            displayHistory(filteredHistory);
        });
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        searchHistory(query);
    });

    chrome.storage.local.get({ savedHistory: [] }, (data) => {
        let savedHistory = data.savedHistory;
        savedHistory.sort((a, b) => b.score - a.score);

        displayHistory(savedHistory);
    });
});
