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
        
        this.translations = {
            nl: {
                photoGallery: "Foto Galerij",
                photoInfo: "Foto Galerij - Bekijk en beheer foto's van honden. Upload nieuwe foto's of verwijder bestaande foto's.",
                uploadRestricted: "Foto Galerij - Foto's bekijken. Uploaden is alleen mogelijk voor Gebruiker+ en Administrator.",
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
                deleteSuccess: "Foto succesvol verwijderen!",
                deleteFailed: "Verwijderen mislukt: ",
                photoNotFound: "Foto niet gevonden",
                loadDetailsFailed: "Fout bij laden foto details: ",
                searchToFindDogs: "Typ om te zoeken...",
                loadingProgress: "Honden laden: ",
                thumbnailError: "Thumbnail maken mislukt",
                loadPhotosMessage: "laad de foto's en klik op foto voor vergroting"
            },
            en: {
                photoGallery: "Photo Gallery",
                photoInfo: "Photo Gallery - View and manage dog photos. Upload new photos or delete existing ones.",
                uploadRestricted: "Photo Gallery - View photos. Uploading is only available for User+ and Administrator.",
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
                loadingProgress: "Loading dogs: ",
                thumbnailError: "Thumbnail creation failed",
                loadPhotosMessage: "load the photos and click on photo for enlargement"
            },
            de: {
                photoGallery: "Foto Galerie",
                photoInfo: "Foto Galerie - Hunderfotos ansehen und verwalten. Laden Sie neue Fotos hoch of löschen Sie vorhandene.",
                uploadRestricted: "Foto Galerie - Fotos ansehen. Hochladen ist nur für Benutzer+ und Administrator verfügbar.",
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
                fileTooLarge: "Datei ist zu groot (maximal 5MB)",
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
                photoNotFound: "Foto nicht gevonden",
                loadDetailsFailed: "Fehler beim Laden der Fotodetails: ",
                searchToFindDogs: "Tippen Sie zum Suchen...",
                loadingProgress: "Hunde laden: ",
                thumbnailError: "Thumbnail-Erstellung fehlgeschlagen",
                loadPhotosMessage: "Laden Sie die Fotos und klicken Sie auf das Foto für eine Vergrößerung"
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
        const showUploadSection = !this.isUser; // Alleen tonen voor admin en gebruiker+
        
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
                            
                            <!-- FOTO OVERZICHT BOVENAAN -->
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
                                        <p class="mt-3 text-muted">${t('loadPhotosMessage')}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- FOTO UPLOAD ONDERAAN - ALLEEN VOOR ADMIN EN GEBRUIKER+ -->
                            ${showUploadSection ? `
                            <div class="row mb-4 mt-5">
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
                            ` : ''}
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
        // Alleen upload knop tonen voor admin en gebruiker+
        if (!this.isUser) {
            const uploadBtn = document.getElementById('uploadPhotoBtn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', () => {
                    this.uploadPhoto();
                });
            }
        }
        
        const loadBtn = document.getElementById('loadAllPhotosBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadAllPhotos();
            });
        }
        
        // Alleen zoekfunctionaliteit tonen voor admin en gebruiker+
        if (!this.isUser) {
            this.setupDogSearch();
        }
        
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
        
        // Laad ALLE honden bij eerste focus
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
            
            console.log(`PhotoManager: ${this.allDogs.length} honden geladen`);
            
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
        const displayCount = Math.min(this.filteredDogs.length, 100);
        
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
                            
                            // REDUCEERD: Max grootte van 200px naar 100px (50%)
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
                            
                            thumbnail = canvas.toDataURL('image/jpeg', 0.6); // Iets lagere kwaliteit
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
                
                console.log('Foto data voor database:', {
                    stamboomnr: fotoData.stamboomnr,
                    filename: fotoData.filename,
                    size: fotoData.size,
                    hasData: !!fotoData.data,
                    hasThumbnail: !!fotoData.thumbnail,
                    geupload_door: fotoData.geupload_door,
                    hond_id: fotoData.hond_id
                });
                
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
        };
        
        reader.onerror = () => {
            this.hideProgress();
            this.showError(t('fileReadError'));
        };
        
        reader.readAsDataURL(file);
    }
    
    async loadAllPhotos() {
        const t = this.t.bind(this);
        this.showProgress(t('loading'));
        
        try {
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .order('uploaded_at', { ascending: false })
                .limit(12);
            
            if (error) throw error;
            
            this.hideProgress();
            await this.displayPhotos(fotos || []);
            
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
                    <p class="mt-3 text-muted">${t('loadPhotosMessage')}</p>
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
            
            // VERWIJDERKNOP ALLEEN VOOR ADMIN
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
                             data-dog-name="${dogName}">
                            ${imageUrl ? 
                                `<img src="${imageUrl}" alt="${dogName}" 
                                      style="max-width: 100%; max-height: 100%; object-fit: cover; transform: scale(0.8);" 
                                      data-foto-id="${foto.id}">` :
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
        
        document.querySelectorAll('.photo-thumbnail, .photo-thumbnail img').forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                const fotoId = e.currentTarget.dataset.fotoId;
                const dogName = e.currentTarget.closest('.photo-thumbnail')?.dataset.dogName || t('unknownDog');
                this.showPhotoDetails(fotoId, dogName);
            });
        });
        
        // Alleen admin kan verwijderen
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
    
    async showPhotoDetails(fotoId, providedDogName = null) {
        const t = this.t.bind(this);
        
        try {
            const { data: foto, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('id', fotoId)
                .single();
            
            if (error) throw error;
            
            let dogName = providedDogName || t('unknownDog');
            if (!providedDogName && foto.stamboomnr) {
                try {
                    const dog = await window.hondenService.getHondByStamboomnr(foto.stamboomnr);
                    if (dog) {
                        dogName = `${dog.naam || ''}${dog.kennelnaam ? ` (${dog.kennelnaam})` : ''}`;
                    }
                } catch (error) {
                    console.error('Error loading dog info:', error);
                }
            }
            
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
                                            ${foto.data ? 
                                                `<img src="${foto.data}" alt="${dogName}" 
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
            
            const existingModal = document.getElementById('photoDetailsModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            const container = document.getElementById('modalsContainer');
            if (container) {
                container.insertAdjacentHTML('beforeend', modalHTML);
            } else {
                document.body.insertAdjacentHTML('beforeend', modalHTML);
            }
            
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
    
    async deletePhoto(fotoId) {
        const t = this.t.bind(this);
        
        if (!confirm(t('deleteConfirm'))) {
            return;
        }
        
        this.showProgress(t('deleting'));
        
        try {
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
    
    // Helper method voor progress tonen
    showProgress(message) {
        const container = document.getElementById('photosContainer');
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
    
    // Helper method voor progress verbergen
    hideProgress() {
        const progressEl = document.querySelector('#photosContainer .spinner-border');
        if (progressEl) {
            progressEl.remove();
        }
    }
    
    // Helper method voor foutmelding
    showError(message) {
        const container = document.getElementById('photosContainer');
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
    
    // Helper method voor succesmelding
    showSuccess(message) {
        const container = document.getElementById('photosContainer');
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