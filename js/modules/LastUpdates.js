/**
 * LastUpdates Module - TOONT ALLE HONDEN VAN LAATSTE 7 DAGEN
 * Toont alle honden die in de afgelopen 7 dagen zijn toegevoegd of gewijzigd
 * Geen limiet - toont alles van de afgelopen 7 dagen
 */

const LastUpdatesModule = (function() {
    'use strict';
    
    // Private variabelen
    let supabaseClient = null;
    let currentModal = null;
    
    /**
     * Formatteer een datum naar leesbaar formaat
     */
    function formatDate(dateString) {
        if (!dateString) return 'Onbekend';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    /**
     * Controleer of een datum binnen de laatste X dagen valt
     */
    function isWithinLastDays(dateString, days = 7) {
        if (!dateString) return false;
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        
        const now = new Date();
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
        
        return diffDays <= days;
    }
    
    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Haal alle honden op die in de afgelopen 7 dagen zijn toegevoegd of gewijzigd
     * Gebruikt meerdere queries met filters voor optimale performance
     */
    async function loadLastUpdates() {
        const contentContainer = document.getElementById('lastUpdatesContent');
        if (!contentContainer) return;
        
        try {
            console.log('LastUpdatesModule: Fetching all dogs from last 7 days...');
            
            // Toon loading indicator
            contentContainer.innerHTML = `
                <div class="text-center p-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Laden...</span>
                    </div>
                    <p class="mt-2">Alle honden van de afgelopen 7 dagen worden geladen...</p>
                </div>
            `;
            
            // Bereken de datum van 7 dagen geleden
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const sevenDaysAgoStr = sevenDaysAgo.toISOString();
            
            console.log(`Zoeken naar honden vanaf: ${sevenDaysAgoStr}`);
            
            // Query 1: Honden die in de afgelopen 7 dagen zijn aangemaakt (createdat)
            const { data: newDogs, error: error1 } = await supabaseClient
                .from('honden')
                .select('*')
                .gte('createdat', sevenDaysAgoStr)
                .order('createdat', { ascending: false });
            
            if (error1) console.error('Error fetching new dogs:', error1);
            
            // Query 2: Honden die in de afgelopen 7 dagen zijn gewijzigd (updatedat)
            const { data: updatedDogs, error: error2 } = await supabaseClient
                .from('honden')
                .select('*')
                .gte('updatedat', sevenDaysAgoStr)
                .order('updatedat', { ascending: false });
            
            if (error2) console.error('Error fetching updated dogs:', error2);
            
            // Combineer en verwijder duplicaten (gebruik stamboomnr als unieke key)
            const allDogsMap = new Map();
            
            if (newDogs && newDogs.length > 0) {
                newDogs.forEach(dog => {
                    allDogsMap.set(dog.stamboomnr, { ...dog, _reason: 'nieuw' });
                });
                console.log(`${newDogs.length} nieuwe honden gevonden (laatste 7 dagen)`);
            }
            
            if (updatedDogs && updatedDogs.length > 0) {
                updatedDogs.forEach(dog => {
                    if (allDogsMap.has(dog.stamboomnr)) {
                        // Bestaande hond, update de reason
                        allDogsMap.set(dog.stamboomnr, { ...dog, _reason: 'gewijzigd' });
                    } else {
                        allDogsMap.set(dog.stamboomnr, { ...dog, _reason: 'gewijzigd' });
                    }
                });
                console.log(`${updatedDogs.length} gewijzigde honden gevonden (laatste 7 dagen)`);
            }
            
            // Zet om naar array en sorteer op meest recente datum
            const allRecentDogs = Array.from(allDogsMap.values());
            
            // Sorteer op de meest recente van (updatedat of createdat)
            allRecentDogs.sort((a, b) => {
                const dateA = new Date(a.updatedat || a.createdat);
                const dateB = new Date(b.updatedat || b.createdat);
                return dateB - dateA;
            });
            
            const totalCount = allRecentDogs.length;
            
            // Haal ook het totale aantal honden in de database op
            const { count: dbTotalCount, error: countError } = await supabaseClient
                .from('honden')
                .select('*', { count: 'exact', head: true });
            
            if (countError) console.error('Error getting total count:', countError);
            
            console.log(`Totaal ${totalCount} honden gevonden in de afgelopen 7 dagen`);
            
            if (totalCount === 0) {
                contentContainer.innerHTML = `
                    <div class="alert alert-info text-center">
                        <i class="bi bi-info-circle"></i> 
                        <strong>Geen honden gevonden in de afgelopen 7 dagen</strong>
                        <br><small>Er zijn geen honden toegevoegd of gewijzigd tussen ${formatDate(sevenDaysAgoStr)} en nu.</small>
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-sm btn-outline-primary" id="refreshLastUpdatesBtn">
                            <i class="bi bi-arrow-clockwise"></i> Vernieuwen
                        </button>
                    </div>
                `;
                
                const refreshBtn = document.getElementById('refreshLastUpdatesBtn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', () => loadLastUpdates());
                }
                return;
            }
            
            // Genereer HTML voor alle honden van de afgelopen 7 dagen
            let html = `
                <div class="mb-3">
                    <div class="alert alert-success">
                        <i class="bi bi-calendar-check"></i> 
                        <strong>Honden van de afgelopen 7 dagen (${totalCount} stuks)</strong>
                        <br><small>Periode: ${formatDate(sevenDaysAgoStr)} tot nu</small>
                        <br><small>Totaal in database: ${(dbTotalCount || 0).toLocaleString()} honden</small>
                    </div>
                    <div class="alert alert-info small">
                        <i class="bi bi-info-circle"></i> 
                        <strong>Legenda:</strong>
                        <span class="badge bg-success ms-2">Nieuw!</span> = Toegevoegd in de afgelopen 7 dagen
                        <span class="badge bg-warning text-dark ms-2">Gewijzigd!</span> = Gewijzigd in de afgelopen 7 dagen
                    </div>
                </div>
                <div class="list-group" style="max-height: 550px; overflow-y: auto;">
            `;
            
            for (const dog of allRecentDogs) {
                const updateDate = formatDate(dog.updatedat);
                const createdDate = formatDate(dog.createdat);
                const isNew = dog._reason === 'nieuw' || isWithinLastDays(dog.createdat, 7);
                const isUpdated = dog._reason === 'gewijzigd' || (isWithinLastDays(dog.updatedat, 7) && !isNew);
                
                html += `
                    <div class="list-group-item list-group-item-action last-update-item" style="border-left: 4px solid ${isNew ? '#198754' : '#ffc107'}; margin-bottom: 8px; border-radius: 8px;">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                    <h6 class="mb-0">
                                        <strong>${escapeHtml(dog.naam || 'Onbekend')}</strong>
                                    </h6>
                                    ${isNew ? '<span class="badge bg-success">Nieuw!</span>' : ''}
                                    ${isUpdated ? '<span class="badge bg-warning text-dark">Gewijzigd!</span>' : ''}
                                    ${dog.status === 'actief' ? '<span class="badge bg-primary">Actief</span>' : ''}
                                    ${dog.status === 'overleden' ? '<span class="badge bg-secondary">Overleden</span>' : ''}
                                </div>
                                
                                <div class="row small mb-2">
                                    <div class="col-md-6">
                                        <i class="bi bi-tag"></i> <strong>Stamboomnr:</strong> ${escapeHtml(dog.stamboomnr || '-')}
                                    </div>
                                    <div class="col-md-6">
                                        <i class="bi bi-building"></i> <strong>Kennel:</strong> ${escapeHtml(dog.kennelnaam || '-')}
                                    </div>
                                </div>
                                
                                <div class="row small mb-2">
                                    <div class="col-md-6">
                                        <i class="bi bi-calendar2-pencil"></i> <strong>Laatst gewijzigd:</strong> ${updateDate}
                                    </div>
                                    <div class="col-md-6">
                                        <i class="bi bi-calendar2-plus"></i> <strong>Aangemaakt:</strong> ${createdDate}
                                    </div>
                                </div>
                                
                                <div class="row small mb-2">
                                    <div class="col-md-6">
                                        <i class="bi bi-palette"></i> <strong>Kleur:</strong> ${escapeHtml(dog.vachtkleur || '-')}
                                    </div>
                                    <div class="col-md-6">
                                        <i class="bi bi-heart-pulse"></i> <strong>Status:</strong> ${escapeHtml(dog.status || 'Onbekend')}
                                    </div>
                                </div>
                                
                                ${dog.opmerkingen ? `
                                <div class="small text-muted mt-2">
                                    <i class="bi bi-chat"></i> <strong>Opmerking:</strong> ${escapeHtml(dog.opmerkingen.substring(0, 100))}${dog.opmerkingen.length > 100 ? '...' : ''}
                                </div>
                                ` : ''}
                                
                                <div class="mt-3">
                                    <button class="btn btn-sm btn-outline-info view-dog-details" data-stamboomnr="${escapeHtml(dog.stamboomnr)}" data-id="${dog.id || ''}">
                                        <i class="bi bi-eye"></i> Bekijk alle details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            html += `</div>`;
            
            // Voeg een footer toe met totaal aantal en refresh knop
            html += `
                <div class="mt-3 d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        <i class="bi bi-database"></i> Totaal ${totalCount} honden in de afgelopen 7 dagen
                        ${dbTotalCount ? `| ${dbTotalCount.toLocaleString()} honden totaal in database` : ''}
                    </div>
                    <button class="btn btn-sm btn-outline-primary" id="refreshLastUpdatesBtn">
                        <i class="bi bi-arrow-clockwise"></i> Vernieuwen
                    </button>
                </div>
            `;
            
            contentContainer.innerHTML = html;
            
            // Voeg event listeners toe aan de detail knoppen
            document.querySelectorAll('.view-dog-details').forEach(btn => {
                btn.addEventListener('click', function() {
                    const stamboomnr = this.getAttribute('data-stamboomnr');
                    const id = this.getAttribute('data-id');
                    showDogDetails(stamboomnr, id);
                });
            });
            
            // Voeg event listener toe aan de refresh knop
            const refreshBtn = document.getElementById('refreshLastUpdatesBtn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    loadLastUpdates();
                });
            }
            
        } catch (error) {
            console.error('LastUpdatesModule: Error loading updates:', error);
            contentContainer.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Fout bij laden van gegevens: ${error.message}
                    <br><small>Controleer de console voor meer details.</small>
                    <br><br>
                    <button class="btn btn-sm btn-outline-danger" id="retryLastUpdatesBtn">
                        <i class="bi bi-arrow-clockwise"></i> Probeer opnieuw
                    </button>
                </div>
            `;
            
            const retryBtn = document.getElementById('retryLastUpdatesBtn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    loadLastUpdates();
                });
            }
        }
    }
    
    /**
     * Toon details van een specifieke hond
     */
    async function showDogDetails(stamboomnr, id) {
        if (!stamboomnr && !id) return;
        
        try {
            let query = supabaseClient.from('honden').select('*');
            
            if (stamboomnr) {
                query = query.eq('stamboomnr', stamboomnr);
            } else if (id) {
                query = query.eq('id', parseInt(id));
            }
            
            const { data: dog, error } = await query.single();
            
            if (error) throw error;
            if (!dog) {
                alert('Hond niet gevonden');
                return;
            }
            
            // Toon een modal met details
            const detailsHtml = `
                <div class="modal fade" id="dogDetailsModal" tabindex="-1">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-info-circle"></i> 
                                    Details: ${escapeHtml(dog.naam || 'Onbekend')}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">Basis Informatie</h6>
                                        <table class="table table-sm">
                                            <tr><th style="width: 40%;">ID:</th><td>${dog.id || '-'}</td>
                                            <tr><th>Stamboomnr:</th><td><strong>${escapeHtml(dog.stamboomnr || '-')}</strong></td>
                                            <tr><th>Naam:</th><td>${escapeHtml(dog.naam || '-')}</td>
                                            <tr><th>Kennelnaam:</th><td>${escapeHtml(dog.kennelnaam || '-')}</td>
                                            <tr><th>Ras:</th><td>${escapeHtml(dog.ras || '-')}</td>
                                            <tr><th>Vachtkleur:</th><td>${escapeHtml(dog.vachtkleur || '-')}</td>
                                            <tr><th>Geboortedatum:</th><td>${escapeHtml(dog.geboortedatum || '-')}</td>
                                            <tr><th>Overlijdensdatum:</th><td>${escapeHtml(dog.overlijdensdatum || '-')}</td>
                                            <tr><th>Status:</th><td>${escapeHtml(dog.status || '-')}</td>
                                        </table>
                                    </div>
                                    <div class="col-md-6">
                                        <h6 class="border-bottom pb-2">Afstamming</h6>
                                        <table class="table table-sm">
                                            <tr><th style="width: 40%;">Vader:</th><td>${escapeHtml(dog.vader || '-')}</td>
                                            <tr><th>Vader Stamboomnr:</th><td>${escapeHtml(dog.vader_stamboomnr || '-')}</td>
                                            <tr><th>Moeder:</th><td>${escapeHtml(dog.moeder || '-')}</td>
                                            <tr><th>Moeder Stamboomnr:</th><td>${escapeHtml(dog.moeder_stamboomnr || '-')}</td>
                                        </table>
                                        
                                        <h6 class="border-bottom pb-2 mt-3">Gezondheid</h6>
                                        <table class="table table-sm">
                                            <tr><th style="width: 40%;">Heupdysplasie (HD):</th><td>${escapeHtml(dog.heupdysplasie || '-')}</td>
                                            <tr><th>Elleboogdysplasie (ED):</th><td>${escapeHtml(dog.elleboogdysplasie || '-')}</td>
                                            <tr><th>Patella:</th><td>${escapeHtml(dog.patella || '-')}</td>
                                            <tr><th>Ogen:</th><td>${escapeHtml(dog.ogen || '-')}</td>
                                            <tr><th>Ogenverklaring:</th><td>${escapeHtml(dog.ogenverklaring || '-')}</td>
                                            <tr><th>Dandy Walker:</th><td>${escapeHtml(dog.dandywalker || '-')}</td>
                                            <tr><th>Schildklier:</th><td>${escapeHtml(dog.schildklier || '-')}</td>
                                            <tr><th>Schildklierverklaring:</th><td>${escapeHtml(dog.schildklierverklaring || '-')}</td>
                                            <tr><th>LUW:</th><td>${escapeHtml(dog.LUW || '-')}</td>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <h6 class="border-bottom pb-2">Overige Informatie</h6>
                                        <table class="table table-sm">
                                            <tr><th style="width: 20%;">Land:</th><td>${escapeHtml(dog.land || '-')}</td>
                                            <tr><th>Postcode:</th><td>${escapeHtml(dog.postcode || '-')}</td>
                                            <tr><th>Aangemaakt op:</th><td>${formatDate(dog.createdat)}</td>
                                            <tr><th>Laatst bijgewerkt:</th><td>${formatDate(dog.updatedat)}</td>
                                            <tr><th>Toegevoegd door:</th><td>${escapeHtml(dog.toegevoegd_door || '-')}</td>
                                        </table>
                                        
                                        <h6 class="border-bottom pb-2">Opmerkingen</h6>
                                        <p class="small bg-light p-2 rounded">${escapeHtml(dog.opmerkingen || 'Geen opmerkingen')}</p>
                                        
                                        <h6 class="border-bottom pb-2">Gezondheidsinfo</h6>
                                        <p class="small bg-light p-2 rounded">${escapeHtml(dog.gezondheidsinfo || 'Geen gezondheidsinfo')}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Verwijder bestaande modal als die er is
            const existingModal = document.getElementById('dogDetailsModal');
            if (existingModal) existingModal.remove();
            
            // Voeg nieuwe modal toe
            document.body.insertAdjacentHTML('beforeend', detailsHtml);
            
            // Toon modal
            const modalElement = document.getElementById('dogDetailsModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Verwijder modal na sluiten
            modalElement.addEventListener('hidden.bs.modal', function() {
                modalElement.remove();
            });
            
        } catch (error) {
            console.error('Error showing dog details:', error);
            alert('Fout bij laden van details: ' + error.message);
        }
    }
    
    /**
     * Initialize de module
     */
    function init() {
        console.log('LastUpdatesModule: Initializing...');
        
        // Supabase client ophalen van window object
        if (window.supabase) {
            supabaseClient = window.supabase;
            console.log('LastUpdatesModule: Supabase client connected');
        } else {
            console.error('LastUpdatesModule: Supabase client not found');
        }
    }
    
    /**
     * Toon de modal met laatste aanpassingen
     */
    async function showModal() {
        console.log('LastUpdatesModule: Showing modal...');
        
        const modalElement = document.getElementById('lastUpdatesModal');
        if (!modalElement) {
            console.error('LastUpdatesModule: Modal element not found');
            alert('Modal element niet gevonden');
            return;
        }
        
        // Toon de modal
        currentModal = new bootstrap.Modal(modalElement);
        currentModal.show();
        
        // Laad de data
        await loadLastUpdates();
    }
    
    /**
     * Sluit de modal
     */
    function closeModal() {
        if (currentModal) {
            currentModal.hide();
            currentModal = null;
        }
    }
    
    // Public API
    return {
        init: init,
        showModal: showModal,
        closeModal: closeModal,
        loadLastUpdates: loadLastUpdates
    };
})();

// Maak de module globaal beschikbaar
window.LastUpdatesModule = LastUpdatesModule;

// Initialiseer automatisch als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LastUpdatesModule.init();
    });
} else {
    LastUpdatesModule.init();
}