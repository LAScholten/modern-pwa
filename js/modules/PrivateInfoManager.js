// SUPABASE HONDEN SERVICE - Werkt via window.supabase van CDN
// Geen imports, geen eigen client maken

// ========== HONDEN SERVICE ==========
const hondenService = {
  // 1. Alle honden ophalen MET PAGINATIE (veilig voor grote datasets)
  async getHonden(page = 1, pageSize = 100) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const { data, error, count } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact' })
        .order('naam', { ascending: true })
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        honden: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize),
        heeftVolgende: endIndex < (count || 0) - 1,
        heeftVorige: page > 1
      };
    } catch (error) {
      console.error('Fout bij ophalen honden:', error);
      return {
        honden: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0,
        heeftVolgende: false,
        heeftVorige: false
      };
    }
  },

  // 2. Zoeken MET PAGINATIE (veilig voor grote datasets)
  async zoekHonden(criteria, page = 1, pageSize = 100) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      let query = window.supabase
        .from('honden')
        .select('*', { count: 'exact' });
      
      if (criteria.naam) query = query.ilike('naam', `%${criteria.naam}%`);
      if (criteria.kennelnaam) query = query.ilike('kennelnaam', `%${criteria.kennelnaam}%`);
      if (criteria.stamboomnr) query = query.ilike('stamboomnr', `%${criteria.stamboomnr}%`);
      if (criteria.ras) query = query.ilike('ras', `%${criteria.ras}%`);
      if (criteria.geslacht) query = query.eq('geslacht', criteria.geslacht);
      if (criteria.land) query = query.ilike('land', `%${criteria.land}%`);
      
      const { data, error, count } = await query
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        honden: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize),
        heeftVolgende: endIndex < (count || 0) - 1,
        heeftVorige: page > 1
      };
    } catch (error) {
      console.error('Fout bij zoeken honden:', error);
      return {
        honden: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0,
        heeftVolgende: false,
        heeftVorige: false
      };
    }
  },

  // 3. Hond op stamboomnummer
  async getHondByStamboomnr(stamboomnr) {
    try {
      const { data, error } = await window.supabase
        .from('honden')
        .select('*')
        .eq('stamboomnr', stamboomnr)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Fout bij ophalen hond:', error);
      return null;
    }
  },

  // 4. Hond op ID
  async getHondById(id) {
    try {
      const { data, error } = await window.supabase
        .from('honden')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Fout bij ophalen hond:', error);
      return null;
    }
  },

  // 5. Hond toevoegen - GECORRIGEERD: met RLS compliance
  async voegHondToe(hond) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      
      if (!user || !user.id) {
        throw new Error('Gebruiker niet ingelogd of geen user ID beschikbaar');
      }
      
      // GEBRUIK DEZELFDE VELDEN ALS DogDataManager.js + user_id voor RLS
      const supabaseHond = {
        // Basis velden
        naam: hond.naam || '',
        kennelnaam: hond.kennelnaam || '',
        stamboomnr: hond.stamboomnr || '',
        ras: hond.ras || '',
        vachtkleur: hond.vachtkleur || '',
        geslacht: hond.geslacht || '',
        
        // Ouders
        vader_id: hond.vader_id || null,
        moeder_id: hond.moeder_id || null,
        vader: hond.vader || '',
        moeder: hond.moeder || '',
        
        // Datums
        geboortedatum: hond.geboortedatum || null,
        overlijdensdatum: hond.overlijdensdatum || null,
        
        // LOSSE GEZONDHEIDSVELDEN - geen JSON!
        heupdysplasie: hond.heupdysplasie || null,
        elleboogdysplasie: hond.elleboogdysplasie || null,
        patella: hond.patella || null,
        ogen: hond.ogen || null,
        ogenverklaring: hond.ogenverklaring || null,
        dandyWalker: hond.dandyWalker || null,
        schildklier: hond.schildklier || null,
        schildklierverklaring: hond.schildklierverklaring || null,
        
        // Locatie
        land: hond.land || null,
        postcode: hond.postcode || null,
        
        // Opmerkingen
        opmerkingen: hond.opmerkingen || null,
        
        // BELANGRIJK: User ID voor RLS (Row Level Security)
        user_id: user.id,
        toegevoegd_door: user.id,
        
        // Systeemvelden
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
        aangemaakt_op: new Date().toISOString(),
        bijgewerkt_op: new Date().toISOString()
      };
      
      console.log('[HONDENSERVICE] voegHondToe - Data naar Supabase:', supabaseHond);
      console.log('[HONDENSERVICE] User ID voor RLS:', user.id);
      console.log('[HONDENSERVICE] Heupdysplasie:', supabaseHond.heupdysplasie);
      console.log('[HONDENSERVICE] Elleboogdysplasie:', supabaseHond.elleboogdysplasie);
      console.log('[HONDENSERVICE] Ogen:', supabaseHond.ogen);
      console.log('[HONDENSERVICE] Dandy Walker:', supabaseHond.dandyWalker);
      console.log('[HONDENSERVICE] Schildklier:', supabaseHond.schildklier);
      
      const { data, error } = await window.supabase
        .from('honden')
        .insert(supabaseHond)
        .select()
        .single();
      
      if (error) {
        console.error('[HONDENSERVICE] Supabase insert error:', error);
        throw error;
      }
      
      console.log('[HONDENSERVICE] Hond succesvol toegevoegd:', data);
      return data;
    } catch (error) {
      console.error('Fout bij toevoegen hond:', error);
      throw error;
    }
  },
