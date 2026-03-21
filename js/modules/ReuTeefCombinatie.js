/**
 * Reu en Teef Combinatie Module
 * Voor het maken van fokplannen met specifieke reu en teef
 * GEBRUIKT TOM SELECT VOOR DIRECTE DATABASE ZOEKOPDRACHTEN (zoals NestAankondigingen)
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = []; // Wordt alleen gebruikt voor stamboom, niet voor zoeken
        this.hondenCache = new Map();
        this.isLoading = false;
        
        // Tom Select instances
        this.teefTomSelect = null;
        this.reuTomSelect = null;
        
        // Supabase client
        this.supabase = null;
        
        // COI Calculator instance
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // Unieke ID's voor isolatie
        this.uniquePrefix = 'rtc-';
        this.isolatedEventListeners = new Map();
        
        // Stamboom module referentie
        this.stamboomModule = null;
        
        // Vertalingen
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ minimaal 2 letters om te zoeken...",
                back: "Terug",
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                pedigreeTitle: "Toekomstige Pup Stamboom",
                close: "Sluiten",
                print: "Afdrukken",
                loading: "Laden...",
                noDogFound: "Geen hond gevonden",
                unknownBreed: "Onbekend ras",
                genderTeef: "Teef",
                genderReu: "Reu",
                kennel: "Kennel:",
                pedigreeNumber: "Stamboomnr:",
                birthDate: "Geboortedatum:",
                healthInfo: "Gezondheidsinformatie",
                color: "Vachtkleur:",
                searchByName: "Zoek op naam of kennel",
                dogDetails: "Hond details",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                loadingPedigree: "Stamboom wordt geladen...",
                unknownAncestor: "Onbekend",
                fatherLabel: "Vader",
                motherLabel: "Moeder",
                grandfatherLabel: "Grootvader",
                grandmotherLabel: "Grootmoeder",
                greatGrandfatherLabel: "Overgrootvader",
                greatGrandmotherLabel: "Overgrootmoeder",
                greatGreatGrandfatherLabel: "Over-overgrootvader",
                greatGreatGrandmotherLabel: "Over-overgrootmoeder",
                typeToSearch: "Typ minimaal 2 letters om te zoeken...",
                noDogsFound: "Geen honden gevonden",
                found: "gevonden",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                futurePuppyTitle: "Stamboom voor toekomstige pup uit combinatie {reu} × {teef}",
                predictedPedigree: "Voorspelde stamboom",
                combinedParents: "Combinatie ouders",
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Sluiten",
                predictedCoi: "Voorspelde Inteeltcoëfficiënt",
                futurePuppyInfo: "Toekomstige Pup Informatie",
                clickForDetails: "Klik voor details",
                healthInLine: "Gezondheid in de lijn 6 generaties",
                healthCategory: "Gezondheidscategorie",
                motherLine: "Moederlijn",
                fatherLine: "Vaderlijn",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD niet bekend",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED niet bekend",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL niet bekend",
                eyesFree: "Ogen vrij",
                eyesDist: "Ogen Dist",
                eyesOther: "Ogen overig",
                eyesUnknown: "Ogen niet bekend",
                dwlmDnaFree: "Dandy Walker (DNA) vrij",
                dwlmParentsFree: "Dandy Walker (ouders) vrij",
                dwlmUnknown: "Dandy Walker niet bekend",
                thyroidTested: "Schildklier getest",
                thyroidUnknown: "Schildklier niet bekend",
                occurrences: "Aantal keer",
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "5-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                greatGreatGrandparents: "Overovergrootouders",
                paternal: "Paternaal",
                maternal: "Maternaal",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                privateInfo: "Prive Informatie",
                privateInfoOwnerOnly: "Geen informatie",
                male: "Reu",
                female: "Teef",
                breed: "Ras",
                gender: "Geslacht",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                name: "Naam"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type at least 2 characters to search...",
                back: "Back",
                showFuturePuppy: "Show Future Puppy Pedigree",
                pedigreeTitle: "Future Puppy Pedigree",
                close: "Close",
                print: "Print",
                loading: "Loading...",
                noDogFound: "No dog found",
                unknownBreed: "Unknown breed",
                genderTeef: "Female",
                genderReu: "Male",
                kennel: "Kennel:",
                pedigreeNumber: "Pedigree nr:",
                birthDate: "Birth date:",
                healthInfo: "Health information",
                color: "Color:",
                searchByName: "Search by name or kennel",
                dogDetails: "Dog details",
                selectDogFirst: "Select both a male and a female first",
                loadingPedigree: "Loading pedigree...",
                unknownAncestor: "Unknown",
                fatherLabel: "Father",
                motherLabel: "Mother",
                grandfatherLabel: "Grandfather",
                grandmotherLabel: "Grandmother",
                greatGrandfatherLabel: "Great-grandfather",
                greatGrandmotherLabel: "Great-grandmother",
                greatGreatGrandfatherLabel: "Great-great-grandfather",
                greatGreatGrandmotherLabel: "Great-great-grandmother",
                typeToSearch: "Type at least 2 characters to search...",
                noDogsFound: "No dogs found",
                found: "found",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Prediction of combination {reu} × {teef}",
                futurePuppyTitle: "Pedigree for future puppy from combination {reu} × {teef}",
                predictedPedigree: "Predicted pedigree",
                combinedParents: "Combination parents",
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Close",
                predictedCoi: "Predicted Inbreeding Coefficient",
                futurePuppyInfo: "Future Puppy Information",
                clickForDetails: "Click for details",
                healthInLine: "Health in the line 6 generations",
                healthCategory: "Health category",
                motherLine: "Mother line",
                fatherLine: "Father line",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unknown",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unknown",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unknown",
                eyesFree: "Eyes free",
                eyesDist: "Eyes Dist",
                eyesOther: "Eyes other",
                eyesUnknown: "Eyes unknown",
                dwlmDnaFree: "Dandy Walker (DNA) free",
                dwlmParentsFree: "Dandy Walker (parents) free",
                dwlmUnknown: "Dandy Walker unknown",
                thyroidTested: "Thyroid tested",
                thyroidUnknown: "Thyroid unknown",
                occurrences: "Occurrences",
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "5-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                noData: "No data",
                unknown: "Unknown",
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                greatGreatGrandparents: "Great-great-grandparents",
                paternal: "Paternal",
                maternal: "Maternal",
                remarks: "Remarks",
                noRemarks: "No remarks",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                privateInfo: "Private Information",
                privateInfoOwnerOnly: "No information",
                male: "Male",
                female: "Female",
                breed: "Breed",
                gender: "Gender",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                name: "Name"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Geben Sie mindestens 2 Zeichen ein...",
                back: "Zurück",
                showFuturePuppy: "Zukünftigen Welpen-Ahnentafel Zeigen",
                pedigreeTitle: "Zukünftiger Welpen-Ahnentafel",
                close: "Schließen",
                print: "Drucken",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
                unknownBreed: "Unbekannte Rasse",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                kennel: "Zwingername:",
                pedigreeNumber: "Stammbuchnr:",
                birthDate: "Geburtsdatum:",
                healthInfo: "Health information",
                color: "Fellfarbe:",
                searchByName: "Suche nach Name oder Zwingername",
                dogDetails: "Hund Details",
                selectDogFirst: "Wählen Sie zuerst einen Rüden und eine Hündin",
                loadingPedigree: "Stammbaum wird geladen...",
                unknownAncestor: "Unbekannt",
                fatherLabel: "Vater",
                motherLabel: "Mutter",
                grandfatherLabel: "Großvater",
                grandmotherLabel: "Großmutter",
                greatGrandfatherLabel: "Urgroßvater",
                greatGrandmotherLabel: "Urgroßmutter",
                greatGreatGrandfatherLabel: "Ur-urgroßvater",
                greatGreatGrandmotherLabel: "Ur-urgroßmutter",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                noDogsFound: "Keine Hunde gefunden",
                found: "gefunden",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {reu} × {teef}",
                futurePuppyTitle: "Ahnentafel für zukünftigen Welpen aus Kombination {reu} × {teef}",
                predictedPedigree: "Vorhergesagter Ahnentafel",
                combinedParents: "Kombination Eltern",
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Schließen",
                predictedCoi: "Vorhergesagter Inzuchtkoeffizient",
                futurePuppyInfo: "Zukünftiger Welpen-Informationen",
                clickForDetails: "Klicken für Details",
                healthInLine: "Gesundheit in der Linie 6 Generationen",
                healthCategory: "Gesundheitskategorie",
                motherLine: "Mutterlinie",
                fatherLine: "Vaterlinie",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unbekannt",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unbekannt",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unbekannt",
                eyesFree: "Augen frei",
                eyesDist: "Augen Dist",
                eyesOther: "Augen sonstige",
                eyesUnknown: "Augen unbekannt",
                dwlmDnaFree: "Dandy Walker (DNA) frei",
                dwlmParentsFree: "Dandy Walker (Eltern) frei",
                dwlmUnknown: "Dandy Walker unbekannt",
                thyroidTested: "Schilddrüse getestet",
                thyroidUnknown: "Schilddrüse unbekannt",
                occurrences: "Anzahl Mal",
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "5-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                greatGreatGrandparents: "Ur-urgroßeltern",
                paternal: "Väterlich",
                maternal: "Mütterlich",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbaar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                privateInfo: "Private Informationen",
                privateInfoOwnerOnly: "Kein information",
                male: "Rüde",
                female: "Hündin",
                breed: "Rasse",
                gender: "Geschlecht",
                coatColor: "Fellfarbe",
                country: "Land",
                zipCode: "Postleitzahl",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                name: "Name"
            }
        };
        
        this._isActive = true;
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }
    
    /**
     * Get Supabase client
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
     * Haal honden op met filter op geslacht voor Tom Select
     * DIRECTE DATABASE ZOEKOPDRACHT (zoals in NestAankondigingen)
     */
    async getDogsByGender(gender, searchTerm = '', page = 1, pageSize = 100) {
        try {
            console.log(`🔍 ${gender} ophalen - Zoekterm: "${searchTerm}"`);
            
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return { data: [], total: 0 };
            }
            
            let query = supabase
                .from('honden')
                .select('*', { count: 'exact' })
                .eq('geslacht', gender);
            
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
            
            console.log(`✅ ${data?.length || 0} ${gender} gevonden (totaal: ${count || 0})`);
            return { 
                data: data || [], 
                total: count || 0 
            };
            
        } catch (error) {
            console.error(`❌ Fout bij ophalen ${gender}:`, error);
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
     * Maak Tom Select voor teven (moeder)
     */
    async initMotherTomSelect(initialValue = null) {
        if (typeof window.TomSelect === 'undefined') {
            await this.loadTomSelect();
        }
        
        const selectElement = document.getElementById('motherSelect');
        if (!selectElement) return null;
        
        if (this.teefTomSelect) {
            this.teefTomSelect.destroy();
        }
        
        this.teefTomSelect = new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'displayName',
            searchField: ['naam', 'kennelnaam', 'stamboomnr'],
            create: false,
            maxOptions: 100,
            maxItems: 1,
            placeholder: this.t('typeToSearch'),
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
                    console.log('🔍 Zoeken naar teef:', query);
                    const result = await this.getDogsByGender('teven', query, 1, 100);
                    
                    // Bewaar voor later gebruik (stamboom)
                    result.data.forEach(hond => {
                        if (!this.allHonden.find(d => d.id === hond.id)) {
                            this.allHonden.push(hond);
                        }
                        this.hondenCache.set(hond.id, hond);
                        if (hond.stamboomnr) {
                            this.hondenCache.set(hond.stamboomnr, hond);
                        }
                    });
                    
                    const items = result.data.map(hond => ({
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`,
                        displayWithPedigree: `
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${this.escapeHtml(hond.naam || 'Onbekend')}${hond.kennelnaam ? ' (' + this.escapeHtml(hond.kennelnaam) + ')' : ''}</span>
                                <small class="text-muted">Stamboeknr: ${this.escapeHtml(hond.stamboomnr || '-')}</small>
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
                    const hond = this.allHonden.find(d => d.id === parseInt(value));
                    if (hond) {
                        this.selectTeef(hond);
                    } else {
                        // Haal de hond op uit de database als die nog niet in allHonden zit
                        this.getHondById(parseInt(value)).then(hond => {
                            if (hond) this.selectTeef(hond);
                        });
                    }
                } else {
                    this.clearTeefSelection();
                }
            }
        });
        
        if (initialValue) {
            const hond = await this.getHondById(initialValue);
            if (hond) {
                const optionData = {
                    id: hond.id,
                    naam: hond.naam || 'Onbekend',
                    kennelnaam: hond.kennelnaam || '',
                    stamboomnr: hond.stamboomnr || '-',
                    displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`
                };
                this.teefTomSelect.addOption(optionData);
                this.teefTomSelect.setValue(hond.id);
            }
        }
        
        return this.teefTomSelect;
    }
    
    /**
     * Maak Tom Select voor reuen (vader)
     */
    async initFatherTomSelect(initialValue = null) {
        if (typeof window.TomSelect === 'undefined') {
            await this.loadTomSelect();
        }
        
        const selectElement = document.getElementById('fatherSelect');
        if (!selectElement) return null;
        
        if (this.reuTomSelect) {
            this.reuTomSelect.destroy();
        }
        
        this.reuTomSelect = new TomSelect(selectElement, {
            valueField: 'id',
            labelField: 'displayName',
            searchField: ['naam', 'kennelnaam', 'stamboomnr'],
            create: false,
            maxOptions: 100,
            maxItems: 1,
            placeholder: this.t('typeToSearch'),
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
                    console.log('🔍 Zoeken naar reu:', query);
                    const result = await this.getDogsByGender('reuen', query, 1, 100);
                    
                    // Bewaar voor later gebruik (stamboom)
                    result.data.forEach(hond => {
                        if (!this.allHonden.find(d => d.id === hond.id)) {
                            this.allHonden.push(hond);
                        }
                        this.hondenCache.set(hond.id, hond);
                        if (hond.stamboomnr) {
                            this.hondenCache.set(hond.stamboomnr, hond);
                        }
                    });
                    
                    const items = result.data.map(hond => ({
                        id: hond.id,
                        naam: hond.naam || 'Onbekend',
                        kennelnaam: hond.kennelnaam || '',
                        stamboomnr: hond.stamboomnr || '-',
                        displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`,
                        displayWithPedigree: `
                            <div class="d-flex flex-column">
                                <span class="fw-bold">${this.escapeHtml(hond.naam || 'Onbekend')}${hond.kennelnaam ? ' (' + this.escapeHtml(hond.kennelnaam) + ')' : ''}</span>
                                <small class="text-muted">Stamboeknr: ${this.escapeHtml(hond.stamboomnr || '-')}</small>
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
                    const hond = this.allHonden.find(d => d.id === parseInt(value));
                    if (hond) {
                        this.selectReu(hond);
                    } else {
                        this.getHondById(parseInt(value)).then(hond => {
                            if (hond) this.selectReu(hond);
                        });
                    }
                } else {
                    this.clearReuSelection();
                }
            }
        });
        
        if (initialValue) {
            const hond = await this.getHondById(initialValue);
            if (hond) {
                const optionData = {
                    id: hond.id,
                    naam: hond.naam || 'Onbekend',
                    kennelnaam: hond.kennelnaam || '',
                    stamboomnr: hond.stamboomnr || '-',
                    displayName: `${hond.naam || 'Onbekend'}${hond.kennelnaam ? ' (' + hond.kennelnaam + ')' : ''}`
                };
                this.reuTomSelect.addOption(optionData);
                this.reuTomSelect.setValue(hond.id);
            }
        }
        
        return this.reuTomSelect;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        
        // Leeg de cache voor de Tom Select (wordt dynamisch gevuld)
        this.allHonden = [];
        this.hondenCache.clear();
        
        // Zorg dat supabase beschikbaar is
        this.getSupabase();
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('searchByName')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectMother')}</label>
                                <select id="motherSelect" class="form-control" placeholder="${t('typeToSearch')}">
                                    <option value="">${t('typeToSearch')}</option>
                                </select>
                                <small class="text-muted d-block mt-2">${t('typeToSearch')}</small>
                            </div>
                            
                            <div id="teefDetails" class="mt-3 ${this.selectedTeef ? '' : 'd-none'}">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectFather')}</label>
                                <select id="fatherSelect" class="form-control" placeholder="${t('typeToSearch')}">
                                    <option value="">${t('typeToSearch')}</option>
                                </select>
                                <small class="text-muted d-block mt-2">${t('typeToSearch')}</small>
                            </div>
                            
                            <div id="reuDetails" class="mt-3 ${this.selectedReu ? '' : 'd-none'}">
                                <!-- Reu details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Knoppen
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Initialiseer Tom Selects
        await this.initMotherTomSelect();
        await this.initFatherTomSelect();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
        });
        
        // Update button states
        this.updateButtonStates();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
                /* Tom Select styling */
                .ts-control {
                    border-radius: 8px;
                    border: 2px solid #dee2e6;
                    padding: 8px 12px;
                }
                
                .ts-control:focus-within {
                    border-color: #6f42c1;
                    box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
                }
                
                .ts-dropdown {
                    border-radius: 8px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                }
                
                .ts-dropdown .option {
                    padding: 10px 12px;
                }
                
                .ts-dropdown .option.active {
                    background-color: #f0e6ff;
                }
                
                /* Dog details card */
                .dog-details-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    padding: 20px;
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .dog-details-header {
                    margin-bottom: 20px;
                }
                
                .dog-details-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 5px;
                }
                
                .dog-details-subtitle {
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                .dog-details-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .info-item i {
                    color: #6f42c1;
                }
                
                .dog-details-row {
                    margin-bottom: 15px;
                }
                
                .dog-details-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 5px;
                }
                
                .dog-details-value {
                    color: #212529;
                }
                
                .btn-purple {
                    background-color: #6f42c1;
                    border-color: #6f42c1;
                    color: white;
                }
                
                .btn-purple:hover:not(:disabled) {
                    background-color: #5a32a3;
                    border-color: #5a32a3;
                    color: white;
                }
                
                .btn-purple:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                /* Health badges */
                .badge-hd { background-color: #dc3545 !important; color: white !important; }
                .badge-ed { background-color: #fd7e14 !important; color: white !important; }
                .badge-pl { background-color: #6f42c1 !important; color: white !important; }
                .badge-eyes { background-color: #20c997 !important; color: white !important; }
                .badge-dandy { background-color: #6610f2 !important; color: white !important; }
                .badge-thyroid { background-color: #e83e8c !important; color: white !important; }
                
                @media (max-width: 768px) {
                    .dog-details-name {
                        font-size: 1.3rem;
                    }
                    
                    .dog-details-info {
                        flex-direction: column;
                        gap: 8px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async selectTeef(hond) {
        this.selectedTeef = hond;
        await this.showHondDetails('teefDetails', hond, 'teef');
        this.updateButtonStates();
    }
    
    async selectReu(hond) {
        this.selectedReu = hond;
        await this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
    }
    
    clearTeefSelection() {
        this.selectedTeef = null;
        const detailsContainer = document.getElementById('teefDetails');
        if (detailsContainer) {
            detailsContainer.classList.add('d-none');
            detailsContainer.innerHTML = '';
        }
        this.updateButtonStates();
    }
    
    clearReuSelection() {
        this.selectedReu = null;
        const detailsContainer = document.getElementById('reuDetails');
        if (detailsContainer) {
            detailsContainer.classList.add('d-none');
            detailsContainer.innerHTML = '';
        }
        this.updateButtonStates();
    }
    
    async showHondDetails(elementId, hond, type) {
        const t = this.t.bind(this);
        const detailsContainer = document.getElementById(elementId);
        
        if (!detailsContainer) return;
        
        detailsContainer.classList.remove('d-none');
        
        const oudersInfo = await this.getOudersInfo(hond);
        
        detailsContainer.innerHTML = `
            <div class="dog-details-card">
                <div class="dog-details-header">
                    <div class="dog-details-name">${this.escapeHtml(hond.naam || 'Onbekend')}</div>
                    ${hond.kennelnaam ? `<div class="dog-details-subtitle">${this.escapeHtml(hond.kennelnaam)}</div>` : ''}
                    
                    <div class="dog-details-info mt-3">
                        ${hond.stamboomnr ? `
                            <div class="info-item">
                                <i class="bi bi-card-checklist"></i>
                                <span>${this.escapeHtml(hond.stamboomnr)}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.ras ? `
                            <div class="info-item">
                                <i class="bi bi-tag"></i>
                                <span>${this.escapeHtml(hond.ras)}</span>
                            </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}"></i>
                            <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                        </div>
                        
                        ${hond.geboortedatum ? `
                            <div class="info-item">
                                <i class="bi bi-calendar"></i>
                                <span>${this.formatDate(hond.geboortedatum)}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.vachtkleur ? `
                            <div class="info-item">
                                <i class="bi bi-palette"></i>
                                <span>${this.escapeHtml(hond.vachtkleur)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="dog-details-row">
                    <div class="dog-details-label">${t('parents')}:</div>
                    <div class="dog-details-value">
                        <div class="row">
                            ${oudersInfo.vader ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    ${this.escapeHtml(oudersInfo.vader.naam || 'Onbekend')}
                                    ${oudersInfo.vader.stamboomnr ? `(${this.escapeHtml(oudersInfo.vader.stamboomnr)})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                            
                            ${oudersInfo.moeder ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    ${this.escapeHtml(oudersInfo.moeder.naam || 'Onbekend')}
                                    ${oudersInfo.moeder.stamboomnr ? `(${this.escapeHtml(oudersInfo.moeder.stamboomnr)})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="mt-3 pt-3 border-top">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.reuTeefCombinatie.clear${type === 'teef' ? 'Teef' : 'Reu'}Selection()">
                        <i class="bi bi-x-circle me-1"></i> Selectie wissen
                    </button>
                </div>
            </div>
        `;
    }
    
    async getOudersInfo(hond) {
        const result = { vader: null, moeder: null };
        
        if (hond.vader_id) {
            result.vader = await this.getHondById(hond.vader_id);
        } else if (hond.vader) {
            result.vader = await this.findHondByNameOrPedigree(hond.vader);
        }
        
        if (hond.moeder_id) {
            result.moeder = await this.getHondById(hond.moeder_id);
        } else if (hond.moeder) {
            result.moeder = await this.findHondByNameOrPedigree(hond.moeder);
        }
        
        return result;
    }
    
    async getHondById(id) {
        if (!id || id === 0) return null;
        
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data: hond, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error || !hond) return null;
            
            this.hondenCache.set(id, hond);
            if (hond.stamboomnr) {
                this.hondenCache.set(hond.stamboomnr, hond);
            }
            
            if (!this.allHonden.find(d => d.id === id)) {
                this.allHonden.push(hond);
            }
            
            return hond;
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${id}:`, error);
            return null;
        }
    }
    
    async findHondByNameOrPedigree(name) {
        if (!name || !name.trim()) return null;
        
        const searchName = name.toLowerCase().trim();
        for (const hond of this.allHonden) {
            const hondNaam = hond.naam?.toLowerCase() || '';
            const stamboomnr = hond.stamboomnr?.toLowerCase() || '';
            if (hondNaam === searchName || stamboomnr === searchName) {
                return hond;
            }
        }
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data, error } = await supabase
                .from('honden')
                .select('*')
                .or(`naam.ilike.%${name}%,stamboomnr.ilike.%${name}%`)
                .limit(1);
            
            if (error || !data || data.length === 0) return null;
            
            const hond = data[0];
            this.hondenCache.set(hond.id, hond);
            if (hond.stamboomnr) {
                this.hondenCache.set(hond.stamboomnr, hond);
            }
            
            if (!this.allHonden.find(d => d.id === hond.id)) {
                this.allHonden.push(hond);
            }
            
            return hond;
        } catch (error) {
            console.error(`❌ Fout bij zoeken hond op naam ${name}:`, error);
            return null;
        }
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        // Initialiseer stamboom module als die nog niet bestaat
        if (!this.stamboomModule) {
            this.stamboomModule = new ReuTeefStamboom(this);
        }
        
        // Laad de stamboom
        await this.stamboomModule.showFuturePuppyPedigree(this.selectedTeef, this.selectedReu);
    }
    
    showAlert(message, type = 'info') {
        document.querySelectorAll('.alert-dismissible').forEach(alert => {
            if (alert.parentNode) {
                alert.remove();
            }
        });
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
    
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
    
    calculateCOI(dogId) {
        // Basis implementatie - wordt overschreven door stamboom module
        return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
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
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${this.escapeHtml(value)}</span>`;
    }
}

// Maak een globale instantie aan
window.reuTeefCombinatie = new ReuTeefCombinatie();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}