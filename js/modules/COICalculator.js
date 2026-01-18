// COICalculator V11.0 - WETENSCHAPPELIJKE HOMOZYGOTIE BEREKENING
import { hondenService } from './supabase-honden.js';

class COICalculator {
    constructor(allDogs = []) {
        this.allDogs = allDogs;
        this._dogMap = new Map();
        this._ancestorCache = new Map(); // Cache voor voorouders per hond
        
        allDogs.forEach(dog => {
            if (dog && dog.id) {
                this._dogMap.set(Number(dog.id), dog);
            }
        });
        
        console.log(`✅ COICalculator V11.0: ${this._dogMap.size} honden geladen (wetenschappelijke methode)`);
    }

    getDogById(id) {
        return this._dogMap.get(Number(id));
    }

    calculateCOI(dogId) {
        try {
            dogId = Number(dogId);
            const dog = this.getDogById(dogId);
            if (!dog) {
                return { 
                    coiAllGen: '0.000',
                    coi5Gen: '0.000', 
                    coi6Gen: '0.000'
                };
            }
            
            // Bereken standaard COI
            const coi5Gen = this._calculateStandardCOI(dogId, 5);
            const coi6Gen = this._calculateStandardCOI(dogId, 6);
            
            // Bereken wetenschappelijke homozygotie
            const homozygotie = this._calculateScientificHomozygotie(dogId, 6);
            
            return {
                coiAllGen: (homozygotie * 100).toFixed(3),  // Homozygotie
                coi5Gen: (coi5Gen * 100).toFixed(3),        // 5-gen COI
                coi6Gen: (coi6Gen * 100).toFixed(3)         // 6-gen COI
            };
            
        } catch (error) {
            console.error('❌ COI berekeningsfout:', error);
            return { 
                coiAllGen: '0.000', 
                coi5Gen: '0.000',
                coi6Gen: '0.000'
            };
        }
    }

    // ✅ WETENSCHAPPELIJKE HOMOZYGOTIE BEREKENING
    _calculateScientificHomozygotie(dogId, generations = 6) {
        const cacheKey = `sci_homo_${dogId}_${generations}`;
        if (this._ancestorCache.has(cacheKey)) {
            return this._ancestorCache.get(cacheKey);
        }

        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) {
            this._ancestorCache.set(cacheKey, 0);
            return 0;
        }

        // Stap 1: Bereken standaard COI (F_coi)
        const F_coi = this._calculateStandardCOI(dogId, generations);
        
        // Stap 2: Verzamel alle voorouders
        const allAncestors = this._getAllAncestors(dogId, generations);
        
        if (allAncestors.size <= 1) {
            this._ancestorCache.set(cacheKey, F_coi);
            return F_coi;
        }

        // Stap 3: Bereken gemiddelde kinship tussen voorouders (F_kinship)
        const ancestorIds = Array.from(allAncestors.keys());
        let totalKinship = 0;
        let pairCount = 0;
        
        // Bereken kinship voor een representatieve steekproef (voor snelheid)
        const sampleSize = Math.min(ancestorIds.length, 50);
        const step = Math.max(1, Math.floor(ancestorIds.length / sampleSize));
        
        for (let i = 0; i < ancestorIds.length; i += step) {
            for (let j = i; j < ancestorIds.length; j += step) {
                if (i !== j) {
                    const kinship = this._calculateKinship(ancestorIds[i], ancestorIds[j], generations);
                    totalKinship += kinship;
                    pairCount++;
                }
            }
        }
        
        const avgKinship = pairCount > 0 ? totalKinship / pairCount : 0;
        
        // Stap 4: Wetenschappelijke formule voor totale homozygotie
        // H_totaal = 1 - (1 - F_coi) × (1 - F_kinship)
        const totalHomozygotie = 1 - (1 - F_coi) * (1 - avgKinship);
        
        // Grenzen: nooit lager dan F_coi, nooit hoger dan 0.5 (50%)
        const result = Math.max(F_coi, Math.min(totalHomozygotie, 0.5));
        
        // Debug info
        console.log(`Homozygotie voor ${dog.naam}:`);
        console.log(`  - F_coi (COI): ${(F_coi*100).toFixed(2)}%`);
        console.log(`  - Unieke voorouders: ${ancestorIds.length}`);
        console.log(`  - Gemiddelde kinship: ${(avgKinship*100).toFixed(2)}%`);
        console.log(`  - Totale homozygotie: ${(result*100).toFixed(2)}%`);
        
