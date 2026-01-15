/**
 * Basis Module Klasse
 * Bevat gedeelde functionaliteit voor alle modules
 */

class BaseModule {
    constructor(moduleName = '', moduleTitle = '') {
        this.moduleName = moduleName;
        this.moduleTitle = moduleTitle;
        this.db = db;
        this.auth = auth;
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
    }
    
    t(key) {
        // Elke module heeft zijn eigen translations
        // Deze methode wordt overschreven in de child classes
        return key;
    }
    
    showProgress(message) {
        // Directe implementatie
        const progressHTML = `
            <div class="modal-backdrop show" style="opacity: 0.8;"></div>
            <div class="progress-modal">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <div class="mt-3">${message}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', progressHTML);
    }
    
    hideProgress() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        
        const progressModal = document.querySelector('.progress-modal');
        if (progressModal) progressModal.remove();
    }
    
    showAlert(message, type, duration = 5000) {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Sluiten"></button>
            </div>
        `;
        
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.insertAdjacentHTML('afterbegin', alertHTML);
            
            setTimeout(() => {
                const alert = modalBody.querySelector('.alert');
                if (alert) {
                    alert.classList.remove('show');
                    setTimeout(() => alert.remove(), 150);
                }
            }, duration);
        }
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success');
    }
    
    showError(message) {
        this.showAlert(message, 'danger');
    }
    
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
    
    convertToCSV(data) {
        if (!data || !data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        csvRows.push(headers.join(','));
        
        for (const row of data) {
            const values = headers.map(header => {
                const escaped = String(row[header] || '').replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
}