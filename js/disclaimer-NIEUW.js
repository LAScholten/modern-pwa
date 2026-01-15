// disclaimer.js - COMPLETE versie met ALLE talen
class DisclaimerManager {
    constructor() {
        this.storageKey = 'honden_disclaimer_accepted';
        this.storageKeyDontShow = 'honden_disclaimer_dont_show';
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = this.getTranslations();
    }
    
    getTranslations() {
        return {
            nl: {
                disclaimerModalTitle: "GENETISCHE ANALYSE TOOL - Belangrijke informatie",
                disclaimerSubtitle: "Berekening voor de inteelt is als volgt:",
                disclaimerFeature1: "Wetenschappelijk correct",
                disclaimerDetail1: "Wright's formule exact geïmplementeerd",
                disclaimerFeature2: "Compleet",
                disclaimerDetail2: "Alle routes, niet alleen kortste pad",
                disclaimerFeature3: "Diep",
                disclaimerDetail3: "6 generaties voor volledige analyse",
                disclaimerFeature4: "Speciale gevallen",
                disclaimerDetail4: "Ouder-kind en broer-zus automatisch 25%",
                disclaimerFeature5: "Precies",
                disclaimerDetail5: "3 decimalen voor consistente resultaten",
                disclaimerFeature6: "Transparant",
                disclaimerDetail6: "Uitgebreide logging voor debugging",
                disclaimerNote: "De calculator geeft realistischere (en vaak hogere) COI waarden dan veel online tools, omdat hij geen shortcuts neemt. Dit is belangrijk voor verantwoord fokken.",
                kinshipTitle: "Kinship (Verwantschapscoëfficiënt):",
                kinshipText: "Geeft de gemiddelde genetische verwantschap tussen alle voorouders weer. Meet hoe sterk de voorouders onderling verwant zijn. Hoog = veel herhaling van dezelfde voorouders in de stamboom. Laag = genetisch diverse voorouders.",
                homozygoteTitle: "Homozygotie Waarde:",
                homozygoteText1: "Vertegenwoordigt de totale verwachte genetische uniformiteit van de hond. Gebaseerd op wetenschappelijke formule: H = 1 - (1 - F_coi) × (1 - F_kinship).",
                homozygoteText2: "Houdt rekening met: • Directe inteelt tussen ouders (F_coi) • Gemiddelde verwantschap tussen alle voorouders (F_kinship)",
                homozygoteNote: "Deze waarde is typisch 2-4x hoger dan de standaard COI.",
                warningTitle: "⚠️ Interpretatie richtlijnen Homozygotie Waarde:",
                warningList: "<li><strong>&lt; 10%:</strong> Laag risico op inteeltproblemen</li><li><strong>10-20%:</strong> Matig risico - gezondheidstesten aanbevolen</li><li><strong>&gt; 20%:</strong> Hoog risico - voorzichtigheid bij fokken geboden</li><li><strong>&gt; 30%:</strong> Zeer hoog risico - sterke genetische uniformiteit</li>",
                usageTitle: "Gebruik in fokprogramma's:",
                recommendedTitle: "✅ Aanbevolen:",
                recommendedList: "<li>Gebruik als extra screening tool naast gezondheidstesten</li><li>Vergelijk binnen het ras om relatief minst ingeteelde lijnen te vinden</li><li>Combineer met DNA-testen voor complete genetische analyse</li>",
                notRecommendedTitle: "❌ Niet bedoeld voor:",
                notRecommendedList: "<li>Absolute voorspelling van gezondheidsproblemen</li><li>Vervanging van dierenartsconsulten en gezondheidstesten</li><li>Juridische of garantie doeleinden</li>",
                limitationsTitle: "⚠️ Belangrijke notities:",
                limitationsText1: "Deze waarden zijn schattingen gebaseerd op: • Stamboomgegevens over 6 generaties • Theoretische populatiegenetica modellen • Annames over allelfrequenties in basispopulatie",
                limitationsText2: "⚠️ <strong>Beperkingen:</strong><br>• Negeert mutaties en genetische drift<br>• Gebaseerd op volledige en correcte stamboomdata<br>• Kan niet alle epigenetische factoren meenemen",
                scientificTitle: "Wetenschappelijke basis:",
                scientificText: "De berekeningen zijn gebaseerd op populatiegenetica principes en het Wright-Fisher model. Ze geven een theoretische schatting van genetische uniformiteit, maar kunnen individuele variatie niet volledig voorspellen.",
                updateNote: "Laatste update: Deze methode is continu in ontwikkeling en kan worden bijgesteld op basis van nieuwe inzichten uit de genetica.",
                disclaimerTitle: "DISCLAIMER",
                disclaimerText: "Deze hondendatabase is ter informatie en is niet verantwoordelijk voor de gemakte combinaties van honden en hun nakomelingen op welke wijze dan ook.",
                quoteText: "\"Genetische diversiteit is de verzekering van een ras tegen toekomstige uitdagingen.\"",
                dontShowAgainLabel: "Deze melding niet meer tonen",
                disclaimerCloseText: "Ik begrijp het"
            },
            en: {
                disclaimerModalTitle: "GENETIC ANALYSIS TOOL - Important information",
                disclaimerSubtitle: "Inbreeding calculation as follows:",
                disclaimerFeature1: "Scientifically correct",
                disclaimerDetail1: "Wright's formula exactly implemented",
                disclaimerFeature2: "Complete",
                disclaimerDetail2: "All routes, not just shortest path",
                disclaimerFeature3: "Deep",
                disclaimerDetail3: "6 generations for complete analysis",
                disclaimerFeature4: "Special cases",
                disclaimerDetail4: "Parent-child and sibling automatically 25%",
                disclaimerFeature5: "Precise",
                disclaimerDetail5: "3 decimals for consistent results",
                disclaimerFeature6: "Transparent",
                disclaimerDetail6: "Extensive logging for debugging",
                disclaimerNote: "The calculator gives more realistic (and often higher) COI values than many online tools because it doesn't take shortcuts. This is important for responsible breeding.",
                kinshipTitle: "Kinship (Relationship Coefficient):",
                kinshipText: "Shows the average genetic relationship between all ancestors. Measures how strongly ancestors are related to each other. High = much repetition of the same ancestors in the pedigree. Low = genetically diverse ancestors.",
                homozygoteTitle: "Homozygosity Value:",
                homozygoteText1: "Represents the total expected genetic uniformity of the dog. Based on scientific formula: H = 1 - (1 - F_coi) × (1 - F_kinship).",
                homozygoteText2: "Takes into account: • Direct inbreeding between parents (F_coi) • Average relationship between all ancestors (F_kinship)",
                homozygoteNote: "This value is typically 2-4x higher than standard COI.",
                warningTitle: "⚠️ Interpretation guidelines Homozygosity Value:",
                warningList: "<li><strong>&lt; 10%:</strong> Low risk of inbreeding problems</li><li><strong>10-20%:</strong> Moderate risk - health testing recommended</li><li><strong>&gt; 20%:</strong> High risk - caution in breeding advised</li><li><strong>&gt; 30%:</strong> Very high risk - strong genetic uniformity</li>",
                usageTitle: "Use in breeding programs:",
                recommendedTitle: "✅ Recommended:",
                recommendedList: "<li>Use as additional screening tool alongside health tests</li><li>Compare within the breed to find relatively least inbred lines</li><li>Combine with DNA testing for complete genetic analysis</li>",
                notRecommendedTitle: "❌ Not intended for:",
                notRecommendedList: "<li>Absolute prediction of health problems</li><li>Replacement of veterinary consultations and health tests</li><li>Legal or warranty purposes</li>",
                limitationsTitle: "⚠️ Important notes:",
                limitationsText1: "These values are estimates based on: • Pedigree data over 6 generations • Theoretical population genetics models • Assumptions about allele frequencies in base population",
                limitationsText2: "⚠️ Limitations: • Ignores mutations and genetic drift • Based on complete and correct pedigree data • Cannot account for all epigenetic factors",
                scientificTitle: "Scientific basis:",
                scientificText: "The calculations are based on population genetics principles and the Wright-Fisher model. They give a theoretical estimate of genetic uniformity but cannot fully predict individual variation.",
                updateNote: "Last update: This method is continuously evolving and may be adjusted based on new insights from genetics.",
                disclaimerTitle: "DISCLAIMER",
                disclaimerText: "This dog database is for informational purposes only and is not responsible for any dog combinations and their offspring in any way.",
                quoteText: "\"Genetic diversity is a breed's insurance against future challenges.\"",
                dontShowAgainLabel: "Don't show this message again",
                disclaimerCloseText: "I understand"
            },
            de: {
                disclaimerModalTitle: "GENETISCHE ANALYSE TOOL - Wichtige Informationen",
                disclaimerSubtitle: "Berechnung der Inzucht wie folgt:",
                disclaimerFeature1: "Wissenschaftlich korrekt",
                disclaimerDetail1: "Wrights Formel exakt implementiert",
                disclaimerFeature2: "Vollständig",
                disclaimerDetail2: "Alle Routen, nicht nur kürzester Pfad",
                disclaimerFeature3: "Tief",
                disclaimerDetail3: "6 Generationen für vollständige Analyse",
                disclaimerFeature4: "Spezialfälle",
                disclaimerDetail4: "Eltern-Kind en Geschwister automatisch 25%",
                disclaimerFeature5: "Präzise",
                disclaimerDetail5: "3 Dezimalstellen für konsistente Ergebnisse",
                disclaimerFeature6: "Transparent",
                disclaimerDetail6: "Umfangreiche Protokollierung für Debugging",
                disclaimerNote: "Der Rechner liefert realistischere (und oft höhere) COI-Werte als viele Online-Tools, da er keine Abkürzungen nimmt. Dies is wichtig für verantwortungsvolles Züchten.",
                kinshipTitle: "Kinship (Verwandtschaftskoeffizient):",
                kinshipText: "Zeigt die durchschnittliche genetische Verwandtschaft zwischen allen Vorfahren. Misst, wie stark die Vorfahren miteinander verwandt sind. Hoch = viel Wiederholung derselben Vorfahren im Stammbaum. Niedrig = genetisch diverse Vorfahren.",
                homozygoteTitle: "Homozygotie Wert:",
                homozygoteText1: "Repräsentiert die gesamte erwartete genetische Einheitlichkeit des Hundes. Basierend auf wissenschaftlicher Formel: H = 1 - (1 - F_coi) × (1 - F_kinship).",
                homozygoteText2: "Berücksichtigt: • Direkte Inzucht zwischen Eltern (F_coi) • Durchschnittliche Verwandtschaft zwischen allen Vorfahren (F_kinship)",
                homozygoteNote: "Dieser Wert ist typischerweise 2-4x höher als der Standard-COI.",
                warningTitle: "⚠️ Interpretationsrichtlinien Homozygotie Wert:",
                warningList: "<li><strong>&lt; 10%:</strong> Geringes Inzuchtrisiko</li><li><strong>10-20%:</strong> Mittleres Risiko - Gesundheitstests empfohlen</li><li><strong>&gt; 20%:</strong> Hohes Risiko - Vorsicht beim Züchten geboten</li><li><strong>&gt; 30%:</strong> Sehr hohes Risiko - starke genetische uniformiteit</li>",
                usageTitle: "Verwendung in Zuchtprogrammen:",
                recommendedTitle: "✅ Empfohlen:",
                recommendedList: "<li>Als zusätzliches Screening-Tool neben Gesundheitstests verwenden</li><li>Innerhalb der Rasse vergleichen, um relativ am wenigsten eingezüchtete Linien te finden</li><li>Mit DNA-Tests für vollständige genetische Analyse kombinieren</li>",
                notRecommendedTitle: "❌ Nicht gedacht für:",
                notRecommendedList: "<li>Absolute Vorhersage van Gesundheitsproblemen</li><li>Ersatz van Tierarztkonsultationen en Gesundheitstesten</li><li>Juristische oder Garantiezwecke</li>",
                limitationsTitle: "⚠️ Wichtige Hinweise:",
                limitationsText1: "Diese Werte sind Schätzungen basierend auf: • Stammbaumdaten über 6 Generationen • Theoretischen Populationsgenetik-Modellen • Annahmen über Allelfrequenzen in Basispopulation",
                limitationsText2: "⚠️ Einschränkungen: • Ignoriert Mutationen en genetische Drift • Basierend auf vollständigen en korrekten Stammbaumdaten • Kann nicht alle epigenetischen Faktoren berücksichtigen",
                scientificTitle: "Wissenschaftliche Basis:",
                scientificText: "Die Berechnungen basieren auf populationsgenetischen Prinzipien en dem Wright-Fisher-Modell. Sie geben eine theoretische Schätzung der genetische Einheitlichkeit, können aber individuelle Variation nicht vollständig vorhersagen.",
                updateNote: "Letzte Aktualisierung: Deze methode wordt continu in ontwikkeling en kan worden bijgesteld op basis van nieuwe inzichten uit de genetica.",
                disclaimerTitle: "HAFTUNGSAUSSCHLUSS",
                disclaimerText: "Diese Hundendatenbank dient nur zu Informationszwecken en ist in keiner Weise verantwortlich voor de gemachten Hunde-Kombinationen en ihre Nachkommen.",
                quoteText: "\"Genetische Vielfalt ist die Versicherung einer Rasse gegen zukünftige Herausforderungen.\"",
                dontShowAgainLabel: "Diese Meldung nicht mehr anzeigen",
                disclaimerCloseText: "Ich verstehe"
            }
        };
    }
    
