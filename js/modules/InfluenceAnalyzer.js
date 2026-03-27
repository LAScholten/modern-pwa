/**
 * InfluenceAnalyzer.js - MET GENERATIE KOLOM (ALLE GENERATIES)
 * Analyseert hoe vaak voorouders voorkomen in een stamboom over 8 generaties
 */

class InfluenceAnalyzer {
    constructor() {
        this.name = 'Voorouder Analyse';
        this.title = 'Voorouder Analyse';
        this.displayName = 'Voorouder Analyse';
        
        this.initialized = false;
        this.currentLang = this.detectLanguage();
        this.t = null;
        this.translations = {};
        this.mainModule = null;
        this.allDogs = [];
        
        this.setDefaultTranslations();
        this.updateButtonText();
        this.tryAutoInitialize();
    }
    
    detectLanguage() {
        if (window.mainModule && window.mainModule.currentLang) {
            return window.mainModule.currentLang;
        }
        if (window.stamboomManager && window.stamboomManager.currentLang) {
            return window.stamboomManager.currentLang;
        }
        if (window.reuTeefStamboom && window.reuTeefStamboom.currentLang) {
            return window.reuTeefStamboom.currentLang;
        }
        if (window.currentLanguage) {
            return window.currentLanguage;
        }
        if (localStorage && localStorage.getItem('appLanguage')) {
            return localStorage.getItem('appLanguage');
        }
        return 'nl';
    }
    
    tryAutoInitialize() {
        console.log('InfluenceAnalyzer: Probeer automatisch te initialiseren...');
        console.log('InfluenceAnalyzer: Huidige taal:', this.currentLang);
        
        if (window.mainModule) {
            this.initialize(window.mainModule);
            return;
        }
        
        if (window.stamboomManager) {
            this.initialize(window.stamboomManager);
            return;
        }
        
        if (window.reuTeefStamboom) {
            this.initialize(window.reuTeefStamboom);
            return;
        }
        
        console.log('InfluenceAnalyzer: Geen main module gevonden, gebruik gedetecteerde taal:', this.currentLang);
        this.initialized = true;
    }
    
    initialize(mainModule) {
        if (this.initialized) return;
        
        this.mainModule = mainModule;
        
        if (mainModule) {
            if (mainModule.allHonden && Array.isArray(mainModule.allHonden)) {
                this.allDogs = mainModule.allHonden;
                console.log(`InfluenceAnalyzer: ${this.allDogs.length} honden geladen uit mainModule.allHonden`);
            } else if (mainModule.allDogs && Array.isArray(mainModule.allDogs)) {
                this.allDogs = mainModule.allDogs;
                console.log(`InfluenceAnalyzer: ${this.allDogs.length} honden geladen uit mainModule.allDogs`);
            }
            
            if (mainModule.currentLang) {
                const oldLang = this.currentLang;
                this.currentLang = mainModule.currentLang;
                this.updateButtonText();
                console.log(`InfluenceAnalyzer: Taal bijgewerkt van ${oldLang} naar ${this.currentLang}`);
            }
            
            console.log(`✅ InfluenceAnalyzer geïnitialiseerd met taal: ${this.currentLang}`);
        }
        
        this.initialized = true;
    }
    