// 6. Update hond
async updateHond(hondData) {
  try {
    if (!hondData.id) throw new Error('Hond ID is vereist voor update');
    
    console.log('[HONDENSERVICE] updateHond aangeroepen met:', hondData);
    
    // BELANGRIJK: Verwijder de gezondheidsinfo van updateData
    // Dit veld bestaat misschien niet in je database
    const updateData = {
      naam: hondData.naam,
      kennelnaam: hondData.kennelnaam,
      stamboomnr: hondData.stamboomnr,
      ras: hondData.ras,
      vachtkleur: hondData.vachtkleur,
      geslacht: hondData.geslacht,
      vader_id: hondData.vader_id || null,
      moeder_id: hondData.moeder_id || null,
      vader: hondData.vader || '',
      moeder: hondData.moeder || '',
      geboortedatum: hondData.geboortedatum || null,
      overlijdensdatum: hondData.overlijdensdatum || null,
      // VERWIJDER DIT: gezondheidsinfo: JSON.stringify({...}),
      // IN PLAATS DAARVAN, gebruik de individuele velden:
      heupdysplasie: hondData.heupdysplasie || null,
      elleboogdysplasie: hondData.elleboogdysplasie || null,
      patella: hondData.patella || null,
      ogen: hondData.ogen || null,
      ogenverklaring: hondData.ogenverklaring || null,
      dandyWalker: hondData.dandyWalker || null,
      schildklier: hondData.schildklier || null,
      schildklierverklaring: hondData.schildklierverklaring || null,
      land: hondData.land || null,
      postcode: hondData.postcode || null,
      opmerkingen: hondData.opmerkingen || null,
      bijgewerkt_op: new Date().toISOString()
    };
    
    console.log('[HONDENSERVICE] Update data naar Supabase:', updateData);
    
    // Probeer WITHOUT .select() eerst
    const { error: updateError } = await window.supabase
      .from('honden')
      .update(updateData)
      .eq('id', hondData.id);
    
    if (updateError) {
      console.error('[HONDENSERVICE] Supabase update error:', updateError);
      throw updateError;
    }
    
    // Controleer of de update echt werkte
    const { data: checkData, error: checkError } = await window.supabase
      .from('honden')
      .select('naam, land, postcode')
      .eq('id', hondData.id)
      .single();
    
    if (checkError) {
      console.error('[HONDENSERVICE] Check na update error:', checkError);
      throw checkError;
    }
    
    console.log('[HONDENSERVICE] Update succesvol, gecontroleerd:', checkData);
    return checkData;
    
  } catch (error) {
    console.error('Fout bij updaten hond:', error);
    throw error;
  }
},

  // 7. Verwijder hond
  async verwijderHond(hondId) {
    try {
      const { error } = await window.supabase
        .from('honden')
        .delete()
        .eq('id', hondId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Fout bij verwijderen hond:', error);
      throw error;
    }
  },

  // 8. Zoek op kennelnaam MET PAGINATIE
  async zoekOpKennelnaam(kennelnaam, page = 1, pageSize = 100) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const { data, error, count } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact' })
        .ilike('kennelnaam', `%${kennelnaam}%`)
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        honden: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize),
        heeftVolgende: endIndex < (count || 0) - 1,
        heeftVorige: page > 1
      };
    } catch (error) {
      console.error('Fout bij zoeken op kennelnaam:', error);
      return {
        honden: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0,
        heeftVolgende: false,
        heeftVorige: false
      };
    }
  },

  // 9. Zoek op vachtkleur MET PAGINATIE
  async zoekOpVachtkleur(vachtkleur, page = 1, pageSize = 100) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const { data, error, count } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact' })
        .ilike('vachtkleur', `%${vachtkleur}%`)
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        honden: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize),
        heeftVolgende: endIndex < (count || 0) - 1,
        heeftVorige: page > 1
      };
    } catch (error) {
      console.error('Fout bij zoeken op vachtkleur:', error);
      return {
        honden: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0,
        heeftVolgende: false,
        heeftVorige: false
      };
    }
  },

  // 10. Honden per kennel MET PAGINATIE
  async getHondenPerKennel(page = 1, pageSize = 20) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const { data, error, count } = await window.supabase
        .from('honden')
        .select('kennelnaam, id, naam, stamboomnr, ras, kleur, geslacht', { count: 'exact' })
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      const kennelOverzicht = {};
      (data || []).forEach(hond => {
        const kennel = hond.kennelnaam || 'Geen kennel';
        
        if (!kennelOverzicht[kennel]) {
          kennelOverzicht[kennel] = {
            naam: kennel,
            aantal: 0,
            honden: []
          };
        }
        
        kennelOverzicht[kennel].aantal++;
        kennelOverzicht[kennel].honden.push({
          id: hond.id,
          naam: hond.naam,
          stamboomnr: hond.stamboomnr,
          ras: hond.ras,
          vachtkleur: hond.kleur,
          geslacht: hond.geslacht
        });
      });
      
      const resultaten = Object.values(kennelOverzicht).sort((a, b) => b.aantal - a.aantal);
      
      return {
        kennels: resultaten,
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize),
        heeftVolgende: endIndex < (count || 0) - 1,
        heeftVorige: page > 1
      };
    } catch (error) {
      console.error('Fout bij ophalen kenneloverzicht:', error);
      return {
        kennels: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0,
        heeftVolgende: false,
        heeftVorige: false
      };
    }
  },

  // 11. Statistieken (geen paginatie nodig, haalt alleen tellingen op)
  async getStatistieken() {
    try {
      const { count: totaalHonden, error: hondenError } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact', head: true });
      
      if (hondenError) throw hondenError;
      
      const { data: hondenData, error: dataError } = await window.supabase
        .from('honden')
        .select('kennelnaam, vachtkleur')
        .limit(5000); // Beperk voor statistiek berekening
      
      if (dataError) throw dataError;
      
      const kennelStats = {};
      const vachtkleurStats = {};
      
      (hondenData || []).forEach(hond => {
        const kennel = hond.kennelnaam || 'Geen kennel';
        kennelStats[kennel] = (kennelStats[kennel] || 0) + 1;
        
        const vachtkleur = hond.vachtkleur || 'Geen vachtkleur opgegeven';
        vachtkleurStats[vachtkleur] = (vachtkleurStats[vachtkleur] || 0) + 1;
      });
      
      return {
        totaalHonden: totaalHonden || 0,
        kennelStatistieken: {
          totaalKennels: Object.keys(kennelStats).length,
          hondenPerKennel: kennelStats
        },
        vachtkleurStatistieken: {
          totaalVachtkleuren: Object.keys(vachtkleurStats).length,
          hondenPerVachtkleur: vachtkleurStats
        },
        laatsteUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fout bij ophalen statistieken:', error);
      return {
        totaalHonden: 0,
        kennelStatistieken: { totaalKennels: 0, hondenPerKennel: {} },
        vachtkleurStatistieken: { totaalVachtkleuren: 0, hondenPerVachtkleur: {} },
        laatsteUpdate: null
      };
    }
  },

  // 12. Snelle methode voor beperkt aantal honden (voor dropdowns, etc.)
  async getBeperkteHonden(limit = 200) {
    try {
      const { data, error } = await window.supabase
        .from('honden')
        .select('id, naam, kennelnaam, stamboomnr, ras, geboortedatum')
        .order('naam', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Fout bij ophalen beperkte honden:', error);
      return [];
    }
  },

  // 13. Haal ALLE honden op met paginatie en streaming (voor PrivateInfoManager)
  async getAllHondenForPrivateInfo() {
    try {
      // Eerst tellen we totaal aantal honden
      const { count, error: countError } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const totaalHonden = count || 0;
      console.log(`[HONDENSERVICE] Totaal aantal honden: ${totaalHonden}`);
      
      // Als er minder dan 5000 honden zijn, haal alles in één keer op
      if (totaalHonden <= 5000) {
        console.log(`[HONDENSERVICE] Haal alle ${totaalHonden} honden op in één keer`);
        const { data, error } = await window.supabase
          .from('honden')
          .select('id, naam, stamboomnr, ras, geboortedatum')
          .order('naam', { ascending: true });
        
        if (error) throw error;
        return data || [];
      } else {
        // Voor grote datasets (>5000 honden) gebruiken we gefaseerd laden
        console.log(`[HONDENSERVICE] Grote dataset (${totaalHonden} honden). Haal alleen eerste 5000 op voor dropdown`);
        const { data, error } = await window.supabase
          .from('honden')
          .select('id, naam, stamboomnr, ras, geboortedatum')
          .order('naam', { ascending: true })
          .limit(5000);
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error('Fout bij ophalen alle honden:', error);
      return [];
    }
  },

  // 14. Zoek honden met streaming voor grote datasets (voor PrivateInfoManager)
  async searchHondenForPrivateInfo(searchTerm) {
    try {
      if (!searchTerm.trim()) {
        // Geen zoekterm, retourneer eerste 100 resultaten
        const { data, error } = await window.supabase
          .from('honden')
          .select('id, naam, stamboomnr, ras, geboortedatum')
          .order('naam', { ascending: true })
          .limit(100);
        
        if (error) throw error;
        return data || [];
      } else {
        // Zoek op naam begint met... (efficienter voor grote datasets)
        const { data, error } = await window.supabase
          .from('honden')
          .select('id, naam, stamboomnr, ras, geboortedatum')
          .ilike('naam', `${searchTerm}%`)
          .order('naam', { ascending: true })
          .limit(100);
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error('Fout bij zoeken honden voor privé info:', error);
      return [];
    }
  }
};

// ========== EENVOUDIGE FOTO SERVICE ==========
const fotoService = {
  async checkFotosExist(stamboomnr) {
    try {
      const { count, error } = await window.supabase
        .from('fotos')
        .select('*', { count: 'exact', head: true })
        .eq('stamboomnr', stamboomnr);
      
      if (error) throw error;
      return (count || 0) > 0;
    } catch (error) {
      console.error('Fout bij check foto\'s:', error);
      return false;
    }
  },

  async getFotoThumbnails(stamboomnr, limit = 9) {
    try {
      const { data, error } = await window.supabase
        .from('fotos')
        .select('id, thumbnail, filename, uploaded_at')
        .eq('stamboomnr', stamboomnr)
        .order('uploaded_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(foto => ({
        id: foto.id,
        thumbnail: foto.thumbnail || '',
        filename: foto.filename,
        uploadedAt: foto.uploaded_at
      }));
    } catch (error) {
      console.error('Fout bij ophalen thumbnails:', error);
      return [];
    }
  },

  // Foto's met paginatie
  async getFotosMetPaginatie(stamboomnr, page = 1, pageSize = 12) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const { data, error, count } = await window.supabase
        .from('fotos')
        .select('*', { count: 'exact' })
        .eq('stamboomnr', stamboomnr)
        .order('uploaded_at', { ascending: false })
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        fotos: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Fout bij ophalen foto\'s met paginatie:', error);
      return {
        fotos: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0
      };
    }
  }
};

