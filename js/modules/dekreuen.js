// js/modules/DekReuen.js

/**
 * DekReuen Management Module voor Supabase
 * Beheert dek reuen overzicht en beheer met echte database koppeling
 * MET COMPLETE GEZONDHEIDSINFO IN OVERZICHT en DUIDELIJKE BENAMINGEN
 */

class DekReuenManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.userRole = localStorage.getItem('userRole') || 'gebruiker';
        this.isAdmin = this.userRole === 'admin';
        this.isUser = this.userRole === 'gebruiker';
        this.isUserPlus = this.userRole === 'gebruiker+';
        this.currentView = 'overview';
        this.db = null;
        this.auth = null;
        this.currentUser = null;
        this.supabase = null;
        
        // Paginatie variabelen
        this.currentPage = 1;
        this.pageSize = 100;
        this.totalReuen = 0;
        this.currentSearchTerm = '';
        this.searchTimeout = null;
        
        // Foto gerelateerde variabelen
        this.selectedHondId = null;
        this.selectedHondStamboomnr = null;
        this.selectedHondNaam = null;
        this.selectedHondData = null;
        this.hondFotos = [];
        
        // Bewerken variabelen
        this.editingDekReuId = null;
        this.editingDekReuData = null;
        
        this.translations = {
            nl: {
                dekReuen: "Dek Reuen",
                dekReuenBeheer: "Dek Reuen Beheer",
                dekReuenOverview: "Dek Reuen Overzicht",
                chooseAction: "Kies een actie:",
                viewOverview: "Dek Reuen Bekijken",
                manageDekReuen: "Dek Reuen Beheren",
                close: "Sluiten",
                noDekReuen: "Er zijn nog geen dek reuen toegevoegd",
                loading: "Dek reuen laden...",
                loadFailed: "Laden mislukt: ",
                addDekReu: "Dek Reu Toevoegen",
                edit: "Bewerken",
                delete: "Verwijderen",
                confirmDelete: "Weet je zeker dat je deze dek reu wilt verwijderen?",
                confirmDeletePhoto: "Weet je zeker dat je deze foto wilt verwijderen?",
                save: "Opslaan",
                cancel: "Annuleren",
                selectHond: "Zoek een reu door naam of kennelnaam te typen...",
                searchHond: "Typ minimaal 2 letters om te zoeken...",
                active: "Actief",
                inactive: "Inactief",
                status: "Status",
                description: "Beschrijving / Opmerkingen",
                addedBy: "Toegevoegd door",
                addedOn: "Toegevoegd op",
                viewPedigree: "Bekijk Stamboom",
                noPermission: "Je hebt geen rechten om deze actie uit te voeren",
                back: "Terug",
                notLoggedIn: "Je moet ingelogd zijn om dek reuen te beheren",
                loginRequired: "Inloggen vereist",
                noDogsFound: "Geen reuen gevonden die voldoen aan je zoekopdracht",
                addDogFirst: "Reu toevoegen",
                debugInfo: "Debug info",
                typeToSearch: "Typ om te zoeken...",
                loading: "Laden...",
                stamboomnr: "Stamboomnummer",
                prevPage: "Vorige",
                nextPage: "Volgende",
                pageInfo: "Pagina {page} van {totalPages}",
                showingResults: "{start}-{end} van {total} reuen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                viewPhoto: "Bekijk foto",
                uploadPhoto: "Foto uploaden",
                selectPhoto: "Selecteer foto",
                photoUploaded: "Foto geüpload op",
                selectPhotoToUpload: "Selecteer een foto om te uploaden",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF, WebP",
                fileTooLarge: "Bestand is te groot (maximaal 5MB)",
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan",
                uploading: "Foto uploaden...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                photoSection: "Foto's van deze reu",
                editDekReu: "Dek Reu Bewerken",
                deletePhoto: "Verwijder foto",
                photoDeleteSuccess: "Foto succesvol verwijderd!",
                photoDeleteFailed: "Verwijderen foto mislukt: ",
                
                // GEZONDHEIDSITEMS - Invulvelden
                healthInfo: "Gezondheidsinformatie",
                healthInfoSub: "Deze gegevens worden opgeslagen bij de hond",
                hipDysplasia: "HD *",
                hipGrades: "Selecteer HD graad...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "ED *",
                elbowGrades: "Selecteer ED graad...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella",
                patellaGrades: "Selecteer Patella graad...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Ogen",
                eyesFree: "Vrij",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Overig",
                eyesExplanation: "Toelichting ogen",
                dandyWalker: "Dandy Walker *",
                dandyOptions: "Selecteer Dandy Walker status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                thyroid: "Schildklier *",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                
                // GEZONDHEIDSITEMS - Weergave in overzicht (zelfde benamingen)
                healthData: "Gezondheidsgegevens",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Ogen",
                eyesExplanation: "Toelichting ogen",
                dandyWalker: "Dandy Walker",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                notSpecified: "Niet opgegeven",
                
                // Validatie meldingen
                requiredField: "Dit veld is verplicht",
                hipRequired: "HD is verplicht voor dek reuen",
                dandyRequired: "Dandy Walker status is verplicht voor dek reuen",
                thyroidRequired: "Schildklier status is verplicht voor dek reuen",
                
                // Waarschuwing
                healthDataFromDatabase: "Gezondheidsgegevens zijn geladen uit het hondenbestand",
                noHealthData: "Nog geen gezondheidsgegevens bekend voor deze hond",
                
                // Land en Email
                country: "Land *",
                selectCountry: "Selecteer land...",
                netherlands: "Nederland",
                belgium: "België",
                germany: "Duitsland",
                france: "Frankrijk",
                uk: "Verenigd Koninkrijk",
                other: "Anders",
                countryRequired: "Land is verplicht voor dek reuen",
                email: "Email",
                noEmail: "Geen email bekend"
            },
            en: {
                dekReuen: "Stud Dogs",
                dekReuenBeheer: "Stud Dog Management",
                dekReuenOverview: "Stud Dog Overview",
                chooseAction: "Choose an action:",
                viewOverview: "View Stud Dogs",
                manageDekReuen: "Manage Stud Dogs",
                close: "Close",
                noDekReuen: "No stud dogs added yet",
                loading: "Loading stud dogs...",
                loadFailed: "Loading failed: ",
                addDekReu: "Add Stud Dog",
                edit: "Edit",
                delete: "Delete",
                confirmDelete: "Are you sure you want to delete this stud dog?",
                confirmDeletePhoto: "Are you sure you want to delete this photo?",
                save: "Save",
                cancel: "Cancel",
                selectHond: "Search for a male dog by name or kennel name...",
                searchHond: "Type at least 2 characters to search...",
                active: "Active",
                inactive: "Inactive",
                status: "Status",
                description: "Description / Remarks",
                addedBy: "Added by",
                addedOn: "Added on",
                viewPedigree: "View Pedigree",
                noPermission: "You don't have permission to perform this action",
                back: "Back",
                notLoggedIn: "You must be logged in to manage stud dogs",
                loginRequired: "Login required",
                noDogsFound: "No male dogs found matching your search",
                addDogFirst: "Add male dog",
                debugInfo: "Debug info",
                typeToSearch: "Type to search...",
                loading: "Loading...",
                stamboomnr: "Pedigree number",
                prevPage: "Previous",
                nextPage: "Next",
                pageInfo: "Page {page} of {totalPages}",
                showingResults: "{start}-{end} of {total} stud dogs",
                photos: "Photos",
                noPhotos: "No photos available",
                viewPhoto: "View photo",
                uploadPhoto: "Upload photo",
                selectPhoto: "Select photo",
                photoUploaded: "Photo uploaded on",
                selectPhotoToUpload: "Select a photo to upload",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF, WebP",
                fileTooLarge: "File is too large (maximum 5MB)",
                invalidType: "Invalid file type. Only JPG, PNG, GIF and WebP are allowed",
                uploading: "Uploading photo...",
                uploadSuccess: "Photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                photoSection: "Photos of this dog",
                editDekReu: "Edit Stud Dog",
                deletePhoto: "Delete photo",
                photoDeleteSuccess: "Photo deleted successfully!",
                photoDeleteFailed: "Delete photo failed: ",
                
                // HEALTH ITEMS - Input fields
                healthInfo: "Health Information",
                healthInfoSub: "This data will be saved with the dog",
                hipDysplasia: "HD *",
                hipGrades: "Select HD grade...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "ED *",
                elbowGrades: "Select ED grade...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Not known)",
                patellaLuxation: "Patella",
                patellaGrades: "Select Patella grade...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Eyes",
                eyesFree: "Free",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Other",
                eyesExplanation: "Eyes explanation",
                dandyWalker: "Dandy Walker *",
                dandyOptions: "Select Dandy Walker status...",
                dandyFreeDNA: "Free on DNA",
                dandyFreeParents: "Free on parents",
                dandyCarrier: "Carrier",
                dandyAffected: "Affected",
                thyroid: "Thyroid *",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                
                // HEALTH ITEMS - Display in overview (same names)
                healthData: "Health Data",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Eyes",
                eyesExplanation: "Eyes explanation",
                dandyWalker: "Dandy Walker",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                notSpecified: "Not specified",
                
                // Validation messages
                requiredField: "This field is required",
                hipRequired: "HD is required for stud dogs",
                dandyRequired: "Dandy Walker status is required for stud dogs",
                thyroidRequired: "Thyroid status is required for stud dogs",
                
                // Warnings
                healthDataFromDatabase: "Health data loaded from dog database",
                noHealthData: "No health data available for this dog yet",
                
                // Country and Email
                country: "Country *",
                selectCountry: "Select country...",
                netherlands: "Netherlands",
                belgium: "Belgium",
                germany: "Germany",
                france: "France",
                uk: "United Kingdom",
                other: "Other",
                countryRequired: "Country is required for stud dogs",
                email: "Email",
                noEmail: "No email known"
            },
            de: {
                dekReuen: "Zuchtrüden",
                dekReuenBeheer: "Zuchtrüden Verwaltung",
                dekReuenOverview: "Zuchtrüden Übersicht",
                chooseAction: "Wählen Sie eine Aktion:",
                viewOverview: "Zuchtrüden Ansehen",
                manageDekReuen: "Zuchtrüden Verwalten",
                close: "Schließen",
                noDekReuen: "Noch keine Zuchtrüden hinzugefügt",
                loading: "Zuchtrüden laden...",
                loadFailed: "Laden fehlgeschlagen: ",
                addDekReu: "Zuchtrüde Hinzufügen",
                edit: "Bearbeiten",
                delete: "Löschen",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Zuchtrüden löschen möchten?",
                confirmDeletePhoto: "Sind Sie sicher, dass Sie dieses Foto löschen möchten?",
                save: "Speichern",
                cancel: "Abbrechen",
                selectHond: "Suchen Sie einen Rüden nach Namen oder Zwingername...",
                searchHond: "Geben Sie mindestens 2 Zeichen ein...",
                active: "Aktiv",
                inactive: "Inaktiv",
                status: "Status",
                description: "Beschreibung / Bemerkungen",
                addedBy: "Hinzugefügt von",
                addedOn: "Hinzugefügt am",
                viewPedigree: "Stammbaum anzeigen",
                noPermission: "Sie haben keine Berechtigung für diese Aktion",
                back: "Zurück",
                notLoggedIn: "Sie müssen angemeldet sein, um Zuchtrüden zu verwalten",
                loginRequired: "Anmeldung erforderlich",
                noDogsFound: "Keine Rüden gefunden",
                addDogFirst: "Rüde hinzufügen",
                debugInfo: "Debug-Info",
                typeToSearch: "Tippen Sie zum Suchen...",
                loading: "Laden...",
                stamboomnr: "Stammbaumnummer",
                prevPage: "Vorherige",
                nextPage: "Nächste",
                pageInfo: "Seite {page} von {totalPages}",
                showingResults: "{start}-{end} von {total} Zuchtrüden",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                viewPhoto: "Foto ansehen",
                uploadPhoto: "Foto hochladen",
                selectPhoto: "Foto auswählen",
                photoUploaded: "Foto hochgeladen am",
                selectPhotoToUpload: "Wählen Sie ein Foto zum Hochladen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF, WebP",
                fileTooLarge: "Datei ist zu groß (maximal 5MB)",
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG, GIF und WebP sind erlaubt",
                uploading: "Foto wird hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                photoSection: "Fotos dieses Rüden",
                editDekReu: "Zuchtrüde Bearbeiten",
                deletePhoto: "Foto löschen",
                photoDeleteSuccess: "Foto erfolgreich gelöscht!",
                photoDeleteFailed: "Löschen fehlgeschlagen: ",
                
                // GESUNDHEITSDATEN - Eingabefelder
                healthInfo: "Gesundheitsinformationen",
                healthInfoSub: "Diese Daten werden beim Hund gespeichert",
                hipDysplasia: "HD *",
                hipGrades: "HD Grad wählen...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "ED *",
                elbowGrades: "ED Grad wählen...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Nicht bekannt)",
                patellaLuxation: "Patella",
                patellaGrades: "Patella Grad wählen...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Augen",
                eyesFree: "Frei",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Andere",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker *",
                dandyOptions: "Dandy Walker Status wählen...",
                dandyFreeDNA: "Frei auf DNA",
                dandyFreeParents: "Frei auf Eltern",
                dandyCarrier: "Träger",
                dandyAffected: "Betroffen",
                thyroid: "Schilddrüse *",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positiv",
                thyroidExplanation: "Schilddrüsenerklärung",
                
                // GESUNDHEITSDATEN - Anzeige in Übersicht (gleiche Namen)
                healthData: "Gesundheitsdaten",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüsenerklärung",
                notSpecified: "Nicht angegeben",
                
                // Validierungsmeldungen
                requiredField: "Dieses Feld ist erforderlich",
                hipRequired: "HD ist für Zuchtrüden erforderlich",
                dandyRequired: "Dandy Walker Status ist für Zuchtrüden erforderlich",
                thyroidRequired: "Schilddrüsenstatus ist für Zuchtrüden erforderlich",
                
                // Warnungen
                healthDataFromDatabase: "Gesundheitsdaten aus der Hunde-Datenbank geladen",
                noHealthData: "Noch keine Gesundheitsdaten für diesen Hund vorhanden",
                
                // Land und Email
                country: "Land *",
                selectCountry: "Land auswählen...",
                netherlands: "Niederlande",
                belgium: "Belgien",
                germany: "Deutschland",
                france: "Frankreich",
                uk: "Vereinigtes Königreich",
                other: "Andere",
                countryRequired: "Land ist für Zuchtrüden erforderlich",
                email: "Email",
                noEmail: "Keine Email bekannt"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    /**
     * Zorg dat PhotoViewer geladen is, laad hem anders dynamisch
     */
    async ensurePhotoViewer() {
        // Als PhotoViewer al bestaat, niets doen
        if (window.photoViewer && typeof window.photoViewer.showPhoto === 'function') {
            return;
        }
        
        console.log('📸 PhotoViewer wordt dynamisch geladen...');
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/modules/PhotoViewer.js';
            script.onload = () => {
                // Wacht kort tot de PhotoViewer beschikbaar is
                let checkCount = 0;
                const checkInterval = setInterval(() => {
                    if (window.photoViewer) {
                        clearInterval(checkInterval);
                        console.log('✅ PhotoViewer geladen en klaar voor gebruik');
                        resolve();
                    } else if (checkCount > 20) { // 2 seconden timeout
                        clearInterval(checkInterval);
                        console.error('❌ PhotoViewer niet gevonden na laden');
                        reject(new Error('PhotoViewer niet beschikbaar'));
                    }
                    checkCount++;
                }, 100);
            };
            script.onerror = () => {
                console.error('❌ PhotoViewer script laden mislukt');
                reject(new Error('PhotoViewer laden mislukt'));
            };
            document.head.appendChild(script);
        });
    }
    
    /**
     * Simpele functie om de Supabase client te krijgen
     */
    getSupabase() {
        if (this.supabase) return this.supabase;
        if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
            return this.supabase;
        }
        if (window.supabase) {
            this.supabase = window.supabase;
            return this.supabase;
        }
        return null;
    }
    
    /**
     * Haal reuen op met paginatie en zoekfunctionaliteit
     */
    async getAllMaleDogs(searchTerm = '', page = 1, pageSize = 100) {
        try {
            console.log(`🔍 Reuen ophalen - Zoekterm: "${searchTerm}", Pagina: ${page}, Size: ${pageSize}`);
            
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return { data: [], total: 0 };
            }
            
            let query = supabase
                .from('honden')
                .select('*', { count: 'exact' })
                .eq('geslacht', 'reuen');
            
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
            
            console.log(`✅ ${data?.length || 0} reuen gevonden (totaal: ${count || 0})`);
            return { 
                data: data || [], 
                total: count || 0 
            };
            
        } catch (error) {
            console.error('❌ Fout bij ophalen reuen:', error);
            return { data: [], total: 0 };
        }
    }
    
    /**
     * Haal een specifieke dek reu op met hond gegevens
     */
    async getDekReu(id) {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data, error } = await supabase
                .from('dekreuen')
                .select('*, hond:honden(*)')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Fout bij ophalen dek reu:', error);
            return null;
        }
    }
    
    /**
     * Haal foto's op voor een specifieke hond
     */
    async getHondFotos(hondId) {
        try {
            if (!hondId) return [];
            
            const supabase = this.getSupabase();
            if (!supabase) return [];
            
            const { data: hondData, error: hondError } = await supabase
                .from('honden')
                .select('stamboomnr, naam, kennelnaam')
                .eq('id', hondId)
                .single();
                
            if (hondError || !hondData) {
                console.error('❌ Kon hond niet vinden:', hondError);
                return [];
            }
            
            this.selectedHondStamboomnr = hondData.stamboomnr;
            this.selectedHondNaam = hondData.naam;
            
            const { data: fotos, error } = await supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', hondData.stamboomnr)
                .order('uploaded_at', { ascending: false });
            
            if (error) {
                console.error('❌ Fout bij ophalen foto\'s:', error);
                return [];
            }
            
            console.log(`📸 ${fotos?.length || 0} foto's gevonden voor hond ${hondId} (${hondData.stamboomnr})`);
            return fotos || [];
            
        } catch (error) {
            console.error('❌ Fout bij ophalen foto\'s:', error);
            return [];
        }
    }
    
    /**
     * Upload foto voor geselecteerde hond
     */
    async uploadPhoto() {
        const t = this.t.bind(this);
        
        if (!this.selectedHondId || !this.selectedHondStamboomnr) {
            this.showError(t('selectHond'), 'hondFotosContainer');
            return;
        }
        
        const fileInput = document.getElementById('dekReuPhotoFile');
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectPhoto'), 'hondFotosContainer');
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError(t('fileTooLarge'), 'hondFotosContainer');
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError(t('invalidType'), 'hondFotosContainer');
            return;
        }
        
        this.showProgress(t('uploading'), 'hondFotosContainer');
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const user = this.currentUser || (await this.getSupabase().auth.getUser()).data.user;
                if (!user || !user.id) {
                    throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
                }
                
                const base64Data = e.target.result;
                
                let thumbnail = null;
                try {
                    const img = new Image();
                    img.src = base64Data;
                    
                    await new Promise((resolve) => {
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            const maxSize = 100;
                            let width = img.width;
                            let height = img.height;
                            
                            if (width > height) {
                                if (width > maxSize) {
                                    height = (height * maxSize) / width;
                                    width = maxSize;
                                }
                            } else {
                                if (height > maxSize) {
                                    width = (width * maxSize) / height;
                                    height = maxSize;
                                }
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            thumbnail = canvas.toDataURL('image/jpeg', 0.6);
                            resolve();
                        };
                    });
                } catch (thumbError) {
                    console.warn('Thumbnail maken mislukt:', thumbError);
                    thumbnail = base64Data;
                }
                
                const fotoData = {
                    stamboomnr: this.selectedHondStamboomnr,
                    data: base64Data,
                    thumbnail: thumbnail,
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    uploaded_at: new Date().toISOString(),
                    geupload_door: user.id,
                    hond_id: this.selectedHondId
                };
                
                const { data: dbData, error: dbError } = await this.getSupabase()
                    .from('fotos')
                    .insert(fotoData)
                    .select()
                    .single();
                
                if (dbError) {
                    console.error('Database insert error:', dbError);
                    throw dbError;
                }
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'), 'hondFotosContainer');
                
                fileInput.value = '';
                
                await this.loadHondFotos(this.selectedHondId);
                
            } catch (error) {
                console.error('Upload error:', error);
                this.hideProgress();
                this.showError(`${t('uploadFailed')}${error.message}`, 'hondFotosContainer');
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'), 'hondFotosContainer');
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * Verwijder een foto
     */
    async deletePhoto(fotoId, fotoElement) {
        const t = this.t.bind(this);
        
        if (!confirm(t('confirmDeletePhoto'))) return;
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) throw new Error('Geen database verbinding');
            
            const { error } = await supabase
                .from('fotos')
                .delete()
                .eq('id', fotoId);
            
            if (error) throw error;
            
            if (fotoElement) {
                fotoElement.remove();
            }
            
            this.showSuccess(t('photoDeleteSuccess'), 'hondFotosContainer');
            
            if (this.selectedHondId) {
                await this.loadHondFotos(this.selectedHondId);
            }
            
        } catch (error) {
            console.error('❌ Fout bij verwijderen foto:', error);
            this.showError(`${t('photoDeleteFailed')}${error.message}`, 'hondFotosContainer');
        }
    }
    
    /**
     * Laad en toon foto's voor geselecteerde hond
     */
    async loadHondFotos(hondId) {
        if (!hondId) return;
        
        this.selectedHondId = hondId;
        this.hondFotos = await this.getHondFotos(hondId);
        
        await this.displayHondFotos();
    }
    
    /**
     * Toon foto's in de container met verwijderknop
     */
    async displayHondFotos() {
        const container = document.getElementById('hondFotosContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        if (!this.hondFotos || this.hondFotos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                    <p class="mt-2 text-muted">${t('noPhotos')}</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="row">';
        
        for (const foto of this.hondFotos) {
            html += `
                <div class="col-md-4 col-lg-3 mb-3" id="foto-${foto.id}">
                    <div class="card h-100 position-relative">
                        <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 delete-photo-btn" 
                                data-foto-id="${foto.id}"
                                style="z-index: 10; border-radius: 50%; width: 32px; height: 32px; padding: 0;"
                                title="${t('deletePhoto')}">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="card-img-top dek-reu-foto-thumbnail" 
                             style="height: 120px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                             data-hond-naam="${this.selectedHondNaam || ''}">
                            <img src="${foto.thumbnail || foto.data}" alt="Foto" 
                                 style="max-width: 100%; max-height: 100%; object-fit: cover;">
                        </div>
                        <div class="card-body p-2">
                            <small class="text-muted d-block text-truncate">
                                ${foto.filename || 'Foto'}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Click handlers voor foto's met dynamisch laden van PhotoViewer
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam || this.selectedHondNaam || '';
                    
                    // Laad PhotoViewer dynamisch
                    await this.ensurePhotoViewer();
                    
                    // Toon de foto
                    window.photoViewer.showPhoto(foto.data, hondNaam);
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
                    // Fallback: open direct in nieuw tabblad
                    try {
                        const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                        window.open(foto.data, '_blank');
                    } catch (fallbackError) {
                        console.error('Ook fallback mislukt:', fallbackError);
                    }
                }
            });
        });
        
        container.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fotoId = btn.dataset.fotoId;
                const fotoElement = document.getElementById(`foto-${fotoId}`);
                await this.deletePhoto(fotoId, fotoElement);
            });
        });
    }
    
    /**
     * Maak een searchable dropdown met Tom Select
     */
    async initTomSelect(initialValue = null) {
        if (typeof window.TomSelect === 'undefined') {
            console.log('⏳ Tom Select wordt geladen...');
            await this.loadTomSelect();
        }
        
        const selectElement = document.getElementById('hondSelect');
        if (!selectElement) return null;
        
        if (selectElement.tomselect) {
            selectElement.tomselect.destroy();
        }
        
        const tomSelect = new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'displayName',
            searchField: ['naam', 'kennelnaam', 'stamboomnr'],
            create: false,
            maxOptions: 100,
            maxItems: 1,
            placeholder: this.t('selectHond'),
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
                    console.log('🔍 Zoeken naar:', query);
                    const result = await this.getAllMaleDogs(query, 1, 100);
                    
                    const items = result.data.map(hond => ({
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`,
                        displayWithPedigree: `
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}</span>
                                <small class="text-muted">Stamboeknr: ${hond.stamboomnr || '-'}</small>
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
            onChange: async (value) => {
                this.selectedHondId = value ? parseInt(value) : null;
                
                if (this.selectedHondId) {
                    const uploadSection = document.getElementById('photoUploadSection');
                    if (uploadSection) {
                        uploadSection.style.display = 'block';
                    }
                    
                    await this.loadHondFotos(this.selectedHondId);
                    await this.loadDogHealthData(this.selectedHondId);
                    await this.loadDogCountry(this.selectedHondId);
                } else {
                    const uploadSection = document.getElementById('photoUploadSection');
                    if (uploadSection) {
                        uploadSection.style.display = 'none';
                    }
                    
                    const container = document.getElementById('hondFotosContainer');
                    if (container) {
                        container.innerHTML = '';
                    }
                    
                    this.resetHealthForm();
                }
            },
            onInitialize: function() {
                console.log('✅ Tom Select geïnitialiseerd');
            }
        });
        
        if (initialValue) {
            tomSelect.setValue(initialValue);
        }
        
        return tomSelect;
    }
    
    /**
     * Laad Tom Select library dynamisch
     */
    loadTomSelect() {
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
    
    /**
     * Laad gezondheidsgegevens van een hond en vul het formulier
     */
    async loadDogHealthData(hondId) {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return;
            
            const { data: hond, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', hondId)
                .single();
            
            if (error) throw error;
            
            if (hond) {
                this.selectedHondData = hond;
                console.log('✅ Gezondheidsgegevens geladen voor hond:', hond.naam);
                
                this.populateHealthForm(hond);
                
                const healthNote = document.getElementById('healthDataNote');
                if (healthNote) {
                    healthNote.innerHTML = `<i class="bi bi-info-circle"></i> ${this.t('healthDataFromDatabase')}`;
                    healthNote.className = 'alert alert-info mt-3';
                }
            }
        } catch (error) {
            console.error('❌ Fout bij laden gezondheidsgegevens:', error);
        }
    }
    
    /**
     * Laad land van een hond en vul het formulier
     */
    async loadDogCountry(hondId) {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return;
            
            const { data: hond, error } = await supabase
                .from('honden')
                .select('land')
                .eq('id', hondId)
                .single();
            
            if (error) throw error;
            
            if (hond && hond.land) {
                const countrySelect = document.getElementById('country');
                if (countrySelect) {
                    countrySelect.value = hond.land;
                }
            }
        } catch (error) {
            console.error('❌ Fout bij laden land:', error);
        }
    }
    
    /**
     * Haal email op van de eigenaar uit de dekreuen tabel
     */
    async getOwnerEmail(dekReuId) {
        try {
            if (!dekReuId) return null;
            
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data, error } = await supabase
                .from('dekreuen')
                .select('email')
                .eq('id', dekReuId)
                .single();
            
            if (error) throw error;
            
            return data?.email || null;
        } catch (error) {
            console.error('❌ Fout bij ophalen email uit dekreuen:', error);
            return null;
        }
    }
    
    /**
     * Haal email op van de huidige gebruiker uit de profiles tabel
     */
    async getCurrentUserEmail() {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.id) return null;
            
            const { data, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('user_id', user.id)  // GEWIJZIGD: zoek op user_id in plaats van id
                .single();
            
            if (error) {
                console.error('❌ Fout bij ophalen email uit profiles:', error);
                return null;
            }
            
            return data?.email || null;
        } catch (error) {
            console.error('❌ Fout bij ophalen huidige gebruiker email:', error);
            return null;
        }
    }
    
    /**
     * Vul gezondheidsformulier met data uit de hond
     */
    populateHealthForm(hond) {
        // HD
        const hipSelect = document.getElementById('hipDysplasia');
        if (hipSelect && hond.heupdysplasie) {
            hipSelect.value = hond.heupdysplasie;
        }
        
        // ED
        const elbowSelect = document.getElementById('elbowDysplasia');
        if (elbowSelect && hond.elleboogdysplasie) {
            elbowSelect.value = hond.elleboogdysplasie;
        }
        
        // Patella
        const patellaSelect = document.getElementById('patellaLuxation');
        if (patellaSelect && hond.patella) {
            patellaSelect.value = hond.patella;
        }
        
        // Ogen
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect && hond.ogen) {
            eyesSelect.value = hond.ogen;
            
            const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
            if (eyesExplanationContainer) {
                eyesExplanationContainer.style.display = hond.ogen === 'Overig' ? 'block' : 'none';
            }
        }
        
        // Toelichting ogen
        const eyesExplanation = document.getElementById('eyesExplanation');
        if (eyesExplanation && hond.ogenverklaring) {
            eyesExplanation.value = hond.ogenverklaring || '';
        }
        
        // Dandy Walker
        const dandySelect = document.getElementById('dandyWalker');
        if (dandySelect && hond.dandyWalker) {
            dandySelect.value = hond.dandyWalker;
        }
        
        // Schildklier
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect && hond.schildklier) {
            thyroidSelect.value = hond.schildklier;
        }
        
        // Toelichting schildklier
        const thyroidExplanation = document.getElementById('thyroidExplanation');
        if (thyroidExplanation && hond.schildklierverklaring) {
            thyroidExplanation.value = hond.schildklierverklaring || '';
        }
    }
    
    /**
     * Reset gezondheidsformulier
     */
    resetHealthForm() {
        const hipSelect = document.getElementById('hipDysplasia');
        if (hipSelect) hipSelect.value = '';
        
        const elbowSelect = document.getElementById('elbowDysplasia');
        if (elbowSelect) elbowSelect.value = '';
        
        const patellaSelect = document.getElementById('patellaLuxation');
        if (patellaSelect) patellaSelect.value = '';
        
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) eyesSelect.value = '';
        
        const dandySelect = document.getElementById('dandyWalker');
        if (dandySelect) dandySelect.value = '';
        
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) thyroidSelect.value = '';
        
        const eyesExplanation = document.getElementById('eyesExplanation');
        if (eyesExplanation) eyesExplanation.value = '';
        
        const thyroidExplanation = document.getElementById('thyroidExplanation');
        if (thyroidExplanation) thyroidExplanation.value = '';
        
        const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
        if (eyesExplanationContainer) {
            eyesExplanationContainer.style.display = 'none';
        }
        
        const healthNote = document.getElementById('healthDataNote');
        if (healthNote) {
            healthNote.innerHTML = '';
            healthNote.className = '';
        }
        
        const countrySelect = document.getElementById('country');
        if (countrySelect) countrySelect.value = '';
    }
    
    /**
     * Valideer verplichte gezondheidsvelden
     */
    validateHealthFields() {
        const t = this.t.bind(this);
        let isValid = true;
        
        const hipSelect = document.getElementById('hipDysplasia');
        const hipError = document.getElementById('hipError');
        if (!hipSelect || !hipSelect.value) {
            if (hipError) {
                hipError.textContent = t('hipRequired');
                hipError.style.display = 'block';
            }
            hipSelect?.classList.add('is-invalid');
            isValid = false;
        } else {
            if (hipError) hipError.style.display = 'none';
            hipSelect?.classList.remove('is-invalid');
        }
        
        const dandySelect = document.getElementById('dandyWalker');
        const dandyError = document.getElementById('dandyError');
        if (!dandySelect || !dandySelect.value) {
            if (dandyError) {
                dandyError.textContent = t('dandyRequired');
                dandyError.style.display = 'block';
            }
            dandySelect?.classList.add('is-invalid');
            isValid = false;
        } else {
            if (dandyError) dandyError.style.display = 'none';
            dandySelect?.classList.remove('is-invalid');
        }
        
        const thyroidSelect = document.getElementById('thyroid');
        const thyroidError = document.getElementById('thyroidError');
        if (!thyroidSelect || !thyroidSelect.value) {
            if (thyroidError) {
                thyroidError.textContent = t('thyroidRequired');
                thyroidError.style.display = 'block';
            }
            thyroidSelect?.classList.add('is-invalid');
            isValid = false;
        } else {
            if (thyroidError) thyroidError.style.display = 'none';
            thyroidSelect?.classList.remove('is-invalid');
        }
        
        const countrySelect = document.getElementById('country');
        const countryError = document.getElementById('countryError');
        if (!countrySelect || !countrySelect.value) {
            if (countryError) {
                countryError.textContent = t('countryRequired');
                countryError.style.display = 'block';
            }
            countrySelect?.classList.add('is-invalid');
            isValid = false;
        } else {
            if (countryError) countryError.style.display = 'none';
            countrySelect?.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    /**
     * Toon de Dek Reuen modal
     */
    async showModal() {
        console.log('DekReuenManager.showModal()');
        
        const supabase = this.getSupabase();
        if (!supabase) {
            alert('Geen verbinding met database');
            return;
        }
        
        this.db = supabase;
        this.auth = supabase.auth;
        
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;
        console.log('Gebruiker:', user?.email);
        
        this.currentPage = 1;
        this.currentSearchTerm = '';
        this.selectedHondId = null;
        this.selectedHondStamboomnr = null;
        this.selectedHondNaam = null;
        this.selectedHondData = null;
        this.hondFotos = [];
        this.editingDekReuId = null;
        this.editingDekReuData = null;
        
        const modalHTML = this.getChoiceModalHTML();
        
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        const existingModal = document.getElementById('dekReuenModal');
        if (existingModal) existingModal.remove();
        
        modalsContainer.innerHTML = modalHTML;
        
        const modalElement = document.getElementById('dekReuenModal');
        const modal = new bootstrap.Modal(modalElement);
        
        document.getElementById('viewOverviewBtn')?.addEventListener('click', () => this.showOverviewView());
        document.getElementById('manageDekReuenBtn')?.addEventListener('click', () => this.showBeheerView());
        
        this.fixModalClose();
        modal.show();
    }
    
    async showOverviewView() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('dekReuenModal'));
        if (modal) modal.hide();
        
        await new Promise(r => setTimeout(r, 300));
        
        const modalHTML = this.getOverviewModalHTML();
        
        let modalsContainer = document.getElementById('modalsContainer');
        modalsContainer.innerHTML = modalHTML;
        
        const modalElement = document.getElementById('dekReuenModal');
        const newModal = new bootstrap.Modal(modalElement);
        
        document.getElementById('backToChoiceBtn')?.addEventListener('click', () => this.showModal());
        
        await this.loadDekReuen(false);
        newModal.show();
    }
    
    async showBeheerView() {
        this.currentView = 'beheer';
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('dekReuenModal'));
        if (modal) modal.hide();
        
        await new Promise(r => setTimeout(r, 300));
        
        const modalHTML = this.getBeheerModalHTML();
        
        let modalsContainer = document.getElementById('modalsContainer');
        modalsContainer.innerHTML = modalHTML;
        
        const modalElement = document.getElementById('dekReuenModal');
        const newModal = new bootstrap.Modal(modalElement);
        
        document.getElementById('addDekReuBtn')?.addEventListener('click', () => this.showAddDekReuModal());
        document.getElementById('backToChoiceBtn')?.addEventListener('click', () => this.showModal());
        
        await this.loadDekReuen(true);
        newModal.show();
    }
    
    /**
     * Toon modal om dek reu toe te voegen
     */
    async showAddDekReuModal() {
        try {
            console.log('Show add dek reu modal');
            
            const modalHTML = this.getAddEditModalHTML('add');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditDekReuModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditDekReuModal');
            const modal = new bootstrap.Modal(modalElement);
            
            this.editingDekReuId = null;
            this.editingDekReuData = null;
            
            this.resetHealthForm();
            
            await this.initTomSelect();
            
            // Haal email van huidige gebruiker op en vul het veld
            const userEmail = await this.getCurrentUserEmail();
            const emailField = document.getElementById('email');
            if (emailField && userEmail) {
                emailField.value = userEmail;
            } else if (emailField) {
                emailField.value = '';
            }
            
            document.getElementById('uploadDekReuPhotoBtn')?.addEventListener('click', () => this.uploadPhoto());
            document.getElementById('saveDekReuBtn')?.addEventListener('click', () => this.saveDekReu());
            
            const eyesSelect = document.getElementById('eyes');
            if (eyesSelect) {
                eyesSelect.addEventListener('change', (e) => {
                    const explanationContainer = document.getElementById('eyesExplanationContainer');
                    if (explanationContainer) {
                        explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                    }
                });
            }
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.selectedHondId = null;
                this.selectedHondStamboomnr = null;
                this.selectedHondNaam = null;
                this.selectedHondData = null;
                this.hondFotos = [];
                this.editingDekReuId = null;
                this.editingDekReuData = null;
            });
            
        } catch (error) {
            console.error('Fout:', error);
            alert('Fout bij laden honden: ' + error.message);
        }
    }
    
    /**
     * Toon modal om dek reu te bewerken
     */
    async showEditDekReuModal(dekreu) {
        try {
            console.log('Show edit dek reu modal', dekreu);
            
            this.editingDekReuId = dekreu.id;
            this.editingDekReuData = dekreu;
            this.selectedHondId = dekreu.hond_id;
            
            let dekReuData = dekreu;
            if (!dekReuData.hond) {
                dekReuData = await this.getDekReu(dekreu.id);
            }
            
            const modalHTML = this.getAddEditModalHTML('edit');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditDekReuModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditDekReuModal');
            const modal = new bootstrap.Modal(modalElement);
            
            await this.populateEditForm(dekReuData);
            document.getElementById('saveDekReuBtn')?.addEventListener('click', () => this.saveDekReu());
            const eyesSelect = document.getElementById('eyes');
            if (eyesSelect) {
                eyesSelect.addEventListener('change', (e) => {
                    const explanationContainer = document.getElementById('eyesExplanationContainer');
                    if (explanationContainer) {
                        explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                    }
                });
            }
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.selectedHondId = null;
                this.selectedHondStamboomnr = null;
                this.selectedHondNaam = null;
                this.selectedHondData = null;
                this.hondFotos = [];
                this.editingDekReuId = null;
                this.editingDekReuData = null;
            });
            
        } catch (error) {
            console.error('Fout bij tonen bewerk modal:', error);
            alert('Fout bij laden dek reu gegevens: ' + error.message);
        }
    }
    
    /**
     * Vul het bewerk formulier met bestaande data
     */
    async populateEditForm(dekreu) {
        try {
            if (dekreu.hond_id) {
                const tomSelect = await this.initTomSelect(dekreu.hond_id);
                
                const hond = dekreu.hond || await this.getHondById(dekreu.hond_id);
                if (hond && tomSelect) {
                    const optionData = {
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`
                    };
                    
                    tomSelect.addOption(optionData);
                    tomSelect.setValue(hond.id);
                }
            }
            
            const actiefCheck = document.getElementById('actiefCheck');
            if (actiefCheck) {
                actiefCheck.checked = dekreu.actief === true;
            }
            
            const beschrijvingField = document.getElementById('beschrijvingField');
            if (beschrijvingField) {
                beschrijvingField.value = dekreu.beschrijving || '';
            }
            
            if (dekreu.hond_id) {
                await this.loadHondFotos(dekreu.hond_id);
            }
            
            if (dekreu.hond) {
                this.selectedHondData = dekreu.hond;
                this.populateHealthForm(dekreu.hond);
                
                const countrySelect = document.getElementById('country');
                if (countrySelect && dekreu.hond.land) {
                    countrySelect.value = dekreu.hond.land;
                }
            } else if (dekreu.hond_id) {
                await this.loadDogHealthData(dekreu.hond_id);
                await this.loadDogCountry(dekreu.hond_id);
            }
            
            // Haal email op uit de dekreuen tabel
            const email = await this.getOwnerEmail(dekreu.id);
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.value = email || '';
            }
            
            const saveBtn = document.getElementById('saveDekReuBtn');
            if (saveBtn) {
                saveBtn.innerHTML = `<i class="bi bi-pencil-square"></i> ${this.t('edit')}`;
            }
            
            const modalTitle = document.querySelector('#addEditDekReuModal .modal-title');
            if (modalTitle) {
                modalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ${this.t('editDekReu')}`;
            }
            
            const uploadSection = document.getElementById('photoUploadSection');
            if (uploadSection) {
                uploadSection.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Fout bij vullen bewerk formulier:', error);
        }
    }
    
    /**
     * Haal hond op basis van ID
     */
    async getHondById(hondId) {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', hondId)
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Fout bij ophalen hond:', error);
            return null;
        }
    }
    
    getChoiceModalHTML() {
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-secondary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-gender-male"></i> ${this.t('dekReuen')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${this.t('chooseAction')}</h4>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-secondary hover-shadow" style="cursor: pointer;" id="viewOverviewBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-gender-male display-1 text-secondary mb-3"></i>
                                            <h5>${this.t('viewOverview')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="manageDekReuenBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-pencil-square display-1 text-success mb-3"></i>
                                            <h5>${this.t('manageDekReuen')}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getOverviewModalHTML() {
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-secondary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-gender-male"></i> ${this.t('dekReuenOverview')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="dekReuenContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-secondary"></div>
                                    <p class="mt-3 text-muted">${this.t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${this.t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getBeheerModalHTML() {
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-pencil-square"></i> ${this.t('dekReuenBeheer')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <button class="btn btn-success" id="addDekReuBtn">
                                    <i class="bi bi-plus-circle"></i> ${this.t('addDekReu')}
                                </button>
                            </div>
                            <div id="dekReuenBeheerContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-secondary"></div>
                                    <p class="mt-3 text-muted">${this.t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${this.t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Modal met gezondheidsitems ALTIJD zichtbaar
     */
    getAddEditModalHTML(mode = 'add') {
        const title = mode === 'add' ? this.t('addDekReu') : this.t('editDekReu');
        const icon = mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square';
        const saveButtonText = mode === 'add' ? this.t('save') : this.t('edit');
        const saveButtonIcon = mode === 'add' ? 'bi-check-circle' : 'bi-pencil-square';
        const hondSelectDisabled = mode === 'edit' ? 'disabled' : '';
        
        return `
            <div class="modal fade" id="addEditDekReuModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi ${icon}"></i> ${title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <!-- Linker kolom -->
                                <div class="col-md-6">
                                    <form id="dekReuForm">
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">${this.t('selectHond')} *</label>
                                            <select class="form-control" id="hondSelect" placeholder="${this.t('typeToSearch')}" ${hondSelectDisabled}>
                                                <option value="">${this.t('typeToSearch')}</option>
                                            </select>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De hond kan niet worden gewijzigd bij bewerken</small>' : ''}
                                            <small class="text-muted d-block mt-2">${this.t('searchHond')}</small>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">${this.t('status')}</label>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="actiefCheck" checked>
                                                <label class="form-check-label" for="actiefCheck">${this.t('active')}</label>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">${this.t('description')}</label>
                                            <textarea class="form-control" id="beschrijvingField" rows="2"></textarea>
                                        </div>
                                    </form>
                                </div>
                                
                                <!-- Rechter kolom: Foto's -->
                                <div class="col-md-6">
                                    <div class="card border-info" id="photoUploadSection" style="display: none;">
                                        <div class="card-header bg-info text-white">
                                            <i class="bi bi-camera"></i> ${this.t('photoSection')}
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="dekReuPhotoFile" class="form-label">${this.t('selectPhotoToUpload')}</label>
                                                <input class="form-control" type="file" id="dekReuPhotoFile" accept="image/*">
                                                <div class="form-text">${this.t('maxSize')}</div>
                                            </div>
                                            <button class="btn btn-info w-100 mb-3" id="uploadDekReuPhotoBtn">
                                                <i class="bi bi-cloud-upload"></i> ${this.t('uploadPhoto')}
                                            </button>
                                            
                                            <hr>
                                            
                                            <div id="hondFotosContainer">
                                                <div class="text-center py-4">
                                                    <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                                                    <p class="mt-2 text-muted">${this.t('noPhotos')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- GEZONDHEIDSINFORMATIE - ALTIJD ZICHTBAAR -->
                            <div class="row mt-4">
                                <div class="col-12">
                                    <div class="card border-warning">
                                        <div class="card-header bg-warning text-dark">
                                            <i class="bi bi-heart-pulse"></i> ${this.t('healthInfo')}
                                            <small class="ms-2">${this.t('healthInfoSub')}</small>
                                        </div>
                                        <div class="card-body">
                                            <div id="healthDataNote" class="mb-3"></div>
                                            
                                            <!-- Rij 1: HD en ED -->
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="hipDysplasia" class="form-label fw-semibold">${this.t('hipDysplasia')}</label>
                                                    <select class="form-select" id="hipDysplasia" required>
                                                        <option value="">${this.t('hipGrades')}</option>
                                                        <option value="A">${this.t('hipA')}</option>
                                                        <option value="B">${this.t('hipB')}</option>
                                                        <option value="C">${this.t('hipC')}</option>
                                                        <option value="D">${this.t('hipD')}</option>
                                                        <option value="E">${this.t('hipE')}</option>
                                                    </select>
                                                    <div id="hipError" class="invalid-feedback" style="display: none;"></div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="elbowDysplasia" class="form-label fw-semibold">${this.t('elbowDysplasia')}</label>
                                                    <select class="form-select" id="elbowDysplasia">
                                                        <option value="">${this.t('elbowGrades')}</option>
                                                        <option value="0">${this.t('elbow0')}</option>
                                                        <option value="1">${this.t('elbow1')}</option>
                                                        <option value="2">${this.t('elbow2')}</option>
                                                        <option value="3">${this.t('elbow3')}</option>
                                                        <option value="NB">${this.t('elbowNB')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <!-- Rij 2: Patella en Ogen -->
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="patellaLuxation" class="form-label fw-semibold">${this.t('patellaLuxation')}</label>
                                                    <select class="form-select" id="patellaLuxation">
                                                        <option value="">${this.t('patellaGrades')}</option>
                                                        <option value="0">${this.t('patella0')}</option>
                                                        <option value="1">${this.t('patella1')}</option>
                                                        <option value="2">${this.t('patella2')}</option>
                                                        <option value="3">${this.t('patella3')}</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="eyes" class="form-label fw-semibold">${this.t('eyes')}</label>
                                                    <select class="form-select" id="eyes">
                                                        <option value="">${this.t('choose')}</option>
                                                        <option value="Vrij">${this.t('eyesFree')}</option>
                                                        <option value="Distichiasis">${this.t('eyesDistichiasis')}</option>
                                                        <option value="Overig">${this.t('eyesOther')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <!-- Toelichting ogen - ALTIJD zichtbaar -->
                                            <div class="row mb-3" id="eyesExplanationContainer">
                                                <div class="col-12">
                                                    <label for="eyesExplanation" class="form-label fw-semibold">${this.t('eyesExplanation')}</label>
                                                    <input type="text" class="form-control" id="eyesExplanation" placeholder="Vul hier een toelichting in indien nodig">
                                                </div>
                                            </div>
                                            
                                            <!-- Rij 3: Dandy Walker en Schildklier -->
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="dandyWalker" class="form-label fw-semibold">${this.t('dandyWalker')} *</label>
                                                    <select class="form-select" id="dandyWalker" required>
                                                        <option value="">${this.t('dandyOptions')}</option>
                                                        <option value="Vrij op DNA">${this.t('dandyFreeDNA')}</option>
                                                        <option value="Vrij op ouders">${this.t('dandyFreeParents')}</option>
                                                        <option value="Drager">${this.t('dandyCarrier')}</option>
                                                        <option value="Lijder">${this.t('dandyAffected')}</option>
                                                    </select>
                                                    <div id="dandyError" class="invalid-feedback" style="display: none;"></div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="thyroid" class="form-label fw-semibold">${this.t('thyroid')} *</label>
                                                    <select class="form-select" id="thyroid" required>
                                                        <option value="">${this.t('choose')}</option>
                                                        <option value="Negatief">${this.t('thyroidNegative')}</option>
                                                        <option value="Positief">${this.t('thyroidPositive')}</option>
                                                    </select>
                                                    <div id="thyroidError" class="invalid-feedback" style="display: none;"></div>
                                                </div>
                                            </div>
                                            
                                            <!-- Toelichting schildklier - ALTIJD zichtbaar -->
                                            <div class="row mb-3">
                                                <div class="col-12">
                                                    <label for="thyroidExplanation" class="form-label fw-semibold">${this.t('thyroidExplanation')}</label>
                                                    <input type="text" class="form-control" id="thyroidExplanation" placeholder="Vul hier een toelichting in indien nodig">
                                                </div>
                                            </div>
                                            
                                            <!-- Rij 4: Land en Email -->
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <label for="country" class="form-label fw-semibold">${this.t('country')}</label>
                                                    <select class="form-select" id="country" required>
                                                        <option value="">${this.t('selectCountry')}</option>
                                                        <option value="Nederland">${this.t('netherlands')}</option>
                                                        <option value="België">${this.t('belgium')}</option>
                                                        <option value="Duitsland">${this.t('germany')}</option>
                                                        <option value="Frankrijk">${this.t('france')}</option>
                                                        <option value="Verenigd Koninkrijk">${this.t('uk')}</option>
                                                        <option value="Anders">${this.t('other')}</option>
                                                    </select>
                                                    <div id="countryError" class="invalid-feedback" style="display: none;"></div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="email" class="form-label fw-semibold">${this.t('email')}</label>
                                                    <input type="email" class="form-control" id="email" readonly disabled>
                                                </div>
                                            </div>
                                            
                                            <div class="alert alert-warning mb-0">
                                                <i class="bi bi-exclamation-triangle"></i>
                                                <strong>Velden met * zijn verplicht voor dek reuen.</strong> 
                                                Gezondheidsgegevens en land worden opgeslagen bij deze hond in het hondenbestand.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('cancel')}</button>
                            <button type="button" class="btn btn-success" id="saveDekReuBtn">
                                <i class="bi ${saveButtonIcon}"></i> ${saveButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Laad dek reuen met paginatie
     * Voor beheer (isBeheer=true) worden alleen de dek reuen getoond die door de huidige gebruiker zijn toegevoegd
     */
    async loadDekReuen(isBeheer = false, page = 1) {
        const containerId = isBeheer ? 'dekReuenBeheerContainer' : 'dekReuenContainer';
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            let query = supabase
                .from('dekreuen')
                .select('*, hond:honden(*)', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false });
            
            // Alleen filteren op toegevoegd_door voor beheerweergave
            if (isBeheer && user && !this.isAdmin) {
                query = query.eq('toegevoegd_door', user.id);
            }
            
            const { data, error, count } = await query.range(from, to);
            
            if (error) throw error;
            
            if (!data || data.length === 0) {
                container.innerHTML = `<div class="col-12 text-center py-5">
                    <i class="bi bi-gender-male display-1 text-muted"></i>
                    <p class="mt-3">${this.t('noDekReuen')}</p>
                </div>`;
                return;
            }
            
            if (isBeheer) {
                await this.renderBeheerList(data, container, count, page);
            } else {
                await this.renderOverviewList(data, container, count, page);
            }
            
        } catch (error) {
            console.error('Fout:', error);
            container.innerHTML = `<div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
                <p class="mt-3">${error.message}</p>
            </div>`;
        }
    }
    
    /**
     * Render overzichtslijst met COMPLETE gezondheidsgegevens
     */
    async renderOverviewList(dekreuen, container, total = 0, currentPage = 1) {
        const html = [];
        const t = this.t.bind(this);
        
        for (const dek of dekreuen) {
            const h = dek.hond || {};
            
            const fotos = await this.getHondFotos(h.id);
            const eersteFotos = fotos.slice(0, 3);
            
            // Haal email op uit de dekreuen tabel
            const email = await this.getOwnerEmail(dek.id);
            
            let fotosHTML = '';
            if (fotos.length > 0) {
                fotosHTML = `
                    <div class="mt-3">
                        <small class="text-muted d-block mb-2">${t('photos')}:</small>
                        <div class="d-flex flex-wrap gap-2">
                            ${eersteFotos.map(foto => `
                                <div class="dek-reu-foto-thumbnail" 
                                     style="width: 60px; height: 60px; cursor: pointer; border-radius: 4px; overflow: hidden; border: 1px solid #dee2e6;"
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${h.naam || ''}${h.kennelnaam ? ' (' + h.kennelnaam + ')' : ''}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto" 
                                         style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            `).join('')}
                            ${fotos.length > 3 ? `
                                <div class="d-flex align-items-center justify-content-center" 
                                     style="width: 60px; height: 60px; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">
                                    <span class="small text-muted">+${fotos.length - 3}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Gezondheidsgegevens - COMPLEET met alle velden
            const healthInfo = `
                <div class="mt-3 pt-2 border-top">
                    <strong class="d-block mb-2">${t('healthData')}:</strong>
                    <div class="row g-2 small">
                        <div class="col-6">
                            <span class="text-muted">${t('hd')}:</span> 
                            <span class="fw-semibold">${h.heupdysplasie || '-'}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-muted">${t('ed')}:</span> 
                            <span class="fw-semibold">${h.elleboogdysplasie || '-'}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-muted">${t('patella')}:</span> 
                            <span class="fw-semibold">${h.patella || '-'}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-muted">${t('eyes')}:</span> 
                            <span class="fw-semibold">${h.ogen || '-'}</span>
                        </div>
                        ${h.ogenverklaring ? `
                        <div class="col-12">
                            <span class="text-muted">${t('eyesExplanation')}:</span> 
                            <span class="fw-semibold">${h.ogenverklaring}</span>
                        </div>
                        ` : ''}
                        <div class="col-6">
                            <span class="text-muted">${t('dandyWalker')}:</span> 
                            <span class="fw-semibold">${h.dandyWalker || '-'}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-muted">${t('thyroid')}:</span> 
                            <span class="fw-semibold">${h.schildklier || '-'}</span>
                        </div>
                        ${h.schildklierverklaring ? `
                        <div class="col-12">
                            <span class="text-muted">${t('thyroidExplanation')}:</span> 
                            <span class="fw-semibold">${h.schildklierverklaring}</span>
                        </div>
                        ` : ''}
                        <div class="col-6">
                            <span class="text-muted">${t('country')}:</span> 
                            <span class="fw-semibold">${h.land || '-'}</span>
                        </div>
                        <div class="col-6">
                            <span class="text-muted">${t('email')}:</span> 
                            <span class="fw-semibold">${email || t('noEmail')}</span>
                        </div>
                    </div>
                </div>
            `;
            
            html.push(`
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${h.naam || 'Onbekend'}</h5>
                            <p class="card-text">
                                <small class="text-muted d-block">${h.kennelnaam ? h.kennelnaam : ''}</small>
                                <small class="text-muted d-block">Stamboeknr: ${h.stamboomnr || '-'}</small>
                                <small class="text-muted d-block">Ras: ${h.ras || '-'}</small>
                                ${dek.beschrijving ? `<br><span class="fst-italic">"${dek.beschrijving}"</span>` : ''}
                            </p>
                            
                            ${healthInfo}
                            
                            ${fotosHTML}
                            
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-primary view-pedigree" data-hond-id="${dek.hond_id}">
                                    <i class="bi bi-diagram-3"></i> ${t('viewPedigree')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, false);
        
        container.innerHTML = `
            <div class="row">${html.join('')}</div>
            ${paginationHTML}
        `;
        
        // Click handlers voor foto's met dynamisch laden van PhotoViewer
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam;
                    
                    // Laad PhotoViewer dynamisch
                    await this.ensurePhotoViewer();
                    
                    window.photoViewer.showPhoto(foto.data, hondNaam);
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
                    // Fallback
                    try {
                        const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                        window.open(foto.data, '_blank');
                    } catch (fallbackError) {
                        console.error('Ook fallback mislukt:', fallbackError);
                    }
                }
            });
        });
        
        container.querySelectorAll('.view-pedigree').forEach(btn => {
            btn.addEventListener('click', async () => {
                const hondId = btn.dataset.hondId;
                await this.viewPedigree(hondId);
            });
        });
        
        this.attachPaginationEvents(false);
    }
    
    async renderBeheerList(dekreuen, container, total = 0, currentPage = 1) {
        const { data: { user } } = await this.getSupabase().auth.getUser();
        const t = this.t.bind(this);
        
        const html = [];
        
        for (const dek of dekreuen) {
            const h = dek.hond || {};
            const canEdit = this.isAdmin || dek.toegevoegd_door === user?.id;
            
            // Haal email op uit de dekreuen tabel
            const email = await this.getOwnerEmail(dek.id);
            
            const fotos = await this.getHondFotos(h.id);
            const eersteFotos = fotos.slice(0, 3);
            
            let fotosHTML = '';
            if (fotos.length > 0) {
                fotosHTML = `
                    <div class="mt-2">
                        <div class="d-flex flex-wrap gap-1">
                            ${eersteFotos.map(foto => `
                                <div class="dek-reu-foto-thumbnail" 
                                     style="width: 40px; height: 40px; cursor: pointer; border-radius: 3px; overflow: hidden; border: 1px solid #dee2e6;"
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${h.naam || ''}${h.kennelnaam ? ' (' + h.kennelnaam + ')' : ''}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto" 
                                         style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            `).join('')}
                            ${fotos.length > 3 ? `
                                <div class="d-flex align-items-center justify-content-center" 
                                     style="width: 40px; height: 40px; background: #f8f9fa; border-radius: 3px; border: 1px solid #dee2e6;">
                                    <span class="small text-muted">+${fotos.length - 3}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            html.push(`
                <div class="col-12 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2">
                                    <h6 class="mb-0">${h.naam || 'Onbekend'}</h6>
                                    <small class="text-muted d-block">${h.kennelnaam ? h.kennelnaam : ''}</small>
                                    <small class="text-muted">${h.stamboomnr || '-'}</small>
                                    ${fotosHTML}
                                </div>
                                <div class="col-md-1">
                                    <span class="badge ${dek.actief ? 'bg-success' : 'bg-secondary'}">
                                        ${dek.actief ? t('active') : t('inactive')}
                                    </span>
                                </div>
                                <div class="col-md-3 small">
                                    <span class="d-block"><span class="text-muted">${t('hd')}:</span> ${h.heupdysplasie || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('ed')}:</span> ${h.elleboogdysplasie || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('patella')}:</span> ${h.patella || '-'}</span>
                                </div>
                                <div class="col-md-3 small">
                                    <span class="d-block"><span class="text-muted">${t('eyes')}:</span> ${h.ogen || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('dandyWalker')}:</span> ${h.dandyWalker || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('thyroid')}:</span> ${h.schildklier || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('country')}:</span> ${h.land || '-'}</span>
                                    <span class="d-block"><span class="text-muted">${t('email')}:</span> ${email || t('noEmail')}</span>
                                </div>
                                <div class="col-md-3 text-end">
                                    ${canEdit ? `
                                        <button class="btn btn-sm btn-outline-primary edit-dekreu mb-1 w-100" 
                                            data-dekreu='${JSON.stringify(dek).replace(/'/g, '&apos;')}'>
                                            <i class="bi bi-pencil"></i> ${t('edit')}
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-dekreu w-100" data-id="${dek.id}">
                                            <i class="bi bi-trash"></i> ${t('delete')}
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            ${h.ogenverklaring ? `
                            <div class="row mt-2">
                                <div class="col-12 small">
                                    <span class="text-muted">${t('eyesExplanation')}:</span> ${h.ogenverklaring}
                                </div>
                            </div>
                            ` : ''}
                            ${h.schildklierverklaring ? `
                            <div class="row mt-1">
                                <div class="col-12 small">
                                    <span class="text-muted">${t('thyroidExplanation')}:</span> ${h.schildklierverklaring}
                                </div>
                            </div>
                            ` : ''}
                            ${dek.beschrijving ? `
                            <div class="row mt-2">
                                <div class="col-12 small">
                                    <span class="text-muted">${t('description')}:</span> ${dek.beschrijving}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `);
        }
        
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, true);
        
        container.innerHTML = `
            <div class="row">${html.join('')}</div>
            ${paginationHTML}
        `;
        
        // Click handlers voor foto's met dynamisch laden van PhotoViewer
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam;
                    
                    // Laad PhotoViewer dynamisch
                    await this.ensurePhotoViewer();
                    
                    window.photoViewer.showPhoto(foto.data, hondNaam);
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
                    // Fallback
                    try {
                        const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                        window.open(foto.data, '_blank');
                    } catch (fallbackError) {
                        console.error('Ook fallback mislukt:', fallbackError);
                    }
                }
            });
        });
        
        container.querySelectorAll('.edit-dekreu').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const dekreu = JSON.parse(btn.dataset.dekreu.replace(/&apos;/g, "'"));
                    this.showEditDekReuModal(dekreu);
                } catch (e) {
                    console.error(e);
                }
            });
        });
        
        container.querySelectorAll('.delete-dekreu').forEach(btn => {
            btn.addEventListener('click', () => this.deleteDekReu(btn.dataset.id));
        });
        
        this.attachPaginationEvents(true);
    }
    
    getPaginationHTML(total, currentPage, totalPages, isBeheer) {
        if (totalPages <= 1) return '';
        
        const start = ((currentPage - 1) * this.pageSize) + 1;
        const end = Math.min(currentPage * this.pageSize, total);
        
        return `
            <div class="row mt-4">
                <div class="col-12">
                    <nav aria-label="Paginatie">
                        <ul class="pagination justify-content-center">
                            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                <a class="page-link dek-reuen-pagination" href="#" data-page="${currentPage - 1}" data-beheer="${isBeheer}">
                                    ${this.t('prevPage')}
                                </a>
                            </li>
                            
                            ${this.generatePageNumbers(currentPage, totalPages).map(page => `
                                <li class="page-item ${page === currentPage ? 'active' : ''}">
                                    <a class="page-link dek-reuen-pagination" href="#" data-page="${page}" data-beheer="${isBeheer}">
                                        ${page}
                                    </a>
                                </li>
                            `).join('')}
                            
                            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                <a class="page-link dek-reuen-pagination" href="#" data-page="${currentPage + 1}" data-beheer="${isBeheer}">
                                    ${this.t('nextPage')}
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <p class="text-center text-muted small mt-2">
                        ${this.t('showingResults').replace('{start}', start).replace('{end}', end).replace('{total}', total)}
                    </p>
                </div>
            </div>
        `;
    }
    
    generatePageNumbers(currentPage, totalPages) {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    }
    
    attachPaginationEvents(isBeheer) {
        document.querySelectorAll('.dek-reuen-pagination').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                const beheer = e.target.dataset.beheer === 'true';
                
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.loadDekReuen(beheer, page);
                }
            });
        });
    }
    
    /**
     * Opslaan met gezondheidsgegevens en terugschrijven naar honden tabel
     */
    async saveDekReu() {
        try {
            const selectElement = document.getElementById('hondSelect');
            let hondId = null;
            
            if (selectElement.tomselect) {
                hondId = selectElement.tomselect.getValue();
            } else {
                hondId = selectElement.value;
            }
            
            if (!hondId && !this.editingDekReuId) {
                alert('Selecteer een hond');
                return;
            }
            
            if (!this.validateHealthFields()) {
                alert('Vul alle verplichte velden in (HD, Dandy Walker, Schildklier en Land)');
                return;
            }
            
            const { data: { user } } = await this.getSupabase().auth.getUser();
            
            const healthData = {
                heupdysplasie: document.getElementById('hipDysplasia').value || null,
                elleboogdysplasie: document.getElementById('elbowDysplasia').value || null,
                patella: document.getElementById('patellaLuxation').value || null,
                ogen: document.getElementById('eyes').value || null,
                ogenverklaring: document.getElementById('eyesExplanation')?.value || null,
                dandyWalker: document.getElementById('dandyWalker').value || null,
                schildklier: document.getElementById('thyroid').value || null,
                schildklierverklaring: document.getElementById('thyroidExplanation')?.value || null,
                land: document.getElementById('country').value || null
            };
            
            if (this.editingDekReuId) {
                const updateData = {
                    actief: document.getElementById('actiefCheck').checked,
                    beschrijving: document.getElementById('beschrijvingField').value || null
                };
                
                const { error } = await this.getSupabase()
                    .from('dekreuen')
                    .update(updateData)
                    .eq('id', this.editingDekReuId);
                
                if (error) throw error;
                
                if (this.selectedHondId) {
                    const { error: healthError } = await this.getSupabase()
                        .from('honden')
                        .update(healthData)
                        .eq('id', this.selectedHondId);
                    
                    if (healthError) {
                        console.warn('Kon gezondheidsgegevens niet bijwerken:', healthError);
                    } else {
                        console.log('✅ Gezondheidsgegevens bijgewerkt in honden tabel');
                    }
                }
                
                alert('Dek reu bijgewerkt!');
                
            } else {
                // Haal email van huidige gebruiker op uit profiles (voor de zekerheid nog een keer, maar staat al in veld)
                const userEmail = await this.getCurrentUserEmail();
                
                const { error } = await this.getSupabase()
                    .from('dekreuen')
                    .insert({
                        hond_id: parseInt(hondId),
                        toegevoegd_door: user.id,
                        email: userEmail,
                        actief: document.getElementById('actiefCheck').checked,
                        beschrijving: document.getElementById('beschrijvingField').value || null
                    });
                
                if (error) {
                    if (error.code === '23505') {
                        alert('Deze hond is al een dek reu');
                    } else {
                        throw error;
                    }
                    return;
                }
                
                if (hondId) {
                    const { error: healthError } = await this.getSupabase()
                        .from('honden')
                        .update(healthData)
                        .eq('id', hondId);
                    
                    if (healthError) {
                        console.warn('Kon gezondheidsgegevens niet bijwerken:', healthError);
                    } else {
                        console.log('✅ Gezondheidsgegevens bijgewerkt in honden tabel');
                    }
                }
                
                alert('Dek reu toegevoegd!');
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEditDekReuModal'));
            if (modal) modal.hide();
            
            this.currentPage = 1;
            
            if (this.currentView === 'beheer') {
                await this.loadDekReuen(true, 1);
            } else {
                await this.loadDekReuen(false, 1);
            }
            
        } catch (error) {
            console.error(error);
            alert('Fout: ' + error.message);
        }
    }
    
    async deleteDekReu(id) {
        if (!confirm(this.t('confirmDelete'))) return;
        
        try {
            const { error } = await this.getSupabase()
                .from('dekreuen')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            alert('Verwijderd!');
            
            if (this.currentView === 'beheer') {
                await this.loadDekReuen(true, this.currentPage);
            }
            
        } catch (error) {
            console.error(error);
            alert('Fout: ' + error.message);
        }
    }
    
    /**
     * Toon stamboom voor een hond
     */
    async viewPedigree(hondId) {
        console.log('📊 Stamboom openen voor hond ID:', hondId);
        
        if (!hondId) {
            console.error('❌ Geen hond ID opgegeven');
            alert('Kan stamboom niet openen: geen hond geselecteerd');
            return;
        }
        
        let stamboomManager = null;
        
        if (window.stamboomManager) {
            stamboomManager = window.stamboomManager;
        } else if (window.pedigreeManager) {
            stamboomManager = window.pedigreeManager;
        } else if (window.StamboomManager && window.StamboomManager.instance) {
            stamboomManager = window.StamboomManager.instance;
        } else if (window.StamboomManager) {
            try {
                stamboomManager = new window.StamboomManager(window.hondenService);
                window.stamboomManager = stamboomManager;
            } catch (e) {
                console.error('❌ Kon geen StamboomManager instantie maken:', e);
            }
        }
        
        if (!stamboomManager) {
            console.error('❌ Geen StamboomManager gevonden');
            alert('Stamboom module is niet beschikbaar. Probeer de pagina te verversen.');
            return;
        }
        
        try {
            if (stamboomManager.initialize && typeof stamboomManager.initialize === 'function') {
                await stamboomManager.initialize();
            }
        } catch (initError) {
            console.error('❌ Fout bij initialiseren StamboomManager:', initError);
        }
        
        let hond = null;
        
        if (stamboomManager.getDogById && typeof stamboomManager.getDogById === 'function') {
            hond = stamboomManager.getDogById(parseInt(hondId));
        }
        
        if (hond) {
            if (stamboomManager.showPedigree && typeof stamboomManager.showPedigree === 'function') {
                await stamboomManager.showPedigree(hond);
                return;
            } else if (stamboomManager.showStamboom && typeof stamboomManager.showStamboom === 'function') {
                await stamboomManager.showStamboom(hond);
                return;
            }
        }
        
        try {
            const supabase = this.getSupabase();
            const { data: hondData, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', hondId)
                .single();
            
            if (error) throw error;
            
            if (hondData && stamboomManager.showPedigree) {
                await stamboomManager.showPedigree(hondData);
            } else {
                alert('Stamboom kan niet worden getoond');
            }
        } catch (dbError) {
            console.error('❌ Kon hond niet ophalen uit database:', dbError);
            alert('Kon hondgegevens niet laden voor stamboom');
        }
    }
    
    fixModalClose() {
        const modal = document.getElementById('dekReuenModal');
        if (!modal) return;
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }
    
    showProgress(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-info';
            alertDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    ${message}
                </div>
            `;
            container.prepend(alertDiv);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 10000);
        }
    }
    
    hideProgress() {
        document.querySelectorAll('.alert-info .spinner-border').forEach(spinner => {
            const alert = spinner.closest('.alert');
            if (alert) alert.remove();
        });
    }
    
    showError(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <i class="bi bi-exclamation-triangle"></i> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                container.prepend(alertDiv);
                
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }
        }
    }
    
    showSuccess(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <i class="bi bi-check-circle"></i> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                container.prepend(alertDiv);
                
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }
        }
    }
}

// Maak instance aan
const DekReuenManagerInstance = new DekReuenManager();

// Zet globaal
window.DekReuenManager = DekReuenManagerInstance;
window.dekReuenManager = DekReuenManagerInstance;

console.log('📦 DekReuenManager geladen met COMPLETE GEZONDHEIDSINFO in overzicht en DUIDELIJKE BENAMINGEN');