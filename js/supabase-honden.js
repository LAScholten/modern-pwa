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

  // 5. Hond toevoegen
  async voegHondToe(hond) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      
      const supabaseHond = {
        naam: hond.naam || '',
        kennelnaam: hond.kennelnaam || '',
        stamboomnr: hond.stamboomnr || '',
        ras: hond.ras || '',
        vachtkleur: hond.vachtkleur || '',
        geslacht: hond.geslacht || '',
        vader_id: hond.vaderId || null,
        moeder_id: hond.moederId || null,
        vader_naam: hond.vader || '',
        moeder_naam: hond.moeder || '',
        geboortedatum: hond.geboortedatum || null,
        overlijdensdatum: hond.overlijdensdatum || null,
        gezondheidsinfo: JSON.stringify({
          heupdysplasie: hond.heupdysplasie || '',
          elleboogdysplasie: hond.elleboogdysplasie || '',
          patella: hond.patella || '',
          ogen: hond.ogen || '',
          ogenVerklaring: hond.ogenVerklaring || '',
          dandyWalker: hond.dandyWalker || '',
          schildklier: hond.schildklier || '',
          schildklierVerklaring: hond.schildklierVerklaring || ''
        }),
        land: hond.land || '',
        postcode: hond.postcode || '',
        opmerkingen: hond.opmerkingen || '',
        toegevoegd_door: user?.id || 'unknown',
        aangemaakt_op: new Date().toISOString(),
        bijgewerkt_op: new Date().toISOString(),
        status: 'actief'
      };
      
      const { data, error } = await window.supabase
        .from('honden')
        .insert(supabaseHond)
        .select()
        .single();
      
      if (error) throw error;
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
      
      const updateData = {
        naam: hondData.naam,
        kennelnaam: hondData.kennelnaam,
        stamboomnr: hondData.stamboomnr,
        ras: hondData.ras,
        vachtkleur: hondData.vachtkleur,
        geslacht: hondData.geslacht,
        vader_id: hondData.vaderId || null,
        moeder_id: hondData.moederId || null,
        vader_naam: hondData.vader || '',
        moeder_naam: hondData.moeder || '',
        geboortedatum: hondData.geboortedatum || null,
        overlijdensdatum: hondData.overlijdensdatum || null,
        gezondheidsinfo: JSON.stringify({
          heupdysplasie: hondData.heupdysplasie || '',
          elleboogdysplasie: hondData.elleboogdysplasie || '',
          patella: hondData.patella || '',
          ogen: hondData.ogen || '',
          ogenVerklaring: hondData.ogenVerklaring || '',
          dandyWalker: hondData.dandyWalker || '',
          schildklier: hondData.schildklier || '',
          schildklierVerklaring: hondData.schildklierVerklaring || ''
        }),
        land: hondData.land || '',
        postcode: hondData.postcode || '',
        opmerkingen: hondData.opmerkingen || '',
        bijgewerkt_op: new Date().toISOString()
      };
      
      const { data, error } = await window.supabase
        .from('honden')
        .update(updateData)
        .eq('id', hondData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
        .select('id, naam, kennelnaam, stamboomnr')
        .order('naam', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Fout bij ophalen beperkte honden:', error);
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

// ========== EENVOUDIGE PRIVE INFO SERVICE ==========
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