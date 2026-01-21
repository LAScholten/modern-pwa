// js/modules/PhotoManager.js

/**
 * Foto Management Module voor Supabase
 * Beheert foto upload en galerij
 */

class PhotoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.isLoadingAllDogs = false;
        this.totalDogsLoaded = 0;
        
        this.translations = {
            nl: {
                photoGallery: "Foto Galerij",
                photoInfo: "Foto Galerij - Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.",
                photoUpload: "Foto Uploaden",
                selectDog: "Selecteer Hond",
                searchDog: "Zoek hond op naam, kennel of stamboomnr...",
                selectPhoto: "Selecteer Foto",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF, WebP",
                description: "Beschrijving (optioneel)",
                describePhoto: "Beschrijf de foto...",
                uploadPhoto: "Foto Uploaden",
                noDogsFound: "Geen honden gevonden",
                loadingAllDogs: "Alle honden laden...",
                loadedDogs: "honden geladen",
                photoOverview: "Foto Overzicht",
                noPhotos: "Er zijn nog geen foto's geüpload",
                loadingPhotos: "Foto's laden...",
                loadAllPhotos: "Laad alle foto's",
                unknownDog: "Onbekende hond",
                noDescription: "Geen beschrijving",
                delete: "Verwijderen",
                view: "Bekijken",
                allPhotos: "Alle Foto's",
                close: "Sluiten",
                photoDetails: "Foto Details",
                dog: "Hond",
                filename: "Bestandsnaam",
                size: "Grootte",
                type: "Type",
                uploadedOn: "Geüpload op",
                by: "Door",
                nextPhoto: "Volgende",
                prevPhoto: "Vorige",
                selectDogFirst: "Selecteer eerst een hond",
                selectPhotoFirst: "Selecteer eerst een foto",
                fileTooLarge: "Bestand is te groot (maximaal 5MB)",
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan",
                uploading: "Foto uploaden...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                loading: "Foto's laden...",
                loadFailed: "Laden mislukt: ",
                deleteConfirm: "Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                deleting: "Foto verwijderen...",
                deleteSuccess: "Foto succesvol verwijderd!",
                deleteFailed: "Verwijderen mislukt: ",
                photoNotFound: "Foto niet gevonden",
                loadDetailsFailed: "Fout bij laden foto details: ",
                searchToFindDogs: "Typ om te zoeken...",
                loadingProgress: "Honden laden: "
            },
            en: {
                photoGallery: "Photo Gallery",
                photoInfo: "Photo Gallery - View and manage dog photos. Upload new photos or delete existing ones.",
                photoUpload: "Photo Upload",
                selectDog: "Select Dog",
                searchDog: "Search dog by name, kennel or pedigree number...",
                selectPhoto: "Select Photo",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF, WebP",
                description: "Description (optional)",
                describePhoto: "Describe the photo...",
                uploadPhoto: "Upload Photo",
                noDogsFound: "No dogs found",
                loadingAllDogs: "Loading all dogs...",
                loadedDogs: "dogs loaded",
                photoOverview: "Photo Overview",
                noPhotos: "No photos uploaded yet",
                loadingPhotos: "Loading photos...",
                loadAllPhotos: "Load all photos",
                unknownDog: "Unknown dog",
                noDescription: "No description",
                delete: "Delete",
                view: "View",
                allPhotos: "All Photos",
                close: "Close",
                photoDetails: "Photo Details",
                dog: "Dog",
                filename: "Filename",
                size: "Size",
                type: "Type",
                uploadedOn: "Uploaded on",
                by: "By",
                nextPhoto: "Next",
                prevPhoto: "Previous",
                selectDogFirst: "Select a dog first",
                selectPhotoFirst: "Select a photo first",
                fileTooLarge: "File is too large (maximum 5MB)",
                invalidType: "Invalid file type. Only JPG, PNG, GIF and WebP are allowed",
                uploading: "Uploading photo...",
                uploadSuccess: "Photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                loading: "Loading photos...",
                loadFailed: "Loading failed: ",
                deleteConfirm: "Are you sure you want to delete this photo? This cannot be undone.",
                deleting: "Deleting photo...",
                deleteSuccess: "Photo successfully deleted!",
                deleteFailed: "Delete failed: ",
                photoNotFound: "Photo not found",
                loadDetailsFailed: "Error loading photo details: ",
                searchToFindDogs: "Type to search...",
                loadingProgress: "Loading dogs: "
            },
            de: {
                photoGallery: "Foto Galerie",
                photoInfo: "Foto Galerie - Hunderfotos ansehen und verwalten. Laden Sie neue Fotos hoch oder löschen Sie vorhandene.",
                photoUpload: "Foto Upload",
                selectDog: "Hund auswählen",
                searchDog: "Hund nach Namen, Zwinge oder Stammbaumnummer suchen...",
                selectPhoto: "Foto auswählen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF, WebP",
                description: "Beschreibung (optional)",
                describePhoto: "Beschreiben Sie das Foto...",
                uploadPhoto: "Foto hochladen",
                noDogsFound: "Keine Hunde gefunden",
                loadingAllDogs: "Alle Hunde laden...",
                loadedDogs: "Hunde geladen",
                photoOverview: "Foto Übersicht",
                noPhotos: "Noch keine Fotos hochgeladen",
                loadingPhotos: "Fotos laden...",
                loadAllPhotos: "Alle Fotos laden",
                unknownDog: "Unbekannter Hund",
                noDescription: "Keine Beschreibung",
                delete: "Löschen",
                view: "Ansehen",
                allPhotos: "Alle Fotos",
                close: "Schließen",
                photoDetails: "Foto Details",
                dog: "Hund",
                filename: "Dateiname",
                size: "Größe",
                type: "Typ",
                uploadedOn: "Hochgeladen am",
                by: "Von",
                nextPhoto: "Nächste",
                prevPhoto: "Vorherige",
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                selectPhotoFirst: "Wählen Sie zuerst ein Foto",
                fileTooLarge: "Datei ist zu groß (maximal 5MB)",
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG, GIF und WebP sind erlaubt",
                uploading: "Foto wird hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                loading: "Lade Fotos...",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher, dass Sie dieses Foto löschen möchten? Dies kann nicht rückgängig gemacht werden.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                photoNotFound: "Foto nicht gefunden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: ",
                searchToFindDogs: "Tippen Sie zum Suchen...",
                loadingProgress: "Hunde laden: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('photoGalleryModal')) {
            this.loadPhotosData();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title" id="photoGalleryModalLabel">
                                <i class="bi bi-images"></i> ${t('photoGallery')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-4">
                                <i class="bi bi-info-circle"></i>
                                ${t('photoInfo')}
                            </div>
                            
                            <div class="row mb-4">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-upload"></i> ${t('photoUpload')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="photoHondSearch" class="form-label">${t('selectDog')}</label>
                                                        <div class="dropdown">
                                                            <input type="text" class="form-control" id="photoHondSearch" 
                                                                   placeholder="${t('searchDog')}" autocomplete="off">
                                                            <div class="dropdown-menu w-100" id="dogDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                                <div class="dropdown-item text-muted">${t('loadingAllDogs')}</div>
                                                            </div>
                                                        </div>
                                                        <div id="dogLoadingStatus" class="form-text text-muted small"></div>
                                                        <input type="hidden" id="selectedDogId">
                                                        <input type="hidden" id="selectedDogStamboomnr">
                                                        <input type="hidden" id="selectedDogName">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="photoFile" class="form-label">${t('selectPhoto')}</label>
                                                        <input class="form-control" type="file" id="photoFile" accept="image/*">
                                                        <div class="form-text">${t('maxSize')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="photoDescription" class="form-label">${t('description')}</label>
                                                <textarea class="form-control" id="photoDescription" rows="2" placeholder="${t('describePhoto')}"></textarea>
                                            </div>
                                            <button class="btn btn-warning w-100" id="uploadPhotoBtn">
                                                <i class="bi bi-upload"></i> ${t('uploadPhoto')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0">${t('photoOverview')}</h6>
                                    <button class="btn btn-outline-warning" id="loadAllPhotosBtn">
                                        <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                                    </button>
                                </div>
                                <div id="photosContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-images display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('noPhotos')}</p>
                                        <button class="btn btn-warning" id="initialLoadPhotosBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                                        </button>
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
    
    setupEvents() {
        const uploadBtn = document.getElementById('uploadPhotoBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.uploadPhoto();
            });
        }
        
        const loadBtn = document.getElementById('loadAllPhotosBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadAllPhotos();
            });
        }
        
        const initialLoadBtn = document.getElementById('initialLoadPhotosBtn');
        if (initialLoadBtn) {
            initialLoadBtn.addEventListener('click', () => {
                this.loadAllPhotos();
            });
        }
        
        this.setupDogSearch();
        
        this.fixPhotoModalClose();
    }
    
    fixPhotoModalClose() {
        const modalElement = document.getElementById('photoGalleryModal');
        if (!modalElement) return;
        
        modalElement.addEventListener('hide.bs.modal', () => {
            const closeBtn = modalElement.querySelector('.btn-close:focus');
            if (closeBtn) {
                closeBtn.blur();
            }
            
            const focused = modalElement.querySelector(':focus');
            if (focused) {
                focused.blur();
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => {
                this.cleanupModalAfterClose();
            }, 50);
        });
    }
    
    cleanupModalAfterClose() {
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
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('photoHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Laad ALLE honden bij eerste focus - PRECIES zoals SearchManager
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0 && !this.isLoadingAllDogs) {
                await this.loadAllDogs();
            }
            this.filterDogs(searchInput.value);
            dropdownMenu.classList.add('show');
        });
        
        // Filter bij elke toetsaanslag
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterDogs(searchTerm);
            dropdownMenu.classList.add('show');
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Toon dropdown bij klik
        searchInput.addEventListener('click', () => {
            if (this.allDogs.length > 0) {
                this.filterDogs(searchInput.value);
                dropdownMenu.classList.add('show');
            }
        });
    }
    
    async loadAllDogs() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const loadingStatus = document.getElementById('dogLoadingStatus');
        const t = this.t.bind(this);
        
        if (this.isLoadingAllDogs) return;
        
        this.isLoadingAllDogs = true;
        this.allDogs = [];
        this.totalDogsLoaded = 0;
        
        if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    <i class="bi bi-hourglass-split me-2"></i>${t('loadingAllDogs')}...
                </div>
            `;
        }
        
        if (loadingStatus) {
            loadingStatus.innerHTML = `<i class="bi bi-hourglass-split"></i> ${t('loadingAllDogs')}...`;
        }
        
        try {
            let page = 1;
            const pageSize = 1000; // Batch grootte
            let hasMore = true;
            let totalDogs = 0;
            
            // Laad eerste pagina om totaal te krijgen
            const firstResult = await window.hondenService.getHonden(page, pageSize);
            totalDogs = firstResult.totaal || 0;
            
            if (firstResult.honden && firstResult.honden.length > 0) {
                this.allDogs = [...this.allDogs, ...firstResult.honden];
                this.totalDogsLoaded += firstResult.honden.length;
                
                if (loadingStatus) {
                    loadingStatus.innerHTML = `${t('loadingProgress')} ${this.totalDogsLoaded} / ${totalDogs}`;
                }
            }
            
            hasMore = firstResult.heeftVolgende;
            page++;
            
            // Laad de rest van de pagina's (max 100.000 records)
            while (hasMore && page <= 100 && this.totalDogsLoaded < 100000) {
                if (loadingStatus) {
                    loadingStatus.innerHTML = `${t('loadingProgress')} ${this.totalDogsLoaded} / ${totalDogs}`;
                }
                
                const result = await window.hondenService.getHonden(page, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    this.allDogs = [...this.allDogs, ...result.honden];
                    this.totalDogsLoaded += result.honden.length;
                }
                
                hasMore = result.heeftVolgende;
                page++;
                
                // Kleine pauze om UI te updaten
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            
            console.log(`PhotoManager: ${this.allDogs.length} honden geladen`);
            
            if (loadingStatus) {
                loadingStatus.innerHTML = `<i class="bi bi-check-circle text-success"></i> ${this.allDogs.length} ${t('loadedDogs')}`;
            }
            
            // Toon alle honden in dropdown
            this.filterDogs('');
            
        } catch (error) {
            console.error('Fout bij laden alle honden:', error);
            
            if (dropdownMenu) {
                dropdownMenu.innerHTML = `
                    <div class="dropdown-item text-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>Fout bij laden honden
                    </div>
                `;
            }
            
            if (loadingStatus) {
                loadingStatus.innerHTML = `<i class="bi bi-exclamation-triangle text-danger"></i> Fout bij laden`;
            }
        } finally {
            this.isLoadingAllDogs = false;
        }
    }
    
    filterDogs(searchTerm = '') {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        if (this.isLoadingAllDogs) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    <i class="bi bi-hourglass-split me-2"></i>${t('loadingAllDogs')}...
                </div>
            `;
            return;
        }
        
        if (this.allDogs.length === 0) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    ${t('searchToFindDogs')}
                </div>
            `;
            return;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        
        if (searchLower === '') {
            this.filteredDogs = this.allDogs.slice(0, 100); // Toon eerste 100 bij lege zoekopdracht
        } else {
            // Zoek in naam, kennelnaam, stamboomnr en ras - PRECIES zoals SearchManager
            this.filteredDogs = this.allDogs.filter(dog => {
                const naam = (dog.naam || '').toLowerCase();
                const kennelnaam = (dog.kennelnaam || '').toLowerCase();
                const stamboomnr = (dog.stamboomnr || '').toLowerCase();
                const ras = (dog.ras || '').toLowerCase();
                
                return naam.includes(searchLower) ||
                       kennelnaam.includes(searchLower) ||
                       stamboomnr.includes(searchLower) ||
                       ras.includes(searchLower);
            });
        }
        
        this.updateDropdownMenu();
    }
    
    updateDropdownMenu() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        if (this.filteredDogs.length === 0) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    ${t('noDogsFound')}
                </div>
            `;
            return;
        }
        
        let html = '';
        const displayCount = Math.min(this.filteredDogs.length, 100); // Max 100 tonen
        
        for (let i = 0; i < displayCount; i++) {
            const dog = this.filteredDogs[i];
            const displayName = `${dog.naam || ''}${dog.kennelnaam ? ` (${dog.kennelnaam})` : ''}`;
            const displayInfo = `${dog.ras || ''}${dog.stamboomnr ? ` • ${dog.stamboomnr}` : ''}`;
            
            html += `
                <a class="dropdown-item" href="#" data-dog-id="${dog.id}" data-stamboomnr="${dog.stamboomnr || ''}" data-dog-name="${displayName}">
                    <div>
                        <strong>${displayName}</strong>
                        <div class="small text-muted">
                            ${displayInfo}
                        </div>
                    </div>
                </a>
            `;
        }
        
        // Toon telling als er meer zijn
        if (this.filteredDogs.length > 100) {
            html += `
                <div class="dropdown-item text-center text-muted small">
                    ... en nog ${this.filteredDogs.length - 100} honden
                </div>
            `;
        }
        
        dropdownMenu.innerHTML = html;
        
        // Event listeners voor hond selectie
        dropdownMenu.querySelectorAll('.dropdown-item[data-dog-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDog(
                    item.dataset.dogId,
                    item.dataset.stamboomnr,
                    item.dataset.dogName
                );
                dropdownMenu.classList.remove('show');
            });
        });
        
        dropdownMenu.classList.add('show');
    }
    
    selectDog(dogId, stamboomnr, dogName) {
        const searchInput = document.getElementById('photoHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const dogNameInput = document.getElementById('selectedDogName');
        
        if (searchInput) searchInput.value = dogName;
        if (dogIdInput) dogIdInput.value = dogId;
        if (stamboomnrInput) stamboomnrInput.value = stamboomnr;
        if (dogNameInput) dogNameInput.value = dogName;
    }
    
    async loadPhotosData() {
        // Wordt aangeroepen wanneer modal geopend wordt
    }
    
    async uploadPhoto() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        const dogName = document.getElementById('selectedDogName').value;
        const fileInput = document.getElementById('photoFile');
        const description = document.getElementById('photoDescription').value.trim();
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectPhotoFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError(t('fileTooLarge'));
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError(t('invalidType'));
            return;
        }
        
        this.showProgress(t('uploading'));
        
        try {
            const user = window.auth ? window.auth.getCurrentUser() : null;
            if (!user || !user.id) {
                throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
            }
            
            const timestamp = Date.now();
            const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${safeFilename}`;
            const filePath = `fotos/${stamboomnr}/${fileName}`;
            
            console.log('Uploading to:', filePath);
            
            const { data: uploadData, error: uploadError } = await window.supabase
                .storage
                .from('fotos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                throw uploadError;
            }
            
            console.log('Upload successful, getting public URL...');
            
            const { data: urlData } = await window.supabase
                .storage
                .from('fotos')
                .getPublicUrl(filePath);
            
            console.log('Public URL:', urlData.publicUrl);
            
            const fotoData = {
                stamboomnr: stamboomnr,
                filename: file.name,
                filepath: filePath,
                url: urlData.publicUrl,
                size: file.size,
                type: file.type,
                description: description,
                uploaded_by: user.id,
                uploaded_at: new Date().toISOString()
            };
            
            console.log('Inserting into database:', fotoData);
            
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
            
            this.hideProgress();
            this.showSuccess(t('uploadSuccess'));
            
            document.getElementById('photoHondSearch').value = '';
            document.getElementById('selectedDogId').value = '';
            document.getElementById('selectedDogStamboomnr').value = '';
            document.getElementById('selectedDogName').value = '';
            document.getElementById('photoDescription').value = '';
            fileInput.value = '';
            
            await this.loadAllPhotos();
            
        } catch (error) {
            console.error('Upload error:', error);
            this.hideProgress();
            this.showError(`${t('uploadFailed')}${error.message}`);
        }
    }
    
    async loadAllPhotos() {
        const t = this.t.bind(this);
        this.showProgress(t('loading'));
        
        try {
            const result = await window.fotoService.getFotosMetPaginatie(
                null,
                1,
                12
            );
            
            this.hideProgress();
            await this.displayPhotos(result.fotos || []);
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.hideProgress();
            this.showError(`${t('loadFailed')}${error.message}`);
        }
    }
    
    async displayPhotos(fotos) {
        const t = this.t.bind(this);
        const container = document.getElementById('photosContainer');
        if (!container) return;
        
        if (!fotos || fotos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-images display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noPhotos')}</p>
                    <button class="btn btn-warning" id="initialLoadPhotosBtn">
                        <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                    </button>
                </div>
            `;
            
            const loadBtn = document.getElementById('initialLoadPhotosBtn');
            if (loadBtn) {
                loadBtn.addEventListener('click', () => {
                    this.loadAllPhotos();
                });
            }
            
            return;
        }
        
        let html = '';
        
        for (const foto of fotos) {
            let dog = null;
            if (foto.stamboomnr) {
                try {
                    dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                } catch (error) {
                    console.error('Error loading dog info:', error);
                }
            }
            
            const dogName = dog ? `${dog.naam || ''}${dog.kennelnaam ? ` (${dog.kennelnaam})` : ''}` : t('unknownDog');
            const uploadDatum = new Date(foto.uploaded_at || foto.uploadedAt).toLocaleDateString(this.currentLang);
            const description = foto.description || '';
            const imageUrl = foto.url || foto.data;
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 180px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-foto-id="${foto.id}">
                            ${imageUrl ? 
                                `<img src="${imageUrl}" alt="${description || dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover;"
                                      onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" fill=\"%236c757d\"><rect width=\"100%\" height=\"100%\" fill=\"%23f8f9fa\"/><text x=\"50%\" y=\"50%\" dy=\".3em\" text-anchor=\"middle\" font-size=\"14\">Image</text></svg>'">` :
                                `<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-2 text-truncate" title="${dogName}">${dogName}</h6>
                            ${description ? `
                                <p class="card-text small text-muted flex-grow-1" style="max-height: 60px; overflow: hidden;">
                                    ${description}
                                </p>
                            ` : ''}
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">${uploadDatum}</small>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" 
                                            data-id="${foto.id}" 
                                            data-filepath="${foto.filepath || ''}"
                                            title="${t('delete')}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        document.querySelectorAll('.photo-thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                const fotoId = e.currentTarget.dataset.fotoId;
                this.showPhotoDetails(fotoId);
            });
        });
        
        document.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fotoId = btn.dataset.id;
                const filepath = btn.dataset.filepath;
                await this.deletePhoto(fotoId, filepath);
            });
        });
    }
    
    async showPhotoDetails(fotoId) {
        const t = this.t.bind(this);
        
        try {
            const { data: foto, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('id', fotoId)
                .single();
            
            if (error) throw error;
            
            let dog = null;
            if (foto.stamboomnr) {
                dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
            }
            
            const dogName = dog ? `${dog.naam || ''}${dog.kennelnaam ? ` (${dog.kennelnaam})` : ''}` : t('unknownDog');
            
            const modalHTML = `
                <div class="modal fade" id="photoDetailsModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-image"></i> ${t('photoDetails')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="text-center mb-3">
                                            ${foto.url ? 
                                                `<img src="${foto.url}" alt="${foto.description || dogName}" 
                                                      class="img-fluid rounded shadow" style="max-height: 60vh; max-width: 100%;">` :
                                                `<div class="bg-light p-5 rounded text-center">
                                                    <i class="bi bi-image text-muted" style="font-size: 5rem;"></i>
                                                    <p class="mt-3 text-muted">${t('photoNotFound')}</p>
                                                </div>`
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card">
                                            <div class="card-body">
                                                <table class="table table-sm">
                                                    <tr>
                                                        <th style="width: 40%">${t('dog')}:</th>
                                                        <td><strong>${dogName}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <th>${t('filename')}:</th>
                                                        <td><small>${foto.filename}</small></td>
                                                    </tr>
                                                    <tr>
                                                        <th>${t('size')}:</th>
                                                        <td>${foto.size ? Math.round(foto.size / 1024) + ' KB' : '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${t('type')}:</th>
                                                        <td>${foto.type || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>${t('uploadedOn')}:</th>
                                                        <td>${new Date(foto.uploaded_at).toLocaleString(this.currentLang)}</td>
                                                    </tr>
                                                </table>
                                                
                                                ${foto.description ? `
                                                <div class="mt-3">
                                                    <h6 class="border-bottom pb-2">${t('description')}</h6>
                                                    <div class="bg-light p-3 rounded small">
                                                        ${foto.description}
                                                    </div>
                                                </div>
                                                ` : ''}
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
            
            const container = document.getElementById('modalsContainer');
            container.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('photoDetailsModal');
            const modal = new bootstrap.Modal(modalElement);
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
            modal.show();
            
        } catch (error) {
            console.error('Error showing photo details:', error);
            this.showError(`${t('loadDetailsFailed')}${error.message}`);
        }
    }
    
    async deletePhoto(fotoId, filepath) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'));
        
        try {
            if (filepath) {
                const { error: storageError } = await window.supabase
                    .storage
                    .from('fotos')
                    .remove([filepath]);
                
                if (storageError) {
                    console.warn('Could not delete file from storage:', storageError);
                }
            }
            
            const { error: dbError } = await window.supabase
                .from('fotos')
                .delete()
                .eq('id', fotoId);
            
            if (dbError) throw dbError;
            
            this.hideProgress();
            this.showSuccess(t('deleteSuccess'));
            
            await this.loadAllPhotos();
            
        } catch (error) {
            console.error('Error deleting photo:', error);
            this.hideProgress();
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }
}