// js/modules/DekReuen.js

/**
 * DekReuen Management Module voor Supabase
 * Beheert dek reuen overzicht en beheer met echte database koppeling
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
        this.hondFotos = [];
        
        // Bewerken variabelen
        this.editingDekReuId = null;
        
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
                save: "Opslaan",
                cancel: "Annuleren",
                selectHond: "Zoek een reu door naam of kennelnaam te typen...",
                searchHond: "Typ minimaal 2 letters om te zoeken...",
                active: "Actief",
                inactive: "Inactief",
                status: "Status",
                description: "Beschrijving",
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
                editDekReu: "Dek Reu Bewerken"
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
                save: "Save",
                cancel: "Cancel",
                selectHond: "Search for a male dog by name or kennel name...",
                searchHond: "Type at least 2 characters to search...",
                active: "Active",
                inactive: "Inactive",
                status: "Status",
                description: "Description",
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
                editDekReu: "Edit Stud Dog"
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
                save: "Speichern",
                cancel: "Abbrechen",
                selectHond: "Suchen Sie einen Rüden nach Namen oder Zwingername...",
                searchHond: "Geben Sie mindestens 2 Zeichen ein...",
                active: "Aktiv",
                inactive: "Inaktiv",
                status: "Status",
                description: "Beschreibung",
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
                editDekReu: "Zuchtrüde Bearbeiten"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
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
                .select('id, naam, kennelnaam, stamboomnr, geboortedatum, ras', { count: 'exact' })
                .eq('geslacht', 'reuen');
            
            // Voeg zoekfilter toe als er minimaal 2 karakters zijn
            if (searchTerm && searchTerm.length >= 2) {
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%`);
            }
            
            // Bereken offset voor paginatie
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            
            // Voeg sortering en paginatie toe
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
            
            // Eerst de stamboomnr van de hond ophalen
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
            
            // Haal foto's op via stamboomnr
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
        
        // Validatie
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
                
                // Maak thumbnail
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
                
                console.log('Foto data voor database:', {
                    stamboomnr: fotoData.stamboomnr,
                    filename: fotoData.filename,
                    size: fotoData.size,
                    hond_id: fotoData.hond_id
                });
                
                const { data: dbData, error: dbError } = await this.getSupabase()
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
                this.showSuccess(t('uploadSuccess'), 'hondFotosContainer');
                
                // Reset file input
                fileInput.value = '';
                
                // Herlaad foto's
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
     * Laad en toon foto's voor geselecteerde hond
     */
    async loadHondFotos(hondId) {
        if (!hondId) return;
        
        this.selectedHondId = hondId;
        this.hondFotos = await this.getHondFotos(hondId);
        
        await this.displayHondFotos();
    }
    
    /**
     * Toon foto's in de container
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
            const uploadDatum = new Date(foto.uploaded_at).toLocaleDateString(this.currentLang);
            
            html += `
                <div class="col-md-4 col-lg-3 mb-3">
                    <div class="card h-100">
                        <div class="card-img-top dek-reu-foto-thumbnail" 
                             style="height: 120px; cursor: pointer; background: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden;"
                             data-foto='${JSON.stringify(foto).replace(/'/g, '&apos;')}'
                             data-hond-naam="${this.selectedHondNaam || ''}">
                            <img src="${foto.thumbnail || foto.data}" alt="Foto" 
                                 style="max-width: 100%; max-height: 100%; object-fit: cover;">
                        </div>
                        <div class="card-body p-2">
                            <small class="text-muted d-block text-truncate" title="${foto.filename || ''}">${foto.filename || ''}</small>
                            <small class="text-muted">${uploadDatum}</small>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Event listeners voor foto's
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam || this.selectedHondNaam || '';
                    this.showPhotoModal(foto, hondNaam);
                } catch (error) {
                    console.error('Fout bij parseren foto data:', error);
                }
            });
        });
    }
    
    /**
     * Toon foto modal voor grotere weergave
     */
    async showPhotoModal(foto, dogName) {
        try {
            const t = this.t.bind(this);
            
            const modalHTML = `
                <div class="modal fade" id="dekReuPhotoModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-image"></i> ${dogName || t('dekReuen')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body text-center">
                                <div class="mb-4">
                                    ${foto.data ? 
                                        `<img src="${foto.data}" alt="${dogName}" 
                                              class="img-fluid rounded shadow" style="max-height: 70vh; max-width: 100%;">` :
                                        `<div class="bg-light p-5 rounded text-center">
                                            <i class="bi bi-image text-muted" style="font-size: 5rem;"></i>
                                            <p class="mt-3 text-muted">${t('noPhotos')}</p>
                                        </div>`
                                    }
                                </div>
                                <div class="text-muted small">
                                    ${foto.filename ? `<div>${foto.filename}</div>` : ''}
                                    ${foto.uploaded_at ? `<div>${t('photoUploaded')}: ${new Date(foto.uploaded_at).toLocaleDateString(this.currentLang)}</div>` : ''}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const existingModal = document.getElementById('dekReuPhotoModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            const container = document.getElementById('modalsContainer');
            if (container) {
                container.insertAdjacentHTML('beforeend', modalHTML);
            } else {
                document.body.insertAdjacentHTML('beforeend', modalHTML);
            }
            
            const modalElement = document.getElementById('dekReuPhotoModal');
            const modal = new bootstrap.Modal(modalElement);
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
            modal.show();
            
        } catch (error) {
            console.error('❌ Fout bij tonen foto:', error);
        }
    }
    
    /**
     * Maak een searchable dropdown met Tom Select
     */
    async initTomSelect(initialValue = null) {
        // Wacht tot Tom Select geladen is
        if (typeof window.TomSelect === 'undefined') {
            console.log('⏳ Tom Select wordt geladen...');
            await this.loadTomSelect();
        }
        
        // Verwijder bestaande Tom Select instance
        const selectElement = document.getElementById('hondSelect');
        if (!selectElement) return null;
        
        if (selectElement.tomselect) {
            selectElement.tomselect.destroy();
        }
        
        // Initialiseer Tom Select
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
                
                // Clear bestaande timeout
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                // Debounce de zoekopdracht
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
                // Sla geselecteerde hond ID op en laad foto's
                this.selectedHondId = value ? parseInt(value) : null;
                
                if (this.selectedHondId) {
                    // Toon upload sectie
                    const uploadSection = document.getElementById('photoUploadSection');
                    if (uploadSection) {
                        uploadSection.style.display = 'block';
                    }
                    
                    // Laad foto's
                    await this.loadHondFotos(this.selectedHondId);
                } else {
                    // Verberg upload sectie
                    const uploadSection = document.getElementById('photoUploadSection');
                    if (uploadSection) {
                        uploadSection.style.display = 'none';
                    }
                    
                    // Leeg foto container
                    const container = document.getElementById('hondFotosContainer');
                    if (container) {
                        container.innerHTML = '';
                    }
                }
            },
            onInitialize: function() {
                console.log('✅ Tom Select geïnitialiseerd');
            }
        });
        
        // Set initial value if provided
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
            // Controleer of al geladen
            if (typeof window.TomSelect !== 'undefined') {
                resolve();
                return;
            }
            
            // Laad CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/css/tom-select.bootstrap5.min.css';
            document.head.appendChild(link);
            
            // Laad JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.2.2/dist/js/tom-select.complete.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
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
        
        // Haal gebruiker op
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;
        console.log('Gebruiker:', user?.email);
        
        // Reset variabelen
        this.currentPage = 1;
        this.currentSearchTerm = '';
        this.selectedHondId = null;
        this.selectedHondStamboomnr = null;
        this.selectedHondNaam = null;
        this.hondFotos = [];
        this.editingDekReuId = null;
        
        // Toon keuze menu voor admin
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
        
        // Event listeners
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
            
            // Reset editing ID
            this.editingDekReuId = null;
            
            // Initialiseer Tom Select voor searchable dropdown
            await this.initTomSelect();
            
            // Upload button event listener
            document.getElementById('uploadDekReuPhotoBtn')?.addEventListener('click', () => this.uploadPhoto());
            
            document.getElementById('saveDekReuBtn')?.addEventListener('click', () => this.saveDekReu());
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.selectedHondId = null;
                this.selectedHondStamboomnr = null;
                this.selectedHondNaam = null;
                this.hondFotos = [];
                this.editingDekReuId = null;
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
            
            // Sla de ID op van de te bewerken dek reu
            this.editingDekReuId = dekreu.id;
            
            // Sla de hond ID op
            this.selectedHondId = dekreu.hond_id;
            
            // Haal de volledige dek reu data op als die nog niet compleet is
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
            
            // Vul de formuliervelden met bestaande data
            await this.populateEditForm(dekReuData);
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.selectedHondId = null;
                this.selectedHondStamboomnr = null;
                this.selectedHondNaam = null;
                this.hondFotos = [];
                this.editingDekReuId = null;
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
            // Vul de Tom Select met de bestaande hond
            if (dekreu.hond_id) {
                // Initialiseer Tom Select met de bestaande waarde
                const tomSelect = await this.initTomSelect(dekreu.hond_id);
                
                // Forceer het laden van de optie
                const hond = dekreu.hond || await this.getHondById(dekreu.hond_id);
                if (hond && tomSelect) {
                    const optionData = {
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`
                    };
                    
                    // Voeg optie toe en selecteer deze
                    tomSelect.addOption(optionData);
                    tomSelect.setValue(hond.id);
                }
            }
            
            // Vul status checkbox
            const actiefCheck = document.getElementById('actiefCheck');
            if (actiefCheck) {
                actiefCheck.checked = dekreu.actief === true;
            }
            
            // Vul beschrijving veld
            const beschrijvingField = document.getElementById('beschrijvingField');
            if (beschrijvingField) {
                beschrijvingField.value = dekreu.beschrijving || '';
            }
            
            // Laad foto's voor deze hond
            if (dekreu.hond_id) {
                await this.loadHondFotos(dekreu.hond_id);
            }
            
            // Verander de knop tekst naar "Bijwerken"
            const saveBtn = document.getElementById('saveDekReuBtn');
            if (saveBtn) {
                saveBtn.innerHTML = `<i class="bi bi-pencil-square"></i> ${this.t('edit')}`;
            }
            
            // Verander modal titel
            const modalTitle = document.querySelector('#addEditDekReuModal .modal-title');
            if (modalTitle) {
                modalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ${this.t('editDekReu')}`;
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
                .select('id, naam, kennelnaam, stamboomnr')
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
    
    getAddEditModalHTML(mode = 'add') {
        const title = mode === 'add' ? this.t('addDekReu') : this.t('editDekReu');
        const icon = mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square';
        const saveButtonText = mode === 'add' ? this.t('save') : this.t('edit');
        const saveButtonIcon = mode === 'add' ? 'bi-check-circle' : 'bi-pencil-square';
        
        return `
            <div class="modal fade" id="addEditDekReuModal" tabindex="-1">
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
                                <!-- Linker kolom: Hond selectie en basisgegevens -->
                                <div class="col-md-6">
                                    <form id="dekReuForm">
                                        <div class="mb-3">
                                            <label class="form-label">${this.t('selectHond')} *</label>
                                            <select class="form-control" id="hondSelect" placeholder="${this.t('typeToSearch')}" ${mode === 'edit' ? 'disabled' : ''} ${mode === 'edit' ? 'readonly' : ''}>
                                                <option value="">${this.t('typeToSearch')}</option>
                                            </select>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De hond kan niet worden gewijzigd bij bewerken</small>' : ''}
                                            <small class="text-muted d-block mt-2">
                                                ${this.t('searchHond')}
                                            </small>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">${this.t('status')}</label>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="actiefCheck" checked>
                                                <label class="form-check-label" for="actiefCheck">${this.t('active')}</label>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">${this.t('description')}</label>
                                            <textarea class="form-control" id="beschrijvingField" rows="3"></textarea>
                                        </div>
                                    </form>
                                </div>
                                
                                <!-- Rechter kolom: Foto upload en weergave -->
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
     */
    async loadDekReuen(isBeheer = false, page = 1) {
        const containerId = isBeheer ? 'dekReuenBeheerContainer' : 'dekReuenContainer';
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            
            // Haal dek reuen op met paginatie
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            const { data, error, count } = await supabase
                .from('dekreuen')
                .select('*, hond:honden(*)', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false })
                .range(from, to);
            
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
    
    async renderOverviewList(dekreuen, container, total = 0, currentPage = 1) {
        const html = [];
        
        for (const dek of dekreuen) {
            const h = dek.hond || {};
            
            // Haal foto's op voor deze hond
            const fotos = await this.getHondFotos(h.id);
            const eersteFotos = fotos.slice(0, 3); // Maximaal 3 foto's tonen
            
            // Genereer foto HTML
            let fotosHTML = '';
            if (fotos.length > 0) {
                fotosHTML = `
                    <div class="mt-3">
                        <small class="text-muted d-block mb-2">${this.t('photos')}:</small>
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
            
            html.push(`
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${h.naam || 'Onbekend'}</h5>
                            <p class="card-text">
                                <small class="text-muted d-block">${h.kennelnaam ? h.kennelnaam : ''}</small>
                                <small class="text-muted d-block">Stamboeknr: ${h.stamboomnr || '-'}</small>
                                <small class="text-muted d-block">Ras: ${h.ras || '-'}</small>
                                ${dek.beschrijving ? `<br>${dek.beschrijving}` : ''}
                            </p>
                            ${fotosHTML}
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-primary view-pedigree" data-hond-id="${dek.hond_id}">
                                    <i class="bi bi-diagram-3"></i> ${this.t('viewPedigree')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        // Voeg paginatie toe
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, false);
        
        container.innerHTML = `
            <div class="row">${html.join('')}</div>
            ${paginationHTML}
        `;
        
        // Event listeners voor foto thumbnails
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam;
                    this.showPhotoModal(foto, hondNaam);
                } catch (error) {
                    console.error('Fout bij parseren foto data:', error);
                }
            });
        });
        
        // Event listeners voor pedigree knop
        container.querySelectorAll('.view-pedigree').forEach(btn => {
            btn.addEventListener('click', () => this.viewPedigree(btn.dataset.hondId));
        });
        
        this.attachPaginationEvents(false);
    }
    
    async renderBeheerList(dekreuen, container, total = 0, currentPage = 1) {
        const { data: { user } } = await this.getSupabase().auth.getUser();
        
        const html = [];
        
        for (const dek of dekreuen) {
            const h = dek.hond || {};
            const canEdit = this.isAdmin || dek.toegevoegd_door === user?.id;
            
            // Haal foto's op voor deze hond
            const fotos = await this.getHondFotos(h.id);
            const eersteFotos = fotos.slice(0, 3); // Maximaal 3 foto's tonen
            
            // Genereer foto HTML
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
                                <div class="col-md-4">
                                    <h6 class="mb-0">${h.naam || 'Onbekend'}</h6>
                                    <small class="text-muted d-block">${h.kennelnaam ? h.kennelnaam : ''}</small>
                                    <small class="text-muted">Stamboeknr: ${h.stamboomnr || '-'}</small>
                                    ${fotosHTML}
                                </div>
                                <div class="col-md-3">
                                    <span class="badge ${dek.actief ? 'bg-success' : 'bg-secondary'}">
                                        ${dek.actief ? this.t('active') : this.t('inactive')}
                                    </span>
                                </div>
                                <div class="col-md-3">
                                    <small class="text-muted">${dek.beschrijving?.substring(0, 30) || '-'}</small>
                                </div>
                                <div class="col-md-2 text-end">
                                    ${canEdit ? `
                                        <button class="btn btn-sm btn-outline-primary edit-dekreu mb-1" 
                                            data-dekreu='${JSON.stringify(dek).replace(/'/g, '&apos;')}'>
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-dekreu" data-id="${dek.id}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        // Voeg paginatie toe
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, true);
        
        container.innerHTML = `
            <div class="row">${html.join('')}</div>
            ${paginationHTML}
        `;
        
        // Event listeners voor foto thumbnails in beheer view
        container.querySelectorAll('.dek-reu-foto-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                try {
                    const foto = JSON.parse(thumb.dataset.foto.replace(/&apos;/g, "'"));
                    const hondNaam = thumb.dataset.hondNaam;
                    this.showPhotoModal(foto, hondNaam);
                } catch (error) {
                    console.error('Fout bij parseren foto data:', error);
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
    
    async saveDekReu() {
        try {
            // Haal de geselecteerde waarde op van Tom Select
            const selectElement = document.getElementById('hondSelect');
            let hondId = null;
            
            if (selectElement.tomselect) {
                hondId = selectElement.tomselect.getValue();
            } else {
                hondId = selectElement.value;
            }
            
            // Voor bewerken mag hondId null zijn (we gebruiken dan de bestaande)
            if (!hondId && !this.editingDekReuId) {
                alert('Selecteer een hond');
                return;
            }
            
            const { data: { user } } = await this.getSupabase().auth.getUser();
            
            if (this.editingDekReuId) {
                // UPDATE bestaande dek reu
                const updateData = {
                    actief: document.getElementById('actiefCheck').checked,
                    beschrijving: document.getElementById('beschrijvingField').value || null
                };
                
                const { error } = await this.getSupabase()
                    .from('dekreuen')
                    .update(updateData)
                    .eq('id', this.editingDekReuId);
                
                if (error) throw error;
                
                alert('Dek reu bijgewerkt!');
                
            } else {
                // INSERT nieuwe dek reu
                const { error } = await this.getSupabase()
                    .from('dekreuen')
                    .insert({
                        hond_id: parseInt(hondId),
                        toegevoegd_door: user.id,
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
                
                alert('Dek reu toegevoegd!');
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEditDekReuModal'));
            if (modal) modal.hide();
            
            // Reset naar pagina 1 na toevoegen/bewerken
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
    
    viewPedigree(hondId) {
        if (window.pedigreeManager) {
            window.pedigreeManager.showPedigree(hondId);
        } else {
            alert('Stamboom module niet beschikbaar');
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
    
    // Helper method voor progress tonen
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
    
    // Helper method voor progress verbergen
    hideProgress() {
        // Verwijder alle spinners en alerts
        document.querySelectorAll('.alert-info .spinner-border').forEach(spinner => {
            const alert = spinner.closest('.alert');
            if (alert) alert.remove();
        });
    }
    
    // Helper method voor foutmelding
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
    
    // Helper method voor succesmelding
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

console.log('📦 DekReuenManager geladen met Tom Select, paginatie en uitgebreide foto functionaliteit');