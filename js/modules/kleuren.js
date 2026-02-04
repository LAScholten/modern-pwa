// KleurenManager - Module voor het tonen van standaard kleuren in 3 talen
class KleurenManager {
    constructor() {
        console.log('KleurenManager geïnitialiseerd');
        this.detectLanguage();
    }

    // Detecteer de huidige taal van de pagina
    detectLanguage() {
        // Methode 1: Kijk naar de actieve taal knop in de navigatie
        const activeLangBtn = document.querySelector('.app-lang-btn.active');
        if (activeLangBtn) {
            this.currentLang = activeLangBtn.getAttribute('data-lang');
            console.log(`Taal gedetecteerd via actieve knop: ${this.currentLang}`);
            return;
        }

        // Methode 2: Kijk naar localStorage
        const storedLang = localStorage.getItem('appLanguage');
        if (storedLang) {
            this.currentLang = storedLang;
            console.log(`Taal gedetecteerd via localStorage: ${this.currentLang}`);
            return;
        }

        // Methode 3: Kijk naar HTML lang attribuut
        const htmlLang = document.documentElement.lang;
        if (htmlLang && htmlLang.length === 2) {
            this.currentLang = htmlLang;
            console.log(`Taal gedetecteerd via HTML lang attribuut: ${this.currentLang}`);
            return;
        }

        // Standaard: Nederlands
        this.currentLang = 'nl';
        console.log(`Standaard taal gebruikt: ${this.currentLang}`);
    }

    // Haal taal opnieuw op (voor als taal gewijzigd is tijdens sessie)
    refreshLanguage() {
        this.detectLanguage();
        return this.currentLang;
    }

    // Get vertalingen
    getTranslations() {
        return {
            nl: {
                modalTitle: 'De standaard kleuren',
                infoTitle: 'Dit zijn de kleurnamen zoals ze in de database gebruikt moeten worden.',
                infoText: 'Hierdoor hebben we een eenduidige manier van de kleuren in de Database.',
                closeBtn: 'Sluiten',
                colors: {
                    blond: 'Blond',
                    blondgrijs: 'Blondgrijs',
                    Grijsblond: 'Grijsblond',
                    blondrood: 'Blondrood',
                    roodblond: 'Roodblond',
                    rood: 'Rood',
                    Wildkleur: 'Wildkleur',
                    wildkleurrood: 'Wildkleur',
                    wolfsgrau: 'Wolfsgrau',
                    zwart: 'Zwart',
                    zwartmettan: 'Zwart met aftekeningen',
                    wit: 'Wit',
                    bont: 'Piebold'
                }
            },
            en: {
                modalTitle: 'The Standard Colors',
                infoTitle: 'These are the color names as they should be used in the database.',
                infoText: 'This provides a consistent way of handling colors in the Database.',
                closeBtn: 'Close',
                colors: {
                    blond: 'Blond',
                    blondgrijs: 'Blond-Gray',
                    Grijsblond: 'Gray-Blond',
                    blondrood: 'Blond-Red',
                    roodblond: 'Red-Blond',
                    rood: 'Red',
                    Wildkleur: 'Wildcolor',
                    wildkleurrood: 'Wildcolor',
                    wolfsgrau: 'Wolfgray',
                    zwart: 'Black',
                    zwartmettan: 'Black with Markings',
                    wit: 'White',
                    bont: 'Piebold'
                }
            },
            de: {
                modalTitle: 'Die Standardfarben',
                infoTitle: 'Dies sind die Farbnamen, wie sie in der Datenbank verwendet werden müssen.',
                infoText: 'Dadurch haben wir eine einheitliche Art und Weise der Farben in der Datenbank.',
                closeBtn: 'Schließen',
                colors: {
                    blond: 'Falben',
                    blondgrijs: 'Falben-Grau',
                    Grijsblond: 'Grau-Falben',
                    blondrood: 'Falben-Rot',
                    roodblond: 'Rot-Falben',
                    rood: 'Rot',
                    Wildkleur: 'Wildfarbe',
                    wildkleurrood: 'Wildfarbe',
                    wolfsgrau: 'Wolfsgrau',
                    zwart: 'Schwarz',
                    zwartmettan: 'Schwarz mit Abzeichen',
                    wit: 'Weiss',
                    bont: 'Piebold'
                }
            }
        };
    }

    // Haal vertaalde tekst op
    getText(key, subKey = null) {
        // Refresh taal voordat we vertaling ophalen
        this.refreshLanguage();
        
        const translations = this.getTranslations();
        const lang = this.currentLang;
        
        if (subKey) {
            return translations[lang]?.[key]?.[subKey] || translations.nl[key][subKey];
        }
        return translations[lang]?.[key] || translations.nl[key];
    }

