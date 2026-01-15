// disclaimer.js - Complete Disclaimer Manager zonder Bootstrap afhankelijkheid
class DisclaimerManager {
    constructor() {
        console.log('DisclaimerManager: Constructor aangeroepen');
        this.storageKey = 'honden_disclaimer_accepted';
        this.storageKeyDontShow = 'honden_disclaimer_dont_show';
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
    }
    
    init() {
        console.log('DisclaimerManager: Initialiseren...');
        
        // Maak modal HTML als die niet bestaat
        if (!document.getElementById('disclaimerModal')) {
            this.createModalHTML();
        }
        
        // Setup event listener
        this.setupEventListener();
        
        console.log('DisclaimerManager: Succesvol geïnitialiseerd');
    }
    
    createModalHTML() {
        console.log('DisclaimerManager: Modal aanmaken...');
        
        // COMPLETE modal HTML - GEEN Bootstrap data attributes
        const modalHTML = `
        <div id="disclaimerModal" class="modal fade" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:1060; overflow-y:auto; padding:20px;">
            <div class="modal-dialog modal-lg" style="position:relative; margin:30px auto; max-width:900px;">
                <div class="modal-content" style="background:white; border-radius:0.3rem; box-shadow:0 0.5rem 1rem rgba(0,0,0,0.15);">
                    <div class="modal-header bg-warning" style="padding:1rem; border-bottom:1px solid #dee2e6; border-radius:0.3rem 0.3rem 0 0;">
                        <h5 class="modal-title" style="margin:0; font-size:1.25rem;">
                            <i class="bi bi-exclamation-triangle"></i> 
                            <span id="disclaimerModalTitle">GENETISCHE ANALYSE TOOL - Belangrijke informatie</span>
                        </h5>
                        <button type="button" class="btn-close" onclick="window.disclaimerManager.hide()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; opacity:0.5; position:absolute; right:1rem; top:1rem;">&times;</button>
                    </div>
                    <div class="modal-body" style="padding:1.5rem; max-height:70vh; overflow-y:auto;">
                        <div class="alert alert-light border">
                            <h6 class="mb-3"><i class="bi bi-calculator text-primary"></i> <span id="disclaimerSubtitle">Berekening voor de inteelt is als volgt:</span></h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature1">Wetenschappelijk correct</span></strong> - <span id="disclaimerDetail1">Wright's formule exact geïmplementeerd</span>
                                    </div>
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature2">Compleet</span></strong> - <span id="disclaimerDetail2">Alle routes, niet alleen kortste pad</span>
                                    </div>
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature3">Diep</span></strong> - <span id="disclaimerDetail3">6 generaties voor volledige analyse</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature4">Speciale gevallen</span></strong> - <span id="disclaimerDetail4">Ouder-kind en broer-zus automatisch 25%</span>
                                    </div>
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature5">Precies</span></strong> - <span id="disclaimerDetail5">3 decimalen voor consistente resultaten</span>
                                    </div>
                                    <div class="mb-3">
                                        <i class="bi bi-check-circle-fill text-success"></i> 
                                        <strong><span id="disclaimerFeature6">Transparant</span></strong> - <span id="disclaimerDetail6">Uitgebreide logging voor debugging</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-info mt-3">
                                <p class="mb-0">
                                    <i class="bi bi-lightbulb"></i> 
                                    <span id="disclaimerNote">De calculator geeft realistischere (en vaak hogere) COI waarden dan veel online tools, omdat hij geen shortcuts neemt. Dit is belangrijk voor verantwoord fokken.</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h6><i class="bi bi-people text-primary"></i> <span id="kinshipTitle">Kinship (Verwantschapscoëfficiënt):</span></h6>
                            <p id="kinshipText">
                                Geeft de gemiddelde genetische verwantschap tussen alle voorouders weer.
                                Meet hoe sterk de voorouders onderling verwant zijn.
                                Hoog = veel herhaling van dezelfde voorouders in de stamboom.
                                Laag = genetisch diverse voorouders.
                            </p>
                        </div>
                        
                        <div class="mt-4">
                            <h6><i class="bi bi-dna text-primary"></i> <span id="homozygoteTitle">Homozygotie Waarde:</span></h6>
                            <p id="homozygoteText1">
                                Vertegenwoordigt de totale verwachte genetische uniformiteit van de hond.
                                Gebaseerd op wetenschappelijke formule: H = 1 - (1 - F_coi) × (1 - F_kinship).
                            </p>
                            <p id="homozygoteText2">
                                Houdt rekening met:<br>
                                • Directe inteelt tussen ouders (F_coi)<br>
                                • Gemiddelde verwantschap tussen alle voorouders (F_kinship)
                            </p>
                            <p class="fst-italic" id="homozygoteNote">
                                Deze waarde is typisch 2-4x hoger dan de standaard COI.
                            </p>
                        </div>
                        
                        <div class="alert alert-warning mt-4">
                            <h6><i class="bi bi-exclamation-triangle"></i> <span id="warningTitle">⚠️ Interpretatie richtlijnen Homozygotie Waarde:</span></h6>
                            <ul class="mb-0" id="warningList">
                                <li><strong>&lt; 10%:</strong> Laag risico op inteeltproblemen</li>
                                <li><strong>10-20%:</strong> Matig risico - gezondheidstesten aanbevolen</li>
                                <li><strong>&gt; 20%:</strong> Hoog risico - voorzichtigheid bij fokken geboden</li>
                                <li><strong>&gt; 30%:</strong> Zeer hoog risico - sterke genetische uniformiteit</li>
                            </ul>
                        </div>
                        
                        <div class="mt-4">
                            <h6><i class="bi bi-clipboard-check text-success"></i> <span id="usageTitle">Gebruik in fokprogramma's:</span></h6>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card border-success mb-3">
                                        <div class="card-header bg-success text-white">
                                            <i class="bi bi-check-circle"></i> <span id="recommendedTitle">✅ Aanbevolen:</span>
                                        </div>
                                        <div class="card-body">
                                            <ul class="mb-0" id="recommendedList">
                                                <li>Gebruik als extra screening tool naast gezondheidstesten</li>
                                                <li>Vergelijk binnen het ras om relatief minst ingeteelde lijnen te vinden</li>
                                                <li>Combineer met DNA-testen voor complete genetische analyse</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card border-danger mb-3">
                                        <div class="card-header bg-danger text-white">
                                            <i class="bi bi-x-circle"></i> <span id="notRecommendedTitle">❌ Niet bedoeld voor:</span>
                                        </div>
                                        <div class="card-body">
                                            <ul class="mb-0" id="notRecommendedList">
                                                <li>Absolute voorspelling van gezondheidsproblemen</li>
                                                <li>Vervanging van dierenartsconsulten en gezondheidstesten</li>
                                                <li>Juridische of garantie doeleinden</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h6><i class="bi bi-gear text-primary"></i> <span id="limitationsTitle">⚠️ Belangrijke notities:</span></h6>
                            <p id="limitationsText1">
                                Deze waarden zijn schattingen gebaseerd op:<br>
                                • Stamboomgegevens over 6 generaties<br>
                                • Theoretische populatiegenetica modellen<br>
                                • Annames over allelfrequenties in basispopulatie
                            </p>
                            <p id="limitationsText2" class="mb-0">
                                ⚠️ <strong>Beperkingen:</strong><br>
                                • Negeert mutaties en genetische drift<br>
                                • Gebaseerd op volledige en correcte stamboomdata<br>
                                • Kan niet alle epigenetische factoren meenemen
                            </p>
                        </div>
                        
                        <div class="mt-4">
                            <h6><i class="bi bi-mortarboard text-primary"></i> <span id="scientificTitle">Wetenschappelijke basis:</span></h6>
                            <p id="scientificText">
                                De berekeningen zijn gebaseerd op populatiegenetica principes en het Wright-Fisher model. 
                                Ze geven een theoretische schatting van genetische uniformiteit, maar kunnen individuele 
                                variatie niet volledig voorspellen.
                            </p>
                            <p class="small text-muted" id="updateNote">
                                Laatste update: Deze methode is continu in ontwikkeling en kan worden bijgesteld op basis van nieuwe inzichten uit de genetica.
                            </p>
                        </div>
                        
                        <div class="alert alert-danger mt-4">
                            <h6><i class="bi bi-shield-exclamation"></i> <span id="disclaimerTitle">DISCLAIMER</span></h6>
                            <p class="mb-0 fw-bold" id="disclaimerText">
                                Deze hondendatabase is ter informatie en is niet verantwoordelijk voor de gemaakte 
                                combinaties van honden en hun nakomelingen op welke wijze dan ook.
                            </p>
                        </div>
                        
                        <div class="text-center mt-3">
                            <p class="fst-italic text-primary" id="quoteText">
                                "Genetische diversiteit is de verzekering van een ras tegen toekomstige uitdagingen."
                            </p>
                        </div>
                        
                        <div class="mt-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="dontShowAgainCheckbox">
                                <label class="form-check-label" for="dontShowAgainCheckbox" id="dontShowAgainLabel">
                                    Deze melding niet meer tonen
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding:1rem; border-top:1px solid #dee2e6;">
                        <button type="button" class="btn btn-primary" onclick="window.disclaimerManager.accept()" style="padding:0.375rem 0.75rem; font-size:1rem; border-radius:0.25rem; background-color:#0d6efd; border-color:#0d6efd; color:white;">
                            <span id="disclaimerCloseText">Ik begrijp het</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="disclaimerBackdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:#000; opacity:0.5; z-index:1050;"></div>`;
        
        // Voeg modal toe aan body
        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        document.body.appendChild(div);
        
        console.log('DisclaimerManager: Modal aangemaakt met ALLE tekst');
    }
    
