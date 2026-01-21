/**
 * Reu en Teef Stamboom Module - EXACT ZELFDE ALS STAMBOOMMANAGER
 * Wacht nu op StamboomManager om klaar te zijn
 */

class ReuTeefStamboom {
    constructor(mainModule) {
        this.mainModule = mainModule;
        this.t = mainModule.t.bind(mainModule);
        this.currentLang = mainModule.currentLang;
        
        // EXACT DEZELFDE als StamboomManager: gebruik allDogs (niet allHonden)
        this.allDogs = [];
        this.initialized = false;
        
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // EXACT DEZELFDE COI Calculator logica
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // EXACT DEZELFDE caches
        this.dogPhotosCache = new Map();
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        this.healthAnalysisCache = new Map();
        
        console.log(`ReuTeefStamboom: Constructor aangeroepen, wacht op initialisatie...`);
        
        // Start initialisatie asynchroon
        this.initializeAsync();
    }
    
    // ASYNCHRONE INITIALISATIE die wacht op StamboomManager
    async initializeAsync() {
        try {
            console.log('ReuTeefStamboom: Wacht op StamboomManager...');
            
            // Wacht maximaal 10 seconden op StamboomManager
            let attempts = 0;
            const maxAttempts = 100; // 100 * 100ms = 10 seconden
            
            while (attempts < maxAttempts) {
                attempts++;
                
                // Controleer of StamboomManager bestaat EN actief is
                if (this.mainModule && this.mainModule._isActive && 
                    this.mainModule.allDogs && this.mainModule.allDogs.length > 0) {
                    
                    // Kopieer de data van StamboomManager
                    this.allDogs = [...this.mainModule.allDogs];
                    this.coiCalculator = this.mainModule.coiCalculator;
                    this.coiCalculatorReady = !!this.coiCalculator;
                    
                    // Kopieer caches als ze bestaan
                    if (this.mainModule.dogPhotosCache) {
                        this.dogPhotosCache = new Map(this.mainModule.dogPhotosCache);
                    }
                    if (this.mainModule.dogHasPhotosCache) {
                        this.dogHasPhotosCache = new Map(this.mainModule.dogHasPhotosCache);
                    }
                    if (this.mainModule.dogThumbnailsCache) {
                        this.dogThumbnailsCache = new Map(this.mainModule.dogThumbnailsCache);
                    }
                    if (this.mainModule.fullPhotoCache) {
                        this.fullPhotoCache = new Map(this.mainModule.fullPhotoCache);
                    }
                    
                    console.log(`✅ ReuTeefStamboom: Geïnitialiseerd met ${this.allDogs.length} honden (EXACT ZELFDE ALS STAMBOOM)`);
                    console.log(`✅ ReuTeefStamboom: COI Calculator beschikbaar: ${this.coiCalculatorReady}`);
                    this.initialized = true;
                    return;
                }
                
                // Wacht 100ms en probeer opnieuw
                await new Promise(resolve => setTimeout(resolve, 100));
                
                if (attempts % 10 === 0) {
                    console.log(`⏳ ReuTeefStamboom: Wacht op StamboomManager... (${attempts}/100)`);
                }
            }
            
            // Timeout bereikt
            console.error('❌ ReuTeefStamboom: Timeout - StamboomManager niet klaar na 10 seconden');
            this.initialized = false;
            
        } catch (error) {
            console.error('❌ ReuTeefStamboom: Fout bij initialiseren:', error);
            this.initialized = false;
        }
    }
    
    // EXACT DEZELFDE getDogById als StamboomManager
    getDogById(id) {
        if (!id || id === 0) return null;
        
        // Gebruik eerst onze eigen array
        let dog = this.allDogs.find(dog => dog.id === id);
        
        // Als niet gevonden en StamboomManager beschikbaar is, probeer daar
        if (!dog && this.mainModule && this.mainModule._isActive && 
            typeof this.mainModule.getDogById === 'function') {
            dog = this.mainModule.getDogById(id);
        }
        
        return dog;
    }
    
    // NIEUW: Controleer of module klaar is
    isReady() {
        return this.initialized && this.allDogs.length > 0;
    }
    
