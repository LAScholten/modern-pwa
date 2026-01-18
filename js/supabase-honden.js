import { createClient } from '@supabase/supabase-js'

// Laad vanuit .env bestand
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://owjwkjrktftugjjrcwml.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93andranJrdGZ0dWdqanJjd21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzA4OTAsImV4cCI6MjA4NDIwNjg5MH0.oW6HTAlMBkjUu_4e3kn4iozjn5wK-15h4wCKcaHrtp8'

// Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========== SUPABASE HONDEN SERVICE ==========
// Vervangt je IndexedDB HondenDatabase class

export const hondenService = {
  // **ZELFDE ALS JOUW OUDE FUNCTIES:**
  
  // 1. Alle honden ophalen
  async getHonden() {
    const { data, error } = await supabase
      .from('honden')
      .select('*')
      .order('naam', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // 2. Zoeken zoals in je oude code
  async zoekHonden(criteria) {
    let query = supabase.from('honden').select('*')
    
    // Bouw WHERE clause op basis van criteria
    if (criteria.naam) {
      query = query.ilike('naam', `%${criteria.naam}%`)
    }
    if (criteria.kennelnaam) {
      query = query.ilike('kennelnaam', `%${criteria.kennelnaam}%`)
    }
    if (criteria.stamboomnr) {
      query = query.ilike('stamboomnr', `%${criteria.stamboomnr}%`)
    }
    if (criteria.ras) {
      query = query.ilike('ras', `%${criteria.ras}%`)
    }
    if (criteria.geslacht) {
      query = query.eq('geslacht', criteria.geslacht)
    }
    if (criteria.land) {
      query = query.ilike('land', `%${criteria.land}%`)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  // 3. Hond op stamboomnummer (jouw getHondByStamboomnr)
  async getHondByStamboomnr(stamboomnr) {
    const { data, error } = await supabase
      .from('honden')
      .select(`
        *,
        vader:honden!honden_vader_id_fkey(id, naam, stamboomnr),
        moeder:honden!honden_moeder_id_fkey(id, naam, stamboomnr)
      `)
      .eq('stamboomnr', stamboomnr)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  // 4. Hond op ID (jouw getHondById)
  async getHondById(id) {
    const { data, error } = await supabase
      .from('honden')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  // 5. Hond toevoegen (jouw voegHondToe)
  async voegHondToe(hond) {
    const user = await this._getCurrentUser()
    
    const supabaseHond = {
      // Basis informatie
      naam: hond.naam || '',
      kennelnaam: hond.kennelnaam || '',
      stamboomnr: hond.stamboomnr || '',
      ras: hond.ras || '',
      kleur: hond.vachtkleur || '',
      geslacht: hond.geslacht || '',
      
      // Ouders - deze moeten bestaande honden IDs zijn
      vader_id: hond.vaderId || null,
      moeder_id: hond.moederId || null,
      vader_naam: hond.vader || '',
      moeder_naam: hond.moeder || '',
      
      // Datums
      geboortedatum: hond.geboortedatum || null,
      overlijdensdatum: hond.overlijdensdatum || null,
      
      // Gezondheid (opslaan als JSON)
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
      
      // Locatie
      land: hond.land || '',
      postcode: hond.postcode || '',
      
      // Opmerkingen
      opmerkingen: hond.opmerkingen || '',
      
      // Metadata
      toegevoegd_door: user?.id,
      aangemaakt_op: new Date().toISOString(),
      bijgewerkt_op: new Date().toISOString(),
      status: 'actief'
    }
    
    const { data, error } = await supabase
      .from('honden')
      .insert(supabaseHond)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 6. Update hond (jouw updateHond)
  async updateHond(hondData) {
    if (!hondData.id) throw new Error('Hond ID is vereist voor update')
    
    const updateData = {
      naam: hondData.naam,
      kennelnaam: hondData.kennelnaam,
      stamboomnr: hondData.stamboomnr,
      ras: hondData.ras,
      kleur: hondData.vachtkleur,
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
    }
    
    const { data, error } = await supabase
      .from('honden')
      .update(updateData)
      .eq('id', hondData.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 7. Verwijder hond (jouw verwijderHond)
  async verwijderHond(hondId) {
    const { error } = await supabase
      .from('honden')
      .delete()
      .eq('id', hondId)
    
    if (error) throw error
  },

  // 8. Zoek op kennelnaam (jouw zoekOpKennelnaam)
  async zoekOpKennelnaam(kennelnaam) {
    const { data, error } = await supabase
      .from('honden')
      .select('*')
      .ilike('kennelnaam', `%${kennelnaam}%`)
    
    if (error) throw error
    return data || []
  },

  // 9. Zoek op vachtkleur (jouw zoekOpVachtkleur)
  async zoekOpVachtkleur(vachtkleur) {
    const { data, error } = await supabase
      .from('honden')
      .select('*')
      .ilike('kleur', `%${vachtkleur}%`)
    
    if (error) throw error
    return data || []
  },

  // 10. Honden per kennel (jouw getHondenPerKennel)
  async getHondenPerKennel() {
    const { data, error } = await supabase
      .from('honden')
      .select('kennelnaam, naam, stamboomnr, ras, kleur, geslacht')
    
    if (error) throw error
    
    const kennelOverzicht = {}
    data.forEach(hond => {
      const kennel = hond.kennelnaam || 'Geen kennel'
      
      if (!kennelOverzicht[kennel]) {
        kennelOverzicht[kennel] = {
          naam: kennel,
          aantal: 0,
          honden: []
        }
      }
      
      kennelOverzicht[kennel].aantal++
      kennelOverzicht[kennel].honden.push({
        id: hond.id,
        naam: hond.naam,
        stamboomnr: hond.stamboomnr,
        ras: hond.ras,
        vachtkleur: hond.kleur,
        geslacht: hond.geslacht
      })
    })
    
    return Object.values(kennelOverzicht).sort((a, b) => b.aantal - a.aantal)
  },

  // 11. Statistieken (jouw getStatistieken)
  async getStatistieken() {
    const { count: totaalHonden, error: hondenError } = await supabase
      .from('honden')
      .select('*', { count: 'exact', head: true })
    
    if (hondenError) throw hondenError
    
    // Kennel statistieken
    const { data: hondenData, error: dataError } = await supabase
      .from('honden')
      .select('kennelnaam, kleur, bijgewerkt_op')
    
    if (dataError) throw dataError
    
    const kennelStats = {}
    const vachtkleurStats = {}
    let laatsteUpdate = new Date(0)
    
    hondenData.forEach(hond => {
      // Kennel
      const kennel = hond.kennelnaam || 'Geen kennel'
      kennelStats[kennel] = (kennelStats[kennel] || 0) + 1
      
      // Vachtkleur
      const vachtkleur = hond.kleur || 'Geen vachtkleur opgegeven'
      vachtkleurStats[vachtkleur] = (vachtkleurStats[vachtkleur] || 0) + 1
      
      // Laatste update
      if (hond.bijgewerkt_op) {
        const datum = new Date(hond.bijgewerkt_op)
        if (datum > laatsteUpdate) laatsteUpdate = datum
      }
    })
    
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
      laatsteUpdate: laatsteUpdate > new Date(0) ? laatsteUpdate.toISOString() : null
    }
  },

  // Helper: get current user
  async _getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// ========== SUPABASE FOTO SERVICE ==========
export const fotoService = {
  // Check of er foto's bestaan (jouw checkFotosExist)
  async checkFotosExist(stamboomnr) {
    const { count, error } = await supabase
      .from('fotos')
      .select('*', { count: 'exact', head: true })
      .eq('stamboomnr', stamboomnr)
    
    if (error) throw error
    return (count || 0) > 0
  },

  // Haal thumbnails op (jouw getFotoThumbnails)
  async getFotoThumbnails(stamboomnr, limit = 9) {
    const { data, error } = await supabase
      .from('fotos')
      .select('id, thumbnail, filename, uploaded_at')
      .eq('stamboomnr', stamboomnr)
      .order('uploaded_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    return (data || []).map(foto => ({
      id: foto.id,
      thumbnail: foto.thumbnail || '',
      filename: foto.filename,
      uploadedAt: foto.uploaded_at
    }))
  },

  // Haal originele foto op (jouw getFotoById)
  async getFotoById(fotoId) {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('id', fotoId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    
    return {
      id: data.id,
      stamboomnr: data.stamboomnr,
      data: data.data,
      thumbnail: data.thumbnail,
      filename: data.filename,
      size: data.size,
      type: data.type,
      uploadedAt: data.uploaded_at
    }
  },

  // Haal alle foto's op (jouw getFotosVoorStamboomnr)
  async getFotosVoorStamboomnr(stamboomnr) {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('stamboomnr', stamboomnr)
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Foto toevoegen (jouw voegFotoToe)
  async voegFotoToe(foto) {
    const user = await supabase.auth.getUser()
    
    const fotoData = {
      stamboomnr: foto.stamboomnr || '',
      data: foto.data || '',
      thumbnail: foto.thumbnail || foto.data,
      filename: foto.filename || 'onbekend.jpg',
      size: foto.size || 0,
      type: foto.type || 'image/jpeg',
      uploaded_at: new Date().toISOString(),
      geupload_door: user.data.user?.id
    }
    
    const { data, error } = await supabase
      .from('fotos')
      .insert(fotoData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Verwijder foto (jouw verwijderFoto)
  async verwijderFoto(fotoId) {
    const { error } = await supabase
      .from('fotos')
      .delete()
      .eq('id', fotoId)
    
    if (error) throw error
  },

  // Helper: maak thumbnail (jouw maakThumbnail)
  async maakThumbnail(base64Data, maxSize = 200) {
    // Implementeer indien nodig, anders return origineel
    return base64Data
  }
}

// ========== SUPABASE PRIVE INFO SERVICE ==========
export const priveInfoService = {
  // Privé info opslaan (jouw bewaarPriveInfo)
  async bewaarPriveInfo(priveInfo) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Niet ingelogd')
    
    const infoData = {
      stamboomnr: priveInfo.stamboomnr || '',
      privatenotes: priveInfo.privateNotes || '',
      vertrouwelijk: true,
      laatstgewijzigd: new Date().toISOString(),
      toegevoegd_door: user.data.user.id
    }
    
    // Check of er al info bestaat
    const { data: existing } = await supabase
      .from('priveinfo')
      .select('id')
      .eq('stamboomnr', infoData.stamboomnr)
      .maybeSingle()
    
    if (existing?.id) {
      // Update
      const { data, error } = await supabase
        .from('priveinfo')
        .update(infoData)
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Insert
      const { data, error } = await supabase
        .from('priveinfo')
        .insert(infoData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Privé info ophalen (jouw getPriveInfoVoorStamboomnr)
  async getPriveInfoVoorStamboomnr(stamboomnr) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Niet ingelogd')
    
    const { data, error } = await supabase
      .from('priveinfo')
      .select('*')
      .eq('stamboomnr', stamboomnr)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    
    // Check rechten: alleen eigenaar of beheerder
    const { data: profile } = await supabase
      .from('gebruikers_profielen')
      .select('rol')
      .eq('id', user.data.user.id)
      .single()
    
    const isBeheerder = profile?.rol === 'beheerder'
    const isEigenaar = data.toegevoegd_door === user.data.user.id
    
    if (!isBeheerder && !isEigenaar) {
      throw new Error('Geen toegang tot deze privé informatie')
    }
    
    return {
      stamboomnr: data.stamboomnr,
      privateNotes: data.privatenotes,
      vertrouwelijk: data.vertrouwelijk,
      laatstGewijzigd: data.laatstgewijzigd,
      gewijzigdDoor: data.toegevoegd_door
    }
  }
}

// ========== EXPORT/IMPORT SERVICE ==========
export const backupService = {
  // Export data (jouw exportData)
  async exportData(type = 'all') {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Niet ingelogd')
    
    const exportData = {
      metadata: {
        exportType: type,
        exportDatum: new Date().toISOString(),
        exportDoor: user.data.user.email,
        database: 'Supabase'
      },
      honden: [],
      fotos: [],
      priveInfo: []
    }
    
    if (type === 'all' || type === 'honden') {
      const { data: honden, error } = await supabase
        .from('honden')
        .select('*')
      
      if (error) throw error
      exportData.honden = honden || []
    }
    
    if (type === 'all' || type === 'fotos') {
      const { data: fotos, error } = await supabase
        .from('fotos')
        .select('*')
      
      if (error) throw error
      exportData.fotos = fotos || []
    }
    
    if (type === 'all' || type === 'prive') {
      const { data: priveInfo, error } = await supabase
        .from('priveinfo')
        .select('*')
      
      if (error) throw error
      exportData.priveInfo = priveInfo || []
    }
    
    return exportData
  },

  // Maak backup (jouw maakBackup)
  async maakBackup() {
    const backupData = await this.exportData('all')
    const backupString = JSON.stringify(backupData, null, 2)
    const backupDatum = new Date().toISOString().replace(/[:.]/g, '-')
    const backupNaam = `honden-backup-${backupDatum}.json`
    
    return {
      data: backupString,
      naam: backupNaam,
      datum: backupDatum,
      aantallen: {
        honden: backupData.honden.length,
        fotos: backupData.fotos.length,
        priveInfo: backupData.priveInfo.length
      }
    }
  }
}

// Voor backward compatibility
export default {
  supabase,
  hondenService,
  fotoService,
  priveInfoService,
  backupService
}