    init() {
        console.log('DisclaimerManager: Initialiseren voor taal:', this.currentLang);
        
        // Verwijder ALLE oude modals eerst
        this.removeOldModals();
        
        // Maak nieuwe modal
        this.createModal();
        
        // Voeg event listener toe
        this.setupEventListener();
        
        // Luister naar taal veranderingen
        this.setupLanguageListener();
        
        console.log('DisclaimerManager: Klaar');
    }
    
    removeOldModals() {
        const oldModals = [
            'disclaimerModal',
            'disclaimerBackdrop',
            'disclaimerModalFixed',
            'disclaimerBackdropFixed'
        ];
        
        oldModals.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }
    
    createModal() {
        const modalHTML = `
        <div id="disclaimerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; padding:20px; overflow:auto;">
            <div style="max-width:900px; margin:30px auto; background:white; border-radius:5px; box-shadow:0 5px 15px rgba(0,0,0,0.3);">
                <!-- Header -->
                <div style="background:#f8d7da; padding:15px 20px; border-bottom:1px solid #f5c6cb; border-radius:5px 5px 0 0; display:flex; justify-content:space-between; align-items:center;">
                    <h5 style="margin:0; color:#721c24;">
                        <i class="bi bi-exclamation-triangle"></i> 
                        <span id="disclaimerModalTitle">GENETISCHE ANALYSE TOOL - Belangrijke informatie</span>
                    </h5>
                    <button onclick="window.disclaimerManager.hide()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#721c24; padding:0; line-height:1;">&times;</button>
                </div>
                
                <!-- Body -->
                <div style="padding:20px; max-height:70vh; overflow-y:auto;">
                    ${this.getModalContentHTML()}
                </div>
                
                <!-- Footer -->
                <div style="padding:15px 20px; border-top:1px solid #dee2e6; background:#f8f9fa; border-radius:0 0 5px 5px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <input type="checkbox" id="dontShowAgainCheckbox" style="margin-right:8px;">
                        <label for="dontShowAgainCheckbox" id="dontShowAgainLabel" style="margin:0; cursor:pointer;">
                            Deze melding niet meer tonen
                        </label>
                    </div>
                    <button onclick="window.disclaimerManager.accept()" style="background:#0d6efd; color:white; border:none; padding:8px 20px; border-radius:4px; cursor:pointer; font-size:16px;">
                        <span id="disclaimerCloseText">Ik begrijp het</span>
                    </button>
                </div>
            </div>
        </div>`;
        
        const container = document.createElement('div');
        container.innerHTML = modalHTML;
        document.body.appendChild(container.firstElementChild);
        
        // Update teksten voor huidige taal
        this.updateTexts();
    }
    
