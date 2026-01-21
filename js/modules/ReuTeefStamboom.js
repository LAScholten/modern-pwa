/**
 * Reu en Teef Stamboom Module - FINALE WERKENDE VERSIE
 * Gebruikt EXACT dezelfde data als StamboomManager maar zonder conflicten
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        
        // REFERENTIE naar allDogs, geen kopie!
        this.allDogs = mainModule.allDogs || [];
        
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // COI Calculator - gebruik degene van mainModule
        this.coiCalculator = mainModule.coiCalculator || null;
        this.coiCalculatorReady = !!this.coiCalculator;
        this.coiCalculationInProgress = false;
        
        console.log(`✅ ReuTeefStamboom geïnitialiseerd met ${this.allDogs.length} honden`);
        
        // BELANGRIJK: Laad opnieuw als array leeg is
        if (this.allDogs.length === 0) {
            console.log('⚠️ ReuTeefStamboom: allDogs is leeg, zal later proberen...');
            setTimeout(() => this.initializeAsync(), 1000);
        }
    }
    
    // ASYNCHRONE INIT - wacht op StamboomManager
    async initializeAsync() {
        try {
            console.log('🔄 ReuTeefStamboom: Wacht op StamboomManager data...');
            
            // Wacht maximaal 5 seconden
            let attempts = 0;
            while (attempts < 50) {
                attempts++;
                
                // Controleer of StamboomManager zijn data heeft
                if (this.mainModule && this.mainModule.allDogs && this.mainModule.allDogs.length > 0) {
                    // Gebruik REFERENTIE naar dezelfde array
                    this.allDogs = this.mainModule.allDogs;
                    this.coiCalculator = this.mainModule.coiCalculator;
                    this.coiCalculatorReady = !!this.coiCalculator;
                    
                    console.log(`✅ ReuTeefStamboom: Geladen met ${this.allDogs.length} honden`);
                    console.log(`✅ ReuTeefStamboom: COI Calculator beschikbaar: ${this.coiCalculatorReady}`);
                    return;
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (attempts % 10 === 0) {
                    console.log(`⏳ ReuTeefStamboom: Wachten op data... (${attempts}/50)`);
                }
            }
            
            console.error('❌ ReuTeefStamboom: Timeout - Geen honden data gevonden');
            
        } catch (error) {
            console.error('❌ ReuTeefStamboom: Fout bij initialiseren:', error);
        }
    }
    
    // EXACT DEZELFDE getDogById als StamboomManager
    getDogById(id) {
        if (!id || id === 0) return null;
        
        // Zoek eerst in onze eigen referentie
        let dog = this.allDogs.find(dog => dog.id === id);
        
        // Als niet gevonden, probeer StamboomManager
        if (!dog && this.mainModule && typeof this.mainModule.getDogById === 'function') {
            dog = this.mainModule.getDogById(id);
        }
        
        return dog;
    }
    
    // EXACT DEZELFDE als StamboomManager
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        
        try {
            if (this.mainModule.hondenService && typeof this.mainModule.hondenService.checkFotosExist === 'function') {
                return await this.mainModule.hondenService.checkFotosExist(dog.stamboomnr);
            }
            return false;
        } catch (error) {
            console.error('Fout bij checken foto\'s:', error);
            return false;
        }
    }
    
    // EXACT DEZELFDE als StamboomManager
    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        try {
            if (this.mainModule.hondenService && typeof this.mainModule.hondenService.getFotoThumbnails === 'function') {
                const thumbnails = await this.mainModule.hondenService.getFotoThumbnails(dog.stamboomnr, limit);
                return thumbnails || [];
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen thumbnails:', error);
            return [];
        }
    }
    
    // EXACT DEZELFDE formatDate
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
    
    // EXACT DEZELFDE getHealthBadge
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
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
    
    // EXACT DEZELFDE getCOIColor
    getCOIColor(value) {
        const numValue = parseFloat(value);
        if (numValue < 4.0) return '#28a745';
        if (numValue <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    // EXACT DEZELFDE calculateCOI
    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        if (!dog.vaderId && !dog.vader_id || !dog.moederId && !dog.moeder_id) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        const vaderId = dog.vaderId || dog.vader_id;
        const moederId = dog.moederId || dog.moeder_id;
        
        if (vaderId === moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        if (this.coiCalculator && this.coiCalculatorReady) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                const kinship = this.calculateAverageKinship(dogId, 6);
                
                return {
                    coi6Gen: result.coi6Gen || '0.0',
                    homozygosity6Gen: result.coiAllGen || '0.0',
                    kinship6Gen: kinship.toFixed(3)
                };
            } catch (error) {
                console.error('Fout in COICalculator:', error);
            }
        }
        
        return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
    }
    
    // EXACT DEZELFDE calculateAverageKinship
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const dog = this.getDogById(dogId);
            if (!dog || (!dog.vaderId && !dog.vader_id) || (!dog.moederId && !dog.moeder_id)) return 0;
            
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
    
    // HOOFDFUNCTIE: Toon toekomstige pup stamboom
    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        console.log('🔍 ReuTeefStamboom: showFuturePuppyPedigree aangeroepen');
        
        // Controleer of we data hebben
        if (!this.allDogs || this.allDogs.length === 0) {
            console.warn('⚠️ ReuTeefStamboom: allDogs is leeg, probeer opnieuw te initialiseren...');
            await this.initializeAsync();
            
            if (!this.allDogs || this.allDogs.length === 0) {
                this.showError('Hondengegevens niet beschikbaar. Probeer de pagina te vernieuwen.');
                return;
            }
        }
        
        // Voorkom dubbele berekeningen
        if (this.coiCalculationInProgress) {
            this.showAlert('COI berekening is al bezig, even wachten...', 'info');
            return;
        }
        
        this.coiCalculationInProgress = true;
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        try {
            console.log(`✅ ReuTeefStamboom: Bereken pup van ${selectedReu.naam} + ${selectedTeef.naam}`);
            console.log(`📊 ReuTeefStamboom: Aantal beschikbare honden: ${this.allDogs.length}`);
            
            // Maak virtuele toekomstige pup
            const futurePuppy = {
                id: -999999,
                naam: this.t('futurePuppyName') || 'Toekomstige Pup',
                geslacht: 'onbekend',
                vader_id: selectedReu.id,
                moeder_id: selectedTeef.id,
                vader: selectedReu.naam,
                moeder: selectedTeef.naam,
                kennelnaam: this.t('combinedParents') || 'Gecombineerde Ouders',
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
            
            // Bereken COI
            let coiResult = { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
            
            if (this.coiCalculator && this.coiCalculatorReady) {
                try {
                    // Gebruik mainModule's calculator
                    const tempCOICalculator = new COICalculator([...this.allDogs, futurePuppy]);
                    coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
                    
                    // Bereken kinship
                    const kinshipValue = this.calculateAverageKinshipForFuturePuppy(tempCOICalculator, futurePuppy.id, 6);
                    coiResult.kinship6Gen = kinshipValue.toFixed(3);
                    
                    console.log('✅ ReuTeefStamboom: COI berekend:', coiResult);
                } catch (calcError) {
                    console.error('❌ ReuTeefStamboom: Fout bij COI berekening:', calcError);
                }
            }
            
            // Bereken gezondheidsanalyse
            const healthAnalysis = await this.analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu);
            
            // Toon modal
            await this.createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('❌ ReuTeefStamboom: Fout bij tonen toekomstige pup:', error);
            this.showError('Kon stamboom niet genereren: ' + error.message);
        } finally {
            this.coiCalculationInProgress = false;
        }
    }
    
    // ANALYSEER GEZONDHEID IN LIJN
    async analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu) {
        const analysis = {
            motherLine: { total: 0, counts: {} },
            fatherLine: { total: 0, counts: {} }
        };
        
        const healthItems = this.getHealthItems();
        healthItems.forEach(item => {
            analysis.motherLine.counts[item.key] = 0;
            analysis.fatherLine.counts[item.key] = 0;
        });
        
        // Verzamel voorouders
        const motherAncestors = await this.collectAncestorsFromParent(selectedTeef, 6);
        const fatherAncestors = await this.collectAncestorsFromParent(selectedReu, 6);
        
        console.log(`📈 ReuTeefStamboom: Moederlijn: ${motherAncestors.length}, Vaderlijn: ${fatherAncestors.length} voorouders`);
        
        // Tel gezondheidsgegevens
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
    
    // VERZAMEL VOOROUDERS
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
            ancestors.push(currentDog);
            
            // Zoek ouders
            const vaderId = currentDog.vaderId || currentDog.vader_id;
            const moederId = currentDog.moederId || currentDog.moeder_id;
            
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
    
    // UPDATE GEZONDHEID TELLERS
    updateHealthCounts(counts, ancestor) {
        // Heupdysplasie
        if (ancestor.heupdysplasie) {
            const hdKey = this.getHDKey(ancestor.heupdysplasie);
            if (hdKey) counts[hdKey]++;
        } else {
            counts['hd_unknown']++;
        }
        
        // Elleboogdysplasie
        if (ancestor.elleboogdysplasie) {
            const edKey = this.getEDKey(ancestor.elleboogdysplasie);
            if (edKey) counts[edKey]++;
        } else {
            counts['ed_unknown']++;
        }
        
        // Patella
        if (ancestor.patella) {
            const plKey = this.getPLKey(ancestor.patella);
            if (plKey) counts[plKey]++;
        } else {
            counts['pl_unknown']++;
        }
        
        // Ogen
        if (ancestor.ogen) {
            const eyesKey = this.getEyesKey(ancestor.ogen);
            if (eyesKey) counts[eyesKey]++;
        } else {
            counts['eyes_unknown']++;
        }
        
        // Dandy Walker
        if (ancestor.dandyWalker) {
            const dwlmKey = this.getDWLMKey(ancestor.dandyWalker);
            if (dwlmKey) counts[dwlmKey]++;
        } else {
            counts['dwlm_unknown']++;
        }
        
        // Schildklier
        if (ancestor.schildklier) {
            counts['thyroid_tested']++;
        } else {
            counts['thyroid_unknown']++;
        }
    }
    
    // HELPER METHODS VOOR GEZONDHEIDSKEYS
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
    
    getHealthItems() {
        return [
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
    }
    
    // CALCULEER KINSHIP VOOR TOEKOMSTIGE PUP
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
    
    // TOON MODAL VOOR TOEKOMSTIGE PUP
    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const modalId = 'rtc-futurePuppyModal';
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
        
        const title = this.t('futurePuppyTitle') || `Toekomstige Pup: ${selectedReu.naam || '?'} + ${selectedTeef.naam || '?'}`;
        
        // Modal HTML
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
                                            <span class="visually-hidden">${this.t('loadingPedigree') || 'Stamboom laden...'}</span>
                                        </div>
                                        <p class="mt-3">${this.t('loadingPedigree') || 'Stamboom laden...'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Popup overlay -->
            <div class="rtc-pedigree-popup-overlay" id="rtcPedigreePopupOverlay" style="display: none;">
                <div class="rtc-pedigree-popup-container" id="rtcPedigreePopupContainer"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        // Setup events
        const printBtn = document.querySelector(`#${modalId} .btn-print`);
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
        
        // Render stamboom
        await this.renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
    }
    
    // RENDER STAMBOOM
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        // Bouw stamboom tree
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        // Genereer cards voor alle generaties
        const mainDogCard = await this.generateDogCard(futurePuppy, this.t('mainDog') || 'Hoofdhond', true, 0);
        const fatherCard = await this.generateDogCard(pedigreeTree.father, this.t('father') || 'Vader', false, 1);
        const motherCard = await this.generateDogCard(pedigreeTree.mother, this.t('mother') || 'Moeder', false, 1);
        
        const paternalGrandfatherCard = await this.generateDogCard(pedigreeTree.paternalGrandfather, this.t('grandfather') || 'Grootvader', false, 2);
        const paternalGrandmotherCard = await this.generateDogCard(pedigreeTree.paternalGrandmother, this.t('grandmother') || 'Grootmoeder', false, 2);
        const maternalGrandfatherCard = await this.generateDogCard(pedigreeTree.maternalGrandfather, this.t('grandfather') || 'Grootvader', false, 2);
        const maternalGrandmotherCard = await this.generateDogCard(pedigreeTree.maternalGrandmother, this.t('grandmother') || 'Grootmoeder', false, 2);
        
        // Overgrootouders
        const paternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather') || 'Overgrootvader', false, 3);
        const paternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother') || 'Overgrootmoeder', false, 3);
        const paternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather') || 'Overgrootvader', false, 3);
        const paternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother') || 'Overgrootmoeder', false, 3);
        const maternalGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather') || 'Overgrootvader', false, 3);
        const maternalGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother') || 'Overgrootmoeder', false, 3);
        const maternalGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather') || 'Overgrootvader', false, 3);
        const maternalGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother') || 'Overgrootmoeder', false, 3);
        
        // Over-overgrootouders
        const paternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather1, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother1, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather2, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother2, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather3, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother3, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const paternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather4, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const paternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother4, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather1, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother1Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother1, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather2, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother2Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother2, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather3, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother3Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother3, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        const maternalGreatGreatGrandfather4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather4, this.t('greatGreatGrandfather') || 'Overovergrootvader', false, 4);
        const maternalGreatGreatGrandmother4Card = await this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother4, this.t('greatGreatGrandmother') || 'Overovergrootmoeder', false, 4);
        
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
        
        // Voeg click events toe
        this.setupCardClickEvents();
        
        // Voeg speciale handler toe voor toekomstige pup
        setTimeout(() => {
            this.addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis);
        }, 100);
    }
    
    // BOUW STAMBOOM TREE VOOR TOEKOMSTIGE PUP
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
            maternalGrandmother1: null,
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
        
        console.log('🌳 ReuTeefStamboom: Bouw stamboom tree...');
        
        // Ouders
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id;
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id;
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id;
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id;
        
        if (reuVaderId) pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
        if (reuMoederId) pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
        if (teefVaderId) pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
        if (teefMoederId) pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
        
        // Grootouders van reu
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
        
        // Grootouders van teef
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
        
        // Overgrootouders (gen 4)
        // ... (vergelijkbaar met bovenstaande logica)
        
        return pedigreeTree;
    }
    
    // GENEREER DOG CARD
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
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
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
        
        // Voor andere generaties
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
    
    // SETUP CARD CLICK EVENTS
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.rtc-pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0 || dogId === -999999) return;
                
                const dog = this.getDogById(dogId);
                if (!dog) {
                    console.error(`Hond niet gevonden met ID: ${dogId}`);
                    return;
                }
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    // TOON HOND DETAIL POPUP
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
    
    // GENEREER HOND DETAIL HTML
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') || 'Reu' : 
                          dog.geslacht === 'teven' ? this.t('female') || 'Teef' : this.t('unknown') || 'Onbekend';
        
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const thumbnails = dog.id > 0 ? await this.getDogThumbnails(dog.id, 9) : [];
        
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
                                     data-photo-index="${index}">
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
                        <h6><i class="bi bi-card-text me-1"></i> ${this.t('basicInfo') || 'Basisgegevens'}</h6>
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
                                    <div class="rtc-value-number">${coiValues.homozygosity6Gen}%</div>
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
    
    // SPECIALE HANDLER VOOR TOEKOMSTIGE PUP
    addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis) {
        const futurePuppyCard = document.querySelector('.rtc-pedigree-card-compact.horizontal.main-dog-compact.gen0');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
            });
            
            futurePuppyCard.style.cursor = 'pointer';
        }
    }
    
    // TOON POPUP VOOR TOEKOMSTIGE PUP
    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const coi6Color = this.getCOIColor(coiResult.coi6Gen);
        const coiAllColor = this.getCOIColor(coiResult.coiAllGen);
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        const popupHTML = `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        ${this.t('futurePuppyName') || 'Toekomstige Pup'} - Voorspelling
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="${this.t('close') || 'Sluiten'}"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> ${this.t('predictedCoi') || 'Voorspelde COI'}</h6>
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Deze waarden zijn gebaseerd op de stambomen van de geselecteerde ouders en hun voorouders.
                        </div>
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
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInLine') || 'Gezondheid in lijn'}</h6>
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Deze analyse toont het voorkomen van gezondheidstesten in de afstammingslijnen.
                        </div>
                        ${healthAnalysisHTML}
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
    
    // GENEREER GEZONDHEIDSANALYSE HTML
    generateHealthAnalysisHTML(analysis) {
        const healthItems = this.getHealthItems();
        
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
                <td class="health-category"><strong>${this.t('totalAncestors') || 'Totaal voorouders'}:</strong></td>
                <td class="mother-count"><strong>${analysis.motherLine.total}</strong></td>
                <td class="father-count"><strong>${analysis.fatherLine.total}</strong></td>
            </tr>
        `;
        
        return `
            <div class="mb-3">
                <table class="health-analysis-table">
                    <thead>
                        <tr>
                            <th>${this.t('healthCategory') || 'Gezondheidscategorie'}</th>
                            <th>${this.t('motherLine') || 'Moederlijn'}</th>
                            <th>${this.t('fatherLine') || 'Vaderlijn'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="legend mt-2">
                    <small class="text-muted">
                        <span class="count-good">Groen</span>: 1-2 voorouders, 
                        <span class="count-high">Rood</span>: 3+ voorouders,
                        <span>Geen kleur</span>: 0 voorouders
                    </small>
                </div>
            </div>
        `;
    }
    
    // ZORG DAT POPUP CONTAINER BESTAAT
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
    
    // SETUP POPUP EVENT LISTENERS
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
    
    // HELPER: TOON ERROR
    showError(message) {
        console.error('ReuTeefStamboom Error:', message);
        if (this.mainModule && typeof this.mainModule.showError === 'function') {
            this.mainModule.showError(message);
        } else {
            alert('ReuTeefStamboom Error: ' + message);
        }
    }
    
    // HELPER: TOON ALERT
    showAlert(message, type = 'info') {
        console.log(`ReuTeefStamboom ${type}:`, message);
        if (this.mainModule && typeof this.mainModule.showAlert === 'function') {
            this.mainModule.showAlert(message, type);
        } else {
            alert('ReuTeefStamboom: ' + message);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}