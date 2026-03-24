/**
 * Zoek Reu Module - MET DIRECTE DATABASE ZOEKOPDRACHTEN
 * Voor het zoeken naar geschikte reuen voor een teef
 * MET TOM SELECT VOOR DIRECTE DATABASE ZOEKOPDRACHTEN
 */

class ZoekReu {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.selectedTeef = null;
        this.allTeven = [];
        this.allHonden = [];
        this.coiCalculator2 = null;
        this.coiCalculatorReady = false;
        this.stamboomManager = null;
        this.excludeHonden = [];
        this.excludeKennels = [];
        this.excludeHondInputTimer = null;
        this.excludeKennelInputTimer = null;
        this.loadStartTime = null;
        this.batchCount = 0;
        this.totalLoaded = 0;
        this.maxRetries = 3;
        this.retryDelay = 2000;
        
        // Tom Select instances
        this.teefTomSelect = null;
        this.reuTomSelect = null;
        
        // Supabase client
        this.supabase = null;
        
        this.translations = {
            nl: {
                title: "Zoek een Reu",
                description: "Vind een geschikte reu voor uw teef op basis van criteria",
                selectTeef: "Selecteer uw teef",
                selectTeefPlaceholder: "Typ naam, kennel of stamboomnummer...",
                searchCriteria: "Zoekcriteria",
                ras: "Ras",
                anyBreed: "Elk ras",
                bornAfter: "Geboren na",
                bornAfterPlaceholder: "dd-mm-jjjj",
                inteeltCoefficient: "Max COI 6 Generations",
                inteeltPlaceholder: "Max %",
                inteeltHelp: "Maximum COI in % voor combinatie met geselecteerde teef (6 generaties)",
                excludeHondenFilter: "Zonder de volgende honden in de eerste X generaties",
                excludeHondenPlaceholder: "Typ naam of kennel van hond...",
                excludeKennelsFilter: "Zonder de volgende kennelnamen in de eerste X generaties",
                excludeKennelsPlaceholder: "Typ kennelnaam...",
                excludeGenerations: "Aantal generaties",
                excludeGenerationsPlaceholder: "bv. 3",
                excludeHondenLabel: "Uitgesloten honden",
                excludeKennelsLabel: "Uitgesloten kennels",
                removeExclude: "Verwijder",
                healthFilter: "Gezondheid filter",
                heupdysplasie: "Heupdysplasie (HD)",
                patellaluxatie: "Patellaluxatie (PL)",
                ogen: "Ogen",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Elleboogdysplasie (ED)",
                anyHealth: "Niet belangrijk",
                searchButton: "Zoek Reuen",
                results: "Zoekresultaten",
                inDevelopment: "Deze zoekfunctie is momenteel in ontwikkeling",
                devMessage: "De complete zoekfunctionaliteit voor reuen zal binnenkort beschikbaar zijn.",
                features: [
                    "Geavanceerde zoekfilters",
                    "Genetische compatibiliteit matching",
                    "Stamboom analyse",
                    "Gezondheidsscore vergelijking",
                    "Locatie-based zoeken",
                    "Beoordelingen en reviews"
                ],
                back: "Terug",
                noResults: "Geen reuen gevonden die voldoen aan uw criteria",
                tryAgain: "Probeer andere zoekcriteria",
                coiResult: "Combinatie<br>COI 6g",
                coi6Gen: "COI 6 generaties",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Niet getest"],
                    ogen: ["Vrij", "Dist", "Overig", "Niet onderzocht"],
                    dandyWalker: ["Vrij op DNA", "Vrij op ouders", "Drager", "Niet getest"],
                    schildklier: ["Tgaa Negatief", "Niet getest"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Niet getest"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Uitstekend)",
                        "B": "HD-B (Goed)",
                        "C": "HD-C (Matig)",
                        "D": "HD-D (Slecht)",
                        "E": "HD-E (Zeer slecht)"
                    },
                    patellaluxatie: {
                        "0": "0 (Vrij)",
                        "1": "1 (Lichte afwijking)",
                        "2": "2 (Matige afwijking)",
                        "3": "3 (Ernstige afwijking)",
                        "Niet getest": "Niet getest"
                    },
                    ogen: {
                        "Vrij": "Vrij",
                        "Dist": "Distichiasis",
                        "Overig": "Overig",
                        "Niet onderzocht": "Niet onderzocht"
                    },
                    dandyWalker: {
                        "Vrij op DNA": "Vrij op DNA",
                        "Vrij op ouders": "Vrij op ouders",
                        "Drager": "Drager",
                        "Niet getest": "Niet getest"
                    },
                    schildklier: {
                        "Tgaa Negatief": "Tgaa Negatief",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Vrij)",
                        "1": "1 (Lichte afwijking)",
                        "2": "2 (Matige afwijking)",
                        "3": "3 (Ernstige afwijking)",
                        "Niet getest": "Niet getest"
                    }
                },
                resultColumns: {
                    naam: "Naam",
                    geboortedatum: "Geboorte<br>datum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Ogen",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Locatie",
                    coi: "Combinatie<br>COI 6g"
                },
                unknown: "Onbekend",
                notTested: "Niet getest",
                invalidDate: "Ongeldige datum. Gebruik formaat: dd-mm-jjjj",
                invalidCOI: "Ongeldige COI waarde. Gebruik getal tussen 0 en 100",
                noTeefSelected: "Selecteer eerst een teef om COI berekening te gebruiken",
                showPedigree: "Bekijk stamboom",
                pedigreeTooltip: "Klik om de 4-generatie stamboom van deze reu te bekijken",
                calculatingCOI: "COI waarden berekenen...",
                coiCalculationError: "Fout bij COI berekening",
                virtualPuppy: "Virtuele combinatie pup",
                coiCalculationProgress: "Berekent COI voor combinaties...",
                noFemalesFound: "Geen teven gevonden",
                refineSearch: "Typ een andere naam of gebruik spatie om te combineren",
                manualEntry: "Handmatig invullen",
                femalesFound: "Teven gevonden",
                moreResults: "meer... blijf typen om te verfijnen",
                pedigree: "Stamboom",
                breed: "Ras",
                manuallyEnteredFemale: "Handmatig ingevoerde teef",
                coiNotAvailable: "COI berekening is niet beschikbaar voor handmatige invoer",
                selectFemaleToStart: "Selecteer een teef om te beginnen",
                useSearchCriteria: "Gebruik de zoekcriteria om reuen te vinden",
                searchingMales: "Zoeken naar geschikte reuen...",
                pedigreeFunctionalityUnavailable: "Stamboomfunctionaliteit is niet beschikbaar op dit moment",
                maleNotFound: "Kon reu gegevens niet vinden",
                errorShowingPedigree: "Er ging iets mis bij het tonen van de stamboom",
                combinedParents: "Gecombineerde ouders",
                noHondenFound: "Geen honden gevonden",
                hondenFound: "Honden gevonden",
                manuallyEnteredHond: "Handmatig ingevoerde hond",
                noKennelsFound: "Geen kennels gevonden",
                kennelsFound: "Kennels gevonden",
                manuallyEnteredKennel: "Handmatig ingevoerde kennel",
                typeToSearch: "Typ minimaal 2 letters om te zoeken...",
                loading: "Laden...",
                found: "gevonden"
            },
            en: {
                title: "Find a Male",
                description: "Find a suitable male for your female based on criteria",
                selectTeef: "Select your female",
                selectTeefPlaceholder: "Type name, kennel or pedigree number...",
                searchCriteria: "Search Criteria",
                ras: "Breed",
                anyBreed: "Any breed",
                bornAfter: "Born after",
                bornAfterPlaceholder: "dd-mm-yyyy",
                inteeltCoefficient: "Max COI 6 Generations",
                inteeltPlaceholder: "Max %",
                inteeltHelp: "Maximum COI % for combination with selected female (6 generations)",
                excludeHondenFilter: "Exclude the following dogs in the first X generations",
                excludeHondenPlaceholder: "Type name or kennel of dog...",
                excludeKennelsFilter: "Exclude the following kennel names in the first X generations",
                excludeKennelsPlaceholder: "Type kennel name...",
                excludeGenerations: "Number of generations",
                excludeGenerationsPlaceholder: "e.g. 3",
                excludeHondenLabel: "Excluded dogs",
                excludeKennelsLabel: "Excluded kennels",
                removeExclude: "Remove",
                healthFilter: "Health filter",
                heupdysplasie: "Hip Dysplasia (HD)",
                patellaluxatie: "Patellar Luxation (PL)",
                ogen: "Eyes",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Elbow Dysplasia (ED)",
                anyHealth: "Not important",
                searchButton: "Search Males",
                results: "Search Results",
                inDevelopment: "This search function is currently in development",
                devMessage: "The complete search functionality for males will be available soon.",
                features: [
                    "Advanced search filters",
                    "Genetic compatibility matching",
                    "Pedigree analysis",
                    "Health score comparison",
                    "Location-based searching",
                    "Ratings and reviews"
                ],
                back: "Back",
                noResults: "No males found matching your criteria",
                tryAgain: "Try different search criteria",
                coiResult: "Combination<br>COI 6g",
                coi6Gen: "COI 6 generations",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Not tested"],
                    ogen: ["Free", "Dist", "Other", "Not examined"],
                    dandyWalker: ["Free on DNA", "Free on parents", "Carrier", "Not tested"],
                    schildklier: ["Tgaa Negative", "Not tested"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Not tested"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Excellent)",
                        "B": "HD-B (Good)",
                        "C": "HD-C (Moderate)",
                        "D": "HD-D (Poor)",
                        "E": "HD-E (Very poor)"
                    },
                    patellaluxatie: {
                        "0": "0 (Free)",
                        "1": "1 (Mild)",
                        "2": "2 (Moderate)",
                        "3": "3 (Severe)",
                        "Not tested": "Not tested"
                    },
                    ogen: {
                        "Free": "Free",
                        "Dist": "Distichiasis",
                        "Other": "Other",
                        "Not examined": "Not examined"
                    },
                    dandyWalker: {
                        "Free on DNA": "Free on DNA",
                        "Free on parents": "Free on parents",
                        "Carrier": "Carrier",
                        "Not tested": "Not tested"
                    },
                    schildklier: {
                        "Tgaa Negative": "Tgaa Negative",
                        "Not tested": "Not tested"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Free)",
                        "1": "1 (Mild)",
                        "2": "2 (Moderate)",
                        "3": "3 (Severe)",
                        "Not tested": "Not tested"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    geboortedatum: "Birth<br>Date",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Eyes",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Location",
                    coi: "Combination<br>COI 6g"
                },
                unknown: "Unknown",
                notTested: "Not tested",
                invalidDate: "Invalid date. Use format: dd-mm-yyyy",
                invalidCOI: "Invalid COI value. Use number between 0 and 100",
                noTeefSelected: "Select a female first to use COI calculation",
                showPedigree: "View pedigree",
                pedigreeTooltip: "Click to view the 4-generation pedigree of this male",
                calculatingCOI: "Calculating COI values...",
                coiCalculationError: "Error calculating COI",
                virtualPuppy: "Virtual combination puppy",
                coiCalculationProgress: "Calculating COI for combinations...",
                noFemalesFound: "No females found",
                refineSearch: "Type a different name or use space to combine",
                manualEntry: "Manual entry",
                femalesFound: "Females found",
                moreResults: "more... keep typing to refine",
                pedigree: "Pedigree",
                breed: "Breed",
                manuallyEnteredFemale: "Manually entered female",
                coiNotAvailable: "COI calculation is not available for manual entry",
                selectFemaleToStart: "Select a female to start",
                useSearchCriteria: "Use search criteria to find males",
                searchingMales: "Searching for suitable males...",
                pedigreeFunctionalityUnavailable: "Pedigree functionality is not available at this time",
                maleNotFound: "Could not find male data",
                errorShowingPedigree: "Something went wrong while showing the pedigree",
                combinedParents: "Combined parents",
                noHondenFound: "No dogs found",
                hondenFound: "Dogs found",
                manuallyEnteredHond: "Manually entered dog",
                noKennelsFound: "No kennels found",
                kennelsFound: "Kennels found",
                manuallyEnteredKennel: "Manually entered kennel",
                typeToSearch: "Type at least 2 characters to search...",
                loading: "Loading...",
                found: "found"
            },
            de: {
                title: "Finde einen Rüden",
                description: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                selectTeef: "Wählen Sie Ihre Hündin",
                selectTeefPlaceholder: "Name, Zwingername oder Stammbaumnummer eingeben...",
                searchCriteria: "Suchkriterien",
                ras: "Rasse",
                anyBreed: "Jede Rasse",
                bornAfter: "Geboren nach",
                bornAfterPlaceholder: "dd-mm-jjjj",
                inteeltCoefficient: "Max COI 6 Generationen",
                inteeltPlaceholder: "Max %",
                inteeltHelp: "Maximaler COI in % für Kombination mit ausgewählter Hündin (6 Generationen)",
                excludeHondenFilter: "Ohne die folgenden Hunde in den ersten X Generationen",
                excludeHondenPlaceholder: "Name oder Zwinger des Hundes eingeben...",
                excludeKennelsFilter: "Ohne die folgenden Zwinger-Namen in den ersten X Generationen",
                excludeKennelsPlaceholder: "Zwinger-Name eingeben...",
                excludeGenerations: "Anzahl Generationen",
                excludeGenerationsPlaceholder: "z.B. 3",
                excludeHondenLabel: "Ausgeschlossene Hunde",
                excludeKennelsLabel: "Ausgeschlossene Zwinger",
                removeExclude: "Entfernen",
                healthFilter: "Gesundheitsfilter",
                heupdysplasie: "Hüftgelenksdysplasie (HD)",
                patellaluxatie: "Patellaluxation (PL)",
                ogen: "Augen",
                dandyWalker: "Dandy Walker",
                schildklier: "Tgaa",
                elleboogdysplasie: "Ellbogengelenksdysplasie (ED)",
                anyHealth: "Nicht wichtig",
                searchButton: "Rüden suchen",
                results: "Suchergebnisse",
                inDevelopment: "Diese Suchfunktion ist derzeit in Entwicklung",
                devMessage: "Die vollständige Suchfunktionalität für Rüden wird demnächst verfügbar sein.",
                features: [
                    "Erweiterde Suchfilter",
                    "Genetische Kompatibilitätsprüfung",
                    "Stammbaumanalyse",
                    "Gezundheitswertvergleich",
                    "Standortbasierte Suche",
                    "Bewertungen und Erfahrungsberichte"
                ],
                back: "Zurück",
                noResults: "Keine Rüden gefonden, die Ihren Kriterien entsprechen",
                tryAgain: "Versuchen Sie andere Suchkriterien",
                coiResult: "Kombination<br>COI 6g",
                coi6Gen: "COI 6 Generationen",
                healthOptions: {
                    heupdysplasie: ["A", "B", "C", "D", "E"],
                    patellaluxatie: ["0", "1", "2", "3", "Niet getestet"],
                    ogen: ["Frei", "Dist", "Andere", "Niet untersucht"],
                    dandyWalker: ["Frei auf DNA", "Frei op ouders", "Träger", "Niet getest"],
                    schildklier: ["Tgaa Negativ", "Niet getest"],
                    elleboogdysplasie: ["0", "1", "2", "3", "Niet getest"]
                },
                healthLabels: {
                    heupdysplasie: {
                        "A": "HD-A (Ausgezeichnet)",
                        "B": "HD-B (Gut)",
                        "C": "HD-C (Mäßig)",
                        "D": "HD-D (Schlecht)",
                        "E": "HD-E (Sehr schlecht)"
                    },
                    patellaluxatie: {
                        "0": "0 (Frei)",
                        "1": "1 (Leicht)",
                        "2": "2 (Mäßig)",
                        "3": "3 (Schwer)",
                        "Niet getestet": "Niet getestet"
                    },
                    ogen: {
                        "Frei": "Frei",
                        "Dist": "Distichiasis",
                        "Andere": "Andere",
                        "Niet untersucht": "Niet untersucht"
                    },
                    dandyWalker: {
                        "Frei auf DNA": "Frei auf DNA",
                        "Frei op ouders": "Frei op ouders",
                        "Träger": "Träger",
                        "Niet getest": "Niet getest"
                    },
                    schildklier: {
                        "Tgaa Negativ": "Tgaa Negativ",
                        "Niet getest": "Niet getest"
                    },
                    elleboogdysplasie: {
                        "0": "0 (Frij)",
                        "1": "1 (Leicht)",
                        "2": "2 (Mäßig)",
                        "3": "3 (Schwer)",
                        "Niet getest": "Niet getest"
                    }
                },
                resultColumns: {
                    naam: "Name",
                    geboortedatum: "Geburts<br>datum",
                    hd: "HD",
                    pl: "PL",
                    ogen: "Augen",
                    dw: "Dandy<br>Walker",
                    schildklier: "Tgaa",
                    ed: "ED",
                    locatie: "Standort",
                    coi: "Kombination<br>COI 6g"
                },
                unknown: "Unbekannt",
                notTested: "Niet getestet",
                invalidDate: "Ungültiges Datum. Format: dd-mm-jjjj",
                invalidCOI: "Ungültiger COI-Wert. Verwenden Sie eine Zahl tussen 0 en 100",
                noTeefSelected: "Wählen Sie zuerst eine Hündin, um die COI-Berechnung zu verwenden",
                showPedigree: "Stammbaum anzeigen",
                pedigreeTooltip: "Klicken, um den 4-Generationen-Stammbaum dieses Rüden anzuzeigen",
                calculatingCOI: "COI-Werte worden berechnet...",
                coiCalculationError: "Fehler bei COI-Berechnung",
                virtualPuppy: "Virtuelle Kombination Welpe",
                coiCalculationProgress: "Berechne COI für Kombinationen...",
                noFemalesFound: "Keine Hündinnen gefonden",
                refineSearch: "Geben Sie einen anderen Namen ein oder verwenden Sie Leerzeichen zum Kombinieren",
                manualEntry: "Manuele Eingabe",
                femalesFound: "Hündinnen gefonden",
                moreResults: "weitere... weiter tippen zum Verfeinern",
                pedigree: "Stamboom",
                breed: "Rasse",
                manuallyEnteredFemale: "Manuell eingegebene Hündin",
                coiNotAvailable: "COI-Berechnung ist für manuele Eingaben niet verfügbar",
                selectFemaleToStart: "Wählen Sie eine Hündin, um zu beginnen",
                useSearchCriteria: "Verwenden Sie Suchkriterien, um Rüden zu finden",
                searchingMales: "Suche nach geeigneten Rüden...",
                pedigreeFunctionalityUnavailable: "Stamboomfunktionaliteit ist derzeit nicht verfügbar",
                maleNotFound: "Konnte Rüdendaten nicht finden",
                errorShowingPedigree: "Beim Anzeigen des Stamboons is een Fehler aufgetreten",
                combinedParents: "Kombinierte Eltern",
                noHondenFound: "Keine Hunde gefunden",
                hondenFound: "Hunde gefunden",
                manuallyEnteredHond: "Manuell eingegebener Hund",
                noKennelsFound: "Keine Zwinger gefunden",
                kennelsFound: "Zwinger gefonden",
                manuallyEnteredKennel: "Manuell eingegebener Zwinger",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                loading: "Laden...",
                found: "gefunden"
            }
        };
    }
    
    async injectDependencies(db, auth, stamboomManager = null) {
        console.log('🔧 ZoekReu: injectDependencies aangeroepen');
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
        
        // Zorg dat supabase beschikbaar is
        this.getSupabase();
        
        console.log('📥 ZoekReu: Gaat honden laden voor COI...');
        await this.loadAllHondenForCOI();
        await this.initCOICalculator();
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
     * Haal alle honden op voor COI berekeningen (wordt eenmalig geladen)
     */
    async loadAllHondenForCOI() {
        try {
            console.log('📥 ZoekReu.loadAllHondenForCOI() gestart');
            this.loadStartTime = Date.now();
            
            let allDogs = [];
            const supabase = this.getSupabase();
            
            if (supabase) {
                console.log('🔄 Via Supabase paginatie');
                allDogs = await this.loadSupabaseWithImprovedPagination();
            } else if (this.db && typeof this.db.getAllHonden === 'function') {
                console.log('🔄 Via db.getAllHonden()');
                try {
                    allDogs = await this.db.getAllHonden();
                    console.log(`✅ db.getAllHonden(): ${allDogs.length} honden`);
                } catch (error) {
                    console.error('❌ Fout bij db.getAllHonden():', error);
                }
            }
            
            if (allDogs.length === 0) {
                console.log('🔄 Fallback via hondenService');
                allDogs = await this.loadViaHondenService();
            }
            
            if (allDogs.length === 0) {
                console.error('❌ Geen honden geladen!');
                this.allHonden = [];
                return;
            }
            
            console.log(`✅ TOTAAL ${allDogs.length} honden geladen in ${Date.now() - this.loadStartTime}ms`);
            
            this.allHonden = allDogs.map(hond => ({
                ...hond,
                id: Number(hond.id),
                heupdysplasie: hond.heupdysplasie || '',
                elleboogdysplasie: hond.elleboogdysplasie || '',
                patella: hond.patella || '',
                ogen: hond.ogen || '',
                ogenverklaring: hond.ogenVerklaring || '',
                dandyWalker: hond.dandyWalker || '',
                schildklier: hond.schildklier || '',
                schildklierverklaring: hond.schildklierVerklaring || '',
                vachtkleur: hond.vachtkleur || '',
                ras: hond.ras || '',
                geboortedatum: hond.geboortedatum || '',
                stamboomnr: hond.stamboomnr || '',
                kennelnaam: hond.kennelnaam || '',
                geslacht: hond.geslacht || '',
                land: hond.land || '',
                postcode: hond.postcode || '',
                vader_id: hond.vader_id ? Number(hond.vader_id) : null,
                moeder_id: hond.moeder_id ? Number(hond.moeder_id) : null,
                vader: hond.vader || '',
                moeder: hond.moeder || '',
                ik: hond.ik || null
            }));
            
            console.log(`✅ Database samenvatting: ${this.allHonden.length} honden geladen`);
            
        } catch (error) {
            console.error('❌ FATALE FOUT in loadAllHondenForCOI():', error);
            this.allHonden = [];
        }
    }
    
    async loadSupabaseWithImprovedPagination() {
        try {
            console.log('📄 Verbeterde Supabase paginatie gestart...');
            
            const supabase = this.getSupabase();
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return [];
            }
            
            let allDogs = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;
            
            while (hasMore) {
                try {
                    const from = page * pageSize;
                    const to = from + pageSize - 1;
                    
                    console.log(`📄 Laad batch ${page + 1} (${from} - ${to})...`);
                    
                    const { data, error } = await supabase
                        .from('honden')
                        .select('*')
                        .order('id', { ascending: true })
                        .range(from, to);
                    
                    if (error) {
                        console.error(`❌ Supabase error bij batch ${page}:`, error);
                        throw error;
                    }
                    
                    if (data && data.length > 0) {
                        allDogs = allDogs.concat(data);
                        console.log(`   ✅ Batch ${page + 1}: ${data.length} honden (totaal: ${allDogs.length})`);
                        
                        if (data.length < pageSize) {
                            hasMore = false;
                        } else {
                            page++;
                        }
                    } else {
                        hasMore = false;
                    }
                    
                } catch (batchError) {
                    console.error(`❌ Fout bij laden batch ${page}:`, batchError);
                    
                    let retryCount = 0;
                    let retrySuccess = false;
                    
                    while (retryCount < this.maxRetries && !retrySuccess) {
                        retryCount++;
                        console.log(`🔄 Poging ${retryCount}/${this.maxRetries} opnieuw laden batch ${page}...`);
                        
                        await new Promise(resolve => setTimeout(resolve, this.retryDelay * retryCount));
                        
                        try {
                            const from = page * pageSize;
                            const to = from + pageSize - 1;
                            
                            const { data, error } = await supabase
                                .from('honden')
                                .select('*')
                                .order('id', { ascending: true })
                                .range(from, to);
                            
                            if (!error && data && data.length > 0) {
                                allDogs = allDogs.concat(data);
                                console.log(`   ✅ Batch ${page} herladen: ${data.length} honden`);
                                retrySuccess = true;
                                if (data.length < pageSize) {
                                    hasMore = false;
                                } else {
                                    page++;
                                }
                            }
                        } catch (retryError) {
                            console.error(`❌ Poging ${retryCount} mislukt:`, retryError);
                        }
                    }
                    
                    if (!retrySuccess) {
                        console.error(`❌ Batch ${page} kon niet geladen worden na ${this.maxRetries} pogingen`);
                        hasMore = false;
                    }
                }
            }
            
            console.log(`✅ Supabase paginatie voltooid: ${allDogs.length} honden geladen`);
            return allDogs;
            
        } catch (error) {
            console.error('❌ Fout bij verbeterde Supabase paginatie:', error);
            return [];
        }
    }
    
    async loadViaHondenService() {
        try {
            console.log('🔄 Probeer via hondenService...');
            
            let hondenResult = null;
            
            if (window.hondenService && typeof window.hondenService.getHonden === 'function') {
                console.log('   ➡ Via window.hondenService.getHonden()');
                hondenResult = await window.hondenService.getHonden();
            } 
            else if (this.db && typeof this.db.getHonden === 'function') {
                console.log('   ➡ Via this.db.getHonden()');
                hondenResult = await this.db.getHonden();
            }
            else if (window.db && typeof window.db.getHonden === 'function') {
                console.log('   ➡ Via window.db.getHonden()');
                hondenResult = await window.db.getHonden();
            }
            
            if (!hondenResult) {
                console.log('   ❌ Geen honden service gevonden');
                return [];
            }
            
            let hondenArray = [];
            
            if (Array.isArray(hondenResult)) {
                hondenArray = hondenResult;
            } else if (hondenResult && Array.isArray(hondenResult.honden)) {
                hondenArray = hondenResult.honden;
            } else if (hondenResult && Array.isArray(hondenResult.data)) {
                hondenArray = hondenResult.data;
            } else {
                console.error('❌ Onbekend resultaat formaat:', hondenResult);
                return [];
            }
            
            console.log(`✅ Via service geladen: ${hondenArray.length} honden`);
            return hondenArray;
            
        } catch (error) {
            console.error('❌ Fout bij laden via service:', error);
            return [];
        }
    }
    
    async initCOICalculator() {
        try {
            if (typeof COICalculator2 === 'undefined') {
                console.error('❌ COICalculator2 klasse niet gevonden!');
                this.coiCalculatorReady = false;
                return false;
            }
            
            console.log('🔄 Initialiseer COICalculator2 voor ZoekReu...');
            console.log(`   Aantal honden voor COI: ${this.allHonden.length}`);
            
            if (this.allHonden.length === 0) {
                console.error('❌ Geen honden beschikbaar voor COI berekening!');
                this.coiCalculatorReady = false;
                return false;
            }
            
            this.coiCalculator2 = new COICalculator2(this.allHonden);
            this.coiCalculatorReady = true;
            
            console.log('✅ COICalculator2 succesvol geïnitialiseerd');
            
            return true;
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren COICalculator2:', error);
            this.coiCalculatorReady = false;
            return false;
        }
    }
    
    async calculateComboCOI(teefId, reuId) {
        if (!this.coiCalculator2 || !teefId || !reuId || teefId === 'manual') {
            console.log(`⚠️ COI calculator niet beschikbaar of ongeldige IDs: ${teefId} x ${reuId}`);
            return '0.000';
        }
        
        try {
            console.log(`🔬 Bereken combinatie COI voor teef ${teefId} × reu ${reuId}`);
            
            const teef = this.allHonden.find(h => h.id == teefId);
            const reu = this.allHonden.find(h => h.id == reuId);
            
            if (!teef || !reu) {
                console.error('❌ Teef of reu niet gevonden in database');
                return '0.000';
            }
            
            const futurePuppy = {
                id: -Date.now(),
                naam: this.t('virtualPuppy'),
                geslacht: 'onbekend',
                vader_id: reu.id,
                moeder_id: teef.id,
                vader: reu.naam,
                moeder: teef.naam,
                kennelnaam: this.t('combinedParents'),
                stamboomnr: 'VOORSPELD-' + Date.now(),
                geboortedatum: new Date().toISOString().split('T')[0],
                vachtkleur: `${reu.vachtkleur || ''}/${teef.vachtkleur || ''}`.trim(),
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
            
            const tempHonden = [...this.allHonden, futurePuppy];
            const tempCOICalculator = new COICalculator2(tempHonden);
            
            const coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
            
            console.log(`✅ Combinatie COI (6g) voor ${teef.naam} × ${reu.naam}: ${coiResult}%`);
            
            return coiResult;
            
        } catch (error) {
            console.error('❌ Fout bij combinatie COI berekening:', error);
            return '0.000';
        }
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Haal honden op met filter op geslacht voor Tom Select
     * DIRECTE DATABASE ZOEKOPDRACHT
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
     * Haal een hond op via database
     */
    async getHondById(id) {
        if (!id || id === 0) return null;
        
        try {
            const supabase = this.getSupabase();
            if (!supabase) return null;
            
            const { data: hond, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error || !hond) return null;
            
            return hond;
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${id}:`, error);
            return null;
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
    async initTeefTomSelect(initialValue = null) {
        if (typeof window.TomSelect === 'undefined') {
            await this.loadTomSelect();
        }
        
        const selectElement = document.getElementById('teefSelect');
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
                
                if (this.teefSearchTimeout) {
                    clearTimeout(this.teefSearchTimeout);
                }
                
                this.teefSearchTimeout = setTimeout(async () => {
                    console.log('🔍 Zoeken naar teef:', query);
                    const result = await this.getDogsByGender('teven', query, 1, 100);
                    
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
                    this.getHondById(parseInt(value)).then(hond => {
                        if (hond) this.selectTeef(hond);
                    });
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
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) {
            console.error('❌ content element niet gevonden!');
            return;
        }
        
        console.log('📋 ZoekReu.loadContent() gestart');
        
        // Reset geselecteerde teef
        this.selectedTeef = null;
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('selectTeef')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('selectTeef')}
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectTeef')}</label>
                                <select id="teefSelect" class="form-control" placeholder="${t('typeToSearch')}">
                                    <option value="">${t('typeToSearch')}</option>
                                </select>
                                <small class="text-muted d-block mt-2">${t('typeToSearch')}</small>
                            </div>
                            
                            <div id="selectedTeefInfo" class="mt-3">
                                <div class="text-muted text-center">
                                    <i class="bi bi-gender-female"></i>
                                    <p class="mb-0 mt-2">${t('selectFemaleToStart')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('searchCriteria')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">${t('ras')}</label>
                                    <select class="form-select" id="rasFilter">
                                        <option value="">${t('anyBreed')}</option>
                                    </select>
                                </div>
                                
                                <div class="col-12">
                                    <div class="row g-3 align-items-end">
                                        <div class="col-md-6">
                                            <label class="form-label">${t('bornAfter')}</label>
                                            <input type="text" 
                                                   class="form-control" 
                                                   id="bornAfterFilter" 
                                                   placeholder="${t('bornAfterPlaceholder')}"
                                                   pattern="\\d{2}-\\d{2}-\\d{4}"
                                                   title="${t('bornAfterPlaceholder')}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">${t('inteeltCoefficient')}</label>
                                            <div class="input-group">
                                                <input type="number" 
                                                       class="form-control" 
                                                       id="coiFilter" 
                                                       placeholder="${t('inteeltPlaceholder')}"
                                                       min="0" 
                                                       max="100"
                                                       step="0.1"
                                                       style="width: 80px;">
                                                <span class="input-group-text">%</span>
                                            </div>
                                            <small class="text-muted">${t('inteeltHelp')}</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-12 mt-3">
                                    <label class="form-label">${t('excludeHondenFilter')}</label>
                                    <div class="row g-3 align-items-end">
                                        <div class="col-md-8">
                                            <div class="position-relative">
                                                <input type="text" 
                                                       class="form-control" 
                                                       id="excludeHondSearch" 
                                                       placeholder="${t('excludeHondenPlaceholder')}"
                                                       autocomplete="off">
                                                <div class="autocomplete-dropdown" id="excludeHondDropdown" style="display: none;">
                                                    <div class="autocomplete-header">
                                                        <small class="text-muted">${t('hondenFound')}: <span id="excludeHondCount">0</span></small>
                                                    </div>
                                                    <div class="autocomplete-results" id="excludeHondResults"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <input type="number" 
                                                   class="form-control" 
                                                   id="excludeGenerations" 
                                                   placeholder="${t('excludeGenerationsPlaceholder')}"
                                                   min="1" 
                                                   max="6"
                                                   value="3">
                                        </div>
                                    </div>
                                    
                                    <div id="excludedHondenList" class="mt-3">
                                        ${this.generateExcludedHondenList()}
                                    </div>
                                </div>
                                
                                <div class="col-12 mt-3">
                                    <label class="form-label">${t('excludeKennelsFilter')}</label>
                                    <div class="row g-3 align-items-end">
                                        <div class="col-md-8">
                                            <div class="position-relative">
                                                <input type="text" 
                                                       class="form-control" 
                                                       id="excludeKennelSearch" 
                                                       placeholder="${t('excludeKennelsPlaceholder')}"
                                                       autocomplete="off">
                                                <div class="autocomplete-dropdown" id="excludeKennelDropdown" style="display: none;">
                                                    <div class="autocomplete-header">
                                                        <small class="text-muted">${t('kennelsFound')}: <span id="excludeKennelCount">0</span></small>
                                                    </div>
                                                    <div class="autocomplete-results" id="excludeKennelResults"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <input type="number" 
                                                   class="form-control" 
                                                   id="excludeKennelGenerations" 
                                                   placeholder="${t('excludeGenerationsPlaceholder')}"
                                                   min="1" 
                                                   max="6"
                                                   value="3">
                                        </div>
                                    </div>
                                    
                                    <div id="excludedKennelsList" class="mt-3">
                                        ${this.generateExcludedKennelsList()}
                                    </div>
                                </div>
                                
                                <div class="col-12">
                                    <h6 class="mt-4 mb-3">${t('healthFilter')}</h6>
                                    <div class="row g-3" id="healthFiltersContainer">
                                        ${this.generateHealthFilters(t)}
                                    </div>
                                </div>
                                
                                <div class="col-12 mt-3">
                                    <button class="btn btn-purple w-100" id="searchButton">
                                        <i class="bi bi-search"></i> ${t('searchButton')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <h6 class="mb-0">${t('results')}</h6>
                </div>
                <div class="card-body">
                    <div id="searchResults" class="text-center py-4">
                        <div class="text-muted">
                            <i class="bi bi-search" style="font-size: 2rem;"></i>
                            <p class="mt-2">${t('useSearchCriteria')}</p>
                            ${this.coiCalculatorReady ? 
                                '<br><small><i class="bi bi-check-circle text-success"></i> COI berekeningen actief</small>' : 
                                '<br><small><i class="bi bi-exclamation-triangle text-warning"></i> COI berekeningen niet beschikbaar</small>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Laad rassen dynamisch uit database
        await this.loadBreedsFromDatabase();
        
        // Initialiseer Tom Select voor teef
        await this.initTeefTomSelect();
        
        // Initialiseer overige functionaliteit
        this.initializeExcludeHondSearch();
        this.initializeExcludeKennelSearch();
        this.initializeFormValidation();
        this.initializeSearchButton();
        this.addStyles();
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
        `;
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
    }
    
    async loadBreedsFromDatabase() {
        try {
            const supabase = this.getSupabase();
            if (!supabase) return;
            
            const { data, error } = await supabase
                .from('honden')
                .select('ras')
                .not('ras', 'is', null)
                .neq('ras', '');
            
            if (error) {
                console.error('❌ Fout bij laden rassen:', error);
                return;
            }
            
            const rassen = [...new Set(data.map(h => h.ras).filter(Boolean))].sort();
            const rasSelect = document.getElementById('rasFilter');
            
            if (rasSelect && rassen.length > 0) {
                rassen.forEach(ras => {
                    const option = document.createElement('option');
                    option.value = ras;
                    option.textContent = ras;
                    rasSelect.appendChild(option);
                });
                console.log(`✅ ${rassen.length} rassen geladen`);
            }
        } catch (error) {
            console.error('❌ Fout bij laden rassen:', error);
        }
    }
    
    addStyles() {
        if (!document.querySelector('#zoekreu-styles')) {
            const style = document.createElement('style');
            style.id = 'zoekreu-styles';
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
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    max-height: 800px;
                    height: auto;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 0.375rem;
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                    z-index: 1050;
                }
                
                .autocomplete-header {
                    padding: 0.5rem 1rem;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    font-size: 0.875rem;
                }
                
                .autocomplete-results {
                    max-height: 350px;
                    overflow-y: auto;
                }
                
                .autocomplete-item {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    border-bottom: 1px solid #f8f9fa;
                    transition: background-color 0.2s;
                }
                
                .autocomplete-item:hover,
                .autocomplete-item:focus {
                    background-color: #f8f9fa;
                    outline: none;
                }
                
                .autocomplete-item:last-child {
                    border-bottom: none;
                }
                
                .autocomplete-item mark {
                    background-color: #fff3cd;
                    padding: 0;
                    font-weight: bold;
                }
                
                .text-success { color: #198754 !important; }
                .text-warning { color: #ffc107 !important; }
                .text-danger { color: #dc3545 !important; }
                .text-orange { color: #fd7e14 !important; }
                .text-muted { color: #6c757d !important; }
                .text-secondary { color: #6c757d !important; }
                
                .table-sm th, .table-sm td {
                    padding: 0.2rem 0.3rem;
                    font-size: 0.8rem;
                    vertical-align: middle;
                }
                
                .table th {
                    white-space: nowrap;
                    font-weight: 600;
                    background-color: #f8f9fa;
                }
                
                .table th.text-center {
                    text-align: center;
                }
                
                .table td.text-center {
                    text-align: center;
                }
                
                .table .small {
                    font-size: 0.75rem;
                    line-height: 1.2;
                }
                
                .reu-name-link {
                    color: #0d6efd !important;
                    font-weight: bold !important;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    display: inline-block;
                    padding: 2px 4px;
                    border-radius: 3px;
                }
                
                .reu-name-link:hover {
                    color: #0a58ca !important;
                    text-decoration: underline !important;
                    background-color: #f0f7ff;
                    transform: translateY(-1px);
                }
                
                .reu-name-link:active {
                    transform: translateY(0);
                }
                
                .reu-name-cell {
                    position: relative;
                }
                
                .reu-name-link[title]:hover::after {
                    content: attr(title);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #333;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    z-index: 1000;
                    margin-bottom: 5px;
                    opacity: 0.9;
                }
                
                #excludedHondenList .list-group-item {
                    padding: 0.5rem 1rem;
                    border-left: 3px solid #dc3545;
                }
                
                #excludedKennelsList .list-group-item {
                    padding: 0.5rem 1rem;
                    border-left: 3px solid #ffc107;
                }
                
                .position-relative {
                    position: relative;
                }
                
                .card-body {
                    overflow: visible !important;
                }
                
                .row.g-4 > .col-md-4,
                .row.g-4 > .col-md-8 {
                    overflow: visible !important;
                }
                
                .card {
                    overflow: visible !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initializeExcludeHondSearch() {
        const excludeHondSearch = document.getElementById('excludeHondSearch');
        const excludeHondDropdown = document.getElementById('excludeHondDropdown');
        
        if (!excludeHondSearch) return;
        
        excludeHondSearch.addEventListener('input', (e) => {
            clearTimeout(this.excludeHondInputTimer);
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length === 0) {
                excludeHondDropdown.style.display = 'none';
                return;
            }
            
            this.excludeHondInputTimer = setTimeout(() => {
                this.searchExcludeHonden(searchTerm);
            }, 150);
        });
        
        excludeHondSearch.addEventListener('focus', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 0) {
                this.searchExcludeHonden(searchTerm);
            }
        });
        
        excludeHondSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = excludeHondSearch.value.trim();
                if (searchTerm.length > 0) {
                    this.handleManualExcludeHondEntry(searchTerm);
                }
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = excludeHondDropdown.querySelector('.autocomplete-item[data-id]');
                if (firstItem) {
                    firstItem.focus();
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!excludeHondDropdown.contains(e.target) && e.target.id !== 'excludeHondSearch') {
                excludeHondDropdown.style.display = 'none';
            }
        });
    }
    
    initializeExcludeKennelSearch() {
        const excludeKennelSearch = document.getElementById('excludeKennelSearch');
        const excludeKennelDropdown = document.getElementById('excludeKennelDropdown');
        
        if (!excludeKennelSearch) return;
        
        excludeKennelSearch.addEventListener('input', (e) => {
            clearTimeout(this.excludeKennelInputTimer);
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length === 0) {
                excludeKennelDropdown.style.display = 'none';
                return;
            }
            
            this.excludeKennelInputTimer = setTimeout(() => {
                this.searchExcludeKennels(searchTerm);
            }, 150);
        });
        
        excludeKennelSearch.addEventListener('focus', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 0) {
                this.searchExcludeKennels(searchTerm);
            }
        });
        
        excludeKennelSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = excludeKennelSearch.value.trim();
                if (searchTerm.length > 0) {
                    this.handleManualExcludeKennelEntry(searchTerm);
                }
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = excludeKennelDropdown.querySelector('.autocomplete-item[data-id]');
                if (firstItem) {
                    firstItem.focus();
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!excludeKennelDropdown.contains(e.target) && e.target.id !== 'excludeKennelSearch') {
                excludeKennelDropdown.style.display = 'none';
            }
        });
    }
    
    initializeFormValidation() {
        const bornAfterInput = document.getElementById('bornAfterFilter');
        if (bornAfterInput) {
            bornAfterInput.addEventListener('blur', (e) => {
                this.validateDateInput(e.target);
            });
            
            bornAfterInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value.length > 2 && value.length <= 4) {
                    value = value.substring(0, 2) + '-' + value.substring(2);
                } else if (value.length > 4) {
                    value = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(4, 8);
                }
                e.target.value = value;
            });
        }
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput) {
            coiInput.addEventListener('blur', (e) => {
                this.validateCOIInput(e.target);
            });
        }
    }
    
    initializeSearchButton() {
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch();
            });
        }
    }
    
    async searchExcludeHonden(searchTerm) {
        const t = this.t.bind(this);
        
        if (!searchTerm || searchTerm.length === 0) {
            document.getElementById('excludeHondDropdown').style.display = 'none';
            return;
        }
        
        // Zoek direct in de database
        const supabase = this.getSupabase();
        if (!supabase) {
            console.error('❌ Geen Supabase client');
            return;
        }
        
        try {
            const searchTerms = searchTerm.toLowerCase().split(' ');
            
            let query = supabase
                .from('honden')
                .select('*')
                .limit(20);
            
            searchTerms.forEach(term => {
                query = query.or(`naam.ilike.%${term}%,kennelnaam.ilike.%${term}%,stamboomnr.ilike.%${term}%`);
            });
            
            const { data, error } = await query;
            
            if (error) {
                console.error('❌ Fout bij zoeken honden:', error);
                return;
            }
            
            const filteredHonden = (data || []).filter(hond => 
                !this.excludeHonden.some(excluded => excluded.id === hond.id)
            );
            
            this.showExcludeHondDropdown(filteredHonden, searchTerm);
            
        } catch (error) {
            console.error('❌ Fout bij zoeken honden:', error);
        }
    }
    
    showExcludeHondDropdown(honden, searchTerm) {
        const t = this.t.bind(this);
        const dropdown = document.getElementById('excludeHondDropdown');
        const resultsDiv = document.getElementById('excludeHondResults');
        const countSpan = document.getElementById('excludeHondCount');
        
        if (!dropdown || !resultsDiv || !countSpan) return;
        
        if (honden.length === 0) {
            resultsDiv.innerHTML = `
                <div class="autocomplete-item text-muted p-3 text-center">
                    <i class="bi bi-search me-2"></i>${t('noHondenFound')}
                    <br>
                    <small>${t('refineSearch')}</small>
                </div>
                <div class="autocomplete-item" data-manual="${searchTerm}">
                    <div class="fw-bold text-primary">
                        <i class="bi bi-plus-circle me-2"></i>${t('manualEntry')}
                    </div>
                    <div class="small text-muted">
                        "${searchTerm}"
                    </div>
                </div>
            `;
            countSpan.textContent = '0';
            dropdown.style.display = 'block';
        } else {
            countSpan.textContent = honden.length;
            
            const displayHonden = honden.slice(0, 15);
            
            resultsDiv.innerHTML = displayHonden.map(hond => {
                const highlightText = (text) => {
                    if (!text || !searchTerm) return text || '';
                    const lowerText = text.toLowerCase();
                    const lowerSearch = searchTerm.toLowerCase();
                    const index = lowerText.indexOf(lowerSearch);
                    
                    if (index === -1) return text;
                    
                    return text.substring(0, index) + 
                           '<mark>' + text.substring(index, index + searchTerm.length) + '</mark>' + 
                           text.substring(index + searchTerm.length);
                };
                
                const geslachtIcon = hond.geslacht === 'reuen' ? 
                    '<i class="bi bi-gender-male text-primary me-1"></i>' : 
                    hond.geslacht === 'teven' ? 
                    '<i class="bi bi-gender-female text-danger me-1"></i>' : '';
                
                const displayName = hond.naam ? 
                    `${geslachtIcon}${highlightText(hond.naam)} ${hond.kennelnaam ? `${highlightText(hond.kennelnaam)}` : ''}` : 
                    t('unknown');
                
                return `
                    <div class="autocomplete-item" data-id="${hond.id}" tabindex="0">
                        <div class="fw-bold">${displayName}</div>
                        <div class="small text-muted">
                            ${hond.stamboomnr ? t('pedigree') + ': ' + hond.stamboomnr : ''}
                            ${hond.ras ? ' • ' + t('breed') + ': ' + hond.ras : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            if (honden.length > 15) {
                resultsDiv.innerHTML += `
                    <div class="autocomplete-item text-muted p-2 text-center">
                        <small>${t('moreResults').replace('meer...', `En nog ${honden.length - 15} ${t('moreResults')}`)}</small>
                    </div>
                `;
            }
            
            dropdown.style.display = 'block';
        }
        
        resultsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const hondId = item.getAttribute('data-id');
                const manualEntry = item.getAttribute('data-manual');
                
                if (hondId) {
                    this.addExcludeHond(hondId);
                } else if (manualEntry) {
                    this.handleManualExcludeHondEntry(manualEntry);
                }
                
                dropdown.style.display = 'none';
                document.getElementById('excludeHondSearch').value = '';
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    item.click();
                }
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = item.nextElementSibling;
                    if (next && next.classList.contains('autocomplete-item')) {
                        next.focus();
                    }
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = item.previousElementSibling;
                    if (prev && prev.classList.contains('autocomplete-item')) {
                        prev.focus();
                    } else {
                        document.getElementById('excludeHondSearch').focus();
                    }
                }
            });
        });
    }
    
    async searchExcludeKennels(searchTerm) {
        const t = this.t.bind(this);
        
        if (!searchTerm || searchTerm.length === 0) {
            document.getElementById('excludeKennelDropdown').style.display = 'none';
            return;
        }
        
        // Zoek direct in de database
        const supabase = this.getSupabase();
        if (!supabase) {
            console.error('❌ Geen Supabase client');
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('honden')
                .select('kennelnaam')
                .ilike('kennelnaam', `%${searchTerm}%`)
                .not('kennelnaam', 'is', null)
                .neq('kennelnaam', '')
                .limit(50);
            
            if (error) {
                console.error('❌ Fout bij zoeken kennels:', error);
                return;
            }
            
            const kennels = [...new Set((data || []).map(h => h.kennelnaam))].sort();
            
            const filteredKennels = kennels.filter(kennel => 
                !this.excludeKennels.some(excluded => 
                    excluded.kennelnaam.toLowerCase() === kennel.toLowerCase()
                )
            );
            
            this.showExcludeKennelDropdown(filteredKennels, searchTerm);
            
        } catch (error) {
            console.error('❌ Fout bij zoeken kennels:', error);
        }
    }
    
    showExcludeKennelDropdown(kennels, searchTerm) {
        const t = this.t.bind(this);
        const dropdown = document.getElementById('excludeKennelDropdown');
        const resultsDiv = document.getElementById('excludeKennelResults');
        const countSpan = document.getElementById('excludeKennelCount');
        
        if (!dropdown || !resultsDiv || !countSpan) return;
        
        if (kennels.length === 0) {
            resultsDiv.innerHTML = `
                <div class="autocomplete-item text-muted p-3 text-center">
                    <i class="bi bi-search me-2"></i>${t('noKennelsFound')}
                    <br>
                    <small>${t('refineSearch')}</small>
                </div>
                <div class="autocomplete-item" data-manual="${searchTerm}">
                    <div class="fw-bold text-primary">
                        <i class="bi bi-plus-circle me-2"></i>${t('manualEntry')}
                    </div>
                    <div class="small text-muted">
                        "${searchTerm}"
                    </div>
                </div>
            `;
            countSpan.textContent = '0';
            dropdown.style.display = 'block';
        } else {
            countSpan.textContent = kennels.length;
            
            const displayKennels = kennels.slice(0, 15);
            
            resultsDiv.innerHTML = displayKennels.map(kennel => {
                const highlightText = (text) => {
                    if (!text || !searchTerm) return text || '';
                    const lowerText = text.toLowerCase();
                    const lowerSearch = searchTerm.toLowerCase();
                    const index = lowerText.indexOf(lowerSearch);
                    
                    if (index === -1) return text;
                    
                    return text.substring(0, index) + 
                           '<mark>' + text.substring(index, index + searchTerm.length) + '</mark>' + 
                           text.substring(index + searchTerm.length);
                };
                
                return `
                    <div class="autocomplete-item" data-kennel="${kennel}" tabindex="0">
                        <div class="fw-bold">${highlightText(kennel)}</div>
                    </div>
                `;
            }).join('');
            
            if (kennels.length > 15) {
                resultsDiv.innerHTML += `
                    <div class="autocomplete-item text-muted p-2 text-center">
                        <small>${t('moreResults').replace('meer...', `En nog ${kennels.length - 15} ${t('moreResults')}`)}</small>
                    </div>
                `;
            }
            
            dropdown.style.display = 'block';
        }
        
        resultsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const kennelName = item.getAttribute('data-kennel');
                const manualEntry = item.getAttribute('data-manual');
                
                if (kennelName) {
                    this.addExcludeKennel(kennelName);
                } else if (manualEntry) {
                    this.handleManualExcludeKennelEntry(manualEntry);
                }
                
                dropdown.style.display = 'none';
                document.getElementById('excludeKennelSearch').value = '';
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    item.click();
                }
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = item.nextElementSibling;
                    if (next && next.classList.contains('autocomplete-item')) {
                        next.focus();
                    }
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = item.previousElementSibling;
                    if (prev && prev.classList.contains('autocomplete-item')) {
                        prev.focus();
                    } else {
                        document.getElementById('excludeKennelSearch').focus();
                    }
                }
            });
        });
    }
    
    async addExcludeHond(hondId) {
        const hond = await this.getHondById(hondId);
        
        if (!hond) return;
        
        const generations = parseInt(document.getElementById('excludeGenerations').value) || 3;
        
        if (!this.excludeHonden.some(excluded => excluded.id === hond.id)) {
            this.excludeHonden.push({
                id: hond.id,
                naam: hond.naam,
                kennelnaam: hond.kennelnaam,
                stamboomnr: hond.stamboomnr,
                geslacht: hond.geslacht,
                generations: generations
            });
            
            this.updateExcludedHondenList();
        }
    }
    
    handleManualExcludeHondEntry(entry) {
        const generations = parseInt(document.getElementById('excludeGenerations').value) || 3;
        
        if (!this.excludeHonden.some(excluded => excluded.manualEntry && excluded.naam === entry)) {
            this.excludeHonden.push({
                id: 'manual-' + Date.now(),
                naam: entry,
                manualEntry: true,
                generations: generations
            });
            
            this.updateExcludedHondenList();
        }
    }
    
    addExcludeKennel(kennelName) {
        const generations = parseInt(document.getElementById('excludeKennelGenerations').value) || 3;
        
        if (!this.excludeKennels.some(excluded => excluded.kennelnaam.toLowerCase() === kennelName.toLowerCase())) {
            this.excludeKennels.push({
                kennelnaam: kennelName,
                generations: generations
            });
            
            this.updateExcludedKennelsList();
        }
    }
    
    handleManualExcludeKennelEntry(entry) {
        const generations = parseInt(document.getElementById('excludeKennelGenerations').value) || 3;
        
        if (!this.excludeKennels.some(excluded => excluded.kennelnaam.toLowerCase() === entry.toLowerCase())) {
            this.excludeKennels.push({
                kennelnaam: entry,
                manualEntry: true,
                generations: generations
            });
            
            this.updateExcludedKennelsList();
        }
    }
    
    removeExcludeHond(index) {
        this.excludeHonden.splice(index, 1);
        this.updateExcludedHondenList();
    }
    
    removeExcludeKennel(index) {
        this.excludeKennels.splice(index, 1);
        this.updateExcludedKennelsList();
    }
    
    generateExcludedHondenList() {
        if (this.excludeHonden.length === 0) {
            return '<div class="alert alert-light small mb-0"><i class="bi bi-info-circle"></i> Geen honden uitgesloten</div>';
        }
        
        return `
            <div class="list-group">
                ${this.excludeHonden.map((hond, index) => `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center small">
                        <div>
                            ${hond.geslacht === 'reuen' ? 
                                '<i class="bi bi-gender-male text-primary me-1"></i>' : 
                                hond.geslacht === 'teven' ? 
                                '<i class="bi bi-gender-female text-danger me-1"></i>' : 
                                ''
                            }
                            <strong>${hond.naam} ${hond.kennelnaam ? hond.kennelnaam : ''}</strong>
                            ${hond.manualEntry ? 
                                `<span class="badge bg-warning ms-2">${this.t('manuallyEnteredHond')}</span>` : 
                                `<small class="text-muted ms-2">${hond.stamboomnr || ''}</small>`
                            }
                            <br>
                            <small class="text-muted">${this.t('excludeGenerations')}: ${hond.generations}</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-index="${index}">
                            <i class="bi bi-x"></i> ${this.t('removeExclude')}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    generateExcludedKennelsList() {
        if (this.excludeKennels.length === 0) {
            return '<div class="alert alert-light small mb-0"><i class="bi bi-info-circle"></i> Geen kennels uitgesloten</div>';
        }
        
        return `
            <div class="list-group">
                ${this.excludeKennels.map((kennel, index) => `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center small">
                        <div>
                            <i class="bi bi-house-door text-secondary me-1"></i>
                            <strong>${kennel.kennelnaam}</strong>
                            ${kennel.manualEntry ? 
                                `<span class="badge bg-warning ms-2">${this.t('manuallyEnteredKennel')}</span>` : 
                                ''
                            }
                            <br>
                            <small class="text-muted">${this.t('excludeGenerations')}: ${kennel.generations}</small>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-index="${index}">
                            <i class="bi bi-x"></i> ${this.t('removeExclude')}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    updateExcludedHondenList() {
        const listDiv = document.getElementById('excludedHondenList');
        if (listDiv) {
            listDiv.innerHTML = this.generateExcludedHondenList();
            
            listDiv.querySelectorAll('button[data-index]').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.closest('button').dataset.index);
                    this.removeExcludeHond(index);
                });
            });
        }
    }
    
    updateExcludedKennelsList() {
        const listDiv = document.getElementById('excludedKennelsList');
        if (listDiv) {
            listDiv.innerHTML = this.generateExcludedKennelsList();
            
            listDiv.querySelectorAll('button[data-index]').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.closest('button').dataset.index);
                    this.removeExcludeKennel(index);
                });
            });
        }
    }
    
    generateHealthFilters(t) {
        const healthFilters = [
            { key: 'heupdysplasie', label: t('heupdysplasie') },
            { key: 'patellaluxatie', label: t('patellaluxatie') },
            { key: 'ogen', label: t('ogen') },
            { key: 'dandyWalker', label: t('dandyWalker') },
            { key: 'schildklier', label: t('schildklier') },
            { key: 'elleboogdysplasie', label: t('elleboogdysplasie') }
        ];
        
        return healthFilters.map(filter => `
            <div class="col-md-6">
                <label class="form-label">${filter.label}</label>
                <select class="form-select health-filter" data-filter="${filter.key}">
                    <option value="">${t('anyHealth')}</option>
                    ${t('healthOptions')[filter.key].map(option => {
                        const label = t('healthLabels')[filter.key][option] || option;
                        return `<option value="${option}">${label}</option>`;
                    }).join('')}
                </select>
            </div>
        `).join('');
    }
    
    async selectTeef(teef) {
        console.log(`✅ Teef geselecteerd: ${teef.naam} (ID: ${teef.id})`);
        
        this.selectedTeef = teef;
        
        // Sla teef op in allHonden voor COI berekeningen
        if (!this.allHonden.find(h => h.id === teef.id)) {
            this.allHonden.push(teef);
        }
        
        this.updateTeefInfoDisplay(teef);
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && coiInput.value) {
            this.validateCOIInput(coiInput);
        }
    }
    
    clearTeefSelection() {
        this.selectedTeef = null;
        const infoDiv = document.getElementById('selectedTeefInfo');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <div class="text-muted text-center">
                    <i class="bi bi-gender-female"></i>
                    <p class="mb-0 mt-2">${this.t('selectFemaleToStart')}</p>
                </div>
            `;
        }
        
        if (this.teefTomSelect) {
            this.teefTomSelect.clear();
        }
    }
    
    getHealthColor(value, type) {
        if (!value || value === '' || value === '?' || value === 'Onbekend') {
            return 'text-danger fw-bold';
        }
        
        const lowerValue = value.toLowerCase().trim();
        
        switch(type) {
            case 'hd':
                if (lowerValue === 'a') return 'text-success fw-bold';
                if (lowerValue === 'b') return 'text-warning fw-bold';
                if (lowerValue === 'c') return 'text-orange fw-bold';
                if (lowerValue === 'd' || lowerValue === 'e') return 'text-danger fw-bold';
                break;
                
            case 'pl':
                if (lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '3') return 'text-danger fw-bold';
                break;
                
            case 'ogen':
                if (lowerValue === 'vrij') return 'text-success fw-bold';
                if (lowerValue.includes('dist')) return 'text-warning fw-bold';
                if (lowerValue === 'overig') return 'text-danger fw-bold';
                break;
                
            case 'dw':
                if (lowerValue.includes('vrij op dna') || lowerValue.includes('vrij dna')) return 'text-success fw-bold';
                if (lowerValue.includes('vrij op ouders') || lowerValue.includes('vrij ouders')) return 'text-success fw-bold';
                if (lowerValue.includes('drager') || lowerValue.includes('carrier')) return 'text-orange fw-bold';
                if (lowerValue.includes('lijder') || lowerValue.includes('affected')) return 'text-danger fw-bold';
                break;
                
            case 'schildklier':
                if (lowerValue === 'tgaa negatief' || lowerValue === 'negatief') {
                    return 'text-success fw-bold';
                }
                return 'text-danger fw-bold';
                
            case 'ed':
                if (lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '3') return 'text-danger fw-bold';
                break;
        }
        
        return 'text-danger fw-bold';
    }
    
    getCOIColor(value) {
        if (value <= 5) return 'text-success fw-bold';
        if (value <= 10) return 'text-warning fw-bold';
        if (value <= 20) return 'text-orange fw-bold';
        return 'text-danger fw-bold';
    }
    
    async updateTeefInfoDisplay(teef) {
        const t = this.t.bind(this);
        const infoDiv = document.getElementById('selectedTeefInfo');
        
        if (!infoDiv) return;
        
        let teefCOI = '0.0';
        
        if (this.coiCalculator2 && teef.id) {
            try {
                teefCOI = this.coiCalculator2.calculateCOI(teef.id);
            } catch (error) {
                console.error('Fout bij COI berekening teef:', error);
            }
        }
        
        infoDiv.innerHTML = `
            <div class="dog-details-card" style="border: 1px solid #dee2e6; border-radius: 8px; padding: 15px;">
                <div class="dog-details-header">
                    <div class="dog-details-name" style="font-size: 1.3rem; font-weight: 700; color: #6f42c1;">${this.escapeHtml(teef.naam || 'Onbekend')}</div>
                    ${teef.kennelnaam ? `<div class="dog-details-subtitle" style="color: #6c757d;">${this.escapeHtml(teef.kennelnaam)}</div>` : ''}
                </div>
                
                <div class="mb-3">
                    <strong>${t('pedigree')}:</strong> ${teef.stamboomnr || '-'}
                    <br>
                    <strong>${t('coi6Gen')}:</strong> <span class="${this.getCOIColor(parseFloat(teefCOI))}">${teefCOI}%</span>
                </div>
                
                <div class="row mb-2">
                    <div class="col-6">
                        <div class="small">
                            <strong>HD:</strong> 
                            <span class="${this.getHealthColor(teef.heupdysplasie, 'hd')}">
                                ${teef.heupdysplasie || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>PL:</strong> 
                            <span class="${this.getHealthColor(teef.patella, 'pl')}">
                                ${teef.patella || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-2">
                    <div class="col-6">
                        <div class="small">
                            <strong>${t('ogen')}:</strong> 
                            <span class="${this.getHealthColor(teef.ogen, 'ogen')}">
                                ${teef.ogen || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>${t('dandyWalker')}:</strong> 
                            <span class="${this.getHealthColor(teef.dandyWalker, 'dw')}">
                                ${teef.dandyWalker || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="small">
                            <strong>${t('schildklier')}:</strong> 
                            <span class="${this.getHealthColor(teef.schildklier, 'schildklier')}">
                                ${teef.schildklier || '?'}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="small">
                            <strong>${t('elleboogdysplasie')}:</strong> 
                            <span class="${this.getHealthColor(teef.elleboogdysplasie, 'ed')}">
                                ${teef.elleboogdysplasie || '?'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> Selectie wissen
                    </button>
                </div>
            </div>
        `;
        
        const clearBtn = document.getElementById('clearTeefBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearTeefSelection();
            });
        }
    }
    
    validateDateInput(input) {
        const value = input.value.trim();
        
        if (value === '') {
            input.classList.remove('is-invalid');
            return true;
        }
        
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dateRegex.test(value)) {
            input.classList.add('is-invalid');
            return false;
        }
        
        const [, day, month, year] = value.match(dateRegex);
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            input.classList.add('is-invalid');
            return false;
        }
        
        if (monthNum < 1 || monthNum > 12) {
            input.classList.add('is-invalid');
            return false;
        }
        
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        if (dayNum < 1 || dayNum > daysInMonth) {
            input.classList.add('is-invalid');
            return false;
        }
        
        input.classList.remove('is-invalid');
        return true;
    }
    
    validateCOIInput(input) {
        const t = this.t.bind(this);
        const value = parseFloat(input.value);
        
        if (input.value === '') {
            input.classList.remove('is-invalid');
            return true;
        }
        
        if (isNaN(value) || value < 0 || value > 100) {
            input.classList.add('is-invalid');
            this.showAlert(t('invalidCOI'), 'danger');
            return false;
        }
        
        if (value > 0 && !this.selectedTeef) {
            input.classList.add('is-invalid');
            this.showAlert(t('noTeefSelected'), 'warning');
            return false;
        }
        
        input.classList.remove('is-invalid');
        return true;
    }
    
    parseDate(dateString) {
        if (!dateString) return null;
        
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        
        const date = new Date(year, month, day);
        
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return null;
        }
        
        return date;
    }
    
    parseHondenDate(dateString) {
        if (!dateString) return null;
        
        let date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        
        return null;
    }
    
    async performSearch() {
        const t = this.t.bind(this);
        const resultsDiv = document.getElementById('searchResults');
        
        if (!resultsDiv) return;
        
        const bornAfterInput = document.getElementById('bornAfterFilter');
        if (bornAfterInput && !this.validateDateInput(bornAfterInput)) {
            this.showAlert(t('invalidDate'), 'danger');
            return;
        }
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && !this.validateCOIInput(coiInput)) {
            return;
        }
        
        resultsDiv.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">${t('searchingMales')}</span>
                </div>
                <p class="mt-3">${t('searchingMales')}</p>
            </div>
        `;
        
        const criteria = this.getSearchCriteria();
        
        // Haal reuen direct uit de database
        let reuen = await this.getReuenFromDatabase(criteria);
        
        console.log(`🔍 Start zoeken met ${reuen.length} reuen, COI filter: ${criteria.maxCOI}%`);
        
        // Filter op geboortedatum (indien nodig, want database query heeft al gefilterd)
        if (criteria.bornAfter && reuen.length > 0) {
            const minDate = this.parseDate(criteria.bornAfter);
            if (minDate) {
                reuen = reuen.filter(r => {
                    if (!r.geboortedatum) return false;
                    const reuDate = this.parseHondenDate(r.geboortedatum);
                    return reuDate && reuDate >= minDate;
                });
                console.log(`   ➡ Na datum filter: ${reuen.length} reuen`);
            }
        }
        
        // Filter op exclusie honden
        reuen = this.filterByExcludedHonden(reuen, criteria.excludeHonden, criteria.excludeGenerations);
        console.log(`   ➡ Na exclusie honden: ${reuen.length} reuen`);
        
        // Filter op exclusie kennels
        reuen = this.filterByExcludedKennels(reuen, criteria.excludeKennels, criteria.excludeKennelGenerations);
        console.log(`   ➡ Na exclusie kennels: ${reuen.length} reuen`);
        
        // Filter op gezondheid
        reuen = this.filterByHealth(reuen, criteria.health);
        console.log(`   ➡ Na gezondheidsfilter: ${reuen.length} reuen`);
        
        // Filter op COI
        if (criteria.maxCOI > 0 && this.selectedTeef && this.selectedTeef.id) {
            reuen = await this.filterByCOI(reuen, this.selectedTeef.id, criteria.maxCOI);
            console.log(`   ➡ Na COI filter (max ${criteria.maxCOI}%): ${reuen.length} reuen`);
        }
        
        // Sorteer op gezondheidsscore
        reuen = this.sortByHealthScore(reuen);
        
        setTimeout(() => {
            if (reuen.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>${t('noResults')}</strong><br>
                        ${t('tryAgain')}
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = `
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>${t('resultColumns').naam}</th>
                                    <th>${t('resultColumns').geboortedatum}</th>
                                    <th>${t('resultColumns').hd}</th>
                                    <th>${t('resultColumns').pl}</th>
                                    <th>${t('resultColumns').ogen}</th>
                                    <th>${t('resultColumns').dw}</th>
                                    <th>${t('resultColumns').schildklier}</th>
                                    <th>${t('resultColumns').ed}</th>
                                    <th>${t('resultColumns').locatie}</th>
                                    <th>${t('resultColumns').coi}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateResultsTable(reuen, t, criteria.maxCOI > 0 && this.selectedTeef)}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-muted text-center mt-3">
                        <small>${reuen.length} reuen gevonden</small>
                        ${criteria.maxCOI > 0 ? `<br><small>Maximale COI 6g: ${criteria.maxCOI}%</small>` : ''}
                        ${criteria.excludeHonden.length > 0 ? `<br><small>${criteria.excludeHonden.length} honden uitgesloten in ${criteria.excludeGenerations} generaties</small>` : ''}
                        ${criteria.excludeKennels.length > 0 ? `<br><small>${criteria.excludeKennels.length} kennels uitgesloten in ${criteria.excludeKennelGenerations} generaties</small>` : ''}
                        ${this.selectedTeef ? `<br><small>Toont combinatie COI 6g met ${this.selectedTeef.naam}</small>` : ''}
                        <br><small><i class="bi bi-info-circle"></i> ${t('pedigreeTooltip')}</small>
                    </div>
                `;
                
                this.attachReuNameClickEvents();
            }
        }, 100);
    }
    
    /**
     * Haal reuen direct uit de database op basis van zoekcriteria
     */
    async getReuenFromDatabase(criteria) {
        const supabase = this.getSupabase();
        if (!supabase) {
            console.error('❌ Geen Supabase client');
            return [];
        }
        
        try {
            let query = supabase
                .from('honden')
                .select('*')
                .eq('geslacht', 'reuen');
            
            // Filter op ras
            if (criteria.ras) {
                query = query.eq('ras', criteria.ras);
            }
            
            // Filter op geboortedatum
            if (criteria.bornAfter) {
                const minDate = this.parseDate(criteria.bornAfter);
                if (minDate) {
                    const dateStr = minDate.toISOString().split('T')[0];
                    query = query.gte('geboortedatum', dateStr);
                }
            }
            
            const { data, error } = await query.order('naam');
            
            if (error) {
                console.error('❌ Fout bij ophalen reuen:', error);
                return [];
            }
            
            console.log(`✅ ${data?.length || 0} reuen opgehaald uit database`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Fout bij getReuenFromDatabase:', error);
            return [];
        }
    }
    
    filterByExcludedHonden(reuen, excludedHonden, generations) {
        if (excludedHonden.length === 0) {
            return reuen;
        }
        
        console.log(`🔍 Filteren op ${excludedHonden.length} uitgesloten honden in ${generations} generaties`);
        
        return reuen.filter(reu => {
            for (const excluded of excludedHonden) {
                if (this.isHondInPedigree(reu.id, excluded.id, generations)) {
                    console.log(`   ❌ ${reu.naam} bevat ${excluded.naam} in stamboom`);
                    return false;
                }
            }
            return true;
        });
    }
    
    filterByExcludedKennels(reuen, excludedKennels, generations) {
        if (excludedKennels.length === 0) {
            return reuen;
        }
        
        console.log(`🔍 Filteren op ${excludedKennels.length} uitgesloten kennels in ${generations} generaties`);
        
        return reuen.filter(reu => {
            for (const kennel of excludedKennels) {
                if (this.isKennelInPedigree(reu.id, kennel.kennelnaam, generations)) {
                    console.log(`   ❌ ${reu.naam} bevat honden van kennel ${kennel.kennelnaam} in stamboom`);
                    return false;
                }
            }
            return true;
        });
    }
    
    isHondInPedigree(hondId, zoekHondId, maxGenerations) {
        const getAncestors = (id, currentGeneration = 1) => {
            if (currentGeneration > maxGenerations) {
                return false;
            }
            
            const hond = this.allHonden.find(h => h.id == id);
            if (!hond) {
                return false;
            }
            
            if (hond.id == zoekHondId) {
                return true;
            }
            
            let found = false;
            
            if (hond.vader_id) {
                found = found || getAncestors(hond.vader_id, currentGeneration + 1);
            }
            
            if (hond.moeder_id) {
                found = found || getAncestors(hond.moeder_id, currentGeneration + 1);
            }
            
            return found;
        };
        
        return getAncestors(hondId);
    }
    
    isKennelInPedigree(hondId, kennelName, maxGenerations) {
        const getAncestors = (id, currentGeneration = 1) => {
            if (currentGeneration > maxGenerations) {
                return false;
            }
            
            const hond = this.allHonden.find(h => h.id == id);
            if (!hond) {
                return false;
            }
            
            if (hond.kennelnaam && hond.kennelnaam.toLowerCase() === kennelName.toLowerCase()) {
                return true;
            }
            
            let found = false;
            
            if (hond.vader_id) {
                found = found || getAncestors(hond.vader_id, currentGeneration + 1);
            }
            
            if (hond.moeder_id) {
                found = found || getAncestors(hond.moeder_id, currentGeneration + 1);
            }
            
            return found;
        };
        
        return getAncestors(hondId);
    }
    
    attachReuNameClickEvents() {
        const nameCells = document.querySelectorAll('#searchResults td:first-child');
        
        nameCells.forEach(cell => {
            const row = cell.closest('tr');
            if (row && row.dataset && row.dataset.reuId) {
                const reuId = row.dataset.reuId;
                const reuName = cell.textContent.trim();
                
                cell.style.cursor = 'pointer';
                cell.classList.add('text-primary', 'fw-bold');
                cell.title = this.t('pedigreeTooltip');
                
                cell.addEventListener('mouseenter', () => {
                    cell.style.textDecoration = 'underline';
                });
                
                cell.addEventListener('mouseleave', () => {
                    cell.style.textDecoration = 'none';
                });
                
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showReuPedigree(reuId, reuName);
                });
            }
        });
    }
    
    async showReuPedigree(reuId, reuName) {
        console.log(`🔄 Toon stamboom voor reu: ${reuId} - ${reuName}`);
        
        try {
            // Zoek de reu in allHonden of haal uit database
            let reu = this.allHonden.find(h => h.id == reuId);
            
            if (!reu) {
                reu = await this.getHondById(reuId);
            }
            
            if (!reu) {
                this.showAlert(this.t('maleNotFound'), 'warning');
                return;
            }
            
            // Initialiseer stamboom manager
            if (!this.stamboomManager) {
                console.log('ZoekReu: Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            // Toon stamboom modal
            this.stamboomManager.showPedigree(reu);
            
            console.log('✅ Stamboom getoond voor:', reu.naam);
            
        } catch (error) {
            console.error('❌ Fout bij tonen stamboom:', error);
            this.showAlert(this.t('errorShowingPedigree'), 'danger');
        }
    }
    
    getSearchCriteria() {
        const coiInput = document.getElementById('coiFilter');
        const coiValue = coiInput ? parseFloat(coiInput.value) || 0 : 0;
        
        const excludeGenerations = parseInt(document.getElementById('excludeGenerations').value) || 3;
        const excludeKennelGenerations = parseInt(document.getElementById('excludeKennelGenerations').value) || 3;
        
        const criteria = {
            ras: document.getElementById('rasFilter')?.value || '',
            bornAfter: document.getElementById('bornAfterFilter')?.value.trim() || '',
            maxCOI: coiValue,
            excludeHonden: this.excludeHonden,
            excludeGenerations: excludeGenerations,
            excludeKennels: this.excludeKennels,
            excludeKennelGenerations: excludeKennelGenerations,
            health: {}
        };
        
        document.querySelectorAll('.health-filter').forEach(select => {
            const filterType = select.dataset.filter;
            const value = select.value;
            if (value) {
                criteria.health[filterType] = value;
            }
        });
        
        return criteria;
    }
    
    filterByHealth(reuen, healthCriteria) {
        if (Object.keys(healthCriteria).length === 0) {
            return reuen;
        }
        
        return reuen.filter(reu => {
            for (const [test, selectedValue] of Object.entries(healthCriteria)) {
                const reuValue = reu[this.getHealthFieldName(test)];
                
                if (test === 'schildklier') {
                    const passes = this.meetsSchildklierRequirement(reuValue, selectedValue);
                    if (!passes) return false;
                    continue;
                }
                
                if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
                    if (test === 'patellaluxatie' && (selectedValue === 'Niet getest' || selectedValue === 'Not tested')) {
                        continue;
                    } else if (test === 'ogen' && (selectedValue === 'Niet onderzocht' || selectedValue === 'Not examined')) {
                        continue;
                    } else if (selectedValue === 'Niet getest' || selectedValue === 'Not tested') {
                        continue;
                    }
                    return false;
                }
                
                if (!this.meetsMaximumRequirement(test, reuValue, selectedValue)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    meetsSchildklierRequirement(reuValue, selectedValue) {
        if (!reuValue || reuValue === '' || reuValue === '?' || reuValue.toLowerCase() === 'onbekend') {
            return selectedValue === 'Niet getest' || 
                   selectedValue === 'Not tested' || 
                   selectedValue === 'Niet getest';
        }
        
        const normalizedReuValue = reuValue.toLowerCase().trim();
        
        if (selectedValue === 'Tgaa Negatief' || selectedValue === 'Tgaa Negative' || selectedValue === 'Tgaa Negativ') {
            return normalizedReuValue === 'tgaa negatief' || 
                   normalizedReuValue === 'negatief' ||
                   normalizedReuValue === 'tgaa negative' ||
                   normalizedReuValue === 'negative' ||
                   normalizedReuValue === 'tgaa negativ' ||
                   normalizedReuValue === 'negativ';
        }
        
        if (selectedValue === 'Niet getest' || selectedValue === 'Not tested' || selectedValue === 'Niet getest') {
            return normalizedReuValue === 'niet getest' ||
                   normalizedReuValue === 'not tested' ||
                   reuValue === '' ||
                   reuValue === null ||
                   normalizedReuValue === 'tgaa negatief' || 
                   normalizedReuValue === 'negatief';
        }
        
        return false;
    }
    
    meetsMaximumRequirement(test, reuValue, maxValue) {
        const normalizedReuValue = reuValue ? reuValue.toString().trim() : '';
        const normalizedMaxValue = maxValue ? maxValue.toString().trim() : '';
        
        switch(test) {
            case 'heupdysplasie':
                const hdOrder = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
                const hdScoreReu = hdOrder[normalizedReuValue] !== undefined ? hdOrder[normalizedReuValue] : 99;
                const hdScoreMax = hdOrder[normalizedMaxValue] !== undefined ? hdOrder[normalizedMaxValue] : 99;
                return hdScoreReu <= hdScoreMax;
                
            case 'patellaluxatie':
                const plOrder = { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 };
                const plScoreReu = plOrder[normalizedReuValue] !== undefined ? plOrder[normalizedReuValue] : 
                                  (normalizedReuValue === 'Niet getest' || normalizedReuValue === 'Not tested' ? 4 : 99);
                const plScoreMax = plOrder[normalizedMaxValue] !== undefined ? plOrder[normalizedMaxValue] : 99;
                
                if (normalizedMaxValue === 'Niet getest' || normalizedMaxValue === 'Not tested') {
                    return plScoreReu <= 4 && plScoreReu !== 2 && plScoreReu !== 3;
                }
                return plScoreReu <= plScoreMax && plScoreReu !== 2 && plScoreReu !== 3;
                
            case 'ogen':
                let reuOgenValue = normalizedReuValue;
                let maxOgenValue = normalizedMaxValue;
                
                if (maxOgenValue === 'Dist' || maxOgenValue === 'Distichiasis') {
                    if (reuOgenValue === 'Vrij' || reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Overig') {
                    if (reuOgenValue === 'Vrij' || 
                        reuOgenValue === 'Dist' || 
                        reuOgenValue === 'Distichiasis' || 
                        reuOgenValue === 'Overig') {
                        return true;
                    }
                    return false;
                }
                
                if (maxOgenValue === 'Niet onderzocht' || maxOgenValue === 'Not examined') {
                    return true;
                }
                
                if (maxOgenValue === 'Vrij') {
                    return reuOgenValue === 'Vrij';
                }
                
                if (maxOgenValue === 'Free') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij';
                }
                
                if (maxOgenValue === 'Other') {
                    return reuOgenValue === 'Free' || reuOgenValue === 'Vrij' || 
                           reuOgenValue === 'Dist' || reuOgenValue === 'Distichiasis' ||
                           reuOgenValue === 'Other' || reuOgenValue === 'Overig';
                }
                
                return normalizedReuValue === normalizedMaxValue;
                
            case 'dandyWalker':
                if (!normalizedMaxValue || normalizedMaxValue === '') {
                    return true;
                }
                
                if (normalizedReuValue.includes('lijder') || normalizedReuValue.includes('affected')) {
                    return false;
                }
                
                if (normalizedMaxValue === 'Vrij op DNA') {
                    return normalizedReuValue.includes('vrij op dna') || normalizedReuValue.includes('vrij dna');
                }
                
                if (normalizedMaxValue === 'Vrij op ouders') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders');
                }
                
                if (normalizedMaxValue === 'Drager') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier');
                }
                
                if (normalizedMaxValue === 'Niet getest') {
                    return normalizedReuValue.includes('vrij op dna') || 
                           normalizedReuValue.includes('vrij dna') ||
                           normalizedReuValue.includes('vrij op ouders') ||
                           normalizedReuValue.includes('vrij ouders') ||
                           normalizedReuValue.includes('drager') ||
                           normalizedReuValue.includes('carrier') ||
                           normalizedReuValue.includes('niet getest') ||
                           normalizedReuValue.includes('not tested');
                }
                
                return false;
                
            case 'elleboogdysplasie':
                const edOrder = { '0': 0, '1': 1, '2': 2, '3': 3, 'Niet getest': 4 };
                const edScoreReu = edOrder[normalizedReuValue] !== undefined ? edOrder[normalizedReuValue] : 99;
                const edScoreMax = edOrder[normalizedMaxValue] !== undefined ? edOrder[normalizedMaxValue] : 99;
                return edScoreReu <= edScoreMax;
                
            default:
                return normalizedReuValue === normalizedMaxValue;
        }
    }
    
    getHealthFieldName(testKey) {
        const fieldMap = {
            'heupdysplasie': 'heupdysplasie',
            'patellaluxatie': 'patella',
            'ogen': 'ogen',
            'dandyWalker': 'dandyWalker',
            'schildklier': 'schildklier',
            'elleboogdysplasie': 'elleboogdysplasie'
        };
        return fieldMap[testKey] || testKey;
    }
    
    async filterByCOI(reuen, teefId, maxCOI) {
        if (!this.coiCalculator2 || !teefId || maxCOI <= 0) {
            return reuen;
        }
        
        console.log(`🔬 COI filtering: teef ${teefId}, max ${maxCOI}%`);
        
        const filteredReuen = [];
        
        const resultsDiv = document.getElementById('searchResults');
        if (reuen.length > 0 && resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-purple" role="status">
                        <span class="visually-hidden">COI berekeningen...</span>
                    </div>
                    <p class="mt-3">${this.t('calculatingCOI')}</p>
                    <p class="small text-muted">${this.t('coiCalculationProgress')} (${reuen.length} reuen)</p>
                </div>
            `;
        }
        
        try {
            for (let i = 0; i < reuen.length; i++) {
                const reu = reuen[i];
                
                try {
                    const comboCOI = await this.calculateComboCOI(teefId, reu.id);
                    const comboValue = parseFloat(comboCOI) || 0;
                    
                    console.log(`   ➡ ${reu.naam}: combo 6g=${comboValue}% (max: ${maxCOI}%) → ${comboValue <= maxCOI ? 'PASS' : 'FAIL'}`);
                    
                    if (!reu._coiData) {
                        reu._coiData = {};
                    }
                    reu._coiData.combo = comboCOI;
                    reu._coiData.passesFilter = comboValue <= maxCOI;
                    
                    if (comboValue <= maxCOI) {
                        filteredReuen.push(reu);
                    }
                    
                } catch (calcError) {
                    console.error(`Fout bij COI berekening reu ${reu.id}:`, calcError);
                    
                    if (!reu._coiData) {
                        reu._coiData = {};
                    }
                    reu._coiData.combo = '0.000';
                    reu._coiData.passesFilter = false;
                }
            }
            
        } catch (error) {
            console.error('❌ Fout bij COI filtering:', error);
        }
        
        return filteredReuen;
    }
    
    getHDPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'a': 1,
            'b': 2,
            'c': 3,
            'onbekend': 4,
            'd': 5,
            'e': 6
        };
        return priority[normalized] || 7;
    }
    
    getPLPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            '0': 1,
            '1': 2,
            '2': 3,
            '3': 4,
            'onbekend': 5
        };
        return priority[normalized] || 6;
    }
    
    getOgenPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'vrij': 1,
            'dist': 2,
            'distichiasis': 2,
            'overig': 3,
            'onbekend': 4
        };
        return priority[normalized] || 5;
    }
    
    getDWPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'vrij op dna': 1,
            'vrij op ouders': 2,
            'drager': 3,
            'onbekend': 4,
            'lijder': 5
        };
        return priority[normalized] || 6;
    }
    
    getTgaaPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            'tgaa negatief': 1,
            'negatief': 1,
            'onbekend': 2,
            'tgaa positief': 3,
            'positief': 3
        };
        return priority[normalized] || 4;
    }
    
    getEDPriority(value) {
        const normalized = this.normalizeValue(value);
        const priority = {
            '0': 1,
            '1': 2,
            'onbekend': 3,
            '2': 4,
            '3': 5
        };
        return priority[normalized] || 6;
    }
    
    normalizeValue(value) {
        if (!value || value === '' || value === '?') return 'onbekend';
        return value.toString().toLowerCase().trim();
    }
    
    sortByHealthScore(reuen) {
        return reuen.sort((a, b) => {
            const hdA = this.getHDPriority(a.heupdysplasie);
            const hdB = this.getHDPriority(b.heupdysplasie);
            if (hdA !== hdB) return hdA - hdB;
            
            const plA = this.getPLPriority(a.patella);
            const plB = this.getPLPriority(b.patella);
            if (plA !== plB) return plA - plB;
            
            const ogenA = this.getOgenPriority(a.ogen);
            const ogenB = this.getOgenPriority(b.ogen);
            if (ogenA !== ogenB) return ogenA - ogenB;
            
            const dwA = this.getDWPriority(a.dandyWalker);
            const dwB = this.getDWPriority(b.dandyWalker);
            if (dwA !== dwB) return dwA - dwB;
            
            const tgaaA = this.getTgaaPriority(a.schildklier);
            const tgaaB = this.getTgaaPriority(b.schildklier);
            if (tgaaA !== tgaaB) return tgaaA - tgaaB;
            
            const edA = this.getEDPriority(a.elleboogdysplasie);
            const edB = this.getEDPriority(b.elleboogdysplasie);
            if (edA !== edB) return edA - edB;
            
            return (a.naam || '').localeCompare(b.naam || '');
        });
    }
    
    generateResultsTable(reuen, t, showCOIColumn) {
        return reuen.map(reu => {
            const formatValue = (value) => {
                if (!value || value === '') return '?';
                if (value.length > 10) return value.substring(0, 10) + '...';
                return value;
            };
            
            const formatDate = (dateString) => {
                if (!dateString) return '-';
                try {
                    const date = this.parseHondenDate(dateString);
                    if (date) {
                        return date.toLocaleDateString(this.currentLang, { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                    return dateString;
                } catch (e) {
                    return dateString;
                }
            };
            
            const formatTgaa = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue.includes('negatief') || lowerValue === 'neg' || lowerValue === 'negative') return 'Neg';
                if (lowerValue.includes('positief') || lowerValue === 'pos' || lowerValue === 'positive') return 'Pos';
                if (lowerValue.includes('niet getest') || lowerValue === 'niet getest' || lowerValue === 'not tested') return 'NG';
                return value.substring(0, 3);
            };
            
            const formatOgen = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue === 'vrij' || lowerValue === 'free') return 'Vrij';
                if (lowerValue.includes('dist') || lowerValue === 'distichiasis') return 'Dist';
                if (lowerValue === 'overig' || lowerValue === 'other') return 'Over';
                if (lowerValue.includes('niet onderzocht') || lowerValue.includes('not examined')) return 'NO';
                return value.substring(0, 4);
            };
            
            const formatDW = (value) => {
                if (!value || value === '' || value === '?' || value === 'Onbekend') return '?';
                const lowerValue = value.toLowerCase().trim();
                if (lowerValue.includes('vrij op dna') || lowerValue.includes('vrij dna')) return 'VrDNA';
                if (lowerValue.includes('vrij op ouders') || lowerValue.includes('vrij ouders')) return 'VrOud';
                if (lowerValue.includes('drager') || lowerValue.includes('carrier')) return 'Drag';
                if (lowerValue.includes('niet getest') || lowerValue.includes('not tested')) return 'NG';
                if (lowerValue.includes('lijder') || lowerValue.includes('affected')) return 'Lijdr';
                return value.substring(0, 5);
            };
            
            const displayName = reu.naam ? 
                `${reu.naam} ${reu.kennelnaam ? reu.kennelnaam : ''}`.trim() : 
                t('unknown');
            
            let comboCOI = '0.000';
            
            if (showCOIColumn && reu._coiData && reu._coiData.combo) {
                comboCOI = reu._coiData.combo || '0.000';
            }
            
            return `
                <tr data-reu-id="${reu.id}">
                    <td class="small reu-name-cell" data-reu-id="${reu.id}" data-reu-name="${displayName}">
                        <span class="reu-name-link" 
                              title="${t('pedigreeTooltip')}"
                              data-reu-id="${reu.id}"
                              data-reu-name="${displayName}">
                            ${displayName}
                        </span>
                    </td>
                    <td class="small text-center">${formatDate(reu.geboortedatum)}</td>
                    <td class="${this.getHealthColor(reu.heupdysplasie, 'hd')} text-center">
                        ${formatValue(reu.heupdysplasie)}
                    </td>
                    <td class="${this.getHealthColor(reu.patella, 'pl')} text-center">
                        ${formatValue(reu.patella)}
                    </td>
                    <td class="${this.getHealthColor(reu.ogen, 'ogen')} text-center">
                        ${formatOgen(reu.ogen)}
                    </td>
                    <td class="${this.getHealthColor(reu.dandyWalker, 'dw')} text-center">
                        ${formatDW(reu.dandyWalker)}
                    </td>
                    <td class="${this.getHealthColor(reu.schildklier, 'schildklier')} text-center">
                        ${formatTgaa(reu.schildklier)}
                    </td>
                    <td class="${this.getHealthColor(reu.elleboogdysplasie, 'ed')} text-center">
                        ${formatValue(reu.elleboogdysplasie)}
                    </td>
                    <td class="small text-center">${reu.land || ''}</td>
                    <td class="${this.getCOIColor(parseFloat(comboCOI))} text-center">
                        ${showCOIColumn ? `
                            <strong>${comboCOI}%</strong>
                        ` : `
                            <span class="text-muted">-</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
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
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
        }
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Maak een globale instantie aan
window.zoekReu = new ZoekReu();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZoekReu;
}