    setDefaultTranslations() {
        this.translations = {
            nl: {
                title: 'Voorouder Analyse (8 generaties)',
                buttonTitle: 'Voorouder Analyse (8 gen)',
                disclaimer: 'Dit toont alle unieke voorouders over 8 generaties en hoe vaak ze voorkomen. De tabel is gesorteerd op meest voorkomende honden, met prioriteit voor honden die in beide lijnen voorkomen.',
                totalMales: 'Totaal reuen',
                totalFemales: 'Totaal teven',
                totalAll: 'Totaal alle posities',
                totalUnique: 'Unieke voorouders',
                filledPositions: 'Gevulde posities',
                name: 'Naam',
                occurrences: 'Voorkomens',
                generations: 'Generaties',
                line: 'Lijn',
                close: 'Sluiten',
                noData: 'Geen voorouders gevonden',
                rank: '#',
                male: 'Reu',
                female: 'Teef',
                unknown: 'Onbekend',
                loading: 'Bezig met laden...',
                motherLine: 'Moederlijn',
                fatherLine: 'Vaderlijn',
                bothLines: 'Beide lijnen',
                multipleFather: 'Meerdere in vaderlijn',
                multipleMother: 'Meerdere in moederlijn',
                sortingInfo: 'Sortering: Meeste voorkomens | Beide lijnen | Meerdere in vaderlijn | Meerdere in moederlijn | Laagste generatie',
                generationTooltip: 'Toont alle generaties waar deze hond voorkomt (1-8)'
            },
            en: {
                title: 'Ancestor Analysis (8 generations)',
                buttonTitle: 'Ancestor Analysis (8 gen)',
                disclaimer: 'This shows all unique ancestors over 8 generations and how often they appear. The table is sorted by most common ancestors, with priority for ancestors appearing in both lines.',
                totalMales: 'Total males',
                totalFemales: 'Total females',
                totalAll: 'Total all positions',
                totalUnique: 'Unique ancestors',
                filledPositions: 'Filled positions',
                name: 'Name',
                occurrences: 'Occurrences',
                generations: 'Generations',
                line: 'Line',
                close: 'Close',
                noData: 'No ancestors found',
                rank: '#',
                male: 'Male',
                female: 'Female',
                unknown: 'Unknown',
                loading: 'Loading...',
                motherLine: 'Mother line',
                fatherLine: 'Father line',
                bothLines: 'Both lines',
                multipleFather: 'Multiple in father line',
                multipleMother: 'Multiple in mother line',
                sortingInfo: 'Sorting: Most occurrences | Both lines | Multiple in father line | Multiple in mother line | Lowest generation',
                generationTooltip: 'Shows all generations where this ancestor appears (1-8)'
            },
            de: {
                title: 'Ahnen-Analyse (8 Generationen)',
                buttonTitle: 'Ahnen-Analyse (8 Gen)',
                disclaimer: 'Dies zeigt alle einzigartigen Ahnen über 8 Generationen und wie oft sie vorkommen. Die Tabelle ist sortiert nach häufigsten Ahnen, mit Priorität für Ahnen die in beiden Linien vorkommen.',
                totalMales: 'Gesamt Rüden',
                totalFemales: 'Gesamt Hündinnen',
                totalAll: 'Gesamt alle Positionen',
                totalUnique: 'Einzigartige Ahnen',
                filledPositions: 'Gefüllte Positionen',
                name: 'Name',
                occurrences: 'Vorkommen',
                generations: 'Generationen',
                line: 'Linie',
                close: 'Schließen',
                noData: 'Keine Vorfahren gefunden',
                rank: '#',
                male: 'Rüde',
                female: 'Hündin',
                unknown: 'Unbekannt',
                loading: 'Laden...',
                motherLine: 'Mütterliche Linie',
                fatherLine: 'Väterliche Linie',
                bothLines: 'Beide Linien',
                multipleFather: 'Mehrfach in väterlicher Linie',
                multipleMother: 'Mehrfach in mütterlicher Linie',
                sortingInfo: 'Sortierung: Meiste Vorkommen | Beide Linien | Mehrfach in väterlicher Linie | Mehrfach in mütterlicher Linie | Niedrigste Generation',
                generationTooltip: 'Zeigt alle Generationen wo dieser Ahne vorkommt (1-8)'
            }
        };
    }
    
    updateButtonText() {
        const buttonText = this.getTranslation('buttonTitle');
        this.name = buttonText;
        this.title = buttonText;
        this.displayName = buttonText;
        
        console.log(`InfluenceAnalyzer: Button tekst bijgewerkt naar: "${buttonText}" (taal: ${this.currentLang})`);
    }
    
    getTranslation(key) {
        return this.translations[this.currentLang]?.[key] || 
               this.translations.nl[key] || 
               key;
    }
    
