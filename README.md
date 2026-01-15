# Hondendatabase PWA

Een Progressive Web App voor het beheren van een hondendatabase met offline functionaliteit.

## Features

- **3 Gescheiden Databases**:
  - Honden data (algemene informatie)
  - Foto's (hondenfoto's en metadata)
  - Privé informatie (vertrouwelijke notities)

- **Gebruikersrollen**:
  - Administrator: Volledige rechten
  - Gebruiker: Kan alles behalve nieuwe honden toevoegen via UI

- **Import/Export**:
  - JSON export/import voor alle databases
  - CSV export voor honden data
  - Volledige backup/restore functionaliteit

- **Offline Werking**:
  - Service Worker voor caching
  - IndexedDB voor lokale opslag
  - Synchronisatie bij online komen

## Installatie

### Lokale Ontwikkeling

1. **Kopieer alle bestanden** naar `D:\appProjecten\honden-database-pwa\`

2. **Start een lokale server**:
   ```bash
   cd D:\appProjecten\honden-database-pwa
   python -m http.server 8000