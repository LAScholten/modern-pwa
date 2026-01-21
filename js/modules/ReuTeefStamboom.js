/**
 * Reu en Teef Stamboom Module - AFZONDERLIJK BESTAND
 * Gebruikt nu dezelfde allDogs array als StamboomManager
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        
        // NU: Gebruik dezelfde allHonden array als StamboomManager
        this.allHonden = mainModule.allDogs || mainModule.allHonden || [];
        
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // COI Calculator
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // Gezondheidsanalyse cache
        this.healthAnalysisCache = new Map();
        
        console.log(`🔄 ReuTeefStamboom geïnitialiseerd met ${this.allHonden.length} honden`);
    }
    
    // NIEUW: Gebruik dezelfde getDogById methode als StamboomManager
    getDogById(id) {
        if (!id || id === 0) return null;
        
        // Zoek eerst in allHonden
        const hond = this.allHonden.find(dog => dog.id === id);
        
        if (!hond) {
            console.warn(`⚠️ Hond met ID ${id} niet gevonden in allHonden`);
            // Creëer een placeholder object om crashes te voorkomen
            return this._createPlaceholderHond(id);
        }
        
        return hond;
    }
    
    // NIEUW: Placeholder hond functie
    _createPlaceholderHond(id, relatie = 'Onbekend') {
        return {
            id: id,
            naam: `${relatie} (ID: ${id})`,
            geslacht: 'onbekend',
            vader_id: null,
            moeder_id: null,
            vaderId: null,
            moederId: null,
            afstammingsnummer: null,
            geboortedatum: null,
            kennelnaam: 'Onbekend',
            vachtkleur: null,
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
            ras: 'Eurasier'
        };
    }
    
    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        // Bewaar de geselecteerde honden
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        // Controleer of allHonden geladen is
        if (this.allHonden.length === 0) {
            console.error('❌ allHonden array is leeg!');
            this.mainModule.showAlert('Hondengegevens niet geladen. Probeer opnieuw.', 'danger');
            return;
        }
        
        console.log(`🔍 Toekomstige pup van: ${selectedTeef.naam} + ${selectedReu.naam}`);
        console.log(`📁 Aantal honden in allHonden: ${this.allHonden.length}`);
        
        // Debug: controleer of de specifieke honden aanwezig zijn
        console.log(`🔍 Check hond ID ${selectedTeef.id} (${selectedTeef.naam}):`, 
            this.allHonden.find(h => h.id === selectedTeef.id) ? 'AANWEZIG' : 'AFWEZIG');
        console.log(`🔍 Check hond ID ${selectedReu.id} (${selectedReu.naam}):`, 
            this.allHonden.find(h => h.id === selectedReu.id) ? 'AANWEZIG' : 'AFWEZIG');
        
        // VOORKOM MEERDERE GELIJKTIJDIGE BEREKENINGEN
        if (this.coiCalculationInProgress) {
            console.log('⚠️ COI berekening al bezig, wacht...');
            this.mainModule.showAlert('COI berekening is al bezig, even wachten...', 'info');
            return;
        }
        
        this.coiCalculationInProgress = true;
        
        try {
            // NIEUW: Initialiseer COICalculator PAS NU, bij het daadwerkelijk berekenen
            if (!this.coiCalculator || !this.coiCalculatorReady) {
                console.log('🔄 COICalculator nog niet geïnitialiseerd, initialiseer nu...');
                const initialized = await this.initializeCOICalculator();
                if (!initialized) {
                    this.mainModule.showAlert('Kon COI berekening niet initialiseren', 'danger');
                    return;
                }
            }
            
            if (!this.coiCalculator) {
                console.error('❌ COICalculator niet beschikbaar');
                this.mainModule.showAlert('COI berekening niet beschikbaar', 'danger');
                return;
            }
            
            // Maak een virtuele toekomstige pup - STAP 1
            const futurePuppy = {
                id: -999999,
                naam: this.t('futurePuppyName'),
                geslacht: 'onbekend',
                vader_id: selectedReu.id,
                moeder_id: selectedTeef.id,
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
                opmerkingen: null
            };
            
            console.log('🔍 Toekomstige pup aangemaakt voor COI berekening:', futurePuppy);
            
            // NIEUW: VERBETERDE DATA LAAD LOGICA - STAP 2
            console.log('🔄 START: Data loading voor toekomstige pup...');
            
            // 1. Laad ALLE benodigde honden voor deze berekening
            const requiredDogIds = new Set();
            
            // Voeg de ouders toe
            requiredDogIds.add(selectedTeef.id);
            requiredDogIds.add(selectedReu.id);
            
            // Verzamel alle voorouder IDs tot 6 generaties
            await this.collectAllRequiredDogIds(selectedTeef, requiredDogIds, 6);
            await this.collectAllRequiredDogIds(selectedReu, requiredDogIds, 6);
            
            console.log(`📊 Vereiste honden IDs: ${Array.from(requiredDogIds).length} unieke IDs`);
            
            // 2. Controleer welke honden we al hebben
            const missingIds = [];
            for (const id of requiredDogIds) {
                if (!this.allHonden.find(h => h.id === id)) {
                    missingIds.push(id);
                }
            }
            
            console.log(`📊 Honden al aanwezig: ${requiredDogIds.size - missingIds.length}`);
            console.log(`📊 Honden nog nodig: ${missingIds.length}`);
            
            // 3. Laad ontbrekende honden
            if (missingIds.length > 0) {
                console.log('🔄 Lade ontbrekende honden...');
                await this.loadMissingDogs(missingIds);
            }
            
            // 4. Controleer opnieuw
            const allDogsPresent = Array.from(requiredDogIds).every(id => 
                this.allHonden.find(h => h.id === id) || this.getDogById(id)
            );
            
            if (!allDogsPresent) {
                console.warn('⚠️ Niet alle vereiste honden konden geladen worden');
            }
            
            console.log(`✅ Data loading voltooid. Totaal honden beschikbaar: ${this.allHonden.length}`);
            
            // BEREKEN COI MET ALLE HONDEN + TOEKOMSTIGE PUP - STAP 3
            let tempCOICalculator = null;
            let coiResult = null;
            
            try {
                console.log('🔄 Maak tijdelijke COICalculator voor toekomstige pup...');
                console.log(`📊 Honden voor COICalculator: ${this.allHonden.length} bestaand + 1 toekomstige pup`);
                
                // Gebruik allHonden + toekomstige pup
                tempCOICalculator = new COICalculator([...this.allHonden, futurePuppy]);
                
                // Bereken COI met tijdelijke calculator
                coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
                console.log('✅ COI resultaat via tijdelijke COICalculator:', coiResult);
                
                // BEREKEN KINSHIP VOOR TOEKOMSTIGE PUP
                let kinshipValue = 0;
                if (tempCOICalculator && coiResult) {
                    try {
                        kinshipValue = this.calculateAverageKinshipForFuturePuppy(tempCOICalculator, futurePuppy.id, 6);
                        console.log('✅ Kinship berekend voor toekomstige pup:', kinshipValue);
                    } catch (kinshipError) {
                        console.error('❌ Fout bij berekenen kinship voor toekomstige pup:', kinshipError);
                    }
                }
                
                // Voeg kinship toe aan coiResult
                coiResult.kinship6Gen = kinshipValue.toFixed(3);
                
                // Bereken gezondheidsanalyse
                const healthAnalysis = await this.analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu);
                console.log('✅ Gezondheidsanalyse resultaat:', healthAnalysis);
                
                // TOON STAMBOOM - STAP 4
                await this.createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
                
            } catch (calcError) {
                console.error('❌ Fout bij COI berekening:', calcError);
                this.mainModule.showAlert('Kon COI niet berekenen. Probeer opnieuw.', 'danger');
            } finally {
                // Opruimen
                tempCOICalculator = null;
            }
            
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.mainModule.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        } finally {
            this.coiCalculationInProgress = false;
        }
    }
    
    // NIEUW: Verzamel alle vereiste hond IDs
    async collectAllRequiredDogIds(dog, requiredIds, generations) {
        if (!dog || generations <= 0) return;
        
        // Voeg huidige hond toe
        requiredIds.add(dog.id);
        
        // Verzamel ouders
        const vaderId = dog.vaderId || dog.vader_id;
        const moederId = dog.moederId || dog.moeder_id;
        
        if (vaderId) {
            const vader = this.getDogById(vaderId);
            if (vader) {
                await this.collectAllRequiredDogIds(vader, requiredIds, generations - 1);
            } else {
                // Voeg ID toe zelfs als hond niet in cache zit
                requiredIds.add(vaderId);
            }
        }
        
        if (moederId) {
            const moeder = this.getDogById(moederId);
            if (moeder) {
                await this.collectAllRequiredDogIds(moeder, requiredIds, generations - 1);
            } else {
                // Voeg ID toe zelfs als hond niet in cache zit
                requiredIds.add(moederId);
            }
        }
    }
    
    // NIEUW: Laad ontbrekende honden
    async loadMissingDogs(missingIds) {
        try {
            console.log(`🔄 Lade ${missingIds.length} ontbrekende honden...`);
            
            const batchSize = 50;
            for (let i = 0; i < missingIds.length; i += batchSize) {
                const batch = missingIds.slice(i, i + batchSize);
                console.log(`📥 Batch ${Math.floor(i/batchSize) + 1}: ${batch.length} honden`);
                
                for (const id of batch) {
                    try {
                        const response = await window.hondenService.getHondById(id);
                        if (response.data) {
                            this.allHonden.push(response.data);
                            console.log(`✅ Geladen: ${response.data.naam} (ID: ${id})`);
                        } else {
                            console.warn(`⚠️ Hond ID ${id} niet gevonden in database`);
                        }
                    } catch (error) {
                        console.error(`❌ Fout bij laden hond ${id}:`, error);
                    }
                    
                    // Kleine pauze om database niet te overloaden
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            console.log(`✅ ${missingIds.length} honden geladen poging voltooid`);
            
        } catch (error) {
            console.error('❌ Fout bij laden ontbrekende honden:', error);
        }
    }
    
    async loadAllHonden() {
        try {
            console.log('ReuTeefStamboom: Laden van alle honden...');
            
            let allHonden = [];
            let currentPage = 1;
            const pageSize = 1000;
            let hasMorePages = true;
            
            while (hasMorePages) {
                const result = await window.hondenService.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    allHonden = allHonden.concat(result.honden);
                    hasMorePages = result.heeftVolgende;
                    currentPage++;
                    
                    console.log(`Pagina ${currentPage-1} geladen: ${result.honden.length} honden`);
                    
                    if (currentPage > 100) {
                        console.warn('Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                        break;
                    }
                } else {
                    hasMorePages = false;
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            allHonden.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            this.allHonden = allHonden;
            console.log(`✅ ReuTeefStamboom: TOTAAL ${this.allHonden.length} honden geladen`);
            
        } catch (error) {
            console.error('Fout bij laden honden voor stambomen:', error);
            this.allHonden = [];
        }
    }
    
    async initializeCOICalculator() {
        try {
            if (typeof COICalculator === 'undefined') {
                console.error('❌ COICalculator klasse niet gevonden!');
                this.coiCalculatorReady = false;
                return false;
            }
            
            console.log('🔄 Initialiseer COICalculator voor de eerste keer...');
            this.coiCalculator = new COICalculator(this.allHonden);
            this.coiCalculatorReady = true;
            console.log('✅ COICalculator succesvol geïnitialiseerd');
            return true;
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren COICalculator:', error);
            this.coiCalculator = null;
            this.coiCalculatorReady = false;
            return false;
        }
    }
    
    async analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu) {
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
        
        const motherAncestors = await this.collectAncestorsFromParent(selectedTeef, 6);
        const fatherAncestors = await this.collectAncestorsFromParent(selectedReu, 6);
        
        console.log(`📊 Moederlijn voorouders: ${motherAncestors.length}, Vaderlijn voorouders: ${fatherAncestors.length}`);
        
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
            
            let fullDog = currentDog;
            if (!currentDog.heupdysplasie && currentDog.heupdysplasie === undefined) {
                // Gebruik nu getDogById() die uit allHonden haalt
                fullDog = this.getDogById(currentDog.id) || currentDog;
            }
            
            ancestors.push(fullDog);
            
            // NIEUW: Gebruik FLEXIBELE veldnamen zoals in StamboomManager
            const vaderId = fullDog.vaderId || fullDog.vader_id;
            const moederId = fullDog.moederId || fullDog.moeder_id;
            
            if (vaderId) {
                const father = this.getDogById(vaderId);
                if (father) {
                    queue.push({ dog: father, generation: generation + 1 });
                }
            }
            
            if (moederId) {
                const mother = this.getDogById(moederId);
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
    
    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
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
            
            <style>
                /* UNIEKE PREFIX VOOR ALLE CSS - VOOR ISOLATIE */
                /* MOBIELE WRAPPER - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                /* HORIZONTALE PEDIGREE CONTAINER - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-container-compact {
                    padding: 15px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #f8f9fa;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    position: relative;
                    min-height: 0 !important;
                    box-sizing: border-box !important;
                    border-radius: inherit;
                    display: flex !important;
                    justify-content: center !important; /* CENTREREN VAN ALLE GENERATIES */
                }
                
                .rtc-pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto !important; /* CENTREREN */
                }
                
                /* GENERATIE KOLOM - VERTICALE STACK VAN LIGGENDE CARDS */
                .rtc-pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                .rtc-pedigree-generation-col.gen0 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen1 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen2 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen3 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen4 {
                    gap: 4px !important;
                }
                
                /* BASIS LIGGENDE CARDS - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-card-compact.horizontal {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0;
                }
                
                /* ZELFDE BREEDTE VOOR ALLE GENERATIES - VERSCHILLENDE HOOGTE */
                .rtc-pedigree-card-compact.horizontal.gen0,
                .rtc-pedigree-card-compact.horizontal.gen1,
                .rtc-pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 145px !important;
                }
                
                /* OVERGROOTOUDERS: 60% HOOGTE VAN NORMALE CARDS */
                .rtc-pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 70px !important;
                }
                
                /* OVER-OVERGROOTOUDERS: 34px HOOGTE */
                .rtc-pedigree-card-compact.horizontal.gen4 {
                    width: 160px !important;
                    height: 34px !important;
                    min-height: 34px !important;
                }
                
                /* Hoofdhond extra styling */
                .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #198754 !important;
                    background: #f0fff4;
                    width: 170px !important;
                    height: 145px !important;
                }
                
                /* Geslacht kleuren */
                .rtc-pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .rtc-pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .rtc-pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .rtc-pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .rtc-pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                /* CARD HEADER */
                .rtc-pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                /* Header voor gen0, gen1, gen2 */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                /* Header voor gen3 (overgrootouders) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
                    min-height: 16px;
                }
                
                /* Header voor gen4 (over-overgrootouders) - KLEINER */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 1px 4px !important;
                    font-size: 0.48rem !important;
                    min-height: 10px !important;
                    max-height: 10px !important;
                    overflow: hidden !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-success {
                    background: #198754 !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .rtc-relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .rtc-relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: inherit;
                }
                
                .rtc-main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .rtc-gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                /* CARD BODY */
                .rtc-pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                /* Body voor gen0, gen1, gen2 */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                /* Body voor gen3 (overgrootouders) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                /* Body voor gen4 (over-overgrootouders) - ALLEEN NAAM EN KENNEL */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 2px 4px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* CARD ROWS voor liggende layout */
                .rtc-card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .rtc-card-row-1 {
                    margin-bottom: 2px;
                }
                
                .rtc-card-row-2 {
                    margin-bottom: 2px;
                }
                
                .rtc-card-row-3 {
                    margin-top: auto;
                }
                
                /* NAAM + KENNEL COMBINATIE STYLING - VOOR GEN4 ALLEEN NAAM */
                .rtc-dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                /* Voor gen4 (over-overgrootouders): alleen naam, grotere tekst */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-name-kennel-compact {
                    font-size: 0.6rem !important;
                    text-align: center !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    line-height: 1 !important;
                    font-weight: 500 !important;
                }
                
                /* TEKST GROOTTES PER GENERATIE */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-name-kennel-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-name-kennel-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-click-hint-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-click-hint-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-click-hint-compact {
                    font-size: 0.55rem;
                }
                
                /* Overgrootouders (gen3) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-click-hint-compact {
                    font-size: 0.44rem;
                }
                
                /* Over-overgrootouders (gen4) - geen extra info, alleen naam */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-click-hint-compact {
                    display: none !important;
                }
                
                /* Algemene tekst styling */
                .rtc-dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .rtc-dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .rtc-no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                /* Click hint met fototoestelicoon - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-click-hint-compact {
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    line-height: 1;
                    width: 100%;
                    padding-top: 2px;
                    border-top: 1px dashed #dee2e6;
                    font-size: 0.55rem;
                }
                
                .rtc-click-hint-compact .bi-camera {
                    color: #1a15f4;
                    font-size: 0.7rem;
                }
                
                /* Lege card styling */
                .rtc-pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* VISUELE VERBINDINGEN */
                .rtc-pedigree-generation-col {
                    position: relative;
                }
                
                .rtc-pedigree-generation-col:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    width: 10px;
                    height: 1px;
                    background: #adb5bd;
                    opacity: 0.5;
                }
                
                /* Overgrootouder en over-overgrootouder styling */
                .rtc-pedigree-card-compact.horizontal.gen3,
                .rtc-pedigree-card-compact.horizontal.gen4 {
                    opacity: 0.9;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3:hover,
                .rtc-pedigree-card-compact.horizontal.gen4:hover {
                    opacity: 1;
                }
                
                /* MOBIELE AANPASSINGEN */
                @media (max-width: 767px) {
                    #rtc-futurePuppyModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-header {
                        margin: 0;
                        padding: 0.75rem 1rem;
                        border: none;
                        width: 100%;
                        flex-shrink: 0;
                        min-height: auto;
                        z-index: 1;
                        border-radius: 12px 12px 0 0;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .rtc-pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .rtc-pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px;
                        justify-content: center !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 auto !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    .rtc-pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important;
                        align-items: flex-start !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 > .rtc-pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 > .rtc-pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(2),
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(4),
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen3 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen4 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 145px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 220px !important;
                        height: 34px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 145px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .rtc-pedigree-container-compact {
                        height: 640px !important;
                        padding: 8px !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 220px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-generation-col {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen0,
                    .rtc-pedigree-generation-col.gen1,
                    .rtc-pedigree-generation-col.gen2,
                    .rtc-pedigree-generation-col.gen3,
                    .rtc-pedigree-generation-col.gen4 {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                }
                
                /* DESKTOP STYLES */
                @media (min-width: 768px) {
                    #rtc-futurePuppyModal.modal.fade .modal-dialog.modal-fullscreen {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-content {
                        width: 100% !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-header {
                        margin: 0 !important;
                        padding: 0.75rem 1rem !important;
                        border: none !important;
                        width: 100% !important;
                        flex-shrink: 0 !important;
                        min-height: auto !important;
                        z-index: 1;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-body {
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 1 auto !important;
                        overflow: hidden !important;
                        min-height: 0 !important;
                    }
                    
                    .rtc-pedigree-mobile-wrapper {
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .rtc-pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                        border-radius: 0;
                        justify-content: center !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto !important; /* CENTREREN */
                    }
                    
                    .rtc-pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    .rtc-pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .rtc-pedigree-generation-col.gen4 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-name-kennel-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-name-kennel-compact,
                    .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card.compact.horizontal.gen2 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-breed-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-breed-compact,
                    .rtc-pedigree-card.compact.horizontal.gen2 .rtc-dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-click-hint-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-click-hint-compact,
                    .rtc-pedigree-card-compact.horizontal.gen2 .rtc-click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-click-hint-compact {
                        font-size: 0.48rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-name-kennel-compact {
                        font-size: 0.6rem !important;
                    }
                }
                
                @media (min-width: 1024px) and (max-width: 1365px) {
                    .rtc-pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        gap: 15px;
                        padding: 0 12px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 145px !important;
                    }
                }
                
                /* GEÏSOLEERDE DETAIL POPUP STYLES - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-pedigree-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: rtc-fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes rtc-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .rtc-pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: rtc-slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    width: calc(100% - 20px);
                    margin: 10px;
                }
                
                @keyframes rtc-slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .rtc-dog-detail-popup {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .rtc-popup-header {
                    background: #0d6efd;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                
                .rtc-popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                /* Eigen kruisje styling - WIT KRUISJE - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-popup-header .rtc-btn-close {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background: transparent;
                    border: none;
                    position: relative;
                    cursor: pointer;
                    opacity: 0.8;
                    z-index: 2;
                    filter: invert(1) grayscale(100%) brightness(200%) !important;
                }
                
                .rtc-popup-header .rtc-btn-close::before,
                .rtc-popup-header .rtc-btn-close::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 18px;
                    height: 2px;
                    background: #000 !important;
                    transform-origin: center;
                }
                
                .rtc-popup-header .rtc-btn-close::before {
                    transform: translate(-50%, -50%) rotate(45deg);
                }
                
                .rtc-popup-header .rtc-btn-close::after {
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                
                .rtc-popup-header .rtc-btn-close:hover {
                    opacity: 1;
                }
                
                .rtc-popup-body {
                    padding: 15px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                /* INFO SECTIES - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-info-section {
                    margin-bottom: 20px;
                }
                
                .rtc-info-section h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .rtc-info-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .rtc-info-row {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px !important;
                    margin-bottom: 0 !important;
                    width: 100% !important;
                }
                
                .rtc-info-item {
                    display: flex;
                    flex-direction: column;
                    width: 100% !important;
                    min-width: 0 !important;
                }
                
                .rtc-info-item-half {
                    grid-column: span 1 !important;
                    width: 100% !important;
                }
                
                .rtc-info-item-full {
                    grid-column: 1 / -1 !important;
                    width: 100% !important;
                    margin-bottom: 4px;
                }
                
                /* DRIE WAARDES NAAST ELKAAR - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-three-values-row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: stretch !important;
                    gap: 8px !important;
                    margin: 10px 0 !important;
                    width: 100% !important;
                }
                
                .rtc-value-box {
                    flex: 1 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
                    padding: 8px 4px !important;
                    background: #f8f9fa !important;
                    border-radius: 6px !important;
                    border: 1px solid #dee2e6 !important;
                    min-height: 60px !important;
                    min-width: 0 !important;
                }
                
                .rtc-value-label {
                    font-size: 0.68rem !important;
                    font-weight: 600 !important;
                    color: #495057 !important;
                    margin-bottom: 4px !important;
                    line-height: 1.2 !important;
                    white-space: normal !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    hyphens: auto !important;
                    width: 100% !important;
                    display: block !important;
                }
                
                .rtc-value-number {
                    font-size: 0.85rem !important;
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    color: #212529 !important;
                }
                
                .rtc-coi-value {
                    font-weight: bold !important;
                }
                
                .rtc-info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }
                
                .rtc-info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    line-height: 1.3;
                    word-break: break-word;
                }
                
                .rtc-remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                /* THUMBNAILS SECTIE IN POPUP - IDENTIEK AAN STAMBOOMMANAGER */
                .photos-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                    margin-bottom: 10px;
                    max-width: 240px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .photo-thumbnail {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }
                
                .photo-thumbnail:hover {
                    border-color: #0d6efd;
                    transform: scale(1.05);
                }
                
                .thumbnail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .photo-hover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .photo-thumbnail:hover .photo-hover {
                    opacity: 1;
                }
                
                .photo-hover i {
                    color: white;
                    font-size: 1.2rem;
                }
                
                .photo-hint {
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 0.85rem;
                }
                
                .rtc-popup-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 0 0 12px 12px;
                }
                
                .rtc-popup-close-btn {
                    min-width: 130px;
                    padding: 10px 25px;
                    font-size: 1rem;
                }
                
                /* ============================================= */
                /* GROTE FOTO OVERLAY STYLES - IDENTIEK AAN STAMBOOMMANAGER */
                /* ============================================= */
                .photo-large-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 1070;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: rtc-fadeIn 0.3s;
                }
                
                .photo-large-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    max-height: 95vh;
                    animation: rtc-slideUp 0.3s;
                }
                
                .photo-large-header {
                    padding: 12px 16px;
                    background: #0d6efd;
                    color: white;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .photo-large-close {
                    background: none;
                    border: none;
                    color: white;
                    opacity: 0.8;
                    font-size: 1.3rem;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .photo-large-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .photo-large-content {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex: 1;
                    min-height: 300px;
                }
                
                .photo-large-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                }
                
                .photo-large-footer {
                    padding: 16px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                }
                
                .photo-large-close-btn {
                    min-width: 120px;
                    padding: 8px 20px;
                }
                
                /* Print styles */
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header {
                        display: none !important;
                    }
                    
                    .rtc-pedigree-container-compact {
                        padding: 0;
                        background: white;
                        height: auto !important;
                        overflow-x: visible !important;
                        height: 100vh !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        flex-direction: row !important;
                        height: auto;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    
                    .rtc-pedigree-generation-col {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        margin-bottom: 10px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                    
                    .rtc-pedigree-popup-overlay {
                        display: none !important;
                    }
                }
                
                /* HEALTH BADGES - IDENTIEK AAN STAMBOOMMANAGER */
                .badge-hd {
                    background-color: #dc3545 !important;
                    color: white !important;
                }
                
                .badge-ed {
                    background-color: #fd7e14 !important;
                    color: white !important;
                }
                
                .badge-pl {
                    background-color: #6f42c1 !important;
                    color: white !important;
                }
                
                .badge-eyes {
                    background-color: #20c997 !important;
                    color: white !important;
                }
                
                .badge-dandy {
                    background-color: #6610f2 !important;
                    color: white !important;
                }
                
                .badge-thyroid {
                    background-color: #e83e8c !important;
                    color: white !important;
                }
                
                /* RESPONSIVE STYLES */
                @media (max-width: 767px) {
                    /* DRIE WAARDES NAAST ELKAAR OP MOBIEL */
                    .rtc-three-values-row {
                        gap: 4px !important;
                        margin: 8px 0 !important;
                    }
                    
                    .rtc-value-box {
                        padding: 6px 3px !important;
                        min-height: 55px !important;
                    }
                    
                    .rtc-value-label {
                        font-size: 0.61rem !important;
                    }
                    
                    .rtc-value-number {
                        font-size: 0.8rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .rtc-three-values-row {
                        gap: 3px !important;
                    }
                    
                    .rtc-value-box {
                        padding: 5px 2px !important;
                        min-height: 50px !important;
                    }
                    
                    .rtc-value-label {
                        font-size: 0.58rem !important;
                    }
                    
                    .rtc-value-number {
                        font-size: 0.75rem !important;
                    }
                }
                
                /* HEALTH ANALYSIS TABLE STYLES */
                .health-analysis-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.8rem;
                }
                
                .health-analysis-table th {
                    background: #f8f9fa;
                    padding: 8px;
                    text-align: left;
                    border-bottom: 2px solid #dee2e6;
                    font-weight: 600;
                }
                
                .health-analysis-table td {
                    padding: 6px 8px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .health-analysis-table .health-category {
                    font-weight: 500;
                    color: #495057;
                }
                
                .health-analysis-table .mother-count,
                .health-analysis-table .father-count {
                    text-align: center;
                    font-weight: 600;
                }
                
                .health-analysis-table .count-high {
                    color: #dc3545;
                    background: #fff5f5;
                }
                
                .health-analysis-table .count-good {
                    color: #198754;
                    background: #f0fff4;
                }
                
                /* LOADING INDICATOR */
                .loading-indicator {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #198754;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 10px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        this.setupFuturePuppyModalEvents();
        
        // Render de stamboom
        await this.renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
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
    
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        // Maak alle cards asynchroon
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
        
        // Voeg click handler toe voor de toekomstige pup card
        setTimeout(() => {
            this.addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis);
        }, 100);
    }
    
    buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu) {
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
            maternalGreatGrandmother2: null,
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
        
        console.log('🔍 Bouw stamboom voor toekomstige pup...');
        
        // NIEUW: Gebruik FLEXIBELE veldnamen zoals in StamboomManager
        // Reu's vader
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id;
        if (reuVaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
            console.log(`✅ Reu vader gevonden (ID: ${reuVaderId}):`, pedigreeTree.paternalGrandfather?.naam || 'Onbekend');
        } else {
            console.log('❌ Reu heeft geen vader_id');
        }
        
        // Reu's moeder
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id;
        if (reuMoederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
            console.log(`✅ Reu moeder gevonden (ID: ${reuMoederId}):`, pedigreeTree.paternalGrandmother?.naam || 'Onbekend');
        } else {
            console.log('❌ Reu heeft geen moeder_id');
        }
        
        // Teef's vader
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id;
        if (teefVaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
            console.log(`✅ Teef vader gevonden (ID: ${teefVaderId}):`, pedigreeTree.maternalGrandfather?.naam || 'Onbekend');
        } else {
            console.log('❌ Teef heeft geen vader_id');
        }
        
        // Teef's moeder
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id;
        if (teefMoederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
            console.log(`✅ Teef moeder gevonden (ID: ${teefMoederId}):`, pedigreeTree.maternalGrandmother?.naam || 'Onbekend');
        } else {
            console.log('❌ Teef heeft geen moeder_id');
        }
        
        // Paternale overgrootouders
        if (pedigreeTree.paternalGrandfather) {
            const vaderId = pedigreeTree.paternalGrandfather.vaderId || pedigreeTree.paternalGrandfather.vader_id;
            const moederId = pedigreeTree.paternalGrandfather.moederId || pedigreeTree.paternalGrandfather.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGrandmother) {
            const vaderId = pedigreeTree.paternalGrandmother.vaderId || pedigreeTree.paternalGrandmother.vader_id;
            const moederId = pedigreeTree.paternalGrandmother.moederId || pedigreeTree.paternalGrandmother.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGrandmother2 = this.getDogById(moederId);
        }
        
        // Maternale overgrootouders
        if (pedigreeTree.maternalGrandfather) {
            const vaderId = pedigreeTree.maternalGrandfather.vaderId || pedigreeTree.maternalGrandfather.vader_id;
            const moederId = pedigreeTree.maternalGrandfather.moederId || pedigreeTree.maternalGrandfather.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGrandmother) {
            const vaderId = pedigreeTree.maternalGrandmother.vaderId || pedigreeTree.maternalGrandmother.vader_id;
            const moederId = pedigreeTree.maternalGrandmother.moederId || pedigreeTree.maternalGrandmother.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGrandmother2 = this.getDogById(moederId);
        }
        
        // Over-overgrootouders (generatie 4) - identiek aan StamboomManager
        if (pedigreeTree.paternalGreatGrandfather1) {
            const vaderId = pedigreeTree.paternalGreatGrandfather1.vaderId || pedigreeTree.paternalGreatGrandfather1.vader_id;
            const moederId = pedigreeTree.paternalGreatGrandfather1.moederId || pedigreeTree.paternalGreatGrandfather1.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother1) {
            const vaderId = pedigreeTree.paternalGreatGrandmother1.vaderId || pedigreeTree.paternalGreatGrandmother1.vader_id;
            const moederId = pedigreeTree.paternalGreatGrandmother1.moederId || pedigreeTree.paternalGreatGrandmother1.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother2 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandfather2) {
            const vaderId = pedigreeTree.paternalGreatGrandfather2.vaderId || pedigreeTree.paternalGreatGrandfather2.vader_id;
            const moederId = pedigreeTree.paternalGreatGrandfather2.moederId || pedigreeTree.paternalGreatGrandfather2.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother3 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother2) {
            const vaderId = pedigreeTree.paternalGreatGrandmother2.vaderId || pedigreeTree.paternalGreatGrandmother2.vader_id;
            const moederId = pedigreeTree.paternalGreatGrandmother2.moederId || pedigreeTree.paternalGreatGrandmother2.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather4 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother4 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather1) {
            const vaderId = pedigreeTree.maternalGreatGrandfather1.vaderId || pedigreeTree.maternalGreatGrandfather1.vader_id;
            const moederId = pedigreeTree.maternalGreatGrandfather1.moederId || pedigreeTree.maternalGreatGrandfather1.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother1) {
            const vaderId = pedigreeTree.maternalGreatGrandmother1.vaderId || pedigreeTree.maternalGreatGrandmother1.vader_id;
            const moederId = pedigreeTree.maternalGreatGrandmother1.moederId || pedigreeTree.maternalGreatGrandmother1.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother2 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather2) {
            const vaderId = pedigreeTree.maternalGreatGrandfather2.vaderId || pedigreeTree.maternalGreatGrandfather2.vader_id;
            const moederId = pedigreeTree.maternalGreatGrandfather2.moederId || pedigreeTree.maternalGreatGrandfather2.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother3 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother2) {
            const vaderId = pedigreeTree.maternalGreatGrandmother2.vaderId || pedigreeTree.maternalGreatGrandmother2.vader_id;
            const moederId = pedigreeTree.maternalGreatGrandmother2.moederId || pedigreeTree.maternalGreatGrandmother2.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather4 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother4 = this.getDogById(moederId);
        }
        
        console.log('✅ Stamboom opgebouwd:', {
            ouders: `${selectedReu.naam} + ${selectedTeef.naam}`,
            grootouders: {
                reuVader: pedigreeTree.paternalGrandfather?.naam || 'Onbekend',
                reuMoeder: pedigreeTree.paternalGrandmother?.naam || 'Onbekend',
                teefVader: pedigreeTree.maternalGrandfather?.naam || 'Onbekend',
                teefMoeder: pedigreeTree.maternalGrandmother?.naam || 'Onbekend'
            }
        });
        
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
        
        // Check of deze hond foto's heeft (SNELLE CHECK) - IDENTIEK AAN STAMBOOMMANAGER
        const hasPhotos = dog.id > 0 ? await this.mainModule.checkDogHasPhotos(dog.id) : false;
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        // Voor overovergrootouders (gen4): alleen naam en kennelnaam - IDENTIEK AAN STAMBOOMMANAGER
        if (generation === 4) {
            return `
                <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                     data-dog-id="${dog.id}" 
                     data-dog-name="${dog.naam || ''}"
                     data-relation="${relation}"
                     data-generation="${generation}"
                     data-has-photos="${hasPhotos}">
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
        
        // Voor andere generaties (0-3): originele layout - IDENTIEK AAN STAMBOOMMANAGER
        const breedText = dog.ras && dog.id !== -999999 ? 
                         `<div class="rtc-dog-breed-compact" title="${dog.ras}">${dog.ras}</div>` : '';
        
        return `
            <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="${hasPhotos}">
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
                    
                    <!-- Regel 3: Klik hint met fototoestelicoon - IDENTIEK AAN STAMBOOMMANAGER -->
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
                
                // Speciale behandeling voor toekomstige pup
                if (dogId === -999999) {
                    // Deze wordt afgehandeld door addFuturePuppyClickHandler
                    return;
                }
                
                const dog = this.getDogById(dogId);
                if (!dog) {
                    console.error(`❌ Hond niet gevonden met ID: ${dogId}`);
                    return;
                }
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async showDogDetailPopup(dog, relation) {
        // Gebruik de identieke popup als StamboomManager
        const popupHTML = await this.getDogDetailPopupHTML(dog, relation);
        
        this.ensurePopupContainer();
        
        const overlay = document.getElementById('rtcPedigreePopupOverlay');
        const container = document.getElementById('rtcPedigreePopupContainer');
        
        if (container) {
            container.innerHTML = popupHTML;
            overlay.style.display = 'flex';
            this.setupIsolatedPopupEventListeners();
        }
    }
    
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Bereken COI waarden
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.mainModule.getCOIColor(coiValues.coi6Gen);
        const coiAllColor = this.mainModule.getCOIColor(coiValues.coiAllGen);
        
        // Bereken kinship
        const kinshipValue = this.calculateAverageKinship(dog.id, 6);
        coiValues.kinship6Gen = kinshipValue.toFixed(3);
        
        // Laad alleen thumbnails - IDENTIEK AAN STAMBOOMMANAGER
        const thumbnails = dog.id > 0 ? await this.mainModule.getDogThumbnails(dog.id, 9) : [];
        
        // Maak een gecombineerde naam+kennel string voor de header
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
                    <!-- THUMBNAILS SECTIE BOVENAAN (indien beschikbaar) - IDENTIEK AAN STAMBOOMMANAGER -->
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
                    
                    <!-- BASISGEGEVENS NA FOTO'S - IDENTIEK AAN STAMBOOMMANAGER -->
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="rtc-info-grid">
                            <!-- Stamboomnummer en Ras naast elkaar -->
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
                            
                            <!-- Geslacht en Vachtkleur naast elkaar -->
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
                            
                            <!-- DRIE WAARDES NAAST ELKAAR - EXACT ZOALS STAMBOOMMANAGER -->
                            <div class="rtc-three-values-row">
                                <!-- COI 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('coi6Gen')}</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                                
                                <!-- Homozygotie 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('homozygosity6Gen')}</div>
                                    <div class="rtc-value-number">${coiValues.coiAllGen}%</div>
                                </div>
                                
                                <!-- Kinship 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen')}</div>
                                    <div class="rtc-value-number">${coiValues.kinship6Gen}%</div>
                                </div>
                            </div>
                            
                            <!-- Datums -->
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
                            
                            <!-- Land en postcode -->
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
                                <div class="rtc-info-item rtc-info-item-full {
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
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">${this.t('thyroid')}:</span>
                                    <span class="rtc-info-value">${this.mainModule.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
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
    
    addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis) {
        const futurePuppyCard = document.querySelector('.rtc-pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
            });
            
            futurePuppyCard.style.cursor = 'pointer';
            
            const clickHint = futurePuppyCard.querySelector('.rtc-click-hint-compact');
            if (clickHint) {
                clickHint.innerHTML = '<i class="bi bi-info-circle"></i> ' + this.t('clickForDetails');
            }
        }
    }
    
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const coi6Color = this.mainModule.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.mainModule.getCOIColor(coiResult.coiAllGen);
        
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        // Popup voor toekomstige pup met DRIE COI WAARDES NAAST ELKAAR
        const popupHTML = `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${this.t('futurePuppyName')}
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close')}"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi')}</h6>
                        <div class="rtc-info-grid">
                            <!-- DRIE WAARDES NAAST ELKAAR - EXACT ZOALS STAMBOOMMANAGER -->
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
                                
                                <!-- Kinship 6 Gen - MET JUISTE WAARDE -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen')}</div>
                                    <div class="rtc-value-number">${coiResult.kinship6Gen || '0.0'}%</div>
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
            
            const motherClass = motherCount > 0 ? (motherCount > 2 ? 'count-high' : 'count-good') : '';
            const fatherClass = fatherCount > 0 ? (fatherCount > 2 ? 'count-high' : 'count-good') : '';
            
            tableRows += `
                <tr>
                    <td class="health-category">${item.label}</td>
                    <td class="mother-count ${motherClass}">${motherCount}</td>
                    <td class="father-count ${fatherClass}">${fatherCount}</td>
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
    }
    
    calculateAverageKinshipForFuturePuppy(tempCOICalculator, dogId, generations = 6) {
        if (!tempCOICalculator || !dogId || dogId === 0) return 0;
        
        try {
            const allAncestors = tempCOICalculator._getAllAncestors(dogId, generations);
            const ancestorIds = Array.from(allAncestors.keys());
            
            if (ancestorIds.length <= 1) return 0;
            
            let totalKinship = 0;
            let pairCount = 0;
            
            const sampleSize = Math.min(ancestorIds.length, 30);
            const step = Math.max(1, Math.floor(ancestorIds.length / sampleSize));
            
            for (let i = 0; i < ancestorIds.length; i += step) {
                for (let j = i + step; j < ancestorIds.length; j += step) {
                    if (i !== j) {
                        const kinship = tempCOICalculator._calculateKinship(ancestorIds[i], ancestorIds[j], generations);
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
    
    // COI BEREKENING VOOR BESTAANDE HONDEN
    calculateCOI(dogId) {
        console.log('COI berekening voor database ID:', dogId);
        
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        
        // Basisgevallen eerst
        if (!dog.vader_id && !dog.vaderId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (!dog.moeder_id && !dog.moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        }
        
        const vaderId = dog.vaderId || dog.vader_id;
        const moederId = dog.moederId || dog.moeder_id;
        
        if (vaderId === moederId) {
            return { coi6Gen: '25.0', coiAllGen: '25.0', kinship6Gen: '0.0' };
        }
        
        // GEBRUIK COICalculator als beschikbaar
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                console.log(`COI resultaat via COICalculator voor hond ${dogId}:`, result);
                return {
                    coi6Gen: result.coi6Gen || '0.0',
                    coiAllGen: result.coiAllGen || '0.0',
                    kinship6Gen: '0.0' // Wordt apart berekend
                };
            } catch (error) {
                console.error('Fout in COICalculator voor hond', dogId, ':', error);
                // Val terug op eenvoudige berekening
            }
        } else {
            console.warn('COICalculator niet beschikbaar, gebruik eenvoudige berekening');
        }
        
        // Eenvoudige berekening als COICalculator niet werkt
        const vader = this.getDogById(vaderId);
        const moeder = this.getDogById(moederId);
        
        if (!vader || !moeder) {
            return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        }
        
        // Complexe gevallen - probeer minimaal iets
        return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
    }
    
    // KINSHIP BEREKENING VOOR BESTAANDE HONDEN
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const dog = this.getDogById(dogId);
            if (!dog) return 0;
            
            const vaderId = dog.vaderId || dog.vader_id;
            const moederId = dog.moederId || dog.moeder_id;
            
            if (!vaderId || !moederId) return 0;
            
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
    
    // HULPFUNCTIES die StamboomManager ook heeft
    formatDate(dateString) {
        return this.mainModule.formatDate(dateString);
    }
    
    getHealthBadge(value, type) {
        return this.mainModule.getHealthBadge(value, type);
    }
    
    getCOIColor(value) {
        return this.mainModule.getCOIColor(value);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}