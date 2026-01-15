// path-config.js - Dynamische pad configuratie voor Desktop Edition

class PathConfig {
    constructor() {
        this.isFileProtocol = window.location.protocol === 'file:';
        this.isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
        this.isDesktopEdition = window.location.pathname.includes('/desktop/') || 
                               document.querySelector('link[rel="manifest"]')?.getAttribute('href') === 'manifest.json';
        
        this.basePath = this.calculateBasePath();
        console.log('PathConfig:', {
            isFileProtocol: this.isFileProtocol,
            isLocalhost: this.isLocalhost,
            isDesktopEdition: this.isDesktopEdition,
            basePath: this.basePath
        });
    }
    
    calculateBasePath() {
        if (this.isFileProtocol) {
            // Bestandsprotocol: gebruik relatieve paths
            return './';
        } else if (this.isDesktopEdition && !this.isFileProtocol) {
            // Desktop Edition op server: gebruik /desktop/ pad
            return '/desktop/';
        } else {
            // Originele PWA of andere server config
            return './';
        }
    }
    
    getPath(relativePath) {
        if (relativePath.startsWith('/') || relativePath.startsWith('http')) {
            return relativePath;
        }
        return this.basePath + relativePath;
    }
    
    getManifestPath() {
        return this.isFileProtocol ? 'manifest.json' : '/desktop/manifest.json';
    }
    
    getServiceWorkerPath() {
        return this.isFileProtocol ? './sw-desktop.js' : '/desktop/sw-desktop.js';
    }
}

// Export voor gebruik
const pathConfig = new PathConfig();
