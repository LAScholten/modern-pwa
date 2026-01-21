// js/modules/PhotoManager.js

/**
 * Foto Management Module
 * Beheert foto upload en galerij
 * WERKT MET SUPABASE PAGINATIE VOOR GROTE DATASETS (100.000+ RECORDS)
 */

class PhotoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.currentDogPage = 1;
        this.dogPageSize = 1000; // Paginatie voor honden data
        this.hasMoreDogs = false;
        this.isLoadingDogs = false;
        
        // Foto paginatie variabelen
        this.currentPhotoPage = 1;
        this.photoPageSize = 12; // Standaard 12 foto's per pagina
        this.totalPhotos = 0;
        this.totalPhotoPages = 0;
        this.allPhotos = []; // Alle geladen foto's
        this.isLoadingPhotos = false;
        this.hasMorePhotos = false;
        
        this.translations = {
            nl: {
                // Modal titels
                photoGallery: "Foto Galerij",
                photoInfo: "Foto Galerij - Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.",
                
                // Upload sectie
                photoUpload: "Foto Uploaden",
                selectDog: "Selecteer Hond",
                searchDog: "Zoek hond op naam...",
                selectPhoto: "Selecteer Foto",
                maxSize: "Maximale grootte: 5MB. Ondersteunde formaten: JPG, PNG, GIF",
                description: "Beschrijving (optioneel)",
                describePhoto: "Beschrijf de foto...",
                uploadPhoto: "Foto Uploaden",
                noDogsFound: "Geen honden gevonden",
                loadMoreDogs: "Laad meer honden...",
                loadingDogs: "Honden laden...",
                
                // Overzicht
                photoOverview: "Foto Overzicht",
                noPhotos: "Er zijn nog geen foto's geüpload",
                loadingPhotos: "Foto's laden...",
                loadMorePhotos: "Laad meer foto's",
                allPhotos: "Alle Foto's",
                close: "Sluiten",
                unknownDog: "Onbekende hond",
                noDescription: "Geen beschrijving",
                delete: "Verwijderen",
                view: "Bekijken",
                showingPhotos: "Toon {start}-{end} van {total} foto's",
                
                // Paginatie
                previous: "Vorige",
                next: "Volgende",
                page: "Pagina",
                of: "van",
                
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
                invalidType: "Ongeldig bestandstype. Alleen JPG, PNG en GIF zijn toegestaan",
                uploading: "Foto uploaden...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                loading: "Foto's laden...",
                loadFailed: "Laden mislukt: ",
                deleteConfirm: "Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                deleting: "Foto verwijderen...",
                deleteSuccess: "Foto succesvol verwijderen!",
                deleteFailed: "Verwijderen mislukt: ",
                photoNotFound: "Foto niet gevonden",
                loadDetailsFailed: "Fout bij laden foto details: "
            },
            en: {
                // Modal titles
                photoGallery: "Photo Gallery",
                photoInfo: "Photo Gallery - View and manage dog photos. Upload new photos or delete existing ones.",
                
                // Upload section
                photoUpload: "Photo Upload",
                selectDog: "Select Dog",
                searchDog: "Search dog by name...",
                selectPhoto: "Select Photo",
                maxSize: "Maximum size: 5MB. Supported formats: JPG, PNG, GIF",
                description: "Description (optional)",
                describePhoto: "Describe the photo...",
                uploadPhoto: "Upload Photo",
                noDogsFound: "No dogs found",
                loadMoreDogs: "Load more dogs...",
                loadingDogs: "Loading dogs...",
                
                // Overview
                photoOverview: "Photo Overview",
                noPhotos: "No photos uploaded yet",
                loadingPhotos: "Loading photos...",
                loadMorePhotos: "Load more photos",
                allPhotos: "All Photos",
                close: "Close",
                unknownDog: "Unknown dog",
                noDescription: "No description",
                delete: "Delete",
                view: "View",
                showingPhotos: "Showing {start}-{end} of {total} photos",
                
                // Pagination
                previous: "Previous",
                next: "Next",
                page: "Page",
                of: "of",
                
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
                invalidType: "Invalid file type. Only JPG, PNG and GIF are allowed",
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
                loadDetailsFailed: "Error loading photo details: "
            },
            de: {
                // Modal Titel
                photoGallery: "Foto Galerie",
                photoInfo: "Foto Galerie - Hunderfotos ansehen und verwalten. Laden Sie neue Fotos hoch oder löschen Sie vorhandene.",
                
                // Upload Bereich
                photoUpload: "Foto Upload",
                selectDog: "Hund auswählen",
                searchDog: "Hund nach Namen suchen...",
                selectPhoto: "Foto auswählen",
                maxSize: "Maximale Größe: 5MB. Unterstützte Formate: JPG, PNG, GIF",
                description: "Beschreibung (optional)",
                describePhoto: "Beschreiben Sie das Foto...",
                uploadPhoto: "Foto hochladen",
                noDogsFound: "Keine Hunde gefunden",
                loadMoreDogs: "Mehr Hunde laden...",
                loadingDogs: "Hunde laden...",
                
                // Übersicht
                photoOverview: "Foto Übersicht",
                noPhotos: "Noch keine Fotos hochgeladen",
                loadingPhotos: "Fotos laden...",
                loadMorePhotos: "Mehr Fotos laden",
                allPhotos: "Alle Fotos",
                close: "Schließen",
                unknownDog: "Unbekannter Hund",
                noDescription: "Keine Beschreibung",
                delete: "Löschen",
                view: "Ansehen",
                showingPhotos: "Zeige {start}-{end} von {total} Fotos",
                
                // Paginierung
                previous: "Vorherige",
                next: "Nächste",
                page: "Seite",
                of: "von",
                
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
                invalidType: "Ungültiger Dateityp. Nur JPG, PNG und GIF sind erlaubt",
                uploading: "Foto wordt hochgeladen...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                loading: "Lade Fotos...",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher dat u dies foto wilt verwijderen? Dit kan nicht ongedaan worden gemacht.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                photoNotFound: "Foto niet gevonden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: "
            }
        };
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        // Vervang placeholders
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value);
        }
        return text;
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
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
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
                                                                <div class="dropdown-item text-muted">${t('loadingDogs')}</div>
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
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <button class="btn btn-outline-warning" id="loadPhotosBtn">
                                                <i class="bi bi-arrow-clockwise"></i> ${t('allPhotos')}
                                            </button>
                                            <div id="photosPagination" style="display: none;">
                                                <nav aria-label="Foto paginatie">
                                                    <ul class="pagination pagination-sm mb-0">
                                                        <li class="page-item" id="prevPageBtn">
                                                            <a class="page-link" href="#" aria-label="${t('previous')}">
                                                                <span aria-hidden="true">&laquo;</span>
                                                            </a>
                                                        </li>
                                                        <li class="page-item disabled">
                                                            <span class="page-link" id="currentPageInfo">
                                                                ${t('page')} 1 ${t('of')} 1
                                                            </span>
                                                        </li>
                                                        <li class="page-item" id="nextPageBtn">
                                                            <a class="page-link" href="#" aria-label="${t('next')}">
                                                                <span aria-hidden="true">&raquo;</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="photosInfo" class="mb-3 text-muted small" style="display: none;"></div>
                                
                                <div id="photosContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-images display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('noPhotos')}</p>
                                        <button class="btn btn-warning" id="initialLoadPhotosBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('allPhotos')}
                                        </button>
                                    </div>
                                </div>
                                
                                <div id="loadMorePhotosContainer" class="text-center mt-3" style="display: none;">
                                    <button class="btn btn-outline-warning" id="loadMorePhotosBtn">
                                        <i class="bi bi-plus-circle"></i> ${t('loadMorePhotos')}
                                    </button>
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
        
        const loadBtn = document.getElementById('loadPhotosBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadFirstPhotoPage();
            });
        }
        
        const initialLoadBtn = document.getElementById('initialLoadPhotosBtn');
        if (initialLoadBtn) {
            initialLoadBtn.addEventListener('click', () => {
                this.loadFirstPhotoPage();
            });
        }
        
        const loadMoreBtn = document.getElementById('loadMorePhotosBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePhotos();
            });
        }
        
        const prevPageBtn = document.getElementById('prevPageBtn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPreviousPhotoPage();
            });
        }
        
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadNextPhotoPage();
            });
        }
        
        this.setupDogSearch();
        
        // FIX: Voeg modal close fix toe
        this.fixPhotoModalClose();
    }
    
    /**
     * Specifieke fix voor foto gallery modal
     */
    fixPhotoModalClose() {
        const modalElement = document.getElementById('photoGalleryModal');
        if (!modalElement) return;
        
        console.log('PhotoManager: Modal fixes geïnstalleerd');
        
        modalElement.addEventListener('hide.bs.modal', () => {
            // Verwijder focus van close button
            const closeBtn = modalElement.querySelector('.btn-close:focus');
            if (closeBtn) {
                closeBtn.blur();
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            console.log('Photo gallery modal gesloten');
        });
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('photoHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Toon dropdown bij focus
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadFirstDogPage();
            }
            this.filterDogs('');
            dropdownMenu.classList.add('show');
        });
        
        // Filter honden bij elke toetsaanslag
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
        
        // Infinite scroll voor dropdown
        dropdownMenu.addEventListener('scroll', () => {
            if (dropdownMenu.scrollTop + dropdownMenu.clientHeight >= dropdownMenu.scrollHeight - 50) {
                if (this.hasMoreDogs && !this.isLoadingDogs) {
                    this.loadMoreDogs();
                }
            }
        });
    }
    
    async loadFirstDogPage() {
        this.currentDogPage = 1;
        this.allDogs = [];
        this.isLoadingDogs = true;
        
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = '<div class="dropdown-item text-muted">' + this.t('loadingDogs') + '...</div>';
        }
        
        await this.loadMoreDogs();
    }
    
    async loadMoreDogs() {
        if (this.isLoadingDogs) return;
        
        this.isLoadingDogs = true;
        const t = this.t.bind(this);
        
        try {
            console.log(`PhotoManager: Laden honden pagina ${this.currentDogPage}...`);
            
            const result = await hondenService.getHonden(this.currentDogPage, this.dogPageSize);
            
            if (result.honden && result.honden.length > 0) {
                this.allDogs = this.allDogs.concat(result.honden);
                this.hasMoreDogs = result.heeftVolgende;
                this.currentDogPage++;
                
                console.log(`PhotoManager: ${result.honden.length} honden geladen, totaal: ${this.allDogs.length}`);
                
                // Update dropdown met huidige zoekterm
                const searchInput = document.getElementById('photoHondSearch');
                if (searchInput) {
                    this.filterDogs(searchInput.value.toLowerCase());
                }
            } else {
                this.hasMoreDogs = false;
            }
            
        } catch (error) {
            console.error('PhotoManager: Fout bij laden honden:', error);
            this.showError(`${t('loadFailed')}${error.message}`);
        } finally {
            this.isLoadingDogs = false;
        }
    }
    
    async filterDogs(searchTerm = '') {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        const t = this.t.bind(this);
        
        // Als nog geen honden geladen zijn, laad eerste pagina
        if (this.allDogs.length === 0) {
            dropdownMenu.innerHTML = '<div class="dropdown-item text-muted">' + t('loadingDogs') + '...</div>';
            return;
        }
        
        // ALLEEN ZOEKEN OP NAAM VAN DE HOND - EN ALLEEN ALS HET BEGINT MET DE ZOEKTERM
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            return dogName.startsWith(searchTerm);
        }).slice(0, 50); // Beperk tot 50 resultaten voor dropdown
        
        this.updateDropdownMenu();
        
        // Toon "laad meer" knop als er meer honden zijn
        if (this.hasMoreDogs && this.filteredDogs.length < 20) {
            const loadMoreItem = document.createElement('div');
            loadMoreItem.className = 'dropdown-item text-center';
            loadMoreItem.innerHTML = `
                <button class="btn btn-sm btn-outline-primary w-100" id="loadMoreDogsBtn">
                    <i class="bi bi-plus-circle"></i> ${t('loadMoreDogs')}
                </button>
            `;
            dropdownMenu.appendChild(loadMoreItem);
            
            document.getElementById('loadMoreDogsBtn')?.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.loadMoreDogs();
            });
        }
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
        this.filteredDogs.forEach(dog => {
            const dogName = dog.naam || 'Naam onbekend';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam : '';
            const displayName = `${dogName} ${kennelnaam}`.trim();
            
            html += `
                <a class="dropdown-item" href="#" data-id="${dog.id}" data-stamboomnr="${dog.stamboomnr || ''}">
                    <div>
                        <strong>${displayName}</strong>
                        <div class="small text-muted">
                            ${dog.ras || ''} • ${dog.stamboomnr || 'Geen stamboom'}
                        </div>
                    </div>
                </a>
            `;
        });
        
        dropdownMenu.innerHTML = html;
        
        // Event listeners voor dropdown items
        dropdownMenu.querySelectorAll('.dropdown-item[data-id]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const dogId = item.getAttribute('data-id');
                const stamboomnr = item.getAttribute('data-stamboomnr');
                const dogName = item.querySelector('strong').textContent;
                
                this.selectDog({
                    id: dogId,
                    stamboomnr: stamboomnr,
                    naam: dogName
                });
                
                dropdownMenu.classList.remove('show');
            });
        });
    }
    
    selectDog(dog) {
        const searchInput = document.getElementById('photoHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        
        if (searchInput) {
            searchInput.value = dog.naam;
        }
        if (dogIdInput) {
            dogIdInput.value = dog.id;
        }
        if (stamboomnrInput) {
            stamboomnrInput.value = dog.stamboomnr || '';
        }
    }
    
    async loadPhotosData() {
        await this.loadFirstDogPage();
        await this.loadFirstPhotoPage();
    }
    
    async loadFirstPhotoPage() {
        this.currentPhotoPage = 1;
        this.allPhotos = [];
        this.totalPhotos = 0;
        this.isLoadingPhotos = true;
        
        const t = this.t.bind(this);
        this.showProgress(t('loadingPhotos'));
        
        try {
            // Gebruik Supabase service om foto's te laden MET PAGINATIE
            const result = await this.getFotosMetPaginatie(this.currentPhotoPage, this.photoPageSize);
            
            this.allPhotos = result.fotos || [];
            this.totalPhotos = result.totaal || 0;
            this.totalPhotoPages = result.totaalPaginas || 1;
            this.hasMorePhotos = result.heeftVolgende || false;
            
            this.hideProgress();
            this.displayPhotos();
            this.updatePaginationControls();
            
        } catch (error) {
            this.hideProgress();
            console.error('PhotoManager: Fout bij laden foto\'s:', error);
            this.showError(`${t('loadFailed')}${error.message}`);
        } finally {
            this.isLoadingPhotos = false;
        }
    }
    
    async loadMorePhotos() {
        if (this.isLoadingPhotos) return;
        
        this.isLoadingPhotos = true;
        const t = this.t.bind(this);
        
        try {
            this.currentPhotoPage++;
            
            const result = await this.getFotosMetPaginatie(this.currentPhotoPage, this.photoPageSize);
            
            if (result.fotos && result.fotos.length > 0) {
                this.allPhotos = this.allPhotos.concat(result.fotos);
                this.hasMorePhotos = result.heeftVolgende;
                
                this.displayPhotos();
                this.updatePaginationControls();
            } else {
                this.hasMorePhotos = false;
            }
            
        } catch (error) {
            console.error('PhotoManager: Fout bij laden meer foto\'s:', error);
            this.showError(`${t('loadFailed')}${error.message}`);
        } finally {
            this.isLoadingPhotos = false;
        }
    }
    
    async loadPreviousPhotoPage() {
        if (this.currentPhotoPage <= 1 || this.isLoadingPhotos) return;
        
        this.currentPhotoPage--;
        await this.loadPhotosByPage(this.currentPhotoPage);
    }
    
    async loadNextPhotoPage() {
        if (this.currentPhotoPage >= this.totalPhotoPages || this.isLoadingPhotos) return;
        
        this.currentPhotoPage++;
        await this.loadPhotosByPage(this.currentPhotoPage);
    }
    
    async loadPhotosByPage(page) {
        this.isLoadingPhotos = true;
        const t = this.t.bind(this);
        
        try {
            const result = await this.getFotosMetPaginatie(page, this.photoPageSize);
            
            this.allPhotos = result.fotos || [];
            this.hasMorePhotos = result.heeftVolgende || false;
            
            this.displayPhotos();
            this.updatePaginationControls();
            
        } catch (error) {
            console.error('PhotoManager: Fout bij laden foto pagina:', error);
            this.showError(`${t('loadFailed')}${error.message}`);
        } finally {
            this.isLoadingPhotos = false;
        }
    }
    
    async getFotosMetPaginatie(page = 1, pageSize = 12) {
        try {
            // Gebruik de window.fotoService die al beschikbaar is (vanuit supabase-honden.js)
            if (window.fotoService && window.fotoService.getFotosMetPaginatie) {
                return await window.fotoService.getFotosMetPaginatie(null, page, pageSize);
            } else {
                throw new Error('Foto service niet beschikbaar');
            }
        } catch (error) {
            console.error('PhotoManager: Fout in getFotosMetPaginatie:', error);
            return {
                fotos: [],
                pagina: page,
                grootte: pageSize,
                totaal: 0,
                totaalPaginas: 0,
                heeftVolgende: false
            };
        }
    }
    
    updatePaginationControls() {
        const paginationContainer = document.getElementById('photosPagination');
        const photosInfo = document.getElementById('photosInfo');
        const loadMoreContainer = document.getElementById('loadMorePhotosContainer');
        const currentPageInfo = document.getElementById('currentPageInfo');
        
        if (this.totalPhotos === 0) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            if (photosInfo) photosInfo.style.display = 'none';
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            return;
        }
        
        // Toon paginatie info
        if (photosInfo) {
            const start = ((this.currentPhotoPage - 1) * this.photoPageSize) + 1;
            const end = Math.min(start + this.photoPageSize - 1, this.totalPhotos);
            
            photosInfo.innerHTML = this.t('showingPhotos', {
                start: start,
                end: end,
                total: this.totalPhotos
            });
            photosInfo.style.display = 'block';
        }
        
        // Toon paginatie knoppen
        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
            
            // Update huidige pagina info
            if (currentPageInfo) {
                currentPageInfo.textContent = `${this.t('page')} ${this.currentPhotoPage} ${this.t('of')} ${this.totalPhotoPages}`;
            }
            
            // Enable/disable vorige knop
            const prevBtn = document.getElementById('prevPageBtn');
            if (prevBtn) {
                if (this.currentPhotoPage <= 1) {
                    prevBtn.classList.add('disabled');
                } else {
                    prevBtn.classList.remove('disabled');
                }
            }
            
            // Enable/disable volgende knop
            const nextBtn = document.getElementById('nextPageBtn');
            if (nextBtn) {
                if (this.currentPhotoPage >= this.totalPhotoPages) {
                    nextBtn.classList.add('disabled');
                } else {
                    nextBtn.classList.remove('disabled');
                }
            }
        }
        
        // Toon "laad meer" knop voor infinite scroll optie
        if (loadMoreContainer) {
            if (this.hasMorePhotos) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
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
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const fotoData = {
                    stamboomnr: stamboomnr,
                    data: e.target.result,
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    description: description,
                    uploadedAt: new Date().toISOString()
                };
                
                // Gebruik Supabase service voor upload
                if (window.fotoService && window.fotoService.voegFotoToe) {
                    await window.fotoService.voegFotoToe(fotoData);
                } else {
                    throw new Error('Foto upload service niet beschikbaar');
                }
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'));
                
                // Formulier resetten
                document.getElementById('photoHondSearch').value = '';
                document.getElementById('selectedDogId').value = '';
                document.getElementById('selectedDogStamboomnr').value = '';
                document.getElementById('photoDescription').value = '';
                fileInput.value = '';
                
                // Herlaad foto's om de nieuwe te tonen
                await this.loadFirstPhotoPage();
                
            } catch (error) {
                this.hideProgress();
                console.error('PhotoManager: Fout bij uploaden foto:', error);
                this.showError(`${t('uploadFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'));
        };
        
        reader.readAsDataURL(file);
    }
    
    async displayPhotos() {
        const t = this.t.bind(this);
        const container = document.getElementById('photosContainer');
        if (!container) return;
        
        if (!this.allPhotos || this.allPhotos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-images display-1 text-muted"></i>
                    <p class="mt-3 text-muted">${t('noPhotos')}</p>
                    <button class="btn btn-warning" id="initialLoadPhotosBtn">
                        <i class="bi bi-arrow-clockwise"></i> ${t('allPhotos')}
                    </button>
                </div>
            `;
            
            const loadBtn = document.getElementById('initialLoadPhotosBtn');
            if (loadBtn) {
                loadBtn.addEventListener('click', () => {
                    this.loadFirstPhotoPage();
                });
            }
            
            return;
        }
        
        let html = '';
        
        this.allPhotos.forEach((foto, index) => {
            // Zoek hond info
            let dogName = t('unknownDog');
            let dogRas = '';
            
            if (foto.stamboomnr && this.allDogs.length > 0) {
                const dog = this.allDogs.find(d => d.stamboomnr === foto.stamboomnr);
                if (dog) {
                    dogName = `${dog.naam || ''} ${dog.kennelnaam ? dog.kennelnaam : ''}`.trim();
                    dogRas = dog.ras || '';
                }
            }
            
            const uploadDatum = foto.uploaded_at ? new Date(foto.uploaded_at).toLocaleDateString(this.currentLang) : '-';
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 180px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-index="${index}">
                            ${foto.thumbnail ? 
                                `<img src="${foto.thumbnail}" alt="${foto.description || dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-2">${dogName}</h6>
                            ${dogRas ? `<p class="card-text small text-muted mb-1">${dogRas}</p>` : ''}
                            ${foto.description ? `
                                <p class="card-text small text-muted flex-grow-1">
                                    ${foto.description}
                                </p>
                            ` : ''}
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">${uploadDatum}</small>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" data-id="${foto.id}">
                                        <i class="bi bi-trash"></i> ${t('delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Event listener voor thumbnails (voor vergroting)
        document.querySelectorAll('.photo-thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.showPhotoGallery(this.allPhotos, index);
            });
        });
        
        // Event listener voor delete knoppen
        document.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fotoId = e.currentTarget.dataset.id;
                await this.deletePhoto(fotoId);
            });
        });
    }
    
    async deletePhoto(fotoId) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'));
        
        try {
            // Gebruik Supabase service voor verwijderen
            // Note: De fotoService heeft geen verwijder methode, dus we gebruiken direct Supabase
            if (window.supabase) {
                const { error } = await window.supabase
                    .from('fotos')
                    .delete()
                    .eq('id', fotoId);
                
                if (error) throw error;
                
                this.hideProgress();
                this.showSuccess(t('deleteSuccess'));
                
                // Herlaad foto's
                await this.loadFirstPhotoPage();
                
            } else {
                throw new Error('Supabase niet beschikbaar');
            }
            
        } catch (error) {
            this.hideProgress();
            console.error('PhotoManager: Fout bij verwijderen foto:', error);
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }
    
    async showPhotoGallery(fotos, startIndex = 0) {
        const t = this.t.bind(this);
        
        let currentIndex = startIndex;
        
        const getPhotoHTML = (foto, index) => {
            // Zoek hond info
            let dogName = t('unknownDog');
            if (foto.stamboomnr && this.allDogs.length > 0) {
                const dog = this.allDogs.find(d => d.stamboomnr === foto.stamboomnr);
                if (dog) {
                    dogName = `${dog.naam || ''} ${dog.kennelnaam ? dog.kennelnaam : ''}`.trim();
                }
            }
            
            return `
                <div class="carousel-item ${index === currentIndex ? 'active' : ''}">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="text-center mb-4">
                                ${foto.thumbnail ? 
                                    `<img src="${foto.thumbnail}" alt="${foto.description || dogName}" 
                                          class="img-fluid rounded shadow" style="max-height: 70vh; max-width: 100%;">` :
                                    `<div class="bg-light p-5 rounded text-center">
                                        <i class="bi bi-image text-muted" style="font-size: 5rem;"></i>
                                        <p class="mt-3 text-muted">${t('photoNotFound')}</p>
                                    </div>`
                                }
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">${t('photoDetails')}</h5>
                                </div>
                                <div class="card-body">
                                    <table class="table table-sm">
                                        <tr>
                                            <th style="width: 40%">${t('dog')}:</th>
                                            <td><strong>${dogName}</strong></td>
                                        </tr>
                                        <tr>
                                            <th>${t('filename')}:</th>
                                            <td><small>${foto.filename || '-'}</small></td>
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
                                            <td>${foto.uploaded_at ? new Date(foto.uploaded_at).toLocaleString(this.currentLang) : '-'}</td>
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
            `;
        };
        
        const carouselIndicators = fotos.map((_, index) => `
            <button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="${index}" 
                    class="${index === currentIndex ? 'active' : ''}" aria-label="Foto ${index + 1}">
            </button>
        `).join('');
        
        const carouselItems = fotos.map((foto, index) => getPhotoHTML(foto, index)).join('');
        
        const html = `
            <div class="modal fade" id="photoGalleryViewModal" tabindex="-1" aria-labelledby="photoGalleryViewModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="photoGalleryViewModalLabel">
                                <i class="bi bi-images"></i> ${t('allPhotos')} (${currentIndex + 1}/${fotos.length})
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                                <div class="carousel-indicators">
                                    ${carouselIndicators}
                                </div>
                                <div class="carousel-inner">
                                    ${carouselItems}
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">${t('prevPhoto')}</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">${t('nextPhoto')}</span>
                                </button>
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
        container.insertAdjacentHTML('beforeend', html);
        
        const modalElement = document.getElementById('photoGalleryViewModal');
        const modal = new bootstrap.Modal(modalElement);
        
        modal.show();
        
        // Update titel bij carousel slide
        const carousel = modalElement.querySelector('#photoCarousel');
        if (carousel) {
            carousel.addEventListener('slide.bs.carousel', (event) => {
                currentIndex = event.to;
                const title = modalElement.querySelector('#photoGalleryViewModalLabel');
                if (title) {
                    title.innerHTML = `<i class="bi bi-images"></i> ${t('allPhotos')} (${currentIndex + 1}/${fotos.length})`;
                }
            });
        }
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    }
    
    showProgress(message) {
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        } else {
            console.log('Hide progress');
        }
    }
    
    showSuccess(message) {
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
    
    showError(message) {
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            console.error('Error:', message);
        }
    }
}