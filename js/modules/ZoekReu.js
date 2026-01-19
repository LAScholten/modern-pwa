/**
 * Zoek Reu Module - COMPATIBELE VERSIE MET COICalculator2
 * Volledige paginatie en correcte data structuur voor parent relaties
 */

class ZoekReu {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.teefInputTimer = null;
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
                searchRadius: "Zoekradius",
                radiusOptions: ["Nederland", "België", "Duitsland", "Europa", "Wereldwijd"],
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
                manuallyEnteredKennel: "Handmatig ingevoerde kennel"
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
                searchRadius: "Search radius",
                radiusOptions: ["Netherlands", "Belgium", "Germany", "Europe", "Worldwide"],
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
                        "Niet getest": "Not tested"
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
                manuallyEnteredKennel: "Manually entered kennel"
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
                searchRadius: "Suchradius",
                radiusOptions: ["Niederlande", "België", "Deutschland", "Europa", "Weltweit"],
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
                        "0": "0 (Frei)",
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
                manuallyEnteredKennel: "Manuell eingegebener Zwinger"
            }
        };
    }
    
    async injectDependencies(db, auth, stamboomManager = null) {
        console.log('🔧 ZoekReu: injectDependencies aangeroepen');
        console.log('   db:', db);
        console.log('   auth:', auth);
        console.log('   stamboomManager:', stamboomManager);
        
        this.db = db;
        this.auth = auth;
        this.stamboomManager = stamboomManager;
        
        console.log('📥 ZoekReu: Gaat honden laden...');
        await this.loadAllHonden();
        await this.initCOICalculator();
    }
    
    async loadAllHonden() {
        try {
            console.log('📥 ZoekReu.loadAllHonden() gestart');
            
            let allDogs = [];
            
            // METHODE 1: Gebruik de COICalculator2 paginatie methode die WEL werkt
            if (typeof window.COICalculator2 !== 'undefined' && 
                typeof window.COICalculator2.loadAllDogsFromSupabase === 'function') {
                
                console.log('🔄 Methode 1: Via COICalculator2.loadAllDogsFromSupabase');
                
                if (window.supabase) {
                    allDogs = await window.COICalculator2.loadAllDogsFromSupabase(window.supabase);
                    console.log(`✅ COICalculator2 Supabase paginatie: ${allDogs.length} honden`);
                } else {
                    console.warn('⚠️ Supabase niet beschikbaar voor COICalculator2 paginatie');
                }
            }
            
            // METHODE 2: Probeer paginatie via createCOICalculatorWithAllDogs (als die werkt)
            if ((allDogs.length === 0 || allDogs.length < 100) && 
                typeof window.createCOICalculatorWithAllDogs === 'function') {
                
                console.log('🔄 Methode 2: Via createCOICalculatorWithAllDogs');
                
                try {
                    const calculator = await window.createCOICalculatorWithAllDogs();
                    if (calculator && calculator.allDogs) {
                        allDogs = calculator.allDogs;
                        console.log(`✅ createCOICalculatorWithAllDogs: ${allDogs.length} honden`);
                    }
                } catch (error) {
                    console.error('❌ Fout bij createCOICalculatorWithAllDogs:', error);
                }
            }
            
            // METHODE 3: Directe Supabase paginatie (gevalideerd werkende methode)
            if (allDogs.length === 0 && window.supabase) {
                console.log('🔄 Methode 3: Directe Supabase paginatie met verbeterde query');
                allDogs = await this.loadAllDogsFromSupabase();
            }
            
            // METHODE 4: Fallback via DB service
            if (allDogs.length === 0 && this.db && typeof this.db.getHonden === 'function') {
                console.log('🔄 Methode 4: Via DB service getHonden');
                try {
                    const result = await this.db.getHonden();
                    if (result && Array.isArray(result)) {
                        allDogs = result;
                    } else if (result && Array.isArray(result.honden)) {
                        allDogs = result.honden;
                    } else if (result && Array.isArray(result.data)) {
                        allDogs = result.data;
                    }
                    console.log(`⚠️ DB service: ${allDogs.length} honden (mogelijk niet compleet)`);
                } catch (error) {
                    console.error('❌ Fout bij DB service:', error);
                }
            }
            
            // Controleer resultaat
            if (allDogs.length === 0) {
                console.error('❌ Alle methodes gefaald - geen honden geladen');
                this.allHonden = [];
                this.allTeven = [];
                return;
            }
            
            console.log(`✅ TOTAAL ${allDogs.length} honden geladen`);
            
            // CRITIEKE WIJZIGING: Behoud EXACT dezelfde structuur als COICalculator2 verwacht
            // Geen overbodige mapping, gebruik de originele data
            this.allHonden = allDogs.map(hond => {
                // Debug de originele data
                if (!hond.vaderId && hond.vader) {
                    console.log(`⚠️ Hond ${hond.naam}: vaderId is ${hond.vaderId} maar vader naam is '${hond.vader}'`);
                }
                if (!hond.moederId && hond.moeder) {
                    console.log(`⚠️ Hond ${hond.naam}: moederId is ${hond.moederId} maar moeder naam is '${hond.moeder}'`);
                }
                
                // BELANGRIJK: Gebruik de ORIGINELE veldnamen die COICalculator2 verwacht
                return {
                    // Behoud alle velden zoals ze zijn
                    ...hond,
                    
                    // Zorg dat ID numeriek is voor consistente lookups
                    id: Number(hond.id),
                    
                    // vaderId en moederId MOETEN het type behouden zoals in database
                    // Als ze null zijn, moeten ze undefined worden (niet "null" string)
                    vaderId: hond.vaderId !== null && hond.vaderId !== undefined ? Number(hond.vaderId) : undefined,
                    moederId: hond.moederId !== null && hond.moederId !== undefined ? Number(hond.moederId) : undefined,
                    
                    // Voor compatibiliteit met oudere systemen, voeg aliases toe
                    vader_id: hond.vaderId !== null && hond.vaderId !== undefined ? Number(hond.vaderId) : undefined,
                    moeder_id: hond.moederId !== null && hond.moederId !== undefined ? Number(hond.moederId) : undefined,
                    
                    // Zorg voor consistente string velden
                    naam: hond.naam || '',
                    geslacht: (hond.geslacht || '').toLowerCase(),
                    kennelnaam: hond.kennelnaam || '',
                    stamboomnr: hond.stamboomnr || '',
                    ras: hond.ras || '',
                    
                    // Health velden
                    heupdysplasie: hond.heupdysplasie || '',
                    elleboogdysplasie: hond.elleboogdysplasie || '',
                    patella: hond.patella || '',
                    ogen: hond.ogen || '',
                    dandyWalker: hond.dandyWalker || '',
                    schildklier: hond.schildklier || ''
                };
            });
            
            // Bouw parent-child mappings op basis van stamboomnr als ID's ontbreken
            this.repairParentRelationships();
            
            // Filter teven
            this.allTeven = this.allHonden.filter(h => 
                h.geslacht && (h.geslacht.toLowerCase() === 'teven' || h.geslacht.toLowerCase() === 'teef')
            );
            
            console.log(`✅ Totaal: ${this.allHonden.length} honden geladen`);
            console.log(`✅ Teven: ${this.allTeven.length} teven gevonden`);
            console.log(`✅ Reuen: ${this.allHonden.filter(h => h.geslacht && h.geslacht.toLowerCase() === 'reuen').length} reuen gevonden`);
            
            // Debug: toon honden met parent relaties
            const hondenMetOuders = this.allHonden.filter(h => h.vaderId || h.moederId);
            console.log(`✅ Honden met ouders gedefinieerd: ${hondenMetOuders.length}/${this.allHonden.length} (${Math.round(hondenMetOuders.length/this.allHonden.length*100)}%)`);
            
            if (hondenMetOuders.length > 0) {
                console.log('🔍 Voorbeeld honden met ouders:');
                hondenMetOuders.slice(0, 3).forEach((hond, i) => {
                    console.log(`   ${i+1}. ${hond.naam} (ID: ${hond.id})`);
                    console.log(`      VaderId: ${hond.vaderId} (type: ${typeof hond.vaderId})`);
                    console.log(`      MoederId: ${hond.moederId} (type: ${typeof hond.moederId})`);
                });
            }
            
        } catch (error) {
            console.error('❌ FATALE FOUT in loadAllHonden():', error);
            console.error('Error stack:', error.stack);
            this.allHonden = [];
            this.allTeven = [];
        }
    }
    
    async loadAllDogsFromSupabase() {
        try {
            console.log('📄 Laden ALLE honden vanuit Supabase (volledige paginatie)...');
            
            let allDogs = [];
            let start = 0;
            const pageSize = 1000;
            let hasMore = true;
            let totalLoaded = 0;
            
            while (hasMore) {
                console.log(`📄 Laad batch ${start} tot ${start + pageSize}...`);
                
                const { data, error, count } = await window.supabase
                    .from('honden')
                    .select('*', { count: 'exact' })
                    .order('id', { ascending: true })
                    .range(start, start + pageSize - 1);
                
                if (error) {
                    console.error('❌ Supabase error:', error);
                    break;
                }
                
                if (data && data.length > 0) {
                    allDogs = allDogs.concat(data);
                    totalLoaded += data.length;
                    console.log(`   ➡ Batch: ${data.length} honden (totaal: ${totalLoaded})`);
                    
                    if (data.length < pageSize) {
                        hasMore = false;
                        console.log(`   ✅ Laatste batch geladen`);
                    } else {
                        start += pageSize;
                    }
                } else {
                    hasMore = false;
                    console.log('   ⚠️ Geen data in deze batch');
                }
                
                // Toon progress
                if (count && count > 0) {
                    const progress = Math.round((totalLoaded / count) * 100);
                    console.log(`   📊 Voortgang: ${progress}% (${totalLoaded}/${count})`);
                }
                
                // Veiligheidslimiet
                if (start > 50000) {
                    console.warn('⚠️ Veiligheidslimiet bereikt (50k records)');
                    break;
                }
                
                // Kleine pauze om server niet te overbelasten
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log(`✅ Supabase paginatie voltooid: ${allDogs.length} honden`);
            
            // Debug: check parent velden
            const sampleSize = Math.min(5, allDogs.length);
            console.log(`🔍 Controleer ${sampleSize} honden voor parent velden:`);
            
            for (let i = 0; i < sampleSize; i++) {
                const hond = allDogs[i];
                console.log(`   ${i+1}. ${hond.naam} (ID: ${hond.id})`);
                console.log(`      vaderId: ${hond.vaderId} (type: ${typeof hond.vaderId})`);
                console.log(`      moederId: ${hond.moederId} (type: ${typeof hond.moederId})`);
                console.log(`      vader: ${hond.vader}`);
                console.log(`      moeder: ${hond.moeder}`);
                console.log(`      stamboomnr: ${hond.stamboomnr}`);
            }
            
            return allDogs;
            
        } catch (error) {
            console.error('❌ Fout bij Supabase paginatie:', error);
            return [];
        }
    }
    
    repairParentRelationships() {
        console.log('🔧 Repareer parent-child relaties op basis van stamboomnr...');
        
        // Bouw een map van stamboomnr naar ID
        const stamboomMap = new Map();
        this.allHonden.forEach(hond => {
            if (hond.stamboomnr && hond.stamboomnr.trim() !== '') {
                stamboomMap.set(hond.stamboomnr.trim(), hond.id);
            }
        });
        
        console.log(`   ✅ Stamboomnr map: ${stamboomMap.size} unieke stamboomnummers`);
        
        let repairedCount = 0;
        
        // Probeer ontbrekende parent ID's te vinden via naam matching
        this.allHonden.forEach(hond => {
            if (!hond.vaderId && hond.vader) {
                // Zoek vader via naam en kennel
                const vaderNaam = hond.vader.trim().toLowerCase();
                const vaderKennel = hond.kennelnaam ? hond.kennelnaam.trim().toLowerCase() : '';
                
                const potentialFathers = this.allHonden.filter(potential => {
                    const matchNaam = potential.naam && potential.naam.toLowerCase().includes(vaderNaam);
                    const matchKennel = !vaderKennel || 
                                      (potential.kennelnaam && potential.kennelnaam.toLowerCase().includes(vaderKennel));
                    return matchNaam && matchKennel && potential.geslacht && 
                           potential.geslacht.toLowerCase().includes('reu');
                });
                
                if (potentialFathers.length === 1) {
                    hond.vaderId = potentialFathers[0].id;
                    repairedCount++;
                    console.log(`   ✅ Vader gevonden voor ${hond.naam}: ${potentialFathers[0].naam} (ID: ${potentialFathers[0].id})`);
                }
            }
            
            if (!hond.moederId && hond.moeder) {
                // Zoek moeder via naam en kennel
                const moederNaam = hond.moeder.trim().toLowerCase();
                const moederKennel = hond.kennelnaam ? hond.kennelnaam.trim().toLowerCase() : '';
                
                const potentialMothers = this.allHonden.filter(potential => {
                    const matchNaam = potential.naam && potential.naam.toLowerCase().includes(moederNaam);
                    const matchKennel = !moederKennel || 
                                      (potential.kennelnaam && potential.kennelnaam.toLowerCase().includes(moederKennel));
                    return matchNaam && matchKennel && potential.geslacht && 
                           potential.geslacht.toLowerCase().includes('teef');
                });
                
                if (potentialMothers.length === 1) {
                    hond.moederId = potentialMothers[0].id;
                    repairedCount++;
                    console.log(`   ✅ Moeder gevonden voor ${hond.naam}: ${potentialMothers[0].naam} (ID: ${potentialMothers[0].id})`);
                }
            }
        });
        
        console.log(`✅ ${repairedCount} parent-child relaties gerepareerd`);
        
        // Update statistieken
        const hondenMetVader = this.allHonden.filter(h => h.vaderId).length;
        const hondenMetMoeder = this.allHonden.filter(h => h.moederId).length;
        const hondenMetBeideOuders = this.allHonden.filter(h => h.vaderId && h.moederId).length;
        
        console.log(`📊 Parent relaties na reparatie:`);
        console.log(`   Met vader: ${hondenMetVader}/${this.allHonden.length} (${Math.round(hondenMetVader/this.allHonden.length*100)}%)`);
        console.log(`   Met moeder: ${hondenMetMoeder}/${this.allHonden.length} (${Math.round(hondenMetMoeder/this.allHonden.length*100)}%)`);
        console.log(`   Met beide ouders: ${hondenMetBeideOuders}/${this.allHonden.length} (${Math.round(hondenMetBeideOuders/this.allHonden.length*100)}%)`);
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
            
            // Debug: toon data structuur
            console.log('🔍 Controleer data structuur voor COICalculator2:');
            const sampleHond = this.allHonden[0];
            console.log('   Voorbeeld hond structuur:', {
                id: sampleHond.id,
                naam: sampleHond.naam,
                vaderId: sampleHond.vaderId,
                moederId: sampleHond.moederId,
                vaderIdType: typeof sampleHond.vaderId,
                moederIdType: typeof sampleHond.moederId,
                vader: sampleHond.vader,
                moeder: sampleHond.moeder,
                heeftOuders: !!(sampleHond.vaderId && sampleHond.moederId)
            });
            
            // Maak COI calculator met alle geladen honden
            console.log('🔄 Maak COICalculator2 instance...');
            this.coiCalculator2 = new COICalculator2(this.allHonden);
            this.coiCalculatorReady = true;
            
            console.log('✅ COICalculator2 succesvol geïnitialiseerd');
            console.log(`   ${this.coiCalculator2._dogMap.size} honden beschikbaar voor COI berekeningen`);
            
            // Voer een grondige database check uit
            this.coiCalculator2.checkDatabase();
            
            // Test COI berekening op meerdere honden
            console.log('🧪 Test COI berekeningen op verschillende honden:');
            
            // Test honden die ouders zouden moeten hebben
            const testHonden = this.allHonden
                .filter(h => h.vaderId && h.moederId)
                .slice(0, 5);
            
            if (testHonden.length > 0) {
                for (const testHond of testHonden) {
                    try {
                        const coiResult = this.coiCalculator2.calculateCOI(testHond.id);
                        console.log(`   ➡ ${testHond.naam} (ID: ${testHond.id}): ${coiResult}%`);
                        console.log(`      VaderId: ${testHond.vaderId}, MoederId: ${testHond.moederId}`);
                        
                        // Test ook parent-child detectie
                        this.coiCalculator2.testParentChildCombination(testHond.id);
                        
                    } catch (calcError) {
                        console.error(`   ❌ Fout bij ${testHond.naam}:`, calcError.message);
                    }
                }
            } else {
                console.warn('⚠️ Geen honden gevonden met beide ouders voor COI test');
                
                // Toon waarom geen ouders
                console.log('🔍 Analyseer waarom honden geen ouders hebben:');
                this.allHonden.slice(0, 10).forEach(hond => {
                    console.log(`   ${hond.naam}: vaderId=${hond.vaderId}, moederId=${hond.moederId}`);
                    console.log(`      vader veld: '${hond.vader}', moeder veld: '${hond.moeder}'`);
                });
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren COICalculator2:', error);
            console.error('Error details:', error.stack);
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
            
            // Zoek de honden
            const teef = this.allHonden.find(h => h.id == teefId);
            const reu = this.allHonden.find(h => h.id == reuId);
            
            if (!teef || !reu) {
                console.error('❌ Teef of reu niet gevonden in database');
                console.log(`   Gezochte IDs: teef ${teefId}, reu ${reuId}`);
                console.log(`   Beschikbare IDs: ${this.allHonden.slice(0, 5).map(h => h.id).join(', ')}...`);
                return '0.000';
            }
            
            console.log(`📋 Teef: ${teef.naam} (ID: ${teef.id}, Vader: ${teef.vaderId}, Moeder: ${teef.moederId})`);
            console.log(`📋 Reu: ${reu.naam} (ID: ${reu.id}, Vader: ${reu.vaderId}, Moeder: ${reu.moederId})`);
            
            // Gebruik COICalculator2's combinatie methode als die bestaat
            if (typeof this.coiCalculator2.calculateCombinationCOI === 'function') {
                console.log('🔄 Gebruik calculateCombinationCOI methode');
                const result = this.coiCalculator2.calculateCombinationCOI(teefId, reuId);
                console.log(`✅ Combinatie COI via calculateCombinationCOI: ${result}%`);
                return result;
            }
            
            // Fallback: maak virtuele pup
            console.log('🔄 Maak virtuele pup voor COI berekening...');
            
            const futurePuppy = {
                id: -Date.now(), // Uniek negatief ID
                naam: this.t('virtualPuppy'),
                geslacht: 'onbekend',
                vaderId: reu.id,
                moederId: teef.id,
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
            
            // Voeg virtuele pup toe aan bestaande dataset
            const tempHonden = [...this.allHonden, futurePuppy];
            const tempCOICalculator = new COICalculator2(tempHonden);
            
            const coiResult = tempCOICalculator.calculateCOI(futurePuppy.id);
            
            console.log(`✅ Combinatie COI (6g) voor ${teef.naam} × ${reu.naam}: ${coiResult}%`);
            
            return coiResult;
            
        } catch (error) {
            console.error('❌ Fout bij combinatie COI berekening:', error);
            console.error('Error details:', error.stack);
            return '0.000';
        }
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
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
        
        // Toon loading state met meer info
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <p class="mt-3">Laden van zoekfunctie...</p>
                <p class="small text-muted">Laden van alle honden via paginatie (kan even duren)...</p>
                <div class="progress mt-3" style="height: 20px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         role="progressbar" 
                         style="width: 0%"
                         id="loadingProgress">
                        0%
                    </div>
                </div>
            </div>
        `;
        
        try {
            // Update progress
            const progressBar = document.getElementById('loadingProgress');
            const updateProgress = (message, percent) => {
                if (progressBar) {
                    progressBar.style.width = percent + '%';
                    progressBar.textContent = message;
                }
            };
            
            updateProgress('Start laden honden...', 10);
            
            // Laad honden als ze nog niet geladen zijn
            if (this.allHonden.length === 0) {
                console.log('📥 Honden nog niet geladen, ga ze nu laden...');
                await this.loadAllHonden();
            } else {
                console.log(`📊 Honden al geladen: ${this.allHonden.length} honden, ${this.allTeven.length} teven`);
            }
            
            updateProgress('Initialiseer COI calculator...', 60);
            
            // Initialiseer COI calculator
            if (!this.coiCalculatorReady) {
                await this.initCOICalculator();
            }
            
            updateProgress('Render interface...', 90);
            
            // Toon de content
            this.renderContent(t);
            
            updateProgress('Klaar!', 100);
            
        } catch (error) {
            console.error('❌ Fout in loadContent():', error);
            content.innerHTML = `
                <div class="alert alert-danger">
                    <h5><i class="bi bi-exclamation-triangle"></i> Fout bij laden</h5>
                    <p>Er is een fout opgetreden bij het laden van de zoekfunctie.</p>
                    <p class="small">${error.message}</p>
                    <button class="btn btn-outline-danger btn-sm mt-2" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise"></i> Herladen
                    </button>
                </div>
            `;
        }
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
        `;
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
    }
    
    renderContent(t) {
        const content = document.getElementById('breedingContent');
        const reuen = this.allHonden.filter(h => 
            h.geslacht && (h.geslacht.toLowerCase() === 'reuen' || h.geslacht.toLowerCase() === 'reu')
        );
        const rassen = [...new Set(reuen.map(r => r.ras).filter(Boolean))].sort();
        
        // Bereken statistieken voor COI
        const hondenMetOuders = this.allHonden.filter(h => h.vaderId && h.moederId).length;
        const coiPercentage = Math.round((hondenMetOuders / this.allHonden.length) * 100);
        
        content.innerHTML = `
            <h5 class="mb-4">
                <i class="bi bi-search text-purple"></i> ${t('title')}
            </h5>
            <p class="text-muted mb-4">${t('description')}</p>
            
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>Database Status:</strong> 
                ${this.allHonden.length} honden geladen, 
                ${this.allTeven.length} teven, 
                ${reuen.length} reuen beschikbaar
                <br>
                <strong>COI Berekeningen:</strong> 
                ${this.coiCalculatorReady ? 
                    `<span class="text-success"><i class="bi bi-check-circle"></i> ACTIEF</span>` : 
                    `<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> NIET BESCHIKBAAR</span>`
                }
                ${this.coiCalculatorReady ? 
                    ` (${hondenMetOuders} honden met ouders, ${coiPercentage}%)` : 
                    ''
                }
                <br>
                <strong>Parent Relaties:</strong> 
                ${hondenMetOuders}/${this.allHonden.length} honden hebben beide ouders gedefinieerd
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">${t('selectTeef')}</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">${t('selectTeef')}</label>
                                <div class="position-relative">
                                    <input type="text" 
                                           class="form-control" 
                                           id="teefSearch" 
                                           placeholder="${t('selectTeefPlaceholder')}"
                                           autocomplete="off">
                                    <div class="autocomplete-dropdown" id="teefDropdown" style="display: none;">
                                        <div class="autocomplete-header">
                                            <small class="text-muted">${t('femalesFound')}: <span id="teefCount">0</span></small>
                                        </div>
                                        <div class="autocomplete-results" id="teefResults"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="selectedTeefInfo" class="small p-3 bg-light rounded">
                                <div class="text-muted text-center">
                                    <i class="bi bi-gender-female"></i>
                                    <p class="mb-0 mt-2">${t('selectFemaleToStart')}</p>
                                    <small class="text-muted">${this.allTeven.length} teven beschikbaar</small>
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
                                        ${rassen.map(ras => `
                                            <option value="${ras}">${ras}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label">${t('searchRadius')}</label>
                                    <select class="form-select" id="radiusFilter">
                                        ${t('radiusOptions').map((option, index) => `
                                            <option value="${index}" ${index === 0 ? 'selected' : ''}>${option}</option>
                                        `).join('')}
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
                                    <div class="row g-3">
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
                            <small class="text-muted">${reuen.length} reuen beschikbaar voor zoeken</small>
                            ${this.coiCalculatorReady ? 
                                `<br><small class="text-success"><i class="bi bi-check-circle"></i> COI berekeningen actief (${hondenMetOuders} honden met ouders)</small>` : 
                                `<br><small class="text-danger"><i class="bi bi-exclamation-triangle"></i> COI berekeningen niet beschikbaar</small>`
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-secondary mt-3">
                <h6><i class="bi bi-gear"></i> Technische Info</h6>
                <div class="row">
                    <div class="col-md-6">
                        <small><strong>Database:</strong> ${this.allHonden.length} honden geladen</small><br>
                        <small><strong>Teven:</strong> ${this.allTeven.length} beschikbaar</small><br>
                        <small><strong>Reuen:</strong> ${reuen.length} beschikbaar</small>
                    </div>
                    <div class="col-md-6">
                        <small><strong>Parent Relaties:</strong> ${hondenMetOuders} honden hebben beide ouders</small><br>
                        <small><strong>COI Ready:</strong> ${this.coiCalculatorReady ? 'Ja' : 'Nee'}</small><br>
                        <small><strong>Stamboom Manager:</strong> ${this.stamboomManager ? 'Ja' : 'Nee'}</small>
                    </div>
                </div>
            </div>
        `;
        
        this.initializeTeefSearch();
        this.initializeExcludeHondSearch();
        this.initializeExcludeKennelSearch();
        this.initializeFormValidation();
        this.initializeSearchButton();
    }
    
    // [Hier komen alle andere functies - IDENTIEK aan vorige versie]
    // initializeTeefSearch, searchTeven, showTeefDropdown, etc.
    // Allemaal hetzelfde houden behalve de bovenstaande kritieke wijzigingen
    
    initializeTeefSearch() {
        const teefSearch = document.getElementById('teefSearch');
        const teefDropdown = document.getElementById('teefDropdown');
        
        if (!teefSearch) {
            console.error('❌ teefSearch input niet gevonden!');
            return;
        }
        
        teefSearch.addEventListener('input', (e) => {
            clearTimeout(this.teefInputTimer);
            const searchTerm = e.target.value.trim();
            
            if (searchTerm.length === 0) {
                teefDropdown.style.display = 'none';
                return;
            }
            
            this.teefInputTimer = setTimeout(() => {
                this.searchTeven(searchTerm);
            }, 150);
        });
        
        teefSearch.addEventListener('focus', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 0) {
                this.searchTeven(searchTerm);
            }
        });
        
        teefSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = teefSearch.value.trim();
                if (searchTerm.length > 0) {
                    this.handleManualTeefEntry(searchTerm);
                }
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = teefDropdown.querySelector('.autocomplete-item[data-id]');
                if (firstItem) {
                    firstItem.focus();
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!teefDropdown.contains(e.target) && e.target.id !== 'teefSearch') {
                teefDropdown.style.display = 'none';
            }
        });
    }
    
    searchTeven(searchTerm) {
        const t = this.t.bind(this);
        
        if (!searchTerm || searchTerm.length === 0) {
            const dropdown = document.getElementById('teefDropdown');
            if (dropdown) dropdown.style.display = 'none';
            return;
        }
        
        console.log(`🔍 Zoek teven voor: "${searchTerm}" (${this.allTeven.length} teven beschikbaar)`);
        
        if (this.allTeven.length === 0) {
            console.warn('⚠️ Geen teven beschikbaar!');
            this.showTeefDropdown([], searchTerm);
            return;
        }
        
        const searchTerms = searchTerm.toLowerCase().split(' ');
        
        const filteredTeven = this.allTeven.filter(teef => {
            const searchableText = `
                ${teef.naam || ''}
                ${teef.kennelnaam || ''}
                ${teef.stamboomnr || ''}
            `.toLowerCase();
            
            return searchTerms.every(term => 
                searchableText.includes(term)
            );
        });
        
        console.log(`   ➡ ${filteredTeven.length} teven gevonden`);
        
        filteredTeven.sort((a, b) => {
            const aName = (a.naam || '').toLowerCase();
            const bName = (b.naam || '').toLowerCase();
            const aKennel = (a.kennelnaam || '').toLowerCase();
            const bKennel = (b.kennelnaam || '').toLowerCase();
            
            if (aName === searchTerm.toLowerCase() && bName !== searchTerm.toLowerCase()) return -1;
            if (bName === searchTerm.toLowerCase() && aName !== searchTerm.toLowerCase()) return 1;
            
            if (aName.startsWith(searchTerm.toLowerCase()) && !bName.startsWith(searchTerm.toLowerCase())) return -1;
            if (bName.startsWith(searchTerm.toLowerCase()) && !aName.startsWith(searchTerm.toLowerCase())) return 1;
            
            if (aKennel.includes(searchTerm.toLowerCase()) && !bKennel.includes(searchTerm.toLowerCase())) return -1;
            if (bKennel.includes(searchTerm.toLowerCase()) && !aKennel.includes(searchTerm.toLowerCase())) return 1;
            
            return aName.localeCompare(bName);
        });
        
        this.showTeefDropdown(filteredTeven, searchTerm);
    }
    
    showTeefDropdown(teven, searchTerm) {
        const t = this.t.bind(this);
        const dropdown = document.getElementById('teefDropdown');
        const resultsDiv = document.getElementById('teefResults');
        const countSpan = document.getElementById('teefCount');
        
        if (!dropdown || !resultsDiv || !countSpan) return;
        
        if (teven.length === 0) {
            resultsDiv.innerHTML = `
                <div class="autocomplete-item text-muted p-3 text-center">
                    <i class="bi bi-search me-2"></i>${t('noFemalesFound')}
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
            countSpan.textContent = teven.length;
            
            const displayTeven = teven.slice(0, 15);
            
            resultsDiv.innerHTML = displayTeven.map(teef => {
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
                
                const displayName = teef.naam ? 
                    `${highlightText(teef.naam)} ${teef.kennelnaam ? `${highlightText(teef.kennelnaam)}` : ''}` : 
                    t('unknown');
                
                // Toon parent info voor debugging
                const parentInfo = teef.vaderId && teef.moederId ? 
                    `<small class="text-success">✓ Beide ouders bekend</small>` : 
                    `<small class="text-warning">⚠ Ouders onbekend</small>`;
                
                return `
                    <div class="autocomplete-item" data-id="${teef.id}" tabindex="0">
                        <div class="fw-bold">
                            <i class="bi bi-gender-female text-danger me-1"></i>
                            ${displayName}
                        </div>
                        <div class="small text-muted">
                            ${teef.stamboomnr ? t('pedigree') + ': ' + teef.stamboomnr : ''}
                            ${teef.ras ? ' • ' + t('breed') + ': ' + teef.ras : ''}
                            <br>${parentInfo}
                        </div>
                    </div>
                `;
            }).join('');
            
            if (teven.length > 15) {
                resultsDiv.innerHTML += `
                    <div class="autocomplete-item text-muted p-2 text-center">
                        <small>${t('moreResults').replace('meer...', `En nog ${teven.length - 15} ${t('moreResults')}`)}</small>
                    </div>
                `;
            }
            
            dropdown.style.display = 'block';
        }
        
        resultsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const teefId = item.getAttribute('data-id');
                const manualEntry = item.getAttribute('data-manual');
                
                if (teefId) {
                    this.selectTeef(teefId);
                } else if (manualEntry) {
                    this.handleManualTeefEntry(manualEntry);
                }
                
                dropdown.style.display = 'none';
                const teefSearch = document.getElementById('teefSearch');
                if (teefSearch) teefSearch.value = '';
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
                        const teefSearch = document.getElementById('teefSearch');
                        if (teefSearch) teefSearch.focus();
                    }
                }
            });
        });
    }
    
    async selectTeef(teefId) {
        console.log(`✅ Teef geselecteerd: ${teefId}`);
        
        const teef = this.allHonden.find(h => h.id == teefId);
        
        if (!teef) {
            console.error(`❌ Teef niet gevonden met ID: ${teefId}`);
            return;
        }
        
        this.selectedTeef = teef;
        this.updateTeefInfoDisplay(teef);
        
        const coiInput = document.getElementById('coiFilter');
        if (coiInput && coiInput.value) {
            this.validateCOIInput(coiInput);
        }
    }
    
    updateTeefInfoDisplay(teef) {
        const t = this.t.bind(this);
        const infoDiv = document.getElementById('selectedTeefInfo');
        
        if (!infoDiv) return;
        
        if (teef.manualEntry) {
            infoDiv.innerHTML = `
                <h6>${teef.naam}</h6>
                <div class="alert alert-warning small p-2 mb-2">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    <small>${t('manuallyEnteredFemale')}</small>
                </div>
                <div class="text-muted">
                    <p class="small mb-2"><i class="bi bi-info-circle"></i> ${t('coiNotAvailable')}.</p>
                </div>
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> ${t('back')} selectie
                    </button>
                </div>
            `;
        } else {
            let teefCOI = '0.000';
            let teefCOIColor = 'text-muted';
            
            if (this.coiCalculator2 && teef.id && teef.vaderId && teef.moederId) {
                try {
                    teefCOI = this.coiCalculator2.calculateCOI(teef.id);
                    const coiValue = parseFloat(teefCOI);
                    teefCOIColor = this.getCOIColor(coiValue);
                    console.log(`✅ COI berekend voor ${teef.naam}: ${teefCOI}%`);
                } catch (error) {
                    console.error(`❌ Fout bij COI berekening teef ${teef.naam}:`, error);
                    teefCOI = 'Fout';
                    teefCOIColor = 'text-danger';
                }
            } else if (!teef.vaderId || !teef.moederId) {
                teefCOI = 'Onbekend';
                teefCOIColor = 'text-warning';
            }
            
            infoDiv.innerHTML = `
                <h6 class="mb-2">${teef.naam || t('unknown')} ${teef.kennelnaam ? teef.kennelnaam : ''}</h6>
                <div class="mb-3">
                    <strong>${t('pedigree')}:</strong> ${teef.stamboomnr || '-'}
                    <br>
                    <strong>${t('coi6Gen')}:</strong> 
                    <span class="${teefCOIColor}">
                        ${teefCOI}%
                        ${(!teef.vaderId || !teef.moederId) ? 
                            `<br><small class="text-warning">(ouders onbekend)</small>` : 
                            ''
                        }
                    </span>
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
                
                <div class="alert alert-light small p-2">
                    <i class="bi bi-info-circle me-1"></i>
                    <small>
                        Vader: ${teef.vaderId ? `ID ${teef.vaderId}` : 'onbekend'}, 
                        Moeder: ${teef.moederId ? `ID ${teef.moederId}` : 'onbekend'}
                    </small>
                </div>
                
                <hr class="my-2">
                <div class="text-end">
                    <button class="btn btn-sm btn-outline-purple" id="clearTeefBtn">
                        <i class="bi bi-x"></i> ${t('back')} selectie
                    </button>
                </div>
            `;
        }
        
        const clearBtn = document.getElementById('clearTeefBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.selectedTeef = null;
                infoDiv.innerHTML = `
                    <div class="text-muted text-center">
                        <i class="bi bi-gender-female"></i>
                        <p class="mb-0 mt-2">${t('selectFemaleToStart')}</p>
                        <small class="text-muted">${this.allTeven.length} teven beschikbaar</small>
                    </div>
                `;
                
                const coiInput = document.getElementById('coiFilter');
                if (coiInput && coiInput.value) {
                    this.validateCOIInput(coiInput);
                }
            });
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
                if (lowerValue === '0' || lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1' || lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '2' || lowerValue === '3' || lowerValue === '3') return 'text-danger fw-bold';
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
                if (lowerValue === 'tgaa negatief' || lowerValue === 'negatief' || lowerValue === 'tg aa negatief') {
                    return 'text-success fw-bold';
                }
                return 'text-danger fw-bold';
                
            case 'ed':
                if (lowerValue === '0' || lowerValue === '0') return 'text-success fw-bold';
                if (lowerValue === '1' || lowerValue === '1') return 'text-orange fw-bold';
                if (lowerValue === '2' || lowerValue === '2' || lowerValue === '3' || lowerValue === 'ed3') return 'text-danger fw-bold';
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
    
    async filterByCOI(reuen, teefId, maxCOI) {
        if (!this.coiCalculator2 || !teefId || maxCOI <= 0) {
            console.log(`⚠️ COI filter niet actief: calculator=${!!this.coiCalculator2}, teefId=${teefId}, maxCOI=${maxCOI}`);
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
                    <div class="progress mt-2" style="height: 5px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             role="progressbar" 
                             style="width: 0%"
                             id="coiProgressBar"></div>
                    </div>
                </div>
            `;
        }
        
        try {
            for (let i = 0; i < reuen.length; i++) {
                const reu = reuen[i];
                
                // Update progress
                if (resultsDiv) {
                    const progress = Math.round(((i + 1) / reuen.length) * 100);
                    const progressBar = document.getElementById('coiProgressBar');
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                }
                
                try {
                    const comboCOI = await this.calculateComboCOI(teefId, reu.id);
                    const comboValue = parseFloat(comboCOI) || 0;
                    
                    console.log(`   ${i+1}/${reuen.length}: ${reu.naam} → combo 6g=${comboValue}% (max: ${maxCOI}%) → ${comboValue <= maxCOI ? '✓ PASS' : '✗ FAIL'}`);
                    
                    if (!reu._coiData) {
                        reu._coiData = {};
                    }
                    reu._coiData.combo = comboCOI;
                    reu._coiData.passesFilter = comboValue <= maxCOI;
                    
                    if (comboValue <= maxCOI) {
                        filteredReuen.push(reu);
                    }
                    
                } catch (calcError) {
                    console.error(`Fout bij COI berekening reu ${reu.id} (${reu.naam}):`, calcError);
                    
                    if (!reu._coiData) {
                        reu._coiData = {};
                    }
                    reu._coiData.combo = '0.000';
                    reu._coiData.passesFilter = false;
                    
                    // Voeg toe als de fout niet kritiek was (bijv. ouders ontbreken)
                    filteredReuen.push(reu);
                }
            }
            
        } catch (error) {
            console.error('❌ Fout bij COI filtering:', error);
        }
        
        console.log(`✅ COI filtering voltooid: ${filteredReuen.length} van ${reuen.length} reuen voldoen aan max ${maxCOI}%`);
        return filteredReuen;
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
                <p class="small text-muted">${this.allHonden.length} honden beschikbaar voor zoeken</p>
                <div class="alert alert-info small mt-2">
                    <i class="bi bi-info-circle"></i>
                    COI calculator: ${this.coiCalculatorReady ? 'Actief' : 'Niet beschikbaar'}
                </div>
            </div>
        `;
        
        const criteria = this.getSearchCriteria();
        
        let reuen = this.allHonden.filter(h => 
            h.geslacht && (h.geslacht.toLowerCase() === 'reuen' || h.geslacht.toLowerCase() === 'reu')
        );
        console.log(`🔍 Start zoeken met ${reuen.length} reuen, COI filter: ${criteria.maxCOI}%`);
        
        if (criteria.ras) {
            reuen = reuen.filter(r => r.ras === criteria.ras);
            console.log(`   ➡ Na ras filter: ${reuen.length} reuen`);
        }
        
        if (criteria.bornAfter) {
            const minDate = this.parseDate(criteria.bornAfter);
            if (minDate) {
                reuen = reuen.filter(r => {
                    if (!r.geboortedatum) return false;
                    
                    try {
                        const reuDate = this.parseHondenDate(r.geboortedatum);
                        return reuDate && reuDate >= minDate;
                    } catch (e) {
                        return false;
                    }
                });
                console.log(`   ➡ Na datum filter: ${reuen.length} reuen`);
            }
        }
        
        reuen = this.filterByExcludedHonden(reuen, criteria.excludeHonden, criteria.excludeGenerations);
        console.log(`   ➡ Na exclusie honden: ${reuen.length} reuen`);
        
        reuen = this.filterByExcludedKennels(reuen, criteria.excludeKennels, criteria.excludeKennelGenerations);
        console.log(`   ➡ Na exclusie kennels: ${reuen.length} reuen`);
        
        reuen = this.filterByHealth(reuen, criteria.health);
        console.log(`   ➡ Na gezondheidsfilter: ${reuen.length} reuen`);
        
        if (criteria.maxCOI > 0 && this.selectedTeef && !this.selectedTeef.manualEntry && this.selectedTeef.id) {
            console.log(`🔬 Pas COI filter toe: max ${criteria.maxCOI}% met teef ${this.selectedTeef.naam}`);
            reuen = await this.filterByCOI(reuen, this.selectedTeef.id, criteria.maxCOI);
            console.log(`   ➡ Na COI filter: ${reuen.length} reuen`);
        } else if (criteria.maxCOI > 0) {
            console.log(`⚠️ COI filter ingesteld op ${criteria.maxCOI}% maar geen geldige teef geselecteerd`);
        }
        
        reuen = this.sortByHealthScore(reuen);
        
        setTimeout(() => {
            if (reuen.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>${t('noResults')}</strong><br>
                        ${t('tryAgain')}
                        ${criteria.maxCOI > 0 ? `<br><small>COI filter: ${criteria.maxCOI}%</small>` : ''}
                        ${this.selectedTeef ? `<br><small>Geselecteerde teef: ${this.selectedTeef.naam}</small>` : ''}
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
                                ${this.generateResultsTable(reuen, t, criteria.maxCOI)}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-muted text-center mt-3">
                        <small>${reuen.length} ${t('searchButton').toLowerCase()} gevonden</small>
                        ${criteria.maxCOI > 0 ? `<br><small>Maximale COI 6g: ${criteria.maxCOI}%</small>` : ''}
                        ${criteria.excludeHonden.length > 0 ? `<br><small>${criteria.excludeHonden.length} honden uitgesloten in ${criteria.excludeGenerations} generaties</small>` : ''}
                        ${criteria.excludeKennels.length > 0 ? `<br><small>${criteria.excludeKennels.length} kennels uitgesloten in ${criteria.excludeKennelGenerations} generaties</small>` : ''}
                        ${this.selectedTeef && !this.selectedTeef.manualEntry ? `<br><small>Toont combinatie COI 6g met ${this.selectedTeef.naam}</small>` : ''}
                        <br><small><i class="bi bi-info-circle"></i> ${t('pedigreeTooltip')}</small>
                    </div>
                `;
                
                this.attachReuNameClickEvents();
            }
        }, 100);
    }
    
    generateResultsTable(reuen, t, maxCOI) {
        const showCOIColumn = maxCOI > 0 && this.selectedTeef && !this.selectedTeef.manualEntry;
        
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
            let comboCOIColor = 'text-muted';
            let comboCOITooltip = '';
            
            if (showCOIColumn) {
                if (!reu._coiData || !reu._coiData.combo) {
                    comboCOI = '?';
                    comboCOIColor = 'text-warning';
                    comboCOITooltip = 'COI niet berekend';
                } else {
                    comboCOI = reu._coiData.combo || '0.000';
                    const coiValue = parseFloat(comboCOI);
                    if (!isNaN(coiValue)) {
                        comboCOIColor = this.getCOIColor(coiValue);
                        comboCOITooltip = `Combinatie COI 6g: ${comboCOI}%`;
                    } else {
                        comboCOIColor = 'text-danger';
                        comboCOITooltip = 'Ongeldige COI waarde';
                    }
                }
            }
            
            // Check of deze reu ouders heeft voor COI berekening
            const heeftOuders = reu.vaderId && reu.moederId;
            const parentInfo = heeftOuders ? 
                '✓ Ouders bekend' : 
                '⚠ Ouders onbekend';
            
            return `
                <tr data-reu-id="${reu.id}" data-heeft-ouders="${heeftOuders}">
                    <td class="small reu-name-cell" data-reu-id="${reu.id}" data-reu-name="${displayName}">
                        <span class="reu-name-link" 
                              title="${t('pedigreeTooltip')}"
                              data-reu-id="${reu.id}"
                              data-reu-name="${displayName}">
                            ${displayName}
                        </span>
                        <br>
                        <small class="text-muted">${parentInfo}</small>
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
                    <td class="${comboCOIColor} text-center" title="${comboCOITooltip}">
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
    
    // [Alle overige functies identiek houden aan vorige versie]
    // validateDateInput, validateCOIInput, parseDate, handleManualTeefEntry,
    // initializeExcludeHondSearch, initializeExcludeKennelSearch, etc.
    
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

// Styling (zelfde als vorige versie)
const style = document.createElement('style');
style.textContent = `
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
    
    .autocomplete-results::-webkit-scrollbar {
        width: 8px;
    }
    
    .autocomplete-results::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    .autocomplete-results::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    
    .autocomplete-results::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
    
    #selectedTeefInfo h6 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    
    #selectedTeefInfo .row {
        margin-bottom: 0.5rem;
    }
    
    #selectedTeefInfo .small {
        font-size: 0.85rem;
    }
    
    #selectedTeefInfo hr {
        margin: 0.75rem 0;
    }
    
    #bornAfterFilter:focus {
        border-color: #6610f2;
        box-shadow: 0 0 0 0.25rem rgba(102, 16, 242, 0.25);
    }
    
    #coiFilter:focus {
        border-color: #6610f2;
        box-shadow: 0 0 0 0.25rem rgba(102, 16, 242, 0.25);
    }
    
    .input-group-text {
        background-color: #f8f9fa;
        color: #495057;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
    }
    
    .is-invalid:focus {
        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
    }
    
    td.text-success { font-weight: bold; }
    td.text-warning { font-weight: bold; }
    td.text-orange { font-weight: bold; }
    td.text-danger { font-weight: bold; }
    
    .table th br {
        display: block;
        content: "";
        margin-top: 2px;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .reu-name-link:active {
        animation: pulse 0.2s;
    }
    
    #excludedHondenList .list-group-item {
        padding: 0.5rem 1rem;
        border-left: 3px solid #dc3545;
    }
    
    #excludedKennelsList .list-group-item {
        padding: 0.5rem 1rem;
        border-left: 3px solid #ffc107;
    }
    
    #excludedHondenList .badge,
    #excludedKennelsList .badge {
        font-size: 0.7rem;
    }
    
    .bi-gender-male {
        color: #0d6efd;
    }
    
    .bi-gender-female {
        color: #dc3545;
    }
    
    .bi-house-door {
        color: #6c757d;
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
    
    .progress-bar {
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);