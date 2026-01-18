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

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            console.log(`\n🔍 START COI BEREKENING VOOR ID: ${dogId}`);
            
            const dog = this.getDogById(dogId);
            if (!dog) {
                console.log(`❌ Hond ${dogId} niet gevonden`);
                return '0.000';
            }
            
            console.log(`📋 ${dog.naam} (ID: ${dog.id}) - Vader: ${dog.vaderId}, Moeder: ${dog.moederId}`);

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
            if (!dog.vaderId || !dog.moederId) {
                console.log(`⚠️ Geen complete ouders -> 0.000%`);
                return '0.000';
            }
            
            if (dog.vaderId === dog.moederId) {
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

    // ✅ Check ouder-kind combinatie (vader-dochter of moeder-zoon)
    _isParentChildCombination(dog) {
        if (!dog.vaderId || !dog.moederId) return false;
        
        // Check vader-dochter: is de vader van deze hond ook de vader van één van de ouders?
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Vader-dochter: vader = vader van moeder
        if (vader.id === moeder.vaderId) {
            console.log(`   ✅ Vader-dochter combinatie gedetecteerd!`);
            console.log(`      Hond: ${dog.naam} (ID: ${dog.id})`);
            console.log(`      Vader: ${vader.naam} (ID: ${vader.id})`);
            console.log(`      Moeder: ${moeder.naam} (ID: ${moeder.id}) is dochter van ${vader.naam}`);
            return true;
        }
        
        // Moeder-zoon: moeder = moeder van vader
        if (moeder.id === vader.moederId) {
            console.log(`   ✅ Moeder-zoon combinatie gedetecteerd!`);
            console.log(`      Hond: ${dog.naam} (ID: ${dog.id})`);
            console.log(`      Moeder: ${moeder.naam} (ID: ${moeder.id})`);
            console.log(`      Vader: ${vader.naam} (ID: ${vader.id}) is zoon van ${moeder.naam}`);
            return true;
        }
        
        // Vader = grootvader via moeder (vader van moeder)
        if (vader.vaderId && moeder.vaderId && vader.id === moeder.vaderId) {
            console.log(`   ✅ Vader = grootvader via moeder combinatie!`);
            return true;
        }
        
        // Moeder = grootmoeder via vader (moeder van vader)
        if (vader.moederId && moeder.moederId && moeder.id === vader.moederId) {
            console.log(`   ✅ Moeder = grootmoeder via vader combinatie!`);
            return true;
        }
        
        return false;
    }

    // ✅ Check broer-zus combinatie
    _isFullSiblingCombination(dog) {
        if (!dog.vaderId || !dog.moederId) return false;
        
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) return false;
        
        // Check of de ouders broer en zus zijn (zelfde ouders)
        const isSiblings = vader.vaderId && vader.moederId && 
               moeder.vaderId && moeder.moederId &&
               vader.vaderId === moeder.vaderId && 
               vader.moederId === moeder.moederId;
        
        if (isSiblings) {
            console.log(`   ✅ Broer-zus combinatie gedetecteerd!`);
            console.log(`      Vader: ${vader.naam} en Moeder: ${moeder.naam} hebben dezelfde ouders`);
        }
        
        return isSiblings;
    }

    // ✅ CORRECTE COMPLEXE BEREKENING
    _calculateComplexCOI(dogId, maxGenerations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        console.log(`   Berekenen over ${maxGenerations} generaties...`);
        
        // Vind ALLE unieke voorouders van vader en moeder
        const vaderAncestors = new Map(); // ID -> {depth: minimale diepte}
        const moederAncestors = new Map();
        
        this._findAncestorsWithDepth(dog.vaderId, 1, maxGenerations, vaderAncestors);
        this._findAncestorsWithDepth(dog.moederId, 1, maxGenerations, moederAncestors);
        
        console.log(`   Vader: ${vaderAncestors.size} unieke voorouders`);
        console.log(`   Moeder: ${moederAncestors.size} unieke voorouders`);
        
        // Vind gemeenschappelijke voorouders
        let totalCOI = 0;
        let commonCount = 0;
        
        for (const [ancestorId, vaderDepth] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                commonCount++;
                
                // Bereken bijdrage voor deze voorouder
                const contribution = this._calculateAncestorContributionCorrect(
                    dog.vaderId,
                    dog.moederId,
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
        if (!dog) return;
        
        if (dog.vaderId) {
            // Bewaar de minimale diepte waarop we deze voorouder vinden
            const existingDepth = resultMap.get(dog.vaderId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.vaderId, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.vaderId, currentDepth + 1, maxDepth, resultMap);
        }
        
        if (dog.moederId) {
            const existingDepth = resultMap.get(dog.moederId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                resultMap.set(dog.moederId, currentDepth + 1);
            }
            this._findAncestorsWithDepth(dog.moederId, currentDepth + 1, maxDepth, resultMap);
        }
    }

    _calculateAncestorContributionCorrect(vaderId, moederId, ancestorId, maxGenerations) {
        // Vind ALLE routes van vader naar voorouder
        const routesVader = this._findAllRoutes(vaderId, ancestorId, maxGenerations - 1);
        const routesMoeder = this._findAllRoutes(moederId, ancestorId, maxGenerations - 1);
        
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
        
        if (dog) {
            if (dog.vaderId) {
                currentPath.push(dog.vaderId);
                this._findAllRoutes(dog.vaderId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
                currentPath.pop();
            }
            
            if (dog.moederId) {
                currentPath.push(dog.moederId);
                this._findAllRoutes(dog.moederId, targetId, maxDepth, currentDepth + 1, currentPath, allRoutes, new Set(visited));
                currentPath.pop();
            }
        }
        
        return allRoutes;
    }

    // ✅ DEBUG FUNCTIES
    _debugStamboom(dogId, depth, currentDepth = 0, prefix = '') {
        if (currentDepth > depth) return;
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`${prefix}${dog.naam} (${dog.id}) [V:${dog.vaderId}, M:${dog.moederId}]`);
        
        if (dog.vaderId && currentDepth < depth) {
            this._debugStamboom(dog.vaderId, depth, currentDepth + 1, prefix + '  ├─V ');
        }
        if (dog.moederId && currentDepth < depth) {
            this._debugStamboom(dog.moederId, depth, currentDepth + 1, prefix + '  └─M ');
        }
    }

    // ✅ TEST OUDER-KIND COMBINATIE
    testParentChildCombination(dogId) {
        console.log(`\n🧪 TEST OUDER-KIND COMBINATIE VOOR ID: ${dogId}`);
        
        const dog = this.getDogById(dogId);
        if (!dog) return;
        
        console.log(`   Hond: ${dog.naam} (ID: ${dog.id})`);
        console.log(`   Vader ID: ${dog.vaderId}, Moeder ID: ${dog.moederId}`);
        
        const isParentChild = this._isParentChildCombination(dog);
        const isSiblings = this._isFullSiblingCombination(dog);
        
        console.log(`   Is ouder-kind combinatie: ${isParentChild}`);
        console.log(`   Is broer-zus combinatie: ${isSiblings}`);
        
        if (dog.vaderId && dog.moederId) {
            const vader = this.getDogById(dog.vaderId);
            const moeder = this.getDogById(dog.moederId);
            
            if (vader) {
                console.log(`   Vader: ${vader.naam} (ID: ${vader.id})`);
                console.log(`      Vader's ouders: ${vader.vaderId}, ${vader.moederId}`);
            }
            
            if (moeder) {
                console.log(`   Moeder: ${moeder.naam} (ID: ${moeder.id})`);
                console.log(`      Moeder's ouders: ${moeder.vaderId}, ${moeder.moederId}`);
            }
        }
    }

    _isAncestorOf(dogId, ancestorId, maxDepth, currentDepth = 0) {
        if (!dogId || currentDepth > maxDepth) return false;
        
        if (dogId === ancestorId) return true;
        
        const dog = this.getDogById(dogId);
        if (!dog) return false;
        
        if (dog.vaderId && this._isAncestorOf(dog.vaderId, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        if (dog.moederId && this._isAncestorOf(dog.moederId, ancestorId, maxDepth, currentDepth + 1)) {
            return true;
        }
        
        return false;
    }

    // ✅ CHECK DATABASE
    checkDatabase() {
        console.log(`\n📊 DATABASE CHECK:`);
        console.log(`   Totale honden: ${this._dogMap.size}`);
        
        // Check Esther
        const esther = this.getDogById(637);
        console.log(`   Esther gevonden: ${!!esther}`);
        if (esther) {
            console.log(`   Esther's ouders: ${esther.vaderId}, ${esther.moederId}`);
            
            // Check speciale combinaties
            console.log(`   Is ouder-kind combinatie: ${this._isParentChildCombination(esther)}`);
            console.log(`   Is broer-zus combinatie: ${this._isFullSiblingCombination(esther)}`);
        }
        
        // Tel honden met ouders
        let withParents = 0;
        for (const dog of this._dogMap.values()) {
            if (dog.vaderId && dog.moederId) withParents++;
        }
        console.log(`   Honden met beide ouders: ${withParents}`);
    }
    
    // ✅ QUICK TEST MULTIPLE GENERATIONS
    quickTest(dogId) {
        console.log(`\n⚡ QUICK TEST VOOR ID: ${dogId}`);
        
        for (let gen of [3, 5, 6, 10, 25]) {
            const coi = this._calculateComplexCOI(dogId, gen);
            console.log(`   ${gen.toString().padStart(2)} generaties: ${(coi*100).toFixed(6)}%`);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.COICalculator2 = COICalculator2;
    console.log('✅ COICalculator2 V9.5 geladen (6 generaties, ouder-kind detectie, 3 decimalen)');
}