    getModalContentHTML() {
        return `
        <!-- INTRO -->
        <div style="background:#f8f9fa; border:1px solid #e9ecef; border-radius:4px; padding:15px; margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:15px;">
                <i class="bi bi-calculator"></i> 
                <span id="disclaimerSubtitle">Berekening voor de inteelt is als volgt:</span>
            </h6>
            
            <div style="display:flex; flex-wrap:wrap; gap:20px; margin-bottom:15px;">
                <div style="flex:1; min-width:300px;">
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature1">Wetenschappelijk correct</span></strong> - 
                            <span id="disclaimerDetail1">Wright's formule exact geïmplementeerd</span>
                        </div>
                    </div>
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature2">Compleet</span></strong> - 
                            <span id="disclaimerDetail2">Alle routes, niet alleen kortste pad</span>
                        </div>
                    </div>
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature3">Diep</span></strong> - 
                            <span id="disclaimerDetail3">6 generaties voor volledige analyse</span>
                        </div>
                    </div>
                </div>
                <div style="flex:1; min-width:300px;">
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature4">Speciale gevallen</span></strong> - 
                            <span id="disclaimerDetail4">Ouder-kind en broer-zus automatisch 25%</span>
                        </div>
                    </div>
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature5">Precies</span></strong> - 
                            <span id="disclaimerDetail5">3 decimalen voor consistente resultaten</span>
                        </div>
                    </div>
                    <div style="margin-bottom:10px; display:flex; align-items:flex-start;">
                        <i class="bi bi-check-circle-fill" style="color:#28a745; margin-right:8px; margin-top:3px;"></i>
                        <div>
                            <strong><span id="disclaimerFeature6">Transparant</span></strong> - 
                            <span id="disclaimerDetail6">Uitgebreide logging voor debugging</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background:#d1ecf1; border:1px solid #bee5eb; border-radius:4px; padding:12px; margin-top:15px;">
                <p style="margin:0; color:#0c5460;">
                    <i class="bi bi-lightbulb"></i> 
                    <span id="disclaimerNote">De calculator geeft realistischere (en vaak hogere) COI waarden dan veel online tools, omdat hij geen shortcuts neemt. Dit is belangrijk voor verantwoord fokken.</span>
                </p>
            </div>
        </div>
        
        <!-- KINSHIP -->
        <div style="margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:10px;">
                <i class="bi bi-people"></i> 
                <span id="kinshipTitle">Kinship (Verwantschapscoëfficiënt):</span>
            </h6>
            <p id="kinshipText" style="margin:0; line-height:1.6;">
                Geeft de gemiddelde genetische verwantschap tussen alle voorouders weer.<br>
                Meet hoe sterk de voorouders onderling verwant zijn.<br>
                Hoog = veel herhaling van dezelfde voorouders in de stamboom.<br>
                Laag = genetisch diverse voorouders.
            </p>
        </div>
        
        <!-- HOMOZYGOTE -->
        <div style="margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:10px;">
                <i class="bi bi-dna"></i> 
                <span id="homozygoteTitle">Homozygotie Waarde:</span>
            </h6>
            <p id="homozygoteText1" style="margin:0 0 10px 0; line-height:1.6;">
                Vertegenwoordigt de totale verwachte genetische uniformiteit van de hond.<br>
                Gebaseerd op wetenschappelijke formule: H = 1 - (1 - F_coi) × (1 - F_kinship).
            </p>
            <p id="homozygoteText2" style="margin:0 0 10px 0; line-height:1.6;">
                Houdt rekening met:<br>
                • Directe inteelt tussen ouders (F_coi)<br>
                • Gemiddelde verwantschap tussen alle voorouders (F_kinship)
            </p>
            <p id="homozygoteNote" style="margin:0; font-style:italic; color:#6c757d;">
                Deze waarde is typisch 2-4x hoger dan de standaard COI.
            </p>
        </div>
        
        <!-- WARNING -->
        <div style="background:#fff3cd; border:1px solid #ffeaa7; border-radius:4px; padding:15px; margin-bottom:20px;">
            <h6 style="color:#856404; margin-bottom:10px;">
                <i class="bi bi-exclamation-triangle"></i> 
                <span id="warningTitle">⚠️ Interpretatie richtlijnen Homozygotie Waarde:</span>
            </h6>
            <ul id="warningList" style="margin:0; padding-left:20px;">
                <li><strong>&lt; 10%:</strong> Laag risico op inteeltproblemen</li>
                <li><strong>10-20%:</strong> Matig risico - gezondheidstesten aanbevolen</li>
                <li><strong>&gt; 20%:</strong> Hoog risico - voorzichtigheid bij fokken geboden</li>
                <li><strong>&gt; 30%:</strong> Zeer hoog risico - sterke genetische uniformiteit</li>
            </ul>
        </div>
        
        <!-- USAGE -->
        <div style="margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:15px;">
                <i class="bi bi-clipboard-check"></i> 
                <span id="usageTitle">Gebruik in fokprogramma's:</span>
            </h6>
            
            <div style="display:flex; flex-wrap:wrap; gap:20px;">
                <!-- AANBEVOLEN -->
                <div style="flex:1; min-width:300px; border:1px solid #28a745; border-radius:4px; overflow:hidden;">
                    <div style="background:#28a745; color:white; padding:10px 15px;">
                        <i class="bi bi-check-circle"></i> 
                        <span id="recommendedTitle" style="font-weight:bold;">✅ Aanbevolen:</span>
                    </div>
                    <div style="padding:15px;">
                        <ul id="recommendedList" style="margin:0; padding-left:20px;">
                            <li>Gebruik als extra screening tool naast gezondheidstesten</li>
                            <li>Vergelijk binnen het ras om relatief minst ingeteelde lijnen te vinden</li>
                            <li>Combineer met DNA-testen voor complete genetische analyse</li>
                        </ul>
                    </div>
                </div>
                
                <!-- NIET AANBEVOLEN -->
                <div style="flex:1; min-width:300px; border:1px solid #dc3545; border-radius:4px; overflow:hidden;">
                    <div style="background:#dc3545; color:white; padding:10px 15px;">
                        <i class="bi bi-x-circle"></i> 
                        <span id="notRecommendedTitle" style="font-weight:bold;">❌ Niet bedoeld voor:</span>
                    </div>
                    <div style="padding:15px;">
                        <ul id="notRecommendedList" style="margin:0; padding-left:20px;">
                            <li>Absolute voorspelling van gezondheidsproblemen</li>
                            <li>Vervanging van dierenartsconsulten en gezondheidstesten</li>
                            <li>Juridische of garantie doeleinden</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- LIMITATIONS -->
        <div style="margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:10px;">
                <i class="bi bi-gear"></i> 
                <span id="limitationsTitle">⚠️ Belangrijke notities:</span>
            </h6>
            <p id="limitationsText1" style="margin:0 0 10px 0; line-height:1.6;">
                Deze waarden zijn schattingen gebaseerd op:<br>
                • Stamboomgegevens over 6 generaties<br>
                • Theoretische populatiegenetica modellen<br>
                • Annames over allelfrequenties in basispopulatie
            </p>
            <p id="limitationsText2" style="margin:0; line-height:1.6;">
                ⚠️ <strong>Beperkingen:</strong><br>
                • Negeert mutaties en genetische drift<br>
                • Gebaseerd op volledige en correcte stamboomdata<br>
                • Kan niet alle epigenetische factoren meenemen
            </p>
        </div>
        
        <!-- SCIENTIFIC -->
        <div style="margin-bottom:20px;">
            <h6 style="color:#0d6efd; margin-bottom:10px;">
                <i class="bi bi-mortarboard"></i> 
                <span id="scientificTitle">Wetenschappelijke basis:</span>
            </h6>
            <p id="scientificText" style="margin:0 0 10px 0; line-height:1.6;">
                De berekeningen zijn gebaseerd op populatiegenetica principes en het Wright-Fisher model. 
                Ze geven een theoretische schatting van genetische uniformiteit, maar kunnen individuele 
                variatie niet volledig voorspellen.
            </p>
            <p id="updateNote" style="margin:0; font-size:14px; color:#6c757d;">
                Laatste update: Deze methode is continu in ontwikkeling en kan worden bijgesteld op basis van nieuwe inzichten uit de genetica.
            </p>
        </div>
        
        <!-- QUOTE -->
        <div style="text-align:center; margin:20px 0; padding:15px; background:#f8f9fa; border-radius:4px;">
            <p id="quoteText" style="margin:0; font-style:italic; color:#0d6efd;">
                "Genetische diversiteit is de verzekering van een ras tegen toekomstige uitdagingen."
            </p>
        </div>
        
        <!-- FINAL DISCLAIMER -->
        <div style="background:#f8d7da; border:1px solid #f5c6cb; border-radius:4px; padding:15px; margin-top:20px;">
            <h6 style="color:#721c24; margin-bottom:10px;">
                <i class="bi bi-shield-exclamation"></i> 
                <span id="disclaimerTitle">DISCLAIMER</span>
            </h6>
            <p id="disclaimerText" style="margin:0; font-weight:bold; color:#721c24;">
                Deze hondendatabase is ter informatie en is niet verantwoordelijk voor de gemaakte 
                combinaties van honden en hun nakomelingen op welke wijze dan ook.
            </p>
        </div>`;
    }
    
