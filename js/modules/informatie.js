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
                infoTitle: 'Werkwijze en functionaliteit',
                infoText: 'Hieronder vindt u een uitgebreide uitleg over de werking van de applicatie.',
                sectionText: `Werkwijze:
	
Disclaimer:
Als eerst even voor alle duidelijkheid. Deze database is interactief. Gebruiker+ kan zelf data invoeren. Dit maakt het eenvoudig om een totaal beeld te krijgen van de Eurasier Populatie. Het beheer is dan ook niet verantwoordelijk voor de gegevens die in de database aanwezig zijn. Het is een handleiding en we geven dan nu ook aan controleer alle officiële documenten met de eigenaar van de hond als je bijvoorbeeld een hond als dekreu wil gebruiken of als je van een bepaalde combinatie een pup zou willen aanschaffen. De verantwoordelijkheid blijft ten alle tijden bij jouw als gebruiker om deugdelijk onderzoek te plegen.

Gebruiker: 
Hond zoeken:
Een gebruiker kan zoeken naar een hond door in het menu op Hond zoeken te klikken. En heeft daar 2 opties:

Zoek hond op naam(of naam + kennelnaam):
Hier kan men de naam van de hond in te typen. Als de hond in het dropdown menu verschijnt dan klik je de hond aan in het dropdown menu en komt het scherm naar voren met de ouders en gezondheid gegevens. Ook staat daar de knop "Stamboom" als je hier op klik genereerd het programma de stamboom van deze hond. In de stamboom kan je op een card van een hond klikken waardoor je een popup krijg met de gegevens van de betreffende hond. Als er foto's van de hond zijn staan deze in het klein ook hierin. Op het moment dat je op een kleine foto klik word deze vergroot. Ook staan er nog 2 knoppen. 1 voor de Nakomelingen en 1 voor de (half)broers en (half)zussen.

Zoek hond op kennelnaam:
Bij deze optie kan je de kennelnaam intypen. Bijvoorbeeld "vom Jägerhof" dan krijg je alle in de database aanwezige honden van deze kennel te zien. In deze lijst kan je dan een hond aan klikken voor meer details.

Foto Galerij:
In de foto galerij kan je alle foto's laden en door de foto's scrollen en een foto vergroten om er op te klikken.

Nest Aankondigingen:
Hier kan je alle aangekondigde nesten zien, deze zijn door de fokker zelf neergezet. Deze honden staan in de database en je kan dus ook daar alle gegevens vinden die in de database bekend zijn. 

Dekreuen:
Dekreuen Bekijken:
Hier vind je alle dekreuen die door de eigenaar van de dekreu zelf zijn geplaatst.

Dekreuen beheren:
Hier kan je je reu neerzetten als dekreu. Vul alle verplichte velden in en zorg dat het netjes word opgeslagen.

Top 100 meest voorkomende voorouders:
Dit geeft een overzicht van de meest voorkomende voorouders. Reuen en teven apart. Van de laatst ingevoerde hond van een lijn gaat de analyse 10 generaties diep terug in de lijn. In het historisch overzicht worden alle lijnen bekeken, dus ook als een hond in 1999 geboren is en de laatste in de lijn is die ingevoerd is, dan word deze hond meegeteld in het historisch overzicht. In het 2e overzicht word er rekening gehouden met honden die niet ouder zijn dan 15 jaar en gaan we wel 10 generaties diep, maar als ze geboren zijn voor 1985 dan worden ze niet meer getoond. 

Hond overdracht:
In dit formulier kan men aanvragen om een hond over te zetten op zijn/haar naam. Een hond staat in de database op naam van de persoon die deze hond heeft ingevoerd. Dus als de fokker een nest invoert dan staat het gehele nest op naam van de fokker. Dit is om te voorkomen dat iedereen gegevens van een andere hond dan zijn eigen hond kan veranderen. Wil je de hond op jouw naam zetten dan vul je het formulier in en zal de admin eventueel na contact met de fokker de hond op jouw naam zetten. Daarna kan je dus zelf de gezondheid uitslagen invullen en kan je ook zelf als je een nest heb weer de eigen pups invoeren. Let wel op zolang je nog geen gebruiker+ bent zijn er nog steeds beperkingen aan wat je wel en niet kan doen.`,
                closeBtn: 'Sluiten'
            },
            en: {
                modalTitle: 'The Workflow',
                infoTitle: 'Workflow and functionality',
                infoText: 'Below you will find a comprehensive explanation of how the application works.',
                sectionText: `Workflow:
	
Disclaimer:
First of all, for clarity. This database is interactive. User+ can enter data themselves. This makes it easy to get a complete picture of the Eurasier Population. Management is therefore not responsible for the data present in the database. It is a manual and we also indicate now to check all official documents with the owner of the dog if, for example, you want to use a dog as a stud or if you would like to purchase a puppy from a particular combination. The responsibility always remains with you as the user to conduct proper research.

User:
Search dog:
A user can search for a dog by clicking on Search dog in the menu. And there are 2 options:

Search dog by name (or name + kennel name):
Here you can type the name of the dog. If the dog appears in the dropdown menu, you click on the dog in the dropdown menu and the screen appears with the parent and health data. There is also the "Pedigree" button; if you click on this, the program generates the pedigree of this dog. In the pedigree you can click on a dog's card which gives you a popup with the details of that particular dog. If there are photos of the dog, these are also displayed in small size here. When you click on a small photo, it will be enlarged. There are also 2 more buttons. 1 for the Offspring and 1 for the (half)brothers and (half)sisters.

Search dog by kennel name:
With this option you can type the kennel name. For example "vom Jägerhof" then you will see all dogs from this kennel present in the database. In this list you can then click on a dog for more details.

Photo Gallery:
In the photo gallery you can load all photos, scroll through the photos and enlarge a photo to click on it.

Litter Announcements:
Here you can see all announced litters, these are placed by the breeder themselves. These dogs are in the database and you can therefore also find all data known in the database there.

Stud Dogs:
View Stud Dogs:
Here you will find all stud dogs placed by the owner of the stud dog themselves.

Manage Stud Dogs:
Here you can place your male dog as a stud dog. Fill in all required fields and make sure it is saved properly.

Top 100 most common ancestors:
This provides an overview of the most common ancestors. Males and females separately. From the last entered dog of a line, the analysis goes 10 generations deep back in the line. In the historical overview, all lines are examined, so even if a dog was born in 1999 and is the last in the line that has been entered, this dog is counted in the historical overview. In the 2nd overview, dogs that are not older than 15 years are taken into account and we do go 10 generations deep, but if they were born before 1985 they are no longer shown.

Dog Transfer:
In this form you can request to transfer a dog to your name. A dog is in the database under the name of the person who entered this dog. So if the breeder enters a litter, the entire litter is under the name of the breeder. This is to prevent everyone from changing data of a dog other than their own dog. If you want to put the dog in your name, fill in the form and the admin will, possibly after contact with the breeder, put the dog in your name. After that you can enter the health results yourself and you can also enter your own puppies yourself if you have a litter. Please note that as long as you are not yet a user+, there are still restrictions on what you can and cannot do.`,
                closeBtn: 'Close'
            },
            de: {
                modalTitle: 'Die Arbeitsweise',
                infoTitle: 'Arbeitsweise und Funktionalität',
                infoText: 'Nachfolgend finden Sie eine ausführliche Erklärung zur Funktionsweise der Anwendung.',
                sectionText: `Arbeitsweise:
	
Haftungsausschluss:
Zunächst einmal zur Klarstellung. Diese Datenbank ist interaktiv. Benutzer+ können selbst Daten eingeben. Dies erleichtert es, ein vollständiges Bild der Eurasier-Population zu erhalten. Die Verwaltung ist daher nicht verantwortlich für die in der Datenbank vorhandenen Daten. Es ist eine Anleitung und wir weisen auch darauf hin, alle offiziellen Dokumente mit dem Besitzer des Hundes zu überprüfen, wenn Sie beispielsweise einen Hund als Deckrüden verwenden möchten oder wenn Sie einen Welpen aus einer bestimmten Kombination erwerben möchten. Die Verantwortung bleibt immer bei Ihnen als Benutzer, gründliche Recherchen durchzuführen.

Benutzer:
Hund suchen:
Ein Benutzer kann nach einem Hund suchen, indem er im Menü auf Hund suchen klickt. Und dort gibt es 2 Möglichkeiten:

Hund suchen nach Namen (oder Name + Zwingername):
Hier können Sie den Namen des Hundes eingeben. Wenn der Hund im Dropdown-Menü erscheint, klicken Sie auf den Hund im Dropdown-Menü und der Bildschirm mit den Eltern- und Gesundheitsdaten erscheint. Dort befindet sich auch die Schaltfläche "Ahnentafel". Wenn Sie darauf klicken, generiert das Programm die Ahnentafel dieses Hundes. In der Ahnentafel können Sie auf eine Karte eines Hundes klicken, wodurch Sie ein Popup mit den Daten des betreffenden Hundes erhalten. Wenn es Fotos des Hundes gibt, sind diese hier ebenfalls in kleiner Form enthalten. Wenn Sie auf ein kleines Foto klicken, wird es vergrößert. Es gibt auch 2 weitere Schaltflächen. 1 für die Nachkommen und 1 für die (Halb)brüder und (Halb)schwestern.

Hund suchen nach Zwingername:
Bei dieser Option können Sie den Zwingernamen eingeben. Zum Beispiel "vom Jägerhof" dann erhalten Sie alle in der Datenbank vorhandenen Hunde dieses Zwingers zu sehen. In dieser Liste können Sie dann auf einen Hund für weitere Details klicken.

Fotogalerie:
In der Fotogalerie können Sie alle Fotos laden, durch die Fotos scrollen und ein Foto vergrößern, um darauf zu klicken.

Wurfankündigungen:
Hier können Sie alle angekündigten Würfe sehen, diese werden vom Züchter selbst eingestellt. Diese Hunde sind in der Datenbank und Sie können daher auch alle in der Datenbank bekannten Daten dort finden.

Deckrüden:
Deckrüden ansehen:
Hier finden Sie alle Deckrüden, die vom Besitzer des Deckrüden selbst eingestellt wurden.

Deckrüden verwalten:
Hier können Sie Ihren Rüden als Deckrüden eintragen. Füllen Sie alle Pflichtfelder aus und stellen Sie sicher, dass es ordentlich gespeichert wird.

Top 100 häufigste Vorfahren:
Dies gibt einen Überblick über die häufigsten Vorfahren. Rüden und Hündinnen getrennt. Vom zuletzt eingegebenen Hund einer Linie geht die Analyse 10 Generationen tief in die Linie zurück. In der historischen Übersicht werden alle Linien betrachtet, auch wenn ein Hund 1999 geboren wurde und der letzte in der Linie ist, der eingegeben wurde, wird dieser Hund in der historischen Übersicht mitgezählt. In der 2. Übersicht werden Hunde berücksichtigt, die nicht älter als 15 Jahre sind, und wir gehen 10 Generationen tief, aber wenn sie vor 1985 geboren wurden, werden sie nicht mehr angezeigt.

Hund Übertragung:
In diesem Formular kann man beantragen, einen Hund auf seinen Namen zu übertragen. Ein Hund steht in der Datenbank auf den Namen der Person, die diesen Hund eingegeben hat. Wenn also der Züchter einen Wurf eingibt, steht der gesamte Wurf auf den Namen des Züchters. Dies soll verhindern, dass jeder Daten eines anderen Hundes als seines eigenen ändern kann. Wenn Sie den Hund auf Ihren Namen setzen möchten, füllen Sie das Formular aus und der Admin wird, möglicherweise nach Kontakt mit dem Züchter, den Hund auf Ihren Namen setzen. Danach können Sie selbst die Gesundheitsergebnisse eingeben und auch, wenn Sie einen Wurf haben, selbst die eigenen Welpen eingeben. Bitte beachten Sie, solange Sie noch kein Benutzer+ sind, gibt es immer noch Einschränkungen, was Sie tun können und was nicht.`,
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
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
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