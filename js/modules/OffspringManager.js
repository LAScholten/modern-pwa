// js/modules/OffspringManager.js

/**
 * Offspring Manager Module
 * Beheert alle functionaliteit rondom nakomelingen en broers/zussen
 * Dit is een aparte module die gebruikt wordt door SearchManager
 */

class OffspringManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        
        // Caches
        this.dogOffspringCache = new Map();
        this.dogSiblingsCache = new Map();
        this.dogDetailsCache = new Map();
        
        // Huidige modal staten
        this.currentOffspringModalDogId = null;
        this.currentOffspringModalDogName = null;
        this.currentSiblingsModalDogId = null;
        this.currentSiblingsModalDogName = null;
        
        // Translations
        this.translations = {
            nl: {
                offspring: "Nakomelingen",
                noOffspring: "Geen nakomelingen gevonden",
                viewOffspring: "Nakomelingen",
                offspringCount: "Nakomelingen",
                offspringModalTitle: "Nakomelingen van {name}",
                loadingOffspring: "Nakomelingen laden...",
                offspringList: "Lijst van nakomelingen",
                fatherColumn: "Vader",
                motherColumn: "Moeder",
                dogName: "Naam hond",
                totalOffspring: "Totaal aantal",
                birthYear: "Geboortejaar",
                showAllOffspring: "Toon alle nakomelingen",
                
                siblings: "Broers & zussen",
                siblingsCount: "Broers/zussen",
                noSiblings: "Geen broers of zussen gevonden",
                viewSiblings: "Broers & zussen",
                siblingsModalTitle: "Broers en zussen van {name}",
                loadingSiblings: "Broers en zussen laden...",
                siblingsList: "Lijst van broers en zussen",
                fullSiblings: "Volle broers/zussen",
                halfSiblings: "Half broers/zussen",
                siblingType: "Type",
                fullSibling: "Volle broer/zus",
                halfSibling: "Half broer/zus",
                relationship: "Verwantschap",
                commonParent: "Gemeenschappelijke ouder",
                
                viewDogDetails: "Bekijk hond details",
                close: "Sluiten",
                loading: "Laden...",
                unknown: "Onbekend",
                parentsUnknown: "Onbekend",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                male: "Reu",
                female: "Teef",
                birthDate: "Geboortedatum",
                closeDogDetails: "Sluit hond details",
                dogDetailsModalTitle: "Details van {name}",
                backToOffspring: "Terug naar nakomelingen",
                backToSiblings: "Terug naar broers/zussen",
                privateInfo: "Prive Informatie",
                privateInfoOwnerOnly: "Geen informatie",
                healthInfo: "Gezondheidsinformatie",
                additionalInfo: "Extra informatie",
                remarks: "Opmerkingen",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                noHealthInfo: "Geen gezondheidsinformatie beschikbaar",
                noAdditionalInfo: "Geen extra informatie beschikbaar",
                
                hipGrades: {
                    A: "A - Geen tekenen van HD",
                    B: "B - Overgangsvorm",
                    C: "C - Lichte HD",
                    D: "D - Matige HD", 
                    E: "E - Ernstige HD"
                },
                elbowGrades: {
                    "0": "0 - Geen ED",
                    "1": "1 - Milde ED",
                    "2": "2 - Matige ED",
                    "3": "3 - Ernstige ED",
                    "NB": "NB - Niet bekend"
                },
                patellaGrades: {
                    "0": "0 - Geen PL",
                    "1": "1 - Af en toe luxatie",
                    "2": "2 - Regelmatig luxatie",
                    "3": "3 - Constante luxatie"
                },
                eyeStatus: {
                    "Vrij": "Vrij",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Overig"
                },
                dandyStatus: {
                    "Vrij op DNA": "Vrij op DNA",
                    "Vrij op ouders": "Vrij op ouders", 
                    "Drager": "Drager",
                    "Lijder": "Lijder"
                },
                luwGrades: {
                    "0": "0 - Vrij",
                    "1": "1 - Licht",
                    "2": "2 - Matig",
                    "3": "3 - Ernstig"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positive"
                }
            },
            en: {
                offspring: "Offspring",
                noOffspring: "No offspring found",
                viewOffspring: "Offspring",
                offspringCount: "Offspring",
                offspringModalTitle: "Offspring of {name}",
                loadingOffspring: "Loading offspring...",
                offspringList: "List of offspring",
                fatherColumn: "Father",
                motherColumn: "Mother",
                dogName: "Dog name",
                totalOffspring: "Total",
                birthYear: "Birth year",
                showAllOffspring: "Show all offspring",
                
                siblings: "Siblings",
                siblingsCount: "Siblings",
                noSiblings: "No siblings found",
                viewSiblings: "Siblings",
                siblingsModalTitle: "Siblings of {name}",
                loadingSiblings: "Loading siblings...",
                siblingsList: "List of siblings",
                fullSiblings: "Full siblings",
                halfSiblings: "Half siblings",
                siblingType: "Type",
                fullSibling: "Full sibling",
                halfSibling: "Half sibling",
                relationship: "Relationship",
                commonParent: "Common parent",
                
                viewDogDetails: "View dog details",
                close: "Close",
                loading: "Loading...",
                unknown: "Unknown",
                parentsUnknown: "Unknown",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                male: "Male",
                female: "Female",
                birthDate: "Birth date",
                closeDogDetails: "Close dog details",
                dogDetailsModalTitle: "Details of {name}",
                backToOffspring: "Back to offspring",
                backToSiblings: "Back to siblings",
                privateInfo: "Private Information",
                privateInfoOwnerOnly: "No information",
                healthInfo: "Health Information",
                additionalInfo: "Additional Information",
                remarks: "Remarks",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                noHealthInfo: "No health information available",
                noAdditionalInfo: "No additional information available",
                
                hipGrades: {
                    A: "A - No signs of HD",
                    B: "B - Borderline",
                    C: "C - Mild HD",
                    D: "D - Moderate HD",
                    E: "E - Severe HD"
                },
                elbowGrades: {
                    "0": "0 - No ED",
                    "1": "1 - Mild ED",
                    "2": "2 - Moderate ED",
                    "3": "3 - Severe ED",
                    "NB": "NB - Not known"
                },
                patellaGrades: {
                    "0": "0 - No PL",
                    "1": "1 - Occasional luxation",
                    "2": "2 - Frequent luxation",
                    "3": "3 - Constant luxation"
                },
                eyeStatus: {
                    "Vrij": "Free",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Other"
                },
                dandyStatus: {
                    "Vrij op DNA": "Free on DNA",
                    "Vrij op ouders": "Free on parents",
                    "Drager": "Carrier",
                    "Lijder": "Affected"
                },
                luwGrades: {
                    "0": "0 - Free",
                    "1": "1 - Mild",
                    "2": "2 - Moderate",
                    "3": "3 - Severe"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negative",
                    "Positief": "Tgaa Positive"
                }
            },
            de: {
                offspring: "Nachkommen",
                noOffspring: "Keine Nachkommen gefunden",
                viewOffspring: "Nachkommen",
                offspringCount: "Nachkommen",
                offspringModalTitle: "Nachkommen von {name}",
                loadingOffspring: "Nachkommen werden geladen...",
                offspringList: "Liste der Nachkommen",
                fatherColumn: "Vater",
                motherColumn: "Mutter",
                dogName: "Hundename",
                totalOffspring: "Gesamtzahl",
                birthYear: "Geburtsjahr",
                showAllOffspring: "Alle Nachkommen anzeigen",
                
                siblings: "Geschwister",
                siblingsCount: "Geschwister",
                noSiblings: "Keine Geschwister gefunden",
                viewSiblings: "Geschwister",
                siblingsModalTitle: "Geschwister von {name}",
                loadingSiblings: "Geschwister werden geladen...",
                siblingsList: "Liste der Geschwister",
                fullSiblings: "Vollgeschwister",
                halfSiblings: "Halbgeschwister",
                siblingType: "Typ",
                fullSibling: "Vollgeschwister",
                halfSibling: "Halbgeschwister",
                relationship: "Verwandtschaft",
                commonParent: "Gemeinsamer Elternteil",
                
                viewDogDetails: "Hunddetails ansehen",
                close: "Schließen",
                loading: "Laden...",
                unknown: "Unbekannt",
                parentsUnknown: "Unbekannt",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                male: "Rüde",
                female: "Hündin",
                birthDate: "Geburtsdatum",
                closeDogDetails: "Hunddetails schließen",
                dogDetailsModalTitle: "Details von {name}",
                backToOffspring: "Zurück zu Nachkommen",
                backToSiblings: "Zurück zu Geschwistern",
                privateInfo: "Private Informationen",
                privateInfoOwnerOnly: "Keine Informationen",
                healthInfo: "Gesundheitsinformationen",
                additionalInfo: "Zusätzliche Informationen",
                remarks: "Bemerkungen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine zusätzliche Informationen verfügbar",
                
                hipGrades: {
                    A: "A - Keine Anzeichen von HD",
                    B: "B - Grenzform",
                    C: "C - Leichte HD",
                    D: "D - Mittelschwere HD",
                    E: "E - Schwere HD"
                },
                elbowGrades: {
                    "0": "0 - Keine ED",
                    "1": "1 - Leichte ED",
                    "2": "2 - Mittelschwere ED",
                    "3": "3 - Schwere ED",
                    "NB": "NB - Nicht bekannt"
                },
                patellaGrades: {
                    "0": "0 - Keine PL",
                    "1": "1 - Gelegentliche Luxation",
                    "2": "2 - Häufige Luxation",
                    "3": "3 - Ständige Luxation"
                },
                eyeStatus: {
                    "Vrij": "Frei",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Andere"
                },
                dandyStatus: {
                    "Vrij op DNA": "Frei auf DNA",
                    "Vrij op ouders": "Frei auf Eltern",
                    "Drager": "Träger",
                    "Lijder": "Betroffen"
                },
                luwGrades: {
                    "0": "0 - Frei",
                    "1": "1 - Leicht",
                    "2": "2 - Mittel",
                    "3": "3 - Schwer"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negativ",
                    "Positief": "Tgaa Positiv"
                }
            }
        };
        
        // Callback voor het tonen van dog details (wordt gezet door SearchManager)
        this.onShowDogDetails = null;
        // Callback voor het ophalen van prive info
        this.onGetPrivateInfo = null;
        // Callback voor het ophalen van dog details
        this.onGetDogDetails = null;
        
        this.setupGlobalEventListeners();
    }
    
    injectDependencies(db, auth) {
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        console.log('OffspringManager: dependencies geïnjecteerd');
    }
    
    initialize() {
        console.log('OffspringManager: initializing...');
        return Promise.resolve();
    }
    
    setCallbacks(onShowDogDetails, onGetPrivateInfo, onGetDogDetails) {
        this.onShowDogDetails = onShowDogDetails;
        this.onGetPrivateInfo = onGetPrivateInfo;
        this.onGetDogDetails = onGetDogDetails;
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    clearCache() {
        this.dogOffspringCache.clear();
        this.dogSiblingsCache.clear();
        this.dogDetailsCache.clear();
        console.log('OffspringManager: Caches geleegd');
    }
    
    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            const offspringBtn = e.target.closest('.offspring-button');
            if (offspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(offspringBtn.getAttribute('data-dog-id'));
                const dogName = offspringBtn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(dogId, dogName);
            }
            
            const siblingsBtn = e.target.closest('.siblings-button');
            if (siblingsBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(siblingsBtn.getAttribute('data-dog-id'));
                const dogName = siblingsBtn.getAttribute('data-dog-name') || '';
                this.showSiblingsModal(dogId, dogName);
            }
            
            const closeOffspringBtn = e.target.closest('.offspring-modal-close');
            if (closeOffspringBtn) {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                }
            }
            
            const closeSiblingsBtn = e.target.closest('.siblings-modal-close');
            if (closeSiblingsBtn) {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                }
            }
            
            if (e.target.id === 'offspringModalOverlay') {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                }
            }
            
            if (e.target.id === 'siblingsModalOverlay') {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                }
            }
            
            const closeDogDetailsBtn = e.target.closest('.dog-details-modal-close');
            if (closeDogDetailsBtn) {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            if (e.target.id === 'dogDetailsModalOverlay') {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            const backToOffspringBtn = e.target.closest('.back-to-offspring-btn');
            if (backToOffspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        if (this.currentOffspringModalDogId) {
                            this.showOffspringModal(this.currentOffspringModalDogId, this.currentOffspringModalDogName);
                        }
                    }, 300);
                }
            }
            
            const backToSiblingsBtn = e.target.closest('.back-to-siblings-btn');
            if (backToSiblingsBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        if (this.currentSiblingsModalDogId) {
                            this.showSiblingsModal(this.currentSiblingsModalDogId, this.currentSiblingsModalDogName);
                        }
                    }, 300);
                }
            }
        });
    }
    
    async getDogDetails(dogId) {
        if (this.dogDetailsCache.has(dogId)) {
            return this.dogDetailsCache.get(dogId);
        }
        
        if (this.onGetDogDetails) {
            const dog = await this.onGetDogDetails(dogId);
            if (dog) {
                this.dogDetailsCache.set(dogId, dog);
            }
            return dog;
        }
        
        try {
            const { data, error } = await window.supabase
                .from('honden')
                .select('*')
                .eq('id', dogId)
                .single();
            
            if (error) {
                console.error('Fout bij ophalen hond details:', error);
                return null;
            }
            
            if (data) {
                this.dogDetailsCache.set(dogId, data);
            }
            
            return data;
            
        } catch (error) {
            console.error('Fout bij ophalen hond details:', error);
            return null;
        }
    }
    
    async getDogOffspring(dogId) {
        if (!dogId || dogId === 0) return [];
        
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId);
        }
        
        try {
            const { data: offspringIds, error } = await window.supabase
                .from('honden')
                .select('id, naam, kennelnaam, stamboomnr, ras, geslacht, geboortedatum, vader_id, moeder_id, heupdysplasie, elleboogdysplasie, patella, ogen, dandyWalker, LUW, schildklier, opmerkingen')
                .or(`vader_id.eq.${dogId},moeder_id.eq.${dogId}`);
            
            if (error) {
                console.error('Fout bij ophalen nakomelingen:', error);
                return [];
            }
            
            if (!offspringIds || offspringIds.length === 0) {
                this.dogOffspringCache.set(dogId, []);
                return [];
            }
            
            const offspringWithParents = await Promise.all(offspringIds.map(async (puppy) => {
                let fatherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                
                if (puppy.vader_id) {
                    const father = await this.getDogDetails(puppy.vader_id);
                    if (father) {
                        fatherInfo = {
                            id: father.id,
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                if (puppy.moeder_id) {
                    const mother = await this.getDogDetails(puppy.moeder_id);
                    if (mother) {
                        motherInfo = {
                            id: mother.id,
                            naam: mother.naam || this.t('unknown'),
                            stamboomnr: mother.stamboomnr || '',
                            kennelnaam: mother.kennelnaam || ''
                        };
                    }
                }
                
                return {
                    ...puppy,
                    fatherInfo,
                    motherInfo
                };
            }));
            
            offspringWithParents.sort((a, b) => {
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateB - dateA;
            });
            
            this.dogOffspringCache.set(dogId, offspringWithParents);
            return offspringWithParents;
            
        } catch (error) {
            console.error('Fout bij ophalen nakomelingen voor hond:', dogId, error);
            return [];
        }
    }
    
    async getDogSiblings(dogId) {
        if (!dogId || dogId === 0) return [];
        
        if (this.dogSiblingsCache.has(dogId)) {
            return this.dogSiblingsCache.get(dogId);
        }
        
        try {
            const dog = await this.getDogDetails(dogId);
            if (!dog) return [];
            
            const fatherId = dog.vader_id;
            const motherId = dog.moeder_id;
            
            if (!fatherId && !motherId) {
                this.dogSiblingsCache.set(dogId, []);
                return [];
            }
            
            let query = window.supabase
                .from('honden')
                .select('id, naam, kennelnaam, stamboomnr, ras, geslacht, geboortedatum, vader_id, moeder_id, heupdysplasie, elleboogdysplasie, patella, ogen, dandyWalker, LUW, schildklier, opmerkingen');
            
            if (fatherId && motherId) {
                query = query.or(`vader_id.eq.${fatherId},moeder_id.eq.${motherId}`);
            } else if (fatherId) {
                query = query.eq('vader_id', fatherId);
            } else if (motherId) {
                query = query.eq('moeder_id', motherId);
            }
            
            const { data: siblings, error } = await query;
            
            if (error) {
                console.error('Fout bij ophalen broers/zussen:', error);
                return [];
            }
            
            if (!siblings || siblings.length === 0) {
                this.dogSiblingsCache.set(dogId, []);
                return [];
            }
            
            const filteredSiblings = siblings.filter(s => s.id !== dogId);
            
            const siblingsWithParents = await Promise.all(filteredSiblings.map(async (sibling) => {
                const sameFather = fatherId && sibling.vader_id === fatherId;
                const sameMother = motherId && sibling.moeder_id === motherId;
                
                let type = 'half';
                let commonParent = '';
                
                if (sameFather && sameMother) {
                    type = 'full';
                    commonParent = 'beide';
                } else if (sameFather) {
                    type = 'half';
                    commonParent = 'vader';
                } else if (sameMother) {
                    type = 'half';
                    commonParent = 'moeder';
                }
                
                let fatherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                
                if (sibling.vader_id) {
                    const father = await this.getDogDetails(sibling.vader_id);
                    if (father) {
                        fatherInfo = {
                            id: father.id,
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                if (sibling.moeder_id) {
                    const mother = await this.getDogDetails(sibling.moeder_id);
                    if (mother) {
                        motherInfo = {
                            id: mother.id,
                            naam: mother.naam || this.t('unknown'),
                            stamboomnr: mother.stamboomnr || '',
                            kennelnaam: mother.kennelnaam || ''
                        };
                    }
                }
                
                return {
                    ...sibling,
                    siblingType: type,
                    commonParent: commonParent,
                    fatherInfo,
                    motherInfo,
                    sortOrder: type === 'full' ? 0 : 1
                };
            }));
            
            siblingsWithParents.sort((a, b) => {
                if (a.sortOrder !== b.sortOrder) {
                    return a.sortOrder - b.sortOrder;
                }
                
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateA - dateB;
            });
            
            this.dogSiblingsCache.set(dogId, siblingsWithParents);
            return siblingsWithParents;
            
        } catch (error) {
            console.error('Fout bij ophalen broers/zussen voor hond:', dogId, error);
            return [];
        }
    }
    
    async getOffspringCount(dogId) {
        if (!dogId || dogId === 0) return 0;
        
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId).length;
        }
        
        try {
            const { count, error } = await window.supabase
                .from('honden')
                .select('*', { count: 'exact', head: true })
                .or(`vader_id.eq.${dogId},moeder_id.eq.${dogId}`);
            
            if (error) {
                console.error('Fout bij tellen nakomelingen:', error);
                return 0;
            }
            
            return count || 0;
            
        } catch (error) {
            console.error('Fout bij tellen nakomelingen:', error);
            return 0;
        }
    }
    
    async getSiblingsCount(dogId) {
        if (!dogId || dogId === 0) return 0;
        
        if (this.dogSiblingsCache.has(dogId)) {
            return this.dogSiblingsCache.get(dogId).length;
        }
        
        try {
            const dog = await this.getDogDetails(dogId);
            if (!dog) return 0;
            
            const fatherId = dog.vader_id;
            const motherId = dog.moeder_id;
            
            if (!fatherId && !motherId) {
                return 0;
            }
            
            let query = window.supabase
                .from('honden')
                .select('*', { count: 'exact', head: true });
            
            if (fatherId && motherId) {
                query = query.or(`vader_id.eq.${fatherId},moeder_id.eq.${motherId}`);
            } else if (fatherId) {
                query = query.eq('vader_id', fatherId);
            } else if (motherId) {
                query = query.eq('moeder_id', motherId);
            }
            
            const { count, error } = await query;
            
            if (error) {
                console.error('Fout bij tellen broers/zussen:', error);
                return 0;
            }
            
            return Math.max(0, (count || 0) - 1);
            
        } catch (error) {
            console.error('Fout bij tellen broers/zussen:', error);
            return 0;
        }
    }
    
    async showOffspringModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('offspringModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        this.currentOffspringModalDogId = dogId;
        this.currentOffspringModalDogName = dogName;
        
        const overlayHTML = `
            <div class="modal-overlay offspring-modal-overlay" id="offspringModalOverlay" style="display: flex;">
                <div class="modal-container offspring-modal-container" style="width: 95%; max-width: 1600px;">
                    <div class="modal-header offspring-modal-header">
                        <h5 class="modal-title offspring-modal-title">
                            <i class="bi bi-people-fill me-2"></i> ${this.t('offspringModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white offspring-modal-close" aria-label="${this.t('close')}"></button>
                    </div>
                    <div class="modal-body offspring-modal-body" id="offspringModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loadingOffspring')}</span>
                            </div>
                            <p class="mt-3">${this.t('loadingOffspring')}</p>
                        </div>
                    </div>
                    <div class="modal-footer offspring-modal-footer">
                        <button type="button" class="btn btn-secondary offspring-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        this.loadAndDisplayOffspring(dogId, dogName);
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        const overlay = document.getElementById('offspringModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    async showSiblingsModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('siblingsModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        this.currentSiblingsModalDogId = dogId;
        this.currentSiblingsModalDogName = dogName;
        
        const overlayHTML = `
            <div class="modal-overlay siblings-modal-overlay" id="siblingsModalOverlay" style="display: flex;">
                <div class="modal-container siblings-modal-container" style="width: 95%; max-width: 1600px;">
                    <div class="modal-header siblings-modal-header">
                        <h5 class="modal-title siblings-modal-title">
                            <i class="bi bi-people me-2"></i> ${this.t('siblingsModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white siblings-modal-close" aria-label="${this.t('close')}"></button>
                    </div>
                    <div class="modal-body siblings-modal-body" id="siblingsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loadingSiblings')}</span>
                            </div>
                            <p class="mt-3">${this.t('loadingSiblings')}</p>
                        </div>
                    </div>
                    <div class="modal-footer siblings-modal-footer">
                        <button type="button" class="btn btn-secondary siblings-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        this.loadAndDisplaySiblings(dogId, dogName);
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        const overlay = document.getElementById('siblingsModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    async loadAndDisplayOffspring(dogId, dogName) {
        const contentDiv = document.getElementById('offspringModalContent');
        if (!contentDiv) return;
        
        try {
            const offspring = await this.getDogOffspring(dogId);
            const count = offspring.length;
            
            if (count === 0) {
                contentDiv.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-people display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noOffspring')}</p>
                    </div>
                `;
                return;
            }
            
            let html = `
                <div class="offspring-stats mb-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        ${this.t('totalOffspring')}: <strong>${count}</strong>
                    </div>
                </div>
                
                <div class="offspring-list-container">
                    <h6 class="mb-3">
                        <i class="bi bi-list-ul me-2"></i> ${this.t('offspringList')}
                    </h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm" style="min-width: 1400px;">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${this.t('dogName')}</th>
                                    <th scope="col">${this.t('fatherColumn')}</th>
                                    <th scope="col">${this.t('motherColumn')}</th>
                                    <th scope="col">${this.t('pedigreeNumber')}</th>
                                    <th scope="col">HD</th>
                                    <th scope="col">ED</th>
                                    <th scope="col">PL</th>
                                    <th scope="col">Ogen</th>
                                    <th scope="col">DWLM</th>
                                    <th scope="col">LÜW</th>
                                    <th scope="col">Thyroid</th>
                                    <th scope="col">${this.t('birthYear')}</th>
                                   </tr>
                            </thead>
                            <tbody>
            `;
            
            offspring.forEach((puppy, index) => {
                const birthYear = puppy.geboortedatum ? 
                    new Date(puppy.geboortedatum).getFullYear() : '?';
                
                const fatherDisplay = puppy.fatherInfo.kennelnaam ? 
                    `${puppy.fatherInfo.naam} (${puppy.fatherInfo.kennelnaam})` : 
                    puppy.fatherInfo.naam;
                
                const motherDisplay = puppy.motherInfo.kennelnaam ? 
                    `${puppy.motherInfo.naam} (${puppy.motherInfo.kennelnaam})` : 
                    puppy.motherInfo.naam;
                
                const hasRemark = puppy.opmerkingen && puppy.opmerkingen.trim() !== '';
                const kennelDisplay = puppy.kennelnaam ? 
                    `${puppy.kennelnaam}${hasRemark ? ' <span class="text-danger ms-1" style="cursor: help;" title="Opmerkingen aanwezig"><i class="bi bi-exclamation-triangle-fill"></i></span>' : ''}` : 
                    (hasRemark ? '<span class="text-danger" style="cursor: help;" title="Opmerkingen aanwezig"><i class="bi bi-exclamation-triangle-fill"></i></span>' : '');
                
                html += `
                    <tr class="offspring-row" data-dog-id="${puppy.id}" data-dog-name="${puppy.naam || ''}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="text-primary">${puppy.naam || this.t('unknown')}</strong>
                            ${kennelDisplay ? `<br><small class="text-muted">${kennelDisplay}</small>` : ''}
                        </td>
                        <td>${fatherDisplay}</td>
                        <td>${motherDisplay}</td>
                        <td><code>${puppy.stamboomnr || ''}</code></td>
                        <td>${puppy.heupdysplasie || ''}</td>
                        <td>${puppy.elleboogdysplasie || ''}</td>
                        <td>${puppy.patella || ''}</td>
                        <td>${puppy.ogen || ''}</td>
                        <td>${puppy.dandyWalker || ''}</td>
                        <td>${puppy.LUW || ''}</td>
                        <td>${puppy.schildklier || ''}</td>
                        <td>${birthYear}</td>
                    </tr>
                `;
            });
            
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="mt-4 text-center">
                    <small class="text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        ${this.t('viewDogDetails')}
                    </small>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            
            contentDiv.querySelectorAll('.offspring-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const puppyId = parseInt(row.getAttribute('data-dog-id'));
                    const puppyName = row.getAttribute('data-dog-name');
                    
                    const overlay = document.getElementById('offspringModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    
                    if (this.onShowDogDetails) {
                        this.onShowDogDetails(puppyId, puppyName, 'offspring');
                    }
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden nakomelingen:', error);
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Fout bij laden nakomelingen: ${error.message}
                </div>
            `;
        }
    }
    
    async loadAndDisplaySiblings(dogId, dogName) {
        const contentDiv = document.getElementById('siblingsModalContent');
        if (!contentDiv) return;
        
        try {
            const siblings = await this.getDogSiblings(dogId);
            const count = siblings.length;
            
            if (count === 0) {
                contentDiv.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-people display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noSiblings')}</p>
                    </div>
                `;
                return;
            }
            
            const fullCount = siblings.filter(s => s.siblingType === 'full').length;
            const halfCount = siblings.filter(s => s.siblingType === 'half').length;
            
            let html = `
                <div class="siblings-stats mb-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        ${this.t('totalOffspring')}: <strong>${count}</strong> 
                        (${fullCount} ${this.t('fullSiblings')}, ${halfCount} ${this.t('halfSiblings')})
                    </div>
                </div>
                
                <div class="siblings-list-container">
                    <h6 class="mb-3">
                        <i class="bi bi-list-ul me-2"></i> ${this.t('siblingsList')}
                    </h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm" style="min-width: 1400px;">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${this.t('dogName')}</th>
                                    <th scope="col">${this.t('fatherColumn')}</th>
                                    <th scope="col">${this.t('motherColumn')}</th>
                                    <th scope="col">${this.t('relationship')}</th>
                                    <th scope="col">${this.t('pedigreeNumber')}</th>
                                    <th scope="col">HD</th>
                                    <th scope="col">ED</th>
                                    <th scope="col">PL</th>
                                    <th scope="col">Ogen</th>
                                    <th scope="col">DWLM</th>
                                    <th scope="col">LÜW</th>
                                    <th scope="col">Thyroid</th>
                                    <th scope="col">${this.t('birthYear')}</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            siblings.forEach((sibling, index) => {
                const birthYear = sibling.geboortedatum ? 
                    new Date(sibling.geboortedatum).getFullYear() : '?';
                
                const relationshipText = sibling.siblingType === 'full' ? 
                    this.t('fullSibling') : this.t('halfSibling');
                
                const fatherDisplay = sibling.fatherInfo.kennelnaam ? 
                    `${sibling.fatherInfo.naam} (${sibling.fatherInfo.kennelnaam})` : 
                    sibling.fatherInfo.naam;
                
                const motherDisplay = sibling.motherInfo.kennelnaam ? 
                    `${sibling.motherInfo.naam} (${sibling.motherInfo.kennelnaam})` : 
                    sibling.motherInfo.naam;
                
                const rowClass = sibling.siblingType === 'full' ? 'full-sibling-row' : 'half-sibling-row';
                
                const hasRemark = sibling.opmerkingen && sibling.opmerkingen.trim() !== '';
                const kennelDisplay = sibling.kennelnaam ? 
                    `${sibling.kennelnaam}${hasRemark ? ' <span class="text-danger ms-1" style="cursor: help;" title="Opmerkingen aanwezig"><i class="bi bi-exclamation-triangle-fill"></i></span>' : ''}` : 
                    (hasRemark ? '<span class="text-danger" style="cursor: help;" title="Opmerkingen aanwezig"><i class="bi bi-exclamation-triangle-fill"></i></span>' : '');
                
                html += `
                    <tr class="sibling-row ${rowClass}" data-dog-id="${sibling.id}" data-dog-name="${sibling.naam || ''}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="${sibling.siblingType === 'full' ? 'text-success' : 'text-primary'}">${sibling.naam || this.t('unknown')}</strong>
                            ${kennelDisplay ? `<br><small class="text-muted">${kennelDisplay}</small>` : ''}
                        </td>
                        <td>${fatherDisplay}</td>
                        <td>${motherDisplay}</td>
                        <td>
                            <span class="badge ${sibling.siblingType === 'full' ? 'bg-success' : 'bg-info'}">${relationshipText}</span>
                        </td>
                        <td><code>${sibling.stamboomnr || ''}</code></td>
                        <td>${sibling.heupdysplasie || ''}</td>
                        <td>${sibling.elleboogdysplasie || ''}</td>
                        <td>${sibling.patella || ''}</td>
                        <td>${sibling.ogen || ''}</td>
                        <td>${sibling.dandyWalker || ''}</td>
                        <td>${sibling.LUW || ''}</td>
                        <td>${sibling.schildklier || ''}</td>
                        <td>${birthYear}</td>
                    </tr>
                `;
            });
            
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="mt-4 text-center">
                    <small class="text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        ${this.t('viewDogDetails')}
                    </small>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            
            contentDiv.querySelectorAll('.sibling-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const siblingId = parseInt(row.getAttribute('data-dog-id'));
                    const siblingName = row.getAttribute('data-dog-name');
                    
                    const overlay = document.getElementById('siblingsModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    
                    if (this.onShowDogDetails) {
                        this.onShowDogDetails(siblingId, siblingName, 'siblings');
                    }
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden broers/zussen:', error);
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Fout bij laden broers/zussen: ${error.message}
                </div>
            `;
        }
    }
}

window.OffspringManager = OffspringManager;