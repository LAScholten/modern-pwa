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
        
        // Compressie instellingen
        this.maxFileSizeMB = 1; // Maximale bestandsgrootte na compressie (1MB)
        this.maxWidth = 1920;   // Maximale breedte in pixels
        this.maxHeight = 1920;  // Maximale hoogte in pixels
        this.quality = 0.8;     // JPEG kwaliteit (0.8 = 80%)
        
        // Paginatie variabelen
        this.currentPhotoPage = 1;
        this.photosPerPage = 12;
        this.totalPhotos = 0;
        this.totalPhotoPages = 0;
        this.isLoadingPhotos = false;
        
        // Zoek variabelen
        this.searchTimeout = null;
        this.minSearchLength = 2;
        
        // PhotoViewer referentie
        this.photoViewer = null;
        
        // Tom Select instantie
        this.tomSelect = null;
        
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
                loadingAllDogs: "Honden zoeken...",
                loadedDogs: "honden gevonden",
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
                compressing: "Foto wordt gecomprimeerd...",
                uploadSuccess: "Foto succesvol geüpload!",
                uploadFailed: "Upload mislukt: ",
                fileReadError: "Fout bij lezen bestand",
                loadFailed: "Laden mislukt: ",
                deleteConfirm: "Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
                deleting: "Foto verwijderen...",
                deleteSuccess: "Foto succesvol verwijderd!",
                deleteFailed: "Verwijderen mislukt: ",
                searchToFindDogs: "Typ minimaal 2 tekens om te zoeken...",
                loadingProgress: "Honden zoeken: ",
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
                photos: "foto's",
                typeToSearch: "Typ om te zoeken...",
                compressionInfo: "Foto's worden automatisch gecomprimeerd naar maximaal 1MB voor optimale opslag",
                originalSize: "Originele grootte",
                compressedSize: "Gecomprimeerde grootte",
                compressionSaved: "Bespaard"
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
                loadingAllDogs: "Searching dogs...",
                loadedDogs: "dogs found",
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
                compressing: "Compressing photo...",
                uploadSuccess: "Photo uploaded successfully!",
                uploadFailed: "Upload failed: ",
                fileReadError: "Error reading file",
                loadFailed: "Loading failed: ",
                deleteConfirm: "Are you sure you want to delete this photo? This cannot be undone.",
                deleting: "Deleting photo...",
                deleteSuccess: "Photo successfully deleted!",
                deleteFailed: "Delete failed: ",
                searchToFindDogs: "Type at least 2 characters to search...",
                loadingProgress: "Searching dogs: ",
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
                photos: "photos",
                typeToSearch: "Type to search...",
                compressionInfo: "Photos are automatically compressed to a maximum of 1MB for optimal storage",
                originalSize: "Original size",
                compressedSize: "Compressed size",
                compressionSaved: "Saved"
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
                loadingAllDogs: "Hunde suchen...",
                loadedDogs: "Hunde gefunden",
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
                compressing: "Foto wird komprimiert...",
                uploadSuccess: "Foto erfolgreich hochgeladen!",
                uploadFailed: "Upload fehlgeschlagen: ",
                fileReadError: "Fehler beim Lesen der Datei",
                loadFailed: "Laden fehlgeschlagen: ",
                deleteConfirm: "Sind Sie sicher, dass Sie dieses Foto löschen möchten? Dies kann nicht rückgängig gemacht werden.",
                deleting: "Foto wird gelöscht...",
                deleteSuccess: "Foto erfolgreich gelöscht!",
                deleteFailed: "Löschen fehlgeschlagen: ",
                searchToFindDogs: "Geben Sie mindestens 2 Zeichen ein...",
                loadingProgress: "Hunde suchen: ",
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
                photos: "Fotos",
                typeToSearch: "Tippen Sie zum Suchen...",
                compressionInfo: "Fotos werden automatisch auf maximal 1MB komprimiert für optimale Speicherung",
                originalSize: "Originalgröße",
                compressedSize: "Komprimierte Größe",
                compressionSaved: "Gespart"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    /**
     * Comprimeer een afbeelding naar maximaal 1MB
     * @param {string} base64Data - De originele base64 afbeelding
     * @param {string} originalType - Het originele MIME type
     * @returns {Promise<{data: string, type: string, size: number}>}
     */
    async compressImage(base64Data, originalType) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    // Bereken nieuwe dimensies (behoud aspect ratio)
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > this.maxWidth || height > this.maxHeight) {
                        if (width > height) {
                            height = (height * this.maxWidth) / width;
                            width = this.maxWidth;
                        } else {
                            width = (width * this.maxHeight) / height;
                            height = this.maxHeight;
                        }
                    }
                    
                    // Maak canvas voor compressie
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Probeer verschillende kwaliteiten totdat bestand onder 1MB is
                    const compressRecursively = (quality) => {
                        // Bepaal output formaat (JPEG voor betere compressie, behoud PNG voor transparantie)
                        let outputType = 'image/jpeg';
                        let outputData;
                        
                        if (originalType === 'image/png' && this.hasTransparency(base64Data)) {
                            outputType = 'image/png';
                            outputData = canvas.toDataURL(outputType);
                        } else {
                            outputData = canvas.toDataURL(outputType, quality);
                        }
                        
                        const outputSize = this.getBase64Size(outputData);
                        
                        // Als bestand nog te groot is en kwaliteit nog niet te laag is, probeer lagere kwaliteit
                        if (outputSize > this.maxFileSizeMB * 1024 * 1024 && quality > 0.3) {
                            compressRecursively(quality - 0.1);
                        } else {
                            // Log compressie resultaat voor debugging
                            const originalSize = this.getBase64Size(base64Data);
                            console.log(`📸 Compressie: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${Math.round((1 - outputSize/originalSize) * 100)}% bespaard)`);
                            
                            resolve({
                                data: outputData,
                                type: outputType,
                                size: outputSize
                            });
                        }
                    };
                    
                    compressRecursively(this.quality);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error('Kon afbeelding niet laden voor compressie'));
            };
            
            img.src = base64Data;
        });
    }
    
    /**
     * Controleer of een PNG transparantie heeft
     */
    hasTransparency(base64Data) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;
                
                for (let i = 3; i < data.length; i += 4) {
                    if (data[i] < 255) {
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            };
            img.src = base64Data;
        });
    }
    
    /**
     * Bereken de grootte van een base64 string in bytes
     */
    getBase64Size(base64String) {
        // Verwijder de data URL prefix (bv "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1] || base64String;
        // Bereken grootte: base64 karakters * 3/4 - padding
        let size = Math.ceil(base64.length * 0.75);
        return size;
    }
    
    /**
     * Toon compressie info in de UI
     */
    showCompressionInfo(originalSize, compressedSize, containerId) {
        const t = this.t.bind(this);
        const savedMB = ((originalSize - compressedSize) / 1024 / 1024).toFixed(2);
        const savedPercent = Math.round((1 - compressedSize/originalSize) * 100);
        
        const infoHtml = `
            <div class="alert alert-info alert-dismissible fade show mb-3" role="alert">
                <i class="bi bi-info-circle"></i>
                <strong>${t('compressionSaved')}:</strong> ${savedMB}MB (${savedPercent}%)
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.getElementById(containerId);
        if (container) {
            // Verwijder bestaande compressie info
            const existingInfo = container.querySelector('.alert-info');
            if (existingInfo) existingInfo.remove();
            container.insertAdjacentHTML('afterbegin', infoHtml);
            
            // Auto verwijderen na 5 seconden
            setTimeout(() => {
                const info = container.querySelector('.alert-info');
                if (info) info.remove();
            }, 5000);
        }
    }
    
    /**
     * Haal alle mannelijke honden op uit de database (voor Tom Select)
     */
    async getAllMaleDogs(searchTerm = '', page = 1, pageSize = 100) {
        try {
            console.log(`🔍 Reuen ophalen - Zoekterm: "${searchTerm}", Pagina: ${page}, Size: ${pageSize}`);
            
            const supabase = window.supabase;
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return { data: [], total: 0 };
            }
            
            let query = supabase
                .from('honden')
                .select('*', { count: 'exact' });
            
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
            
            console.log(`✅ ${data?.length || 0} honden gevonden (totaal: ${count || 0})`);
            return { 
                data: data || [], 
                total: count || 0 
            };
            
        } catch (error) {
            console.error('❌ Fout bij ophalen honden:', error);
            return { data: [], total: 0 };
        }
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
     * Maak een searchable dropdown met Tom Select
     */
    async initTomSelect(initialValue = null) {
        if (typeof window.TomSelect === 'undefined') {
            console.log('⏳ Tom Select wordt geladen...');
            await this.loadTomSelect();
        }
        
        const selectElement = document.getElementById('photoHondSelect');
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
            placeholder: this.t('selectDog'),
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
            onChange: (value) => {
                if (value) {
                    const selectedOption = tomSelect.getOption(value);
                    const stamboomnr = selectedOption ? selectedOption.dataset.stamboomnr : '';
                    const dogName = selectedOption ? selectedOption.dataset.dogName : '';
                    
                    document.getElementById('selectedDogId').value = value;
                    document.getElementById('selectedDogStamboomnr').value = stamboomnr;
                    document.getElementById('selectedDogName').value = dogName;
                } else {
                    document.getElementById('selectedDogId').value = '';
                    document.getElementById('selectedDogStamboomnr').value = '';
                    document.getElementById('selectedDogName').value = '';
                }
            },
            onInitialize: function() {
                console.log('✅ Tom Select geïnitialiseerd in PhotoManager');
            }
        });
        
        if (initialValue) {
            tomSelect.setValue(initialValue);
        }
        
        this.tomSelect = tomSelect;
        return tomSelect;
    }
    
    /**
     * Zorg dat PhotoViewer geladen is
     */
    async ensurePhotoViewer() {
        if (window.photoViewer && typeof window.photoViewer.showPhoto === 'function') {
            this.photoViewer = window.photoViewer;
            return;
        }
        
        console.log('📸 PhotoViewer wordt dynamisch geladen door PhotoManager...');
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/modules/PhotoViewer.js';
            script.onload = () => {
                let checkCount = 0;
                const checkInterval = setInterval(() => {
                    if (window.photoViewer) {
                        clearInterval(checkInterval);
                        this.photoViewer = window.photoViewer;
                        this.photoViewer.updateLanguage(this.currentLang);
                        console.log('✅ PhotoViewer geladen en klaar voor gebruik door PhotoManager');
                        resolve();
                    } else if (checkCount > 20) {
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
                                            <small class="text-muted mt-2">${t('compressionInfo')}</small>
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
                            <div class="alert alert-info mb-3">
                                <i class="bi bi-info-circle"></i> ${t('compressionInfo')}
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
                                                        <label for="photoHondSelect" class="form-label">${t('selectDog')}</label>
                                                        <select class="form-control" id="photoHondSelect" placeholder="${t('typeToSearch')}">
                                                            <option value="">${t('typeToSearch')}</option>
                                                        </select>
                                                        <small class="text-muted d-block mt-2">${t('searchToFindDogs')}</small>
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
        
        this.initTomSelect();
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
        
        // Check originele bestandsgrootte (max 50MB om te voorkomen dat de browser vastloopt)
        if (file.size > 50 * 1024 * 1024) {
            this.showError('Bestand is te groot (maximaal 50MB voor verwerking)', 'recentUploadsContainer');
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
                
                let base64Data = e.target.result;
                const originalSize = this.getBase64Size(base64Data);
                
                // Compressie stap (alleen als bestand groter is dan maxFileSizeMB)
                let finalData = base64Data;
                let finalType = file.type;
                let finalSize = originalSize;
                
                if (originalSize > this.maxFileSizeMB * 1024 * 1024) {
                    this.showProgress(t('compressing'), 'recentUploadsContainer');
                    
                    const compressed = await this.compressImage(base64Data, file.type);
                    finalData = compressed.data;
                    finalType = compressed.type;
                    finalSize = compressed.size;
                    
                    // Toon compressie info
                    this.showCompressionInfo(originalSize, finalSize, 'recentUploadsContainer');
                }
                
                // Genereer thumbnail
                let thumbnail = null;
                try {
                    const img = new Image();
                    img.src = finalData;
                    
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
                    thumbnail = finalData;
                }
                
                const fotoData = {
                    stamboomnr: stamboomnr,
                    data: finalData,
                    thumbnail: thumbnail,
                    filename: file.name,
                    size: finalSize,
                    type: finalType,
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
                
                if (this.tomSelect) {
                    this.tomSelect.clear();
                }
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
                                ${foto.size ? `<small class="text-muted d-block">${(foto.size / 1024 / 1024).toFixed(2)}MB</small>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        for (const element of document.querySelectorAll('.photo-thumbnail')) {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                const imageUrl = element.dataset.imageUrl;
                const dogName = element.dataset.dogName || t('unknownDog');
                
                try {
                    await this.ensurePhotoViewer();
                    
                    if (window.photoViewer && imageUrl) {
                        window.photoViewer.showPhoto(imageUrl, dogName);
                    } else if (this.photoViewer && imageUrl) {
                        this.photoViewer.showPhoto(imageUrl, dogName);
                    }
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
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
                                    <div>
                                        <small class="text-muted">${uploadDatum}</small>
                                        ${foto.size ? `<br><small class="text-muted">${(foto.size / 1024 / 1024).toFixed(2)}MB</small>` : ''}
                                    </div>
                                    ${deleteButton}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        for (const element of document.querySelectorAll('.photo-thumbnail')) {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                const imageUrl = element.dataset.imageUrl;
                const dogName = element.dataset.dogName || t('unknownDog');
                
                try {
                    await this.ensurePhotoViewer();
                    
                    if (window.photoViewer && imageUrl) {
                        window.photoViewer.showPhoto(imageUrl, dogName);
                    } else if (this.photoViewer && imageUrl) {
                        this.photoViewer.showPhoto(imageUrl, dogName);
                    }
                } catch (error) {
                    console.error('Fout bij tonen foto:', error);
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
const PhotoManagerInstance = new PhotoManager();

// Zet globaal
window.PhotoManager = PhotoManagerInstance;
window.photoManager = PhotoManagerInstance;

console.log('📸 PhotoManager geladen met automatische compressie naar 1MB');