// InformatieManager - Module voor het tonen van de werkwijze in 3 talen
class InformatieManager {
    constructor() {
        console.log('InformatieManager geïnitialiseerd');
        this.detectLanguage();
    }

    // Detecteer taal uit localStorage of standaard Nederlands
    detectLanguage() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        console.log(`Taal gedetecteerd: ${this.currentLang}`);
    }

    // Get vertalingen - alleen basisteksten
    getTranslations() {
        return {
            nl: {
                modalTitle: 'De werkwijze',
                infoTitle: 'Module nog in ontwikkeling',
                infoText: 'Deze module toont straks informatie over de werkwijze binnen de app.',
                sectionTitle: 'De werkwijze module',
                sectionText: `Werkwijze:

Gebruiker: 
Een gebruiker kan zoeken naar een hond door in het menu op Hond zoeken te klikken en de naam van de hond in te typen. Als de hond in het dropdown menu verschijnt dan klik je de hond aan in het dropdown menu en komt het scherm naar voren met de ouders en gezondheid gegevens. Ook staat daar de knop "Stamboom" als je hier op klik genereerd het programma de stamboom van deze hond. In de stamboom kan je op een card van een hond klikken waardoor je een popup krijgt met de gegevens van de betreffende hond. Als er foto's van de hond zijn staan deze in het klein ook hierin. Op het moment dat je op een kleine foto klik wordt deze vergroot. 
In de fotogalerij kan je alle foto's laden en door de foto's scrollen en een foto vergroten om er op te klikken.`,
                closeBtn: 'Sluiten'
            },
            en: {
                modalTitle: 'The Workflow',
                infoTitle: 'Module still in development',
                infoText: 'This module will soon show information about the workflow within the app.',
                sectionTitle: 'The Workflow module',
                sectionText: `Workflow:

User:
A user can search for a dog by clicking on "Search for dog" in the menu and typing the name of the dog. If the dog appears in the dropdown menu, you click on the dog in the dropdown menu and the screen will appear with the parent and health data. There is also the "Pedigree" button; if you click on this, the program generates the pedigree of this dog. In the pedigree you can click on a dog's card which gives you a popup with the details of that particular dog. If there are photos of the dog, these are also displayed in small size here. When you click on a small photo, it will be enlarged.
In the photo gallery you can load all photos, scroll through the photos and enlarge a photo to click on it.`,
                closeBtn: 'Close'
            },
            de: {
                modalTitle: 'Die Arbeitsweise',
                infoTitle: 'Modul noch in Entwicklung',
                infoText: 'Dieses Modul wird bald Informationen über die Arbeitsweise innerhalb der App anzeigen.',
                sectionTitle: 'Das Arbeitsweise-Modul',
                sectionText: `Arbeitsweise:

Benutzer:
Ein Benutzer kann nach einem Hund suchen, indem er im Menü auf "Hund suchen" klickt und den Namen des Hundes eingibt. Wenn der Hund im Dropdown-Menü erscheint, klicken Sie den Hund im Dropdown-Menü an und der Bildschirm erscheint mit den Eltern- und Gesundheitsdaten. Dort befindet sich auch die Schaltfläche "Stammbaum". Wenn Sie darauf klicken, generiert das Programm den Stammbaum dieses Hundes. Im Stammbaum können Sie auf eine Karte eines Hundes klicken, wodurch Sie ein Popup mit den Daten des betreffenden Hundes erhalten. Wenn es Fotos des Hundes gibt, sind diese hier ebenfalls in kleiner Form enthalten. Wenn Sie auf ein kleines Foto klicken, wird es vergrößert.
In der Fotogalerie können Sie alle Fotos laden, durch die Fotos scrollen und ein Foto vergrößern, um darauf zu klicken.`,
                closeBtn: 'Schließen'
            }
        };
    }

    // Haal vertaalde tekst op
    getText(key) {
        this.detectLanguage(); // Always refresh language
        const translations = this.getTranslations();
        return translations[this.currentLang]?.[key] || translations.nl[key];
    }

    // Toon de werkwijze modal
    showModal() {
        console.log('InformatieManager.showModal() aangeroepen');
        
        const modalHTML = `
            <div class="modal fade" id="informatieModal" tabindex="-1" aria-labelledby="informatieModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="informatieModalLabel">
                                <i class="bi bi-gear"></i> ${this.getText('modalTitle')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.getText('closeBtn')}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>${this.getText('infoTitle')}</strong><br>
                                ${this.getText('infoText')}
                            </div>
                            
                            <div class="py-3">
                                <h4 class="mb-3">${this.getText('sectionTitle')}</h4>
                                <p class="text-muted" style="white-space: pre-line">${this.getText('sectionText')}</p>
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
        const existingModal = document.getElementById('informatieModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Voeg de modal toe aan de DOM
        const modalsContainer = document.getElementById('modalsContainer');
        if (modalsContainer) {
            modalsContainer.innerHTML = modalHTML;
            
            // Toon de modal
            const modalElement = document.getElementById('informatieModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('Informatie modal getoond in taal:', this.currentLang);
            }
        } else {
            console.error('Modals container niet gevonden');
        }
    }
}

// Maak de module globaal beschikbaar
window.InformatieManager = new InformatieManager();
window.informatie = window.InformatieManager;

console.log('Informatie module geladen in 3 talen');