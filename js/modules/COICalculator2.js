// COICalculator2 V9.5 - MET OUDER-KIND COMBINATIE DETECTIE

class COICalculator2 {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        
        // Bouw lookup met ALLE data
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator2 V9.5: ${this._dogMap.size} honden geladen (6 gen, 3 decimalen)`);
    }

    // ✅ NIEUWE METHODE: Laad alle honden via paginatie
    static async loadAllDogsWithPagination(service) {
        try {
            console.log('📥 COICalculator2: Start paginatie om ALLE honden te laden...');
            
            let allDogs = [];
            let currentPage = 1;
            const pageSize = 1000; // Supabase maximum
            let hasMorePages = true;
            
            while (hasMorePages) {
                console.log(`📄 Laad pagina ${currentPage}...`);
                
                let result;
                try {
                    // Probeer verschillende method signatures
                    if (typeof service.getHonden === 'function') {
                        // Methode 1: Met paginatie parameters
                        if (service.getHonden.length >= 2) {
                            result = await service.getHonden(currentPage, pageSize);
                        } 
                        // Methode 2: Zonder parameters
                        else {
                            result = await service.getHonden();
                        }
                    } else {
                        console.error('❌ service.getHonden is geen functie');
                        break;
                    }
                } catch (error) {
                    console.error(`❌ Fout bij laden pagina ${currentPage}:`, error);
                    break;
                }
                
                // Bepaal hoe we de data moeten extraheren
                let dogsArray = [];
                
                if (Array.isArray(result)) {
                    dogsArray = result;
                    hasMorePages = dogsArray.length === pageSize;
                } else if (result && Array.isArray(result.honden)) {
                    dogsArray = result.honden;
                    hasMorePages = result.heeftVolgende || dogsArray.length === pageSize;
                } else if (result && Array.isArray(result.data)) {
                    dogsArray = result.data;
                    hasMorePages = result.data && result.data.length === pageSize;
                } else {
                    console.warn('⚠️ Onbekend resultaat formaat bij paginatie:', result);
                    // Probeer zonder paginatie
                    hasMorePages = false;
                    if (result) dogsArray = [result];
                }
                
                if (dogsArray.length > 0) {
                    allDogs = allDogs.concat(dogsArray);
                    console.log(`   ➡ Pagina ${currentPage}: ${dogsArray.length} honden (totaal: ${allDogs.length})`);
                } else {
                    console.log(`   ➡ Pagina ${currentPage}: Geen honden gevonden`);
                    hasMorePages = false;
                }
                
                // Controleer of er nog meer pagina's zijn
                if (!hasMorePages || dogsArray.length < pageSize) {
                    hasMorePages = false;
                } else {
                    currentPage++;
                }
                
                // Veiligheidslimiet voor oneindige lus
                if (currentPage > 100) {
                    console.warn('⚠️ Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                    break;
                }
                
                // Kleine pauze om de server niet te overbelasten
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            console.log(`✅ Paginatie voltooid: ${allDogs.length} honden geladen`);
            
            // Sorteer op naam voor consistentie
            allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            return allDogs;
            
        } catch (error) {
            console.error('❌ FATALE FOUT bij paginatie:', error);
            return [];
        }
    }

    // ✅ NIEUWE METHODE: Laad alle honden via Supabase direct
    static async loadAllDogsFromSupabase(supabaseClient) {
        try {
            console.log('📥 COICalculator2: Laad honden direct vanuit Supabase...');
            
            let allDogs = [];
            let start = 0;
            const pageSize = 1000;
            let hasMore = true;
            
            while (hasMore) {
                console.log(`📄 Laad batch ${start} tot ${start + pageSize}...`);
                
                const { data, error } = await supabaseClient
                    .from('honden')
                    .select('*')
                    .order('id', { ascending: true })
                    .range(start, start + pageSize - 1);
                
                if (error) {
                    console.error('❌ Supabase error:', error);
                    break;
                }
                
                if (data && data.length > 0) {
                    allDogs = allDogs.concat(data);
                    console.log(`   ➡ Batch: ${data.length} honden (totaal: ${allDogs.length})`);
                    
                    if (data.length < pageSize) {
                        hasMore = false;
                    } else {
                        start += pageSize;
                    }
                } else {
                    hasMore = false;
                }
                
                // Veiligheidslimiet
                if (start > 100000) {
                    console.warn('⚠️ Veiligheidslimiet bereikt');
                    break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            console.log(`✅ Supabase laden voltooid: ${allDogs.length} honden`);
            return allDogs;
            
        } catch (error) {
            console.error('❌ Fout bij Supabase direct laden:', error);
            return [];
        }
    }

    // ✅ NIEUWE METHODE: Factory methode om calculator te maken met paginatie
    static async createWithPagination(service) {
        console.log('🔄 COICalculator2.createWithPagination() gestart');
        
        let allDogs = [];
        
        // Probeer verschillende methodes
        if (service && typeof service.getHonden === 'function') {
            allDogs = await COICalculator2.loadAllDogsWithPagination(service);
        } else if (window.supabase) {
            allDogs = await COICalculator2.loadAllDogsFromSupabase(window.supabase);
        } else if (window.hondenService && typeof window.hondenService.getHonden === 'function') {
            console.log('🔄 Gebruik window.hondenService');
            allDogs = await COICalculator2.loadAllDogsWithPagination(window.hondenService);
        } else {
            console.error('❌ Geen geldige service gevonden voor paginatie');
            return null;
        }
        
        if (allDogs.length === 0) {
            console.error('❌ Geen honden geladen via paginatie!');
            return null;
        }
        
        console.log(`✅ COICalculator2 gemaakt met ${allDogs.length} honden via paginatie`);
        return new COICalculator2(allDogs);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            console.log(`\n🔍 START COI BEREKENING VOOR ID: ${dogId} (${this._dogMap.size} honden beschikbaar)`);
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden in database`);
                return '0.000';
            }
            
            console.log(`📋 ${dog.naam} (ID: ${dog.id}) - Vader: ${dog.vader_id}, Moeder: ${dog.moeder_id}`);

            // Check directe ouder-kind combinatie (vader-dochter of moeder-zoon)
            if (this._isParentChildCombination(dog)) {
                console.log(`⚠️ Ouder-Kind combinatie -> 25.000%`);
                return '25.000';
            }

            // Check broer-zus combinatie
            if (this._isFullSiblingCombination(dog)) {
                console.log(`⚠️ Broer-Zus combinatie -> 25.000%`);
                return '25.000';
            }

            // Basis checks
            if (!dog.vader_id || !dog.moeder_id) {
                console.log(`⚠️ Geen complete ouders -> 0.000%`);
                return '0.000';
            }
            
            if (dog.vader_id === dog.moeder_id) {
                console.log(`⚠️ Zelfde ouders -> 25.000%`);
                return '25.000';
            }

            // Bereken voor 6 generaties
            console.log(`\n🧮 BEREKENING 6 GENERATIES:`);
            const coi6Gen = this._calculateComplexCOI(dogId, 6);
            const result = (coi6Gen * 100).toFixed(3);  // 6 generaties met 3 decimalen
            
            console.log(`\n✅ RESULTAAT:`);
            console.log(`   ${dog.naam}: COI 6-gen = ${result}%`);
            
            // Toon officiële IK waarde als beschikbaar
            if (dog.ik !== undefined) {
                // Formatteer officiële IK ook met 3 decimalen
                const officialIK = parseFloat(dog.ik).toFixed(3);
                console.log(`   Officiële database: IK = ${officialIK}%`);
            } else {
                console.log(`   Officiële database: IK = n.v.t.`);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ FATALE FOUT:', error);
            return '0.000';
        }
    }

    // ✅ NIEUWE METHODE: Bereken combinatie COI tussen twee honden
    calculateCombinationCOI(femaleId, maleId) {
        try {
            console.log(`\n🔬 COMBINATIE COI BEREKENING: ${femaleId} × ${maleId}`);
            
            const female = this.getDogById(Number(femaleId));
            const male = this.getDogById(Number(maleId));
            
            if (!female || !male) {
                console.log('❌ Teef of reu niet gevonden');
                return '0.000';
            }
            
            console.log(`📋 Teef: ${female.naam} (ID: ${female.id})`);
            console.log(`📋 Reu: ${male.naam} (ID: ${male.id})`);
            
            // Maak virtuele pup met deze ouders
            const virtualPuppyId = -Date.now(); // Uniek negatief ID
            const virtualPuppy = {
                id: virtualPuppyId,
                naam: `VIRTUEEL-${female.id}x${male.id}`,
                geslacht: 'onbekend',
                vader_id: male.id,
                moeder_id: female.id,
                vader: male.naam,
                moeder: female.naam,
                kennelnaam: 'VIRTUELE-COMBINATIE',
                stamboomnr: `VIRT-${female.id}-${male.id}`,
                geboortedatum: new Date().toISOString().split('T')[0],
                vachtkleur: `${male.vachtkleur || ''}/${female.vachtkleur || ''}`.trim(),
                heupdysplasie: null,
                elleboogdysplasie: null,
                patella: null,
                ogen: null,
                ogenverklaring: null,
                dandyWalker: null,
                schildklier: null,
                schildklierverklaring: null,
                land: null,
                postcode: null,
                opmerkingen: null
            };
            
            // Maak tijdelijke dataset met virtuele pup
            const tempDogs = [...this.allDogs, virtualPuppy];
            const tempCalculator = new COICalculator2(tempDogs);
            
            // Bereken COI voor de virtuele pup
            const result = tempCalculator.calculateCOI(virtualPuppyId);
            
            console.log(`✅ Combinatie COI: ${female.naam} × ${male.naam} = ${result}%`);
            return result;
            
        } catch (error) {
            console.error('❌ Fout bij combinatie COI berekening:', error);
            return '0.000';
        }
    }

    // ✅ Check ouder-kind combinatie (vader-dochter of moeder-zoon)
    _isParentChildCombination(dog) {
        if (!dog.vader_id || !dog.moeder_id) return false;
        
        // Check vader-dochter: is de vader van deze hond ook de vader van één van de ouders?
        const vader = this.getDogById(dog.vader_id);
        const moeder = this.getDogById(dog.moeder_id);
        
        if (!vader || !moeder) {
            console.log(`   ⚠️ Kan ouders niet vinden voor combinatie check`);
            return false;
        }
        
        // Vader-dochter: vader = vader van moeder
        if (vader.id === moeder.vader_id) {
            console.log(`   ✅ Vader-dochter combinatie gedetecteerd!`);
            console.log(`      Hond: ${dog.naam} (ID: ${dog.id})`);
            console.log(`      Vader: ${vader.naam} (ID: ${vader.id})`);
            console.log(`      Moeder: ${moeder.naam} (ID: ${moeder.id}) is dochter van ${vader.naam}`);
            return true;
        }
        
        // Moeder-zoon: moeder = moeder van vader
        if (moeder.id === vader.moeder_id) {
            console.log(`   ✅ Moeder-zoon combinatie gedetecteerd!`);
            console.log(`      Hond: ${dog.naam} (ID: ${dog.id})`);
            console.log(`      Moeder: ${moeder.naam} (ID: ${moeder.id})`);
            console.log(`      Vader: ${vader.naam} (ID: ${vader.id}) is zoon van ${moeder.naam}`);
            return true;
        }
        
        // Vader = grootvader via moeder (vader van moeder)
        if (vader.vader_id && moeder.vader_id && vader.id === moeder.vader_id) {
            console.log(`   ✅ Vader = grootvader via moeder combinatie!`);
            return true;
        }
        
        // Moeder = grootmoeder via vader (moeder van vader)
        if (vader.moeder_id && moeder.moeder_id && moeder.id === vader.moeder_id) {
            console.log(`   ✅ Moeder = grootmoeder via vader combinatie!`);
            return true;
        }
        
        return false;
    }

    // ✅ Check broer-zus combinatie
    _isFullSiblingCombination(dog) {
        if (!dog.vader_id || !dog.moeder_id) return false;
        
        const vader = this.getDogById(dog.vader_id);
        const moeder = this.getDogById(dog.moeder_id);
        
        if (!vader || !moeder) {
            console.log(`   ⚠️ Kan ouders niet vinden voor sibling check`);
            return false;
        }
        
        // Check of de ouders broer en zus zijn (zelfde ouders)
        const isSiblings = vader.vader_id && vader.moeder_id && 
               moeder.vader_id && moeder.moeder_id &&
               vader.vader_id === moeder.vader_id && 
               vader.moeder_id === moeder.moeder_id;
        
        if (isSiblings) {
            console.log(`   ✅ Broer-zus combinatie gedetecteerd!`);
            console.log(`      Vader: ${vader.naam} en Moeder: ${moeder.naam} hebben dezelfde ouders`);
        }
        
        return isSiblings;
    }

    // ✅ CORRECTE COMPLEXE BEREKENING
    _calculateComplexCOI(dogId, maxGenerations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vader_id || !dog.moeder_id) {
            console.log(`   ⚠️ Hond of ouders niet gevonden in database`);
            return 0;
        }
        
        console.log(`   Berekenen over ${maxGenerations} generaties...`);
        
        // Vind ALLE unieke voorouders van vader en moeder
        const vaderAncestors = new Map(); // ID -> {depth: minimale diepte}
        const moederAncestors = new Map();
        
        this._findAncestorsWithDepth(dog.vader_id, 1, maxGenerations, vaderAncestors);
        this._findAncestorsWithDepth(dog.moeder_id, 1, maxGenerations, moederAncestors);
        
        console.log(`   Vader: ${vaderAncestors.size} unieke voorouders`);
        console.log(`   Moeder: ${moederAncestors.size} unieke voorouders`);
        
        if (vaderAncestors.size === 0 || moederAncestors.size === 0) {
            console.log(`   ⚠️ Geen voorouders gevonden voor één van de ouders`);
            return 0;
        }
        
        // Vind gemeenschappelijke voorouders
        let totalCOI = 0;
        let commonCount = 0;
        
        for (const [ancestorId, vaderDepth] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                
                // Bereken bijdrage voor deze voorouder
                const contribution = this._calculateAncestorContributionCorrect(
                    dog.vader_id,
                    dog.moeder_id,
                    ancestorId,
                    maxGenerations
                );
                
                if (contribution > 0.00001) {
                    const ancestorDog = this.getDogById(ancestorId);
                    const ancestorName = ancestorDog?.naam || `ID:${ancestorId}`;
                    const viaVaderDepth = vaderAncestors.get(ancestorId);
                    const viaMoederDepth = moederAncestors.get(ancestorId);
                    console.log(`   ➡ ${ancestorName}: ${(contribution*100).toFixed(6)}% (via V:${viaVaderDepth}, M:${viaMoederDepth} gen)`);
                    totalCOI += contribution;
                }
            }
        }
        
        console.log(`   ${commonCount} gemeenschappelijke voorouders gevonden`);
        console.log(`   Totaal COI: ${(totalCOI*100).toFixed(6)}%`);
        
        return totalCOI;
    }

    _findAncestorsWithDepth(dogId, currentDepth, maxDepth, resultMap) {
        if (!dogId || currentDepth > maxDepth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`   ⚠️ Hond ID ${dogId} niet gevonden in database bij het zoeken naar voorouders`);
            return;
        }
        
        if (dog.vader_id) {
            // Bewaar de minimale diepte waarop we deze voorouder vinden
            const existingDepth = resultMap.get(dog.vader_id);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.vader_id, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.vader_id, currentDepth + 1, maxDepth, resultMap);
        }
        
        if (dog.moeder_id) {
            const existingDepth = resultMap.get(dog.moeder_id);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.moeder_id, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.moeder_id, currentDepth + 1, maxDepth, resultMap);
        }
    }

    _calculateAncestorContributionCorrect(vader_id, moeder_id, ancestorId, maxGenerations) {
        // Vind ALLE routes van vader naar voorouder
        const routesVader = this._findAllRoutes(vader_id, ancestorId, maxGenerations - 1);
        const routesMoeder = this._findAllRoutes(moeder_id, ancestorId, maxGenerations - 1);
        
        if (routesVader.length === 0 || routesMoeder.length === 0) return 0;
        
        let totalContribution = 0;
        
        // Voor elke combinatie van routes
        for (const routeV of routesVader) {
            const n = routeV.length; // Aantal stappen van vader naar voorouder
            
            for (const routeM of routesMoeder) {
                const m = routeM.length; // Aantal stappen van moeder naar voorouder
                
                // Formule: (0.5)^(n + m + 1) * (1 + fA)
                // waar n = stappen van vader naar A, m = stappen van moeder naar A
                const baseContribution = Math.pow(0.5, n + m + 1);
                
                // Voeg eventuele COI van voorouder zelf toe
                const ancestorDog = this.getDogById(ancestorId);
                let fA = 0;
                if (ancestorDog && ancestorDog.ik) {
                    fA = ancestorDog.ik / 100;
                }
                
                const contribution = baseContribution * (1 + fA);
                totalContribution += contribution;
            }
        }
        
        return totalContribution;
    }

    _findAllRoutes(startId, targetId, maxDepth, currentDepth = 0, currentPath = [], allRoutes = [], visited = new Set()) {
        if (currentDepth > maxDepth || visited.has(startId)) {
            return allRoutes;
        }
        
        if (startId === targetId) {
            allRoutes.push([...currentPath]);
            return allRoutes;
        }
        
        visited.add(startId);
        const dog = this.getDogById(startId);
        
        if (!dog) {
            console.log(`   ⚠️ Hond ID ${startId} niet gevonden bij route zoeken`);
            return allRoutes;
        }
        
        if (dog.vader_id) {
            currentPath.push(dog.vader_id);
            this._findAllRoutes(dog.vader_id, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
            currentPath.pop();
        }
        
        if (dog.moeder_id) {
            currentPath.push(dog.moeder_id);
            this._findAllRoutes(dog.moeder_id, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
            currentPath.pop();
        }
        
        return allRoutes;
    }

    // ✅ DEBUG FUNCTIES
    _debugStamboom(dogId, depth, currentDepth = 0, prefix = '') {
        if (currentDepth > depth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`${prefix}[Hond ID ${dogId} niet gevonden]`);
            return;
        }
        
        console.log(`${prefix}${dog.naam} (${dog.id}) [V:${dog.vader_id}, M:${dog.moeder_id}]`);
        
        if (dog.vader_id && currentDepth < depth) {
            this._debugStamboom(dog.vader_id, depth, currentDepth + 1, prefix + '  ├─V ');
        }
        if (dog.moeder_id && currentDepth < depth) {
            this._debugStamboom(dog.moeder_id, depth, currentDepth + 1, prefix + '  └─M ');
        }
    }

    // ✅ TEST OUDER-KIND COMBINATIE
    testParentChildCombination(dogId) {
        console.log(`\n🧪 TEST OUDER-KIND COMBINATIE VOOR ID: ${dogId}`);
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`❌ Hond ${dogId} niet gevonden in database`);
            return;
        }
        
        console.log(`   Hond: ${dog.naam} (ID: ${dog.id})`);
        console.log(`   Vader ID: ${dog.vader_id}, Moeder ID: ${dog.moeder_id}`);
        
        const isParentChild = this._isParentChildCombination(dog);
        const isSiblings = this._isFullSiblingCombination(dog);
        
        console.log(`   Is ouder-kind combinatie: ${isParentChild}`);
        console.log(`   Is broer-zus combinatie: ${isSiblings}`);
        
        if (dog.vader_id && dog.moeder_id) {
            const vader = this.getDogById(dog.vader_id);
            const moeder = this.getDogById(dog.moeder_id);
            
            if (vader) {
                console.log(`   Vader: ${vader.naam} (ID: ${vader.id})`);
                console.log(`      Vader's ouders: ${vader.vader_id}, ${vader.moeder_id}`);
            } else {
                console.log(`   ⚠️ Vader ID ${dog.vader_id} niet gevonden`);
            }
            
            if (moeder) {
                console.log(`   Moeder: ${moeder.naam} (ID: ${moeder.id})`);
                console.log(`      Moeder's ouders: ${moeder.vader_id}, ${moeder.moeder_id}`);
            } else {
                console.log(`   ⚠️ Moeder ID ${dog.moeder_id} niet gevonden`);
            }
        }
    }

    _isAncestorOf(dogId, ancestorId, maxDepth, currentDepth = 0) {
        if (!dogId || currentDepth > maxDepth) return false;
        
        if (dogId === ancestorId) return true;
        
        const dog = this.getDogById(dogId);
        if (!dog) return false;
        
        if (dog.vader_id && this._isAncestorOf(dog.vader_id, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        if (dog.moeder_id && this._isAncestorOf(dog.moeder_id, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        return false;
    }

    // ✅ CHECK DATABASE
    checkDatabase() {
        console.log(`\n📊 DATABASE CHECK:`);
        console.log(`   Totale honden in COI calculator: ${this._dogMap.size}`);
        
        if (this._dogMap.size === 0) {
            console.log(`   ❌ GEEN HONDEN GELADEN! COI berekeningen werken niet.`);
            return;
        }
        
        if (this._dogMap.size < 100) {
            console.warn(`   ⚠️ WAARSCHUWING: Slechts ${this._dogMap.size} honden geladen. Dit is waarschijnlijk niet de volledige database!`);
        }
        
        // Check enkele bekende honden
        const testIds = [637, 1, 100, 500, 1000]; // Test verschillende ID's
        
        for (const id of testIds) {
            const dog = this.getDogById(id);
            console.log(`   ID ${id}: ${dog ? 'Gevonden' : 'Niet gevonden'}`);
        }
        
        // Tel honden met ouders
        let withParents = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vader_id && dog.moeder_id) withParents++;
        }
        console.log(`   Honden met beide ouders: ${withParents}/${this._dogMap.size} (${Math.round(withParents/this._dogMap.size*100)}%)`);
        
        // Check voor ouderlijke relaties
        let missingParent = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vader_id && !this.getDogById(dog.vader_id)) missingParent++;
            if (dog.moeder_id && !this.getDogById(dog.moeder_id)) missingParent++;
        }
        console.log(`   Ontbrekende ouder referenties: ${missingParent}`);
    }
    
    // ✅ QUICK TEST MULTIPLE GENERATIONS
    quickTest(dogId) {
        console.log(`\n⚡ QUICK TEST VOOR ID: ${dogId}`);
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`   ❌ Hond ${dogId} niet gevonden`);
            return;
        }
        
        console.log(`   ${dog.naam} (ID: ${dog.id})`);
        console.log(`   Vader: ${dog.vader_id}, Moeder: ${dog.moeder_id}`);
        
        for (let gen of [3, 5, 6, 10, 25]) {
            const coi = this._calculateComplexCOI(dogId, gen);
            console.log(`   ${gen.toString().padStart(2)} generaties: ${(coi*100).toFixed(6)}%`);
        }
    }
    
    // ✅ NIEUWE FUNCTIE: Check of alle benodigde honden aanwezig zijn
    verifyDataCompleteness(dogId) {
        console.log(`\n🔍 VERIFY DATA COMPLETENESS FOR ID: ${dogId}`);
        
        const dog = this.getDogById(dogId);
        if (!dog) {
            console.log(`   ❌ Hoofdhond niet gevonden`);
            return false;
        }
        
        console.log(`   Hoofdhond: ${dog.naam} (ID: ${dog.id}) gevonden`);
        
        // Check ouders
        const parents = [];
        if (dog.vader_id) {
            const vader = this.getDogById(dog.vader_id);
            if (vader) {
                console.log(`   ✅ Vader gevonden: ${vader.naam} (ID: ${vader.id})`);
                parents.push(vader);
            } else {
                console.log(`   ❌ Vader ID ${dog.vader_id} niet gevonden!`);
            }
        }
        
        if (dog.moeder_id) {
            const moeder = this.getDogById(dog.moeder_id);
            if (moeder) {
                console.log(`   ✅ Moeder gevonden: ${moeder.naam} (ID: ${moeder.id})`);
                parents.push(moeder);
            } else {
                console.log(`   ❌ Moeder ID ${dog.moeder_id} niet gevonden!`);
            }
        }
        
        // Check grootouders voor 3 generaties
        let missingAncestors = 0;
        let totalAncestorsChecked = 0;
        
        const checkAncestors = (startId, maxDepth, currentDepth = 1, prefix = '') => {
            if (currentDepth > maxDepth) return;
            
            const currentDog = this.getDogById(startId);
            if (!currentDog) return;
            
            if (currentDog.vader_id) {
                totalAncestorsChecked++;
                const vader = this.getDogById(currentDog.vader_id);
                if (!vader) {
                    console.log(`   ${prefix}❌ Grootouder Vader ID ${currentDog.vader_id} niet gevonden`);
                    missingAncestors++;
                }
                checkAncestors(currentDog.vader_id, maxDepth, currentDepth + 1, prefix + '  ');
            }
            
            if (currentDog.moeder_id) {
                totalAncestorsChecked++;
                const moeder = this.getDogById(currentDog.moeder_id);
                if (!moeder) {
                    console.log(`   ${prefix}❌ Grootouder Moeder ID ${currentDog.moeder_id} niet gevonden`);
                    missingAncestors++;
                }
                checkAncestors(currentDog.moeder_id, maxDepth, currentDepth + 1, prefix + '  ');
            }
        };
        
        // Check 3 generaties aan voorouders
        checkAncestors(dogId, 3);
        
        console.log(`   ${missingAncestors} van ${totalAncestorsChecked} voorouders niet gevonden`);
        
        return missingAncestors === 0;
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator2 = COICalculator2;
    console.log('✅ COICalculator2 V9.5 geladen (met PAGINATIE ondersteuning)');
}

