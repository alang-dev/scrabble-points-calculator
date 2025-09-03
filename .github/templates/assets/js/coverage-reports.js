function createCoverageBadgeElement(percentage) {
    const percentageValue = parseFloat(percentage);
    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'coverage-badge';
    badgeSpan.textContent = `${percentageValue.toFixed(1)}%`;
    
    if (percentageValue >= 80) {
        badgeSpan.classList.add('coverage-high');
    } else if (percentageValue >= 60) {
        badgeSpan.classList.add('coverage-medium');
    } else {
        badgeSpan.classList.add('coverage-low');
    }
    
    return badgeSpan;
}

document.addEventListener('DOMContentLoaded', function() {
    loadBackendCoverage();
    loadFrontendCoverage();
});