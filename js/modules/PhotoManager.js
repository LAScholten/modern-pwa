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
        this.userRole = localStorage.getItem('userRole') || 'gebruiker';
        this.isAdmin = this.userRole === 'admin';
        this.isUser = this.userRole === 'gebruiker';
        this.isUserPlus = this.userRole === 'gebruiker+';
        this.currentView = 'gallery';
        
        // Paginatie variabelen
        this.currentPhotoPage = 1;
        this.photosPerPage = 12;
        this.totalPhotos = 0;
        this.totalPhotoPages = 0;
        this.isLoadingPhotos = false;
        
        // PhotoViewer referentie
        this.photoViewer = null;
        
        this.translations = {
            nl: {
                photoGallery: "Foto Galerij",
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
                unknownDog: "Onbekende hond",
                delete: "Verwijderen",
                close: "Sluiten",
                selectDogFirst: "Selecteer eerst een hond",
                selectPhotoFirst: "Selecteer eerst een foto",
                fileTooLarge: "Bestand is te groot (maximaal 5MB)",
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan",
                uploading: "Foto uploaden...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                loadFailed: "Laden mislukt: ",
                deleteConfirm: "Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                deleting: "Foto verwijderen...",
                deleteSuccess: "Foto succesvol verwijderd!",
                deleteFailed: "Verwijderen mislukt: ",
                searchToFindDogs: "Typ om te zoeken...",
                loadingProgress: "Honden laden: ",
                viewGallery: "Foto's Bekijken",
                uploadNewPhoto: "Foto Uploaden",
                chooseAction: "Kies een actie:",
                recentUploads: "Recent Geüploade Foto's",
                noRecentUploads: "Nog geen foto's geüpload",
                page: "Pagina",
                of: "van",
                nextPage: "Volgende",
                previousPage: "Vorige",
                showing: "Toont",
                to: "tot",
                ofTotal: "van de",
                photos: "foto's"
            },
            en: {
                photoGallery: "Photo Gallery",
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
                unknownDog: "Unknown dog",
                delete: "Delete",
                close: "Close",
                selectDogFirst: "Select a dog first",
                selectPhotoFirst: "Select a photo first",
                fileTooLarge: "File is too large (maximum 5MB)",
                invalidType: "Invalid file type. Only JPG, PNG, GIF and WebP are allowed",
                uploading: "Uploading photo...",
                uploadSuccess: "Photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                loadFailed: "Loading failed: ",
                deleteConfirm: "Are you sure you want to delete this photo? This cannot be undone.",
                deleting: "Deleting photo...",
                deleteSuccess: "Photo successfully deleted!",
                deleteFailed: "Delete failed: ",
                searchToFindDogs: "Type to search...",
                loadingProgress: "Loading dogs: ",
                viewGallery: "View Photos",
                uploadNewPhoto: "Upload Photo",
                chooseAction: "Choose an action:",
                recentUploads: "Recently Uploaded Photos",
                noRecentUploads: "No photos uploaded yet",
                page: "Page",
                of: "of",
                nextPage: "Next",
                previousPage: "Previous",
                showing: "Showing",
                to: "to",
                ofTotal: "of",
                photos: "photos"
            },
            de: {
                photoGallery: "Foto Galerie",
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
                unknownDog: "Unbekannter Hund",
                delete: "Löschen",
                close: "Schließen",
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                selectPhotoFirst: "Wählen Sie zuerst ein Foto",
                fileTooLarge: "Datei ist zu groß (maximal 5MB)",
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG, GIF und WebP sind erlaubt",
                uploading: "Foto wird hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher, dass Sie dieses Foto löschen möchten? Dies kann nicht rückgängig gemacht werden.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                searchToFindDogs: "Tippen Sie zum Suchen...",
                loadingProgress: "Hunde laden: ",
                viewGallery: "Fotos Ansehen",
                uploadNewPhoto: "Foto Hochladen",
                chooseAction: "Wählen Sie eine Aktion:",
                recentUploads: "Kürzlich hochgeladene Fotos",
                noRecentUploads: "Noch keine Fotos hochgeladen",
                page: "Seite",
                of: "von",
                nextPage: "Nächste",
                previousPage: "Vorherige",
                showing: "Zeigt",
                to: "bis",
                ofTotal: "von",
                photos: "Fotos"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    /**
     * Zorg dat PhotoViewer geladen is, laad hem anders dynamisch via script tag
     */
    async ensurePhotoViewer() {
        // Als PhotoViewer al bestaat, niets doen
        if (window.photoViewer && typeof window.photoViewer.showPhoto === 'function') {
            this.photoViewer = window.photoViewer;
            return;
        }
        
        console.log('📸 PhotoViewer wordt dynamisch geladen door PhotoManager...');
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/modules/PhotoViewer.js';
            script.onload = () => {
                // Wacht kort tot de PhotoViewer beschikbaar is
                let checkCount = 0;
                const checkInterval = setInterval(() => {
                    if (window.photoViewer) {
                        clearInterval(checkInterval);
                        this.photoViewer = window.photoViewer;
                        this.photoViewer.updateLanguage(this.currentLang);
                        console.log('✅ PhotoViewer geladen en klaar voor gebruik door PhotoManager');
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
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (this.photoViewer) {
            this.photoViewer.updateLanguage(lang);
        }
        if (window.photoViewer) {
            window.photoViewer.updateLanguage(lang);
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        if (this.isUser) {
            return this.getGalleryModalHTML();
        } else {
            return this.getChoiceModalHTML();
        }
    }
    
    getChoiceModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title" id="photoGalleryModalLabel">
                                <i class="bi bi-images"></i> ${t('photoGallery')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${t('chooseAction')}</h4>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-warning hover-shadow" style="cursor: pointer;" id="viewGalleryBtn">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-images display-1 text-warning mb-3"></i>
                                            <h5 class="card-title">${t('viewGallery')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="uploadPhotoBtnChoice">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-cloud-upload display-1 text-success mb-3"></i>
                                            <h5 class="card-title">${t('uploadNewPhoto')}</h5>
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
    
    getGalleryModalHTML() {
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
                            <div class="mt-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0">${t('photoOverview')}</h6>
                                    <div id="photosPaginationInfo" class="text-muted small"></div>
                                </div>
                                <div id="photosContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-images display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('loadingPhotos')}</p>
                                    </div>
                                </div>
                                
                                <div id="photosPagination" class="d-flex justify-content-center align-items-center mt-4"></div>
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
    
    getUploadModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="photoGalleryModalLabel">
                                <i class="bi bi-cloud-upload"></i> ${t('photoUpload')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
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
                                            <button class="btn btn-success w-100" id="uploadPhotoBtn">
                                                <i class="bi bi-upload"></i> ${t('uploadPhoto')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-5">
                                <h6 class="mb-3">${t('recentUploads')}</h6>
                                <div id="recentUploadsContainer" class="row">
                                    <div class="col-12 text-center py-3">
                                        <i class="bi bi-images text-muted"></i>
                                        <p class="mt-2 text-muted">${t('noRecentUploads')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-warning" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> Terug
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        if (this.isUser) {
            this.setupGalleryEvents();
        } else {
            this.setupChoiceEvents();
        }
    }
    
    setupChoiceEvents() {
        const viewGalleryBtn = document.getElementById('viewGalleryBtn');
        const uploadPhotoBtn = document.getElementById('uploadPhotoBtnChoice');
        
        if (viewGalleryBtn) {
            viewGalleryBtn.addEventListener('click', () => {
                this.showGalleryView();
            });
        }
        
        if (uploadPhotoBtn) {
            uploadPhotoBtn.addEventListener('click', () => {
                this.showUploadView();
            });
        }
        
        this.fixPhotoModalClose();
    }
    
    setupGalleryEvents() {
        this.fixPhotoModalClose();
    }
    
    setupUploadEvents() {
        const uploadBtn = document.getElementById('uploadPhotoBtn');
        const backBtn = document.getElementById('backToChoiceBtn');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.uploadPhoto();
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        this.setupDogSearch();
        this.fixPhotoModalClose();
        this.loadRecentUploads();
    }
    
    async showGalleryView() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('photoGalleryModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#photoGalleryModal').parentElement;
        modalContainer.innerHTML = this.getGalleryModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('photoGalleryModal'));
        newModal.show();
        
        this.setupGalleryEvents();
        this.currentPhotoPage = 1;
        await this.loadPhotosPage(this.currentPhotoPage);
    }
    
    async showUploadView() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('photoGalleryModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#photoGalleryModal').parentElement;
        modalContainer.innerHTML = this.getUploadModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('photoGalleryModal'));
        newModal.show();
        
        this.setupUploadEvents();
    }
    
    showChoiceView() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('photoGalleryModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#photoGalleryModal').parentElement;
        modalContainer.innerHTML = this.getChoiceModalHTML();
        
        const newModal = bootstrap.Modal.getInstance(document.getElementById('photoGalleryModal'));
        if (!newModal) {
            new bootstrap.Modal(document.getElementById('photoGalleryModal')).show();
        } else {
            newModal.show();
        }
        
        this.setupChoiceEvents();
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
    
    setupDogSearch() {
        const searchInput = document.getElementById('photoHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0 && !this.isLoadingAllDogs) {
                await this.loadAllDogs();
            }
            this.filterDogs(searchInput.value);
            dropdownMenu.classList.add('show');
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterDogs(searchTerm);
            dropdownMenu.classList.add('show');
        });
        
        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
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
            const pageSize = 1000;
            let hasMore = true;
            let totalDogs = 0;
            
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
                
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            
            if (loadingStatus) {
                loadingStatus.innerHTML = `<i class="bi bi-check-circle text-success"></i> ${this.allDogs.length} ${t('loadedDogs')}`;
            }
            
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
            this.filteredDogs = this.allDogs.slice(0, 100);
        } else {
            this.filteredDogs = this.allDogs.filter(dog => {
                const naam = (dog.naam || '').toLowerCase();
                const kennelnaam = (dog.kennelnaam || '').toLowerCase();
                const stamboomnr = (dog.stamboomnr || '').toLowerCase();
                const ras = (dog.ras || '').toLowerCase();
                
                const volledigeNaam = naam + (kennelnaam ? ' ' + kennelnaam : '');
                const kennelEnNaam = kennelnaam + (naam ? ' ' + naam : '');
                
                return naam.includes(searchLower) ||
                       kennelnaam.includes(searchLower) ||
                       stamboomnr.includes(searchLower) ||
                       ras.includes(searchLower) ||
                       volledigeNaam.includes(searchLower) ||
                       kennelEnNaam.includes(searchLower);
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
        const displayCount = Math.min(this.filteredDogs.length, 100);
        
        for (let i = 0; i < displayCount; i++) {
            const dog = this.filteredDogs[i];
            const displayName = `${dog.naam || ''}${dog.kennelnaam ? ` (${dog.kennelnaam})` : ''}`;
            const displayInfo = `${dog.ras || ''}${dog.stamboomnr ? ` • ${dog.stamboomnr}` : ''}`;
            
            html += `
                <a class="dropdown-item" href="#" data-dog-id="${dog.id}" data-stamboomnr="${dog.stamboomnr || ''}" data-dog-name="${displayName}" tabindex="0">
                    <div>
                        <strong>${displayName}</strong>
                        <div class="small text-muted">
                            ${displayInfo}
                        </div>
                    </div>
                </a>
            `;
        }
        
        if (this.filteredDogs.length > 100) {
            html += `
                <div class="dropdown-item text-center text-muted small">
                    ... en nog ${this.filteredDogs.length - 100} honden
                </div>
            `;
        }
        
        dropdownMenu.innerHTML = html;
        
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
        if (this.isUser) {
            this.currentPhotoPage = 1;
            await this.loadPhotosPage(this.currentPhotoPage);
        }
    }
    
    async loadPhotosPage(page) {
        const t = this.t.bind(this);
        
        if (this.isLoadingPhotos) return;
        
        this.isLoadingPhotos = true;
        this.currentPhotoPage = page;
        
        this.showProgress(t('loadingPhotos'), 'photosContainer');
        
        try {
            const from = (page - 1) * this.photosPerPage;
            
            const { count, error: countError } = await window.supabase
                .from('fotos')
                .select('*', { count: 'exact', head: true });
            
            if (countError) throw countError;
            
            this.totalPhotos = count || 0;
            this.totalPhotoPages = Math.ceil(this.totalPhotos / this.photosPerPage);
            
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .order('uploaded_at', { ascending: false })
                .range(from, from + this.photosPerPage - 1);
            
            if (error) throw error;
            
            this.hideProgress();
            await this.displayPhotos(fotos || []);
            
            this.updatePaginationInfo();
            this.updatePaginationControls();
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.hideProgress();
            this.showError(`${t('loadFailed')}${error.message}`, 'photosContainer');
        } finally {
            this.isLoadingPhotos = false;
        }
    }
    
    updatePaginationInfo() {
        const t = this.t.bind(this);
        const infoElement = document.getElementById('photosPaginationInfo');
        
        if (!infoElement) return;
        
        if (this.totalPhotos === 0) {
            infoElement.textContent = t('noPhotos');
            return;
        }
        
        const from = (this.currentPhotoPage - 1) * this.photosPerPage + 1;
        const to = Math.min(this.currentPhotoPage * this.photosPerPage, this.totalPhotos);
        
        infoElement.textContent = `${t('showing')} ${from} ${t('to')} ${to} ${t('ofTotal')} ${this.totalPhotos} ${t('photos')}`;
    }
    
    updatePaginationControls() {
        const t = this.t.bind(this);
        const paginationElement = document.getElementById('photosPagination');
        
        if (!paginationElement) return;
        
        if (this.totalPhotoPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }
        
        let html = `
            <nav aria-label="Foto paginatie">
                <ul class="pagination pagination-sm mb-0">
        `;
        
        html += `
            <li class="page-item ${this.currentPhotoPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPhotoPage - 1}" ${this.currentPhotoPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
                    <i class="bi bi-chevron-left"></i> ${t('previousPage')}
                </a>
            </li>
        `;
        
        if (this.currentPhotoPage > 2) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
                ${this.currentPhotoPage > 3 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            `;
        }
        
        const startPage = Math.max(1, this.currentPhotoPage - 1);
        const endPage = Math.min(this.totalPhotoPages, this.currentPhotoPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${this.currentPhotoPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        if (this.currentPhotoPage < this.totalPhotoPages - 1) {
            html += `
                ${this.currentPhotoPage < this.totalPhotoPages - 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.totalPhotoPages}">${this.totalPhotoPages}</a>
                </li>
            `;
        }
        
        html += `
            <li class="page-item ${this.currentPhotoPage === this.totalPhotoPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPhotoPage + 1}" ${this.currentPhotoPage === this.totalPhotoPages ? 'tabindex="-1" aria-disabled="true"' : ''}>
                    ${t('nextPage')} <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;
        
        html += `
                </ul>
            </nav>
        `;
        
        paginationElement.innerHTML = html;
        
        paginationElement.querySelectorAll('.page-link[data-page]').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                if (page && page !== this.currentPhotoPage) {
                    await this.loadPhotosPage(page);
                }
            });
        });
    }
    
    async uploadPhoto() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        const dogName = document.getElementById('selectedDogName').value;
        const fileInput = document.getElementById('photoFile');
        const description = document.getElementById('photoDescription').value.trim();
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'), 'recentUploadsContainer');
            return;
        }
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectPhotoFirst'), 'recentUploadsContainer');
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError(t('fileTooLarge'), 'recentUploadsContainer');
            return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError(t('invalidType'), 'recentUploadsContainer');
            return;
        }
        
        this.showProgress(t('uploading'), 'recentUploadsContainer');
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const user = window.auth ? window.auth.getCurrentUser() : null;
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
                    stamboomnr: stamboomnr,
                    data: base64Data,
                    thumbnail: thumbnail,
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    uploaded_at: new Date().toISOString(),
                    geupload_door: user.id,
                    hond_id: dogId ? parseInt(dogId) : null
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
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'), 'recentUploadsContainer');
                
                document.getElementById('photoHondSearch').value = '';
                document.getElementById('selectedDogId').value = '';
                document.getElementById('selectedDogStamboomnr').value = '';
                document.getElementById('selectedDogName').value = '';
                document.getElementById('photoDescription').value = '';
                fileInput.value = '';
                
                await this.loadRecentUploads();
                
            } catch (error) {
                console.error('Upload error:', error);
                this.hideProgress();
                this.showError(`${t('uploadFailed')}${error.message}`, 'recentUploadsContainer');
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'), 'recentUploadsContainer');
        };
        
        reader.readAsDataURL(file);
    }
    
    async loadRecentUploads() {
        const t = this.t.bind(this);
        
        try {
            const user = window.auth ? window.auth.getCurrentUser() : null;
            if (!user || !user.id) return;
            
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('geupload_door', user.id)
                .order('uploaded_at', { ascending: false })
                .limit(6);
            
            if (error) throw error;
            
            await this.displayRecentUploads(fotos || []);
            
        } catch (error) {
            console.error('Error loading recent uploads:', error);
        }
    }
    
    async displayRecentUploads(fotos) {
        const t = this.t.bind(this);
        const container = document.getElementById('recentUploadsContainer');
        if (!container) return;
        
        if (!fotos || fotos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-3">
                    <i class="bi bi-images text-muted"></i>
                    <p class="mt-2 text-muted">${t('noRecentUploads')}</p>
                </div>
            `;
            return;
        }
        
        const fotosWithDogInfo = [];
        
        for (const foto of fotos) {
            let dogInfo = {
                name: t('unknownDog'),
                kennel: ''
            };
            
            if (foto.stamboomnr) {
                try {
                    const dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                    if (dog) {
                        dogInfo.name = dog.naam || '';
                        dogInfo.kennel = dog.kennelnaam || '';
                    }
                } catch (error) {
                    console.error('Error loading dog info:', error);
                }
            }
            
            fotosWithDogInfo.push({
                ...foto,
                dogInfo
            });
        }
        
        let html = '';
        
        for (const foto of fotosWithDogInfo) {
            const dogName = foto.dogInfo.name ? 
                `${foto.dogInfo.name}${foto.dogInfo.kennel ? ` (${foto.dogInfo.kennel})` : ''}` : 
                t('unknownDog');
                
            const uploadDatum = new Date(foto.uploaded_at).toLocaleDateString(this.currentLang);
            const imageUrl = foto.thumbnail || foto.data;
            
            html += `
                <div class="col-md-4 col-lg-3 mb-3">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 120px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;" 
                             data-foto-id="${foto.id}"
                             data-dog-name="${dogName}"
                             data-image-url="${foto.data}">
                            ${imageUrl ? 
                                `<img src="${imageUrl}" alt="${dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover; transform: scale(0.8);">` :
                                `<i class="bi bi-image text-muted" style="font-size: 2rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column p-2">
                            <h6 class="card-title mb-1 text-truncate small" title="${dogName}">${dogName}</h6>
                            <div class="mt-auto">
                                <small class="text-muted">${uploadDatum}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Gebruik PhotoViewer voor vergroting met dynamisch laden
        for (const element of document.querySelectorAll('.photo-thumbnail')) {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                const imageUrl = element.dataset.imageUrl;
                const dogName = element.dataset.dogName || t('unknownDog');
                
                try {
                    // Laad PhotoViewer dynamisch als die nog niet geladen is
                    await this.ensurePhotoViewer();
                    
                    if (window.photoViewer && imageUrl) {
                        window.photoViewer.showPhoto(imageUrl, dogName);
                    } else if (this.photoViewer && imageUrl) {
                        this.photoViewer.showPhoto(imageUrl, dogName);
                    }
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
                    // Fallback: open direct in nieuw tabblad
                    window.open(imageUrl, '_blank');
                }
            });
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
                </div>
            `;
            
            return;
        }
        
        const fotosWithDogInfo = [];
        
        for (const foto of fotos) {
            let dogInfo = {
                name: t('unknownDog'),
                kennel: ''
            };
            
            if (foto.stamboomnr) {
                try {
                    const dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                    if (dog) {
                        dogInfo.name = dog.naam || '';
                        dogInfo.kennel = dog.kennelnaam || '';
                    }
                } catch (error) {
                    console.error('Error loading dog info:', error);
                }
            }
            
            fotosWithDogInfo.push({
                ...foto,
                dogInfo
            });
        }
        
        let html = '';
        
        for (const foto of fotosWithDogInfo) {
            const dogName = foto.dogInfo.name ? 
                `${foto.dogInfo.name}${foto.dogInfo.kennel ? ` (${foto.dogInfo.kennel})` : ''}` : 
                t('unknownDog');
                
            const uploadDatum = new Date(foto.uploaded_at).toLocaleDateString(this.currentLang);
            const imageUrl = foto.thumbnail || foto.data;
            
            const deleteButton = this.isAdmin ? 
                `<button class="btn btn-sm btn-outline-danger delete-photo-btn" 
                        data-id="${foto.id}" 
                        title="${t('delete')}">
                    <i class="bi bi-trash"></i>
                </button>` : '';
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 150px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;" 
                             data-foto-id="${foto.id}"
                             data-dog-name="${dogName}"
                             data-image-url="${foto.data}">
                            ${imageUrl ? 
                                `<img src="${imageUrl}" alt="${dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover; transform: scale(0.8);">` :
                                `<i class="bi bi-image text-muted" style="font-size: 2.5rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-2 text-truncate" title="${dogName}">${dogName}</h6>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">${uploadDatum}</small>
                                    ${deleteButton}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Gebruik PhotoViewer voor vergroting met dynamisch laden
        for (const element of document.querySelectorAll('.photo-thumbnail')) {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                const imageUrl = element.dataset.imageUrl;
                const dogName = element.dataset.dogName || t('unknownDog');
                
                try {
                    // Laad PhotoViewer dynamisch als die nog niet geladen is
                    await this.ensurePhotoViewer();
                    
                    if (window.photoViewer && imageUrl) {
                        window.photoViewer.showPhoto(imageUrl, dogName);
                    } else if (this.photoViewer && imageUrl) {
                        this.photoViewer.showPhoto(imageUrl, dogName);
                    }
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
                    // Fallback: open direct in nieuw tabblad
                    window.open(imageUrl, '_blank');
                }
            });
        }
        
        if (this.isAdmin) {
            document.querySelectorAll('.delete-photo-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const fotoId = btn.dataset.id;
                    await this.deletePhoto(fotoId);
                });
            });
        }
    }
    
    async deletePhoto(fotoId) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'), 'photosContainer');
        
        try {
            const { error: dbError } = await window.supabase
                .from('fotos')
                .delete()
                .eq('id', fotoId);
            
            if (dbError) throw dbError;
            
            this.hideProgress();
            this.showSuccess(t('deleteSuccess'), 'photosContainer');
            
            await this.loadPhotosPage(this.currentPhotoPage);
            
        } catch (error) {
            console.error('Error deleting photo:', error);
            this.hideProgress();
            this.showError(`${t('deleteFailed')}${error.message}`, 'photosContainer');
        }
    }
    
    showProgress(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">${message}</p>
                </div>
            `;
        }
    }
    
    hideProgress() {
        document.querySelectorAll('.spinner-border').forEach(spinner => {
            spinner.remove();
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