    setupEventListener() {
        const btn = document.getElementById('disclaimerBtn');
        if (btn) {
            btn.addEventListener('click', () => this.show());
            console.log('DisclaimerManager: Event listener toegevoegd aan knop');
        } else {
            console.error('DisclaimerManager: Disclaimer knop niet gevonden!');
        }
    }
    
    show() {
        console.log('DisclaimerManager: show() aangeroepen');
        
        // Check of "niet meer tonen" is aangevinkt
        const dontShow = localStorage.getItem(this.storageKeyDontShow);
        if (dontShow === 'true') {
            console.log('DisclaimerManager: Niet tonen - gebruiker heeft "niet meer tonen" geselecteerd');
            return;
        }
        
        const modal = document.getElementById('disclaimerModal');
        const backdrop = document.getElementById('disclaimerBackdrop');
        
        if (modal && backdrop) {
            modal.style.display = 'block';
            backdrop.style.display = 'block';
            
            // Voeg Bootstrap classes voor styling (alleen visueel, geen functionaliteit)
            modal.classList.add('show');
            backdrop.classList.add('show');
            
            // Voeg modal-open class toe aan body
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            
            console.log('DisclaimerManager: Modal getoond');
        } else {
            console.error('DisclaimerManager: Modal of backdrop niet gevonden');
        }
    }
    
    hide() {
        console.log('DisclaimerManager: hide() aangeroepen');
        
        const modal = document.getElementById('disclaimerModal');
        const backdrop = document.getElementById('disclaimerBackdrop');
        
        if (modal && backdrop) {
            modal.style.display = 'none';
            backdrop.style.display = 'none';
            
            // Verwijder classes
            modal.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    }
    
    accept() {
        console.log('DisclaimerManager: accept() aangeroepen');
        
        // Sla acceptatie op
        localStorage.setItem(this.storageKey, new Date().toISOString());
        
        // Check of "niet meer tonen" is aangevinkt
        const checkbox = document.getElementById('dontShowAgainCheckbox');
        if (checkbox && checkbox.checked) {
            localStorage.setItem(this.storageKeyDontShow, 'true');
            console.log('DisclaimerManager: "Niet meer tonen" opgeslagen');
        }
        
        // Verberg modal
        this.hide();
    }
}

// Maak globale instance en initialiseer
window.disclaimerManager = new DisclaimerManager();

// Initialiseer als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.disclaimerManager.init();
    });
} else {
    window.disclaimerManager.init();
}