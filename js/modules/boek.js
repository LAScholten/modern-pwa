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
function initBoekModule() {
    console.log('Boek module initialiseren...');
    
    // Creëer de module HTML
    const boekHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-book"></i> 
                        <span id="boekTitle">Boek</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <div id="boekContent" class="text-center py-5" style="font-size: 5rem; font-weight: bold; color: #333;">
                    ${boekTranslations.nl.content}
                </div>
            </div>
        </div>
    `;
    
    return boekHTML;
}

// Functie om boek module te vertalen
function translateBoekModule(lang) {
    const boekTitle = document.getElementById('boekTitle');
    const boekContent = document.getElementById('boekContent');
    
    if (boekTitle && boekTranslations[lang]) {
        boekTitle.textContent = boekTranslations[lang].title;
    }
    
    if (boekContent && boekTranslations[lang]) {
        boekContent.textContent = boekTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBoekModule,
        translateBoekModule,
        boekTranslations
    };
}