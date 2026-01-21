// js/modules/PhotoManager.js

/**
 * Foto Management Module voor Supabase
 * Beheert foto upload en galerij met paginatie
 */

class PhotoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.currentDogPage = 1;
        this.dogsPerPage = 50;
        this.totalDogs = 0;
        this.isLoadingDogs = false;
        this.hasMoreDogs = true;
        
        this.translations = {
            nl: {
                // Modal titels
                photoGallery: "Foto Galerij",
                photoInfo: "Foto Galerij - Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.",
                
                // Upload sectie
                photoUpload: "Foto Uploaden",
                selectDog: "Selecteer Hond",
                searchDog: "Zoek hond op naam of stamboomnr...",
                selectPhoto: "Selecteer Foto",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF, WebP",
                description: "Beschrijving (optioneel)",
                describePhoto: "Beschrijf de foto...",
                uploadPhoto: "Foto Uploaden",
                noDogsFound: "Geen honden gevonden",
                loadingDogs: "Honden laden...",
                loadMoreDogs: "Meer honden laden",
                
                // Overzicht
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
                
                // Foto details
                photoDetails: "Foto Details",
                dog: "Hond",
                filename: "Bestandsnaam",
                size: "Grootte",
                type: "Type",
                uploadedOn: "Geüpload op",
                by: "Door",
                nextPhoto: "Volgende",
                prevPhoto: "Vorige",
                
                // Alerts
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
                searchToFindDogs: "Typ minimaal 2 letters om te zoeken"
            },
            en: {
                // Modal titles
                photoGallery: "Photo Gallery",
                photoInfo: "Photo Gallery - View and manage dog photos. Upload new photos or delete existing ones.",
                
                // Upload section
                photoUpload: "Photo Upload",
                selectDog: "Select Dog",
                searchDog: "Search dog by name or pedigree number...",
                selectPhoto: "Select Photo",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF, WebP",
                description: "Description (optional)",
                describePhoto: "Describe the photo...",
                uploadPhoto: "Upload Photo",
                noDogsFound: "No dogs found",
                loadingDogs: "Loading dogs...",
                loadMoreDogs: "Load more dogs",
                
                // Overview
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
                
                // Photo details
                photoDetails: "Photo Details",
                dog: "Dog",
                filename: "Filename",
                size: "Size",
                type: "Type",
                uploadedOn: "Uploaded on",
                by: "By",
                nextPhoto: "Next",
                prevPhoto: "Previous",
                
                // Alerts
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
                searchToFindDogs: "Type at least 2 letters to search"
            },
            de: {
                // Modal Titel
                photoGallery: "Foto Galerie",
                photoInfo: "Foto Galerie - Hunderfotos ansehen und verwalten. Laden Sie neue Fotos hoch oder löschen Sie vorhandene.",
                
                // Upload Bereich
                photoUpload: "Foto Upload",
                selectDog: "Hund auswählen",
                searchDog: "Hund nach Namen oder Stammbaumnummer suchen...",
                selectPhoto: "Foto auswählen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF, WebP",
                description: "Beschreibung (optional)",
                describePhoto: "Beschreiben Sie das Foto...",
                uploadPhoto: "Foto hochladen",
                noDogsFound: "Keine Hunde gefunden",
                loadingDogs: "Hunde laden...",
                loadMoreDogs: "Mehr Hunde laden",
                
                // Übersicht
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
                
                // Foto Details
                photoDetails: "Foto Details",
                dog: "Hund",
                filename: "Dateiname",
                size: "Größe",
                type: "Typ",
                uploadedOn: "Hochgeladen am",
                by: "Von",
                nextPhoto: "Nächste",
                prevPhoto: "Vorherige",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                selectPhotoFirst: "Wählen Sie zuerst ein Foto",
                fileTooLarge: "Datei ist zu groot (maximal 5MB)",
                invalidType: "Ungeldiger Dateityp. Nur JPG, PNG, GIF und WebP sind erlaubt",
                uploading: "Foto wird hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                loading: "Lade Fotos...",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher dat u dit foto wilt verwijderen? Dies kann nicht rückgängig gemacht werden.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                photoNotFound: "Foto nicht gevonden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: ",
                searchToFindDogs: "Geben Sie mindestens 2 Buchstaben ein, um zu suchen"
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
                                                                <div class="dropdown-item text-muted">${t('searchToFindDogs')}</div>
                                                            </div>
                                                        </div>
                                                        <input type="hidden" id="selectedDogId">
                                                        <input type="hidden" id="selectedDogStamboomnr">
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
        
        // FIX: Voeg modal close fix toe
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
        
        // Reset state bij focus
        searchInput.addEventListener('focus', () => {
            this.allDogs = [];
            this.filteredDogs = [];
            this.currentDogPage = 1;
            this.hasMoreDogs = true;
        });
        
        // Zoeken bij input met debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length >= 2) {
                searchTimeout = setTimeout(() => {
                    this.searchDogs(searchTerm);
                }, 300);
            } else {
                dropdownMenu.classList.remove('show');
                dropdownMenu.innerHTML = `
                    <div class="dropdown-item text-muted">
                        ${this.t('searchToFindDogs')}
                    </div>
                `;
            }
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    async searchDogs(searchTerm) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        if (this.isLoadingDogs) return;
        
        this.isLoadingDogs = true;
        dropdownMenu.innerHTML = `
            <div class="dropdown-item text-muted">
                <i class="bi bi-hourglass-split"></i> ${this.t('loadingDogs')}...
            </div>
        `;
        dropdownMenu.classList.add('show');
        
        try {
            // Reset bij nieuwe zoekopdracht
            if (this.currentDogPage === 1) {
                this.allDogs = [];
                this.filteredDogs = [];
            }
            
            // Zoek honden via Supabase service (zoals SearchManager)
            const criteria = {
                naam: searchTerm,
                kennelnaam: searchTerm,
                stamboomnr: searchTerm
            };
            
            const result = await window.hondenService.zoekHonden(
                criteria,
                this.currentDogPage,
                this.dogsPerPage
            );
            
            if (result.honden && result.honden.length > 0) {
                // Voeg nieuwe honden toe
                this.allDogs = [...this.allDogs, ...result.honden];
                this.filteredDogs = this.allDogs;
                this.hasMoreDogs = result.heeftVolgende;
                this.currentDogPage++;
                
                this.updateDropdownMenu(result.honden.length);
            } else {
                this.updateDropdownMenu(0);
                this.hasMoreDogs = false;
            }
            
        } catch (error) {
            console.error('Fout bij zoeken honden:', error);
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-danger">
                    <i class="bi bi-exclamation-triangle"></i> Fout bij laden
                </div>
            `;
        } finally {
            this.isLoadingDogs = false;
        }
    }
    
    updateDropdownMenu(newResultsCount = 0) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (this.filteredDogs.length === 0) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    ${t('noDogsFound')}
                </div>
            `;
            return;
        }
        
        // Toon maximaal 20 honden in dropdown
        const displayDogs = this.filteredDogs.slice(0, 20);
        
        displayDogs.forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam || ''} ${dog.kennelnaam ? `(${dog.kennelnaam})` : ''}</strong>
                    <div class="small text-muted">
                        ${dog.ras || ''} • ${dog.stamboomnr || ''}
                    </div>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDog(dog);
                dropdownMenu.classList.remove('show');
            });
            
            dropdownMenu.appendChild(item);
        });
        
        // Toon "meer laden" knop als er meer zijn
        if (this.hasMoreDogs && this.filteredDogs.length >= 20) {
            const loadMoreItem = document.createElement('a');
            loadMoreItem.className = 'dropdown-item text-center text-primary';
            loadMoreItem.href = '#';
            loadMoreItem.innerHTML = `
                <i class="bi bi-chevron-down"></i> ${t('loadMoreDogs')}
            `;
            
            loadMoreItem.addEventListener('click', (e) => {
                e.preventDefault();
                const searchInput = document.getElementById('photoHondSearch');
                if (searchInput && searchInput.value.length >= 2) {
                    this.searchDogs(searchInput.value);
                }
            });
            
            dropdownMenu.appendChild(loadMoreItem);
        }
        
        dropdownMenu.classList.add('show');
    }
    
    selectDog(dog) {
        const searchInput = document.getElementById('photoHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        
        if (searchInput) {
            searchInput.value = `${dog.naam || ''} ${dog.kennelnaam ? `(${dog.kennelnaam})` : ''}`;
        }
        if (dogIdInput) {
            dogIdInput.value = dog.id;
        }
        if (stamboomnrInput) {
            stamboomnrInput.value = dog.stamboomnr || '';
        }
    }
    
    async loadPhotosData() {
        // Leeg - wordt alleen gebruikt als modal geopend wordt
    }
    
    async uploadPhoto() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
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
            // Upload naar Supabase Storage (zoals in supabase-honden.js)
            const user = window.auth ? window.auth.getCurrentUser() : null;
            
            if (!user || !user.id) {
                throw new Error('Gebruiker niet ingelogd of geen user ID beschikbaar');
            }
            
            // Maak unieke bestandsnaam
            const timestamp = Date.now();
            const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${safeFilename}`;
            const filePath = `fotos/${stamboomnr}/${fileName}`;
            
            // Upload naar Supabase Storage
            const { data: uploadData, error: uploadError } = await window.supabase
                .storage
                .from('fotos')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Haal publieke URL op
            const { data: urlData } = await window.supabase
                .storage
                .from('fotos')
                .getPublicUrl(filePath);
            
            // Voeg metadata toe aan fotos tabel
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
            
            const { data: dbData, error: dbError } = await window.supabase
                .from('fotos')
                .insert(fotoData)
                .select()
                .single();
            
            if (dbError) throw dbError;
            
            this.hideProgress();
            this.showSuccess(t('uploadSuccess'));
            
            // Formulier resetten
            document.getElementById('photoHondSearch').value = '';
            document.getElementById('selectedDogId').value = '';
            document.getElementById('selectedDogStamboomnr').value = '';
            document.getElementById('photoDescription').value = '';
            fileInput.value = '';
            
            await this.loadAllPhotos();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('uploadFailed')}${error.message}`);
        }
    }
    
    async loadAllPhotos() {
        const t = this.t.bind(this);
        this.showProgress(t('loading'));
        
        try {
            // Gebruik de fotoService uit supabase-honden.js
            const result = await window.fotoService.getFotosMetPaginatie(
                null, // Alle foto's
                1, // Pagina 1
                12 // 12 foto's per pagina
            );
            
            this.hideProgress();
            await this.displayPhotos(result.fotos || []);
            
        } catch (error) {
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
            // Laad hond informatie indien nodig
            let dog = this.allDogs.find(d => d.stamboomnr === foto.stamboomnr);
            if (!dog) {
                try {
                    dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                    if (dog) this.allDogs.push(dog);
                } catch (error) {
                    console.error('Fout bij laden hond info:', error);
                }
            }
            
            const dogName = dog ? `${dog.naam || ''} ${dog.kennelnaam ? `(${dog.kennelnaam})` : ''}` : t('unknownDog');
            const uploadDatum = new Date(foto.uploaded_at || foto.uploadedAt).toLocaleDateString(this.currentLang);
            const description = foto.description || '';
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 180px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-foto-id="${foto.id}">
                            ${foto.url || foto.data ? 
                                `<img src="${foto.url || foto.data}" alt="${description || dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-2">${dogName}</h6>
                            ${description ? `
                                <p class="card-text small text-muted flex-grow-1">
                                    ${description}
                                </p>
                            ` : ''}
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">${uploadDatum}</small>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" 
                                            data-id="${foto.id}" 
                                            data-filepath="${foto.filepath || ''}">
                                        <i class="bi bi-trash"></i> ${t('delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Event listener voor thumbnails
        document.querySelectorAll('.photo-thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                const fotoId = e.currentTarget.dataset.fotoId;
                this.showPhotoDetails(fotoId);
            });
        });
        
        // Event listener voor delete knoppen
        document.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fotoId = e.currentTarget.dataset.id;
                const filepath = e.currentTarget.dataset.filepath;
                await this.deletePhoto(fotoId, filepath);
            });
        });
    }
    
    async showPhotoDetails(fotoId) {
        const t = this.t.bind(this);
        
        try {
            // Haal foto details op
            const { data: foto, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('id', fotoId)
                .single();
            
            if (error) throw error;
            
            // Haal hond informatie op
            let dog = this.allDogs.find(d => d.stamboomnr === foto.stamboomnr);
            if (!dog) {
                dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
            }
            
            const dogName = dog ? `${dog.naam || ''} ${dog.kennelnaam ? `(${dog.kennelnaam})` : ''}` : t('unknownDog');
            
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
                                                      class="img-fluid rounded shadow" style="max-height: 60vh;">` :
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
                                                        <td>${foto.size ? (foto.size / 1024).toFixed(1) + ' KB' : '-'}</td>
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
            // Verwijder uit storage als er een filepath is
            if (filepath) {
                const { error: storageError } = await window.supabase
                    .storage
                    .from('fotos')
                    .remove([filepath]);
                
                if (storageError) {
                    console.warn('Kon bestand niet verwijderen uit storage:', storageError);
                }
            }
            
            // Verwijder uit database
            const { error: dbError } = await window.supabase
                .from('fotos')
                .delete()
                .eq('id', fotoId);
            
            if (dbError) throw dbError;
            
            this.hideProgress();
            this.showSuccess(t('deleteSuccess'));
            
            // Herlaad foto's
            await this.loadAllPhotos();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }
}