        this._ancestorCache.set(cacheKey, result);
        return result;
    }

    // ✅ Verzamel alle unieke voorouders
    _getAllAncestors(dogId, maxGenerations, currentGen = 0, result = new Map()) {
        if (currentGen > maxGenerations) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        // Tel voorkomen
        const currentCount = result.get(dogId) || 0;
        result.set(dogId, currentCount + 1);
        
        if (currentGen < maxGenerations) {
            if (dog.vaderId) {
                this._getAllAncestors(dog.vaderId, maxGenerations, currentGen + 1, result);
            }
            if (dog.moederId) {
                this._getAllAncestors(dog.moederId, maxGenerations, currentGen + 1, result);
            }
        }
        
        return result;
    }

    // ✅ Bereken kinship tussen twee individuen
    _calculateKinship(id1, id2, maxGenerations) {
        if (id1 === id2) {
            // Kinship met zichzelf = 0.5 × (1 + F)
            const dog = this.getDogById(id1);
            let f = 0;
            if (dog && dog.ik !== undefined) {
                f = parseFloat(dog.ik) / 100;
            }
            return 0.5 * (1 + f);
        }
        
        // Vind gemeenschappelijke voorouders
        const ancestors1 = this._getAncestorsWithDepth(id1, maxGenerations);
        const ancestors2 = this._getAncestorsWithDepth(id2, maxGenerations);
        
        let kinship = 0;
        for (const [ancestorId, depth1] of ancestors1) {
            if (ancestors2.has(ancestorId)) {
                const depth2 = ancestors2.get(ancestorId);
                const ancestorDog = this.getDogById(ancestorId);
                let fA = 0;
                if (ancestorDog && ancestorDog.ik !== undefined) {
                    fA = parseFloat(ancestorDog.ik) / 100;
                }
                
                kinship += Math.pow(0.5, depth1 + depth2 + 1) * (1 + fA);
            }
        }
        
        return kinship;
    }

    // ✅ Verzamel voorouders met diepte
    _getAncestorsWithDepth(dogId, maxDepth, currentDepth = 0, result = new Map()) {
        if (currentDepth > maxDepth) return result;
        
        const dog = this.getDogById(dogId);
        if (!dog) return result;
        
        if (dog.vaderId) {
            const existingDepth = result.get(dog.vaderId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                result.set(dog.vaderId, currentDepth + 1);
            }
            this._getAncestorsWithDepth(dog.vaderId, maxDepth, currentDepth + 1, result);
        }
        
        if (dog.moederId) {
            const existingDepth = result.get(dog.moederId);
            if (!existingDepth || currentDepth + 1 < existingDepth) {
                result.set(dog.moederId, currentDepth + 1);
            }
            this._getAncestorsWithDepth(dog.moederId, maxDepth, currentDepth + 1, result);
        }
        
        return result;
    }

    // ✅ STANDAARD COI BEREKENING (Wright's methode)
    _calculateStandardCOI(dogId, maxGenerations) {
        const dog = this.getDogById(dogId);
        if (!dog || !dog.vaderId || !dog.moederId) return 0;
        
        const vaderAncestors = this._getAncestorsWithDepth(dog.vaderId, maxGenerations, 1);
        const moederAncestors = this._getAncestorsWithDepth(dog.moederId, maxGenerations, 1);
        
        let totalCOI = 0;
        for (const [ancestorId, vaderDepth] of vaderAncestors) {
            if (moederAncestors.has(ancestorId)) {
                const contribution = this._calculateContribution(
                    dog.vaderId,
                    dog.moederId,
                    ancestorId,
                    maxGenerations
                );
                totalCOI += contribution;
            }
        }
        
        return totalCOI;
    }

    _calculateContribution(vaderId, moederId, ancestorId, maxGenerations) {
        const routesVader = this._findRoutesToAncestor(vaderId, ancestorId, maxGenerations - 1);
        const routesMoeder = this._findRoutesToAncestor(moederId, ancestorId, maxGenerations - 1);
        
        if (routesVader.length === 0 || routesMoeder.length === 0) return 0;
        
        let total = 0;
        for (const n of routesVader) {
            for (const m of routesMoeder) {
                total += Math.pow(0.5, n + m + 1);
            }
        }
        return total;
    }

    _findRoutesToAncestor(startId, targetId, maxDepth, currentDepth = 0) {
        if (currentDepth > maxDepth) return [];
        if (startId === targetId) return [currentDepth];
        
        const dog = this.getDogById(startId);
        if (!dog) return [];
        
        const routes = [];
        if (dog.vaderId) {
            routes.push(...this._findRoutesToAncestor(dog.vaderId, targetId, maxDepth, currentDepth + 1));
        }
        if (dog.moederId) {
            routes.push(...this._findRoutesToAncestor(dog.moederId, targetId, maxDepth, currentDepth + 1));
        }
        return routes;
    }

    // ✅ TEST: Vergelijk methode met officiële database
    validateAgainstDatabase() {
        console.log('\n🔬 VALIDATIE TEGEN DATABASE');
        console.log('ID  | Naam           | Officieel IK | Onze Homozygotie | Verschil');
        console.log('----|----------------|--------------|------------------|---------');
        
        let totalDiff = 0;
        let count = 0;
        
        // Test een steekproef van honden met officiële IK waarden
        for (const dog of this._dogMap.values()) {
            if (dog.ik !== undefined && dog.vaderId && dog.moederId) {
                const official = parseFloat(dog.ik);
                const ourValue = this._calculateScientificHomozygotie(dog.id, 6) * 100;
                const diff = ourValue - official;
                totalDiff += Math.abs(diff);
                count++;
                
                if (count <= 20) { // Toon eerste 20
                    console.log(
                        `${dog.id.toString().padStart(3)} | ${dog.naam.padEnd(14)} | ` +
                        `${official.toFixed(2).padStart(10)}% | ` +
                        `${ourValue.toFixed(2).padStart(14)}% | ` +
                        `${diff.toFixed(2)}%`
                    );
                }
            }
        }
        
        if (count > 0) {
            const avgDiff = totalDiff / count;
            console.log(`\nGemiddeld verschil: ${avgDiff.toFixed(2)}%`);
            console.log(`Geteste honden: ${count}`);
        }
    }
}

if (typeof window !== 'undefined') {
    window.COICalculator = COICalculator;
    console.log('✅ COICalculator V11.0 geladen (wetenschappelijke methode)');
}