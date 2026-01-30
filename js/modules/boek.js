// modules/boek.js

// Boek module vertalingen
const boekTranslations = {
    nl: {
        title: "Boek",
        content: `
            <div class="boek-content">
                <p>BOEK</p>
            </div>
        `
    },
    en: {
        title: "Book",
        content: `
            <div class="boek-content">
                <p>BOOK</p>
            </div>
        `
    },
    de: {
        title: "Buch",
        content: `
            <div class="boek-content">
                <p>BUCH</p>
            </div>
        `
    }
};

// Functie om boek module te initialiseren
function initBookModule() {
    console.log('Boek module initialiseren...');
    
    // Creëer de module HTML - exact dezelfde structuur als historie.js
    const bookHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-book"></i> 
                        <span id="bookTitle">Boek</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <div id="bookContent">${boekTranslations.nl.content}</div>
            </div>
        </div>
    `;
    
    return bookHTML;
}

// Functie om boek module te vertalen
function translateBookModule(lang) {
    const bookTitle = document.getElementById('bookTitle');
    const bookContent = document.getElementById('bookContent');
    
    if (bookTitle && boekTranslations[lang]) {
        bookTitle.textContent = boekTranslations[lang].title;
    }
    
    if (bookContent && boekTranslations[lang]) {
        bookContent.innerHTML = boekTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBookModule,
        translateBookModule,
        boekTranslations
    };
}