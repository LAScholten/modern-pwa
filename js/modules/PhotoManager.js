async loadDogsData() {
    try {
        // Gebruik de Supabase service om honden te laden
        let allDogs = [];
        let page = 1;
        const pageSize = 1000;
        let hasMore = true;
        
        while (hasMore && page <= 100) { // Max 100.000 records
            const result = await window.hondenService.getHonden(page, pageSize);
            
            if (result.honden && result.honden.length > 0) {
                allDogs = allDogs.concat(result.honden);
            }
            
            hasMore = result.heeftVolgende;
            page++;
            
            // Stop als we genoeg hebben of er geen meer zijn
            if (!hasMore || allDogs.length >= 100000) {
                break;
            }
        }
        
        this.allDogs = allDogs;
        this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        
        console.log(`Successvol ${this.allDogs.length} honden geladen`);
        
    } catch (error) {
        console.error('Fout bij laden honden:', error);
        this.allDogs = [];
    }
}