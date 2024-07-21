const tokenAmount = document.getElementById('tokenAmount')
let tokens = localStorage.getItem('tokens') ? localStorage.getItem('tokens') : 100
tokenAmount.innerHTML = tokens
localStorage.setItem('tokens', tokens)
const lootboxesAmount = document.getElementById('lootboxesAmount')
let lootboxes = localStorage.getItem('lootboxes') ? localStorage.getItem('lootboxes') : 3
localStorage.setItem('lootboxes', lootboxes)
lootboxesAmount.innerHTML = lootboxes
const degugButton = document.getElementById('debugButton')
const sendToStore1 = document.getElementById('sendToStore1')
const lootBoxIcon = document.getElementById('summonLootbox')
const popupOverlay = document.getElementById('popupOverlay');
const noLootboxPopup = document.getElementById('noLootboxPopup');
const goToShopButton = document.getElementById('goToShopButton');
const closePopupButton = document.getElementById('closePopupButton');
const shopButton = document.getElementById('shopButton');
const debugBox = document.getElementById('debugBox');
const clipboardButton = document.getElementById('clipboardButton');
const clipboardOverlay = document.getElementById('clipboardOverlay');
const closeClipboard = document.getElementById('closeClipboard');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumber = document.getElementById('pageNumber');
const Encyclopedia = document.getElementById('Encyclopedia');

let chessboard;
let currentPage = 1;

function loadPage(pageElement, pageNum) {
    pageElement.innerHTML = autoGeneratedRulebook[pageNum];
}

function setPlayerIndicator(color, elementIdentifiers) {
    const whitePlayer = document.getElementById(elementIdentifiers.white);
    const blackPlayer = document.getElementById(elementIdentifiers.black);

    if (color.toLowerCase() === 'white') {
        whitePlayer.classList.add('active');
        blackPlayer.classList.remove('active');
    } else if (color.toLowerCase() === 'black') {
        blackPlayer.classList.add('active');
        whitePlayer.classList.remove('active');
    } else {
        console.error('Invalid color. Use "white" or "black".');
    }
}

function switchActivePlayer() {
    if (chessboard) {
        chessboard.switchActivePlayer();

    }
}

function showPage(pageNum) {
    document.querySelectorAll('.clipboard-page').forEach(page => page.style.display = 'none');
    const pageElement = document.getElementById(`page`);
    pageElement.style.display = 'block';
    loadPage(pageElement, pageNum);
    pageNumber.textContent = `Page ${pageNum} / ${totalPages}`;
}

clipboardButton.addEventListener('click', () => {
    clipboardOverlay.style.display = 'block';
    showPage(currentPage);
});

closeClipboard.addEventListener('click', () => {
    clipboardOverlay.style.display = 'none';
});

clipboardOverlay.addEventListener('click', (event) => {
    if (event.target === clipboardOverlay) {
        clipboardOverlay.style.display = 'none';
    }
});

prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});



if (!DEBUG_MODE) {
    debugBox.style.display = 'none';
}

function showPopup() {
    popupOverlay.style.display = 'block';
    noLootboxPopup.style.display = 'block';
}

function hidePopup() {
    popupOverlay.style.display = 'none';
    noLootboxPopup.style.display = 'none';
}


window.onload = () => {
    console.log(setupData)

    gameState = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : undefined;
    if (!DEBUG_MODE) {
        localStorage.removeItem('gameState')
    }

    chessboard = new Chessboard(undefined, gameState);

    sendToStore1.addEventListener('click', () => {
        localStorage.setItem('tokens', tokens)
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './store'
    })

    lootBoxIcon.addEventListener('click', () => {
        lootboxes = localStorage.getItem('lootboxes') ? localStorage.getItem('lootboxes') : 0
        if (lootboxes <= 0) {
            console.warn('No lootboxes left');
            showPopup();
            return;
        }
        let success = chessboard.generateLootBox(chessboard.getGameState(), 100);
        if (success) {
            lootboxes--;
            lootboxesAmount.innerHTML = lootboxes;
            render();
            localStorage.setItem('lootboxes', lootboxes);
        }
    });

    closePopupButton.addEventListener('click', hidePopup);

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            hidePopup();
        }
    });

    goToShopButton.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()));
        window.location.href = './shop';
    });

    shopButton.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()));
        window.location.href = './shop';
    });

    clipboardButton.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        clipboardOverlay.style.display = 'block';
        showPage(currentPage);
    });

    Encyclopedia.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './encyclopedia';
    });

    // degugButton.addEventListener('click', () => {
    //     console.warn('Debugging button clicked')
    // })
};