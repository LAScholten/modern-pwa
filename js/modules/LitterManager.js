/**
 * Nest Management Module
 * Beheert toevoegen en bewerken van nesten
 * MET AUTOMATISCHE FOTOCOMPRESSIE naar onder 1MB
 */

class LitterManager {
    constructor() {
        console.log('LitterManager constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete van ouders
        this.currentLitterDogs = []; // Houdt de ingevoerde honden van het huidige nest bij
        this.allKennelNames = []; // Voor autocomplete van kennelnamen
        
        // TomSelect instances
        this.fatherTomSelect = null;
        this.motherTomSelect = null;
        
        // GEBRUIK WINDOW OBJECT VOOR DEPENDENCIES
        this.db = window.hondenService;
        this.auth = window.auth;
        this.isInitialized = !!this.db && !!this.auth;
        
        // NIEUW: Gebruikersgegevens ophalen
        this.currentUserId = localStorage.getItem('userId');
        this.currentUserRole = localStorage.getItem('userRole');
        
        // Configuratie voor beeldcompressie
        this.imageCompressionConfig = {
            maxSizeMB: 0.95,      // Onder 1MB (iets onder de grens voor veiligheid)
            maxWidthOrHeight: 1920, // Maximale afmeting (behoudt kwaliteit maar verkleint grote afbeeldingen)
            initialQuality: 0.85,   // Startkwaliteit (85% is meestal prima)
            minQuality: 0.6         // Minimale kwaliteit als de afbeelding nog te groot is
        };
        
        // Opgeslagen gecomprimeerde fotogegevens
        this.compressedPhotoFile = null;
        this.compressedPhotoDataUrl = null;
        this.thumbnailDataUrl = null;
        
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuw Nest Toevoegen",
                editDog: "Nest Bewerken",
                dogLitterChoice: "Hond of Nest Toevoegen",
                addNewDog: "Nieuwe Hond",
                addNewLitter: "Nieuw Nest",
                development: "In Ontwikkeling",
                
                // Form velden
                name: "Naam",
                nameRequired: "Naam *",
                kennelName: "Kennelnaam",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
                breedRequired: "Ras *",
                recent: "Recent:",
                father: "Vader *",
                mother: "Moeder *",
                motherTooltip: "Alleen teven die op jouw naam staan in de database worden getoond. Neem contact op met een beheerder als je teef nog niet op jouw naam staat.",
                coatColor: "Vachtkleur (selecteer)",
                standardCoatColors: "Standaard vachtkleuren:",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                gender: "Geslacht",
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                hipDysplasia: "Heupdysplasie",
                hipGrades: "Selecteer graad...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elleboogdysplasie",
                elbowGrades: "Selecteer graad...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxatie",
                patellaGrades: "Selecteer graad...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Ogen",
                eyesFree: "Vrij",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Overig",
                eyesExplanation: "Verklaring ogen overig",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Selecteer status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                luw: "LÜW / LTV",
                luwPlaceholder: "Alleen een getal",
                thyroid: "Schildklier (Tgaa)",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
                chosenFile: "Gekozen bestand:",
                compressing: "Bezig met comprimeren...",
                compressionComplete: "Compressie voltooid",
                compressingImage: "Afbeelding wordt gecomprimeerd...",
                photoCompressed: "Foto gecomprimeerd",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                back: "Terug",
                
                // Validatie
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Overlijdensdatum kan niet voor geboortedatum zijn",
                luwInvalid: "LÜW/LTV mag alleen cijfers bevatten",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om nesten te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
                // Alerts
                adminOnly: "Alleen administrators mogen nesten toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer, ras, vader en moeder zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderen!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: ",
                fileTooLarge: "Bestand is te groot na compressie",
                invalidType: "Ongeldig bestandstype. Gebruik JPG, PNG, GIF of WEBP",
                fileReadError: "Fout bij lezen bestand",
                addedDogs: "Toegevoegde honden:",
                noDogsAdded: "Nog geen honden toevoegd",
                parentNotSelected: "Selecteer een geldige hond uit de lijst voor zowel vader als moeder",

                // Container titels
                parentDetails: "Ouderdetails",
                litterDetails: "Nestdetails",
                otherDetails: "Overige details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Ogen",
                healthDandy: "Dandy",
                healthLUW: "LÜW/LTV",
                healthThyroid: "Tgaa",
                healthCoat: "Vachtkleur",
                healthGender: "Geslacht",
                typeToSearch: "Typ minimaal 2 letters om te zoeken..."
            },
            en: {
                // Modal titles
                newDog: "Add New Litter",
                editDog: "Edit Litter",
                dogLitterChoice: "Add Dog or Litter",
                addNewDog: "New Dog",
                addNewLitter: "New Litter",
                development: "In Development",
                
                // Form fields
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennel Name",
                pedigreeNumber: "Pedigree number *",
                breed: "Breed",
                breedRequired: "Breed *",
                recent: "Recent:",
                father: "Father *",
                mother: "Mother *",
                motherTooltip: "Only female dogs registered in your name are shown. Contact an administrator if your female dog is not yet registered in your name.",
                coatColor: "Coat Color (select)",
                standardCoatColors: "Standard coat colors:",
                birthDate: "Birth date",
                deathDate: "Death date",
                gender: "Gender",
                chooseGender: "Select gender...",
                male: "Male",
                female: "Female",
                hipDysplasia: "Hip Dysplasia",
                hipGrades: "Select grade...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elbow Dysplasia",
                elbowGrades: "Select grade...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Not known)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Select grade...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Eyes",
                eyesFree: "Free",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Other",
                eyesExplanation: "Other eyes explanation",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Select status...",
                dandyFreeDNA: "Free on DNA",
                dandyFreeParents: "Free on parents",
                dandyCarrier: "Carrier",
                dandyAffected: "Affected",
                luw: "LÜW / LTV",
                luwPlaceholder: "Number only",
                thyroid: "Thyroid (Tgaa)",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                addPhoto: "Add photo",
                chooseFile: "Choose file",
                noFileChosen: "No file chosen",
                chosenFile: "Chosen file:",
                compressing: "Compressing...",
                compressionComplete: "Compression complete",
                compressingImage: "Compressing image...",
                photoCompressed: "Photo compressed",
                remarks: "Remarks",
                requiredFields: "Fields with * are required",
                saveDog: "Save Dog",
                cancel: "Cancel",
                delete: "Delete",
                choose: "Choose...",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                back: "Back",
                
                // Validation
                dateFormatError: "Date must be in DD-MM-YYYY format",
                deathBeforeBirthError: "Death date cannot be before birth date",
                luwInvalid: "LÜW/LTV can only contain numbers",
                
                // Access control popup texts
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit litters. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
                // Alerts
                adminOnly: "Only administrators can add/edit litters",
                fieldsRequired: "Name, pedigree number, breed, father and mother are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                dogUpdated: "Dog successfully updated!",
                dogDeleted: "Dog successfully deleted!",
                addFailed: "Error adding dog: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: ",
                fileTooLarge: "File is still too large after compression",
                invalidType: "Invalid file type. Use JPG, PNG, GIF or WEBP",
                fileReadError: "Error reading file",
                addedDogs: "Added dogs:",
                noDogsAdded: "No dogs added yet",
                parentNotSelected: "Select a valid dog from the list for both father and mother",

                // Container titles
                parentDetails: "Parent Details",
                litterDetails: "Litter Details",
                otherDetails: "Other Details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Eyes",
                healthDandy: "Dandy",
                healthLUW: "LÜW/LTV",
                healthThyroid: "Tgaa",
                healthCoat: "Coat Color",
                healthGender: "Gender",
                typeToSearch: "Type at least 2 characters to search..."
            },
            de: {
                // Modal Titel
                newDog: "Neuen Wurf hinzufügen",
                editDog: "Wurf bearbeiten",
                dogLitterChoice: "Hund oder Wurf hinzufügen",
                addNewDog: "Neuer Hund",
                addNewLitter: "Neuer Wurf",
                development: "In Entwicklung",
                
                // Formular Felder
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennelname",
                pedigreeNumber: "Stammbaum-Nummer *",
                breed: "Rasse",
                breedRequired: "Rasse *",
                recent: "Kürzlich:",
                father: "Vater *",
                mother: "Mutter *",
                motherTooltip: "Es werden nur Hündinnen angezeigt, die auf Ihren Namen registriert sind. Kontaktieren Sie einen Administrator, wenn Ihre Hündin noch nicht auf Ihren Namen registriert ist.",
                coatColor: "Fellfarbe (auswählen)",
                standardCoatColors: "Standard Fellfarben:",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geschlecht",
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                hipDysplasia: "Hüftdysplasie",
                hipGrades: "Grad wählen...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Ellbogendysplasie",
                elbowGrades: "Grad wählen...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Grad wählen...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Augen",
                eyesFree: "Frei",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Andere",
                eyesExplanation: "Erklärung augen andere",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Status wählen...",
                dandyFreeDNA: "Frei op DNA",
                dandyFreeParents: "Frei op ouders",
                dandyCarrier: "Träger",
                dandyAffected: "Betroffen",
                luw: "LÜW / LTV",
                luwPlaceholder: "Nur ein Zahl",
                thyroid: "Schilddrüse (Tgaa)",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                chosenFile: "Gewählte Datei:",
                compressing: "Komprimieren...",
                compressionComplete: "Komprimierung abgeschlossen",
                compressingImage: "Bild wird komprimiert...",
                photoCompressed: "Foto komprimiert",
                remarks: "Bemerkungen",
                requiredFields: "Felder met * sind Pflichtfelder",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                back: "Zurück",
                
                // Validierung
                dateFormatError: "Datum moet im Format TT-MM-JJJJ sein",
                deathBeforeBirthError: "Sterbedatum kan nicht vor dem Geburtsdatum liegen",
                luwInvalid: "LÜW/LTV darf nur Zahlen enthalten",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Würfe zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Würfe hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer, Rasse, Vater en Mutter sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: ",
                fileTooLarge: "Datei ist nach der Komprimierung immer noch zu groß",
                invalidType: "Ungültiger Dateityp. Verwenden Sie JPG, PNG, GIF oder WEBP",
                fileReadError: "Fehler beim Lesen der Datei",
                addedDogs: "Hinzugefügte Hunden:",
                noDogsAdded: "Noch keine Hunde hinzugefügt",
                parentNotSelected: "Wählen Sie einen gültigen Hund aus der Liste für sowohl Vater als auch Mutter",

                // Container Titel
                parentDetails: "Elterndetails",
                litterDetails: "Wurfdetails",
                otherDetails: "Weitere Details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Augen",
                healthDandy: "Dandy",
                healthLUW: "LÜW/LTV",
                healthThyroid: "Tgaa",
                healthCoat: "Fellfarbe",
                healthGender: "Geschlecht",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen"
            }
        };
        
