// modules/boek.js

// Boek module vertalingen
const boekTranslations = {
    nl: {
        title: "Boek",
        content: `
            <div class="boek-content">
                <div class="row">
                    <div class="col-md-4">
                        <img src="img/nederlands.jpg" alt="Boek in het Nederlands" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <h3>Mijn Boek</h3>
                        <p>Hebt u interesse in het boek? Stuur een email naar: <strong>leoneurasier@gmail.com</strong></p>
                    </div>
                </div>
            </div>
        `
    },
    en: {
        title: "Book",
        content: `
            <div class="boek-content">
                <div class="row">
                    <div class="col-md-4">
                        <img src="img/engels.jpg" alt="Book in English" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <h3>My Book</h3>
                        <p>Are you interested in the book? Send an email to: <strong>leoneurasier@gmail.com</strong></p>
                    </div>
                </div>
            </div>
        `
    },
    de: {
        title: "Buch",
        content: `
            <div class="boek-content">
                <div class="row">
                    <div class="col-md-4">
                        <img src="img/duits.jpg" alt="Buch auf Deutsch" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <h3>Mein Buch</h3>
                        <p>Haben Sie Interesse an dem Buch? Senden Sie eine E-Mail an: <strong>leoneurasier@gmail.com</strong></p>
                    </div>
                </div>
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