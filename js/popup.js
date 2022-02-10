window.onload = () => {
    document.querySelector(".article").onclick = () => {
        chrome.windows.create({
            state: "maximized",
            type: "popup",
            url: "../pages/article.html"
        })
    }
}