    getButtonTitle() {
        return this.getTranslation('buttonTitle');
    }
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            const oldLang = this.currentLang;
            this.currentLang = lang;
            this.updateButtonText();
            console.log(`InfluenceAnalyzer: Taal gewijzigd van ${oldLang} naar ${lang}`);
            return true;
        }
        console.warn(`InfluenceAnalyzer: Taal "${lang}" niet ondersteund`);
        return false;
    }
    
    getDogById(dogId) {
        if (!dogId || dogId === 0 || dogId === -999999) return null;
        
        const numId = Number(dogId);
        
        const cached = this.allDogs.find(d => Number(d.id) === numId);
        if (cached) return cached;
        
        if (this.mainModule && typeof this.mainModule.getDogById === 'function') {
            return this.mainModule.getDogById(numId);
        }
        
        if (window.mainModule && typeof window.mainModule.getDogById === 'function') {
            return window.mainModule.getDogById(numId);
        }
        
        return null;
    }
    
    async showInfluenceAnalysis(pedigreeTree) {
        if (!this.initialized) {
            this.tryAutoInitialize();
        }
        
        if (this.mainModule && this.mainModule.currentLang && this.mainModule.currentLang !== this.currentLang) {
            this.setLanguage(this.mainModule.currentLang);
        } else if (window.mainModule && window.mainModule.currentLang && window.mainModule.currentLang !== this.currentLang) {
            this.setLanguage(window.mainModule.currentLang);
        }
        
        if (!pedigreeTree) {
            console.error('InfluenceAnalyzer: Geen pedigreeTree ontvangen');
            return;
        }
        
        console.log('InfluenceAnalyzer: Start analyse met taal:', this.currentLang);
        
        this.showLoadingPopup();
        
        try {
            const result = await this.collectAllAncestors(pedigreeTree.mainDog || pedigreeTree.futurePuppy);
            
            const ancestors = result.ancestors;
            const totalMale = result.totalMale;
            const totalFemale = result.totalFemale;
            const totalAll = result.totalAll;
            const positionsFound = result.positionsFound;
            const totalUnique = ancestors.length;
            
            console.log(`InfluenceAnalyzer: ${totalUnique} unieke voorouders gevonden`);
            
            this.closeLoadingPopup();
            this.showPopup(ancestors, totalMale, totalFemale, totalAll, positionsFound, totalUnique);
            
        } catch (error) {
            console.error('Fout bij analyse:', error);
            this.closeLoadingPopup();
            alert('Er is een fout opgetreden bij de analyse.');
        }
    }
    
    showLoadingPopup() {
        const existing = document.getElementById('ia-loading-overlay');
        if (existing) existing.remove();
        
        const loadingPopup = `
            <div class="ia-popup-overlay" id="ia-loading-overlay" style="display: flex;">
                <div class="ia-popup-container" style="max-width: 400px; text-align: center;">
                    <div class="ia-popup-header">
                        <h4 class="ia-popup-title">
                            <i class="bi bi-diagram-3 me-2"></i> ${this.getTranslation('title')}
                        </h4>
                    </div>
                    <div class="ia-popup-body" style="padding: 30px;">
                        <div class="spinner-border text-success mb-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>${this.getTranslation('loading')}</p>
                        <p class="text-muted small">${this.getTranslation('disclaimer')}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingPopup);
    }
    
    closeLoadingPopup() {
        const loading = document.getElementById('ia-loading-overlay');
        if (loading) loading.remove();
    }
    
    async collectAllAncestors(startDog) {
        const ancestorMap = new Map();
        
        const queue = [];
        const processedPositions = new Set();
        
        let totalMale = 0;
        let totalFemale = 0;
        let totalAll = 0;
        let positionsFound = 0;
        
        // Totaal aantal mogelijke posities voor 8 generaties (2 + 4 + 8 + ... + 256) = 510
        const totalPossiblePositions = 510; // 2^1 + 2^2 + ... + 2^8 = 510
        
        if (startDog) {
            const vaderId = startDog.vader_id || startDog.vaderId;
            const moederId = startDog.moeder_id || startDog.moederId;
            
            if (vaderId && vaderId > 0) {
                const vader = this.getDogById(vaderId);
                if (vader) {
                    const positionKey = `${vader.id}_gen1_vader`;
                    if (!processedPositions.has(positionKey)) {
                        processedPositions.add(positionKey);
                        queue.push({ 
                            dog: vader, 
                            generation: 1, 
                            parentPath: 'vader', 
                            mainLine: 'father' 
                        });
                        positionsFound++;
                    }
                }
            }
            
            if (moederId && moederId > 0) {
                const moeder = this.getDogById(moederId);
                if (moeder) {
                    const positionKey = `${moeder.id}_gen1_moeder`;
                    if (!processedPositions.has(positionKey)) {
                        processedPositions.add(positionKey);
                        queue.push({ 
                            dog: moeder, 
                            generation: 1, 
                            parentPath: 'moeder', 
                            mainLine: 'mother' 
                        });
                        positionsFound++;
                    }
                }
            }
        }
        
        while (queue.length > 0) {
            const { dog, generation, parentPath, mainLine } = queue.shift();
            
            if (!dog || !dog.id || dog.id === -999999) continue;
            if (generation > 8) continue; // Gewijzigd van 6 naar 8
            
            if (!ancestorMap.has(dog.id)) {
                ancestorMap.set(dog.id, {
                    id: dog.id,
                    naam: dog.naam || 'Onbekend',
                    kennelnaam: dog.kennelnaam || '',
                    geslacht: dog.geslacht || 'onbekend',
                    geslachtIcon: dog.geslacht === 'reuen' ? '♂' : dog.geslacht === 'teven' ? '♀' : '?',
                    occurrences: 0,
                    inFatherLine: false,
                    inMotherLine: false,
                    fatherOccurrences: 0,
                    motherOccurrences: 0,
                    generations: new Set(), // Set om unieke generaties bij te houden
                    lowestGeneration: 9, // Start hoog (boven 8)
                    paths: []
                });
            }
            
            const record = ancestorMap.get(dog.id);
            record.occurrences++;
            
            // Voeg generatie toe aan de Set
            record.generations.add(generation);
            
            // Update laagste generatie
            if (generation < record.lowestGeneration) {
                record.lowestGeneration = generation;
            }
            
            if (mainLine === 'father') {
                record.inFatherLine = true;
                record.fatherOccurrences++;
            } else if (mainLine === 'mother') {
                record.inMotherLine = true;
                record.motherOccurrences++;
            }
            
            record.paths.push(parentPath);
            
            if (record.geslacht === 'reuen') totalMale++;
            else if (record.geslacht === 'teven') totalFemale++;
            totalAll++;
            
            if (generation < 8) { // Gewijzigd van 6 naar 8
                const vaderId = dog.vader_id || dog.vaderId;
                const moederId = dog.moeder_id || dog.moederId;
                
                if (vaderId && vaderId > 0) {
                    const vader = this.getDogById(vaderId);
                    if (vader) {
                        const positionKey = `${vader.id}_gen${generation + 1}_${parentPath}_vader`;
                        if (!processedPositions.has(positionKey)) {
                            processedPositions.add(positionKey);
                            queue.push({ 
                                dog: vader, 
                                generation: generation + 1, 
                                parentPath: `${parentPath} - vader`,
                                mainLine: mainLine
                            });
                            positionsFound++;
                        }
                    }
                }
                
                if (moederId && moederId > 0) {
                    const moeder = this.getDogById(moederId);
                    if (moeder) {
                        const positionKey = `${moeder.id}_gen${generation + 1}_${parentPath}_moeder`;
                        if (!processedPositions.has(positionKey)) {
                            processedPositions.add(positionKey);
                            queue.push({ 
                                dog: moeder, 
                                generation: generation + 1, 
                                parentPath: `${parentPath} - moeder`,
                                mainLine: mainLine
                            });
                            positionsFound++;
                        }
                    }
                }
            }
        }
        
        const ancestors = Array.from(ancestorMap.values());
        
        // Converteer generations Set naar gesorteerde array voor weergave
        ancestors.forEach(ancestor => {
            ancestor.generationsArray = Array.from(ancestor.generations).sort((a, b) => a - b);
            
            if (ancestor.inFatherLine && ancestor.inMotherLine) {
                ancestor.line = this.getTranslation('bothLines');
            } else if (ancestor.inFatherLine) {
                ancestor.line = this.getTranslation('fatherLine');
            } else if (ancestor.inMotherLine) {
                ancestor.line = this.getTranslation('motherLine');
            } else {
                ancestor.line = this.getTranslation('unknown');
            }
        });
        
        // Aangepaste sortering met laagste generatie
        ancestors.sort((a, b) => {
            // 1. Meeste voorkomens (aflopend)
            if (a.occurrences !== b.occurrences) {
                return b.occurrences - a.occurrences;
            }
            
            // 2. Beide lijnen
            const aBoth = a.line === this.getTranslation('bothLines');
            const bBoth = b.line === this.getTranslation('bothLines');
            if (aBoth && !bBoth) return -1;
            if (!aBoth && bBoth) return 1;
            
            // 3. Meerdere in vaderlijn
            const aMultipleFather = a.line === this.getTranslation('fatherLine') && a.occurrences > 1;
            const bMultipleFather = b.line === this.getTranslation('fatherLine') && b.occurrences > 1;
            if (aMultipleFather && !bMultipleFather) return -1;
            if (!aMultipleFather && bMultipleFather) return 1;
            
            // 4. Meerdere in moederlijn
            const aMultipleMother = a.line === this.getTranslation('motherLine') && a.occurrences > 1;
            const bMultipleMother = b.line === this.getTranslation('motherLine') && b.occurrences > 1;
            if (aMultipleMother && !bMultipleMother) return -1;
            if (!aMultipleMother && bMultipleMother) return 1;
            
            // 5. Laagste generatie (oplopend)
            if (a.lowestGeneration !== b.lowestGeneration) {
                return a.lowestGeneration - b.lowestGeneration;
            }
            
            // 6. Alfabetisch op naam
            return (a.naam || '').localeCompare(b.naam || '');
        });
        
        return {
            ancestors: ancestors,
            totalMale: totalMale,
            totalFemale: totalFemale,
            totalAll: totalAll,
            positionsFound: positionsFound
        };
    }
    
    showPopup(ancestors, totalMale, totalFemale, totalAll, positionsFound, totalUnique) {
        const existingPopup = document.getElementById('ia-popup-overlay');
        if (existingPopup) existingPopup.remove();
        
        const popupHTML = this.generatePopupHTML(ancestors, totalMale, totalFemale, totalAll, positionsFound, totalUnique);
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        const overlay = document.getElementById('ia-popup-overlay');
        overlay.style.display = 'flex';
        
        this.setupPopupEventListeners();
    }
    
    generatePopupHTML(ancestors, totalMale, totalFemale, totalAll, positionsFound, totalUnique) {
        const t = (key) => this.getTranslation(key);
        
        let rows = '';
        ancestors.forEach((item, index) => {
            const fullName = item.naam + (item.kennelnaam ? ` ${item.kennelnaam}` : '');
            const genderIcon = item.geslacht === 'reuen' ? '♂' : item.geslacht === 'teven' ? '♀' : '?';
            const isOutlier = item.occurrences > 1;
            
            // Formatteer generaties voor weergave
            const generationsText = item.generationsArray.join(', ');
            
            let lineIcon = '';
            let lineTitle = '';
            if (item.line === t('bothLines')) {
                lineIcon = '🔀';
                lineTitle = t('bothLines');
            } else if (item.line === t('fatherLine')) {
                lineIcon = '♂';
                lineTitle = item.occurrences > 1 ? t('multipleFather') : t('fatherLine');
            } else if (item.line === t('motherLine')) {
                lineIcon = '♀';
                lineTitle = item.occurrences > 1 ? t('multipleMother') : t('motherLine');
            }
            
            const outlierIcon = isOutlier ? ' ⭐' : '';
            const rowClass = index % 2 === 0 ? 'ia-row-even' : 'ia-row-odd';
            
            let occurrenceColor = '#212529';
            if (item.occurrences >= 4) occurrenceColor = '#dc3545';
            else if (item.occurrences === 3) occurrenceColor = '#fd7e14';
            else if (item.occurrences === 2) occurrenceColor = '#ffc107';
            
            rows += `
                <tr class="${rowClass} ${isOutlier ? 'ia-outlier-row' : ''}">
                    <td class="ia-rank">${index + 1}</td>
                    <td class="ia-gender" title="${item.geslacht === 'reuen' ? t('male') : item.geslacht === 'teven' ? t('female') : t('unknown')}">${genderIcon}</td>
                    <td class="ia-name" title="${fullName}">${fullName}${outlierIcon}</td>
                    <td class="ia-occurrences" style="color: ${occurrenceColor}; font-weight: ${item.occurrences > 1 ? 'bold' : 'normal'};">${item.occurrences}x</td>
                    <td class="ia-generations" title="${t('generationTooltip')}">${generationsText}</td>
                    <td class="ia-line" title="${lineTitle}">${lineIcon} ${item.line}</td>
                </tr>
            `;
        });
        
        // Totaal aantal posities voor 8 generaties is 510 (2+4+8+16+32+64+128+256)
        const totalPositions = 510;
        const positionsColor = positionsFound === totalPositions ? '#28a745' : '#fd7e14';
        
        return `
            <div class="ia-popup-overlay" id="ia-popup-overlay">
                <div class="ia-popup-container">
                    <div class="ia-popup-header">
                        <h4 class="ia-popup-title">
                            <i class="bi bi-diagram-3 me-2"></i> ${t('title')}
                        </h4>
                        <button type="button" class="ia-btn-close" id="ia-btn-close" aria-label="${t('close')}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="ia-popup-body">
                        <div class="ia-disclaimer alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            ${t('disclaimer')}
                        </div>
                        
                        <div class="ia-summary">
                            <div class="ia-summary-item">
                                <span class="ia-summary-label">${t('totalMales')}</span>
                                <span class="ia-summary-value">${totalMale}</span>
                            </div>
                            <div class="ia-summary-item">
                                <span class="ia-summary-label">${t('totalFemales')}</span>
                                <span class="ia-summary-value">${totalFemale}</span>
                            </div>
                            <div class="ia-summary-item ia-summary-total">
                                <span class="ia-summary-label">${t('totalAll')}</span>
                                <span class="ia-summary-value">${totalAll}/${totalPositions}</span>
                            </div>
                            <div class="ia-summary-item">
                                <span class="ia-summary-label">${t('filledPositions')}</span>
                                <span class="ia-summary-value" style="color: ${positionsColor};">${positionsFound}/${totalPositions}</span>
                            </div>
                            <div class="ia-summary-item">
                                <span class="ia-summary-label">${t('totalUnique')}</span>
                                <span class="ia-summary-value">${totalUnique}</span>
                            </div>
                        </div>
                        
                        <div class="ia-info-box">
                            <small>
                                <span class="ia-legend-item"><span style="color: #dc3545;">🔴 Rood</span> = 4+ keer</span>
                                <span class="ia-legend-item"><span style="color: #fd7e14;">🟠 Oranje</span> = 3 keer</span>
                                <span class="ia-legend-item"><span style="color: #ffc107;">🟡 Geel</span> = 2 keer</span>
                                <span class="ia-legend-item">⭐ = Meerdere keren voorkomend</span>
                                <span class="ia-legend-item">🔀 = ${t('bothLines')}</span>
                                <span class="ia-legend-item">♂ = ${t('fatherLine')}</span>
                                <span class="ia-legend-item">♀ = ${t('motherLine')}</span>
                                <span class="ia-legend-item">📊 = Generaties (1-8)</span>
                            </small>
                        </div>
                        
                        <div class="ia-sortering-info alert alert-light py-1 px-2 mb-2 small">
                            <i class="bi bi-sort-down me-1"></i> ${t('sortingInfo')}
                        </div>
                        
                        <div class="ia-table-container">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>${t('rank')}</th>
                                        <th>⚥</th>
                                        <th>${t('name')}</th>
                                        <th>${t('occurrences')}</th>
                                        <th title="${t('generationTooltip')}">${t('generations')}</th>
                                        <th>${t('line')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="ia-total-count">
                            <strong>${t('totalUnique')}: ${totalUnique} | ${t('filledPositions')}: ${positionsFound}/${totalPositions}</strong>
                            ${positionsFound < totalPositions ? '<br><small class="text-muted">Niet alle posities zijn gevuld.</small>' : ''}
                        </div>
                    </div>
                    <div class="ia-popup-footer">
                        <button type="button" class="btn btn-secondary ia-close-btn" id="ia-close-btn">
                            <i class="bi bi-x-circle me-1"></i> ${t('close')}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .ia-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:1170;display:none;align-items:center;justify-content:center;animation:ia-fadeIn 0.3s}
                @keyframes ia-fadeIn{from{opacity:0}to{opacity:1}}
                .ia-popup-container{background:white;border-radius:12px;max-width:1200px;width:95%;max-height:90vh;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.3);animation:ia-slideUp 0.3s;display:flex;flex-direction:column}
                @keyframes ia-slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
                .ia-popup-header{background:#198754;color:white;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;border-radius:12px 12px 0 0}
                .ia-popup-title{margin:0;font-size:1.3rem;display:flex;align-items:center}
                .ia-btn-close{background:transparent;border:none;color:white;font-size:1.8rem;line-height:1;padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0.8;transition:opacity 0.2s}
                .ia-btn-close:hover{opacity:1}
                .ia-popup-body{padding:20px;overflow-y:auto;flex:1}
                .ia-disclaimer{margin-bottom:15px;font-size:0.9rem}
                .ia-summary{display:flex;justify-content:space-around;background:#f8f9fa;border-radius:8px;padding:15px;margin-bottom:15px;border:1px solid #dee2e6;flex-wrap:wrap;gap:10px}
                .ia-summary-item{text-align:center;flex:1;min-width:100px;padding:5px}
                .ia-summary-label{display:block;font-size:0.8rem;color:#6c757d;margin-bottom:5px}
                .ia-summary-value{display:block;font-size:1.2rem;font-weight:600;color:#198754}
                .ia-summary-total{border-left:2px solid #dee2e6;border-right:2px solid #dee2e6}
                .ia-info-box{background:#e7f5ff;border-radius:6px;padding:8px 12px;margin-bottom:15px;font-size:0.8rem;display:flex;gap:15px;flex-wrap:wrap}
                .ia-legend-item{margin-right:10px}
                .ia-sortering-info{background:#f8f9fa;border:1px solid #dee2e6;color:#495057}
                .ia-table-container{max-height:50vh;overflow-y:auto;border:1px solid #dee2e6;border-radius:8px;margin-bottom:15px}
                .ia-table{width:100%;border-collapse:collapse;font-size:0.85rem}
                .ia-table th{text-align:left;padding:8px 4px;background:#e9ecef;color:#495057;font-weight:600;position:sticky;top:0;z-index:10;white-space:nowrap}
                .ia-table td{padding:6px 4px;border-bottom:1px solid #dee2e6;white-space:nowrap}
                .ia-table tbody tr:hover{background:#e9ecef !important}
                .ia-row-even{background-color:#ffffff}
                .ia-row-odd{background-color:#f8f9fa}
                .ia-outlier-row{background-color:rgba(220,53,69,0.05) !important}
                .ia-outlier-row:hover{background-color:rgba(220,53,69,0.1) !important}
                .ia-rank{width:30px;font-weight:600;color:#6c757d;text-align:center}
                .ia-gender{width:20px;text-align:center;font-size:1rem}
                .ia-name{max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
                .ia-occurrences{width:70px;text-align:center;font-weight:500}
                .ia-generations{width:100px;text-align:center;font-family:monospace;font-weight:500}
                .ia-line{width:120px}
                .ia-total-count{text-align:center;padding:8px;background:#f8f9fa;border-radius:6px;border:1px solid #dee2e6;font-size:0.85rem;margin-bottom:10px}
                .ia-popup-footer{padding:15px 20px;border-top:1px solid #dee2e6;display:flex;justify-content:flex-end;background:#f8f9fa}
                .ia-close-btn{min-width:100px}
                @media (max-width:768px){.ia-popup-container{width:98%}.ia-table{font-size:0.75rem}.ia-name{max-width:150px}.ia-generations{width:80px}.ia-summary{flex-direction:column}.ia-info-box{flex-direction:column}}
                @media (max-width:480px){.ia-name{max-width:120px}.ia-generations{width:70px}}
            </style>
        `;
    }
    
    setupPopupEventListeners() {
        const overlay = document.getElementById('ia-popup-overlay');
        if (!overlay) return;
        
        const closePopup = () => overlay.style.display = 'none';
        
        const closeBtn = document.getElementById('ia-btn-close');
        if (closeBtn) closeBtn.addEventListener('click', closePopup);
        
        const closeFooterBtn = document.getElementById('ia-close-btn');
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', closePopup);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && overlay.style.display === 'flex') closePopup();
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    setMainModule(mainModule) {
        if (mainModule) {
            this.mainModule = mainModule;
            if (mainModule.allHonden) this.allDogs = mainModule.allHonden;
            if (mainModule.allDogs) this.allDogs = mainModule.allDogs;
            
            if (mainModule.currentLang) {
                this.setLanguage(mainModule.currentLang);
            }
            
            this.initialized = true;
        }
    }
}

// Maak direct een instance aan en zet deze globaal
window.InfluenceAnalyzer = InfluenceAnalyzer;
window.influenceAnalyzer = new InfluenceAnalyzer();

// Export voor modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfluenceAnalyzer;
}