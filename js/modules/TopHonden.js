// TopHonden.js - Telt voorouders van levende honden (<15 jaar)
class TopHonden {
    constructor() {
        this.supabase = window.supabase;
        this.currentYear = new Date().getFullYear();
        this.levendGrens = this.currentYear - 15; // Honden jonger dan 15 jaar zijn "levend"
        this.relevantieGrens = 1985; // Alleen honden vanaf 1985 zijn relevant voor actuele genenpoel
        this.modalId = 'topHondenModal';
        this.maxGeneraties = 10;
        this.translations = this.loadTranslations();
    }

    loadTranslations() {
        return {
            nl: {
                title: "Meest voorkomende voorouders",
                totaal: "Totaal overzicht (alle honden)",
                levend: "Actuele genenpoel (via levende honden, vanaf 1985)",
                reuen: "Reuen",
                teven: "Teven",
                name: "Naam",
                kennelname: "Kennelnaam",
                stamboomnr: "Stamboomnr",
                geboortejaar: "Geb.jr",
                occurrences: "Aantal keer",
                explanation: "Hoe hoger het getal, hoe dominanter de hond is in de genenpoel.",
                levendExplanation: "Dit overzicht telt ALLEEN de voorouders van honden die vandaag de dag leven (<15 jaar) over 10 generaties. Voorouders zonder geboortedatum of geboren vóór 1985 worden NIET meegeteld omdat ze niet zo relevant zijn voor de huidige populatie.",
                close: "Sluiten",
                noDogs: "Geen honden gevonden",
                loading: "Bezig met analyseren...",
                processing: "Verwerken",
                total: "Totaal",
                dogs: "honden",
                excluded: "Uitgesloten (geen datum of <1985)"
            },
            en: {
                title: "Most common ancestors",
                totaal: "Total overview (all dogs)",
                levend: "Active gene pool (via living dogs, from 1985)",
                reuen: "Stud Dogs",
                teven: "Brood Bitches",
                name: "Name",
                kennelname: "Kennel Name",
                stamboomnr: "Pedigree Nr",
                geboortejaar: "Birth year",
                occurrences: "Occurrences",
                explanation: "The higher the number, the more dominant the dog is in the gene pool.",
                levendExplanation: "This overview ONLY counts the ancestors of dogs that are alive today (<15 years) over 10 generations. Ancestors without a birth date or born before 1985 are NOT counted as they are not that relevant for the current population.",
                close: "Close",
                noDogs: "No dogs found",
                loading: "Analyzing...",
                processing: "Processing",
                total: "Total",
                dogs: "dogs",
                excluded: "Excluded (no date or <1985)"
            },
            de: {
                title: "Häufigste Vorfahren",
                totaal: "Gesamtübersicht (alle Hunde)",
                levend: "Aktiver Genpool (via lebende Hunde, ab 1985)",
                reuen: "Deckrüden",
                teven: "Zuchthündinnen",
                name: "Name",
                kennelname: "Zwingername",
                stamboomnr: "Zuchtbuchnr",
                geboortejaar: "Geb.jahr",
                occurrences: "Vorkommen",
                explanation: "Je höher die Zahl, desto dominanter ist der Hund im Genpool.",
                levendExplanation: "Diese Übersicht zählt NUR die Vorfahren von Hunden, die heute leben (<15 Jahre) über 10 Generationen. Vorfahren ohne Geburtsdatum oder geboren vor 1985 werden NICHT gezählt, da sie für die aktuelle Population nicht sehr relevant sind.",
                close: "Schließen",
                noDogs: "Keine Hunde gefunden",
                loading: "Analysiere...",
                processing: "Verarbeite",
                total: "Gesamt",
                dogs: "Hunde",
                excluded: "Ausgeschlossen (kein Datum oder <1985)"
            }
        };
    }

    getText(key) {
        const lang = localStorage.getItem('appLanguage') || 'nl';
        return this.translations[lang][key] || key;
    }

