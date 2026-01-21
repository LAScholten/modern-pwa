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
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.totalPhotos = 0;
        this.totalPages = 0;
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
                show: "Toon",
                of: "van",
                items: "items",
                next: "Volgende",
                previous: "Vorige",
                
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
                show: "Show",
                of: "of",
                items: "items",
                next: "Next",
                previous: "Previous",
                
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
                show: "Zeige",
                of: "von",
                items: "Elemente",
                next: "Nächste",
                previous: "Vorherige",
                
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
                photoNotFound: "Foto nicht gefunden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: "
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
                                                                <div class="dropdown-item text-muted">${t('loadingPhotos')}</div>
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
                                    <div class="d-flex align-items-center">
                                        <select class="form-select form-select-sm me-2" id="photosPerPageSelect" style="width: auto;">
                                            <option value="12">12 ${t('items')}</option>
                                            <option value="24">24 ${t('items')}</option>
                                            <option value="48">48 ${t('items')}</option>
                                            <option value="96">96 ${t('items')}</option>
                                        </select>
                                        <button class="btn btn-outline-warning" id="loadAllPhotosBtn">
                                            <i class="bi bi-arrow-clockwise"></i> ${t('loadAllPhotos')}
                                        </button>
                                    </div>
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
                                
                                <!-- Paginatie Controls -->
                                <nav id="paginationControls" class="d-none">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item disabled" id="prevPageBtn">
                                            <a class="page-link" href="#" tabindex="-1">
                                                <i class="bi bi-chevron-left"></i> ${t('previous')}
                                            </a>
                                        </li>
                                        <li class="page-item active">
                                            <a class="page-link" href="#" id="currentPageInfo">Pagina 1</a>
                                        </li>
                                        <li class="page-item" id="nextPageBtn">
                                            <a class="page-link" href="#">
                                                ${t('next')} <i class="bi bi-chevron-right"></i>
                                            </a>
                                        </li>
                                    </ul>
                                    <div class="text-center small text-muted" id="pageInfo">
                                        ${t('show')} <span id="startIndex">1</span>-<span id="endIndex">12</span> ${t('of')} <span id="totalItems">0</span> ${t('items')}
                                    </div>
                                </nav>
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
                this.currentPage = 1;
                this.loadPhotos();
            });
        }
        
        const initialLoadBtn = document.getElementById('initialLoadPhotosBtn');
        if (initialLoadBtn) {
            initialLoadBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadPhotos();
            });
        }
        
        // Paginatie controls
        const prevPageBtn = document.getElementById('prevPageBtn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadPhotos();
                }
            });
        }
        
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.loadPhotos();
                }
            });
        }
        
        // Items per pagina select
        const photosPerPageSelect = document.getElementById('photosPerPageSelect');
        if (photosPerPageSelect) {
            photosPerPageSelect.value = this.photosPerPage;
            photosPerPageSelect.addEventListener('change', (e) => {
                this.photosPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.loadPhotos();
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
        
        // Luister naar modal sluiten
        modalElement.addEventListener('hide.bs.modal', () => {
            // Verwijder focus van close button
            const closeBtn = modalElement.querySelector('.btn-close:focus');
            if (closeBtn) {
                closeBtn.blur();
            }
            
            // Verwijder focus van andere elementen
            const focused = modalElement.querySelector(':focus');
            if (focused) {
                focused.blur();
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            console.log('Photo gallery modal gesloten');
            
            // Forceer cleanup van backdrops
            setTimeout(() => {
                this.cleanupModalAfterClose();
            }, 50);
        });
    }
    
    /**
     * Cleanup na modal sluiten
     */
    cleanupModalAfterClose() {
        const openModals = document.querySelectorAll('.modal.show');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        
        console.log(`Cleanup: ${openModals.length} modals open, ${backdrops.length} backdrops`);
        
        if (openModals.length === 0 && backdrops.length > 0) {
            // Verwijder alle backdrops
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            
            // Reset body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            console.log('PhotoManager: Modal cleanup uitgevoerd');
        }
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('photoHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Toon dropdown bij focus
        searchInput.addEventListener('focus', () => {
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
        
        // Toon alle honden bij eerste klik
        searchInput.addEventListener('click', () => {
            if (dropdownMenu.children.length === 1 && dropdownMenu.children[0].classList.contains('text-muted')) {
                this.filterDogs('');
            }
            dropdownMenu.classList.add('show');
        });
    }
    
    async filterDogs(searchTerm = '') {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        if (!this.allDogs || this.allDogs.length === 0) {
            await this.loadDogsData();
        }
        
        // Zoeken op naam, kennelnaam of stamboomnummer
        this.filteredDogs = this.allDogs.filter(dog => {
            const dogName = dog.naam.toLowerCase();
            const kennelName = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const stamboomnr = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            
            return dogName.includes(searchTerm) || 
                   kennelName.includes(searchTerm) || 
                   stamboomnr.includes(searchTerm);
        });
        
        this.updateDropdownMenu();
    }
    
    updateDropdownMenu() {
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
        
        this.filteredDogs.forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}</strong>
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
    }
    
    selectDog(dog) {
        const searchInput = document.getElementById('photoHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        
        if (searchInput) {
            searchInput.value = `${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}`;
        }
        if (dogIdInput) {
            dogIdInput.value = dog.id;
        }
        if (stamboomnrInput) {
            stamboomnrInput.value = dog.stamboomnr || '';
        }
    }
    
    async loadDogsData() {
        try {
            // Gebruik de nieuwe hondenService methode met paginatie
            const result = await window.hondenService.getHonden(1, 1000);
            this.allDogs = result.honden || [];
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allDogs = [];
        }
    }
    
    async loadPhotosData() {
        await this.loadDogsData();
        await this.loadPhotos();
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
        
        // Haal de huidige gebruiker op voor RLS
        const user = window.auth ? window.auth.getCurrentUser() : null;
        if (!user) {
            this.hideProgress();
            this.showError('Je moet ingelogd zijn om foto\'s te uploaden');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                // Upload naar Supabase Storage
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `fotos/${stamboomnr}/${fileName}`;
                
                // Upload naar storage
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
                
                // Voeg metadata toe aan database
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
                
                const { data, error } = await window.supabase
                    .from('fotos')
                    .insert(fotoData)
                    .select()
                    .single();
                
                if (error) throw error;
                
                this.hideProgress();
                this.showSuccess(t('uploadSuccess'));
                
                // Formulier resetten
                document.getElementById('photoHondSearch').value = '';
                document.getElementById('selectedDogId').value = '';
                document.getElementById('selectedDogStamboomnr').value = '';
                document.getElementById('photoDescription').value = '';
                fileInput.value = '';
                
                // Herlaad foto's
                this.currentPage = 1;
                await this.loadPhotos();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${t('uploadFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'));
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    async loadPhotos() {
        const t = this.t.bind(this);
        this.showProgress(t('loading'));
        
        try {
            // Gebruik de nieuwe fotoService methode met paginatie
            const result = await window.fotoService.getFotosMetPaginatie(
                null, // Alle foto's
                this.currentPage,
                this.photosPerPage
            );
            
            this.totalPhotos = result.totaal || 0;
            this.totalPages = result.totaalPaginas || 0;
            
            this.hideProgress();
            this.displayPhotos(result.fotos || []);
            
            // Update paginatie controls
            this.updatePaginationControls();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('loadFailed')}${error.message}`);
        }
    }
    
    updatePaginationControls() {
        const paginationContainer = document.getElementById('paginationControls');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const currentPageInfo = document.getElementById('currentPageInfo');
        const startIndex = document.getElementById('startIndex');
        const endIndex = document.getElementById('endIndex');
        const totalItems = document.getElementById('totalItems');
        
        const t = this.t.bind(this);
        
        if (!paginationContainer) return;
        
        if (this.totalPhotos === 0) {
            paginationContainer.classList.add('d-none');
            return;
        }
        
        paginationContainer.classList.remove('d-none');
        
        // Update paginatie knoppen
        if (prevBtn) {
            if (this.currentPage <= 1) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }
        
        if (nextBtn) {
            if (this.currentPage >= this.totalPages) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }
        
        // Update paginatie info
        if (currentPageInfo) {
            currentPageInfo.textContent = `${t('show')} ${this.currentPage} ${t('of')} ${this.totalPages}`;
        }
        
        // Update item range
        const start = ((this.currentPage - 1) * this.photosPerPage) + 1;
        const end = Math.min(this.currentPage * this.photosPerPage, this.totalPhotos);
        
        if (startIndex) startIndex.textContent = start;
        if (endIndex) endIndex.textContent = end;
        if (totalItems) totalItems.textContent = this.totalPhotos;
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
                    this.currentPage = 1;
                    this.loadPhotos();
                });
            }
            
            return;
        }
        
        let html = '';
        
        for (const foto of fotos) {
            // Zoek hond informatie op
            let dog = this.allDogs.find(d => d.stamboomnr === foto.stamboomnr);
            if (!dog) {
                try {
                    dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                    if (dog) this.allDogs.push(dog);
                } catch (error) {
                    console.error('Fout bij laden hond info:', error);
                }
            }
            
            const dogName = dog ? `${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}` : t('unknownDog');
            const uploadDatum = new Date(foto.uploaded_at).toLocaleDateString(this.currentLang);
            
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 photo-card">
                        <div class="card-img-top photo-thumbnail" 
                             style="height: 180px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-foto-id="${foto.id}">
                            ${foto.url ? 
                                `<img src="${foto.url}" alt="${foto.description || dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<i class="bi bi-image text-muted" style="font-size: 3rem;"></i>`
                            }
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-2">${dogName}</h6>
                            ${foto.description ? `
                                <p class="card-text small text-muted flex-grow-1">
                                    ${foto.description}
                                </p>
                            ` : ''}
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">${uploadDatum}</small>
                                    <button class="btn btn-sm btn-outline-danger delete-photo-btn" data-id="${foto.id}" data-stamboomnr="${foto.stamboomnr}" data-filepath="${foto.filepath}">
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
        
        // Event listener voor thumbnails (voor vergroting)
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
                const stamboomnr = e.currentTarget.dataset.stamboomnr;
                const filepath = e.currentTarget.dataset.filepath;
                await this.deletePhoto(fotoId, stamboomnr, filepath);
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
            const dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
            const dogName = dog ? `${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}` : t('unknownDog');
            
            // Maak modal HTML
            const html = `
                <div class="modal fade" id="photoDetailsModal" tabindex="-1" aria-labelledby="photoDetailsModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title" id="photoDetailsModalLabel">
                                    <i class="bi bi-image"></i> ${t('photoDetails')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
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
            container.insertAdjacentHTML('beforeend', html);
            
            const modalElement = document.getElementById('photoDetailsModal');
            const modal = new bootstrap.Modal(modalElement);
            
            // Cleanup na modal sluiten
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
            modal.show();
            
        } catch (error) {
            this.showError(`${t('loadDetailsFailed')}${error.message}`);
        }
    }
    
    async deletePhoto(fotoId, stamboomnr, filepath) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'));
        
        try {
            // Verwijder uit storage
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
            this.currentPage = 1;
            await this.loadPhotos();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('deleteFailed')}${error.message}`);
        }
    }
}