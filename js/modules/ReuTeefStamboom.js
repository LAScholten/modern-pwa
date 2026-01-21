/**
 * Reu en Teef Stamboom Module - COMPLEET WERKENDE VERSIE
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        this.allDogs = mainModule.allDogs || [];
        this.selectedTeef = null;
        this.selectedReu = null;
        this.coiCalculator = mainModule.coiCalculator;
        this.coiCalculatorReady = !!this.coiCalculator;
        this.coiCalculationInProgress = false;
    }

    getDogById(id) {
        if (!id || id === 0) return null;
        return this.allDogs.find(dog => dog.id === id);
    }

    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        try {
            if (this.mainModule.hondenService?.checkFotosExist) {
                return await this.mainModule.hondenService.checkFotosExist(dog.stamboomnr);
            }
            return false;
        } catch (error) {
            console.error('Fout bij checken foto\'s:', error);
            return false;
        }
    }

    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return [];
        try {
            if (this.mainModule.hondenService?.getFotoThumbnails) {
                const thumbnails = await this.mainModule.hondenService.getFotoThumbnails(dog.stamboomnr, limit);
                return thumbnails || [];
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen thumbnails:', error);
            return [];
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 'en-US');
        } catch {
            return dateString;
        }
    }

    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
        }
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
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

    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const vaderId = dog.vaderId || dog.vader_id;
        const moederId = dog.moederId || dog.moeder_id;
        
        if (!vaderId || !moederId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (vaderId === moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                return {
                    coi6Gen: result.coi6Gen || '0.0',
                    homozygosity6Gen: result.coiAllGen || '0.0',
                    kinship6Gen: '0.0'
                };
            } catch (error) {
                console.error('Fout in COICalculator:', error);
            }
        }
        
        return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
    }

    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        if (this.coiCalculationInProgress) {
            this.showAlert('COI berekening is al bezig, even wachten...', 'info');
            return;
        }
        
        this.coiCalculationInProgress = true;
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        try {
            console.log(`Toekomstige pup van: ${selectedTeef.naam} + ${selectedReu.naam}`);
            
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
                vaderId: selectedReu.id,
                moederId: selectedTeef.id
            };
            
            let coiResult = { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
            
            if (this.coiCalculator) {
                try {
                    const tempCOICalculator = new COICalculator([...this.allDogs, futurePuppy]);
                    coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
                    coiResult.kinship6Gen = '0.0';
                } catch (calcError) {
                    console.error('Fout bij COI berekening:', calcError);
                }
            }
            
            const healthAnalysis = await this.analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu);
            await this.createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('Fout bij tonen toekomstige pup:', error);
            this.showError('Kon stamboom niet genereren.');
        } finally {
            this.coiCalculationInProgress = false;
        }
    }

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
        
        const motherAncestors = await this.collectAncestorsFromParent(selectedTeef, 4);
        const fatherAncestors = await this.collectAncestorsFromParent(selectedReu, 4);
        
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
            ancestors.push(currentDog);
            
            const vaderId = currentDog.vaderId || currentDog.vader_id;
            const moederId = currentDog.moederId || currentDog.moeder_id;
            
            if (vaderId) {
                const father = this.getDogById(vaderId);
                if (father) queue.push({ dog: father, generation: generation + 1 });
            }
            
            if (moederId) {
                const mother = this.getDogById(moederId);
                if (mother) queue.push({ dog: mother, generation: generation + 1 });
            }
        }
        
        return ancestors;
    }

    updateHealthCounts(counts, ancestor) {
        if (ancestor.heupdysplasie) {
            const hdKey = this.getHDKey(ancestor.heupdysplasie);
            if (hdKey) counts[hdKey]++;
        } else {
            counts['hd_unknown']++;
        }
        
        if (ancestor.elleboogdysplasie) {
            const edKey = this.getEDKey(ancestor.elleboogdysplasie);
            if (edKey) counts[edKey]++;
        } else {
            counts['ed_unknown']++;
        }
        
        if (ancestor.patella) {
            const plKey = this.getPLKey(ancestor.patella);
            if (plKey) counts[plKey]++;
        } else {
            counts['pl_unknown']++;
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

    getHealthItems() {
        return [
            { key: 'hd_a', label: 'HD A' },
            { key: 'hd_b', label: 'HD B' },
            { key: 'hd_c', label: 'HD C' },
            { key: 'hd_d', label: 'HD D' },
            { key: 'hd_e', label: 'HD E' },
            { key: 'hd_unknown', label: 'HD Onbekend' },
            { key: 'ed_0', label: 'ED 0' },
            { key: 'ed_1', label: 'ED 1' },
            { key: 'ed_2', label: 'ED 2' },
            { key: 'ed_3', label: 'ED 3' },
            { key: 'ed_unknown', label: 'ED Onbekend' },
            { key: 'pl_0', label: 'PL 0' },
            { key: 'pl_1', label: 'PL 1' },
            { key: 'pl_2', label: 'PL 2' },
            { key: 'pl_3', label: 'PL 3' },
            { key: 'pl_unknown', label: 'PL Onbekend' }
        ];
    }

    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const modalId = 'rtc-futurePuppyModal';
        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
        
        const title = `Toekomstige Pup: ${selectedReu.naam} + ${selectedTeef.naam}`;
        
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-diagram-3 me-2"></i> ${title}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> Afdrukken
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0">
                            <div id="rtcFuturePuppyContainer" class="p-3">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-success" role="status">
                                        <span class="visually-hidden">Stamboom laden...</span>
                                    </div>
                                    <p class="mt-3">Stamboom laden...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        const printBtn = document.querySelector(`#${modalId} .btn-print`);
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
        
        await this.renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
    }

    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        const mainDogCard = await this.generateDogCard(futurePuppy, 'Toekomstige Pup', true, 0);
        const fatherCard = await this.generateDogCard(pedigreeTree.father, 'Vader', false, 1);
        const motherCard = await this.generateDogCard(pedigreeTree.mother, 'Moeder', false, 1);
        const paternalGrandfatherCard = await this.generateDogCard(pedigreeTree.paternalGrandfather, 'Grootvader', false, 2);
        const paternalGrandmotherCard = await this.generateDogCard(pedigreeTree.paternalGrandmother, 'Grootmoeder', false, 2);
        const maternalGrandfatherCard = await this.generateDogCard(pedigreeTree.maternalGrandfather, 'Grootvader', false, 2);
        const maternalGrandmotherCard = await this.generateDogCard(pedigreeTree.maternalGrandmother, 'Grootmoeder', false, 2);
        
        const gridHTML = `
            <div class="rtc-pedigree-grid-compact">
                <div class="rtc-pedigree-generation-col gen0">${mainDogCard}</div>
                <div class="rtc-pedigree-generation-col gen1">${fatherCard}${motherCard}</div>
                <div class="rtc-pedigree-generation-col gen2">
                    ${paternalGrandfatherCard}${paternalGrandmotherCard}
                    ${maternalGrandfatherCard}${maternalGrandmotherCard}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        this.setupCardClickEvents();
        
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
            maternalGrandmother: null
        };
        
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id;
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id;
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id;
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id;
        
        if (reuVaderId) pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
        if (reuMoederId) pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
        if (teefVaderId) pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
        if (teefMoederId) pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
        
        return pedigreeTree;
    }

    async generateDogCard(dog, relation, isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="rtc-pedigree-card-compact horizontal empty" data-dog-id="0">
                    <div class="rtc-pedigree-card-header-compact horizontal">
                        <div class="rtc-relation-compact">${relation}</div>
                    </div>
                    <div class="rtc-pedigree-card-body-compact horizontal text-center py-3">
                        <div class="rtc-no-data-text">Geen gegevens</div>
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
        
        const combinedName = dog.naam || 'Onbekend';
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        return `
            <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}">
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
                    </div>
                    <div class="rtc-card-row rtc-card-row-3">
                        <div class="rtc-click-hint-compact">
                            <i class="bi bi-info-circle"></i> Klik voor details${cameraIcon}
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
                if (dogId === 0 || dogId === -999999) return;
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
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
        
        const genderText = dog.geslacht === 'reuen' ? 'Reu' : 
                          dog.geslacht === 'teven' ? 'Teef' : 'Onbekend';
        
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        const thumbnails = dog.id > 0 ? await this.getDogThumbnails(dog.id, 9) : [];
        
        const combinedName = dog.naam || 'Onbekend';
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
                    <button type="button" class="rtc-btn-close"></button>
                </div>
                <div class="rtc-popup-body">
                    ${thumbnails.length > 0 ? `
                    <div class="rtc-info-section mb-3">
                        <h6><i class="bi bi-camera me-1"></i> Foto's (${thumbnails.length})</h6>
                        <div class="photos-grid">
                            ${thumbnails.map((thumb, index) => `
                                <div class="photo-thumbnail">
                                    <img src="${thumb.thumbnail}" 
                                         alt="${dog.naam || ''}" 
                                         class="thumbnail-img">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="rtc-info-grid">
                            ${dog.stamboomnr ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item">
                                    <span class="rtc-info-label">Stamboomnummer:</span>
                                    <span class="rtc-info-value">${dog.stamboomnr}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            <div class="rtc-info-row">
                                <div class="rtc-info-item">
                                    <span class="rtc-info-label">Geslacht:</span>
                                    <span class="rtc-info-value">${genderText}</span>
                                </div>
                            </div>
                            
                            <div class="rtc-three-values-row">
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">COI 6 Gen</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> Sluiten
                    </button>
                </div>
            </div>
        `;
    }

    addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis) {
        const futurePuppyCard = document.querySelector('.rtc-pedigree-card-compact.horizontal.main-dog-compact');
        if (futurePuppyCard) {
            futurePuppyCard.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis);
            });
            futurePuppyCard.style.cursor = 'pointer';
        }
    }

    showFuturePuppyPopup(futurePuppy, coiResult, healthAnalysis) {
        const coi6Color = this.getCOIColor(coiResult.coi6Gen);
        const healthAnalysisHTML = this.generateHealthAnalysisHTML(healthAnalysis);
        
        const popupHTML = `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi bi-stars me-2" style="color: #ffc107;"></i>
                        Toekomstige Pup - Voorspelling
                    </h5>
                    <button type="button" class="rtc-btn-close"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-calculator me-1"></i> Voorspelde COI</h6>
                        <div class="rtc-info-grid">
                            <div class="rtc-three-values-row">
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">COI 6 Gen</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coi6Color} !important;">${coiResult.coi6Gen || '0.0'}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-4">
                        <h6><i class="bi bi-heart-pulse me-1"></i> Gezondheid in lijn</h6>
                        ${healthAnalysisHTML}
                    </div>
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> Sluiten
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
                            <th>Gezondheidscategorie</th>
                            <th>Moederlijn</th>
                            <th>Vaderlijn</th>
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
        const closePopup = () => overlay.style.display = 'none';
        
        closeButtons.forEach(btn => btn.addEventListener('click', closePopup));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });
    }

    showError(message) {
        console.error('ReuTeefStamboom Error:', message);
        if (this.mainModule?.showError) {
            this.mainModule.showError(message);
        } else {
            alert(message);
        }
    }

    showAlert(message, type = 'info') {
        console.log(`ReuTeefStamboom ${type}:`, message);
        if (this.mainModule?.showAlert) {
            this.mainModule.showAlert(message, type);
        } else {
            alert(message);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}