    updateTexts() {
        const lang = this.currentLang;
        const t = this.translations[lang] || this.translations.nl;
        
        // Update alle tekst elementen
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key.includes('List')) {
                    element.innerHTML = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
    }
    
    setupEventListener() {
        const btn = document.getElementById('disclaimerBtn');
        if (btn) {
            // Verwijder oude listener eerst
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Voeg nieuwe listener toe
            document.getElementById('disclaimerBtn').addEventListener('click', () => {
                this.show();
            });
        }
    }
    
    setupLanguageListener() {
        // Luister naar klikken op taalvlaggen
        document.querySelectorAll('.app-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.currentLang = lang;
                this.updateTexts();
            });
        });
    }
    
    show() {
        // Check "niet meer tonen"
        if (localStorage.getItem(this.storageKeyDontShow) === 'true') {
            return;
        }
        
        const modal = document.getElementById('disclaimerModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hide() {
        const modal = document.getElementById('disclaimerModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    accept() {
        localStorage.setItem(this.storageKey, new Date().toISOString());
        
        const checkbox = document.getElementById('dontShowAgainCheckbox');
        if (checkbox && checkbox.checked) {
            localStorage.setItem(this.storageKeyDontShow, 'true');
        }
        
        this.hide();
    }
}

// DIRECT STARTEN - GEEN WACHTEN
window.disclaimerManager = new DisclaimerManager();

// Wacht 1 seconde en start
setTimeout(() => {
    window.disclaimerManager.init();
    console.log('DisclaimerManager gestart met taal:', window.disclaimerManager.currentLang);
}, 1000);