    // NIEUW: Wacht tot module klaar is
    async waitUntilReady() {
        if (this.isReady()) {
            return true;
        }
        
        console.log('⏳ ReuTeefStamboom: Wacht tot module klaar is...');
        
        // Wacht maximaal 5 seconden
        let attempts = 0;
        const maxAttempts = 50; // 50 * 100ms = 5 seconden
        
        while (attempts < maxAttempts) {
            attempts++;
            
            if (this.isReady()) {
                console.log('✅ ReuTeefStamboom: Module is nu klaar!');
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (attempts % 10 === 0) {
                console.log(`⏳ ReuTeefStamboom: Nog steeds wachten... (${attempts}/50)`);
            }
        }
        
        console.error('❌ ReuTeefStamboom: Timeout - Module niet klaar na 5 seconden');
        return false;
    }
    
    // EXACT DEZELFDE checkDogHasPhotos als StamboomManager
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        try {
            if (this.mainModule.hondenService && typeof this.mainModule.hondenService.checkFotosExist === 'function') {
                const hasPhotos = await this.mainModule.hondenService.checkFotosExist(dog.stamboomnr);
                this.dogHasPhotosCache.set(cacheKey, hasPhotos);
                return hasPhotos;
            }
            return false;
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
            return false;
        }
    }
    
