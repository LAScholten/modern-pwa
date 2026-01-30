// modules/boek.js

// Boek module vertalingen
const boekTranslations = {
    nl: {
        title: "Boek",
        content: "BOEK"
    },
    en: {
        title: "Book", 
        content: "BOOK"
    },
    de: {
        title: "Buch",
        content: "BUCH"
    }
};

// Functie om boek module te initialiseren
function initBookModule() {
    console.log('Boek module initialiseren...');
    
    // Creëer de module HTML
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
                <div id="bookContent" class="text py-5" style="font-size: 1rem; font-weight: bold; color: #333;">
                    ${boekTranslations.nl.content}
                </div>
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
        bookContent.textContent = boekTranslations[lang].content;
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