// ========== PRIVE INFO SERVICE (OPTIONEEL VOOR SERVER-SIDE OPSLAG) ==========
const priveInfoService = {
  async bewaarPriveInfo(priveInfo) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      if (!user) throw new Error('Niet ingelogd');
      
      const infoData = {
        stamboomnr: priveInfo.stamboomnr || '',
        privatenotes: priveInfo.privateNotes || '',
        vertrouwelijk: true,
        laatstgewijzigd: new Date().toISOString(),
        toegevoegd_door: user.id
      };
      
      const { data: existing } = await window.supabase
        .from('priveinfo')
        .select('id')
        .eq('stamboomnr', infoData.stamboomnr)
        .maybeSingle();
      
      if (existing?.id) {
        const { data, error } = await window.supabase
          .from('priveinfo')
          .update(infoData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await window.supabase
          .from('priveinfo')
          .insert(infoData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Fout bij opslaan prive info:', error);
      throw error;
    }
  },

  async getPriveInfoMetPaginatie(page = 1, pageSize = 50) {
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      const user = window.auth ? window.auth.getCurrentUser() : null;
      if (!user) throw new Error('Niet ingelogd');
      
      const { data, error, count } = await window.supabase
        .from('priveinfo')
        .select('*', { count: 'exact' })
        .eq('toegevoegd_door', user.id)
        .order('laatstgewijzigd', { ascending: false })
        .range(startIndex, endIndex);
      
      if (error) throw error;
      
      return {
        priveInfo: data || [],
        pagina: page,
        grootte: pageSize,
        totaal: count || 0,
        totaalPaginas: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Fout bij ophalen prive info:', error);
      return {
        priveInfo: [],
        pagina: page,
        grootte: pageSize,
        totaal: 0,
        totaalPaginas: 0
      };
    }
  }
};

// ========== GLOBAL BESCHIKBAAR MAKEN ==========
window.hondenService = hondenService;
window.fotoService = fotoService;
window.priveInfoService = priveInfoService;

console.log('Supabase services geladen en beschikbaar via window object');

// ========== GEMODERNISEERDE PRIVE INFO MANAGER ==========
/**
 * Privé Informatie Module - Geoptimaliseerd voor grote datasets
 * Beheert vertrouwelijke informatie over honden - Lokaal opgeslagen met Supabase back-end
 */
class PrivateInfoManager {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = []; // Cache voor honden dropdown
        this.isLoadingDogs = false;
        this.lastDogSearch = '';
        this.translations = {
            nl: {
                // Modal titels
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                
                // Selectie sectie
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
                typeDogName: "Typ hondennaam...",
                typeMore: "Typ meer voor meer resultaten...",
                loadInfo: "Info Laden",
                loadingDogs: "Honden laden...",
                searchingDogs: "Zoeken...",
                
                // Beveiligingsinfo
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt alleen lokaal opgeslagen in uw browser",
                privateNote: "Deze notities zijn alleen zichtbaar voor u en worden niet gedeeld",
                dataSizeInfo: "Bij grote datasets worden maximaal 5000 honden geladen voor dropdown",
                
                // Knoppen
                clear: "Wissen",
                save: "Opslaan",
                backup: "Backup",
                restore: "Restore",
                loadMore: "Meer Laden",
                
                // Alerts
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden voor deze hond. U kunt nieuwe informatie toevoegen.",
                loadFailed: "Laden mislukt: ",
                dogNotFound: "Hond niet gevonden in database",
                dogSelectionRequired: "Selecteer een hond uit de lijst",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie succesvol opgeslagen!",
                saveFailed: "Opslaan mislukt: ",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen?",
                fieldsCleared: "Notities gewist. Vergeet niet op te slaan als je de wijzigingen wilt bewaren.",
                makingBackup: "Backup maken...",
                backupSuccess: "Backup succesvol gemaakt!",
                backupFailed: "Backup mislukt: ",
                invalidBackup: "Ongeldig backup bestand",
                restoreConfirm: "Weet je zeker dat je deze backup wilt herstellen?",
                restoring: "Backup herstellen...",
                restoreSuccess: "Backup succesvol hersteld!",
                restoreFailed: "Herstellen mislukt: ",
                backupReadError: "Fout bij lezen backup bestand",
                noDogsFound: "Geen honden gevonden",
                tooManyResults: "Te veel resultaten. Typ meer letters om te filteren.",
                loadingDogsFailed: "Laden honden mislukt: ",
                loadingMoreDogs: "Meer honden laden...",
                allDogsLoaded: "Alle honden geladen"
            },
            en: {
                // Modal titles
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                
                // Selection section
                selectDog: "Select Dog",
                dog: "Dog",
                chooseDog: "Choose a dog...",
                typeDogName: "Type dog name...",
                typeMore: "Type more for more results...",
                loadInfo: "Load Info",
                loadingDogs: "Loading dogs...",
                searchingDogs: "Searching...",
                
                // Security info
                securityInfo: "Security Info",
                privateStorage: "All information is stored locally in your browser only",
                privateNote: "These notes are only visible to you and are not shared",
                dataSizeInfo: "For large datasets, maximum 5000 dogs loaded for dropdown",
                
                // Buttons
                clear: "Clear",
                save: "Save",
                backup: "Backup",
                restore: "Restore",
                loadMore: "Load More",
                
                // Alerts
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found for this dog. You can add new information.",
                loadFailed: "Loading failed: ",
                dogNotFound: "Dog not found in database",
                dogSelectionRequired: "Select a dog from the list",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information successfully saved!",
                saveFailed: "Save failed: ",
                clearConfirm: "Are you sure you want to clear all notes?",
                fieldsCleared: "Notes cleared. Don't forget to save if you want to keep the changes.",
                makingBackup: "Making backup...",
                backupSuccess: "Backup successfully created!",
                backupFailed: "Backup failed: ",
                invalidBackup: "Invalid backup file",
                restoreConfirm: "Are you sure you want to restore this backup?",
                restoring: "Restoring backup...",
                restoreSuccess: "Backup successfully restored!",
                restoreFailed: "Restore failed: ",
                backupReadError: "Error reading backup file",
                noDogsFound: "No dogs found",
                tooManyResults: "Too many results. Type more letters to filter.",
                loadingDogsFailed: "Loading dogs failed: ",
                loadingMoreDogs: "Loading more dogs...",
                allDogsLoaded: "All dogs loaded"
            },
            de: {
                // Modal Titel
                privateInfo: "Private Informationen",
                privateNotes: "Private Notizen",
                notesPlaceholder: "Geben Sie hier alle vertraulichen Informationen ein...",
                
                // Auswahlbereich
                selectDog: "Hund auswählen",
                dog: "Hund",
                chooseDog: "Wählen Sie einen Hund...",
                typeDogName: "Hundename eingeben...",
                typeMore: "Geben Sie mehr für mehr Ergebnisse ein...",
                loadInfo: "Info Laden",
                loadingDogs: "Hunde laden...",
                searchingDogs: "Suchen...",
                
                // Sicherheitsinfo
                securityInfo: "Sicherheitsinfo",
                privateStorage: "Alle Informationen werden nur lokal in Ihrem Browser gespeichert",
                privateNote: "Diese Notizen sind nur für Sie sichtbar und werden nicht geteilt",
                dataSizeInfo: "Bei großen Datensätzen werden maximal 5000 Hunde für Dropdown geladen",
                
                // Knöpfe
                clear: "Löschen",
                save: "Speichern",
                backup: "Backup",
                restore: "Wiederherstellen",
                loadMore: "Mehr Laden",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                loadingInfo: "Private Info wird geladen...",
                noInfoFound: "Keine privaten Informationen für diesen Hund gefunden. Sie können neue Informationen hinzufügen.",
                loadFailed: "Laden fehlgeschlagen: ",
                dogNotFound: "Hund nicht in der Datenbank gefunden",
                dogSelectionRequired: "Wählen Sie einen Hund aus der Liste",
                savingInfo: "Private Info wird gespeichert...",
                saveSuccess: "Private Informationen erfolgreich gespeichert!",
                saveFailed: "Speichern fehlgeschlagen: ",
                clearConfirm: "Sind Sie sicher, dass Sie alle Notizen löschen möchten?",
                fieldsCleared: "Notizen gelöscht. Vergessen Sie nicht zu speichern, wenn Sie die Änderungen behalten möchten.",
                makingBackup: "Backup wird erstellt...",
                backupSuccess: "Backup erfolgreich erstellt!",
                backupFailed: "Backup fehlgeschlagen: ",
                invalidBackup: "Ungültige Backup-Datei",
                restoreConfirm: "Sind Sie sicher, dass Sie dieses Backup wiederherstellen möchten?",
                restoring: "Backup wird wiederhergestellt...",
                restoreSuccess: "Backup erfolgreich wiederhergestellt!",
                restoreFailed: "Wiederherstellen fehlgeschlagen: ",
                backupReadError: "Fehler beim Lesen der Backup-Datei",
                noDogsFound: "Keine Hunde gefunden",
                tooManyResults: "Zu viele Ergebnisse. Geben Sie mehr Buchstaben ein, um zu filtern.",
                loadingDogsFailed: "Laden Hunde fehlgeschlagen: ",
                loadingMoreDogs: "Mehr Hunde laden...",
                allDogsLoaded: "Alle Hunde geladen"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('privateInfoModal')) {
            this.loadPrivateInfoData();
            this.setupDogSearch();
            if (this.currentHondId) {
                this.loadPrivateInfoForDog();
            }
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1" aria-labelledby="privateInfoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="privateInfoModalLabel">
                                <i class="bi bi-lock"></i> ${t('privateInfo')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="privateHondSearch" class="form-label">${t('dog')}</label>
                                                <div class="dropdown">
                                                    <input type="text" class="form-control" id="privateHondSearch" 
                                                        placeholder="${t('typeDogName')}" autocomplete="off">
                                                    <div class="dropdown-menu w-100" id="dogDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                        <div class="dropdown-item text-muted">${t('chooseDog')}</div>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="selectedDogId">
                                                <input type="hidden" id="selectedDogStamboomnr">
                                                <div class="small text-muted mt-1" id="selectedDogInfo"></div>
                                                <div class="small text-muted mt-1" id="searchStatusInfo"></div>
                                            </div>
                                            <button class="btn btn-dark w-100" id="loadPrivateInfoBtn">
                                                <i class="bi bi-eye"></i> ${t('loadInfo')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-shield"></i> ${t('securityInfo')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="small">
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('privateStorage')}</p>
                                                <p><i class="bi bi-person-check text-info"></i> ${t('privateNote')}</p>
                                                <p><i class="bi bi-database text-warning"></i> ${t('dataSizeInfo')}</p>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-outline-dark btn-sm" id="backupPrivateInfoBtn">
                                                    <i class="bi bi-download"></i> ${t('backup')}
                                                </button>
                                                <button class="btn btn-outline-dark btn-sm" id="restorePrivateInfoBtn">
                                                    <i class="bi bi-upload"></i> ${t('restore')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('privateNotes')}</h6>
                                </div>
                                <div class="card-body">
                                    <div id="privateInfoForm">
                                        <div class="mb-3">
                                            <textarea class="form-control" id="privateNotes" rows="12" 
                                                placeholder="${t('notesPlaceholder')}"></textarea>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-secondary" id="clearPrivateInfoBtn">
                                                <i class="bi bi-x-circle"></i> ${t('clear')}
                                            </button>
                                            <button class="btn btn-dark" id="savePrivateInfoBtn">
                                                <i class="bi bi-save"></i> ${t('save')}
                                            </button>
                                        </div>
                                    </div>
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
    }
    
    setupEvents() {
        const loadBtn = document.getElementById('loadPrivateInfoBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadPrivateInfoForDog();
            });
        }
        
        const saveBtn = document.getElementById('savePrivateInfoBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePrivateInfo();
            });
        }
        
        const clearBtn = document.getElementById('clearPrivateInfoBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPrivateInfo();
            });
        }
        
        const backupBtn = document.getElementById('backupPrivateInfoBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.backupPrivateInfo();
            });
        }
        
        const restoreBtn = document.getElementById('restorePrivateInfoBtn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                this.restorePrivateInfo();
            });
        }
        
        this.setupDogSearch();
    }
    
    async loadPrivateInfoData() {
        try {
            // Toon loading status
            this.updateSearchStatus(this.t('loadingDogs'));
            
            // Gebruik Supabase service om honden op te halen (geoptimaliseerd voor grote datasets)
            this.allDogs = await hondenService.getAllHondenForPrivateInfo();
            
            console.log(`[PrivateInfoManager] ${this.allDogs.length} honden geladen voor dropdown`);
            
            // Verberg loading status
            this.updateSearchStatus('');
            
        } catch (error) {
            console.error('Fout bij laden honden voor privé info:', error);
            this.allDogs = [];
            this.updateSearchStatus(`${this.t('loadingDogsFailed')}${error.message}`);
        }
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Debounce functie om te veel API calls te voorkomen
        const debounce = (func, delay) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        };
        
        // Debounced search functie
        const performSearch = debounce(async (searchTerm) => {
            await this.filterDogs(searchTerm);
        }, 300);
        
        // Filter honden bij elke toetsaanslag
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            this.lastDogSearch = searchTerm;
            
            // Toon dropdown
            dropdownMenu.classList.add('show');
            
            // Update status
            if (searchTerm.trim().length > 0) {
                this.updateSearchStatus(this.t('searchingDogs'));
            } else {
                this.updateSearchStatus('');
            }
            
            // Start debounced search
            performSearch(searchTerm);
        });
        
        // Toon dropdown bij focus
        searchInput.addEventListener('focus', () => {
            if (!this.allDogs.length && !this.isLoadingDogs) {
                this.loadPrivateInfoData();
            }
            dropdownMenu.classList.add('show');
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    updateSearchStatus(message) {
        const statusDiv = document.getElementById('searchStatusInfo');
        if (statusDiv) {
            statusDiv.innerHTML = message ? `<i class="bi bi-info-circle"></i> ${message}` : '';
        }
    }
    
    async filterDogs(searchTerm) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        // Wacht tot alle honden geladen zijn
        if (this.allDogs.length === 0 && !this.isLoadingDogs) {
            await this.loadPrivateInfoData();
        }
        
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        
        if (!lowerSearchTerm) {
            // Geen zoekterm, toon eerste 50 resultaten
            this.filteredDogs = this.allDogs.slice(0, 50);
        } else {
            // Filter op naam die BEGINT met de zoekterm (efficienter)
            this.filteredDogs = this.allDogs.filter(dog => {
                const dogName = dog.naam.toLowerCase();
                return dogName.startsWith(lowerSearchTerm);
            }).slice(0, 100); // Beperk tot 100 resultaten
        }
        
        this.updateDropdownMenu();
        this.updateSearchStatus(''); // Verberg zoekstatus
    }
    
    updateDropdownMenu() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (this.filteredDogs.length === 0) {
            if (this.lastDogSearch && this.lastDogSearch.trim().length > 0) {
                if (this.allDogs.length > 0) {
                    dropdownMenu.innerHTML = `
                        <div class="dropdown-item text-muted">
                            ${t('noDogsFound')}
                        </div>
                    `;
                } else {
                    dropdownMenu.innerHTML = `
                        <div class="dropdown-item text-muted">
                            ${t('tooManyResults')}
                        </div>
                    `;
                }
            } else {
                dropdownMenu.innerHTML = `
                    <div class="dropdown-item text-muted">
                        ${t('typeDogName')}
                    </div>
                `;
            }
            return;
        }
        
        this.filteredDogs.forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam || 'Naamloos'}</strong>
                    <div class="small text-muted">
                        ${dog.ras || ''} • ${dog.stamboomnr || 'Geen stamboomnr'}
                    </div>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDog(dog);
                dropdownMenu.classList.remove('show');
            });
            
            dropdownMenu.appendChild(item);
        });
        
        // Voeg "load more" toe als er meer resultaten zijn
        if (this.filteredDogs.length === 100 && this.lastDogSearch && this.lastDogSearch.trim().length > 0) {
            const loadMoreItem = document.createElement('a');
            loadMoreItem.className = 'dropdown-item text-primary';
            loadMoreItem.href = '#';
            loadMoreItem.innerHTML = `<i class="bi bi-chevron-down"></i> ${t('typeMore')}`;
            dropdownMenu.appendChild(loadMoreItem);
        }
    }
    
    selectDog(dog) {
        const searchInput = document.getElementById('privateHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const infoDiv = document.getElementById('selectedDogInfo');
        
        if (searchInput) {
            searchInput.value = dog.naam || '';
        }
        if (dogIdInput) {
            dogIdInput.value = dog.id;
        }
        if (stamboomnrInput) {
            stamboomnrInput.value = dog.stamboomnr || '';
        }
        if (infoDiv) {
            infoDiv.innerHTML = `
                <span class="text-success">
                    <i class="bi bi-check-circle"></i> Geselecteerd: 
                    ${dog.stamboomnr ? dog.stamboomnr + ' | ' : ''}
                    ${dog.ras ? dog.ras + ' | ' : ''}
                    ${dog.geboortedatum ? 'Geb: ' + dog.geboortedatum.split('T')[0] : ''}
                </span>
            `;
        }
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.currentHondId = parseInt(dogId);
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Haal privé info uit LOKALE OPSLAG (niet uit server database)
            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
            
            this.hideProgress();
            this.displayPrivateInfo();
            
            // Update header met de geselecteerde hond
            const selectedDog = this.allDogs.find(d => d.id.toString() === dogId);
            if (selectedDog) {
                this.updatePrivateInfoHeader(selectedDog);
            }
            
        } catch (error) {
            this.hideProgress();
            
            if (error.message.includes('niet gevonden') || !this.currentPriveInfo) {
                this.currentPriveInfo = null;
                this.displayPrivateInfo();
                this.showInfo(t('noInfoFound'));
            } else {
                this.showError(`${t('loadFailed')}${error.message}`);
            }
        }
    }
    
    async getLocalPrivateInfo(stamboomnr) {
        // Haal privé info uit localStorage (lokaal opgeslagen)
        const privateInfoKey = `private_info_${stamboomnr}`;
        const savedInfo = localStorage.getItem(privateInfoKey);
        
        if (savedInfo) {
            return JSON.parse(savedInfo);
        }
        return null;
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        
        notesTextarea.value = '';
        
        if (this.currentPriveInfo) {
            notesTextarea.value = this.currentPriveInfo.privateNotes || '';
        }
        
        // Zorg ervoor dat textarea altijd beschikbaar is
        notesTextarea.removeAttribute('disabled');
    }
    
    updatePrivateInfoHeader(dog) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && dog) {
            modalTitle.innerHTML = `
                <i class="bi bi-lock"></i> ${this.t('privateInfo')} - 
                ${dog.naam} 
                <small class="text-muted">(${dog.stamboomnr || 'Geen stamboomnr'})</small>
            `;
        }
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
        try {
            const priveInfo = {
                stamboomnr: stamboomnr,
                privateNotes: document.getElementById('privateNotes').value.trim(),
                savedAt: new Date().toISOString(),
                hondId: dogId,
                laatsteUpdate: new Date().toISOString()
            };
            
            // Opslaan in LOKALE OPSLAG (localStorage)
            await this.saveLocalPrivateInfo(stamboomnr, priveInfo);
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
            // Herlaad de info na opslaan
            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
            this.displayPrivateInfo();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    async saveLocalPrivateInfo(stamboomnr, priveInfo) {
        // Sla privé info op in localStorage (lokaal opgeslagen)
        const privateInfoKey = `private_info_${stamboomnr}`;
        localStorage.setItem(privateInfoKey, JSON.stringify(priveInfo));
        
        // Update ook in-memory cache
        this.currentPriveInfo = priveInfo;
    }
    
    clearPrivateInfo() {
        const t = this.t.bind(this);
        
        if (!confirm(t('clearConfirm'))) {
            return;
        }
        
        document.getElementById('privateNotes').value = '';
        
        this.showSuccess(t('fieldsCleared'));
    }
    
    async backupPrivateInfo() {
        const t = this.t.bind(this);
        
        this.showProgress(t('makingBackup'));
        
        try {
            // Haal alle privé info op uit localStorage
            const allPriveInfo = this.getAllLocalPrivateInfo();
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: allPriveInfo.length,
                appNaam: "Honden Registratie Prive Info",
                versie: "1.0",
                data: allPriveInfo
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('backupFailed')}${error.message}`);
        }
    }
    
    getAllLocalPrivateInfo() {
        // Haal alle privé info op uit localStorage
        const allPrivateInfo = [];
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith('private_info_')) {
                try {
                    const info = JSON.parse(localStorage.getItem(key));
                    if (info && info.stamboomnr) {
                        allPrivateInfo.push(info);
                    }
                } catch (error) {
                    console.error(`Fout bij lezen van ${key}:`, error);
                }
            }
        });
        
        return allPrivateInfo;
    }
    
    async restorePrivateInfo() {
        const t = this.t.bind(this);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (!backupData.data || !Array.isArray(backupData.data)) {
                        throw new Error(t('invalidBackup'));
                    }
                    
                    if (!confirm(t('restoreConfirm'))) {
                        return;
                    }
                    
                    this.showProgress(t('restoring'));
                    
                    const priveInfoData = backupData.data;
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const info of priveInfoData) {
                        try {
                            if (info.stamboomnr) {
                                // Opslaan in localStorage
                                const privateInfoKey = `private_info_${info.stamboomnr}`;
                                localStorage.setItem(privateInfoKey, JSON.stringify(info));
                                successCount++;
                            } else {
                                errorCount++;
                            }
                        } catch (error) {
                            console.error('Fout bij importeren privé info:', error);
                            errorCount++;
                        }
                    }
                    
                    this.hideProgress();
                    
                    if (errorCount > 0) {
                        this.showInfo(`${successCount} records hersteld, ${errorCount} mislukt`);
                    } else {
                        this.showSuccess(t('restoreSuccess'));
                    }
                    
                    // Herlaad eventueel huidige info als we die hebben geopend
                    if (this.currentHondId) {
                        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
                        if (stamboomnr) {
                            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
                            this.displayPrivateInfo();
                        }
                    }
                    
                } catch (error) {
                    this.hideProgress();
                    this.showError(`${t('restoreFailed')}${error.message}`);
                }
            };
            
            reader.onerror = () => {
                this.showError(t('backupReadError'));
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Helper method voor bestandsdownload
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Helper methoden voor notificaties
    showProgress(message) {
        // Tijdelijke implementatie
        console.log('[Progress]', message);
        // In productie gebruik je een toast of spinner
    }
    
    hideProgress() {
        console.log('[Progress] Hidden');
    }
    
    showSuccess(message) {
        alert(message); // Tijdelijke oplossing
    }
    
    showError(message) {
        alert('Fout: ' + message); // Tijdelijke oplossing
    }
    
    showInfo(message) {
        alert('Info: ' + message); // Tijdelijke oplossing
    }
}

// ========== GLOBAL BESCHIKBAAR MAKEN ==========
window.PrivateInfoManager = PrivateInfoManager;

console.log('PrivateInfoManager geladen en geoptimaliseerd voor grote datasets');