    getGeboorteJaar(geboortedatum) {
        if (!geboortedatum) return 'onbekend';
        try {
            return new Date(geboortedatum).getFullYear();
        } catch {
            return 'onbekend';
        }
    }

    isLevend(geboortedatum) {
        if (!geboortedatum) return false;
        try {
            const jaar = new Date(geboortedatum).getFullYear();
            return jaar >= this.levendGrens;
        } catch {
            return false;
        }
    }

    /**
     * Controleert of een hond relevant is voor de actuele genenpoel
     * Criteria: geboortedatum bestaat EN geboortejaar >= 1985
     */
    isRelevantVoorActueleGenenpoel(geboortedatum) {
        if (!geboortedatum) return false; // Geen datum = niet relevant
        
        try {
            const jaar = new Date(geboortedatum).getFullYear();
            return jaar >= this.relevantieGrens;
        } catch {
            return false; // Ongeldige datum = niet relevant
        }
    }

    async haalAlleHondenOp() {
        console.log('📥 Alle honden ophalen met paginatie...');
        
        let alleHonden = [];
        let page = 0;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
            const { data: honden, error } = await this.supabase
                .from('honden')
                .select(`
                    id,
                    naam,
                    kennelnaam,
                    stamboomnr,
                    vader_stamboomnr,
                    moeder_stamboomnr,
                    geboortedatum
                `)
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (error) {
                console.error('❌ Fout bij ophalen honden:', error);
                break;
            }

            if (honden && honden.length > 0) {
                alleHonden = alleHonden.concat(honden);
                page++;
                console.log(`📊 Pagina ${page}: ${honden.length} honden (totaal: ${alleHonden.length})`);
                
                if (honden.length < pageSize) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ Totaal ${alleHonden.length} honden opgehaald`);
        
        // Log statistieken over relevantie
        const metDatum = alleHonden.filter(h => h.geboortedatum).length;
        const vanaf1985 = alleHonden.filter(h => {
            if (!h.geboortedatum) return false;
            try {
                return new Date(h.geboortedatum).getFullYear() >= this.relevantieGrens;
            } catch {
                return false;
            }
        }).length;
        
        console.log(`📊 Relevantie statistieken:`);
        console.log(`   - Honden met geboortedatum: ${metDatum}`);
        console.log(`   - Honden vanaf 1985: ${vanaf1985}`);
        
        return alleHonden;
    }

    async bouwStamboomMap(alleHonden) {
        console.log('🔍 Stamboom map bouwen...');
        
        const hondMap = new Map();
        
        for (const hond of alleHonden) {
            if (hond.stamboomnr) {
                hondMap.set(hond.stamboomnr, {
                    id: hond.id,
                    naam: hond.naam || 'Onbekend',
                    kennelnaam: hond.kennelnaam || '',
                    stamboomnr: hond.stamboomnr,
                    geboortedatum: hond.geboortedatum,
                    vader_stamboomnr: hond.vader_stamboomnr,
                    moeder_stamboomnr: hond.moeder_stamboomnr
                });
            }
        }

        console.log(`✅ ${hondMap.size} honden met stamboomnr in map`);
        return hondMap;
    }

    /**
     * TEL ALLE VOOROUDERS - voor totaaloverzicht
     * Dit is de bestaande methode die werkt
     */
    async telAlleVoorouders(alleHonden, hondMap) {
        console.log('🔍 Alle voorouders tellen...');
        
        const voorouderCounts = new Map();
        
        // Welke honden hebben nakomelingen?
        const hondenMetNakomelingen = new Set();
        for (const hond of alleHonden) {
            if (hond.vader_stamboomnr) hondenMetNakomelingen.add(hond.vader_stamboomnr);
            if (hond.moeder_stamboomnr) hondenMetNakomelingen.add(hond.moeder_stamboomnr);
        }

        let verwerkt = 0;
        const totaal = alleHonden.length;

        for (const hond of alleHonden) {
            verwerkt++;
            
            if (verwerkt % 100 === 0) {
                console.log(`⏳ Voortgang: ${verwerkt}/${totaal}`);
                this.updateProgress(verwerkt, totaal);
            }

            if (!hond.stamboomnr || !hondenMetNakomelingen.has(hond.stamboomnr)) continue;

            await this.telVooroudersRecursief(
                hond, 
                voorouderCounts, 
                hondMap, 
                0, 
                new Set(),
                false // geen relevantie filtering voor totaaloverzicht
            );
        }

        return voorouderCounts;
    }

    /**
     * TEL ALLEEN VOOROUDERS VAN LEVENDE HONDEN
     * Alleen voorouders die relevant zijn (geboren >=1985) worden geteld
     */
    async telLevendeVoorouders(alleHonden, hondMap) {
        console.log('🔍 Voorouders van levende honden tellen (alleen relevant >=1985)...');
        
        const voorouderCounts = new Map();
        const genegeerd = { geenDatum: 0, voor1985: 0 };
        
        // Vind ALLE levende honden (<15 jaar)
        const levendeHonden = alleHonden.filter(hond => 
            hond.stamboomnr && this.isLevend(hond.geboortedatum)
        );
        
        console.log(`📊 ${levendeHonden.length} levende honden gevonden (<15 jaar)`);

        let verwerkt = 0;
        const totaal = levendeHonden.length;

        // Voor ELKE levende hond, tel al zijn/haar voorouders
        for (const hond of levendeHonden) {
            verwerkt++;
            
            if (verwerkt % 10 === 0) {
                console.log(`⏳ Levend: ${verwerkt}/${totaal}`);
                this.updateProgress(verwerkt, totaal);
            }

            await this.telVooroudersRecursief(
                hond, 
                voorouderCounts, 
                hondMap, 
                0, 
                new Set(),
                true, // relevantie filtering AAN voor levend
                genegeerd
            );
        }

        console.log(`✅ Tellen voltooid: ${voorouderCounts.size} unieke relevante voorouders`);
        console.log(`📊 Genegeerde voorouders: ${genegeerd.geenDatum} zonder datum, ${genegeerd.voor1985} voor 1985`);
        
        return voorouderCounts;
    }

    /**
     * Recursief voorouders tellen met optionele relevantie filtering
     */
    async telVooroudersRecursief(hond, countMap, hondMap, diepte, gezien, filterRelevantie = false, genegeerd = null) {
        if (diepte >= this.maxGeneraties) return;
        if (!hond || !hond.stamboomnr) return;
        if (gezien.has(hond.stamboomnr)) return;
        
        gezien.add(hond.stamboomnr);

        // Tel vader
        if (hond.vader_stamboomnr) {
            const vaderStamboomnr = hond.vader_stamboomnr;
            const vaderData = hondMap.get(vaderStamboomnr);
            
            // Alleen tellen als vader voldoet aan relevantie criteria (indien filtering aan)
            if (!filterRelevantie || (vaderData && this.isRelevantVoorActueleGenenpoel(vaderData.geboortedatum))) {
                countMap.set(vaderStamboomnr, (countMap.get(vaderStamboomnr) || 0) + 1);
            } else if (filterRelevantie && genegeerd) {
                // Bijhouden waarom genegeerd
                if (!vaderData || !vaderData.geboortedatum) {
                    genegeerd.geenDatum++;
                } else {
                    genegeerd.voor1985++;
                }
            }
            
            if (vaderData) {
                await this.telVooroudersRecursief(
                    vaderData, 
                    countMap, 
                    hondMap, 
                    diepte + 1, 
                    new Set(gezien),
                    filterRelevantie,
                    genegeerd
                );
            }
        }

        // Tel moeder
        if (hond.moeder_stamboomnr) {
            const moederStamboomnr = hond.moeder_stamboomnr;
            const moederData = hondMap.get(moederStamboomnr);
            
            // Alleen tellen als moeder voldoet aan relevantie criteria (indien filtering aan)
            if (!filterRelevantie || (moederData && this.isRelevantVoorActueleGenenpoel(moederData.geboortedatum))) {
                countMap.set(moederStamboomnr, (countMap.get(moederStamboomnr) || 0) + 1);
            } else if (filterRelevantie && genegeerd) {
                // Bijhouden waarom genegeerd
                if (!moederData || !moederData.geboortedatum) {
                    genegeerd.geenDatum++;
                } else {
                    genegeerd.voor1985++;
                }
            }
            
            if (moederData) {
                await this.telVooroudersRecursief(
                    moederData, 
                    countMap, 
                    hondMap, 
                    diepte + 1, 
                    new Set(gezien),
                    filterRelevantie,
                    genegeerd
                );
            }
        }
    }

    bepaalGeslacht(stamboomnr, hondMap) {
        let isVader = false;
        let isMoeder = false;
        
        for (const [_, hond] of hondMap) {
            if (hond.vader_stamboomnr === stamboomnr) isVader = true;
            if (hond.moeder_stamboomnr === stamboomnr) isMoeder = true;
        }
        
        if (isVader && !isMoeder) return 'reu';
        if (isMoeder && !isVader) return 'teef';
        if (isVader && isMoeder) return 'beide';
        return 'onbekend';
    }

    updateProgress(verwerkt, totaal) {
        const progressElement = document.getElementById('topHondenProgress');
        const progressText = document.getElementById('topHondenProgressText');
        
        if (progressElement && progressText) {
            const percentage = Math.round((verwerkt / totaal) * 100);
            progressElement.style.width = percentage + '%';
            progressElement.setAttribute('aria-valuenow', percentage);
            progressText.textContent = `${percentage}% (${verwerkt}/${totaal} ${this.getText('dogs')})`;
        }
    }

    async getTopLijsten() {
        const alleHonden = await this.haalAlleHondenOp();
        const hondMap = await this.bouwStamboomMap(alleHonden);
        
        // TOTAAL: alle voorouders
        console.log('📊 Totaaloverzicht berekenen...');
        const alleVoorouders = await this.telAlleVoorouders(alleHonden, hondMap);
        
        // LEVEND: alleen voorouders van levende honden die relevant zijn (>=1985)
        console.log('📊 Levende genenpoel berekenen (alleen relevant vanaf 1985)...');
        const levendeVoorouders = await this.telLevendeVoorouders(alleHonden, hondMap);

        // Verwerk totalen
        const totaalReuen = [];
        const totaalTeven = [];
        const levendReuen = [];
        const levendTeven = [];

        // TOTAAL verwerken
        for (const [stamboomnr, count] of alleVoorouders) {
            const details = hondMap.get(stamboomnr);
            if (!details) continue;
            
            const geslacht = this.bepaalGeslacht(stamboomnr, hondMap);
            
            const hondData = {
                stamboomnr: stamboomnr,
                naam: details.naam,
                kennelnaam: details.kennelnaam,
                geboortejaar: this.getGeboorteJaar(details.geboortedatum),
                aantal_voorkomens: count
            };
            
            if (geslacht === 'reu' || geslacht === 'beide') {
                totaalReuen.push(hondData);
            }
            if (geslacht === 'teef' || geslacht === 'beide') {
                totaalTeven.push(hondData);
            }
        }

        // LEVEND verwerken - hier zitten al alleen relevante honden in
        for (const [stamboomnr, count] of levendeVoorouders) {
            const details = hondMap.get(stamboomnr);
            if (!details) continue;
            
            const geslacht = this.bepaalGeslacht(stamboomnr, hondMap);
            
            const hondData = {
                stamboomnr: stamboomnr,
                naam: details.naam,
                kennelnaam: details.kennelnaam,
                geboortejaar: this.getGeboorteJaar(details.geboortedatum),
                aantal_voorkomens: count
            };
            
            if (geslacht === 'reu' || geslacht === 'beide') {
                levendReuen.push(hondData);
            }
            if (geslacht === 'teef' || geslacht === 'beide') {
                levendTeven.push(hondData);
            }
        }

        // Sorteer
        totaalReuen.sort((a, b) => b.aantal_voorkomens - a.aantal_voorkomens);
        totaalTeven.sort((a, b) => b.aantal_voorkomens - a.aantal_voorkomens);
        levendReuen.sort((a, b) => b.aantal_voorkomens - a.aantal_voorkomens);
        levendTeven.sort((a, b) => b.aantal_voorkomens - a.aantal_voorkomens);

        console.log(`📊 RESULTATEN:`);
        if (totaalReuen[0]) console.log(`   Totaal top: ${totaalReuen[0].naam} (${totaalReuen[0].aantal_voorkomens})`);
        if (levendReuen[0]) console.log(`   Levend top: ${levendReuen[0].naam} (${levendReuen[0].aantal_voorkomens})`);
        console.log(`   Levend totaal unieke voorouders: ${levendReuen.length + levendTeven.length}`);

        return {
            totaal: {
                reuen: totaalReuen.slice(0, 20),
                teven: totaalTeven.slice(0, 20)
            },
            levend: {
                reuen: levendReuen.slice(0, 20),
                teven: levendTeven.slice(0, 20)
            }
        };
    }

    async showModal() {
        console.log('📊 TopHonden modal openen...');
        
        this.showLoadingModal();
        
        try {
            const data = await this.getTopLijsten();
            const modalHTML = this.getModalHTML(data);
            this.showFinalModal(modalHTML);
        } catch (error) {
            console.error('❌ Fout:', error);
            this.showErrorModal(error.message);
        }
    }

    showLoadingModal() {
        const loadingHTML = `
        <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-bar-chart-steps"></i> ${this.getText('title')}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center p-5">
                        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="text-muted">${this.getText('loading')}</p>
                        
                        <div class="progress mt-3" style="height: 20px;">
                            <div id="topHondenProgress" class="progress-bar progress-bar-striped progress-bar-animated" 
                                 role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p id="topHondenProgressText" class="text-muted small mt-2">0%</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        this.removeExistingModal();
        document.getElementById('modalsContainer').innerHTML = loadingHTML;
        
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    showErrorModal(errorMsg) {
        const errorHTML = `
        <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle"></i> Fout
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Er is een fout opgetreden bij het ophalen van de data.</p>
                        <p class="text-muted small">${errorMsg || 'Probeer het later opnieuw.'}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.getText('close')}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        this.removeExistingModal();
        document.getElementById('modalsContainer').innerHTML = errorHTML;
        
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    showFinalModal(html) {
        this.removeExistingModal();
        document.getElementById('modalsContainer').innerHTML = html;
        
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    removeExistingModal() {
        const existing = document.getElementById(this.modalId);
        if (existing) existing.remove();
        
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    getModalHTML(data) {
        const { totaal, levend } = data;
        
        return `
        <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-bar-chart-steps"></i> ${this.getText('title')}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Uitleg -->
                        <div class="alert alert-secondary">
                            <i class="bi bi-info-circle"></i>
                            ${this.getText('explanation')}
                        </div>

                        <!-- Hoofd tabs: Totaal vs Levend -->
                        <ul class="nav nav-tabs mb-3" id="mainTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="totaal-tab" data-bs-toggle="tab" data-bs-target="#totaal" type="button" role="tab">
                                    <i class="bi bi-database"></i> ${this.getText('totaal')}
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="levend-tab" data-bs-toggle="tab" data-bs-target="#levend" type="button" role="tab">
                                    <i class="bi bi-tree-fill"></i> ${this.getText('levend')}
                                </button>
                            </li>
                        </ul>
                        
                        <div class="tab-content" id="mainTabContent">
                            <!-- TOTAAL TAB -->
                            <div class="tab-pane fade show active" id="totaal" role="tabpanel">
                                ${this.getUitlegBijTabel('totaal')}
                                ${this.getTabelMetTabs(totaal.reuen, totaal.teven, 'totaal')}
                            </div>
                            
                            <!-- LEVEND TAB -->
                            <div class="tab-pane fade" id="levend" role="tabpanel">
                                <div class="alert alert-success">
                                    <i class="bi bi-info-circle"></i>
                                    ${this.getText('levendExplanation')}
                                </div>
                                ${this.getTabelMetTabs(levend.reuen, levend.teven, 'levend')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            ${this.getText('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getUitlegBijTabel(type) {
        if (type === 'totaal') {
            return `
            <div class="alert alert-warning mb-3">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Let op:</strong> Dit totaaloverzicht bevat ALLE honden, ook van dode takken. 
                Pollo-Pong (1959) scoort hier hoog omdat hij in alle historische lijnen zit.
            </div>
            `;
        }
        return '';
    }

    getTabelMetTabs(reuen, teven, prefix) {
        return `
        <ul class="nav nav-tabs" id="${prefix}SubTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#${prefix}Reuen">
                    <i class="bi bi-gender-male"></i> ${this.getText('reuen')} (${reuen.length})
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#${prefix}Teven">
                    <i class="bi bi-gender-female"></i> ${this.getText('teven')} (${teven.length})
                </button>
            </li>
        </ul>
        
        <div class="tab-content mt-3">
            <div class="tab-pane fade show active" id="${prefix}Reuen">
                ${this.getTabelHTML(reuen, prefix + 'Reuen')}
            </div>
            <div class="tab-pane fade" id="${prefix}Teven">
                ${this.getTabelHTML(teven, prefix + 'Teven')}
            </div>
        </div>
        `;
    }

    getTabelHTML(honden, id) {
        if (honden.length === 0) {
            return `<p class="text-center text-muted">${this.getText('noDogs')}</p>`;
        }
        
        return `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>${this.getText('name')}</th>
                        <th>${this.getText('kennelname')}</th>
                        <th>${this.getText('stamboomnr')}</th>
                        <th>${this.getText('geboortejaar')}</th>
                        <th class="text-center">${this.getText('occurrences')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${honden.map((hond, index) => {
                        let badgeClass = 'bg-success';
                        if (hond.aantal_voorkomens > 100) badgeClass = 'bg-danger';
                        else if (hond.aantal_voorkomens > 50) badgeClass = 'bg-warning text-dark';
                        else if (hond.aantal_voorkomens > 20) badgeClass = 'bg-info text-dark';
                        
                        return `
                        <tr>
                            <td><strong>${index + 1}</strong></td>
                            <td>${hond.naam || 'Onbekend'}</td>
                            <td>${hond.kennelnaam || '-'}</td>
                            <td><code>${hond.stamboomnr || '-'}</code></td>
                            <td>${hond.geboortejaar}</td>
                            <td class="text-center">
                                <span class="badge ${badgeClass} rounded-pill">${hond.aantal_voorkomens}</span>
                            </td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        `;
    }
}

// Maak globaal beschikbaar
window.TopHonden = TopHonden;
window.topHonden = new TopHonden();

// Autonome event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 TopHonden module geladen');
    
    const checkInterval = setInterval(() => {
        const btn = document.getElementById('topHondenBtn');
        if (btn) {
            clearInterval(checkInterval);
            console.log('✅ TopHonden button gevonden');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📊 TopHonden button geklikt');
                if (window.topHonden) {
                    window.topHonden.showModal();
                }
            });
        }
    }, 500);
});