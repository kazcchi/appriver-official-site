// Pull to Refresh functionality for mobile only
(function() {
    'use strict';
    
    // Check if device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Exit if not mobile
    if (!isMobile()) return;
    
    const indicator = document.getElementById('pullToRefreshIndicator');
    const pullText = indicator.querySelector('.pull-text');
    
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    let isPulling = false;
    let isRefreshing = false;
    
    const PULL_THRESHOLD = 80; // Minimum pull distance to trigger refresh
    const MAX_PULL_DISTANCE = 120; // Maximum pull distance
    
    // Initialize
    function init() {
        if (!indicator) return;
        
        // Add touch event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Resize listener to disable on desktop
        window.addEventListener('resize', handleResize);
    }
    
    function handleResize() {
        if (!isMobile()) {
            resetPull();
            removeEventListeners();
        }
    }
    
    function removeEventListeners() {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }
    
    function handleTouchStart(e) {
        if (isRefreshing) return;
        
        // Only trigger if at top of page
        if (window.pageYOffset > 0) return;
        
        startY = e.touches[0].pageY;
        isPulling = false;
    }
    
    function handleTouchMove(e) {
        if (isRefreshing) return;
        
        currentY = e.touches[0].pageY;
        pullDistance = currentY - startY;
        
        // Only pull down and when at top of page
        if (pullDistance > 0 && window.pageYOffset === 0) {
            e.preventDefault(); // Prevent default scroll behavior
            
            isPulling = true;
            
            // Limit pull distance
            const clampedDistance = Math.min(pullDistance, MAX_PULL_DISTANCE);
            const progress = clampedDistance / PULL_THRESHOLD;
            
            // Show indicator
            indicator.classList.add('visible');
            
            // Update indicator position and state
            if (clampedDistance >= PULL_THRESHOLD) {
                indicator.classList.add('ready');
                indicator.classList.add('pulling');
                pullText.textContent = '離して更新';
            } else {
                indicator.classList.remove('ready');
                indicator.classList.add('pulling');
                pullText.textContent = '引っ張って更新';
            }
            
            // Smooth transition effect
            const translateY = Math.min(clampedDistance * 0.5, 40);
            indicator.style.transform = `translateX(-50%) translateY(${translateY}px)`;
        } else {
            resetPull();
        }
    }
    
    function handleTouchEnd(e) {
        if (!isPulling || isRefreshing) return;
        
        // Trigger refresh if pulled enough
        if (pullDistance >= PULL_THRESHOLD) {
            triggerRefresh();
        } else {
            resetPull();
        }
    }
    
    function triggerRefresh() {
        isRefreshing = true;
        
        indicator.classList.add('refreshing');
        indicator.classList.remove('ready', 'pulling');
        pullText.textContent = '更新中...';
        
        // Keep indicator visible during refresh
        indicator.style.transform = 'translateX(-50%) translateY(0)';
        
        // Simulate refresh delay then reload
        setTimeout(() => {
            // Store scroll position to prevent jump after reload
            sessionStorage.setItem('pullRefreshReload', 'true');
            location.reload();
        }, 1000);
    }
    
    function resetPull() {
        isPulling = false;
        
        indicator.classList.remove('visible', 'pulling', 'ready', 'refreshing');
        indicator.style.transform = 'translateX(-50%)';
        pullText.textContent = '引っ張って更新';
        
        pullDistance = 0;
        startY = 0;
        currentY = 0;
    }
    
    // Handle page load after refresh
    window.addEventListener('load', () => {
        if (sessionStorage.getItem('pullRefreshReload')) {
            sessionStorage.removeItem('pullRefreshReload');
            // Smooth scroll to top after refresh
            window.scrollTo(0, 0);
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();