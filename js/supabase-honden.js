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

  // 5. Hond toevoegen - GECORRIGEERD: Gebruik losse velden in plaats van JSON
  async voegHondToe(hond) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      
      // MAKEN DATABASEVELDEN - geen JSON!
      const supabaseHond = {
        naam: hond.naam || '',
        kennelnaam: hond.kennelnaam || '',
        stamboomnr: hond.stamboomnr || '',
        ras: hond.ras || '',
        vachtkleur: hond.vachtkleur || '',
        geslacht: hond.geslacht || '',
        vader_id: hond.vader_id || null,
        moeder_id: hond.moeder_id || null,
        vader: hond.vader || '',
        moeder: hond.moeder || '',
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
        
        // LOCATIE
        land: hond.land || '',
        postcode: hond.postcode || '',
        
        // OPMERKINGEN
        opmerkingen: hond.opmerkingen || '',
        
        // SYSTEEMVELDEN
        aangemaakt_op: new Date().toISOString(),
        bijgewerkt_op: new Date().toISOString()
        
        // GEEN gezondheidsinfo JSON!
        // GEEN status veld (als het niet in je database bestaat)
        // GEEN toegevoegd_door (als het niet in je database bestaat)
      };
      
      console.log('[HONDENSERVICE] voegHondToe - Data naar Supabase:', supabaseHond);
      console.log('[HONDENSERVICE] Heupdysplasie:', supabaseHond.heupdysplasie);
      console.log('[HONDENSERVICE] Elleboogdysplasie:', supabaseHond.elleboogdysplasie);
      console.log('[HONDENSERVICE] Ogen:', supabaseHond.ogen);
      
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
        
        // LOSSE GEZONDHEIDSVELDEN
        heupdysplasie: hondData.heupdysplasie || null,
        elleboogdysplasie: hondData.elleboogdysplasie || null,
        patella: hondData.patella || null,
        ogen: hondData.ogen || null,
        ogenverklaring: hondData.ogenverklaring || null,
        dandyWalker: hondData.dandyWalker || null,
        schildklier: hondData.schildklier || null,
        schildklierverklaring: hondData.schildklierverklaring || null,
        
        // LOCATIE
        land: hondData.land || null,
        postcode: hondData.postcode || null,
        
        // OPMERKINGEN
        opmerkingen: hondData.opmerkingen || null,
        
        // SYSTEEMVELDEN
        bijgewerkt_op: new Date().toISOString()
      };
      
      console.log('[HONDENSERVICE] Update data naar Supabase:', updateData);
      
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
        .select('naam, land, postcode, heupdysplasie, elleboogdysplasie, ogen')
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

  // 7. Hond verwijderen
  async verwijderHond(id) {
    try {
      const { error } = await window.supabase
        .from('honden')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Fout bij verwijderen hond:', error);
      throw error;
    }
  },

  // 8. Statistieken
  async getStatistieken() {
    try {
      // Totaal aantal honden
      const { count: totaalHonden, error: countError } = await window.supabase
        .from('honden')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Kennel statistieken
      const { data: kennelData, error: kennelError } = await window.supabase
        .from('honden')
        .select('kennelnaam')
        .not('kennelnaam', 'is', null);
      
      if (kennelError) throw kennelError;
      
      const kennelStatistieken = {};
      kennelData.forEach(hond => {
        const kennel = hond.kennelnaam.trim();
        kennelStatistieken[kennel] = (kennelStatistieken[kennel] || 0) + 1;
      });
      
      // Vachtkleur statistieken
      const { data: vachtkleurData, error: vachtkleurError } = await window.supabase
        .from('honden')
        .select('vachtkleur')
        .not('vachtkleur', 'is', null);
      
      if (vachtkleurError) throw vachtkleurError;
      
      const vachtkleurStatistieken = {};
      vachtkleurData.forEach(hond => {
        const vachtkleur = hond.vachtkleur.trim();
        vachtkleurStatistieken[vachtkleur] = (vachtkleurStatistieken[vachtkleur] || 0) + 1;
      });
      
      return {
        totaalHonden: totaalHonden || 0,
        kennelStatistieken,
        vachtkleurStatistieken,
        laatsteUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fout bij ophalen statistieken:', error);
      return {
        totaalHonden: 0,
        kennelStatistieken: {},
        vachtkleurStatistieken: {},
        laatsteUpdate: new Date().toISOString()
      };
    }
  },

  // 9. Foto toevoegen
  async voegFotoToe(fotoData) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      
      const supabaseFoto = {
        stamboomnr: fotoData.stamboomnr,
        data: fotoData.data,
        filename: fotoData.filename,
        size: fotoData.size,
        type: fotoData.type,
        uploaded_at: new Date().toISOString(),
        uploaded_by: user?.id || 'unknown'
      };
      
      const { data, error } = await window.supabase
        .from('fotos')
        .insert(supabaseFoto)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Fout bij toevoegen foto:', error);
      throw error;
    }
  },

  // 10. Fotos ophalen voor hond
  async getFotosVoorHond(stamboomnr) {
    try {
      const { data, error } = await window.supabase
        .from('fotos')
        .select('*')
        .eq('stamboomnr', stamboomnr)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Fout bij ophalen fotos:', error);
      return [];
    }
  },

  // 11. Import honden batch
  async importHondenBatch(honden) {
    try {
      const user = window.auth ? window.auth.getCurrentUser() : null;
      
      // Transformeer elke hond naar database formaat
      const supabaseHonden = honden.map(hond => ({
        naam: hond.naam || '',
        kennelnaam: hond.kennelnaam || '',
        stamboomnr: hond.stamboomnr || '',
        ras: hond.ras || '',
        vachtkleur: hond.vachtkleur || '',
        geslacht: hond.geslacht || '',
        vader_id: hond.vader_id || null,
        moeder_id: hond.moeder_id || null,
        vader: hond.vader || '',
        moeder: hond.moeder || '',
        geboortedatum: hond.geboortedatum || null,
        overlijdensdatum: hond.overlijdensdatum || null,
        heupdysplasie: hond.heupdysplasie || null,
        elleboogdysplasie: hond.elleboogdysplasie || null,
        patella: hond.patella || null,
        ogen: hond.ogen || null,
        ogenverklaring: hond.ogenverklaring || null,
        dandyWalker: hond.dandyWalker || null,
        schildklier: hond.schildklier || null,
        schildklierverklaring: hond.schildklierverklaring || null,
        land: hond.land || '',
        postcode: hond.postcode || '',
        opmerkingen: hond.opmerkingen || '',
        aangemaakt_op: new Date().toISOString(),
        bijgewerkt_op: new Date().toISOString()
      }));
      
      // Verstuur in batches van 100 (Supabase limiet)
      const batchSize = 100;
      const results = [];
      
      for (let i = 0; i < supabaseHonden.length; i += batchSize) {
        const batch = supabaseHonden.slice(i, i + batchSize);
        
        const { data, error } = await window.supabase
          .from('honden')
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`Fout in batch ${i / batchSize + 1}:`, error);
          throw error;
        }
        
        results.push(...(data || []));
      }
      
      return results;
    } catch (error) {
      console.error('Fout bij batch import:', error);
      throw error;
    }
  },

  // 12. Export honden
  async exportHonden() {
    try {
      const { data, error } = await window.supabase
        .from('honden')
        .select('*');
      
      if (error) throw error;
      
      return {
        honden: data || [],
        exportDatum: new Date().toISOString(),
        aantal: data?.length || 0
      };
    } catch (error) {
      console.error('Fout bij exporteren honden:', error);
      throw error;
    }
  },

  // 13. Nakomelingen zoeken
  async getNakomelingen(hondId) {
    try {
      const { data, error } = await window.supabase
        .from('honden')
        .select('*')
        .or(`vader_id.eq.${hondId},moeder_id.eq.${hondId}`);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Fout bij ophalen nakomelingen:', error);
      return [];
    }
  },

  // 14. Voorouders zoeken
  async getVoorouders(hondId, diepte = 3) {
    try {
      const resultaten = [];
      const verwerkt = new Set();
      
      async function zoekVoorouders(id, huidigeDiepte) {
        if (huidigeDiepte >= diepte || verwerkt.has(id)) return;
        
        const { data: hond, error } = await window.supabase
          .from('honden')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !hond) return;
        
        verwerkt.add(id);
        resultaten.push({ hond, diepte: huidigeDiepte });
        
        // Recursief voorouders zoeken
        if (hond.vader_id) {
          await zoekVoorouders(hond.vader_id, huidigeDiepte + 1);
        }
        if (hond.moeder_id) {
          await zoekVoorouders(hond.moeder_id, huidigeDiepte + 1);
        }
      }
      
      await zoekVoorouders(hondId, 0);
      return resultaten;
    } catch (error) {
      console.error('Fout bij ophalen voorouders:', error);
      return [];
    }
  },

  // 15. Foto verwijderen
  async verwijderFoto(fotoId) {
    try {
      const { error } = await window.supabase
        .from('fotos')
        .delete()
        .eq('id', fotoId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Fout bij verwijderen foto:', error);
      throw error;
    }
  }
};

// Maak beschikbaar voor debug
if (typeof window !== 'undefined') {
  window.hondenService = hondenService;
}

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