// Boek Module voor Eurasier Friends International PWA
// Gemaakt in dezelfde stijl als andere modules

// Initialiseer de boek module
function initBookModule() {
    return `
        <div id="bookModule">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0" id="bookTitle">
                        <i class="bi bi-book"></i> Boek
                    </h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <h5><i class="bi bi-info-circle"></i> <span id="bookContentTitle">Boek</span></h5>
                        <p id="bookContentText">
                            Dit is de Boek module. Hier komt informatie over het boek.
                        </p>
                    </div>
                    
                    <div class="module-content" id="bookModuleContent">
                        <!-- Inhoud van het boek komt hier -->
                        <div class="text-center py-5">
                            <i class="bi bi-book" style="font-size: 3rem; color: #6c757d;"></i>
                            <h4 class="mt-3" id="bookComingSoon">Boek inhoud komt binnenkort</h4>
                            <p class="text-muted" id="bookDescription">
                                Deze module wordt nog ontwikkeld. Binnenkort vindt u hier informatie over het boek.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Vertaal de boek module
function translateBookModule(lang) {
    const translations = {
        nl: {
            bookTitle: "Boek",
            bookContentTitle: "Boek",
        },
        en: {
            bookTitle: "Book",
            bookContentTitle: "Book",
        },
        de: {
            bookTitle: "Buch",
            bookContentTitle: "Buch",
        }
    };
    
    const t = translations[lang] || translations.nl;
    
    // Update alle teksten
    const elements = {
        'bookTitle': t.bookTitle,
        'bookContentTitle': t.bookContentTitle,
        'bookContentText': t.bookContentText,
        'bookComingSoon': t.bookComingSoon,
        'bookDescription': t.bookDescription
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

// Exporteer functies voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initBookModule, translateBookModule };
}