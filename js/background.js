const test = () => {
    chrome.storage.local.get(items => {
        const now = new Date()
        items.last = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
        chrome.storage.local.set(items)
    })

    chrome.windows.create({
        height: 600,
        width: 400,
        top: 0,
        left: 0,
        type: "popup",
        url: "../pages/popup.html#article"
    })
}


chrome.runtime.onInstalled.addListener(details => {
    const reason = details.reason
    let openPage = false
    switch (reason) {
        case "install":
            openPage = "welcome.html"
            chrome.tabs.create({ url: `../pages/${openPage}` })
            chrome.storage.local.clear()
            const now = new Date()
            chrome.storage.local.set({
                last: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
                settings: {
                    cycle: "day"
                }
            })
            break
        case "update":
            const manifest = chrome.runtime.getManifest()
            if (manifest.version != details.previousVersion) {
                openPage = "release.html"
                chrome.tabs.create({ url: `../pages/${openPage}` })
            }
            break
    }
    console.log(`%c[Event chrome.runtime.onInstalled]\n%ctabs.details.reason: %c${reason}\n%cvar.openPage: %c${openPage}`,
        "font-size: 15px;", "font-size: 12px; font-weight: bold;", "font-weight: normal;",
        "font-weight: bold;", "font-weight: normal;")
})


chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(items => {
        const cycle = items.settings.cycle
        let openPopup
        if (cycle == "startup") {
            openPopup = true
            test()
        } else {
            openPopup = false
        }
        console.log(`%c[Event chrome.runtime.onStartup]\n%cstorage.settings.cycle: %c${cycle}\n%cvar.openPopup: %c${openPopup}`,
            "font-size: 15px;", "font-size: 12px; font-weight: bold;", "font-weight: normal;",
            "font-weight: bold;", "font-weight: normal;")
    })
})


chrome.tabs.onUpdated.addListener((_, changeInfo) => {
    if (changeInfo.status == "complete") {
        chrome.storage.local.get(items => {
            const last = items.last
            const now = new Date()
            const today = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
            if (new Date(last) < new Date(today)) {
                const cycle = items.settings.cycle
                let openPopup
                if (cycle == "day") {
                    openPopup = true
                    test()
                } else {
                    openPopup = false
                }
                console.log(`%c[Event chrome.tabs.onUpdated]\n%cstorage.last: %c${last}\n%cvar.today: %c${today}\n` +
                    `%cstorage.settings.cycle: %c${cycle}\n%cvar.openPopup: %c${openPopup}`, "font-size: 15px;",
                    "font-size: 12px; font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;",
                    "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;")
            }
        })
    }
})
