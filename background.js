const HISTORY_CHECK_INTERVAL = 10 * 60 * 1000;  // 10 dakika
const INITIAL_SCORE = 1;

async function fetchAndStoreHistory() {
    chrome.storage.local.get({ savedHistory: [] }, (data) => {
        if (data.savedHistory.length > 0) {
            chrome.storage.local.set({ savedHistory: [] });
        }
    })

    chrome.history.search({ text: "", startTime: 1, maxResults: 1_000_000 }, (results) => {
        chrome.storage.local.get({ savedHistory: [] }, (data) => {
            let savedHistory = data.savedHistory || [];

            results.forEach(item => {
                if (!item.title) {
                    return;
                }

                let existingItem = savedHistory.find(savedItem => savedItem.url === item.url);
                if (existingItem) {
                    let visitScore = item.visitCount;
                    let typedScore = item.typedCount;
                    console.log("Score increased for", item);

                    existingItem.score += (visitScore + typedScore);
                } else {
                    savedHistory.push({
                        url: item.url,
                        title: item.title,
                        score: INITIAL_SCORE + (item.visitCount + item.typedCount)
                    });
                }
            });

            chrome.storage.local.set({ savedHistory: savedHistory });
        });
    });
}

setInterval(fetchAndStoreHistory, HISTORY_CHECK_INTERVAL);

chrome.runtime.onInstalled.addListener(() => {
    fetchAndStoreHistory();
});