        // Definieer de standaard vachtkleuren per taal
        this.standardCoatColors = {
            nl: ["Blond", "Blondgrijs", "Grijsblond", "Blondrood", "Roodblond", "Rood", "Roodgrijs", "Wolfsgrau", "Wildkleur", "Zwart", "Zwart met aftekeningen", "Wit", "Piebold"],
            en: ["Light Cream", "Creamgray", "Graycream", "Creamred", "Redcream", "Red", "Redgray", "Wolfgray", "Wildcolor", "Black", "Black with markings", "White", "Piebold"],
            de: ["Falben", "Falbengrau", "Graufalben", "Falbenrot", "Rotfalben", "Rot", "Rotgrau", "Wolfsgrau", "Wildfarbe", "Schwarz", "Schwarz mit Abzeichen", "Weiß", "Piebold"]
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    /**
     * COMPRESSIE FUNCTIE - Comprimeert een afbeelding naar een formaat onder de opgegeven limiet
     * @param {File} file - Het originele bestand
     * @returns {Promise<Object>} - Geeft { blob, dataUrl, originalSize, compressedSize } terug
     */
    async compressImage(file) {
        return new Promise((resolve, reject) => {
            // Controleer of het bestand een afbeelding is
            if (!file.type.startsWith('image/')) {
                reject(new Error('Bestand is geen afbeelding'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Start compressie proces
                    this.compressImageWithQuality(img, file.type, file.size)
                        .then(compressedData => resolve(compressedData))
                        .catch(reject);
                };
                img.onerror = () => reject(new Error('Kon afbeelding niet laden'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Kon bestand niet lezen'));
            reader.readAsDataURL(file);
        });
    }
    
    async compressImageWithQuality(img, originalType, originalSize) {
        const maxSizeBytes = this.imageCompressionConfig.maxSizeMB * 1024 * 1024;
        let quality = this.imageCompressionConfig.initialQuality;
        let result = null;
        
        // Bepaal de juiste output afmetingen
        let width = img.width;
        let height = img.height;
        const maxDimension = this.imageCompressionConfig.maxWidthOrHeight;
        
        if (width > maxDimension || height > maxDimension) {
            if (width > height) {
                height = (height * maxDimension) / width;
                width = maxDimension;
            } else {
                width = (width * maxDimension) / height;
                height = maxDimension;
            }
        }
        
        // Probeer te comprimeren met verschillende kwaliteitsinstellingen
        for (let attempt = 0; attempt < 4; attempt++) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Gebruik de huidige kwaliteit voor deze poging
            const currentQuality = Math.max(quality, this.imageCompressionConfig.minQuality);
            
            // Converteer naar blob met de huidige kwaliteit
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', currentQuality);
            });
            
            const compressedSize = blob.size;
            
            console.log(`Compressie poging ${attempt + 1}: kwaliteit=${currentQuality}, grootte=${(compressedSize / 1024).toFixed(2)}KB`);
            
            if (compressedSize <= maxSizeBytes || currentQuality <= this.imageCompressionConfig.minQuality + 0.05) {
                // We hebben een acceptabel formaat bereikt of kunnen niet verder comprimeren
                const dataUrl = await this.blobToDataUrl(blob);
                result = {
                    blob: blob,
                    dataUrl: dataUrl,
                    originalSize: originalSize,
                    compressedSize: compressedSize,
                    quality: currentQuality,
                    width: width,
                    height: height
                };
                break;
            }
            
            // Verlaag kwaliteit voor volgende poging
            quality = Math.max(quality - 0.1, this.imageCompressionConfig.minQuality);
        }
        
        // Als we nog steeds geen resultaat hebben, probeer dan met maximale compressie
        if (!result) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', this.imageCompressionConfig.minQuality);
            });
            
            const dataUrl = await this.blobToDataUrl(blob);
            result = {
                blob: blob,
                dataUrl: dataUrl,
                originalSize: originalSize,
                compressedSize: blob.size,
                quality: this.imageCompressionConfig.minQuality,
                width: width,
                height: height
            };
        }
        
