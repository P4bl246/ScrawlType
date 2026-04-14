// Shows only the target section and hides all others
        function navigateTo(pageId) {
            document.querySelectorAll('section').forEach(s => s.style.display = 'none');
            document.getElementById('page-' + pageId).style.display = 'flex';
            history.pushState({}, '', '?page=' + pageId);
            document.getElementById('menu').classList.remove('open');
        }

        // Toggles the mobile dropdown menu open and closed
        function toggleMenu() {
            document.getElementById('menu').classList.toggle('open');
        }

        // On first load, read the URL and show the right page
        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page') || 'home';
            navigateTo(page);
        });

        // Handles browser back and forward buttons
        window.addEventListener('popstate', () => {
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page') || 'home';
            navigateTo(page);
        });