// Feature Router - Handles navigation between features
const FeatureRouter = {
    // Initialize router
    init() {
        this.setupNavigation();
    },
    
    // Setup sidebar navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-feature]');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const feature = item.dataset.feature;
                if (feature) {
                    this.navigateToFeature(feature);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth <= 1024) {
                        SidebarComponent.closeSidebar();
                    }
                }
            });
        });
    },
    
    // Navigate to a specific feature
    navigateToFeature(feature) {
        if (AppState.setFeature(feature)) {
            // Update UI
            this.updateActiveNavItem(feature);
            this.updateFeatureHeader();
            
            // Refresh chat with feature-specific history
            ChatComponent.refreshChat();
            
            // Add feature switch message
            AppState.addBotMessage(`Now I can help you with ${AppState.getCurrentFeature().title.toLowerCase()}. What would you like to know?`);
            ChatComponent.addBotMessage(`Now I can help you with ${AppState.getCurrentFeature().title.toLowerCase()}. What would you like to know?`);
        }
    },
    
    // Update active navigation item
    updateActiveNavItem(feature) {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            if (item.dataset.feature === feature) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },
    
    // Update feature header
    updateFeatureHeader() {
        const feature = AppState.getCurrentFeature();
        document.getElementById('feature-title').textContent = feature.title;
        document.getElementById('feature-description').textContent = feature.description;
    }
};