    // Toon de kleuren modal
    showModal() {
        console.log('KleurenManager.showModal() aangeroepen');
        
        // Refresh taal voordat we modal tonen
        this.refreshLanguage();
        console.log('Huidige taal:', this.currentLang);
        
        // Lijst met kleurenbestanden en hun basis namen
        const kleurenData = [
            { file: 'blond.jpg', key: 'blond' },
            { file: 'blondgrijs.jpg', key: 'blondgrijs' },
            { file: 'Grijsblond.jpg', key: 'Grijsblond' },
            { file: 'blondrood.jpg', key: 'blondrood' },
            { file: 'roodblond.jpg', key: 'roodblond' },
            { file: 'rood.jpg', key: 'rood' },
            { file: 'Wildkleur.jpg', key: 'Wildkleur' },
            { file: 'wildkleurrood.jpg', key: 'wildkleurrood' },
            { file: 'wolfsgrau.jpg', key: 'wolfsgrau' },
            { file: 'zwart.jpg', key: 'zwart' },
            { file: 'zwartmettan.jpg', key: 'zwartmettan' },
            { file: 'wit.JPG', key: 'wit' },
            { file: 'bont.jpg', key: 'bont' }
        ];

        let kleurenHTML = '';
        
        for (let i = 0; i < kleurenData.length; i += 2) {
            kleurenHTML += '<div class="row mb-4">';
            
            // Eerste afbeelding in de rij
            if (i < kleurenData.length) {
                const kleur1 = kleurenData[i];
                const title1 = this.getText('colors', kleur1.key);
                kleurenHTML += `
                    <div class="col-md-6">
                        <div class="card h-100">
                            <img src="img/kleur/${kleur1.file}" class="card-img-top" alt="${title1}" style="transform: scale(0.95); transform-origin: center center;">
                            <div class="card-body text-center">
                                <h5 class="card-title">${title1}</h5>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Tweede afbeelding in de rij
            if (i + 1 < kleurenData.length) {
                const kleur2 = kleurenData[i + 1];
                const title2 = this.getText('colors', kleur2.key);
                kleurenHTML += `
                    <div class="col-md-6">
                        <div class="card h-100">
                            <img src="img/kleur/${kleur2.file}" class="card-img-top" alt="${title2}" style="transform: scale(0.95); transform-origin: center center;">
                            <div class="card-body text-center">
                                <h5 class="card-title">${title2}</h5>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            kleurenHTML += '</div>';
        }

        const modalHTML = `
            <div class="modal fade" id="kleurenModal" tabindex="-1" aria-labelledby="kleurenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="kleurenModalLabel">
                                <i class="bi bi-palette"></i> ${this.getText('modalTitle')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.getText('closeBtn')}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>${this.getText('infoTitle')}</strong><br>
                                ${this.getText('infoText')}
                            </div>
                            
                            <div class="container-fluid">
                                ${kleurenHTML}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.getText('closeBtn')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Verwijder bestaande modal als die er is
        const existingModal = document.getElementById('kleurenModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Voeg de modal toe aan de DOM
        const modalsContainer = document.getElementById('modalsContainer');
        if (modalsContainer) {
            modalsContainer.innerHTML = modalHTML;
            
            // Toon de modal
            const modalElement = document.getElementById('kleurenModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('Kleuren modal getoond in taal:', this.currentLang);
            }
        } else {
            console.error('Modals container niet gevonden');
        }
    }
}

// Maak de module globaal beschikbaar
window.KleurenManager = new KleurenManager();
window.kleuren = window.KleurenManager;

console.log('Kleuren module geladen met automatische taaldetectie voor 3 talen');

// Optioneel: Luister naar taalwijzigingen via event delegation
document.addEventListener('DOMContentLoaded', function() {
    // Deze code zal automatisch de taal detecteren wanneer iemand op een taalwissel knop klikt
    document.addEventListener('click', function(e) {
        // Als er op een taalwissel knop wordt geklikt
        if (e.target.closest('.app-lang-btn')) {
            // Wacht even tot de taal is gewijzigd en refresh dan de module
            setTimeout(() => {
                if (window.KleurenManager && window.KleurenManager.refreshLanguage) {
                    window.KleurenManager.refreshLanguage();
                    console.log('KleurenManager taal automatisch geüpdatet na klik op taalwissel');
                }
            }, 100);
        }
    });
});