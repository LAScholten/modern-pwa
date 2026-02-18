// js/modules/NestAankondigingen.js

/**
 * NestAankondigingen Management Module voor Supabase
 * Beheert nest aankondigingen overzicht en beheer
 * MET GEZONDHEIDSINFO VAN BEIDE OUDERS IN OVERZICHT (zelfde als DekReuen)
 * Ouders naast elkaar met gezondheidsinfo in exact de gewenste indeling
 * 
 * UPDATE: Toont 1 aankondiging per pagina met paginatie bovenaan
 * UPDATE 2: Tekst in cards kleiner gemaakt (70% van origineel)
 * UPDATE 3: Paginatiebalkje 80% van originele grootte
 * UPDATE 4: Aparte nestfoto's met eigen modal (max 15, 1 per keer met paginatie)
 * UPDATE 5: Opmerkingen bij nestfoto's mogelijk
 */

class NestAankondigingenManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.userRole = localStorage.getItem('userRole') || 'gebruiker';
        this.isAdmin = this.userRole === 'admin';
        this.isUser = this.userRole === 'gebruiker';
        this.isUserPlus = this.userRole === 'gebruiker+';
        this.currentView = 'overview';
        
        // Paginatie variabelen - 1 item per pagina
        this.currentPage = 1;
        this.pageSize = 1;
        this.totalAnnouncements = 0;
        
        // Voor autocomplete van honden
        this.allDogs = [];
        this.db = window.hondenService;
        this.auth = window.auth;
        this.supabase = null;
        
        // Bewerken variabelen
        this.editingAnnouncementId = null;
        this.editingAnnouncementData = null;
        
        // Foto gerelateerde variabelen - voor nestfoto's
        this.selectedNestId = null;
        this.selectedNestKennelnaam = null;
        this.nestFotos = [];
        
        // Voor de fotogalerij modal
        this.currentFotoIndex = 0;
        this.currentNestFotos = [];
        
        // Voor het bewerken van een specifieke foto
        this.editingFotoId = null;
        this.editingFotoData = null;
        
        this.translations = {
            nl: {
                nestAnnouncements: "Nest aankondigingen",
                nestAnnouncementsBeheer: "Nest aankondigingen Beheer",
                nestAnnouncementsOverview: "Nest aankondigingen Overzicht",
                chooseAction: "Kies een actie:",
                viewOverview: "Nest aankondigingen Bekijken",
                manageAnnouncements: "Nest aankondigingen Beheren",
                close: "Sluiten",
                noAnnouncements: "Er zijn nog geen nest aankondigingen",
                loading: "Nest aankondigingen laden...",
                loadFailed: "Laden mislukt: ",
                addAnnouncement: "Nest Aankondiging Toevoegen",
                editAnnouncement: "Nest Aankondiging Bewerken",
                father: "Vader (Reu) *",
                mother: "Moeder (Teef) *",
                kennelName: "Kennelnaam *",
                kennelNamePlaceholder: "Naam van uw kennel",
                description: "Beschrijving",
                email: "Email (voor contact)",
                save: "Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                confirmDelete: "Weet je zeker dat je deze nest aankondiging wilt verwijderen?",
                parentNotSelected: "Selecteer een geldige hond uit de lijst",
                announcementAdded: "Nest aankondiging succesvol toegevoegd!",
                announcementUpdated: "Nest aankondiging succesvol bijgewerkt!",
                announcementAddFailed: "Fout bij toevoegen: ",
                announcementUpdateFailed: "Fout bij bijwerken: ",
                announcementDeleteFailed: "Fout bij verwijderen: ",
                searchDogs: "Begin met typen om te zoeken...",
                from: "Van",
                date: "Datum",
                noDescription: "Geen beschrijving",
                fatherInfo: "Vader",
                motherInfo: "Moeder",
                back: "Terug",
                noPermission: "Je hebt geen rechten om deze actie uit te voeren",
                announcementFrom: "Aankondiging van",
                
                // Gezondheidsitems
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
                country: "Land",
                free: "Vrij",
                
                // Foto's - ouders
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                viewPhoto: "Bekijk foto",
                
                // Nestfoto's - nieuw
                nestPhotos: "Nestfoto's",
                viewNestPhotos: "Bekijk nestfoto's",
                noNestPhotos: "Geen nestfoto's beschikbaar",
                uploadNestPhoto: "Nestfoto uploaden",
                selectNestPhoto: "Selecteer nestfoto",
                nestPhotoUploaded: "Nestfoto geüpload op",
                selectNestPhotoToUpload: "Selecteer een nestfoto om te uploaden",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF, WebP",
                fileTooLarge: "Bestand is te groot (maximaal 5MB)",
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan",
                uploading: "Nestfoto uploaden...",
                uploadSuccess: "Nestfoto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                deleteNestPhoto: "Verwijder nestfoto",
                confirmDeleteNestPhoto: "Weet je zeker dat je deze nestfoto wilt verwijderen?",
                nestPhotoDeleteSuccess: "Nestfoto succesvol verwijderd!",
                nestPhotoDeleteFailed: "Verwijderen nestfoto mislukt: ",
                maxPhotosReached: "Maximum aantal foto's (15) bereikt. Verwijder eerst een foto om een nieuwe toe te voegen.",
                photoCounter: "Foto {current} van {total}",
                previous: "Vorige",
                next: "Volgende",
                
                // NIEUW: Opmerkingen bij nestfoto's
                remark: "Opmerking",
                addRemark: "Opmerking toevoegen",
                editRemark: "Opmerking bewerken",
                saveRemark: "Opmerking opslaan",
                noRemark: "Geen opmerking",
                clickToAddRemark: "Klik om opmerking toe te voegen",
                remarkSaved: "Opmerking succesvol opgeslagen!",
                remarkSaveFailed: "Fout bij opslaan opmerking: ",
                
                // Paginatie
                prevPage: "Vorige",
                nextPage: "Volgende",
                pageInfo: "Pagina {page} van {totalPages}",
                showingResults: "Aankondiging {start} van {total}"
            },
            en: {
                nestAnnouncements: "Nest Announcements",
                nestAnnouncementsBeheer: "Nest Announcements Management",
                nestAnnouncementsOverview: "Nest Announcements Overview",
                chooseAction: "Choose an action:",
                viewOverview: "View Nest Announcements",
                manageAnnouncements: "Manage Nest Announcements",
                close: "Close",
                noAnnouncements: "No nest announcements yet",
                loading: "Loading nest announcements...",
                loadFailed: "Loading failed: ",
                addAnnouncement: "Add Nest Announcement",
                editAnnouncement: "Edit Nest Announcement",
                father: "Father (Male) *",
                mother: "Mother (Female) *",
                kennelName: "Kennel name *",
                kennelNamePlaceholder: "Your kennel name",
                description: "Description",
                email: "Email (for contact)",
                save: "Save",
                cancel: "Cancel",
                delete: "Delete",
                confirmDelete: "Are you sure you want to delete this nest announcement?",
                parentNotSelected: "Select a valid dog from the list",
                announcementAdded: "Nest announcement added successfully!",
                announcementUpdated: "Nest announcement updated successfully!",
                announcementAddFailed: "Error adding: ",
                announcementUpdateFailed: "Error updating: ",
                announcementDeleteFailed: "Error deleting: ",
                searchDogs: "Start typing to search...",
                from: "From",
                date: "Date",
                noDescription: "No description",
                fatherInfo: "Father",
                motherInfo: "Mother",
                back: "Back",
                noPermission: "You don't have permission to perform this action",
                announcementFrom: "Announcement from",
                
                // Health items
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
                country: "Country",
                free: "Free",
                
                // Photos - parents
                photos: "Photos",
                noPhotos: "No photos available",
                viewPhoto: "View photo",
                
                // Nest photos - new
                nestPhotos: "Nest Photos",
                viewNestPhotos: "View nest photos",
                noNestPhotos: "No nest photos available",
                uploadNestPhoto: "Upload nest photo",
                selectNestPhoto: "Select nest photo",
                nestPhotoUploaded: "Nest photo uploaded on",
                selectNestPhotoToUpload: "Select a nest photo to upload",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF, WebP",
                fileTooLarge: "File is too large (maximum 5MB)",
                invalidType: "Invalid file type. Only JPG, PNG, GIF and WebP are allowed",
                uploading: "Uploading nest photo...",
                uploadSuccess: "Nest photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                deleteNestPhoto: "Delete nest photo",
                confirmDeleteNestPhoto: "Are you sure you want to delete this nest photo?",
                nestPhotoDeleteSuccess: "Nest photo deleted successfully!",
                nestPhotoDeleteFailed: "Delete nest photo failed: ",
                maxPhotosReached: "Maximum number of photos (15) reached. Delete a photo first to add a new one.",
                photoCounter: "Photo {current} of {total}",
                previous: "Previous",
                next: "Next",
                
                // NEW: Remarks for nest photos
                remark: "Remark",
                addRemark: "Add remark",
                editRemark: "Edit remark",
                saveRemark: "Save remark",
                noRemark: "No remark",
                clickToAddRemark: "Click to add remark",
                remarkSaved: "Remark saved successfully!",
                remarkSaveFailed: "Failed to save remark: ",
                
                // Pagination
                prevPage: "Previous",
                nextPage: "Next",
                pageInfo: "Page {page} of {totalPages}",
                showingResults: "Announcement {start} of {total}"
            },
            de: {
                nestAnnouncements: "Wurfankündigungen",
                nestAnnouncementsBeheer: "Wurfankündigungen Verwaltung",
                nestAnnouncementsOverview: "Wurfankündigungen Übersicht",
                chooseAction: "Wählen Sie eine Aktion:",
                viewOverview: "Wurfankündigungen Ansehen",
                manageAnnouncements: "Wurfankündigungen Verwalten",
                close: "Schließen",
                noAnnouncements: "Noch keine Wurfankündigungen",
                loading: "Wurfankündigungen laden...",
                loadFailed: "Laden fehlgeschlagen: ",
                addAnnouncement: "Wurfankündigung Hinzufügen",
                editAnnouncement: "Wurfankündigung Bearbeiten",
                father: "Vater (Rüde) *",
                mother: "Mutter (Hündin) *",
                kennelName: "Zwinger name *",
                kennelNamePlaceholder: "Ihr Zwinger name",
                description: "Beschreibung",
                email: "Email (für Kontakt)",
                save: "Speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                confirmDelete: "Sind Sie sicher, dass Sie diese Wurfankündigung löschen möchten?",
                parentNotSelected: "Wählen Sie einen gültigen Hund aus der Liste",
                announcementAdded: "Wurfankündigung erfolgreich hinzugefügt!",
                announcementUpdated: "Wurfankündigung erfolgreich aktualisiert!",
                announcementAddFailed: "Fehler beim Hinzufügen: ",
                announcementUpdateFailed: "Fehler beim Aktualisieren: ",
                announcementDeleteFailed: "Fehler beim Löschen: ",
                searchDogs: "Beginnen Sie mit der Eingabe...",
                from: "Von",
                date: "Datum",
                noDescription: "Keine Beschreibung",
                fatherInfo: "Vater",
                motherInfo: "Mutter",
                back: "Zurück",
                noPermission: "Sie haben keine Berechtigung für diese Aktion",
                announcementFrom: "Ankündigung von",
                
                // Health items
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
                country: "Land",
                free: "Frei",
                
                // Photos - parents
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                viewPhoto: "Foto ansehen",
                
                // Nest photos - new
                nestPhotos: "Wurffotos",
                viewNestPhotos: "Wurffotos ansehen",
                noNestPhotos: "Keine Wurffotos verfügbar",
                uploadNestPhoto: "Wurffoto hochladen",
                selectNestPhoto: "Wurffoto auswählen",
                nestPhotoUploaded: "Wurffoto hochgeladen am",
                selectNestPhotoToUpload: "Wählen Sie ein Wurffoto zum Hochladen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF, WebP",
                fileTooLarge: "Datei ist zu groß (maximal 5MB)",
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG, GIF und WebP sind erlaubt",
                uploading: "Wurffoto wird hochgeladen...",
                uploadSuccess: "Wurffoto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                deleteNestPhoto: "Wurffoto löschen",
                confirmDeleteNestPhoto: "Sind Sie sicher, dass Sie dieses Wurffoto löschen möchten?",
                nestPhotoDeleteSuccess: "Wurffoto erfolgreich gelöscht!",
                nestPhotoDeleteFailed: "Löschen fehlgeschlagen: ",
                maxPhotosReached: "Maximale Anzahl Fotos (15) erreicht. Löschen Sie zuerst ein Foto, um ein neues hinzuzufügen.",
                photoCounter: "Foto {current} von {total}",
                previous: "Vorherige",
                next: "Nächste",
                
                // NEW: Bemerkungen für Wurffotos
                remark: "Bemerkung",
                addRemark: "Bemerkung hinzufügen",
                editRemark: "Bemerkung bearbeiten",
                saveRemark: "Bemerkung speichern",
                noRemark: "Keine Bemerkung",
                clickToAddRemark: "Klicken um Bemerkung hinzuzufügen",
                remarkSaved: "Bemerkung erfolgreich gespeichert!",
                remarkSaveFailed: "Fehler beim Speichern: ",
                
                // Pagination
                prevPage: "Vorherige",
                nextPage: "Nächste",
                pageInfo: "Seite {page} von {totalPages}",
                showingResults: "Ankündigung {start} von {total}"
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
     * Haal foto's op voor een specifieke hond (ouders)
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
            
            const { data: fotos, error } = await supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', hondData.stamboomnr)
                .order('uploaded_at', { ascending: false });
            
            if (error) {
                console.error('❌ Fout bij ophalen foto\'s:', error);
                return [];
            }
            
            return fotos || [];
            
        } catch (error) {
            console.error('❌ Fout bij ophalen foto\'s:', error);
            return [];
        }
    }
    
    /**
     * NIEUW: Haal nestfoto's op voor een specifiek nest
     */
    async getNestFotos(nestId) {
        try {
            if (!nestId) return [];
            
            const supabase = this.getSupabase();
            if (!supabase) return [];
            
            const { data: fotos, error } = await supabase
                .from('nest_fotos')
                .select('*')
                .eq('nest_id', nestId)
                .order('uploaded_at', { ascending: true }); // Oplopend voor chronologische volgorde
            
            if (error) {
                console.error('❌ Fout bij ophalen nestfoto\'s:', error);
                return [];
            }
            
            return fotos || [];
            
        } catch (error) {
            console.error('❌ Fout bij ophalen nestfoto\'s:', error);
            return [];
        }
    }
    
    /**
     * NIEUW: Upload nestfoto voor geselecteerd nest
     */
    async uploadNestPhoto(remark = '') {
        const t = this.t.bind(this);
        
        if (!this.selectedNestId) {
            this.showError('Selecteer eerst een nest', 'nestFotosContainer');
            return;
        }
        
        // Controleer of er al 15 foto's zijn
        if (this.nestFotos.length >= 15) {
            this.showError(t('maxPhotosReached'), 'nestFotosContainer');
            return;
        }
        
        const fileInput = document.getElementById('nestPhotoFile');
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectNestPhoto'), 'nestFotosContainer');
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError(t('fileTooLarge'), 'nestFotosContainer');
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError(t('invalidType'), 'nestFotosContainer');
            return;
        }
        
        this.showProgress(t('uploading'), 'nestFotosContainer');
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const user = this.currentUser || (await this.getSupabase().auth.getUser()).data.user;
                if (!user || !user.id) {
                    throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
                }
                
                const base64Data = e.target.result;
                
                // Maak thumbnail (optioneel, voor overzicht)
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
                    nest_id: this.selectedNestId,
                    data: base64Data,
                    thumbnail: thumbnail,
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    uploaded_at: new Date().toISOString(),
                    geupload_door: user.id,
                    opmerking: remark || null // NIEUW: opslaan van opmerking
                };
                
                const { data: dbData, error: dbError } = await this.getSupabase()
                    .from('nest_fotos')
                    .insert(fotoData)
                    .select()
                    .single();
                
                if (dbError) {
                    console.error('Database insert error:', dbError);
                    throw dbError;
                }
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'), 'nestFotosContainer');
                
                fileInput.value = '';
                
                // Herlaad de nestfoto's
                await this.loadNestFotos(this.selectedNestId);
                
            } catch (error) {
                console.error('Upload error:', error);
                this.hideProgress();
                this.showError(`${t('uploadFailed')}${error.message}`, 'nestFotosContainer');
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'), 'nestFotosContainer');
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * NIEUW: Update opmerking bij een nestfoto
     */
    async updateNestPhotoRemark(fotoId, remark) {
        const t = this.t.bind(this);
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) throw new Error('Geen database verbinding');
            
            const { error } = await supabase
                .from('nest_fotos')
                .update({ opmerking: remark || null })
                .eq('id', fotoId);
            
            if (error) throw error;
            
            this.showSuccess(t('remarkSaved'), 'nestFotosContainer');
            
            // Herlaad de nestfoto's om de bijgewerkte opmerking te tonen
            if (this.selectedNestId) {
                await this.loadNestFotos(this.selectedNestId);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Fout bij bijwerken opmerking:', error);
            this.showError(`${t('remarkSaveFailed')}${error.message}`, 'nestFotosContainer');
            return false;
        }
    }
    
    /**
     * NIEUW: Verwijder een nestfoto
     */
    async deleteNestPhoto(fotoId, fotoElement) {
        const t = this.t.bind(this);
        
        if (!confirm(t('confirmDeleteNestPhoto'))) return;
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) throw new Error('Geen database verbinding');
            
            const { error } = await supabase
                .from('nest_fotos')
                .delete()
                .eq('id', fotoId);
            
            if (error) throw error;
            
            if (fotoElement) {
                fotoElement.remove();
            }
            
            this.showSuccess(t('nestPhotoDeleteSuccess'), 'nestFotosContainer');
            
            if (this.selectedNestId) {
                await this.loadNestFotos(this.selectedNestId);
            }
            
        } catch (error) {
            console.error('❌ Fout bij verwijderen nestfoto:', error);
            this.showError(`${t('nestPhotoDeleteFailed')}${error.message}`, 'nestFotosContainer');
        }
    }
    
    /**
     * NIEUW: Toon modal voor het bewerken van een opmerking
     */
    showRemarkModal(fotoId, currentRemark) {
        const t = this.t.bind(this);
        
        // Modal HTML
        const modalHTML = `
            <div class="modal fade" id="editRemarkModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-chat-dots"></i> ${t('editRemark')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="remarkText" class="form-label">${t('remark')}</label>
                                <textarea class="form-control" id="remarkText" rows="4">${currentRemark || ''}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
                            <button type="button" class="btn btn-info text-white" id="saveRemarkBtn">
                                <i class="bi bi-check-circle"></i> ${t('saveRemark')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Voeg modal toe aan DOM
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        // Verwijder bestaande remark modal
        const existingModal = document.getElementById('editRemarkModal');
        if (existingModal) existingModal.remove();
        
        modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listener voor opslaan
        document.getElementById('saveRemarkBtn')?.addEventListener('click', async () => {
            const newRemark = document.getElementById('remarkText')?.value;
            await this.updateNestPhotoRemark(fotoId, newRemark);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('editRemarkModal'));
            if (modal) modal.hide();
        });
        
        // Toon modal
        const modalElement = document.getElementById('editRemarkModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Cleanup bij sluiten
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    /**
     * NIEUW: Laad en toon nestfoto's voor geselecteerd nest
     */
    async loadNestFotos(nestId) {
        if (!nestId) return;
        
        this.selectedNestId = nestId;
        this.nestFotos = await this.getNestFotos(nestId);
        
        await this.displayNestFotos();
    }
    
    /**
     * NIEUW: Toon nestfoto's in de container met verwijderknop, opmerking en uploadmogelijkheid
     */
    async displayNestFotos() {
        const container = document.getElementById('nestFotosContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        // Upload sectie bovenaan
        let html = `
            <div class="mb-3">
                <label for="nestPhotoFile" class="form-label">${t('selectNestPhotoToUpload')} (max 15)</label>
                <input class="form-control" type="file" id="nestPhotoFile" accept="image/*">
                <div class="form-text">${t('maxSize')}</div>
            </div>
            <div class="mb-3">
                <label for="uploadRemark" class="form-label">${t('remark')} (optioneel)</label>
                <textarea class="form-control" id="uploadRemark" rows="2" placeholder="${t('clickToAddRemark')}"></textarea>
            </div>
            <button class="btn btn-info w-100 mb-3" id="uploadNestPhotoBtn">
                <i class="bi bi-cloud-upload"></i> ${t('uploadNestPhoto')}
            </button>
            <hr>
        `;
        
        // Foto teller
        html += `<p class="text-muted">${this.nestFotos.length}/15 ${t('nestPhotos')}</p>`;
        
        if (!this.nestFotos || this.nestFotos.length === 0) {
            html += `
                <div class="text-center py-4">
                    <i class="bi bi-images text-muted" style="font-size: 2rem;"></i>
                    <p class="mt-2 text-muted">${t('noNestPhotos')}</p>
                </div>
            `;
        } else {
            html += '<div class="row">';
            
            for (const foto of this.nestFotos) {
                // Formatteer datum
                const uploadDate = foto.uploaded_at ? new Date(foto.uploaded_at).toLocaleDateString() : 'Onbekend';
                
                html += `
                    <div class="col-md-6 col-lg-4 mb-3" id="nest-foto-${foto.id}">
                        <div class="card h-100">
                            <div class="position-relative">
                                <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 delete-nest-photo-btn" 
                                        data-foto-id="${foto.id}"
                                        style="z-index: 10; border-radius: 50%; width: 32px; height: 32px; padding: 0;"
                                        title="${t('deleteNestPhoto')}">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <div class="card-img-top nest-foto-thumbnail" 
                                     style="height: 150px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-nest-naam="${this.selectedNestKennelnaam || ''}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Nestfoto" 
                                         style="max-width: 100%; max-height: 100%; object-fit: cover;">
                                </div>
                            </div>
                            <div class="card-body">
                                <small class="text-muted d-block text-truncate">
                                    ${foto.filename || 'Nestfoto'}
                                </small>
                                <small class="text-muted d-block">
                                    ${uploadDate}
                                </small>
                                
                                <!-- NIEUW: Opmerking sectie -->
                                <div class="mt-2 p-2 bg-light rounded" style="min-height: 50px;">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <small class="fw-semibold">${t('remark')}:</small>
                                        <button class="btn btn-sm btn-outline-info py-0 px-1 edit-remark-btn" 
                                                data-foto-id="${foto.id}"
                                                data-current-remark='${(foto.opmerking || "").replace(/'/g, "\\'")}'
                                                title="${t('editRemark')}">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                    </div>
                                    <small class="d-block mt-1 remark-text" style="word-break: break-word;">
                                        ${foto.opmerking ? foto.opmerking : `<span class="text-muted fst-italic">${t('noRemark')}</span>`}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }
        
        container.innerHTML = html;
        
        // Event listener voor upload knop
        document.getElementById('uploadNestPhotoBtn')?.addEventListener('click', () => {
            const remark = document.getElementById('uploadRemark')?.value || '';
            this.uploadNestPhoto(remark);
        });
        
        // Click handlers voor foto's
        container.querySelectorAll('.nest-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const nestNaam = thumb.dataset.nestNaam || this.selectedNestKennelnaam || '';
                    
                    // Laad PhotoViewer dynamisch
                    await this.ensurePhotoViewer();
                    
                    // Toon de foto
                    window.photoViewer.showPhoto(foto.data, nestNaam);
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
        
        // Click handlers voor verwijder knoppen
        container.querySelectorAll('.delete-nest-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fotoId = btn.dataset.fotoId;
                const fotoElement = document.getElementById(`nest-foto-${fotoId}`);
                await this.deleteNestPhoto(fotoId, fotoElement);
            });
        });
        
        // NIEUW: Click handlers voor bewerk opmerking knoppen
        container.querySelectorAll('.edit-remark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fotoId = btn.dataset.fotoId;
                const currentRemark = btn.dataset.currentRemark || '';
                this.showRemarkModal(fotoId, currentRemark);
            });
        });
    }
    
    /**
     * NIEUW: Toon de nestfoto galerij modal
     */
    async showNestPhotoGallery(nestId, nestNaam, fotos) {
        this.currentNestFotos = fotos;
        this.currentFotoIndex = 0;
        
        const t = this.t.bind(this);
        
        // Modal HTML
        const modalHTML = `
            <div class="modal fade" id="nestPhotoGalleryModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-images"></i> ${t('nestPhotos')} - ${nestNaam}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="galleryFotoContainer" class="text-center mb-3">
                                <img id="currentGalleryFoto" src="" alt="Nestfoto" class="img-fluid" style="max-height: 500px;">
                            </div>
                            
                            <!-- NIEUW: Toon opmerking bij huidige foto -->
                            <div id="currentFotoRemark" class="alert alert-info mb-3" style="display: none;">
                                <i class="bi bi-chat-dots me-2"></i>
                                <span id="remarkText"></span>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <button class="btn btn-outline-primary" id="prevFotoBtn" ${fotos.length <= 1 ? 'disabled' : ''}>
                                    <i class="bi bi-arrow-left"></i> ${t('previous')}
                                </button>
                                <span id="fotoCounter" class="fw-bold">${t('photoCounter').replace('{current}', '1').replace('{total}', fotos.length)}</span>
                                <button class="btn btn-outline-primary" id="nextFotoBtn" ${fotos.length <= 1 ? 'disabled' : ''}>
                                    ${t('next')} <i class="bi bi-arrow-right"></i>
                                </button>
                            </div>
                            
                            <!-- Miniaturen onderaan -->
                            <div class="row mt-3" id="thumbnailRow">
                                ${fotos.map((foto, index) => `
                                    <div class="col-2 col-md-1 mb-2">
                                        <div class="gallery-thumbnail ${index === 0 ? 'border border-primary' : ''}" 
                                             style="width: 100%; height: 50px; cursor: pointer; overflow: hidden; border-radius: 4px;"
                                             data-index="${index}"
                                             data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'>
                                            <img src="${foto.thumbnail || foto.data}" alt="Thumb" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .gallery-thumbnail {
                    transition: all 0.2s;
                }
                .gallery-thumbnail:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
            </style>
        `;
        
        // Voeg modal toe aan DOM
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        // Verwijder bestaande gallery modal
        const existingModal = document.getElementById('nestPhotoGalleryModal');
        if (existingModal) existingModal.remove();
        
        modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toon eerste foto
        const currentImg = document.getElementById('currentGalleryFoto');
        if (currentImg && fotos.length > 0) {
            currentImg.src = fotos[0].data;
            this.updateGalleryRemark(fotos[0]);
        }
        
        // Event listeners voor navigatie
        document.getElementById('prevFotoBtn')?.addEventListener('click', () => {
            if (this.currentFotoIndex > 0) {
                this.currentFotoIndex--;
                this.updateGalleryDisplay();
            }
        });
        
        document.getElementById('nextFotoBtn')?.addEventListener('click', () => {
            if (this.currentFotoIndex < this.currentNestFotos.length - 1) {
                this.currentFotoIndex++;
                this.updateGalleryDisplay();
            }
        });
        
        // Event listeners voor miniaturen
        document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                if (!isNaN(index)) {
                    this.currentFotoIndex = index;
                    this.updateGalleryDisplay();
                }
            });
        });
        
        // Toon modal
        const modalElement = document.getElementById('nestPhotoGalleryModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Cleanup bij sluiten
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    /**
     * NIEUW: Update galerij weergave na navigatie
     */
    updateGalleryDisplay() {
        if (!this.currentNestFotos || this.currentNestFotos.length === 0) return;
        
        const currentFoto = this.currentNestFotos[this.currentFotoIndex];
        const currentImg = document.getElementById('currentGalleryFoto');
        const counter = document.getElementById('fotoCounter');
        const t = this.t.bind(this);
        
        if (currentImg) {
            currentImg.src = currentFoto.data;
        }
        
        if (counter) {
            counter.textContent = t('photoCounter')
                .replace('{current}', (this.currentFotoIndex + 1).toString())
                .replace('{total}', this.currentNestFotos.length.toString());
        }
        
        // Update opmerking
        this.updateGalleryRemark(currentFoto);
        
        // Update miniaturen highlight
        document.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
            if (index === this.currentFotoIndex) {
                thumb.classList.add('border', 'border-primary');
            } else {
                thumb.classList.remove('border', 'border-primary');
            }
        });
        
        // Update vorige/volgende knoppen
        const prevBtn = document.getElementById('prevFotoBtn');
        const nextBtn = document.getElementById('nextFotoBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentFotoIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentFotoIndex === this.currentNestFotos.length - 1;
        }
    }
    
    /**
     * NIEUW: Update de opmerking in de galerij
     */
    updateGalleryRemark(foto) {
        const remarkContainer = document.getElementById('currentFotoRemark');
        const remarkText = document.getElementById('remarkText');
        const t = this.t.bind(this);
        
        if (foto.opmerking) {
            if (remarkContainer) {
                remarkContainer.style.display = 'block';
            }
            if (remarkText) {
                remarkText.textContent = foto.opmerking;
            }
        } else {
            if (remarkContainer) {
                remarkContainer.style.display = 'none';
            }
        }
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('nestAankondigingenModal')) {
            this.translateModalContent();
        }
    }
    
    /**
     * Toon de Nest Aankondigingen modal
     */
    async showModal() {
        console.log('NestAankondigingenManager.showModal() aangeroepen');
        
        const supabase = this.getSupabase();
        if (!supabase) {
            alert('Geen verbinding met database');
            return;
        }
        
        this.supabase = supabase;
        
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;
        console.log('Gebruiker:', user?.email);
        
        // Laad alle honden voor autocomplete
        await this.loadAllDogs();
        
        this.currentPage = 1;
        this.currentView = 'overview';
        this.editingAnnouncementId = null;
        this.editingAnnouncementData = null;
        
        // Haal de modal HTML op
        const modalHTML = this.getChoiceModalHTML();
        
        // Zoek of maak de modals container
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById('nestAankondigingenModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Voeg nieuwe modal toe
        modalsContainer.innerHTML = modalHTML;
        
        // Toon de modal
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            
            // Setup event listeners
            this.setupChoiceEvents();
            
            modal.show();
            
            console.log('✅ NestAankondigingen modal getoond');
        } else {
            console.error('❌ NestAankondigingen modal element niet gevonden na toevoegen');
        }
    }
    
    getChoiceModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncements')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${t('chooseAction')}</h4>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-primary hover-shadow" style="cursor: pointer;" id="viewOverviewBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-megaphone display-1 text-primary mb-3"></i>
                                            <h5>${t('viewOverview')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="manageAnnouncementsBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-pencil-square display-1 text-success mb-3"></i>
                                            <h5>${t('manageAnnouncements')}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getOverviewModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncementsOverview')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- PAGINATIE BOVENAAN - 80% van normale grootte -->
                            <div id="paginationTopContainer" class="mb-2 pagination-sm-container"></div>
                            
                            <!-- Container voor de aankondiging -->
                            <div id="nestAankondigingenContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="mt-3 text-muted">${t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- CSS voor de gezondheidsinfo layout en kleinere tekst -->
            <style>
                /* Algemene card tekst verkleining naar 70% */
                .announcement-card {
                    font-size: 0.7rem;
                }
                
                /* Hondenamen blijven normale grootte (1rem = 100%) */
                .announcement-card .dog-name {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                /* Pedigree nummer ook normale grootte */
                .announcement-card .pedigree-number {
                    color: #6c757d;
                    font-size: 0.95rem;
                }
                
                /* Health items */
                .health-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    width: 100%;
                }
                
                .health-row-2col {
                    display: flex !important;
                    gap: 15px;
                    width: 100%;
                }
                
                .health-row-2col .health-item {
                    flex: 1;
                    min-width: 0;
                }
                
                .health-row {
                    width: 100%;
                }
                
                .health-item {
                    line-height: 1.4;
                }
                
                .health-label {
                    font-weight: 500;
                    color: #495057;
                    display: inline-block;
                    min-width: 70px;
                }
                
                .health-value {
                    font-weight: 500;
                    color: #212529;
                }
                
                .explanation-item {
                    margin-top: 6px;
                    padding: 4px 8px;
                    background-color: #fff3cd;
                    border-radius: 4px;
                    border: 1px solid #ffeeba;
                    font-size: 0.65rem;
                }
                
                .father-header {
                    background-color: #cce5ff;
                    color: #004085;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                
                .mother-header {
                    background-color: #d4edda;
                    color: #155724;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                
                /* Foto thumbnails styling voor ouders */
                .photo-thumbnails {
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid #dee2e6;
                }
                
                .photo-thumbnails .small {
                    color: #6c757d;
                    margin-bottom: 8px;
                }
                
                .photo-thumbnails .d-flex {
                    gap: 8px;
                }
                
                .photo-thumbnail {
                    width: 50px;
                    height: 50px;
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #dee2e6;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .photo-thumbnail:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    z-index: 10;
                }
                
                .photo-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .photo-thumbnail-more {
                    width: 50px;
                    height: 50px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* NIEUW: Nestfoto knop styling */
                .btn-nest-photos {
                    background-color: #6f42c1;
                    color: white;
                    transition: all 0.2s;
                }
                
                .btn-nest-photos:hover {
                    background-color: #5a32a3;
                    color: white;
                    transform: scale(1.05);
                }
                
                /* Card header ook verkleind */
                .announcement-card .card-header {
                    padding: 0.5rem 1rem;
                }
                
                .announcement-card .card-header h5 {
                    font-size: 0.9rem;
                }
                
                /* Card body padding verkleind */
                .announcement-card .card-body {
                    padding: 1rem;
                }
                
                /* Beschrijving tekst */
                .announcement-card .bg-light {
                    padding: 0.5rem !important;
                    font-size: 0.7rem;
                }
                
                /* Email en datum */
                .announcement-card .text-muted.small {
                    font-size: 0.65rem !important;
                }
                
                /* PAGINATIE - 80% van normale grootte */
                .pagination-sm-container .pagination {
                    --bs-pagination-font-size: 0.8rem;
                    --bs-pagination-padding-x: 0.5rem;
                    --bs-pagination-padding-y: 0.25rem;
                }
                
                .pagination-sm-container .pagination-info {
                    font-size: 0.8rem;
                }
                
                .pagination-sm-container .page-link {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }
                
                @media (max-width: 768px) {
                    .health-row-2col {
                        flex-direction: column;
                        gap: 2px;
                    }
                    
                    .announcement-card .dog-name {
                        font-size: 0.9rem;
                    }
                }
            </style>
        `;
    }
    
    getBeheerModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-pencil-square"></i> ${t('nestAnnouncementsBeheer')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <button class="btn btn-success" id="addAnnouncementBtn">
                                    <i class="bi bi-plus-circle"></i> ${t('addAnnouncement')}
                                </button>
                            </div>
                            <div id="nestAankondigingenBeheerContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-secondary"></div>
                                    <p class="mt-3 text-muted">${t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Modal voor toevoegen/bewerken
     */
    getAddEditModalHTML(mode = 'add') {
        const title = mode === 'add' ? this.t('addAnnouncement') : this.t('editAnnouncement');
        const icon = mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square';
        const saveButtonText = mode === 'add' ? this.t('save') : this.t('edit');
        const saveButtonIcon = mode === 'add' ? 'bi-check-circle' : 'bi-pencil-square';
        
        return `
            <div class="modal fade" id="addEditNestModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi ${icon}"></i> ${title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="nestAnnouncementForm">
                                <input type="hidden" id="nest_id" value="">
                                <input type="hidden" id="vader_id" value="">
                                <input type="hidden" id="moeder_id" value="">
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="father" class="form-label">${this.t('father')}</label>
                                        <div class="parent-input-wrapper" style="position: relative;">
                                            <input type="text" class="form-control" id="father" 
                                                   placeholder="${this.t('searchDogs')}"
                                                   data-parent-type="father"
                                                   autocomplete="off"
                                                   data-valid-parent="false"
                                                   ${mode === 'edit' ? 'readonly' : 'required'}>
                                            <div id="fatherError" class="error-message" style="display: none; color: #dc3545; font-size: 0.875em;"></div>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De ouders kunnen niet worden gewijzigd bij bewerken</small>' : ''}
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="mother" class="form-label">${this.t('mother')}</label>
                                        <div class="parent-input-wrapper" style="position: relative;">
                                            <input type="text" class="form-control" id="mother" 
                                                   placeholder="${this.t('searchDogs')}"
                                                   data-parent-type="mother"
                                                   autocomplete="off"
                                                   data-valid-parent="false"
                                                   ${mode === 'edit' ? 'readonly' : 'required'}>
                                            <div id="motherError" class="error-message" style="display: none; color: #dc3545; font-size: 0.875em;"></div>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De ouders kunnen niet worden gewijzigd bij bewerken</small>' : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="kennelName" class="form-label">${this.t('kennelName')}</label>
                                    <input type="text" class="form-control" id="kennelName" 
                                           placeholder="${this.t('kennelNamePlaceholder')}" 
                                           maxlength="100" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="email" class="form-label">${this.t('email')}</label>
                                    <input type="email" class="form-control" id="email" placeholder="email@voorbeeld.nl">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="description" class="form-label">${this.t('description')}</label>
                                    <textarea class="form-control" id="description" rows="4" placeholder="Verdere informatie over het nest..."></textarea>
                                </div>
                            </form>
                            
                            <div id="saveStatus" class="mt-2"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('cancel')}</button>
                            <button type="button" class="btn btn-success" id="saveNestAnnouncementBtn">
                                <i class="bi ${saveButtonIcon}"></i> ${saveButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
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
                
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }
            </style>
        `;
    }
    
    /**
     * NIEUW: Modal voor nestfoto beheer (vanuit beheer view)
     */
    getNestFotoBeheerModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestFotoBeheerModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white" style="background-color: #6f42c1;">
                            <h5 class="modal-title">
                                <i class="bi bi-images"></i> ${t('nestPhotos')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="nestFotosContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-secondary"></div>
                                    <p class="mt-3 text-muted">${t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .bg-purple {
                    background-color: #6f42c1 !important;
                }
            </style>
        `;
    }
    
    async loadAllDogs() {
        console.log('NestAankondigingenManager: loadAllDogs aangeroepen');
        
        if (!this.db) {
            console.error('Database niet beschikbaar!');
            return;
        }
        
        try {
            this.allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000;
            let hasMorePages = true;
            
            while (hasMorePages) {
                const result = await this.db.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    this.allDogs = this.allDogs.concat(result.honden);
                    hasMorePages = result.heeftVolgende;
                    currentPage++;
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                } else {
                    hasMorePages = false;
                }
            }
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`${this.allDogs.length} honden geladen voor autocomplete`);
            
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allDogs = [];
        }
    }
    
    setupChoiceEvents() {
        const viewOverviewBtn = document.getElementById('viewOverviewBtn');
        const manageAnnouncementsBtn = document.getElementById('manageAnnouncementsBtn');
        
        if (viewOverviewBtn) {
            viewOverviewBtn.addEventListener('click', () => {
                this.showOverviewView();
            });
        }
        
        if (manageAnnouncementsBtn) {
            manageAnnouncementsBtn.addEventListener('click', () => {
                this.showBeheerView();
            });
        }
        
        this.fixModalClose();
    }
    
    setupOverviewEvents() {
        const backBtn = document.getElementById('backToChoiceBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        this.fixModalClose();
    }
    
    setupBeheerEvents() {
        console.log('Setup beheer events');
        
        const backBtn = document.getElementById('backToChoiceBtn');
        const addBtn = document.getElementById('addAnnouncementBtn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddAnnouncementModal();
            });
        }
        
        this.fixModalClose();
    }
    
    /**
     * Toon modal om nest aankondiging toe te voegen
     */
    async showAddAnnouncementModal() {
        try {
            console.log('Show add announcement modal');
            
            const modalHTML = this.getAddEditModalHTML('add');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditNestModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditNestModal');
            const modal = new bootstrap.Modal(modalElement);
            
            this.editingAnnouncementId = null;
            this.editingAnnouncementData = null;
            
            this.setupParentAutocomplete();
            
            document.getElementById('saveNestAnnouncementBtn')?.addEventListener('click', () => this.saveAnnouncement());
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.editingAnnouncementId = null;
                this.editingAnnouncementData = null;
            });
            
        } catch (error) {
            console.error('Fout:', error);
            alert('Fout bij laden: ' + error.message);
        }
    }
    
    /**
     * Toon modal om nest aankondiging te bewerken
     */
    async showEditAnnouncementModal(announcement) {
        try {
            console.log('Show edit announcement modal', announcement);
            
            this.editingAnnouncementId = announcement.id;
            this.editingAnnouncementData = announcement;
            
            const modalHTML = this.getAddEditModalHTML('edit');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditNestModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditNestModal');
            const modal = new bootstrap.Modal(modalElement);
            
            await this.populateEditForm(announcement);
            
            document.getElementById('saveNestAnnouncementBtn')?.addEventListener('click', () => this.saveAnnouncement());
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.editingAnnouncementId = null;
                this.editingAnnouncementData = null;
            });
            
        } catch (error) {
            console.error('Fout bij tonen bewerk modal:', error);
            alert('Fout bij laden nest aankondiging: ' + error.message);
        }
    }
    
    /**
     * NIEUW: Toon modal voor nestfoto beheer
     */
    async showNestFotoBeheerModal(announcement) {
        try {
            console.log('Show nest foto beheer modal', announcement);
            
            this.selectedNestId = announcement.id;
            this.selectedNestKennelnaam = announcement.kennelnaam_nest || `Nest #${announcement.id}`;
            
            const modalHTML = this.getNestFotoBeheerModalHTML();
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('nestFotoBeheerModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('nestFotoBeheerModal');
            const modal = new bootstrap.Modal(modalElement);
            
            // Laad nestfoto's
            await this.loadNestFotos(announcement.id);
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.selectedNestId = null;
                this.selectedNestKennelnaam = null;
                this.nestFotos = [];
            });
            
        } catch (error) {
            console.error('Fout bij tonen nestfoto beheer modal:', error);
            alert('Fout bij laden nestfoto\'s: ' + error.message);
        }
    }
    
    /**
     * Vul bewerk formulier met bestaande data
     */
    async populateEditForm(announcement) {
        try {
            document.getElementById('nest_id').value = announcement.id || '';
            
            // Vader gegevens ophalen
            if (announcement.vader_id) {
                const vader = this.allDogs.find(d => d.id === announcement.vader_id);
                if (vader) {
                    const fatherInput = document.getElementById('father');
                    const vaderIdInput = document.getElementById('vader_id');
                    
                    if (fatherInput) {
                        const displayName = vader.kennelnaam ? `${vader.naam} ${vader.kennelnaam}` : vader.naam;
                        fatherInput.value = displayName;
                    }
                    if (vaderIdInput) {
                        vaderIdInput.value = vader.id;
                    }
                }
            }
            
            // Moeder gegevens ophalen
            if (announcement.moeder_id) {
                const moeder = this.allDogs.find(d => d.id === announcement.moeder_id);
                if (moeder) {
                    const motherInput = document.getElementById('mother');
                    const moederIdInput = document.getElementById('moeder_id');
                    
                    if (motherInput) {
                        const displayName = moeder.kennelnaam ? `${moeder.naam} ${moeder.kennelnaam}` : moeder.naam;
                        motherInput.value = displayName;
                    }
                    if (moederIdInput) {
                        moederIdInput.value = moeder.id;
                    }
                }
            }
            
            // Kennelnaam invullen
            const kennelNameField = document.getElementById('kennelName');
            if (kennelNameField) {
                kennelNameField.value = announcement.kennelnaam_nest || '';
            }
            
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.value = announcement.email || '';
            }
            
            const descriptionField = document.getElementById('description');
            if (descriptionField) {
                descriptionField.value = announcement.beschrijving || '';
            }
            
        } catch (error) {
            console.error('Fout bij vullen bewerk formulier:', error);
        }
    }
    
    setupParentAutocomplete() {
        console.log('Setup autocomplete voor ouders');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak dropdown containers
        const fatherInputWrapper = document.querySelector('#father')?.closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother')?.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            const fatherDropdown = document.createElement('div');
            fatherDropdown.className = 'autocomplete-dropdown';
            fatherDropdown.id = 'fatherDropdown';
            fatherDropdown.style.display = 'none';
            fatherInputWrapper.appendChild(fatherDropdown);
        }
        
        if (motherInputWrapper) {
            const motherDropdown = document.createElement('div');
            motherDropdown.className = 'autocomplete-dropdown';
            motherDropdown.id = 'motherDropdown';
            motherDropdown.style.display = 'none';
            motherInputWrapper.appendChild(motherDropdown);
        }
        
        // Event listeners alleen voor niet-readonly inputs
        document.querySelectorAll('.parent-input-wrapper input:not([readonly])').forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                    this.validateParents();
                }, 200);
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('parent-validation-error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelName = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const combined = `${dogName} ${kennelName}`;
            const matchesSearch = combined.includes(searchTerm.toLowerCase()) || combined.startsWith(searchTerm.toLowerCase());
            
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else {
                return matchesSearch && dog.geslacht === 'teven';
            }
        }).slice(0, 8);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            const displayName = dog.kennelnaam ? `${dog.naam} ${dog.kennelnaam}` : dog.naam;
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}" data-kennel="${dog.kennelnaam || ''}" data-pedigree="${dog.stamboomnr || ''}" data-ras="${dog.ras || ''}">
                    <div class="dog-name">${displayName}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const dogKennel = item.getAttribute('data-kennel');
                const input = document.getElementById(parentType);
                const idInput = parentType === 'father' ? document.getElementById('vader_id') : document.getElementById('moeder_id');
                
                const displayName = dogKennel ? `${dogName} ${dogKennel}` : dogName;
                
                console.log(`Selected ${parentType}:`, dogId, displayName);
                
                if (input) {
                    input.value = displayName;
                    input.setAttribute('data-valid-parent', 'true');
                    input.classList.remove('parent-validation-error');
                    
                    const errorElement = document.getElementById(`${parentType}Error`);
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    validateParents() {
        const t = this.t.bind(this);
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        
        // Als inputs readonly zijn (bij bewerken), altijd valide
        if (fatherInput?.hasAttribute('readonly') && motherInput?.hasAttribute('readonly')) {
            return true;
        }
        
        let isValid = true;
        
        if (fatherInput && !fatherInput.hasAttribute('readonly')) {
            fatherInput.classList.remove('parent-validation-error');
            fatherInput.setAttribute('data-valid-parent', 'false');
        }
        if (motherInput && !motherInput.hasAttribute('readonly')) {
            motherInput.classList.remove('parent-validation-error');
            motherInput.setAttribute('data-valid-parent', 'false');
        }
        if (fatherError) fatherError.style.display = 'none';
        if (motherError) motherError.style.display = 'none';
        
        // Check vader
        if (fatherInput && !fatherInput.hasAttribute('readonly') && fatherInput.value.trim()) {
            const hasValidId = vaderIdInput && vaderIdInput.value && !isNaN(parseInt(vaderIdInput.value));
            
            if (!hasValidId) {
                fatherInput.classList.add('parent-validation-error');
                if (fatherError) {
                    fatherError.textContent = t('parentNotSelected');
                    fatherError.style.display = 'block';
                }
                isValid = false;
            } else {
                fatherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        // Check moeder
        if (motherInput && !motherInput.hasAttribute('readonly') && motherInput.value.trim()) {
            const hasValidId = moederIdInput && moederIdInput.value && !isNaN(parseInt(moederIdInput.value));
            
            if (!hasValidId) {
                motherInput.classList.add('parent-validation-error');
                if (motherError) {
                    motherError.textContent = t('parentNotSelected');
                    motherError.style.display = 'block';
                }
                isValid = false;
            } else {
                motherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        return isValid;
    }
    
    async saveAnnouncement() {
        console.log('Save announcement...');
        
        const supabase = this.getSupabase();
        if (!supabase) {
            this.showStatus('Geen database verbinding', 'danger');
            return;
        }
        
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        const kennelNameInput = document.getElementById('kennelName');
        
        const vaderId = vaderIdInput?.value;
        const moederId = moederIdInput?.value;
        const kennelnaam_nest = kennelNameInput?.value.trim();
        
        if (!vaderId || !moederId) {
            this.showStatus('Vader en moeder zijn verplicht', 'danger');
            return;
        }
        
        if (!kennelnaam_nest) {
            this.showStatus('Kennelnaam is verplicht', 'danger');
            return;
        }
        
        // Converteer naar integers
        const vaderIdInt = parseInt(vaderId);
        const moederIdInt = parseInt(moederId);
        
        if (isNaN(vaderIdInt) || isNaN(moederIdInt)) {
            this.showStatus('Ongeldige ID waarden', 'danger');
            return;
        }
        
        const email = document.getElementById('email')?.value;
        const beschrijving = document.getElementById('description')?.value;
        
        // Haal huidige gebruiker op
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        
        if (!userId) {
            this.showStatus('Niet ingelogd', 'danger');
            return;
        }
        
        // Data voor opslag
        const data = {
            vader_id: vaderIdInt,
            moeder_id: moederIdInt,
            toegevoegd_door: userId,
            kennelnaam_nest: kennelnaam_nest,
            email: email || null,
            beschrijving: beschrijving || null
        };
        
        console.log('Data to save:', data);
        
        try {
            this.showStatus('Bezig met opslaan...', 'info');
            
            let result, error;
            
            if (this.editingAnnouncementId) {
                // Update bestaande
                ({ data: result, error } = await supabase
                    .from('litters')
                    .update(data)
                    .eq('id', this.editingAnnouncementId)
                    .select());
                    
                if (error) throw error;
                this.showStatus(this.t('announcementUpdated'), 'success');
            } else {
                // Insert nieuwe
                ({ data: result, error } = await supabase
                    .from('litters')
                    .insert([data])
                    .select());
                    
                if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                }
                this.showStatus(this.t('announcementAdded'), 'success');
            }
            
            console.log('Opgeslagen:', result);
            
            // Reset form
            document.getElementById('nestAnnouncementForm')?.reset();
            if (vaderIdInput) vaderIdInput.value = '';
            if (moederIdInput) moederIdInput.value = '';
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addEditNestModal'));
                if (modal) modal.hide();
                
                // Ververs de beheer lijst
                this.loadAnnouncementsForBeheer(1);
            }, 2000);
            
        } catch (error) {
            console.error('Fout bij opslaan:', error);
            this.showStatus((this.editingAnnouncementId ? this.t('announcementUpdateFailed') : this.t('announcementAddFailed')) + error.message, 'danger');
        }
    }
    
    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('saveStatus');
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            
            if (type !== 'info') {
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
            }
        }
    }
    
    /**
     * Laad nest aankondigingen voor overzicht met paginatie
     * Toont 1 aankondiging per pagina
     */
    async loadAnnouncements(page = 1) {
        const container = document.getElementById('nestAankondigingenContainer');
        const paginationTopContainer = document.getElementById('paginationTopContainer');
        
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            const { data: announcements, error, count } = await supabase
                .from('litters')
                .select('*', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            
            this.totalAnnouncements = count || 0;
            
            if (!announcements || announcements.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-megaphone display-1 text-muted"></i>
                        <p class="mt-3 text-muted">${this.t('noAnnouncements')}</p>
                    </div>
                `;
                if (paginationTopContainer) paginationTopContainer.innerHTML = '';
                return;
            }
            
            // Render eerst de paginatie bovenaan
            const totalPages = Math.ceil(this.totalAnnouncements / this.pageSize);
            const paginationHTML = this.getPaginationHTML(this.totalAnnouncements, page, totalPages, false);
            
            if (paginationTopContainer) {
                paginationTopContainer.innerHTML = paginationHTML;
            }
            
            // Render de aankondiging (slechts 1)
            await this.renderOverviewList(announcements, container, this.totalAnnouncements, page);
            
        } catch (error) {
            console.error('Fout bij laden aankondigingen:', error);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                    <p class="mt-3 text-danger">${this.t('loadFailed')}${error.message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Laad nest aankondigingen voor beheer met paginatie
     * Alleen eigen aankondigingen voor niet-admin gebruikers
     */
    async loadAnnouncementsForBeheer(page = 1) {
        const container = document.getElementById('nestAankondigingenBeheerContainer');
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            
            // Controleer of de gebruiker admin is
            let isAdmin = false;
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('user_id', user.id)
                    .single();
                isAdmin = profile?.is_admin === true;
            }
            
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            let query = supabase
                .from('litters')
                .select('*', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false });
            
            // Alleen filteren op toegevoegd_door voor niet-admin gebruikers
            if (user && !isAdmin) {
                query = query.eq('toegevoegd_door', user.id);
            }
            
            const { data: announcements, error, count } = await query.range(from, to);
            
            if (error) throw error;
            
            this.totalAnnouncements = count || 0;
            
            if (!announcements || announcements.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-megaphone display-1 text-muted"></i>
                        <p class="mt-3 text-muted">${this.t('noAnnouncements')}</p>
                    </div>
                `;
                return;
            }
            
            await this.renderBeheerList(announcements, container, count, page);
            
        } catch (error) {
            console.error('Fout bij laden aankondigingen voor beheer:', error);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                    <p class="mt-3 text-danger">${this.t('loadFailed')}${error.message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Render overzichtslijst met exact de gewenste indeling
     * Eerste rij: HD en ED naast elkaar
     * Tweede rij: Patella en Ogen naast elkaar
     * Derde rij: Dandy Walker op eigen regel
     * Vierde rij: Schildklier op eigen regel
     * Vijfde rij: Land op eigen regel
     * Met foto thumbnails van beide ouders EN knop voor nestfoto's
     */
    async renderOverviewList(announcements, container, total = 0, currentPage = 1) {
        const t = this.t.bind(this);
        let html = '';
        
        for (const announcement of announcements) {
            // Haal vader gegevens op
            const vader = this.allDogs.find(d => d.id === announcement.vader_id) || {};
            
            // Haal moeder gegevens op
            const moeder = this.allDogs.find(d => d.id === announcement.moeder_id) || {};
            
            // Haal foto's op voor vader en moeder
            const vaderFotos = await this.getHondFotos(vader.id);
            const moederFotos = await this.getHondFotos(moeder.id);
            
            // NIEUW: Haal nestfoto's op voor teller
            const nestFotos = await this.getNestFotos(announcement.id);
            
            // Formatteer datum
            const date = new Date(announcement.aangemaakt_op);
            const formattedDate = date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                                           this.currentLang === 'de' ? 'de-DE' : 'en-US');
            
            // Vader display naam
            const vaderNaam = vader.kennelnaam ? `${vader.naam || 'Onbekend'} ${vader.kennelnaam}` : (vader.naam || 'Onbekend');
            
            // Moeder display naam
            const moederNaam = moeder.kennelnaam ? `${moeder.naam || 'Onbekend'} ${moeder.kennelnaam}` : (moeder.naam || 'Onbekend');
            
            // Genereer foto thumbnails voor vader
            let vaderFotosHTML = '';
            if (vaderFotos.length > 0) {
                const eersteFotos = vaderFotos.slice(0, 3);
                vaderFotosHTML = `
                    <div class="photo-thumbnails">
                        <small class="text-muted d-block mb-1">${t('photos')}:</small>
                        <div class="d-flex flex-wrap">
                            ${eersteFotos.map(foto => `
                                <div class="photo-thumbnail" 
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${vaderNaam}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto">
                                </div>
                            `).join('')}
                            ${vaderFotos.length > 3 ? `
                                <div class="photo-thumbnail-more">
                                    <span class="small text-muted">+${vaderFotos.length - 3}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Genereer foto thumbnails voor moeder
            let moederFotosHTML = '';
            if (moederFotos.length > 0) {
                const eersteFotos = moederFotos.slice(0, 3);
                moederFotosHTML = `
                    <div class="photo-thumbnails">
                        <small class="text-muted d-block mb-1">${t('photos')}:</small>
                        <div class="d-flex flex-wrap">
                            ${eersteFotos.map(foto => `
                                <div class="photo-thumbnail" 
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${moederNaam}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto">
                                </div>
                            `).join('')}
                            ${moederFotos.length > 3 ? `
                                <div class="photo-thumbnail-more">
                                    <span class="small text-muted">+${moederFotos.length - 3}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Gebruik kennelnaam_nest voor de header
            const headerTitle = announcement.kennelnaam_nest || 'Nest aankondiging';
            
            html += `
                <div class="col-12 mb-4">
                    <div class="card announcement-card shadow-sm">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-megaphone text-primary me-2"></i>
                                ${headerTitle}
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <!-- Vader Column -->
                                <div class="col-md-6">
                                    <div class="parent-header father-header mb-3">
                                        <i class="bi bi-gender-male me-2"></i>
                                        <strong>${t('fatherInfo')}</strong>
                                    </div>
                                    
                                    <div class="dog-info">
                                        <div class="dog-name">${vaderNaam}</div>
                                        ${vader.stamboomnr ? `<div class="pedigree-number">${vader.stamboomnr}</div>` : ''}
                                    </div>
                                    
                                    <div class="health-info">
                                        <!-- Rij 1: HD en ED naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('hd')}:</span>
                                                <span class="health-value">${vader.heupdysplasie || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('ed')}:</span>
                                                <span class="health-value">${vader.elleboogdysplasie || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 2: Patella en Ogen naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('patella')}:</span>
                                                <span class="health-value">${vader.patella || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('eyes')}:</span>
                                                <span class="health-value">${vader.ogen || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 3: Dandy Walker op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('dandyWalker')}:</span>
                                                <span class="health-value">${vader.dandyWalker ? vader.dandyWalker : '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 4: Schildklier op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('thyroid')}:</span>
                                                <span class="health-value">${vader.schildklier || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${vader.ogenverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('eyesExplanation')}:</span>
                                        <span class="explanation-text">${vader.ogenverklaring}</span>
                                    </div>
                                    ` : ''}
                                    ${vader.schildklierverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('thyroidExplanation')}:</span>
                                        <span class="explanation-text">${vader.schildklierverklaring}</span>
                                    </div>
                                    ` : ''}
                                    
                                    <!-- Vader foto thumbnails -->
                                    ${vaderFotosHTML}
                                </div>
                                
                                <!-- Moeder Column -->
                                <div class="col-md-6">
                                    <div class="parent-header mother-header mb-3">
                                        <i class="bi bi-gender-female me-2"></i>
                                        <strong>${t('motherInfo')}</strong>
                                    </div>
                                    
                                    <div class="dog-info">
                                        <div class="dog-name">${moederNaam}</div>
                                        ${moeder.stamboomnr ? `<div class="pedigree-number">${moeder.stamboomnr}</div>` : ''}
                                    </div>
                                    
                                    <div class="health-info">
                                        <!-- Rij 1: HD en ED naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('hd')}:</span>
                                                <span class="health-value">${moeder.heupdysplasie || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('ed')}:</span>
                                                <span class="health-value">${moeder.elleboogdysplasie || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 2: Patella en Ogen naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('patella')}:</span>
                                                <span class="health-value">${moeder.patella || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('eyes')}:</span>
                                                <span class="health-value">${moeder.ogen || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 3: Dandy Walker op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('dandyWalker')}:</span>
                                                <span class="health-value">${moeder.dandyWalker ? moeder.dandyWalker : '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 4: Schildklier op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('thyroid')}:</span>
                                                <span class="health-value">${moeder.schildklier || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${moeder.ogenverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('eyesExplanation')}:</span>
                                        <span class="explanation-text">${moeder.ogenverklaring}</span>
                                    </div>
                                    ` : ''}
                                    ${moeder.schildklierverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('thyroidExplanation')}:</span>
                                        <span class="explanation-text">${moeder.schildklierverklaring}</span>
                                    </div>
                                    ` : ''}
                                    
                                    <!-- Moeder foto thumbnails -->
                                    ${moederFotosHTML}
                                </div>
                            </div>
                            
                            ${announcement.beschrijving ? `
                                <div class="mt-4 p-3 bg-light rounded">
                                    <p class="card-text mb-0">${announcement.beschrijving}</p>
                                </div>
                            ` : ''}
                            
                            <div class="mt-3 d-flex justify-content-between align-items-center">
                                <div class="text-muted small">
                                    ${announcement.email ? `
                                        <div><i class="bi bi-envelope me-2"></i> ${announcement.email}</div>
                                    ` : ''}
                                    <div><i class="bi bi-calendar me-2"></i> ${formattedDate}</div>
                                </div>
                                
                                <!-- NIEUW: Nestfoto knop -->
                                <button class="btn btn-sm btn-nest-photos view-nest-photos" 
                                        data-nest-id="${announcement.id}"
                                        data-nest-naam="${headerTitle}"
                                        data-nest-fotos-count="${nestFotos.length}">
                                    <i class="bi bi-images me-1"></i> 
                                    ${t('nestPhotos')} (${nestFotos.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = `<div class="row">${html}</div>`;
        
        // Click handlers voor ouderfoto's
        container.querySelectorAll('.photo-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam || '';
                    
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
        
        // NIEUW: Click handlers voor nestfoto knoppen
        container.querySelectorAll('.view-nest-photos').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const nestId = btn.dataset.nestId;
                const nestNaam = btn.dataset.nestNaam;
                
                if (nestId) {
                    // Haal nestfoto's op
                    const fotos = await this.getNestFotos(parseInt(nestId));
                    
                    if (fotos && fotos.length > 0) {
                        // Toon galerij
                        await this.showNestPhotoGallery(parseInt(nestId), nestNaam, fotos);
                    } else {
                        // Geen foto's, toon melding
                        alert(this.t('noNestPhotos'));
                    }
                }
            });
        });
        
        this.attachPaginationEvents(false);
    }
    
    /**
     * Render beheer lijst (zelfde opzet als DekReuen beheer)
     */
    async renderBeheerList(announcements, container, total = 0, currentPage = 1) {
        const supabase = this.getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Controleer of de gebruiker admin is
        let isAdmin = false;
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('user_id', user.id)
                .single();
            isAdmin = profile?.is_admin === true;
        }
        
        const t = this.t.bind(this);
        
        let html = '';
        
        for (const ann of announcements) {
            // Haal vader en moeder gegevens op
            const vader = this.allDogs.find(d => d.id === ann.vader_id) || {};
            const moeder = this.allDogs.find(d => d.id === ann.moeder_id) || {};
            const canEdit = isAdmin || ann.toegevoegd_door === user?.id;
            
            // Haal foto's op voor vader en moeder
            const vaderFotos = await this.getHondFotos(vader.id);
            const moederFotos = await this.getHondFotos(moeder.id);
            
            // NIEUW: Haal nestfoto's op voor teller
            const nestFotos = await this.getNestFotos(ann.id);
            
            // Formatteer datum
            const date = new Date(ann.aangemaakt_op);
            const formattedDate = date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                                           this.currentLang === 'de' ? 'de-DE' : 'en-US');
            
            // Vader display naam
            const vaderNaam = vader.kennelnaam ? `${vader.naam || 'Onbekend'} ${vader.kennelnaam}` : (vader.naam || 'Onbekend');
            
            // Moeder display naam
            const moederNaam = moeder.kennelnaam ? `${moeder.naam || 'Onbekend'} ${moeder.kennelnaam}` : (moeder.naam || 'Onbekend');
            
            // Genereer foto thumbnails voor vader
            let vaderFotosHTML = '';
            if (vaderFotos.length > 0) {
                const eersteFotos = vaderFotos.slice(0, 2);
                vaderFotosHTML = `
                    <div class="mt-2">
                        <div class="d-flex flex-wrap gap-1">
                            ${eersteFotos.map(foto => `
                                <div class="photo-thumbnail" 
                                     style="width: 30px; height: 30px;"
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${vaderNaam}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto">
                                </div>
                            `).join('')}
                            ${vaderFotos.length > 2 ? `
                                <div class="d-flex align-items-center justify-content-center" 
                                     style="width: 30px; height: 30px; background: #f8f9fa; border-radius: 3px; border: 1px solid #dee2e6;">
                                    <span class="small text-muted">+${vaderFotos.length - 2}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Genereer foto thumbnails voor moeder
            let moederFotosHTML = '';
            if (moederFotos.length > 0) {
                const eersteFotos = moederFotos.slice(0, 2);
                moederFotosHTML = `
                    <div class="mt-2">
                        <div class="d-flex flex-wrap gap-1">
                            ${eersteFotos.map(foto => `
                                <div class="photo-thumbnail" 
                                     style="width: 30px; height: 30px;"
                                     data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                                     data-hond-naam="${moederNaam}">
                                    <img src="${foto.thumbnail || foto.data}" alt="Foto">
                                </div>
                            `).join('')}
                            ${moederFotos.length > 2 ? `
                                <div class="d-flex align-items-center justify-content-center" 
                                     style="width: 30px; height: 30px; background: #f8f9fa; border-radius: 3px; border: 1px solid #dee2e6;">
                                    <span class="small text-muted">+${moederFotos.length - 2}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            html += `
                <div class="col-12 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-3">
                                    <h6 class="mb-1">${ann.kennelnaam_nest || `Nest #${ann.id}`}</h6>
                                    <small class="text-muted d-block">${formattedDate}</small>
                                </div>
                                <div class="col-md-3 small">
                                    <strong>${t('fatherInfo')}:</strong><br>
                                    ${vaderNaam}<br>
                                    <span class="text-muted">HD: ${vader.heupdysplasie || '-'} | ED: ${vader.elleboogdysplasie || '-'}</span>
                                    ${vaderFotosHTML}
                                </div>
                                <div class="col-md-3 small">
                                    <strong>${t('motherInfo')}:</strong><br>
                                    ${moederNaam}<br>
                                    <span class="text-muted">HD: ${moeder.heupdysplasie || '-'} | ED: ${moeder.elleboogdysplasie || '-'}</span>
                                    ${moederFotosHTML}
                                </div>
                                <div class="col-md-3 text-end">
                                    <!-- NIEUW: Nestfoto knop in beheer -->
                                    <button class="btn btn-sm btn-outline-info manage-nest-photos mb-1 w-100" 
                                            data-announcement='${JSON.stringify(ann).replace(/'/g, '&apos;')}'>
                                        <i class="bi bi-images me-1"></i> 
                                        ${t('nestPhotos')} (${nestFotos.length})
                                    </button>
                                    
                                    ${canEdit ? `
                                        <button class="btn btn-sm btn-outline-primary edit-announcement mb-1 w-100" 
                                            data-announcement='${JSON.stringify(ann).replace(/'/g, '&apos;')}'>
                                            <i class="bi bi-pencil"></i> ${t('edit')}
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-announcement w-100" data-id="${ann.id}">
                                            <i class="bi bi-trash"></i> ${t('delete')}
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            ${ann.beschrijving ? `
                            <div class="row mt-2">
                                <div class="col-12 small">
                                    <span class="text-muted">${t('description')}:</span> ${ann.beschrijving}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, true);
        
        container.innerHTML = `
            <div class="row">${html}</div>
            ${paginationHTML}
        `;
        
        // Click handlers voor ouderfoto's in beheer lijst
        container.querySelectorAll('.photo-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam || '';
                    
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
        
        // NIEUW: Click handlers voor nestfoto beheer
        container.querySelectorAll('.manage-nest-photos').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const announcement = JSON.parse(btn.dataset.announcement.replace(/&apos;/g, "'"));
                    this.showNestFotoBeheerModal(announcement);
                } catch (e) {
                    console.error(e);
                }
            });
        });
        
        container.querySelectorAll('.edit-announcement').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const announcement = JSON.parse(btn.dataset.announcement.replace(/&apos;/g, "'"));
                    this.showEditAnnouncementModal(announcement);
                } catch (e) {
                    console.error(e);
                }
            });
        });
        
        container.querySelectorAll('.delete-announcement').forEach(btn => {
            btn.addEventListener('click', () => this.deleteAnnouncement(btn.dataset.id));
        });
        
        this.attachPaginationEvents(true);
    }
    
    /**
     * Verwijder nest aankondiging
     */
    async deleteAnnouncement(id) {
        if (!confirm(this.t('confirmDelete'))) return;
        
        try {
            const supabase = this.getSupabase();
            
            const { error } = await supabase
                .from('litters')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            alert('Verwijderd!');
            
            // Ververs de beheer lijst
            await this.loadAnnouncementsForBeheer(this.currentPage);
            
        } catch (error) {
            console.error(error);
            alert(this.t('announcementDeleteFailed') + error.message);
        }
    }
    
    getPaginationHTML(total, currentPage, totalPages, isBeheer) {
        if (totalPages <= 1) return '';
        
        const start = ((currentPage - 1) * this.pageSize) + 1;
        
        return `
            <div class="row mt-2 mb-3">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="pagination-info">
                            ${this.t('showingResults').replace('{start}', start).replace('{total}', total)}
                        </span>
                        <nav aria-label="Paginatie">
                            <ul class="pagination mb-0">
                                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                    <a class="page-link nest-pagination" href="#" data-page="${currentPage - 1}" data-beheer="${isBeheer}">
                                        ${this.t('prevPage')}
                                    </a>
                                </li>
                                
                                ${this.generatePageNumbers(currentPage, totalPages).map(page => {
                                    if (page === '...') {
                                        return `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                                    }
                                    return `
                                        <li class="page-item ${page === currentPage ? 'active' : ''}">
                                            <a class="page-link nest-pagination" href="#" data-page="${page}" data-beheer="${isBeheer}">
                                                ${page}
                                            </a>
                                        </li>
                                    `;
                                }).join('')}
                                
                                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                    <a class="page-link nest-pagination" href="#" data-page="${currentPage + 1}" data-beheer="${isBeheer}">
                                        ${this.t('nextPage')}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
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
        document.querySelectorAll('.nest-pagination').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                const beheer = e.target.dataset.beheer === 'true';
                
                if (!isNaN(page)) {
                    this.currentPage = page;
                    if (beheer) {
                        this.loadAnnouncementsForBeheer(page);
                    } else {
                        this.loadAnnouncements(page);
                    }
                }
            });
        });
    }
    
    async showOverviewView() {
        console.log('Showing overview view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(async () => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getOverviewModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupOverviewEvents();
            this.currentPage = 1;
            await this.loadAnnouncements(1);
            
            newModal.show();
        }, 300);
    }
    
    async showBeheerView() {
        console.log('Showing beheer view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(async () => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getBeheerModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupBeheerEvents();
            this.currentPage = 1;
            await this.loadAnnouncementsForBeheer(1);
            
            newModal.show();
        }, 300);
    }
    
    showChoiceView() {
        console.log('Showing choice view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(() => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getChoiceModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupChoiceEvents();
            
            newModal.show();
        }, 300);
    }
    
    fixModalClose() {
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => {
                const openModals = document.querySelectorAll('.modal.show');
                const backdrops = document.querySelectorAll('.modal-backdrop');
                
                if (openModals.length === 0 && backdrops.length > 0) {
                    backdrops.forEach(backdrop => {
                        backdrop.remove();
                    });
                    
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }
            }, 50);
        });
    }
    
    translateModalContent() {
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const elements = modalElement.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
    }
    
    // Helper functies voor UI feedback
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

// Maak een globale instantie aan
const NestAankondigingenManagerInstance = new NestAankondigingenManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NestAankondigingenManagerInstance;
} else {
    window.NestAankondigingenManager = NestAankondigingenManagerInstance;
    window.nestAankondigingenManager = NestAankondigingenManagerInstance;
}

console.log('📦 NestAankondigingenManager geladen met 1 per pagina, paginatie 80%, tekst 70%, nestfoto\'s MET OPMERKINGEN (max 15, 1 per keer met paginatie)');