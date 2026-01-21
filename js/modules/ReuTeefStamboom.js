/**
 * Reu en Teef Stamboom Module - AFZONDERLIJK BESTAND
 * Gebruikt nu dezelfde allDogs array als StamboomManager
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        
        // **CRITIEKE AANPASSING: Gebruik een betere referentie**
        this.allHonden = mainModule.allDogs || [];
        console.log(`🔄 ReuTeefStamboom geïnitialiseerd met ${this.allHonden.length} honden`);
        
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // COI Calculator
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // Gezondheidsanalyse cache
        this.healthAnalysisCache = new Map();
        
        // **DEBUG: Controleer of we toegang hebben tot de juiste methodes**
        console.log('🔍 MainModule methodes beschikbaar:', {
            getAllDogs: typeof mainModule.getAllDogs === 'function',
            getDogById: typeof mainModule.getDogById === 'function',
            allDogsLength: mainModule.allDogs ? mainModule.allDogs.length : 0
        });
    }
    
    // **CRITIEKE AANPASSING: Gebruik de getDogById methode van mainModule of zoek in allHonden**
    getDogById(id) {
        if (!id || id === 0) return null;
        
        // **OPTIE 1: Gebruik de methode van mainModule als die bestaat**
        if (typeof this.mainModule.getDogById === 'function') {
            const dogFromMain = this.mainModule.getDogById(id);
            if (dogFromMain) {
                console.log(`✅ Hond gevonden via mainModule.getDogById(${id}): ${dogFromMain.naam}`);
                return dogFromMain;
            }
        }
        
        // **OPTIE 2: Zoek in allHonden**
        if (this.allHonden && this.allHonden.length > 0) {
            const dog = this.allHonden.find(d => {
                // Probeer verschillende veldnamen
                return d.id === id || 
                       d.hond_id === id || 
                       (d.hondid && parseInt(d.hondid) === id);
            });
            
            if (dog) {
                console.log(`✅ Hond gevonden in allHonden(${id}): ${dog.naam || 'Naam onbekend'}`);
                return dog;
            } else {
                console.log(`❌ Hond niet gevonden in allHonden (ID: ${id})`, {
                    type: typeof id,
                    allHondenSample: this.allHonden.slice(0, 3).map(d => ({ id: d.id, naam: d.naam })),
                    idsInArray: this.allHonden.slice(0, 10).map(d => d.id)
                });
            }
        } else {
            console.log(`❌ allHonden is leeg of niet gedefinieerd voor ID: ${id}`);
        }
        
        // **OPTIE 3: Probeer via hondenService als beschikbaar**
        if (this.mainModule.hondenService && typeof this.mainModule.hondenService.getHondById === 'function') {
            console.log(`🔍 Probeer hond op te halen via hondenService voor ID: ${id}`);
            // Dit zou asynchroon moeten zijn, maar voor nu return null
        }
        
        return null;
    }
    
    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        // Bewaar de geselecteerde honden
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        // **DEBUG: Controleer of de geselecteerde honden IDs hebben**
        console.log('🔍 Toekomstige pup van:', {
            teef: {
                id: selectedTeef.id,
                naam: selectedTeef.naam,
                vader_id: selectedTeef.vader_id || selectedTeef.vaderId,
                moeder_id: selectedTeef.moeder_id || selectedTeef.moederId
            },
            reu: {
                id: selectedReu.id,
                naam: selectedReu.naam,
                vader_id: selectedReu.vader_id || selectedReu.vaderId,
                moeder_id: selectedReu.moeder_id || selectedReu.moederId
            }
        });
        
        // Controleer of we de geselecteerde honden kunnen vinden via getDogById
        const foundTeef = this.getDogById(selectedTeef.id);
        const foundReu = this.getDogById(selectedReu.id);
        
        console.log('🔍 Gevonden honden via getDogById:', {
            teefFound: !!foundTeef,
            reuFound: !!foundReu,
            teefDetails: foundTeef ? {
                id: foundTeef.id,
                naam: foundTeef.naam,
                vaderId: foundTeef.vaderId,
                moederId: foundTeef.moederId
            } : 'NIET GEVONDEN',
            reuDetails: foundReu ? {
                id: foundReu.id,
                naam: foundReu.naam,
                vaderId: foundReu.vaderId,
                moederId: foundReu.moederId
            } : 'NIET GEVONDEN'
        });
        
        if (!foundTeef || !foundReu) {
            console.error('❌ Kan geselecteerde honden niet vinden in database');
            this.mainModule.showAlert('Kan geselecteerde honden niet vinden in database. Probeer opnieuw.', 'danger');
            return;
        }
        
        // Gebruik de gevonden honden (met complete data)
        selectedTeef = foundTeef;
        selectedReu = foundReu;
        
        // Controleer of allHonden geladen is
        if (!this.allHonden || this.allHonden.length === 0) {
            console.error('❌ allHonden array is leeg!');
            console.log('🔍 Probeer toegang tot mainModule.allDogs:', {
                hasAllDogs: !!this.mainModule.allDogs,
                allDogsLength: this.mainModule.allDogs ? this.mainModule.allDogs.length : 0
            });
            
            // Probeer opnieuw te laden
            this.allHonden = this.mainModule.allDogs || [];
            if (this.allHonden.length === 0) {
                this.mainModule.showAlert('Hondengegevens niet geladen. Probeer opnieuw.', 'danger');
                return;
            }
        }
        
        console.log(`🔍 Toekomstige pup van: ${selectedTeef.naam} + ${selectedReu.naam}`);
        console.log(`📁 Aantal honden in allHonden: ${this.allHonden.length}`);
        
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
                    console.error('❌ Kon COI Calculator niet initialiseren');
                    this.mainModule.showAlert('Kon COI berekening niet initialiseren', 'danger');
                    return;
                }
            }
            
            if (!this.coiCalculator) {
                console.error('❌ COICalculator niet beschikbaar');
                this.mainModule.showAlert('COI berekening niet beschikbaar', 'danger');
                return;
            }
            
            // Maak een virtuele toekomstige pup
            const futurePuppy = {
                id: -999999,
                naam: this.t('futurePuppyName') || 'Toekomstige Pup',
                geslacht: 'onbekend',
                vader_id: selectedReu.id,
                moeder_id: selectedTeef.id,
                vader: selectedReu.naam,
                moeder: selectedTeef.naam,
                kennelnaam: this.t('combinedParents') || 'Combinatie',
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
            
            // NIEUW: Maak een ECHT tijdelijke COICalculator zonder de hoofdcalculator te beïnvloeden
            let tempCOICalculator = null;
            let coiResult = null;
            
            try {
                console.log('🔄 Maak tijdelijke COICalculator voor toekomstige pup...');
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
                
                // Toon stamboom
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
    
    async initializeCOICalculator() {
        try {
            if (typeof COICalculator === 'undefined') {
                console.error('❌ COICalculator klasse niet gevonden!');
                this.coiCalculatorReady = false;
                return false;
            }
            
            console.log('🔄 Initialiseer COICalculator voor de eerste keer...');
            console.log('📊 Aantal honden voor COICalculator:', this.allHonden.length);
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
            { key: 'hd_a', label: this.t('hdA') || 'HD A' },
            { key: 'hd_b', label: this.t('hdB') || 'HD B' },
            { key: 'hd_c', label: this.t('hdC') || 'HD C' },
            { key: 'hd_d', label: this.t('hdD') || 'HD D' },
            { key: 'hd_e', label: this.t('hdE') || 'HD E' },
            { key: 'hd_unknown', label: this.t('hdUnknown') || 'HD Onbekend' },
            
            { key: 'ed_0', label: this.t('ed0') || 'ED 0' },
            { key: 'ed_1', label: this.t('ed1') || 'ED 1' },
            { key: 'ed_2', label: this.t('ed2') || 'ED 2' },
            { key: 'ed_3', label: this.t('ed3') || 'ED 3' },
            { key: 'ed_unknown', label: this.t('edUnknown') || 'ED Onbekend' },
            
            { key: 'pl_0', label: this.t('pl0') || 'PL 0' },
            { key: 'pl_1', label: this.t('pl1') || 'PL 1' },
            { key: 'pl_2', label: this.t('pl2') || 'PL 2' },
            { key: 'pl_3', label: this.t('pl3') || 'PL 3' },
            { key: 'pl_unknown', label: this.t('plUnknown') || 'PL Onbekend' },
            
            { key: 'eyes_free', label: this.t('eyesFree') || 'Ogen Vrij' },
            { key: 'eyes_dist', label: this.t('eyesDist') || 'Ogen Distichiasis' },
            { key: 'eyes_other', label: this.t('eyesOther') || 'Ogen Anders' },
            { key: 'eyes_unknown', label: this.t('eyesUnknown') || 'Ogen Onbekend' },
            
            { key: 'dwlm_dna_free', label: this.t('dwlmDnaFree') || 'DWLM DNA Vrij' },
            { key: 'dwlm_parents_free', label: this.t('dwlmParentsFree') || 'DWLM Ouders Vrij' },
            { key: 'dwlm_unknown', label: this.t('dwlmUnknown') || 'DWLM Onbekend' },
            
            { key: 'thyroid_tested', label: this.t('thyroidTested') || 'Schildklier Getest' },
            { key: 'thyroid_unknown', label: this.t('thyroidUnknown') || 'Schildklier Onbekend' }
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
        
        console.log(`🔍 Verzamel voorouders van ${parentDog.naam} (ID: ${parentDog.id})`);
        
        while (queue.length > 0) {
            const { dog: currentDog, generation } = queue.shift();
            
            if (!currentDog || visited.has(currentDog.id) || generation > generations) {
                continue;
            }
            
            visited.add(currentDog.id);
            
            // **CRITIEKE AANPASSING: Gebruik getDogById om complete data te krijgen**
            let fullDog = this.getDogById(currentDog.id);
            if (!fullDog) {
                console.log(`⚠️ Hond niet gevonden via getDogById (ID: ${currentDog.id}), gebruik huidige data`);
                fullDog = currentDog;
            }
            
            ancestors.push(fullDog);
            console.log(`✅ Voorouder toegevoegd (Gen ${generation}): ${fullDog.naam} (ID: ${fullDog.id})`);
            
            // **CRITIEKE AANPASSING: Gebruik flexibele veldnamen**
            const vaderId = fullDog.vaderId || fullDog.vader_id || fullDog.vader;
            const moederId = fullDog.moederId || fullDog.moeder_id || fullDog.moeder;
            
            console.log(`🔍 Zoek ouders van ${fullDog.naam}:`, {
                vaderId: vaderId,
                moederId: moederId,
                heeftVaderId: !!vaderId,
                heeftMoederId: !!moederId
            });
            
            if (vaderId) {
                const father = this.getDogById(vaderId);
                if (father) {
                    console.log(`✅ Vader gevonden: ${father.naam} (ID: ${father.id})`);
                    queue.push({ dog: father, generation: generation + 1 });
                } else {
                    console.log(`❌ Vader niet gevonden voor ID: ${vaderId}`);
                }
            }
            
            if (moederId) {
                const mother = this.getDogById(moederId);
                if (mother) {
                    console.log(`✅ Moeder gevonden: ${mother.naam} (ID: ${mother.id})`);
                    queue.push({ dog: mother, generation: generation + 1 });
                } else {
                    console.log(`❌ Moeder niet gevonden voor ID: ${moederId}`);
                }
            }
        }
        
        console.log(`📋 Totaal ${ancestors.length} voorouders gevonden voor ${parentDog.naam}`);
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
        
        const title = `Toekomstige Pup: ${selectedTeef.naam} + ${selectedReu.naam}`;
        
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
                                    <i class="bi bi-printer me-1"></i> ${this.t('print') || 'Afdrukken'}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close') || 'Sluiten'}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <div class="rtc-pedigree-mobile-wrapper" id="rtcFuturePuppyMobileWrapper">
                                <div class="rtc-pedigree-container-compact" id="rtcFuturePuppyContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">Stamboom genereren...</span>
                                        </div>
                                        <p class="mt-3">Stamboom genereren...</p>
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
                .rtc-pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
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
                    justify-content: center !important;
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
                    margin: 0 auto !important;
                }
                
                .rtc-pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                .rtc-pedigree-generation-col.gen0,
                .rtc-pedigree-generation-col.gen1,
                .rtc-pedigree-generation-col.gen2,
                .rtc-pedigree-generation-col.gen3,
                .rtc-pedigree-generation-col.gen4 {
                    gap: 4px !important;
                }
                
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
                
                .rtc-pedigree-card-compact.horizontal.gen0,
                .rtc-pedigree-card-compact.horizontal.gen1,
                .rtc-pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 145px !important;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 70px !important;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen4 {
                    width: 160px !important;
                    height: 34px !important;
                    min-height: 34px !important;
                }
                
                .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #198754 !important;
                    background: #f0fff4;
                    width: 170px !important;
                    height: 145px !important;
                }
                
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
                
                .rtc-pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
                    min-height: 16px;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 1px 4px !important;
                    font-size: 0.48rem !important;
                    min-height: 10px !important;
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
                
                .rtc-pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 2px 4px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                .rtc-card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .rtc-card-row-1-only {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 100% !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                .rtc-dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-name-kennel-compact {
                    font-size: 0.6rem !important;
                    text-align: center !important;
                }
                
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
                
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-click-hint-compact {
                    display: none !important;
                }
                
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
                
                .rtc-pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* RESPONSIVE STYLES */
                @media (max-width: 767px) {
                    .rtc-pedigree-container-compact {
                        height: 640px !important;
                        padding: 10px !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        padding: 10px 15px !important;
                        gap: 15px !important;
                    }
                    
                    .rtc-pedigree-generation-col {
                        min-width: 220px !important;
                        width: 220px !important;
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
                }
                
                @media (min-width: 768px) {
                    .rtc-pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        padding: 0 !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        padding: 0 20px !important;
                        gap: 25px;
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
                }
                
                /* POPUP STYLES */
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
                
                /* DRIE WAARDES NAAST ELKAAR */
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
                
                /* HEALTH ANALYSIS TABLE */
                .health-analysis-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.85rem;
                }
                
                .health-analysis-table th,
                .health-analysis-table td {
                    padding: 6px 8px;
                    text-align: center;
                    border: 1px solid #dee2e6;
                }
                
                .health-analysis-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                }
                
                .health-analysis-table .health-category {
                    text-align: left;
                    font-weight: 500;
                }
                
                .health-analysis-table .count-good {
                    background-color: #d4edda;
                    color: #155724;
                }
                
                .health-analysis-table .count-high {
                    background-color: #f8d7da;
                    color: #721c24;
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
        
        // Cleanup bij sluiten
        modal.addEventListener('hidden.bs.modal', () => {
            const popupOverlay = document.getElementById('rtcPedigreePopupOverlay');
            if (popupOverlay) {
                popupOverlay.style.display = 'none';
            }
        });
    }
    
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) {
            console.error('❌ Container niet gevonden');
            return;
        }
        
        console.log('🔍 Render toekomstige pup stamboom...');
        
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        if (!pedigreeTree) {
            container.innerHTML = '<div class="alert alert-danger">Kon stamboom niet opbouwen</div>';
            return;
        }
        
        // Maak alle cards asynchroon
        const mainDogCard = await this.generateDogCard(futurePuppy, 'Toekomstige Pup', true, 0);
        const fatherCard = await this.generateDogCard(pedigreeTree.father, 'Vader', false, 1);
        const motherCard = await this.generateDogCard(pedigreeTree.mother, 'Moeder', false, 1);
        
        const paternalGrandfatherCard = await this.generateDogCard(pedigreeTree.paternalGrandfather, 'Grootvader', false, 2);
        const paternalGrandmotherCard = await this.generateDogCard(pedigreeTree.paternalGrandmother, 'Grootmoeder', false, 2);
        const maternalGrandfatherCard = await this.generateDogCard(pedigreeTree.maternalGrandfather, 'Grootvader', false, 2);
        const maternalGrandmotherCard = await this.generateDogCard(pedigreeTree.maternalGrandmother, 'Grootmoeder', false, 2);
        
        const paternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, 'Overgrootvader', false, 3);
        const paternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, 'Overgrootmoeder', false, 3);
        const paternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, 'Overgrootvader', false, 3);
        const paternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, 'Overgrootmoeder', false, 3);
        const maternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, 'Overgrootvader', false, 3);
        const maternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, 'Overgrootmoeder', false, 3);
        const maternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, 'Overgrootvader', false, 3);
        const maternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, 'Overgrootmoeder', false, 3);
        
        // Over-overgrootouders (generatie 4)
        const paternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather1, 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother1, 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather2, 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother2, 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather3, 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother3, 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather4, 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother4, 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather1, 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother1, 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather2, 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother2, 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather3, 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother3, 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather4, 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother4, 'Overovergrootmoeder', false, 4);
        
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
        
        console.log('✅ Toekomstige pup stamboom gerenderd');
    }
    
    buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu) {
        console.log('🔍 Bouw stamboom voor toekomstige pup...');
        
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
        
        // **CRITIEKE AANPASSING: Gebruik getDogById voor alle zoekopdrachten**
        
        // Reu's vader
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id || selectedReu.vader;
        if (reuVaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
            console.log(`✅ Reu vader gevonden (ID: ${reuVaderId}):`, pedigreeTree.paternalGrandfather?.naam || 'NIET GEVONDEN');
        } else {
            console.log('ℹ️ Reu heeft geen vader_id');
        }
        
        // Reu's moeder
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id || selectedReu.moeder;
        if (reuMoederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
            console.log(`✅ Reu moeder gevonden (ID: ${reuMoederId}):`, pedigreeTree.paternalGrandmother?.naam || 'NIET GEVONDEN');
        } else {
            console.log('ℹ️ Reu heeft geen moeder_id');
        }
        
        // Teef's vader
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id || selectedTeef.vader;
        if (teefVaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
            console.log(`✅ Teef vader gevonden (ID: ${teefVaderId}):`, pedigreeTree.maternalGrandfather?.naam || 'NIET GEVONDEN');
        } else {
            console.log('ℹ️ Teef heeft geen vader_id');
        }
        
        // Teef's moeder
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id || selectedTeef.moeder;
        if (teefMoederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
            console.log(`✅ Teef moeder gevonden (ID: ${teefMoederId}):`, pedigreeTree.maternalGrandmother?.naam || 'NIET GEVONDEN');
        } else {
            console.log('ℹ️ Teef heeft geen moeder_id');
        }
        
        // Paternale overgrootouders
        if (pedigreeTree.paternalGrandfather) {
            const vaderId = pedigreeTree.paternalGrandfather.vaderId || pedigreeTree.paternalGrandfather.vader_id || pedigreeTree.paternalGrandfather.vader;
            const moederId = pedigreeTree.paternalGrandfather.moederId || pedigreeTree.paternalGrandfather.moeder_id || pedigreeTree.paternalGrandfather.moeder;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGrandfather1 = this.getDogById(vaderId);
                console.log(`✅ Paternale overgrootvader 1 (ID: ${vaderId}):`, pedigreeTree.paternalGreatGrandfather1?.naam || 'NIET GEVONDEN');
            }
            if (moederId) {
                pedigreeTree.paternalGreatGrandmother1 = this.getDogById(moederId);
                console.log(`✅ Paternale overgrootmoeder 1 (ID: ${moederId}):`, pedigreeTree.paternalGreatGrandmother1?.naam || 'NIET GEVONDEN');
            }
        }
        
        if (pedigreeTree.paternalGrandmother) {
            const vaderId = pedigreeTree.paternalGrandmother.vaderId || pedigreeTree.paternalGrandmother.vader_id || pedigreeTree.paternalGrandmother.vader;
            const moederId = pedigreeTree.paternalGrandmother.moederId || pedigreeTree.paternalGrandmother.moeder_id || pedigreeTree.paternalGrandmother.moeder;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGrandfather2 = this.getDogById(vaderId);
                console.log(`✅ Paternale overgrootvader 2 (ID: ${vaderId}):`, pedigreeTree.paternalGreatGrandfather2?.naam || 'NIET GEVONDEN');
            }
            if (moederId) {
                pedigreeTree.paternalGreatGrandmother2 = this.getDogById(moederId);
                console.log(`✅ Paternale overgrootmoeder 2 (ID: ${moederId}):`, pedigreeTree.paternalGreatGrandmother2?.naam || 'NIET GEVONDEN');
            }
        }
        
        // Maternale overgrootouders
        if (pedigreeTree.maternalGrandfather) {
            const vaderId = pedigreeTree.maternalGrandfather.vaderId || pedigreeTree.maternalGrandfather.vader_id || pedigreeTree.maternalGrandfather.vader;
            const moederId = pedigreeTree.maternalGrandfather.moederId || pedigreeTree.maternalGrandfather.moeder_id || pedigreeTree.maternalGrandfather.moeder;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGrandfather1 = this.getDogById(vaderId);
                console.log(`✅ Maternale overgrootvader 1 (ID: ${vaderId}):`, pedigreeTree.maternalGreatGrandfather1?.naam || 'NIET GEVONDEN');
            }
            if (moederId) {
                pedigreeTree.maternalGreatGrandmother1 = this.getDogById(moederId);
                console.log(`✅ Maternale overgrootmoeder 1 (ID: ${moederId}):`, pedigreeTree.maternalGreatGrandmother1?.naam || 'NIET GEVONDEN');
            }
        }
        
        if (pedigreeTree.maternalGrandmother) {
            const vaderId = pedigreeTree.maternalGrandmother.vaderId || pedigreeTree.maternalGrandmother.vader_id || pedigreeTree.maternalGrandmother.vader;
            const moederId = pedigreeTree.maternalGrandmother.moederId || pedigreeTree.maternalGrandmother.moeder_id || pedigreeTree.maternalGrandmother.moeder;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGrandfather2 = this.getDogById(vaderId);
                console.log(`✅ Maternale overgrootvader 2 (ID: ${vaderId}):`, pedigreeTree.maternalGreatGrandfather2?.naam || 'NIET GEVONDEN');
            }
            if (moederId) {
                pedigreeTree.maternalGreatGrandmother2 = this.getDogById(moederId);
                console.log(`✅ Maternale overgrootmoeder 2 (ID: ${moederId}):`, pedigreeTree.maternalGreatGrandmother2?.naam || 'NIET GEVONDEN');
            }
        }
        
        // Over-overgrootouders (generatie 4)
        if (pedigreeTree.paternalGreatGrandfather1) {
            const vaderId = pedigreeTree.paternalGreatGrandfather1.vaderId || pedigreeTree.paternalGreatGrandfather1.vader_id || pedigreeTree.paternalGreatGrandfather1.vader;
            const moederId = pedigreeTree.paternalGreatGrandfather1.moederId || pedigreeTree.paternalGreatGrandfather1.moeder_id || pedigreeTree.paternalGreatGrandfather1.moeder;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother1) {
            const vaderId = pedigreeTree.paternalGreatGrandmother1.vaderId || pedigreeTree.paternalGreatGrandmother1.vader_id || pedigreeTree.paternalGreatGrandmother1.vader;
            const moederId = pedigreeTree.paternalGreatGrandmother1.moederId || pedigreeTree.paternalGreatGrandmother1.moeder_id || pedigreeTree.paternalGreatGrandmother1.moeder;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother2 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandfather2) {
            const vaderId = pedigreeTree.paternalGreatGrandfather2.vaderId || pedigreeTree.paternalGreatGrandfather2.vader_id || pedigreeTree.paternalGreatGrandfather2.vader;
            const moederId = pedigreeTree.paternalGreatGrandfather2.moederId || pedigreeTree.paternalGreatGrandfather2.moeder_id || pedigreeTree.paternalGreatGrandfather2.moeder;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother3 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGreatGrandmother2) {
            const vaderId = pedigreeTree.paternalGreatGrandmother2.vaderId || pedigreeTree.paternalGreatGrandmother2.vader_id || pedigreeTree.paternalGreatGrandmother2.vader;
            const moederId = pedigreeTree.paternalGreatGrandmother2.moederId || pedigreeTree.paternalGreatGrandmother2.moeder_id || pedigreeTree.paternalGreatGrandmother2.moeder;
            
            if (vaderId) pedigreeTree.paternalGreatGreatGrandfather4 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGreatGrandmother4 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather1) {
            const vaderId = pedigreeTree.maternalGreatGrandfather1.vaderId || pedigreeTree.maternalGreatGrandfather1.vader_id || pedigreeTree.maternalGreatGrandfather1.vader;
            const moederId = pedigreeTree.maternalGreatGrandfather1.moederId || pedigreeTree.maternalGreatGrandfather1.moeder_id || pedigreeTree.maternalGreatGrandfather1.moeder;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother1) {
            const vaderId = pedigreeTree.maternalGreatGrandmother1.vaderId || pedigreeTree.maternalGreatGrandmother1.vader_id || pedigreeTree.maternalGreatGrandmother1.vader;
            const moederId = pedigreeTree.maternalGreatGrandmother1.moederId || pedigreeTree.maternalGreatGrandmother1.moeder_id || pedigreeTree.maternalGreatGrandmother1.moeder;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother2 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandfather2) {
            const vaderId = pedigreeTree.maternalGreatGrandfather2.vaderId || pedigreeTree.maternalGreatGrandfather2.vader_id || pedigreeTree.maternalGreatGrandfather2.vader;
            const moederId = pedigreeTree.maternalGreatGrandfather2.moederId || pedigreeTree.maternalGreatGrandfather2.moeder_id || pedigreeTree.maternalGreatGrandfather2.moeder;
            
            if (vaderId) pedigreeTree.maternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGreatGrandmother3 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGreatGrandmother2) {
            const vaderId = pedigreeTree.maternalGreatGrandmother2.vaderId || pedigreeTree.maternalGreatGrandmother2.vader_id || pedigreeTree.maternalGreatGrandmother2.vader;
            const moederId = pedigreeTree.maternalGreatGrandmother2.moederId || pedigreeTree.maternalGreatGrandmother2.moeder_id || pedigreeTree.maternalGreatGrandmother2.moeder;
            
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
                        <div class="rtc-no-data-text">${this.t('noData') || 'Geen gegevens'}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-success' : 'bg-secondary';
        
        // Check of deze hond foto's heeft
        const hasPhotos = dog.id > 0 && this.mainModule.checkDogHasPhotos ? 
                         await this.mainModule.checkDogHasPhotos(dog.id) : false;
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';
        
        const combinedName = dog.naam || this.t('unknown') || 'Onbekend';
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
                        <div class="rtc-card-row rtc-card-row-1-only">
                            <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                                ${fullDisplayText}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Voor andere generaties (0-3): originele layout
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
                    <div class="rtc-card-row rtc-card-row-1">
                        <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <div class="rtc-card-row rtc-card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="rtc-dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${breedText}
                    </div>
                    
                    <div class="rtc-card-row rtc-card-row-3">
                        <div class="rtc-click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails') || 'Klik voor details'}${cameraIcon}
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
        
        const genderText = dog.geslacht === 'reuen' ? (this.t('male') || 'Reu') : 
                          dog.geslacht === 'teven' ? (this.t('female') || 'Teef') : (this.t('unknown') || 'Onbekend');
        
        // Bereken COI waarden
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        
        // Laad thumbnails
        const thumbnails = dog.id > 0 && this.mainModule.getDogThumbnails ? 
                          await this.mainModule.getDogThumbnails(dog.id, 9) : [];
        
        // Maak een gecombineerde naam+kennel string voor de header
        const combinedName = dog.naam || this.t('unknown') || 'Onbekend';
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
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close') || 'Sluiten'}"></button>
                </div>
                <div class="rtc-popup-body">
                    ${thumbnails.length > 0 ? `
                    <div class="rtc-info-section mb-3">
                        <h6><i class="bi bi-camera me-1"></i> ${this.t('photos') || 'Foto\'s'} (${thumbnails.length})</h6>
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
                            <small class="text-muted"><i class="bi bi-info-circle me-1"></i> ${this.t('clickToEnlarge') || 'Klik om te vergroten'}</small>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="rtc-info-grid">
                            <div class="rtc-info-row">
                                ${dog.stamboomnr ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('pedigreeNumber') || 'Stamboomnummer'}:</span>
                                    <span class="rtc-info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('breed') || 'Ras'}:</span>
                                    <span class="rtc-info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('gender') || 'Geslacht'}:</span>
                                    <span class="rtc-info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">${this.t('coatColor') || 'Vachtkleur'}:</span>
                                    <span class="rtc-info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="rtc-three-values-row">
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('coi6Gen') || 'COI 6 Gen'}</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('homozygosity6Gen') || 'Homozygotie 6 Gen'}</div>
                                    <div class="rtc-value-number">${coiValues.coiAllGen}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen') || 'Kinship 6 Gen'}</div>
                                    <div class="rtc-value-number">${coiValues.kinship6Gen}%</div>
                                </div>
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('birthDate') || 'Geboortedatum'}:</span>
                                    <span class="rtc-info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('deathDate') || 'Overlijdensdatum'}:</span>
                                    <span class="rtc-info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo') || 'Gezondheidsinformatie'}</h6>
                        <div class="rtc-info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('hipDysplasia') || 'Heupdysplasie'}:</span>
                                    <span class="rtc-info-value">${this.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('elbowDysplasia') || 'Elleboogdysplasie'}:</span>
                                    <span class="rtc-info-value">${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">${this.t('patellaLuxation') || 'Patella Luxatie'}:</span>
                                    <span class="rtc-info-value">${this.getHealthBadge(dog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup') || 'Sluiten'}
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
                clickHint.innerHTML = '<i class="bi bi-info-circle"></i> ' + (this.t('clickForDetails') || 'Klik voor details');
            }
        }
    }
    
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const coi6Color = this.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.getCOIColor(coiResult.coiAllGen);
        
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        const popupHTML = `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${this.t('futurePuppyName') || 'Toekomstige Pup'}
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close') || 'Sluiten'}"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi') || 'Voorspelde COI'}</h6>
                        <div class="rtc-info-grid">
                            <div class="rtc-three-values-row">
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('coi6Gen') || 'COI 6 Gen'}</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiResult.coi6Gen || '0.0'}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('homozygosity6Gen') || 'Homozygotie 6 Gen'}</div>
                                    <div class="rtc-value-number">${coiResult.coiAllGen || '0.0'}%</div>
                                </div>
                                
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">${this.t('kinship6Gen') || 'Kinship 6 Gen'}</div>
                                    <div class="rtc-value-number">${coiResult.kinship6Gen || '0.0'}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInLine') || 'Gezondheid in Lijn'}</h6>
                        ${healthAnalysisHTML}
                    </div>
                    
                    <div class="rtc-info-section mb-2">
                        <div class="alert alert-info mb-0">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>${this.t('predictedPedigree') || 'Voorspelde Stamboom'}</strong><br>
                            Deze stamboom toont de voorspelde afstamming van een toekomstige pup uit de combinatie van ${this.selectedReu?.naam || 'reu'} en ${this.selectedTeef?.naam || 'teef'}.
                        </div>
                    </div>
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup') || 'Sluiten'}
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
        return `
            <div class="mb-3">
                <table class="health-analysis-table">
                    <thead>
                        <tr>
                            <th>Categorie</th>
                            <th>Moederlijn</th>
                            <th>Vaderlijn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="health-category">Totaal voorouders</td>
                            <td class="mother-count">${analysis.motherLine.total}</td>
                            <td class="father-count">${analysis.fatherLine.total}</td>
                        </tr>
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
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        });
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
        const vaderId = dog.vaderId || dog.vader_id || dog.vader;
        const moederId = dog.moederId || dog.moeder_id || dog.moeder;
        
        if (!vaderId || !moederId) {
            return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
        }
        
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
                    kinship6Gen: '0.0'
                };
            } catch (error) {
                console.error('Fout in COICalculator voor hond', dogId, ':', error);
            }
        }
        
        // Eenvoudige berekening
        return { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
    }
    
    // HULPFUNCTIES
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown') || 'Onbekend'}</span>`;
        }
        
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${value}</span>`;
    }
    
    getCOIColor(value) {
        const numValue = parseFloat(value);
        if (numValue < 4.0) return '#28a745';
        if (numValue <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}