        return result;
    }
    
    blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Kon blob niet converteren naar data URL'));
            reader.readAsDataURL(blob);
        });
    }
    
    async resizeAndCompressImage(file) {
        try {
            console.log(`Start compressie van: ${file.name}, grootte: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            
            // Toon compressie status
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `<i class="bi bi-arrow-repeat me-1"></i> ${this.t('compressingImage')}`;
                fileInfo.classList.add('text-info');
            }
            
            // Comprimeer de afbeelding
            const compressedResult = await this.compressImage(file);
            
            const compressionRatio = ((1 - compressedResult.compressedSize / compressedResult.originalSize) * 100).toFixed(1);
            console.log(`Compressie voltooid: ${(compressedResult.originalSize / 1024 / 1024).toFixed(2)}MB -> ${(compressedResult.compressedSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% kleiner)`);
            
            // Update status
            if (fileInfo) {
                fileInfo.innerHTML = `<span class="file-chosen-info"><i class="bi bi-check-circle-fill text-success me-1"></i> ${this.t('chosenFile')} <strong>${file.name}</strong> (${(compressedResult.compressedSize / 1024).toFixed(2)} KB) - ${this.t('photoCompressed')}</span>`;
                fileInfo.classList.remove('text-info');
            }
            
            // Maak een nieuw bestand van de gecomprimeerde blob
            const compressedFile = new File([compressedResult.blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // Sla de gecomprimeerde bestandsinfo op voor later gebruik
            this.compressedPhotoFile = compressedFile;
            this.compressedPhotoDataUrl = compressedResult.dataUrl;
            this.thumbnailDataUrl = null;
            
            // Genereer een thumbnail voor preview (kleiner formaat)
            await this.generateThumbnail(compressedResult.dataUrl);
            
            return compressedFile;
        } catch (error) {
            console.error('Compressie fout:', error);
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `<i class="bi bi-exclamation-triangle me-1 text-danger"></i> ${this.t('photoError')} ${error.message}`;
                fileInfo.classList.remove('text-info');
            }
            throw error;
        }
    }
    
    async generateThumbnail(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxThumbSize = 200;
                let width = img.width, height = img.height;
                
                if (width > height) {
                    if (width > maxThumbSize) {
                        height = (height * maxThumbSize) / width;
                        width = maxThumbSize;
                    }
                } else {
                    if (height > maxThumbSize) {
                        width = (width * maxThumbSize) / height;
                        height = maxThumbSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                this.thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(this.thumbnailDataUrl);
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }
    
    /**
     * Injecteer database en auth objecten (fallback voor backward compatibility)
     */
    injectDependencies(db, auth) {
        console.log('LitterManager: injectDependencies aangroepen');
        // Gebruik window object als primaire bron, anders de geïnjecteerde dependencies
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        this.isInitialized = true;
        console.log('LitterManager: Dependencies geïnjecteerd - db:', !!this.db, 'auth:', !!this.auth);
    }
    
    /**
     * Haal de volledige modal HTML op voor nest toevoegen/bewerken
     * Dit is de methode die DogManager gebruikt om de modal te tonen
     */
    getModalHTML(isEdit = false, litterData = null) {
        console.log('LitterManager: getModalHTML aangeroepen');
        
        // Als gebruiker admin is, toon het nest formulier
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = 'addLitterModal';
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-plus-circle"></i> ${modalTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            ${this.getFormHTML(litterData)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">${this.t('close')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                /* Mobiele optimalisaties */
                @media (max-width: 768px) {
                    .modal-dialog {
                        margin: 10px;
                        max-height: 90vh;
                    }
                    
                    .modal-content {
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    
                    .modal-body {
                        padding: 15px;
                        max-height: calc(90vh - 130px);
                        overflow-y: auto;
                    }
                    
                    .breed-container {
                        gap: 8px !important;
                    }
                    
                    .breed-input-container {
                        flex: 0 0 180px !important;
                        min-width: 180px !important;
                    }
                    
                    .recent-breeds-label {
                        font-size: 0.8em !important;
                    }
                    
                    .recent-breed-btn {
                        font-size: 0.75em !important;
                        padding: 3px 6px !important;
                    }
                    
                    /* Vachtkleur container voor mobiel */
                    .coat-color-container {
                        gap: 8px !important;
                    }
                    
                    .coat-color-input-container {
                        flex: 0 0 180px !important;
                        min-width: 180px !important;
                    }
                    
                    .standard-coat-colors-label {
                        font-size: 0.8em !important;
                    }
                    
                    .standard-coat-color-btn {
                        font-size: 0.5em !important;
                        padding: 3px 6px !important;
                    }
                    
                    /* Geboortedatum input styling voor mobiel */
                    .date-input-wrapper {
                        position: relative;
                    }
                    
                    .date-input-wrapper input[type="text"] {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator,
                    .date-input-wrapper input[type="date"]::-webkit-inner-spin-button,
                    .date-input-wrapper input[type="date"]::-webkit-clear-button {
                        display: none;
                        -webkit-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"] {
                        -webkit-appearance: textfield;
                        -moz-appearance: textfield;
                        appearance: textfield;
                    }
                    
                    /* Container styling voor mobiel */
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 15px !important;
                        margin-bottom: 15px;
                    }
                    
                    .container-title {
                        font-size: 0.9em;
                        margin-bottom: 8px;
                    }
                    
                    /* Added dogs container styling voor mobiel */
                    #added-dogs-container {
                        padding: 10px !important;
                    }
                    
                    .dog-item {
                        font-size: 0.9em;
                        padding: 8px 0;
                    }
                    
                    .dog-item-header {
                        font-size: 0.85em;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    
                    .dog-item-health {
                        font-size: 0.8em;
                        margin-top: 5px;
                    }
                    
                    .health-badge {
                        font-size: 0.75em !important;
                        padding: 2px 6px !important;
                        margin-right: 4px;
                        margin-bottom: 4px;
                    }
                    
                    /* Mobiele layout voor opslaan knoppen */
                    .save-buttons-container {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .save-buttons-container .btn {
                        width: 100%;
                    }
                }
                
                /* Desktop styling */
                @media (min-width: 769px) {
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 20px !important;
                        margin-bottom: 20px;
                        background-color: #f9f9f9;
                    }
                    
                    .container-title {
                        font-weight: 600;
                        color: #495057;
                        margin-bottom: 15px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #dee2e6;
                        font-size: 1.1em;
                    }
                    
                    /* Desktop layout voor ouderdetails container */
                    #ouders-container .row > div {
                        margin-bottom: 10px;
                    }
                    
                    #ouders-container .row {
                        align-items: center;
                    }
                    
                    /* Added dogs container styling voor desktop */
                    #added-dogs-container {
                        padding: 15px !important;
                    }
                    
                    .dog-item {
                        font-size: 1em;
                        padding: 10px 0;
                    }
                    
                    .dog-item-header {
                        font-size: 0.95em;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    
                    .dog-item-health {
                        font-size: 0.85em;
                        margin-top: 8px;
                    }
                    
                    .health-badge {
                        font-size: 0.8em;
                        padding: 4px 8px;
                        margin-right: 5px;
                        margin-bottom: 5px;
                    }
                    
                    /* Desktop layout voor opslaan knoppen */
                    .save-buttons-container {
                        flex-direction: row;
                        justify-content: flex-end;
                        gap: 10px;
                    }
                    
                    .save-buttons-container .btn {
                        width: auto;
                    }
                }
                
                /* Algemene styling voor containers */
                .form-container {
                    transition: all 0.3s ease;
                }
                
                .form-container:hover {
                    border-color: #b3d7ff;
                    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
                }
                
                .container-title {
                    display: flex;
                    align-items: center;
                }
                
                .container-title i {
                    margin-right: 8px;
                    font-size: 1.2em;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                /* Breed container voor onder het invulveld */
                .breed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .breed-input-container {
                    width: 100%;
                }
                
                .recent-breeds-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .recent-breeds-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    white-space: nowrap;
                    margin-bottom: 0;
                }
                
                .recent-breeds-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                
                .recent-breed-btn {
                    white-space: nowrap;
                    font-size: 0.8em;
                    padding: 4px 8px;
                }
                
                /* Vachtkleur container voor onder het invulveld (zelfde stijl als ras) */
                .coat-color-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .coat-color-input-container {
                    width: 100%;
                }
                
                .standard-coat-colors-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .standard-coat-colors-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    white-space: nowrap;
                    margin-bottom: 0;
                }
                
                .standard-coat-colors-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                
                .standard-coat-color-btn {
                    white-space: nowrap;
                    font-size: 0.7em;
                    padding: 4px 8px;
                }
                
                /* Opslaan knoppen container */
                .save-buttons-container {
                    display: flex;
                    margin-top: 20px;
                }
                
                /* Datum input styling */
                .date-input-wrapper {
                    position: relative;
                }
                
                .date-input-wrapper .form-control {
                    padding-right: 12px;
                }
                
                /* Verberg kalender picker voor alle apparaten */
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-clear-button {
                    display: none;
                    -webkit-appearance: none;
                    appearance: none;
                }
                
                input[type="date"] {
                    -webkit-appearance: textfield;
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
                
                /* Placeholder styling voor datum velden */
                input[type="date"]::placeholder {
                    color: #6c757d;
                    opacity: 0.7;
                }
                
                /* Added dogs container */
                #added-dogs-container {
                    background-color: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                
                .added-dogs-title {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 10px;
                    font-size: 1em;
                }
                
                .dog-item {
                    border-bottom: 1px solid #e9ecef;
                    padding: 12px 0;
                }
                
                .dog-item:last-child {
                    border-bottom: none;
                }
                
                .dog-item-header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                }
                
                .dog-item-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .dog-item-pedigree {
                    color: #7f8c8d;
                    font-size: 0.9em;
                    background-color: #ecf0f1;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                
                .dog-item-health {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                
                .health-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 500;
                }
                
                .health-badge.hd { background-color: #e8f4fd; color: #2980b9; border: 1px solid #3498db; }
                .health-badge.ed { background-color: #e8f8f5; color: #27ae60; border: 1px solid #2ecc71; }
                .health-badge.pl { background-color: #fff3e0; color: #f39c12; border: 1px solid #f39c12; }
                .health-badge.eyes { background-color: #f4ecf7; color: #8e44ad; border: 1px solid #9b59b6; }
                .health-badge.dandy { background-color: #fef9e7; color: #d68910; border: 1px solid #f1c40f; }
                .health-badge.luw { background-color: #e8f0fe; color: #1e3a8a; border: 1px solid #3b82f6; }
                .health-badge.thyroid { background-color: #fbeee6; color: #e74c3c; border: 1px solid #e74c3c; }
                .health-badge.coat { background-color: #e8f6f3; color: #16a085; border: 1px solid #1abc9c; }
                .health-badge.gender { background-color: #f4ecf7; color: #8e44ad; border: 1px solid #9b59b6; }
                
                .health-badge-label {
                    font-weight: 600;
                    margin-right: 4px;
                }
                
                #no-dogs-message {
                    color: #6c757d;
                    font-style: italic;
                    text-align: center;
                    padding: 10px 0;
                }
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Bestand gekozen styling */
                .file-chosen-info {
                    color: #28a745;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent validation styling */
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }
                
                /* Tom Select styling */
                .ts-control {
                    border-radius: 8px;
                    border: 2px solid #dee2e6;
                    padding: 8px 12px;
                }
                
                .ts-control:focus-within {
                    border-color: #6f42c1;
                    box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
                }
                
                .ts-dropdown {
                    border-radius: 8px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                }
                
                .ts-dropdown .option {
                    padding: 10px 12px;
                }
                
                .ts-dropdown .option.active {
                    background-color: #f0e6ff;
                }

                /* Kennelnaam autocomplete styling */
                .kennel-autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 10000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .kennel-autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .kennel-autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .kennel-input-wrapper {
                    position: relative;
                }
            </style>
        `;
    }
    
    /**
     * Haal alleen het formulier HTML op (zonder modal wrapper)
     * Dit wordt gebruikt door DogManager in het keuzescherm
     */
    getFormHTML(litterData = null) {
        console.log('LitterManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        const data = litterData || {};
        
        // Formatteer datums voor weergave (YYYY-MM-DD naar DD-MM-YYYY)
        const formatDateForDisplay = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // YYYY-MM-DD voor date input
            } catch (e) {
                return dateString;
            }
        };
        
        const birthDateValue = formatDateForDisplay(data.geboortedatum);
        const deathDateValue = formatDateForDisplay(data.overlijdensdatum);
        
        // Genereer recente rassen knoppen (onder het invulveld)
        let recentBreedsHTML = '';
        if (this.lastBreeds && this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="recent-breeds-container">
                    <div class="recent-breeds-label">${t('recent')}</div>
                    <div class="recent-breeds-buttons">
            `;
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `
                    </div>
                </div>
            `;
        }
        
        // Genereer standaard vachtkleur knoppen voor huidige taal
        let standardCoatColorsHTML = '';
        const currentColors = this.standardCoatColors[this.currentLang] || this.standardCoatColors.nl;
        
        if (currentColors && currentColors.length > 0) {
            standardCoatColorsHTML = `
                <div class="standard-coat-colors-container">
                    <div class="standard-coat-colors-label">${t('standardCoatColors')}</div>
                    <div class="standard-coat-colors-buttons">
            `;
            currentColors.forEach(color => {
                standardCoatColorsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-info standard-coat-color-btn" data-coat-color="${color}">
                        ${color}
                    </button>
                `;
            });
            standardCoatColorsHTML += `
                    </div>
                </div>
            `;
        }
        
        return `
            <form id="litterForm">
                <!-- BELANGRIJK: Gebruik EXACT dezelfde veldnamen als DogManager -->
                <input type="hidden" id="vader_id" value="${data.vader_id || ''}">
                <input type="hidden" id="moeder_id" value="${data.moeder_id || ''}">
                
                <!-- CONTAINER 0: TOEGEVOEGDE HONDEN -->
                <div class="form-container" id="added-dogs-container">
                    <div class="container-title">
                        <i class="bi bi-list-check"></i> ${t('addedDogs')}
                    </div>
                    <div id="added-dogs-list">
                        <div id="no-dogs-message">${t('noDogsAdded')}</div>
                    </div>
                </div>
                
                <!-- CONTAINER 1: OUDERDETAILS -->
                <div class="form-container" id="ouders-container">
                    <div class="container-title">
                        <i class="bi bi-people"></i> ${t('parentDetails')}
                    </div>
                    
                    <!-- RIJ 1: Vader en Moeder (NU VERPLICHT) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="father" class="form-label">${t('father')}</label>
                                <select id="fatherSelect" class="form-control tomselect-parent" placeholder="${t('typeToSearch')}">
                                    <option value="">${t('typeToSearch')}</option>
                                </select>
                                <div id="fatherError" class="error-message" style="display: none;"></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="mother" class="form-label">
                                    ${t('mother')}
                                    <i class="bi bi-info-circle text-primary ms-1" 
                                       style="cursor: pointer; font-size: 0.9rem;" 
                                       data-bs-toggle="tooltip" 
                                       data-bs-placement="top" 
                                       title="${t('motherTooltip')}">
                                    </i>
                                </label>
                                <select id="motherSelect" class="form-control tomselect-parent" placeholder="${t('typeToSearch')}">
                                    <option value="">${t('typeToSearch')}</option>
                                </select>
                                <div id="motherError" class="error-message" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIJ 2: Kennelnaam en Ras -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 kennel-input-wrapper">
                                <label for="kennelName" class="form-label">${t('kennelName')}</label>
                                <input type="text" class="form-control" id="kennelName" value="${data.kennelnaam || ''}" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="mb-3">
                                <label for="breed" class="form-label">${t('breedRequired')}</label>
                                <div class="breed-container">
                                    <div class="breed-input-container">
                                        <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                                    </div>
                                    ${recentBreedsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIJ 3: Geboortedatum -->
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3 date-input-wrapper">
                                <label for="birthDate" class="form-label">${t('birthDate')}</label>
                                <input type="date" class="form-control" id="birthDate" 
                                       value="${birthDateValue}"
                                       placeholder="DD-MM-JJJJ"
                                       data-original-value="${birthDateValue}">
                                <div id="birthDateError" class="error-message" style="display: none;"></div>
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTAINER 2: NESTDETAILS -->
                <div class="form-container" id="nest-container">
                    <div class="container-title">
                        <i class="bi bi-house"></i> ${t('litterDetails')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="name" class="form-label">${t('nameRequired')}</label>
                                <input type="text" class="form-control" id="name" value="${data.naam || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                                <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="gender" class="form-label">${t('gender')} *</label>
                                <select class="form-select" id="gender">
                                    <option value="">${t('chooseGender')}</option>
                                    <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>${t('male')}</option>
                                    <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>${t('female')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Vachtkleur veld met standaard vachtkleuren -->
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="mb-3">
                                <label for="coatColor" class="form-label">${t('coatColor')}</label>
                                <div class="coat-color-container">
                                    <div class="coat-color-input-container">
                                        <input type="text" class="form-control" id="coatColor" value="${data.vachtkleur || ''}" readonly>
                                    </div>
                                    ${standardCoatColorsHTML}
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <!-- Tweede opslaan knop naast vachtkleur op desktop, onder op mobiel -->
                            <div class="mb-3 d-none d-md-block">
                                <label class="form-label d-block" style="visibility: hidden;">${t('saveDog')}</label>
                                <button type="button" class="btn btn-primary w-100" id="saveDogBtn2">
                                    ${t('saveDog')}
                                </button>
                            </div>
                            <div class="mb-3 d-md-none">
                                <button type="button" class="btn btn-primary w-100" id="saveDogBtn2Mobile">
                                    ${t('saveDog')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTAINER 3: OVERIGE DETAILS -->
                <div class="form-container" id="details-container">
                    <div class="container-title">
                        <i class="bi bi-card-checklist"></i> ${t('otherDetails')}
                    </div>
                    
                    <!-- Land en Postcode (NU als eerste bovenaan) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="country" class="form-label">${t('country')}</label>
                                <input type="text" class="form-control" id="country" value="${data.land || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="zipCode" class="form-label">${t('zipCode')}</label>
                                <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gezondheid: Heupdysplasie, Elleboogdysplasie, Patella Luxatie -->
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="hipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                                <select class="form-select" id="hipDysplasia">
                                    <option value="">${t('hipGrades')}</option>
                                    <option value="A" ${data.heupdysplasie === 'A' ? 'selected' : ''}>${t('hipA')}</option>
                                    <option value="B" ${data.heupdysplasie === 'B' ? 'selected' : ''}>${t('hipB')}</option>
                                    <option value="C" ${data.heupdysplasie === 'C' ? 'selected' : ''}>${t('hipC')}</option>
                                    <option value="D" ${data.heupdysplasie === 'D' ? 'selected' : ''}>${t('hipD')}</option>
                                    <option value="E" ${data.heupdysplasie === 'E' ? 'selected' : ''}>${t('hipE')}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="elbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                                <select class="form-select" id="elbowDysplasia">
                                    <option value="">${t('elbowGrades')}</option>
                                    <option value="0" ${data.elleboogdysplasie === '0' ? 'selected' : ''}>${t('elbow0')}</option>
                                    <option value="1" ${data.elleboogdysplasie === '1' ? 'selected' : ''}>${t('elbow1')}</option>
                                    <option value="2" ${data.elleboogdysplasie === '2' ? 'selected' : ''}>${t('elbow2')}</option>
                                    <option value="3" ${data.elleboogdysplasie === '3' ? 'selected' : ''}>${t('elbow3')}</option>
                                    <option value="NB" ${data.elleboogdysplasie === 'NB' ? 'selected' : ''}>${t('elbowNB')}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="patellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                                <select class="form-select" id="patellaLuxation">
                                    <option value="">${t('patellaGrades')}</option>
                                    <option value="0" ${data.patella === '0' ? 'selected' : ''}>${t('patella0')}</option>
                                    <option value="1" ${data.patella === '1' ? 'selected' : ''}>${t('patella1')}</option>
                                    <option value="2" ${data.patella === '2' ? 'selected' : ''}>${t('patella2')}</option>
                                    <option value="3" ${data.patella === '3' ? 'selected' : ''}>${t('patella3')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ogen en Dandy Walker + LUW (NIEUW) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="eyes" class="form-label">${t('eyes')}</label>
                                <select class="form-select" id="eyes">
                                    <option value="">${t('choose')}</option>
                                    <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                    <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                    <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                                </select>
                            </div>
                            <!-- Eyes explanation container altijd zichtbaar -->
                            <div class="mb-3" id="eyesExplanationContainer" style="display: block;">
                                <label for="eyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                                <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenverklaring || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="dandyWalker" class="form-label">${t('dandyWalker')}</label>
                                <select class="form-select" id="dandyWalker">
                                    <option value="">${t('dandyOptions')}</option>
                                    <option value="Vrij op DNA" ${data.dandyWalker === 'Vrij op DNA' ? 'selected' : ''}>${t('dandyFreeDNA')}</option>
                                    <option value="Vrij op ouders" ${data.dandyWalker === 'Vrij op ouders' ? 'selected' : ''}>${t('dandyFreeParents')}</option>
                                    <option value="Drager" ${data.dandyWalker === 'Drager' ? 'selected' : ''}>${t('dandyCarrier')}</option>
                                    <option value="Lijder" ${data.dandyWalker === 'Lijder' ? 'selected' : ''}>${t('dandyAffected')}</option>
                                </select>
                            </div>
                            <!-- NIEUW: LUW Veld -->
                            <div class="mb-3">
                                <label for="luw" class="form-label">${t('luw')}</label>
                                <input type="text" class="form-control" id="luw" value="${data.LUW || ''}" placeholder="${t('luwPlaceholder')}" maxlength="20">
                                <div id="luwError" class="error-message" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Schildklier en Overlijdensdatum (naast elkaar op desktop) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="thyroid" class="form-label">${t('thyroid')}</label>
                                <select class="form-select" id="thyroid">
                                    <option value="">${t('choose')}</option>
                                    <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                    <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                                </select>
                            </div>
                            <!-- AANGEPAST: Toelichting vak altijd zichtbaar -->
                            <div class="mb-3" id="thyroidExplanationContainer">
                                <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                                <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierverklaring || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 date-input-wrapper">
                                <label for="deathDate" class="form-label">${t('deathDate')}</label>
                                <input type="date" class="form-control" id="deathDate" 
                                       value="${deathDateValue}"
                                       placeholder="DD-MM-JJJJ"
                                       data-original-value="${deathDateValue}">
                                <div id="deathDateError" class="error-message" style="display: none;"></div>
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Foto uploaden -->
                    <div class="mb-3">
                        <label for="photo" class="form-label">${t('addPhoto')}</label>
                        <div class="input-group">
                            <input type="file" class="form-control" id="photo" accept="image/*">
                            <label class="input-group-text" for="photo">${t('chooseFile')}</label>
                        </div>
                        <div id="fileInfo" class="form-text">${t('noFileChosen')}</div>
                    </div>
                    
                    <!-- Opmerkingen -->
                    <div class="mb-3">
                        <label for="remarks" class="form-label">${t('remarks')}</label>
                        <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                    </div>
                </div>
                
                <!-- Verplichte velden info -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <!-- Opslaan knop onderaan -->
                <div class="save-buttons-container">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Bestand gekozen styling */
                .file-chosen-info {
                    color: #28a745;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent validation styling */
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }

                /* Kennelnaam wrapper */
                .kennel-input-wrapper {
                    position: relative;
                }
            </style>
        `;
    }
    
    /**
     * Setup events voor wanneer de modal wordt getoond
     * Deze methode wordt aangeroepen door DogManager wanneer het nest formulier wordt geladen
     */
    setupEvents() {
        console.log('LitterManager: setupEvents aangeroepen');
        
        // Reset de lijst met ingevoerde honden wanneer modal wordt geopend
        this.currentLitterDogs = [];
        this.updateAddedDogsList();
        
        // Laad honden voor autocomplete
        this.loadAllDogs(false);
        
        // Laad kennelnamen voor autocomplete
        this.loadAllKennelNames();
        
        // Initialiseer Bootstrap tooltips
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Setup kennelnaam autocomplete
        this.setupKennelNameAutocomplete();
        
        // Setup file upload met compressie
        this.setupFileUploadWithCompression();
        
        // Event listeners voor alle drie opslaan knoppen
        const saveBtn = document.getElementById('saveDogBtn');
        const saveBtn2 = document.getElementById('saveDogBtn2');
        const saveBtn2Mobile = document.getElementById('saveDogBtn2Mobile');
        
        const saveHandler = () => {
            console.log('LitterManager: Save button geklikt');
            this.saveDog();
        };
        
        if (saveBtn) {
            console.log('LitterManager: Save button 1 gevonden');
            saveBtn.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 1 niet gevonden!');
        }
        
        if (saveBtn2) {
            console.log('LitterManager: Save button 2 (desktop) gevonden');
            saveBtn2.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 2 (desktop) niet gevonden!');
        }
        
        if (saveBtn2Mobile) {
            console.log('LitterManager: Save button 2 (mobile) gevonden');
            saveBtn2Mobile.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 2 (mobile) niet gevonden!');
        }
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                console.log('LitterManager: Eyes geselecteerd:', e.target.value);
            });
        } else {
            console.log('LitterManager: Eyes select niet gevonden');
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = 'block';
                }
            });
        } else {
            console.log('LitterManager: Thyroid select niet gevonden');
        }
        
        // LUW veld validatie (alleen cijfers)
        const luwInput = document.getElementById('luw');
        if (luwInput) {
            luwInput.addEventListener('input', (e) => {
                const luwError = document.getElementById('luwError');
                const value = e.target.value;
                const numericRegex = /^[0-9]*$/;
                
                if (value && !numericRegex.test(value)) {
                    if (luwError) {
                        luwError.textContent = this.t('luwInvalid');
                        luwError.style.display = 'block';
                    }
                    // Verwijder niet-numerieke karakters
                    e.target.value = value.replace(/[^0-9]/g, '');
                } else if (luwError) {
                    luwError.style.display = 'none';
                }
            });
        }
        
        // Recente rassen knoppen - Delegatie gebruiken
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                    console.log('LitterManager: Ras geselecteerd:', breed);
                }
            }
            
            // Standaard vachtkleur knoppen - Delegatie gebruiken
            if (e.target.classList.contains('standard-coat-color-btn')) {
                const coatColor = e.target.dataset.coatColor;
                const coatColorInput = document.getElementById('coatColor');
                if (coatColorInput) {
                    coatColorInput.value = coatColor;
                    console.log('LitterManager: Vachtkleur geselecteerd:', coatColor);
                }
            }
        });
        
        // Initialiseer TomSelects voor ouders
        this.initTomSelects();
        
        // Setup datum velden voor correcte verwerking
        this.setupDateFields();
        
        // Setup datum validatie
        this.setupDateValidation();
        
        console.log('LitterManager: Alle events ingesteld');
    }
    
    /**
     * Setup file upload met compressie
     * Deze methode vervangt de oude setupFileUploadFeedback
     */
    setupFileUploadWithCompression() {
        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.addEventListener('change', async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    
                    // Reset de gecomprimeerde bestanden
                    this.compressedPhotoFile = null;
                    this.compressedPhotoDataUrl = null;
                    
                    // Als het bestand al klein genoeg is (onder 0.95MB), sla compressie over
                    if (file.size <= this.imageCompressionConfig.maxSizeMB * 1024 * 1024) {
                        const fileInfo = document.getElementById('fileInfo');
                        if (fileInfo) {
                            fileInfo.innerHTML = `<span class="file-chosen-info"><i class="bi bi-check-circle text-success me-1"></i> ${this.t('chosenFile')} <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)</span>`;
                        }
                        this.compressedPhotoFile = file;
                        return;
                    }
                    
                    // Bestand is te groot, comprimeer het
                    try {
                        const compressedFile = await this.resizeAndCompressImage(file);
                        this.compressedPhotoFile = compressedFile;
                        
                        // Vervang het bestand in de file input met het gecomprimeerde bestand
                        // Dit kan niet direct, maar we slaan de gecomprimeerde versie op voor upload
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(compressedFile);
                        photoInput.files = dataTransfer.files;
                        
                    } catch (error) {
                        console.error('Compressie mislukt:', error);
                        const fileInfo = document.getElementById('fileInfo');
                        if (fileInfo) {
                            fileInfo.innerHTML = `<i class="bi bi-exclamation-triangle me-1 text-danger"></i> ${this.t('photoError')} ${error.message}`;
                        }
                        // Reset file input
                        photoInput.value = '';
                        this.compressedPhotoFile = null;
                    }
                } else {
                    const fileInfo = document.getElementById('fileInfo');
                    if (fileInfo) {
                        fileInfo.textContent = this.t('noFileChosen');
                    }
                    this.compressedPhotoFile = null;
                    this.compressedPhotoDataUrl = null;
                }
            });
        }
    }
    
    /**
     * Laad alle bestaande kennelnamen uit de database voor autocomplete
     * VERBETERD: Geen limiet, haalt alle kennelnamen op met paginatie
     */
    async loadAllKennelNames() {
        console.log('LitterManager: loadAllKennelNames aangeroepen');
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar voor loadAllKennelNames!');
            return;
        }
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('LitterManager: Geen Supabase client voor loadAllKennelNames');
                return;
            }
            
            // Haal ALLE kennelnamen op met paginatie
            let allKennelNamesRaw = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;
            
            while (hasMore) {
                const from = page * pageSize;
                const to = from + pageSize - 1;
                
                const { data, error, count } = await supabase
                    .from('honden')
                    .select('kennelnaam', { count: 'exact' })
                    .not('kennelnaam', 'is', null)
                    .not('kennelnaam', 'eq', '')
                    .range(from, to);
                
                if (error) {
                    console.error('LitterManager: Fout bij laden kennelnamen pagina', page, error);
                    break;
                }
                
                if (data && data.length > 0) {
                    allKennelNamesRaw = allKennelNamesRaw.concat(data);
                    console.log(`LitterManager: Pagina ${page + 1} geladen: ${data.length} kennelnamen`);
                }
                
                // Controleer of er meer pagina's zijn
                hasMore = data && data.length === pageSize;
                page++;
                
                // Veiligheidslimiet
                if (page > 100) {
                    console.warn('LitterManager: Veiligheidslimiet bereikt voor kennelnamen');
                    break;
                }
            }
            
            // Verzamel unieke kennelnamen (case-insensitive, maar behoud originele spelling)
            const kennelMap = new Map();
            allKennelNamesRaw.forEach(item => {
                if (item.kennelnaam && item.kennelnaam.trim()) {
                    const trimmed = item.kennelnaam.trim();
                    const lowerKey = trimmed.toLowerCase();
                    // Bewaar de eerste gevonden spelling
                    if (!kennelMap.has(lowerKey)) {
                        kennelMap.set(lowerKey, trimmed);
                    }
                }
            });
            
            // Converteer naar array en sorteer alphabetisch
            this.allKennelNames = Array.from(kennelMap.values()).sort((a, b) => 
                a.toLowerCase().localeCompare(b.toLowerCase())
            );
            
            console.log(`LitterManager: ${this.allKennelNames.length} unieke kennelnamen geladen voor autocomplete`);
            if (this.allKennelNames.length > 0) {
                console.log(`LitterManager: Eerste 5 kennelnamen: ${this.allKennelNames.slice(0, 5).join(', ')}`);
            }
            
        } catch (error) {
            console.error('LitterManager: Fout bij laden kennelnamen:', error);
            this.allKennelNames = [];
        }
    }
    
    /**
     * Setup autocomplete voor kennelnaam veld
     * VERBETERD: Betere matching, meer suggesties, highlighting
     */
    setupKennelNameAutocomplete() {
        const kennelNameInput = document.getElementById('kennelName');
        if (!kennelNameInput) {
            console.log('LitterManager: KennelName input niet gevonden');
            return;
        }
        
        // Verwijder bestaande event listeners om duplicates te voorkomen
        kennelNameInput.removeEventListener('input', this.kennelInputHandler);
        kennelNameInput.removeEventListener('blur', this.kennelBlurHandler);
        
        // Maak een container voor de dropdown
        let dropdownContainer = document.getElementById('kennelAutocompleteDropdown');
        if (!dropdownContainer) {
            dropdownContainer = document.createElement('div');
            dropdownContainer.id = 'kennelAutocompleteDropdown';
            dropdownContainer.className = 'kennel-autocomplete-dropdown';
            dropdownContainer.style.display = 'none';
            dropdownContainer.style.maxHeight = '300px';
            dropdownContainer.style.overflowY = 'auto';
            kennelNameInput.parentNode.appendChild(dropdownContainer);
        }
        
        // Input handler voor suggesties
        this.kennelInputHandler = (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                dropdownContainer.style.display = 'none';
                dropdownContainer.innerHTML = '';
                return;
            }
            
            const lowerQuery = query.toLowerCase();
            
            // Eerst kennelnamen die beginnen met de query, dan die het bevatten
            const startsWith = [];
            const contains = [];
            
            for (const name of this.allKennelNames) {
                const lowerName = name.toLowerCase();
                if (lowerName.startsWith(lowerQuery)) {
                    startsWith.push(name);
                } else if (lowerName.includes(lowerQuery)) {
                    contains.push(name);
                }
            }
            
            // Combineer: eerst beginselen, dan bevatten (max 50 om performance te houden)
            const matches = [...startsWith, ...contains].slice(0, 50);
            
            if (matches.length === 0) {
                dropdownContainer.style.display = 'none';
                dropdownContainer.innerHTML = '';
                return;
            }
            
            // Bouw dropdown HTML met highlighting
            let dropdownHTML = '';
            matches.forEach(name => {
                const lowerName = name.toLowerCase();
                const index = lowerName.indexOf(lowerQuery);
                
                let highlightedName;
                if (index !== -1) {
                    const before = name.substring(0, index);
                    const match = name.substring(index, index + query.length);
                    const after = name.substring(index + query.length);
                    highlightedName = `${this.escapeHtml(before)}<strong>${this.escapeHtml(match)}</strong>${this.escapeHtml(after)}`;
                } else {
                    highlightedName = this.escapeHtml(name);
                }
                
                dropdownHTML += `
                    <div class="kennel-autocomplete-item" data-kennel-name="${this.escapeHtml(name)}">
                        <i class="bi bi-building me-2"></i>${highlightedName}
                    </div>
                `;
            });
            
            dropdownContainer.innerHTML = dropdownHTML;
            dropdownContainer.style.display = 'block';
            
            // Voeg click handlers toe aan de items
            const items = dropdownContainer.querySelectorAll('.kennel-autocomplete-item');
            items.forEach(item => {
                item.removeEventListener('click', this.kennelItemClickHandler);
                this.kennelItemClickHandler = () => {
                    const selectedName = item.dataset.kennelName;
                    kennelNameInput.value = selectedName;
                    dropdownContainer.style.display = 'none';
                    // Trigger change event voor eventuele validatie
                    kennelNameInput.dispatchEvent(new Event('change'));
                };
                item.addEventListener('click', this.kennelItemClickHandler);
            });
        };
        
        // Blur handler om dropdown te verbergen (met kleine vertraging zodat klik nog geregistreerd wordt)
        this.kennelBlurHandler = () => {
            setTimeout(() => {
                dropdownContainer.style.display = 'none';
            }, 200);
        };
        
        kennelNameInput.addEventListener('input', this.kennelInputHandler);
        kennelNameInput.addEventListener('blur', this.kennelBlurHandler);
        
        // Voeg event toe om dropdown te verbergen wanneer er buiten geklikt wordt
        document.addEventListener('click', (e) => {
            if (!kennelNameInput.contains(e.target) && !dropdownContainer.contains(e.target)) {
                dropdownContainer.style.display = 'none';
            }
        });
        
        console.log('LitterManager: Kennelnaam autocomplete setup voltooid');
    }
    
    // ========== TOM SELECT VOOR OUDERS - EXACT ZOALS IN DogManager ==========
    
    async loadTomSelect() {
        return new Promise((resolve, reject) => {
            if (typeof window.TomSelect !== 'undefined') {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/css/tom-select.bootstrap5.min.css';
            document.head.appendChild(link);
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/js/tom-select.complete.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async initTomSelects() {
        if (typeof window.TomSelect === 'undefined') {
            await this.loadTomSelect();
        }
        
        await this.initFatherTomSelect();
        await this.initMotherTomSelect();
    }
    
    async initFatherTomSelect() {
        const selectElement = document.getElementById('fatherSelect');
        if (!selectElement) return;
        
        if (this.fatherTomSelect) {
            this.fatherTomSelect.destroy();
        }
        
        // Maak een hidden input voor de vader naam
        let fatherNameInput = document.getElementById('father');
        if (!fatherNameInput) {
            fatherNameInput = document.createElement('input');
            fatherNameInput.type = 'hidden';
            fatherNameInput.id = 'father';
            fatherNameInput.name = 'father';
            selectElement.parentElement.appendChild(fatherNameInput);
        }
        
        this.fatherTomSelect = new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'displayName',
            searchField: ['naam', 'kennelnaam', 'stamboomnr'],
            create: false,
            maxOptions: 100,
            maxItems: 1,
            placeholder: this.t('typeToSearch'),
            loadThrottle: 300,
            preload: false,
            load: (query, callback) => {
                if (query.length < 2) {
                    callback([]);
                    return;
                }
                
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.searchTimeout = setTimeout(async () => {
                    console.log('🔍 Zoeken naar reu:', query);
                    const result = await this.getDogsByGender('reuen', query, 1, 100);
                    
                    result.data.forEach(hond => {
                        if (!this.allDogs.find(d => d.id === hond.id)) {
                            this.allDogs.push(hond);
                        }
                    });
                    
                    const items = result.data.map(hond => ({
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`,
                        displayWithPedigree: `
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${this.escapeHtml(hond.naam || 'Onbekend')}${hond.kennelnaam ? ' (' + this.escapeHtml(hond.kennelnaam) + ')' : ''}</span>
                                <small class="text-muted">Stamboeknr: ${this.escapeHtml(hond.stamboomnr || '-')}</small>
                            </div>
                        `
                    }));
                    
                    callback(items);
                }, 300);
            },
            render: {
                option: function(item, escape) {
                    return `<div>${item.displayWithPedigree}</div>`;
                },
                item: function(item, escape) {
                    return `<div>${item.naam}${item.kennelnaam ? ' (' + item.kennelnaam + ')' : ''} - ${item.stamboomnr}</div>`;
                }
            },
            onChange: (value) => {
                const fatherNameInput = document.getElementById('father');
                if (value) {
                    const hond = this.allDogs.find(d => d.id === parseInt(value));
                    if (hond) {
                        document.getElementById('vader_id').value = hond.id;
                        if (fatherNameInput) {
                            fatherNameInput.value = hond.naam + (hond.kennelnaam ? ' ' + hond.kennelnaam : '');
                            fatherNameInput.setAttribute('data-pedigree', hond.stamboomnr || '');
                        }
                        const errorElement = document.getElementById('fatherError');
                        if (errorElement) errorElement.style.display = 'none';
                        console.log(`[LitterManager] Vader geselecteerd: ID=${hond.id}, Naam=${hond.naam}`);
                    }
                } else {
                    document.getElementById('vader_id').value = '';
                    if (fatherNameInput) {
                        fatherNameInput.value = '';
                        fatherNameInput.setAttribute('data-pedigree', '');
                    }
                }
                this.validateParents();
            }
        });
    }
    
    async initMotherTomSelect() {
        const selectElement = document.getElementById('motherSelect');
        if (!selectElement) return;
        
        if (this.motherTomSelect) {
            this.motherTomSelect.destroy();
        }
        
        // Maak een hidden input voor de moeder naam
        let motherNameInput = document.getElementById('mother');
        if (!motherNameInput) {
            motherNameInput = document.createElement('input');
            motherNameInput.type = 'hidden';
            motherNameInput.id = 'mother';
            motherNameInput.name = 'mother';
            selectElement.parentElement.appendChild(motherNameInput);
        }
        
        this.motherTomSelect = new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'displayName',
            searchField: ['naam', 'kennelnaam', 'stamboomnr'],
            create: false,
            maxOptions: 100,
            maxItems: 1,
            placeholder: this.t('typeToSearch'),
            loadThrottle: 300,
            preload: false,
            load: (query, callback) => {
                if (query.length < 2) {
                    callback([]);
                    return;
                }
                
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.searchTimeout = setTimeout(async () => {
                    console.log('🔍 Zoeken naar teef:', query);
                    
                    // Check of gebruiker admin is
                    let result;
                    if (this.currentUserRole === 'admin') {
                        result = await this.getDogsByGender('teven', query, 1, 100);
                    } else {
                        // Voor niet-admin: alleen teven van de ingelogde gebruiker
                        result = await this.getDogsByGenderAndOwner('teven', query, this.currentUserId, 1, 100);
                    }
                    
                    result.data.forEach(hond => {
                        if (!this.allDogs.find(d => d.id === hond.id)) {
                            this.allDogs.push(hond);
                        }
                    });
                    
                    const items = result.data.map(hond => ({
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`,
                        displayWithPedigree: `
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${this.escapeHtml(hond.naam || 'Onbekend')}${hond.kennelnaam ? ' (' + this.escapeHtml(hond.kennelnaam) + ')' : ''}</span>
                                <small class="text-muted">Stamboeknr: ${this.escapeHtml(hond.stamboomnr || '-')}</small>
                            </div>
                        `
                    }));
                    
                    callback(items);
                }, 300);
            },
            render: {
                option: function(item, escape) {
                    return `<div>${item.displayWithPedigree}</div>`;
                },
                item: function(item, escape) {
                    return `<div>${item.naam}${item.kennelnaam ? ' (' + item.kennelnaam + ')' : ''} - ${item.stamboomnr}</div>`;
                }
            },
            onChange: (value) => {
                const motherNameInput = document.getElementById('mother');
                if (value) {
                    const hond = this.allDogs.find(d => d.id === parseInt(value));
                    if (hond) {
                        document.getElementById('moeder_id').value = hond.id;
                        if (motherNameInput) {
                            motherNameInput.value = hond.naam + (hond.kennelnaam ? ' ' + hond.kennelnaam : '');
                            motherNameInput.setAttribute('data-pedigree', hond.stamboomnr || '');
                        }
                        const errorElement = document.getElementById('motherError');
                        if (errorElement) errorElement.style.display = 'none';
                        console.log(`[LitterManager] Moeder geselecteerd: ID=${hond.id}, Naam=${hond.naam}`);
                    }
                } else {
                    document.getElementById('moeder_id').value = '';
                    if (motherNameInput) {
                        motherNameInput.value = '';
                        motherNameInput.setAttribute('data-pedigree', '');
                    }
                }
                this.validateParents();
            }
        });
    }
    
    async getDogsByGender(gender, searchTerm = '', page = 1, pageSize = 100) {
        try {
            console.log(`🔍 ${gender} ophalen - Zoekterm: "${searchTerm}"`);
            
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return { data: [], total: 0 };
            }
            
            let query = supabase
                .from('honden')
                .select('*', { count: 'exact' })
                .eq('geslacht', gender);
            
            if (searchTerm && searchTerm.length >= 2) {
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            }
            
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            
            const { data, error, count } = await query
                .order('naam')
                .range(from, to);
            
            if (error) {
                console.error('❌ Database error:', error);
                return { data: [], total: 0 };
            }
            
            console.log(`✅ ${data?.length || 0} ${gender} gevonden (totaal: ${count || 0})`);
            return { 
                data: data || [], 
                total: count || 0 
            };
            
        } catch (error) {
            console.error(`❌ Fout bij ophalen ${gender}:`, error);
            return { data: [], total: 0 };
        }
    }
    
    async getDogsByGenderAndOwner(gender, searchTerm = '', ownerId, page = 1, pageSize = 100) {
        try {
            console.log(`🔍 ${gender} ophalen voor eigenaar ${ownerId} - Zoekterm: "${searchTerm}"`);
            
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return { data: [], total: 0 };
            }
            
            let query = supabase
                .from('honden')
                .select('*', { count: 'exact' })
                .eq('geslacht', gender)
                .eq('toegevoegd_door', ownerId);
            
            if (searchTerm && searchTerm.length >= 2) {
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            }
            
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            
            const { data, error, count } = await query
                .order('naam')
                .range(from, to);
            
            if (error) {
                console.error('❌ Database error:', error);
                return { data: [], total: 0 };
            }
            
            console.log(`✅ ${data?.length || 0} ${gender} gevonden voor eigenaar (totaal: ${count || 0})`);
            return { 
                data: data || [], 
                total: count || 0 
            };
            
        } catch (error) {
            console.error(`❌ Fout bij ophalen ${gender} voor eigenaar:`, error);
            return { data: [], total: 0 };
        }
    }
    
    getSupabase() {
        if (window.supabaseClient) {
            return window.supabaseClient;
        }
        if (window.supabase) {
            return window.supabase;
        }
        return null;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========== EINDE TOM SELECT ==========
    
    /**
     * Setup bestandsfeedback - toont gekozen bestandsnaam
     * Let op: Deze methode wordt vervangen door setupFileUploadWithCompression
     * maar blijft voor backward compatibility
     */
    setupFileUploadFeedback() {
        // Deze methode wordt vervangen door setupFileUploadWithCompression
        // Maar voor backward compatibility:
        if (!document.getElementById('photo')) return;
        
        const photoInput = document.getElementById('photo');
        const fileInfo = document.getElementById('fileInfo');
        
        if (photoInput && fileInfo && !photoInput.hasAttribute('data-compression-setup')) {
            photoInput.setAttribute('data-compression-setup', 'true');
            // De echte setup gebeurt in setupFileUploadWithCompression
        }
    }
    
    /**
     * Update de lijst met toegevoegde honden in de UI
     */
    updateAddedDogsList() {
        const addedDogsList = document.getElementById('added-dogs-list');
        const noDogsMessage = document.getElementById('no-dogs-message');
        
        if (!addedDogsList) return;
        
        if (this.currentLitterDogs.length === 0) {
            if (!noDogsMessage) {
                addedDogsList.innerHTML = `<div id="no-dogs-message">${this.t('noDogsAdded')}</div>`;
            }
            return;
        }
        
        // Verwijder het "geen honden" bericht als het er is
        if (noDogsMessage) {
            noDogsMessage.remove();
        }
        
        let html = '';
        this.currentLitterDogs.forEach((dog, index) => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                              dog.geslacht === 'teven' ? this.t('female') : '';
            
            // Genereer gezondheidsbadges
            const healthBadges = [];
            
            if (dog.heupdysplasie) {
                healthBadges.push(`<span class="health-badge hd"><span class="health-badge-label">${this.t('healthHD')}:</span>${dog.heupdysplasie}</span>`);
            }
            if (dog.elleboogdysplasie) {
                healthBadges.push(`<span class="health-badge ed"><span class="health-badge-label">${this.t('healthED')}:</span>${dog.elleboogdysplasie}</span>`);
            }
            if (dog.patella) {
                healthBadges.push(`<span class="health-badge pl"><span class="health-badge-label">${this.t('healthPL')}:</span>${dog.patella}</span>`);
            }
            if (dog.ogen) {
                healthBadges.push(`<span class="health-badge eyes"><span class="health-badge-label">${this.t('healthEyes')}:</span>${dog.ogen}</span>`);
            }
            if (dog.dandyWalker) {
                healthBadges.push(`<span class="health-badge dandy"><span class="health-badge-label">${this.t('healthDandy')}:</span>${dog.dandyWalker}</span>`);
            }
            if (dog.luw) {
                healthBadges.push(`<span class="health-badge luw"><span class="health-badge-label">${this.t('healthLUW')}:</span>${dog.luw}</span>`);
            }
            if (dog.schildklier) {
                healthBadges.push(`<span class="health-badge thyroid"><span class="health-badge-label">${this.t('healthThyroid')}:</span>${dog.schildklier}</span>`);
            }
            if (dog.vachtkleur) {
                healthBadges.push(`<span class="health-badge coat"><span class="health-badge-label">${this.t('healthCoat')}:</span>${dog.vachtkleur}</span>`);
            }
            if (genderText) {
                healthBadges.push(`<span class="health-badge gender"><span class="health-badge-label">${this.t('healthGender')}:</span>${genderText}</span>`);
            }
            
            html += `
                <div class="dog-item">
                    <div class="dog-item-header">
                        <span class="dog-item-name">${dog.naam}</span>
                        <span class="dog-item-pedigree">${dog.stamboomnr}</span>
                    </div>
                    ${healthBadges.length > 0 ? `
                        <div class="dog-item-health">
                            ${healthBadges.join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        addedDogsList.innerHTML = html;
    }
    
    /**
     * Setup datum velden voor correcte verwerking
     */
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        // Vereenvoudigde datum velden - gebruik gewoon date input
        if (birthDateInput) {
            // Reset type naar date voor correcte browser support
            birthDateInput.type = 'date';
            
            // Voor weergave: show placeholder when empty
            birthDateInput.addEventListener('focus', function() {
                if (!this.value) {
                    this.placeholder = 'dd-mm-jjjj';
                }
            });
            
            birthDateInput.addEventListener('blur', function() {
                this.placeholder = '';
            });
        }
        
        if (deathDateInput) {
            // Reset type naar date voor correcte browser support
            deathDateInput.type = 'date';
            
            deathDateInput.addEventListener('focus', function() {
                if (!this.value) {
                    this.placeholder = 'dd-mm-jjjj';
                }
            });
            
            deathDateInput.addEventListener('blur', function() {
                this.placeholder = '';
            });
        }
    }
    
    /**
     * Setup datum validatie
     */
    setupDateValidation() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        if (birthDateInput) {
            birthDateInput.addEventListener('blur', () => {
                this.validateDates();
            });
        }
        
        if (deathDateInput) {
            deathDateInput.addEventListener('blur', () => {
                this.validateDates();
            });
        }
    }
    
    /**
     * Valideer datums
     */
    validateDates() {
        const t = this.t.bind(this);
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        const birthDateError = document.getElementById('birthDateError');
        const deathDateError = document.getElementById('deathDateError');
        
        if (!birthDateInput || !deathDateInput) return;
        
        let isValid = true;
        
        // Reset error styling
        birthDateInput.classList.remove('date-error');
        deathDateInput.classList.remove('date-error');
        if (birthDateError) birthDateError.style.display = 'none';
        if (deathDateError) deathDateError.style.display = 'none';
        
        const birthValue = birthDateInput.value;
        const deathValue = deathDateInput.value;
        
        // Valideer geboortedatum formaat (alleen als ingevuld)
        if (birthValue) {
            const birthDate = new Date(birthValue);
            if (isNaN(birthDate.getTime())) {
                birthDateInput.classList.add('date-error');
                if (birthDateError) {
                    birthDateError.textContent = t('dateFormatError');
                    birthDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        // Valideer overlijdensdatum formaat (alleen als ingevuld)
        if (deathValue) {
            const deathDate = new Date(deathValue);
            if (isNaN(deathDate.getTime())) {
                deathDateInput.classList.add('date-error');
                if (deathDateError) {
                    deathDateError.textContent = t('dateFormatError');
                    deathDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        // Valideer dat overlijdensdatum niet voor geboortedatum is (alleen als beide ingevuld zijn)
        if (birthValue && deathValue) {
            const birthDate = new Date(birthValue);
            const deathDate = new Date(deathValue);
            
            if (!isNaN(birthDate.getTime()) && !isNaN(deathDate.getTime()) && deathDate < birthDate) {
                deathDateInput.classList.add('date-error');
                if (deathDateError) {
                    deathDateError.textContent = t('deathBeforeBirthError');
                    deathDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Controleer of ouders geldig zijn geselecteerd
     */
    validateParents() {
        const t = this.t.bind(this);
        const fatherSelect = this.fatherTomSelect;
        const motherSelect = this.motherTomSelect;
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        
        let isValid = true;
        
        // Reset error styling
        if (fatherError) fatherError.style.display = 'none';
        if (motherError) motherError.style.display = 'none';
        
        // Check vader
        const fatherValue = fatherSelect ? fatherSelect.getValue() : null;
        if (!fatherValue || fatherValue === '') {
            if (fatherError) {
                fatherError.textContent = t('parentNotSelected');
                fatherError.style.display = 'block';
            }
            isValid = false;
        }
        
        // Check moeder
        const motherValue = motherSelect ? motherSelect.getValue() : null;
        if (!motherValue || motherValue === '') {
            if (motherError) {
                motherError.textContent = t('parentNotSelected');
                motherError.style.display = 'block';
            }
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Reset alleen de nestdetails velden (niet de ouderdetails)
     */
    resetLitterDetails() {
        // Reset naam, stamboomnummer en geslacht
        const nameInput = document.getElementById('name');
        const pedigreeInput = document.getElementById('pedigreeNumber');
        const genderSelect = document.getElementById('gender');
        const coatColorInput = document.getElementById('coatColor'); // Vachtkleur
        
        if (nameInput) nameInput.value = '';
        if (pedigreeInput) pedigreeInput.value = '';
        if (genderSelect) genderSelect.value = '';
        if (coatColorInput) coatColorInput.value = ''; // Reset vachtkleur
        
        // Reset land/postcode (nu bovenaan)
        const countryInput = document.getElementById('country');
        const zipCodeInput = document.getElementById('zipCode');
        if (countryInput) countryInput.value = '';
        if (zipCodeInput) zipCodeInput.value = '';
        
        // Reset gezondheid velden
        const healthFields = [
            'hipDysplasia',
            'elbowDysplasia',
            'patellaLuxation',
            'eyes',
            'dandyWalker',
            'luw',
            'thyroid'
        ];
        
        healthFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        // Reset uitleg velden
        const eyesExplanation = document.getElementById('eyesExplanation');
        const thyroidExplanation = document.getElementById('thyroidExplanation');
        
        if (eyesExplanation) eyesExplanation.value = '';
        if (thyroidExplanation) thyroidExplanation.value = '';
        
        // Reset overlijdensdatum
        const deathDateInput = document.getElementById('deathDate');
        if (deathDateInput) {
            deathDateInput.value = '';
            deathDateInput.type = 'date';
        }
        
        // Reset foto en file info
        const photoInput = document.getElementById('photo');
        const fileInfo = document.getElementById('fileInfo');
        if (photoInput) {
            photoInput.value = '';
            this.compressedPhotoFile = null;
            this.compressedPhotoDataUrl = null;
        }
        if (fileInfo) fileInfo.textContent = this.t('noFileChosen');
        
        // Reset opmerkingen
        const remarksTextarea = document.getElementById('remarks');
        if (remarksTextarea) remarksTextarea.value = '';
        
        // Reset LUW error message
        const luwError = document.getElementById('luwError');
        if (luwError) luwError.style.display = 'none';
        
        // Kennelnaam wordt niet gereset omdat deze in de ouderdetails zit en blijft staan
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        
        // Initialiseer this.lastBreeds als het niet bestaat
        if (!this.lastBreeds) {
            this.lastBreeds = [];
        }
        
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
        console.log('LitterManager: Ras toegevoegd aan recente rassen:', breedStr);
    }
    
    async loadAllDogs(forceReload = false) {
        console.log('LitterManager: loadAllDogs aangeroepen');
        
        // Als we al honden hebben en niet force reloaden, gebruik dan de cache
        if (!forceReload && this.allDogs && this.allDogs.length > 0) {
            console.log('LitterManager: Gebruik gecachede honden:', this.allDogs.length);
            return;
        }
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar voor loadAllDogs!');
            return;
        }
        
        try {
            console.log('LitterManager: Laden van alle honden met paginatie...');
            
            // Reset array
            this.allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000; // Maximaal wat Supabase toestaat
            let hasMorePages = true;
            
            // Loop door alle pagina's
            while (hasMorePages) {
                console.log(`LitterManager: Laden pagina ${currentPage}...`);
                
                // Gebruik de getHonden() methode van de database service met paginatie
                // NIEUW: Voeg profiles toe om eigenaarsinformatie op te halen
                const result = await this.db.getHonden(currentPage, pageSize, {
                    select: '*, profiles!honden_toegevoegd_door_fkey (email, user_id, role)'
                });
                
                if (result.honden && result.honden.length > 0) {
                    // Voeg honden toe aan array
                    this.allDogs = this.allDogs.concat(result.honden);
                    
                    console.log(`LitterManager: Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                    
                    // Controleer of er nog meer pagina's zijn
                    hasMorePages = result.heeftVolgende;
                    currentPage++;
                    
                    // Veiligheidslimiet voor oneindige lus
                    if (currentPage > 100) {
                        console.warn('Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                        break;
                    }
                } else {
                    hasMorePages = false;
                }
                
                // Kleine pauze om de server niet te overbelasten
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`LitterManager: TOTAAL ${this.allDogs.length} honden geladen voor autocomplete`);
            
        } catch (error) {
            console.error('LitterManager: Fout bij laden honden voor autocomplete:', error);
            this.allDogs = []; // Reset op error
        }
    }
    
    async saveDog() {
        console.log('=== LitterManager: START saveDog ===');
        
        if (!this.auth) {
            console.error('LitterManager: Auth niet beschikbaar!');
            this.showError('Authenticatie niet beschikbaar');
            return;
        }
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar!');
            this.showError('Database niet beschikbaar');
            return;
        }
        
        // Valideer datums eerst
        if (!this.validateDates()) {
            this.showError(this.t('dateFormatError'));
            return;
        }
        
        // Valideer ouders
        if (!this.validateParents()) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        // Haal datum waarden op
        const birthDateValue = document.getElementById('birthDate').value;
        const deathDateValue = document.getElementById('deathDate').value;
        
        // Formatteer datums voor opslag (YYYY-MM-DD formaat)
        const formatDateForStorage = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // YYYY-MM-DD formaat
            } catch (e) {
                return '';
            }
        };
        
        // Haal de vader en moeder ID's op uit de hidden inputs
        const vaderIdValue = document.getElementById('vader_id')?.value;
        const moederIdValue = document.getElementById('moeder_id')?.value;
        
        // Haal de vader en moeder namen op uit de hidden inputs
        const fatherNameInput = document.getElementById('father');
        const motherNameInput = document.getElementById('mother');
        const vaderNaam = fatherNameInput ? fatherNameInput.value : '';
        const moederNaam = motherNameInput ? motherNameInput.value : '';
        
        // Haal stamboomnummers van ouders op
        const vaderStamboomnr = fatherNameInput ? fatherNameInput.getAttribute('data-pedigree') || '' : '';
        const moederStamboomnr = motherNameInput ? motherNameInput.getAttribute('data-pedigree') || '' : '';
        
        // Haal LUW waarde op en valideer (zekerheidshalve nog een keer)
        let luwValue = document.getElementById('luw')?.value.trim() || '';
        if (luwValue && !/^[0-9]+$/.test(luwValue)) {
            this.showError(this.t('luwInvalid'));
            return;
        }
        
        console.log('LitterManager: vader_id:', vaderIdValue);
        console.log('LitterManager: moeder_id:', moederIdValue);
        console.log('LitterManager: vader_naam:', vaderNaam);
        console.log('LitterManager: moeder_naam:', moederNaam);
        console.log('LitterManager: vader_stamboomnr:', vaderStamboomnr);
        console.log('LitterManager: moeder_stamboomnr:', moederStamboomnr);
        
        // VERZAMEL FORMULIER DATA MET EXACT DEZELFDE VELDNAMEN ALS DogManager
        const dogData = {
            // BASISINFORMATIE
            naam: document.getElementById('name')?.value.trim() || '',
            kennelnaam: document.getElementById('kennelName')?.value.trim() || '',
            stamboomnr: document.getElementById('pedigreeNumber')?.value.trim() || '',
            ras: document.getElementById('breed')?.value.trim() || '',
            vachtkleur: document.getElementById('coatColor')?.value.trim() || '',
            geslacht: document.getElementById('gender')?.value || '',
            
            // OUDERS - EXACT DEZELFDE VELDNAMEN ALS DogManager
            vader: vaderNaam,
            vader_id: vaderIdValue && vaderIdValue.trim() !== '' && !isNaN(parseInt(vaderIdValue)) 
                ? parseInt(vaderIdValue) 
                : null,
            vader_stamboomnr: vaderStamboomnr || null,
            moeder: moederNaam,
            moeder_id: moederIdValue && moederIdValue.trim() !== '' && !isNaN(parseInt(moederIdValue)) 
                ? parseInt(moederIdValue) 
                : null,
            moeder_stamboomnr: moederStamboomnr || null,
            
            // DATUMS
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue) || null,
            
            // GEZONDHEIDSINFORMATIE
            heupdysplasie: document.getElementById('hipDysplasia')?.value || null,
            elleboogdysplasie: document.getElementById('elbowDysplasia')?.value || null,
            patella: document.getElementById('patellaLuxation')?.value || null,
            ogen: document.getElementById('eyes')?.value || null,
            ogenverklaring: document.getElementById('eyesExplanation')?.value.trim() || null,
            dandyWalker: document.getElementById('dandyWalker')?.value || null,
            // NIEUW: LUW veld
            LUW: luwValue || null,
            schildklier: document.getElementById('thyroid')?.value || null,
            schildklierverklaring: document.getElementById('thyroidExplanation')?.value.trim() || null,
            
            // LOCATIE
            land: document.getElementById('country')?.value.trim() || null,
            postcode: document.getElementById('zipCode')?.value.trim() || null,
            
            // OPMERKINGEN
            opmerkingen: document.getElementById('remarks')?.value.trim() || null,
            
            // SYSTEEMVELDEN
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString()
        };
        
        console.log('[LitterManager] === DOG DATA VOOR OPSLAG ===');
        console.log('Vader:', dogData.vader, 'vader_id:', dogData.vader_id);
        console.log('Moeder:', dogData.moeder, 'moeder_id:', dogData.moeder_id);
        console.log('LUW:', dogData.LUW);
        
        // Validatie
        if (!dogData.naam) {
            this.showError('Naam is verplicht');
            return;
        }
        
        if (!dogData.stamboomnr) {
            this.showError('Stamboomnummer is verplicht');
            return;
        }
        
        if (!dogData.ras) {
            this.showError('Ras is verplicht');
            return;
        }
        
        if (!dogData.geslacht) {
            this.showError('Geslacht is verplicht');
            return;
        }
        
        if (!dogData.vader) {
            this.showError('Vader is verplicht');
            return;
        }
        
        if (!dogData.moeder) {
            this.showError('Moeder is verplicht');
            return;
        }
        
        if (!dogData.vader_id) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        if (!dogData.moeder_id) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            console.log('LitterManager: Probeer hond op te slaan via database service...');
            
            let result;
            
            if (window.hondenService && window.hondenService.voegHondToe) {
                console.log('LitterManager: Gebruik window.hondenService.voegHondToe methode');
                result = await window.hondenService.voegHondToe(dogData);
            } else if (this.db && this.db.voegHondToe) {
                console.log('LitterManager: Gebruik this.db.voegHondToe methode');
                result = await this.db.voegHondToe(dogData);
            } else {
                throw new Error('voegHondToe methode niet beschikbaar');
            }
            
            console.log('LitterManager: Hond opgeslagen met resultaat:', result);
            
            // Gebruik de gecomprimeerde foto als die bestaat, anders de originele
            let fileToUpload = null;
            
            if (this.compressedPhotoFile) {
                fileToUpload = this.compressedPhotoFile;
                console.log('LitterManager: Uploaden van gecomprimeerde foto');
            } else {
                const photoInput = document.getElementById('photo');
                if (photoInput && photoInput.files && photoInput.files.length > 0) {
                    fileToUpload = photoInput.files[0];
                    console.log('LitterManager: Uploaden van originele foto (was al klein genoeg)');
                }
            }
            
            if (fileToUpload) {
                console.log('LitterManager: Foto uploaden...');
                
                if (fileToUpload.size > 5 * 1024 * 1024) {
                    this.showError(this.t('fileTooLarge'));
                    return;
                }
                
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(fileToUpload.type)) {
                    this.showError(this.t('invalidType'));
                    return;
                }
                
                await this.uploadPhoto(dogData.stamboomnr, fileToUpload);
            }
            
            // Voeg toe aan de lijst met huidige nest honden
            this.currentLitterDogs.push({
                naam: dogData.naam,
                stamboomnr: dogData.stamboomnr,
                geslacht: dogData.geslacht,
                vachtkleur: dogData.vachtkleur,
                heupdysplasie: dogData.heupdysplasie,
                elleboogdysplasie: dogData.elleboogdysplasie,
                patella: dogData.patella,
                ogen: dogData.ogen,
                dandyWalker: dogData.dandyWalker,
                luw: dogData.LUW,
                schildklier: dogData.schildklier,
                vader_id: dogData.vader_id,
                moeder_id: dogData.moeder_id,
                vader_stamboomnr: dogData.vader_stamboomnr,
                moeder_stamboomnr: dogData.moeder_stamboomnr
            });
            
            // Update de UI lijst
            this.updateAddedDogsList();
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Reset alleen de nestdetails velden
            this.resetLitterDetails();
            
        } catch (error) {
            console.error('LitterManager: Fout bij opslaan hond:', error);
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    async uploadPhoto(pedigreeNumber, file) {
        try {
            // Gebruik de gecomprimeerde data URL als die bestaat, anders genereer er een van de blob
            let base64Data;
            let thumbnail;
            
            if (this.compressedPhotoDataUrl) {
                // We hebben al een gecomprimeerde data URL
                base64Data = this.compressedPhotoDataUrl;
                thumbnail = this.thumbnailDataUrl || base64Data;
                console.log('LitterManager: Gebruik opgeslagen gecomprimeerde data URL');
            } else {
                // Converteer de blob naar data URL
                base64Data = await this.blobToDataUrl(file);
                
                // Genereer een thumbnail als die nog niet bestaat
                if (!this.thumbnailDataUrl) {
                    await this.generateThumbnail(base64Data);
                }
                thumbnail = this.thumbnailDataUrl || base64Data;
            }
            
            const user = window.auth ? window.auth.getCurrentUser() : null;
            if (!user || !user.id) {
                throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
            }
            
            const fotoData = {
                stamboomnr: pedigreeNumber,
                data: base64Data,
                thumbnail: thumbnail,
                filename: file.name,
                size: file.size,
                type: file.type,
                uploaded_at: new Date().toISOString(),
                geupload_door: user.id
            };
            
            const { data: dbData, error: dbError } = await window.supabase
                .from('fotos')
                .insert(fotoData)
                .select()
                .single();
            
            if (dbError) {
                console.error('Database insert error:', dbError);
                throw dbError;
            }
            
            console.log('Database insert successful:', dbData);
            this.showSuccess(this.t('photoAdded'));
            
            // Reset de gecomprimeerde bestanden na succesvolle upload
            this.compressedPhotoFile = null;
            this.compressedPhotoDataUrl = null;
            this.thumbnailDataUrl = null;
            
        } catch (error) {
            console.error('Upload fout:', error);
            this.showError(`${this.t('photoError')}${error.message}`);
            throw error;
        }
    }
    
    resetForm() {
        // Reset alle formulier velden
        const form = document.getElementById('litterForm');
        if (form) {
            form.reset();
        }
        
        // Reset hidden inputs
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        if (vaderIdInput) vaderIdInput.value = '';
        if (moederIdInput) moederIdInput.value = '';
        
        // Reset parent name inputs
        const fatherNameInput = document.getElementById('father');
        const motherNameInput = document.getElementById('mother');
        if (fatherNameInput) {
            fatherNameInput.value = '';
            fatherNameInput.setAttribute('data-pedigree', '');
        }
        if (motherNameInput) {
            motherNameInput.value = '';
            motherNameInput.setAttribute('data-pedigree', '');
        }
        
        // Reset dropdowns
        const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        // Reset datum velden
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        if (birthDateInput) {
            birthDateInput.type = 'date';
            birthDateInput.placeholder = 'DD-MM-JJJJ';
        }
        if (deathDateInput) {
            deathDateInput.type = 'date';
            deathDateInput.placeholder = 'DD-MM-JJJJ';
        }
        
        // Reset file info
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) {
            fileInfo.textContent = this.t('noFileChosen');
        }
        
        // Reset error berichten
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
        });
        
        // Reset TomSelects
        if (this.fatherTomSelect) {
            this.fatherTomSelect.clear();
        }
        if (this.motherTomSelect) {
            this.motherTomSelect.clear();
        }
        
        // Reset de lijst met ingevoerde honden
        this.currentLitterDogs = [];
        this.updateAddedDogsList();
        
        // Reset kennelnaam autocomplete dropdown
        const kennelDropdown = document.getElementById('kennelAutocompleteDropdown');
        if (kennelDropdown) {
            kennelDropdown.style.display = 'none';
            kennelDropdown.innerHTML = '';
        }
        
        // Reset gecomprimeerde fotogegevens
        this.compressedPhotoFile = null;
        this.compressedPhotoDataUrl = null;
        this.thumbnailDataUrl = null;
    }
    
    showProgress(message) {
        console.log('LitterManager showProgress:', message);
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            alert(message);
        }
    }
    
    hideProgress() {
        console.log('LitterManager hideProgress');
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        }
    }
    
    showSuccess(message) {
        console.log('LitterManager showSuccess:', message);
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        console.error('LitterManager showError:', message);
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            alert(message);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}