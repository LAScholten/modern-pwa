/**
 * Reu en Teef Stamboom Module - AFZONDERLIJK BESTAND
 * Bevat alle stamboom functionaliteit voor toekomstige pup
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        this.db = mainModule.db;
        this.allHonden = []; // Wordt asynchroon ingeladen
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // COI Calculator - wordt LAAT geïnitialiseerd
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // Cache voor gezondheidsanalyse
        this.healthAnalysisCache = new Map();
        
        // Hondenservice referentie
        this.hondenService = window.hondenService;
        this.fotoService = window.fotoService;
    }
    
    async initializeAllHonden() {
        try {
            console.log('🔄 Laden van alle honden uit Supabase...');
            
            // Gebruik de hondenService om alle honden te laden
            const pageSize = 500; // Aantal per pagina
            let currentPage = 1;
            let allHonden = [];
            let hasMore = true;
            
            while (hasMore) {
                try {
                    const result = await this.hondenService.getHonden(currentPage, pageSize);
                    
                    if (result.honden && result.honden.length > 0) {
                        allHonden = allHonden.concat(result.honden);
                        console.log(`📄 Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                        
                        hasMore = result.heeftVolgende;
                        currentPage++;
                    } else {
                        hasMore = false;
                    }
                } catch (pageError) {
                    console.error(`❌ Fout bij laden pagina ${currentPage}:`, pageError);
                    hasMore = false;
                }
            }
            
            console.log(`✅ Totaal ${allHonden.length} honden geladen uit Supabase`);
            
            // Opschonen: zorg dat alle velden correct zijn gemapt
            const cleanedHonden = allHonden.map(hond => {
                // Supabase geeft velden soms met underscores, mappen naar camelCase
                return {
                    id: hond.id,
                    naam: hond.naam || '',
                    geslacht: hond.geslacht || 'onbekend',
                    vaderId: hond.vader_id || null,
                    moederId: hond.moeder_id || null,
                    vader: hond.vader || '',
                    moeder: hond.moeder || '',
                    kennelnaam: hond.kennelnaam || '',
                    stamboomnr: hond.stamboomnr || '',
                    ras: hond.ras || '',
                    vachtkleur: hond.vachtkleur || '',
                    geboortedatum: hond.geboortedatum || null,
                    overlijdensdatum: hond.overlijdensdatum || null,
                    heupdysplasie: hond.heupdysplasie || null,
                    elleboogdysplasie: hond.elleboogdysplasie || null,
                    patella: hond.patella || null,
                    ogen: hond.ogen || null,
                    ogenVerklaring: hond.ogenverklaring || null,
                    dandyWalker: hond.dandyWalker || null,
                    schildklier: hond.schildklier || null,
                    schildklierVerklaring: hond.schildklierverklaring || null,
                    land: hond.land || null,
                    postcode: hond.postcode || null,
                    opmerkingen: hond.opmerkingen || null
                };
            });
            
            this.allHonden = cleanedHonden;
            return cleanedHonden;
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren alle honden:', error);
            this.allHonden = [];
            return [];
        }
    }
    
    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        // Bewaar de geselecteerde honden
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        // VOORKOM MEERDERE GELIJKTIJDIGE BEREKENINGEN
        if (this.coiCalculationInProgress) {
            console.log('⚠️ COI berekening al bezig, wacht...');
            this.mainModule.showAlert('COI berekening is al bezig, even wachten...', 'info');
            return;
        }
        
        this.coiCalculationInProgress = true;
        
        try {
            // STAP 1: Laad eerst ALLE honden uit Supabase
            if (this.allHonden.length === 0) {
                console.log('🔄 Eerst alle honden laden uit Supabase...');
                await this.initializeAllHonden();
                
                if (this.allHonden.length === 0) {
                    this.mainModule.showAlert('Kon geen honden laden uit de database', 'danger');
                    return;
                }
            }
            
            // STAP 2: Maak een virtuele toekomstige pup (zonder COI berekening)
            const futurePuppy = this.createVirtualPuppy(selectedTeef, selectedReu);
            console.log('✅ Virtuele pup aangemaakt:', futurePuppy);
            
            // STAP 3: Toon de stamboom ZONDER COI berekeningen
            await this.createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu);
            
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.mainModule.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        } finally {
            this.coiCalculationInProgress = false;
        }
    }
    
    createVirtualPuppy(selectedTeef, selectedReu) {
        // Maak een virtuele toekomstige pup ZONDER COI berekeningen
        return {
            id: -999999, // Speciale ID voor virtuele pup
            naam: this.t('futurePuppyName'),
            geslacht: 'onbekend',
            vaderId: selectedReu.id,
            moederId: selectedTeef.id,
            vader: selectedReu.naam,
            moeder: selectedTeef.naam,
            kennelnaam: this.t('combinedParents'),
            stamboomnr: 'VOORSPELD',
            geboortedatum: new Date().toISOString().split('T')[0],
            vachtkleur: `${selectedReu.vachtkleur || ''}/${selectedTeef.vachtkleur || ''}`.trim(),
            heupdysplasie: null,
            elleboogdysplasie: null,
            patella: null,
            ogen: null,
            ogenVerklaring: null,
            dandyWalker: null,
            schildklier: null,
            schildklierVerklaring: null,
            land: null,
            postcode: null,
            opmerkingen: null,
            isVirtual: true // Markeer als virtuele pup
        };
    }
    
    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu) {
        const modalId = 'rtc-futurePuppyModal';
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        const title = this.t('futurePuppyTitle', { 
            reu: selectedReu.naam || '?', 
            teef: selectedTeef.naam || '?' 
        });
        
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="rtcFuturePuppyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="rtcFuturePuppyModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${title}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <div class="rtc-pedigree-mobile-wrapper" id="rtcFuturePuppyMobileWrapper">
                                <div class="rtc-pedigree-container-compact" id="rtcFuturePuppyContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">${this.t('loadingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('loadingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- GEÏSOLEERDE Popup overlay voor toekomstige pup details -->
            <div class="rtc-pedigree-popup-overlay" id="rtcPedigreePopupOverlay" style="display: none;">
                <div class="rtc-pedigree-popup-container" id="rtcPedigreePopupContainer"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        this.setupFuturePuppyModalEvents();
        
        // Render de stamboom ZONDER COI berekeningen
        await this.renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu);
    }
    
    setupFuturePuppyModalEvents() {
        const modal = document.getElementById('rtc-futurePuppyModal');
        if (!modal) return;
        
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        // Bouw de stamboom structuur
        const pedigreeTree = await this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        // Genereer alle cards asynchroon
        const mainDogCard = await this.generateDogCard(futurePuppy, this.t('mainDog'), true, 0);
        const fatherCard = await this.generateDogCard(selectedReu, this.t('fatherLabel'), false, 1);
        const motherCard = await this.generateDogCard(selectedTeef, this.t('motherLabel'), false, 1);
        
        const paternalGrandfatherCard = await this.generateDogCard(pedigreeTree.paternalGrandfather, this.t('grandfatherLabel'), false, 2);
        const paternalGrandmotherCard = await this.generateDogCard(pedigreeTree.paternalGrandmother, this.t('grandmotherLabel'), false, 2);
        const maternalGrandfatherCard = await this.generateDogCard(pedigreeTree.maternalGrandfather, this.t('grandfatherLabel'), false, 2);
        const maternalGrandmotherCard = await this.generateDogCard(pedigreeTree.maternalGrandmother, this.t('grandmotherLabel'), false, 2);
        
        const paternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
        const paternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
        const paternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
        const paternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
        const maternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
        const maternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
        const maternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
        const maternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
        
        // Over-overgrootouders (generatie 4)
        const paternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather1, this.t('greatGreatGrandfatherLabel'), false, 4);
        const paternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother1, this.t('greatGreatGrandmotherLabel'), false, 4);
        const paternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather2, this.t('greatGreatGrandfatherLabel'), false, 4);
        const paternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother2, this.t('greatGreatGrandmotherLabel'), false, 4);
        const paternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather3, this.t('greatGreatGrandfatherLabel'), false, 4);
        const paternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother3, this.t('greatGreatGrandmotherLabel'), false, 4);
        const paternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather4, this.t('greatGreatGrandfatherLabel'), false, 4);
        const paternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother4, this.t('greatGreatGrandmotherLabel'), false, 4);
        const maternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather1, this.t('greatGreatGrandfatherLabel'), false, 4);
        const maternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother1, this.t('greatGreatGrandmotherLabel'), false, 4);
        const maternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather2, this.t('greatGreatGrandfatherLabel'), false, 4);
        const maternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother2, this.t('greatGreatGrandmotherLabel'), false, 4);
        const maternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather3, this.t('greatGreatGrandfatherLabel'), false, 4);
        const maternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother3, this.t('greatGreatGrandmotherLabel'), false, 4);
        const maternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather4, this.t('greatGreatGrandfatherLabel'), false, 4);
        const maternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother4, this.t('greatGreatGrandmotherLabel'), false, 4);
        
        const gridHTML = `
            <div class="rtc-pedigree-grid-compact">
                <!-- Generatie 0: Toekomstige Pup -->
                <div class="rtc-pedigree-generation-col gen0">
                    ${mainDogCard}
                </div>
                
                <!-- Generatie 1: Ouders -->
                <div class="rtc-pedigree-generation-col gen1">
                    ${fatherCard}
                    ${motherCard}
                </div>
                
                <!-- Generatie 2: Grootouders -->
                <div class="rtc-pedigree-generation-col gen2">
                    ${paternalGrandfatherCard}
                    ${paternalGrandmotherCard}
                    ${maternalGrandfatherCard}
                    ${maternalGrandmotherCard}
                </div>
                
                <!-- Generatie 3: Overgrootouders -->
                <div class="rtc-pedigree-generation-col gen3">
                    ${paternalGreatGrandfather1Card}
                    ${paternalGreatGrandmother1Card}
                    ${paternalGreatGrandfather2Card}
                    ${paternalGreatGrandmother2Card}
                    ${maternalGreatGrandfather1Card}
                    ${maternalGreatGrandmother1Card}
                    ${maternalGreatGrandfather2Card}
                    ${maternalGreatGrandmother2Card}
                </div>
                
                <!-- Generatie 4: Over-overgrootouders -->
                <div class="rtc-pedigree-generation-col gen4">
                    ${paternalGreatGreatGrandfather1Card}
                    ${paternalGreatGreatGrandmother1Card}
                    ${paternalGreatGreatGrandfather2Card}
                    ${paternalGreatGreatGrandmother2Card}
                    ${paternalGreatGreatGrandfather3Card}
                    ${paternalGreatGreatGrandmother3Card}
                    ${paternalGreatGreatGrandfather4Card}
                    ${paternalGreatGreatGrandmother4Card}
                    ${maternalGreatGreatGrandfather1Card}
                    ${maternalGreatGreatGrandmother1Card}
                    ${maternalGreatGreatGrandfather2Card}
                    ${maternalGreatGreatGrandmother2Card}
                    ${maternalGreatGreatGrandfather3Card}
                    ${maternalGreatGreatGrandmother3Card}
                    ${maternalGreatGreatGrandfather4Card}
                    ${maternalGreatGreatGrandmother4Card}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        // Voeg click events toe aan alle cards
        this.setupCardClickEvents();
        
        // Voeg speciale handler toe voor de toekomstige pup card
        setTimeout(() => {
            this.addFuturePuppyClickHandler(futurePuppy);
        }, 100);
    }
    
    async buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu) {
        const pedigreeTree = {
            mainDog: futurePuppy,
            father: selectedReu,
            mother: selectedTeef,
            paternalGrandfather: null,
            paternalGrandmother: null,
            maternalGrandfather: null,
            maternalGrandmother: null,
            paternalGreatGrandfather1: null,
            paternalGreatGrandmother1: null,
            paternalGreatGrandfather2: null,
            paternalGreatGrandmother2: null,
            maternalGreatGrandfather1: null,
            maternalGreatGrandmother1: null,
            maternalGreatGrandfather2: null,
            maternalGrandmother2: null,
            // Over-overgrootouders velden
            paternalGreatGreatGrandfather1: null,
            paternalGreatGreatGrandmother1: null,
            paternalGreatGreatGrandfather2: null,
            paternalGreatGreatGrandmother2: null,
            paternalGreatGreatGrandfather3: null,
            paternalGreatGreatGrandmother3: null,
            paternalGreatGreatGrandfather4: null,
            paternalGreatGreatGrandmother4: null,
            maternalGreatGreatGrandfather1: null,
            maternalGreatGreatGrandmother1: null,
            maternalGreatGreatGrandfather2: null,
            maternalGreatGreatGrandmother2: null,
            maternalGreatGreatGrandfather3: null,
            maternalGreatGreatGrandmother3: null,
            maternalGreatGreatGrandfather4: null,
            maternalGreatGreatGrandmother4: null
        };
        
        // Helper functie om hond uit Supabase te halen met cache
        const getDogById = async (id) => {
            if (!id) return null;
            
            // Check eerst in allHonden cache
            const cached = this.allHonden.find(h => h.id === id);
            if (cached) return cached;
            
            // Anders haal uit Supabase
            try {
                const hond = await this.hondenService.getHondById(id);
                if (hond) {
                    // Map naar juiste structuur
                    const mappedHond = {
                        id: hond.id,
                        naam: hond.naam || '',
                        geslacht: hond.geslacht || 'onbekend',
                        vaderId: hond.vader_id || null,
                        moederId: hond.moeder_id || null,
                        vader: hond.vader || '',
                        moeder: hond.moeder || '',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '',
                        ras: hond.ras || '',
                        vachtkleur: hond.vachtkleur || '',
                        geboortedatum: hond.geboortedatum || null,
                        overlijdensdatum: hond.overlijdensdatum || null,
                        heupdysplasie: hond.heupdysplasie || null,
                        elleboogdysplasie: hond.elleboogdysplasie || null,
                        patella: hond.patella || null,
                        ogen: hond.ogen || null,
                        ogenVerklaring: hond.ogenverklaring || null,
                        dandyWalker: hond.dandyWalker || null,
                        schildklier: hond.schildklier || null,
                        schildklierVerklaring: hond.schildklierverklaring || null,
                        land: hond.land || null,
                        postcode: hond.postcode || null,
                        opmerkingen: hond.opmerkingen || null
                    };
                    
                    // Voeg toe aan cache
                    this.allHonden.push(mappedHond);
                    return mappedHond;
                }
            } catch (error) {
                console.error(`Fout bij ophalen hond ${id}:`, error);
            }
            
            return null;
        };
        
        // Vul de stamboom op basis van ouder IDs
        if (selectedReu && selectedReu.vaderId) {
            pedigreeTree.paternalGrandfather = await getDogById(selectedReu.vaderId);
        }
        
        if (selectedReu && selectedReu.moederId) {
            pedigreeTree.paternalGrandmother = await getDogById(selectedReu.moederId);
        }
        
        if (selectedTeef && selectedTeef.vaderId) {
            pedigreeTree.maternalGrandfather = await getDogById(selectedTeef.vaderId);
        }
        
        if (selectedTeef && selectedTeef.moederId) {
            pedigreeTree.maternalGrandmother = await getDogById(selectedTeef.moederId);
        }
        
        // Overgrootouders
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.vaderId) {
            pedigreeTree.paternalGreatGrandfather1 = await getDogById(pedigreeTree.paternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.paternalGrandfather && pedigreeTree.paternalGrandfather.moederId) {
            pedigreeTree.paternalGreatGrandmother1 = await getDogById(pedigreeTree.paternalGrandfather.moederId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.vaderId) {
            pedigreeTree.paternalGreatGrandfather2 = await getDogById(pedigreeTree.paternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.paternalGrandmother && pedigreeTree.paternalGrandmother.moederId) {
            pedigreeTree.paternalGreatGrandmother2 = await getDogById(pedigreeTree.paternalGrandmother.moederId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.vaderId) {
            pedigreeTree.maternalGreatGrandfather1 = await getDogById(pedigreeTree.maternalGrandfather.vaderId);
        }
        
        if (pedigreeTree.maternalGrandfather && pedigreeTree.maternalGrandfather.moederId) {
            pedigreeTree.maternalGreatGrandmother1 = await getDogById(pedigreeTree.maternalGrandfather.moederId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.vaderId) {
            pedigreeTree.maternalGreatGrandfather2 = await getDogById(pedigreeTree.maternalGrandmother.vaderId);
        }
        
        if (pedigreeTree.maternalGrandmother && pedigreeTree.maternalGrandmother.moederId) {
            pedigreeTree.maternalGreatGrandmother2 = await getDogById(pedigreeTree.maternalGrandmother.moederId);
        }
        
        // Over-overgrootouders (generatie 4)
        if (pedigreeTree.paternalGreatGrandfather1 && pedigreeTree.paternalGreatGrandfather1.vaderId) {
            pedigreeTree.paternalGreatGreatGrandfather1 = await getDogById(pedigreeTree.paternalGreatGrandfather1.vaderId);
        }
        
        if (pedigreeTree.paternalGreatGrandfather1 && pedigreeTree.paternalGreatGrandfather1.moederId) {
            pedigreeTree.paternalGreatGreatGrandmother1 = await getDogById(pedigreeTree.paternalGreatGrandfather1.moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother1 && pedigreeTree.paternalGreatGrandmother1.vaderId) {
            pedigreeTree.paternalGreatGreatGrandfather2 = await getDogById(pedigreeTree.paternalGreatGrandmother1.vaderId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother1 && pedigreeTree.paternalGreatGrandmother1.moederId) {
            pedigreeTree.paternalGreatGreatGrandmother2 = await getDogById(pedigreeTree.paternalGreatGrandmother1.moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandfather2 && pedigreeTree.paternalGreatGrandfather2.vaderId) {
            pedigreeTree.paternalGreatGreatGrandfather3 = await getDogById(pedigreeTree.paternalGreatGrandfather2.vaderId);
        }
        
        if (pedigreeTree.paternalGreatGrandfather2 && pedigreeTree.paternalGreatGrandfather2.moederId) {
            pedigreeTree.paternalGreatGreatGrandmother3 = await getDogById(pedigreeTree.paternalGreatGrandfather2.moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother2 && pedigreeTree.paternalGreatGrandmother2.vaderId) {
            pedigreeTree.paternalGreatGreatGrandfather4 = await getDogById(pedigreeTree.paternalGreatGrandmother2.vaderId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother2 && pedigreeTree.paternalGreatGrandmother2.moederId) {
            pedigreeTree.paternalGreatGreatGrandmother4 = await getDogById(pedigreeTree.paternalGreatGrandmother2.moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather1 && pedigreeTree.maternalGreatGrandfather1.vaderId) {
            pedigreeTree.maternalGreatGreatGrandfather1 = await getDogById(pedigreeTree.maternalGreatGrandfather1.vaderId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather1 && pedigreeTree.maternalGreatGrandfather1.moederId) {
            pedigreeTree.maternalGreatGreatGrandmother1 = await getDogById(pedigreeTree.maternalGreatGrandfather1.moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother1 && pedigreeTree.maternalGreatGrandmother1.vaderId) {
            pedigreeTree.maternalGreatGreatGrandfather2 = await getDogById(pedigreeTree.maternalGreatGrandmother1.vaderId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother1 && pedigreeTree.maternalGreatGrandmother1.moederId) {
            pedigreeTree.maternalGreatGreatGrandmother2 = await getDogById(pedigreeTree.maternalGreatGrandmother1.moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather2 && pedigreeTree.maternalGreatGrandfather2.vaderId) {
            pedigreeTree.maternalGreatGreatGrandfather3 = await getDogById(pedigreeTree.maternalGreatGrandfather2.vaderId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather2 && pedigreeTree.maternalGreatGrandfather2.moederId) {
            pedigreeTree.maternalGreatGreatGrandmother3 = await getDogById(pedigreeTree.maternalGreatGrandfather2.moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother2 && pedigreeTree.maternalGreatGrandmother2.vaderId) {
            pedigreeTree.maternalGreatGreatGrandfather4 = await getDogById(pedigreeTree.maternalGreatGrandmother2.vaderId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother2 && pedigreeTree.maternalGreatGrandmother2.moederId) {
            pedigreeTree.maternalGreatGreatGrandmother4 = await getDogById(pedigreeTree.maternalGreatGrandmother2.moederId);
        }
        
        return pedigreeTree;
    }
    
    async generateDogCard(dog, relation, isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="rtc-pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="rtc-pedigree-card-header-compact horizontal">
                        <div class="rtc-relation-compact">${relation}</div>
                    </div>
                    <div class="rtc-pedigree-card-body-compact horizontal text-center py-3">
                        <div class="rtc-no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-success' : 'bg-secondary';
        
        // Check of deze hond foto's heeft (alleen voor echte honden, niet virtuele)
        const hasPhotos = dog.id > 0 ? await this.fotoService.checkFotosExist(dog.stamboomnr || '') : false;
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        // Voor overovergrootouders (gen4): alleen naam en kennelnaam
        if (generation === 4) {
            return `
                <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                     data-dog-id="${dog.id}" 
                     data-dog-name="${dog.naam || ''}"
                     data-relation="${relation}"
                     data-generation="${generation}"
                     data-has-photos="${hasPhotos}"
                     data-is-virtual="${dog.isVirtual || false}">
                    <div class="rtc-pedigree-card-header-compact horizontal ${headerColor}">
                        <div class="rtc-relation-compact">
                            <span class="rtc-relation-text">${relation}</span>
                            ${isMainDog ? '<span class="rtc-main-dot">★</span>' : ''}
                        </div>
                        <div class="rtc-gender-icon-compact">
                            <i class="bi ${genderIcon}"></i>
                        </div>
                    </div>
                    <div class="rtc-pedigree-card-body-compact horizontal">
                        <!-- Alleen naam en kennelnaam voor overovergrootouders -->
                        <div class="rtc-card-row rtc-card-row-1-only">
                            <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                                ${fullDisplayText}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Voor andere generaties (0-3): volledige layout
        const breedText = dog.ras && dog.id !== -999999 ? 
                         `<div class="rtc-dog-breed-compact" title="${dog.ras}">${dog.ras}</div>` : '';
        
        return `
            <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="${hasPhotos}"
                 data-is-virtual="${dog.isVirtual || false}">
                <div class="rtc-pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="rtc-relation-compact">
                        <span class="rtc-relation-text">${relation}</span>
                        ${isMainDog ? '<span class="rtc-main-dot">★</span>' : ''}
                    </div>
                    <div class="rtc-gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="rtc-pedigree-card-body-compact horizontal">
                    <!-- Regel 1: Naam en kennelnaam in één regel -->
                    <div class="rtc-card-row rtc-card-row-1">
                        <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <!-- Regel 2: Stamboomnummer en ras -->
                    <div class="rtc-card-row rtc-card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="rtc-dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${breedText}
                    </div>
                    
                    <!-- Regel 3: Klik hint met fototoestelicoon -->
                    <div class="rtc-card-row rtc-card-row-3">
                        <div class="rtc-click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}${cameraIcon}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.rtc-pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return;
                
                const isVirtual = card.getAttribute('data-is-virtual') === 'true';
                const dogName = card.getAttribute('data-dog-name') || '';
                const relation = card.getAttribute('data-relation') || '';
                
                // Speciale behandeling voor virtuele pup
                if (dogId === -999999 || isVirtual) {
                    // Bereken COI pas NU als op de virtuele pup wordt geklikt
                    await this.showFuturePuppyPopupWithCOI(dogName, relation);
                    return;
                }
                
                // Voor echte honden: haal hond op en toon details
                const dog = await this.getDogByIdFromSupabase(dogId);
                if (!dog) return;
                
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async getDogByIdFromSupabase(id) {
        try {
            // Check eerst in cache
            const cached = this.allHonden.find(h => h.id === id);
            if (cached) return cached;
            
            // Haal uit Supabase
            const hond = await this.hondenService.getHondById(id);
            if (!hond) return null;
            
            // Map naar juiste structuur
            const mappedHond = {
                id: hond.id,
                naam: hond.naam || '',
                geslacht: hond.geslacht || 'onbekend',
                vaderId: hond.vader_id || null,
                moederId: hond.moeder_id || null,
                vader: hond.vader || '',
                moeder: hond.moeder || '',
                kennelnaam: hond.kennelnaam || '',
                stamboomnr: hond.stamboomnr || '',
                ras: hond.ras || '',
                vachtkleur: hond.vachtkleur || '',
                geboortedatum: hond.geboortedatum || null,
                overlijdensdatum: hond.overlijdensdatum || null,
                heupdysplasie: hond.heupdysplasie || null,
                elleboogdysplasie: hond.elleboogdysplasie || null,
                patella: hond.patella || null,
                ogen: hond.ogen || null,
                ogenVerklaring: hond.ogenverklaring || null,
                dandyWalker: hond.dandyWalker || null,
                schildklier: hond.schildklier || null,
                schildklierVerklaring: hond.schildklierverklaring || null,
                land: hond.land || null,
                postcode: hond.postcode || null,
                opmerkingen: hond.opmerkingen || null
            };
            
            // Voeg toe aan cache
            this.allHonden.push(mappedHond);
            return mappedHond;
            
        } catch (error) {
            console.error(`Fout bij ophalen hond ${id}:`, error);
            return null;
        }
    }
    
    async showFuturePuppyPopupWithCOI(dogName, relation) {
        console.log('🔄 COI berekening gestart voor toekomstige pup...');
        
        try {
            // STAP 1: Initialiseer COICalculator als dat nog niet is gebeurd
            if (!this.coiCalculator || !this.coiCalculatorReady) {
                console.log('🔄 Initialiseer COICalculator...');
                
                // Maak virtuele pup voor berekening
                const virtualPuppy = this.createVirtualPuppy(this.selectedTeef, this.selectedReu);
                
                // Voeg virtuele pup toe aan alle honden voor COI berekening
                const allHondenForCOI = [...this.allHonden, virtualPuppy];
                
                if (typeof COICalculator === 'undefined') {
                    throw new Error('COICalculator klasse niet gevonden');
                }
                
                this.coiCalculator = new COICalculator(allHondenForCOI);
                this.coiCalculatorReady = true;
                console.log('✅ COICalculator geïnitialiseerd');
            }
            
            // STAP 2: Bereken COI voor virtuele pup (ID -999999)
            let coiResult = null;
            let kinshipValue = 0;
            
            try {
                coiResult = this.coiCalculator.calculateCOI(-999999);
                console.log('✅ COI resultaat:', coiResult);
                
                // Bereken kinship
                kinshipValue = this.calculateAverageKinshipForFuturePuppy(-999999, 6);
                console.log('✅ Kinship berekend:', kinshipValue);
            } catch (calcError) {
                console.error('❌ Fout bij COI berekening:', calcError);
                coiResult = { coi6Gen: '0.0', coiAllGen: '0.0' };
            }
            
            // STAP 3: Bereken gezondheidsanalyse
            const healthAnalysis = await this.analyzeHealthInLine();
            
            // STAP 4: Toon popup met resultaten
            this.showFuturePuppyPopup(dogName, relation, coiResult, kinshipValue, healthAnalysis);
            
        } catch (error) {
            console.error('❌ Fout bij COI berekening voor toekomstige pup:', error);
            this.mainModule.showAlert('Kon COI niet berekenen. Probeer opnieuw.', 'danger');
        }
    }
    
    async analyzeHealthInLine() {
        const analysis = {
            motherLine: { total: 0, counts: {} },
            fatherLine: { total: 0, counts: {} }
        };
        
        const healthItems = [
            { key: 'hd_a', label: this.t('hdA') },
            { key: 'hd_b', label: this.t('hdB') },
            { key: 'hd_c', label: this.t('hdC') },
            { key: 'hd_d', label: this.t('hdD') },
            { key: 'hd_e', label: this.t('hdE') },
            { key: 'hd_unknown', label: this.t('hdUnknown') },
            
            { key: 'ed_0', label: this.t('ed0') },
            { key: 'ed_1', label: this.t('ed1') },
            { key: 'ed_2', label: this.t('ed2') },
            { key: 'ed_3', label: this.t('ed3') },
            { key: 'ed_unknown', label: this.t('edUnknown') },
            
            { key: 'pl_0', label: this.t('pl0') },
            { key: 'pl_1', label: this.t('pl1') },
            { key: 'pl_2', label: this.t('pl2') },
            { key: 'pl_3', label: this.t('pl3') },
            { key: 'pl_unknown', label: this.t('plUnknown') },
            
            { key: 'eyes_free', label: this.t('eyesFree') },
            { key: 'eyes_dist', label: this.t('eyesDist') },
            { key: 'eyes_other', label: this.t('eyesOther') },
            { key: 'eyes_unknown', label: this.t('eyesUnknown') },
            
            { key: 'dwlm_dna_free', label: this.t('dwlmDnaFree') },
            { key: 'dwlm_parents_free', label: this.t('dwlmParentsFree') },
            { key: 'dwlm_unknown', label: this.t('dwlmUnknown') },
            
            { key: 'thyroid_tested', label: this.t('thyroidTested') },
            { key: 'thyroid_unknown', label: this.t('thyroidUnknown') }
        ];
        
        healthItems.forEach(item => {
            analysis.motherLine.counts[item.key] = 0;
            analysis.fatherLine.counts[item.key] = 0;
        });
        
        const motherAncestors = await this.collectAncestorsFromParent(this.selectedTeef, 6);
        const fatherAncestors = await this.collectAncestorsFromParent(this.selectedReu, 6);
        
        for (const ancestor of motherAncestors) {
            analysis.motherLine.total++;
            this.updateHealthCounts(analysis.motherLine.counts, ancestor);
        }
        
        for (const ancestor of fatherAncestors) {
            analysis.fatherLine.total++;
            this.updateHealthCounts(analysis.fatherLine.counts, ancestor);
        }
        
        return analysis;
    }
    
    async collectAncestorsFromParent(parentDog, generations) {
        const ancestors = [];
        const queue = [{ dog: parentDog, generation: 1 }];
        const visited = new Set();
        
        while (queue.length > 0) {
            const { dog: currentDog, generation } = queue.shift();
            
            if (!currentDog || visited.has(currentDog.id) || generation > generations) {
                continue;
            }
            
            visited.add(currentDog.id);
            
            // Haal volledige hond op uit Supabase als nodig
            let fullDog = currentDog;
            if (!currentDog.heupdysplasie && currentDog.heupdysplasie === undefined) {
                fullDog = await this.getDogByIdFromSupabase(currentDog.id) || currentDog;
            }
            
            ancestors.push(fullDog);
            
            if (fullDog.vaderId) {
                const father = await this.getDogByIdFromSupabase(fullDog.vaderId);
                if (father) {
                    queue.push({ dog: father, generation: generation + 1 });
                }
            }
            
            if (fullDog.moederId) {
                const mother = await this.getDogByIdFromSupabase(fullDog.moederId);
                if (mother) {
                    queue.push({ dog: mother, generation: generation + 1 });
                }
            }
        }
        
        return ancestors;
    }
    
    updateHealthCounts(counts, ancestor) {
        if (ancestor.heupdysplasie) {
            const hdKey = this.getHDKey(ancestor.heupdysplasie);
            if (hdKey) {
                counts[hdKey]++;
            }
        } else {
            counts['hd_unknown']++;
        }
        
        if (ancestor.elleboogdysplasie) {
            const edKey = this.getEDKey(ancestor.elleboogdysplasie);
            if (edKey) {
                counts[edKey]++;
            }
        } else {
            counts['ed_unknown']++;
        }
        
        if (ancestor.patella) {
            const plKey = this.getPLKey(ancestor.patella);
            if (plKey) {
                counts[plKey]++;
            }
        } else {
            counts['pl_unknown']++;
        }
        
        if (ancestor.ogen) {
            const eyesKey = this.getEyesKey(ancestor.ogen);
            if (eyesKey) {
                counts[eyesKey]++;
            }
        } else {
            counts['eyes_unknown']++;
        }
        
        if (ancestor.dandyWalker) {
            const dwlmKey = this.getDWLMKey(ancestor.dandyWalker);
            if (dwlmKey) {
                counts[dwlmKey]++;
            }
        } else {
            counts['dwlm_unknown']++;
        }
        
        if (ancestor.schildklier) {
            counts['thyroid_tested']++;
        } else {
            counts['thyroid_unknown']++;
        }
    }
    
    getHDKey(hdValue) {
        const hd = (hdValue || '').toLowerCase().trim();
        if (hd.includes('a')) return 'hd_a';
        if (hd.includes('b')) return 'hd_b';
        if (hd.includes('c')) return 'hd_c';
        if (hd.includes('d')) return 'hd_d';
        if (hd.includes('e')) return 'hd_e';
        return null;
    }
    
    getEDKey(edValue) {
        const ed = (edValue || '').toLowerCase().trim();
        if (ed.includes('0')) return 'ed_0';
        if (ed.includes('1')) return 'ed_1';
        if (ed.includes('2')) return 'ed_2';
        if (ed.includes('3')) return 'ed_3';
        return null;
    }
    
    getPLKey(plValue) {
        const pl = (plValue || '').toLowerCase().trim();
        if (pl.includes('0')) return 'pl_0';
        if (pl.includes('1')) return 'pl_1';
        if (pl.includes('2')) return 'pl_2';
        if (pl.includes('3')) return 'pl_3';
        return null;
    }
    
    getEyesKey(eyesValue) {
        const eyes = (eyesValue || '').toLowerCase().trim();
        if (eyes.includes('vrij') || eyes.includes('free')) return 'eyes_free';
        if (eyes.includes('dist')) return 'eyes_dist';
        return 'eyes_other';
    }
    
    getDWLMKey(dwlmValue) {
        const dwlm = (dwlmValue || '').toLowerCase().trim();
        if (dwlm.includes('dna')) return 'dwlm_dna_free';
        if (dwlm.includes('ouders') || dwlm.includes('parents')) return 'dwlm_parents_free';
        return null;
    }
    
    addFuturePuppyClickHandler(futurePuppy) {
        const futurePuppyCard = document.querySelector('.rtc-pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopupWithCOI(futurePuppy.naam, this.t('mainDog'));
            });
            
            futurePuppyCard.style.cursor = 'pointer';
            
            const clickHint = futurePuppyCard.querySelector('.rtc-click-hint-compact');
            if (clickHint) {
                clickHint.innerHTML = '<i class="bi bi-info-circle"></i> ' + this.t('clickForDetails');
            }
        }
    }
    
    showFuturePuppyPopup(dogName, relation, coiResult, kinshipValue, healthAnalysis) {
        const coi6Color = this.mainModule.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.mainModule.getCOIColor(coiResult.coiAllGen);
        
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        // Popup voor toekomstige pup
        const popupHTML = `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${dogName}
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close')}"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi')}</h6>
                        <div class="rtc-info-grid">
                            <!-- DRIE WAARDES NAAST ELKAAR -->
                            <div class="rtc-three-values-row">
                                <!-- COI 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('coi6Gen')}</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiResult.coi6Gen || '0.0'}%</div>
                                </div>
                                
                                <!-- Homozygotie 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('homozygosity6Gen')}</div>
                                    <div class="rtc-value-number">${coiResult.coiAllGen || '0.0'}%</div>
                                </div>
                                
                                <!-- Kinship 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen')}</div>
                                    <div class="rtc-value-number">${kinshipValue.toFixed(3)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInLine')}</h6>
                        ${healthAnalysisHTML}
                    </div>
                    
                    <div class="rtc-info-section mb-2">
                        <div class="alert alert-info mb-0">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>${this.t('predictedPedigree')}</strong><br>
                            ${this.t('futurePuppyDescription', { 
                                reu: this.selectedReu.naam || '?', 
                                teef: this.selectedTeef.naam || '?' 
                            })}
                        </div>
                    </div>
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
        
        this.ensurePopupContainer();
        
        const overlay = document.getElementById('rtcPedigreePopupOverlay');
        const container = document.getElementById('rtcPedigreePopupContainer');
        
        if (container) {
            container.innerHTML = popupHTML;
            overlay.style.display = 'flex';
            this.setupIsolatedPopupEventListeners();
        }
    }
    
    async showDogDetailPopup(dog, relation) {
        // Bereken COI pas NU als op een echte hond wordt geklikt
        let coiValues = { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        
        if (this.coiCalculator && this.coiCalculatorReady) {
            try {
                const coiResult = this.coiCalculator.calculateCOI(dog.id);
                coiValues.coi6Gen = coiResult.coi6Gen || '0.0';
                coiValues.coiAllGen = coiResult.coiAllGen || '0.0';
                
                // Bereken kinship
                const kinshipValue = this.calculateAverageKinship(dog.id, 6);
                coiValues.kinship6Gen = kinshipValue.toFixed(3);
            } catch (error) {
                console.error('Fout bij COI berekening voor hond', dog.id, ':', error);
            }
        }
        
        const popupHTML = await this.getDogDetailPopupHTML(dog, relation, coiValues);
        
        this.ensurePopupContainer();
        
        const overlay = document.getElementById('rtcPedigreePopupOverlay');
        const container = document.getElementById('rtcPedigreePopupContainer');
        
        if (container) {
            container.innerHTML = popupHTML;
            overlay.style.display = 'flex';
            this.setupIsolatedPopupEventListeners();
        }
    }
    
    async getDogDetailPopupHTML(dog, relation = '', coiValues = { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' }) {
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        const coi6Color = this.mainModule.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.mainModule.getCOIColor(coiValues.coiAllGen);
        
        // Laad thumbnails voor echte honden
        const thumbnails = dog.id > 0 ? await this.fotoService.getFotoThumbnails(dog.stamboomnr || '', 9) : [];
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        return `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close')}"></button>
                </div>
                <div class="rtc-popup-body">
                    ${thumbnails.length > 0 ? `
                    <div class="rtc-info-section mb-3">
                        <h6><i class="bi bi-camera me-1"></i> ${this.t('photos')} (${thumbnails.length})</h6>
                        <div class="photos-grid" id="rtcPhotosGrid${dog.id}">
                            ${thumbnails.map((thumb, index) => `
                                <div class="photo-thumbnail" 
                                     data-photo-id="${thumb.id}" 
                                     data-dog-id="${dog.id}" 
                                     data-photo-index="${index}"
                                     data-is-thumbnail="true">
                                    <img src="${thumb.thumbnail}" 
                                         alt="${dog.naam || ''} - ${thumb.filename || ''}" 
                                         class="thumbnail-img"
                                         loading="lazy">
                                    <div class="photo-hover">
                                        <i class="bi bi-zoom-in"></i>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="photo-hint">
                            <small class="text-muted"><i class="bi bi-info-circle me-1"></i> ${this.t('clickToEnlarge')}</small>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="rtc-info-grid">
                            <div class="rtc-info-row">
                                ${dog.stamboomnr ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="rtc-info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('breed')}:</span>
                                    <span class="rtc-info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('gender')}:</span>
                                    <span class="rtc-info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('coatColor')}:</span>
                                    <span class="rtc-info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="rtc-three-values-row">
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('coi6Gen')}</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('homozygosity6Gen')}</div>
                                    <div class="rtc-value-number">${coiValues.coiAllGen}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen')}</div>
                                    <div class="rtc-value-number">${coiValues.kinship6Gen}%</div>
                                </div>
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('birthDate')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('deathDate')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.land ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('country')}:</span>
                                    <span class="rtc-info-value">${dog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('zipCode')}:</span>
                                    <span class="rtc-info-value">${dog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="rtc-info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('hipDysplasia')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('elbowDysplasia')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('patellaLuxation')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('eyes')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.ogen, 'eyes')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenVerklaring ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('eyesExplanation')}:</span>
                                    <span class="rtc-info-value">${dog.ogenVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('dandyWalker')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('thyroid')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('thyroidExplanation')}:</span>
                                    <span class="rtc-info-value">${dog.schildklierVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="rtc-remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="text-muted">${this.t('noRemarks')}</div>
                    </div>
                    `}
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    generateHealthAnalysisHTML(analysis) {
        const t = this.t.bind(this);
        
        const healthItems = [
            { key: 'hd_a', label: t('hdA') },
            { key: 'hd_b', label: t('hdB') },
            { key: 'hd_c', label: t('hdC') },
            { key: 'hd_d', label: t('hdD') },
            { key: 'hd_e', label: t('hdE') },
            { key: 'hd_unknown', label: t('hdUnknown') },
            
            { key: 'ed_0', label: t('ed0') },
            { key: 'ed_1', label: t('ed1') },
            { key: 'ed_2', label: t('ed2') },
            { key: 'ed_3', label: t('ed3') },
            { key: 'ed_unknown', label: t('edUnknown') },
            
            { key: 'pl_0', label: t('pl0') },
            { key: 'pl_1', label: t('pl1') },
            { key: 'pl_2', label: t('pl2') },
            { key: 'pl_3', label: t('pl3') },
            { key: 'pl_unknown', label: t('plUnknown') },
            
            { key: 'eyes_free', label: t('eyesFree') },
            { key: 'eyes_dist', label: t('eyesDist') },
            { key: 'eyes_other', label: t('eyesOther') },
            { key: 'eyes_unknown', label: t('eyesUnknown') },
            
            { key: 'dwlm_dna_free', label: t('dwlmDnaFree') },
            { key: 'dwlm_parents_free', label: t('dwlmParentsFree') },
            { key: 'dwlm_unknown', label: t('dwlmUnknown') },
            
            { key: 'thyroid_tested', label: t('thyroidTested') },
            { key: 'thyroid_unknown', label: t('thyroidUnknown') }
        ];
        
        let tableRows = '';
        healthItems.forEach(item => {
            const motherCount = analysis.motherLine.counts[item.key] || 0;
            const fatherCount = analysis.fatherLine.counts[item.key] || 0;
            
            tableRows += `
                <tr>
                    <td class="health-category">${item.label}</td>
                    <td class="mother-count">${motherCount}</td>
                    <td class="father-count">${fatherCount}</td>
                </tr>
            `;
        });
        
        tableRows += `
            <tr style="border-top: 2px solid #dee2e6;">
                <td class="health-category"><strong>Totaal voorouders:</strong></td>
                <td class="mother-count"><strong>${analysis.motherLine.total}</strong></td>
                <td class="father-count"><strong>${analysis.fatherLine.total}</strong></td>
            </tr>
        `;
        
        return `
            <div class="mb-3">
                <table class="health-analysis-table">
                    <thead>
                        <tr>
                            <th>${t('healthCategory')}</th>
                            <th>${t('motherLine')}</th>
                            <th>${t('fatherLine')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    calculateAverageKinshipForFuturePuppy(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const allAncestors = this.coiCalculator._getAllAncestors(dogId, generations);
            const ancestorIds = Array.from(allAncestors.keys());
            
            if (ancestorIds.length <= 1) return 0;
            
            let totalKinship = 0;
            let pairCount = 0;
            
            const sampleSize = Math.min(ancestorIds.length, 30);
            const step = Math.max(1, Math.floor(ancestorIds.length / sampleSize));
            
            for (let i = 0; i < ancestorIds.length; i += step) {
                for (let j = i + step; j < ancestorIds.length; j += step) {
                    if (i !== j) {
                        const kinship = this.coiCalculator._calculateKinship(ancestorIds[i], ancestorIds[j], generations);
                        totalKinship += kinship;
                        pairCount++;
                    }
                }
            }
            
            return pairCount > 0 ? (totalKinship / pairCount) * 100 : 0;
        } catch (error) {
            console.error('Fout bij berekenen kinship voor toekomstige pup:', error);
            return 0;
        }
    }
    
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const allAncestors = this.coiCalculator._getAllAncestors(dogId, generations);
            const ancestorIds = Array.from(allAncestors.keys());
            
            if (ancestorIds.length <= 1) return 0;
            
            let totalKinship = 0;
            let pairCount = 0;
            
            const sampleSize = Math.min(ancestorIds.length, 30);
            const step = Math.max(1, Math.floor(ancestorIds.length / sampleSize));
            
            for (let i = 0; i < ancestorIds.length; i += step) {
                for (let j = i + step; j < ancestorIds.length; j += step) {
                    if (i !== j) {
                        const kinship = this.coiCalculator._calculateKinship(ancestorIds[i], ancestorIds[j], generations);
                        totalKinship += kinship;
                        pairCount++;
                    }
                }
            }
            
            return pairCount > 0 ? (totalKinship / pairCount) * 100 : 0;
        } catch (error) {
            console.error('Fout bij berekenen kinship:', error);
            return 0;
        }
    }
    
    ensurePopupContainer() {
        if (!document.getElementById('rtcPedigreePopupOverlay')) {
            const overlayHTML = `
                <div class="rtc-pedigree-popup-overlay" id="rtcPedigreePopupOverlay" style="display: none;">
                    <div class="rtc-pedigree-popup-container" id="rtcPedigreePopupContainer"></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', overlayHTML);
        }
    }
    
    setupIsolatedPopupEventListeners() {
        const overlay = document.getElementById('rtcPedigreePopupOverlay');
        const container = document.getElementById('rtcPedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const closeButtons = container.querySelectorAll('.rtc-btn-close, .rtc-popup-close-btn');
        
        const closePopup = () => {
            overlay.style.display = 'none';
            
            // Verwijder onze geïsoleerde listeners
            const overlayClick = this.mainModule.isolatedEventListeners.get('overlayClick');
            const escapeKey = this.mainModule.isolatedEventListeners.get('escapeKey');
            
            if (overlayClick) {
                overlay.removeEventListener('click', overlayClick);
                this.mainModule.isolatedEventListeners.delete('overlayClick');
            }
            
            if (escapeKey) {
                document.removeEventListener('keydown', escapeKey);
                this.mainModule.isolatedEventListeners.delete('escapeKey');
            }
        };
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closePopup);
        });
        
        // Overlay click handler
        const overlayClickHandler = (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        };
        
        overlay.addEventListener('click', overlayClickHandler);
        
        // Escape key handler
        const escapeKeyHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        };
        
        document.addEventListener('keydown', escapeKeyHandler);
        
        // Sla de listeners op zodat we ze kunnen verwijderen
        this.mainModule.isolatedEventListeners.set('overlayClick', overlayClickHandler);
        this.mainModule.isolatedEventListeners.set('escapeKey', escapeKeyHandler);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}