// ✅ NIEUWE FUNCTIE: Eenvoudige helper om calculator te maken met paginatie
if (typeof window !== 'undefined') {
    window.createCOICalculatorWithAllDogs = async function() {
        console.log('🔄 COICalculator2: Probeer calculator te maken met alle honden...');
        
        let service = null;
        
        // Zoek beschikbare service
        if (window.hondenService && typeof window.hondenService.getHonden === 'function') {
            service = window.hondenService;
            console.log('✅ Gebruik window.hondenService');
        } else if (window.db && typeof window.db.getHonden === 'function') {
            service = window.db;
            console.log('✅ Gebruik window.db');
        } else if (window.supabase) {
            console.log('✅ Gebruik window.supabase');
            // Voor Supabase maken we een dummy service
            service = {
                getHonden: async (page, pageSize) => {
                    const start = (page - 1) * pageSize;
                    const { data, error } = await window.supabase
                        .from('honden')
                        .select('*')
                        .order('id', { ascending: true })
                        .range(start, start + pageSize - 1);
                    
                    if (error) throw error;
                    return { honden: data, heeftVolgende: data.length === pageSize };
                }
            };
        } else {
            console.error('❌ Geen database service gevonden');
            return null;
        }
        
        // Maak calculator met paginatie
        const calculator = await COICalculator2.createWithPagination(service);
        
        if (calculator) {
            console.log(`✅ COICalculator2 succesvol gemaakt met ${calculator._dogMap.size} honden`);
            calculator.checkDatabase(); // Toon database status
        }
        
        return calculator;
    };
}
}