    // EXACT DEZELFDE getDogThumbnails als StamboomManager
    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return [];
        const cacheKey = `thumbs_${dogId}_${dog.stamboomnr}_${limit}`;
        if (this.dogThumbnailsCache.has(cacheKey)) {
            return this.dogThumbnailsCache.get(cacheKey);
        }
        try {
            if (this.mainModule.hondenService && typeof this.mainModule.hondenService.getFotoThumbnails === 'function') {
                const thumbnails = await this.mainModule.hondenService.getFotoThumbnails(dog.stamboomnr, limit);
                this.dogThumbnailsCache.set(cacheKey, thumbnails || []);
                return thumbnails || [];
            }
            return [];
        } catch (error) {
            console.error('Fout bij ophalen thumbnails voor hond:', dogId, error);
            return [];
        }
    }
    
    // EXACT DEZELFDE formatDate als StamboomManager
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
    
    // EXACT DEZELFDE getHealthBadge als StamboomManager
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
    
    // EXACT DEZELFDE getCOIColor als StamboomManager
    getCOIColor(value) {
        const numValue = parseFloat(value);
        if (numValue < 4.0) return '#28a745';
        if (numValue <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    // EXACT DEZELFDE calculateCOI als StamboomManager
    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        if (!dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        if (this.coiCalculator) {
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
    
    // EXACT DEZELFDE calculateAverageKinship als StamboomManager
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) return 0;
            
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
    
    // EXACT DEZELFDE buildPedigreeTree logica als StamboomManager
    buildPedigreeTree(dogId) {
        const pedigreeTree = {
            mainDog: null,
            father: null,
            mother: null,
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
        
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.mainDog = mainDog;
        
        // Ouders - EXACT DEZELFDE als StamboomManager
        if (mainDog.vaderId || mainDog.vader_id) {
            const vaderId = mainDog.vaderId || mainDog.vader_id;
            pedigreeTree.father = this.getDogById(vaderId);
        }
        
        if (mainDog.moederId || mainDog.moeder_id) {
            const moederId = mainDog.moederId || mainDog.moeder_id;
            pedigreeTree.mother = this.getDogById(moederId);
        }
        
        // Grootouders - EXACT DEZELFDE als StamboomManager
        if (pedigreeTree.father) {
            const vaderId = pedigreeTree.father.vaderId || pedigreeTree.father.vader_id;
            const moederId = pedigreeTree.father.moederId || pedigreeTree.father.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGrandfather = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGrandmother = this.getDogById(moederId);
        }
        
        if (pedigreeTree.mother) {
            const vaderId = pedigreeTree.mother.vaderId || pedigreeTree.mother.vader_id;
            const moederId = pedigreeTree.mother.moederId || pedigreeTree.mother.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGrandfather = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGrandmother = this.getDogById(moederId);
        }
        
        // Overgrootouders - EXACT DEZELFDE als StamboomManager
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
        
        // Overovergrootouders - EXACT DEZELFDE als StamboomManager
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
        
        return pedigreeTree;
    }
    
    // EXACT DEZELFDE showFuturePuppyPedigree logica (maar nu met wacht-logica)
    async showFuturePuppyPedigree(selectedTeef, selectedReu) {
        console.log('ReuTeefStamboom: showFuturePuppyPedigree aangeroepen');
        
        // Wacht tot module klaar is
        const isReady = await this.waitUntilReady();
        if (!isReady) {
            this.showError('Stamboom data nog niet geladen. Probeer over enkele seconden opnieuw.');
            return;
        }
        
        // Controleer of allDogs geladen is
        if (this.allDogs.length === 0) {
            console.error('ReuTeefStamboom: allDogs array is nog steeds leeg!');
            this.showError('Hondengegevens niet geladen. Probeer opnieuw.');
            return;
        }
        
        // Bewaar de geselecteerde honden
        this.selectedTeef = selectedTeef;
        this.selectedReu = selectedReu;
        
        console.log(`✅ ReuTeefStamboom: Toekomstige pup van: ${selectedTeef.naam} + ${selectedReu.naam}`);
        console.log(`✅ ReuTeefStamboom: Aantal honden in allDogs: ${this.allDogs.length}`);
        
        // Voorkom meerdere gelijktijdige berekeningen
        if (this.coiCalculationInProgress) {
            console.log('ReuTeefStamboom: COI berekening al bezig, wacht...');
            this.showAlert('COI berekening is al bezig, even wachten...', 'info');
            return;
        }
        
        this.coiCalculationInProgress = true;
        
        try {
            // COI Calculator zou nu beschikbaar moeten zijn
            if (!this.coiCalculator || !this.coiCalculatorReady) {
                console.log('ReuTeefStamboom: COICalculator niet klaar, probeer te gebruiken wat we hebben...');
                
                // Probeer StamboomManager's calculator te gebruiken
                if (this.mainModule && this.mainModule.coiCalculator) {
                    this.coiCalculator = this.mainModule.coiCalculator;
                    this.coiCalculatorReady = true;
                    console.log('✅ ReuTeefStamboom: Gebruik StamboomManager\'s COICalculator');
                }
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
            
            console.log('✅ ReuTeefStamboom: Toekomstige pup aangemaakt voor COI berekening');
            
            // EXACT DEZELFDE COI berekening als StamboomManager
            let coiResult = { coi6Gen: '0.0', coiAllGen: '0.0', kinship6Gen: '0.0' };
            let kinshipValue = 0;
            
            if (this.coiCalculator) {
                try {
                    // Maak tijdelijke calculator met alle honden + toekomstige pup
                    const tempCOICalculator = new COICalculator([...this.allDogs, futurePuppy]);
                    coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
                    
                    // Bereken kinship EXACT ZELFDE als StamboomManager
                    kinshipValue = this.calculateAverageKinshipForFuturePuppy(tempCOICalculator, futurePuppy.id, 6);
                    coiResult.kinship6Gen = kinshipValue.toFixed(3);
                    
                    console.log('✅ ReuTeefStamboom: COI berekend:', coiResult);
                    
                } catch (calcError) {
                    console.error('ReuTeefStamboom: Fout bij COI berekening:', calcError);
                }
            } else {
                console.warn('ReuTeefStamboom: Geen COICalculator beschikbaar, gebruik standaard waarden');
            }
            
            // Bereken gezondheidsanalyse
            console.log('ReuTeefStamboom: Bereken gezondheidsanalyse...');
            const healthAnalysis = await this.analyzeHealthInLine(futurePuppy, selectedTeef, selectedReu);
            console.log('✅ ReuTeefStamboom: Gezondheidsanalyse voltooid');
            
            // Toon stamboom
            console.log('ReuTeefStamboom: Toon stamboom modal...');
            await this.createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis);
            
        } catch (error) {
            console.error('ReuTeefStamboom: Fout bij tonen toekomstige pup stamboom:', error);
            this.showError('Kon stamboom niet genereren. Probeer opnieuw.');
        } finally {
            this.coiCalculationInProgress = false;
        }
    }
    
    // EXACT DEZELFDE analyzeHealthInLine methode
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
        
        const motherAncestors = await this.collectAncestorsFromParent(selectedTeef, 6);
        const fatherAncestors = await this.collectAncestorsFromParent(selectedReu, 6);
        
        console.log(`Moederlijn voorouders: ${motherAncestors.length}, Vaderlijn voorouders: ${fatherAncestors.length}`);
        
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
    
    // EXACT DEZELFDE collectAncestorsFromParent
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
                fullDog = this.getDogById(currentDog.id) || currentDog;
            }
            
            ancestors.push(fullDog);
            
            // EXACT DEZELFDE veldnamen als StamboomManager
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
    
    // EXACT DEZELFDE updateHealthCounts
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
    
    // Helper methoden voor health keys (EXACT ZELFDE)
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
    
    // EXACT DEZELFDE calculateAverageKinshipForFuturePuppy
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
    
    // EXACT DEZELFDE createFuturePuppyModal (maar met eigen prefix)
    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const modalId = 'rtc-futurePuppyModal';
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        const title = this.t('futurePuppyTitle') || `Toekomstige Pup: ${selectedReu.naam || '?'} + ${selectedTeef.naam || '?'}`;
        
        // Modal HTML (zelfde structuur als StamboomManager)
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
        
        this.setupFuturePuppyModalEvents();
        
        // Render de stamboom met EXACT DEZELFDE data als StamboomManager
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
    
    // EXACT DEZELFDE renderFuturePuppyPedigree logica
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
        
        // DEBUG: Controleer of honden gevonden worden
        console.log('DEBUG - Pedigree tree ouders:', {
            vader: pedigreeTree.father?.id,
            vaderNaam: pedigreeTree.father?.naam,
            moeder: pedigreeTree.mother?.id,
            moederNaam: pedigreeTree.mother?.naam,
            vaderVader: pedigreeTree.paternalGrandfather?.id,
            vaderVaderNaam: pedigreeTree.paternalGrandfather?.naam,
            vaderMoeder: pedigreeTree.paternalGrandmother?.id,
            vaderMoederNaam: pedigreeTree.paternalGrandmother?.naam,
            moederVader: pedigreeTree.maternalGrandfather?.id,
            moederVaderNaam: pedigreeTree.maternalGrandfather?.naam,
            moederMoeder: pedigreeTree.maternalGrandmother?.id,
            moederMoederNaam: pedigreeTree.maternalGrandmother?.naam
        });
        
        // Maak cards met EXACT DEZELFDE methode als StamboomManager
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
        
        // Voeg click handler toe voor de toekomstige pup card
        setTimeout(() => {
            this.addFuturePuppyClickHandler(futurePuppy, coiResult, healthAnalysis);
        }, 100);
    }
    
    // EXACT DEZELFDE buildFuturePuppyPedigreeTree structuur
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
        
        console.log('Bouw stamboom voor toekomstige pup...');
        
        // EXACT DEZELFDE logica als StamboomManager
        // Reu's vader
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id;
        if (reuVaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
            console.log(`Reu vader gevonden (ID: ${reuVaderId}):`, pedigreeTree.paternalGrandfather?.naam);
        } else {
            console.log('Reu heeft geen vader_id');
        }
        
        // Reu's moeder
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id;
        if (reuMoederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
            console.log(`Reu moeder gevonden (ID: ${reuMoederId}):`, pedigreeTree.paternalGrandmother?.naam);
        } else {
            console.log('Reu heeft geen moeder_id');
        }
        
        // Teef's vader
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id;
        if (teefVaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
            console.log(`Teef vader gevonden (ID: ${teefVaderId}):`, pedigreeTree.maternalGrandfather?.naam);
        } else {
            console.log('Teef heeft geen vader_id');
        }
        
        // Teef's moeder
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id;
        if (teefMoederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
            console.log(`Teef moeder gevonden (ID: ${teefMoederId}):`, pedigreeTree.maternalGrandmother?.naam);
        } else {
            console.log('Teef heeft geen moeder_id');
        }
        
        // Rest van de logica blijft EXACT HETZELFDE als in de buildPedigreeTree methode hierboven
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
        
        // Over-overgrootouders
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
        
        console.log('Stamboom opgebouwd:', {
            ouders: `${selectedReu.naam} + ${selectedTeef.naam}`,
            grootouders: {
                reuVader: pedigreeTree.paternalGrandfather?.naam,
                reuMoeder: pedigreeTree.paternalGrandmother?.naam,
                teefVader: pedigreeTree.maternalGrandfather?.naam,
                teefMoeder: pedigreeTree.maternalGrandmother?.naam
            }
        });
        
        return pedigreeTree;
    }
    
    // EXACT DEZELFDE generateDogCard als StamboomManager
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
        
        // EXACT DEZELFDE foto check als StamboomManager
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
        
        // Voor andere generaties (0-3): EXACT DEZELFDE layout als StamboomManager
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
                
                if (dogId === -999999) {
                    return;
                }
                
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
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') || 'Reu' : 
                          dog.geslacht === 'teven' ? this.t('female') || 'Teef' : this.t('unknown') || 'Onbekend';
        
        // EXACT DEZELFDE COI berekening als StamboomManager
        const coiValues = this.calculateCOI(dog.id);
        const coi6Color = this.getCOIColor(coiValues.coi6Gen);
        
        // EXACT DEZELFDE thumbnail ophalen als StamboomManager
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
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInLine') || 'Gezondheid in lijn'}</h6>
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
    
    // Helper methoden voor feedback (EXACT ZELFDE als StamboomManager zou hebben)
    showError(message) {
        console.error('ReuTeefStamboom Error:', message);
        if (this.mainModule && typeof this.mainModule.showError === 'function') {
            this.mainModule.showError(message);
        } else {
            alert(message);
        }
    }
    
    showAlert(message, type = 'info') {
        console.log(`ReuTeefStamboom ${type}:`, message);
        if (this.mainModule && typeof this.mainModule.showAlert === 'function') {
            this.mainModule.showAlert(message, type);
        } else {
            alert(message);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefStamboom;
}