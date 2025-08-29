function getCoverageBadge(percentage) {
    const pct = parseFloat(percentage);
    if (pct >= 80) return `<span class="coverage-badge coverage-high">${pct.toFixed(1)}%</span>`;
    if (pct >= 60) return `<span class="coverage-badge coverage-medium">${pct.toFixed(1)}%</span>`;
    return `<span class="coverage-badge coverage-low">${pct.toFixed(1)}%</span>`;
}

// Load and display backend coverage data
async function loadBackendCoverage() {
    try {
        const response = await fetch('./backend/jacocoTestReport.csv');
        const csvText = await response.text();
        const data = Papa.parse(csvText, { header: true }).data;
        
        // Filter out empty rows and header rows
        const validData = data.filter(row => row.CLASS && row.CLASS !== 'CLASS');
        
        // Create chart
        const ctx = document.getElementById('backendChart');
        const chartData = validData.map(row => {
            const lineCovered = parseInt(row.LINE_COVERED || 0);
            const lineMissed = parseInt(row.LINE_MISSED || 0);
            const lineTotal = lineCovered + lineMissed;
            return {
                name: row.CLASS, // Use just class name for chart labels
                coverage: lineTotal > 0 ? (lineCovered / lineTotal * 100) : 0
            };
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(d => d.name),
                datasets: [{
                    label: 'Line Coverage %',
                    data: chartData.map(d => d.coverage),
                    backgroundColor: chartData.map(d => 
                        d.coverage >= 80 ? '#28a745' : 
                        d.coverage >= 60 ? '#ffc107' : '#dc3545'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Create table
        const tbody = document.querySelector('#backendTable tbody');
        tbody.innerHTML = validData.map(row => {
            const lineCovered = parseInt(row.LINE_COVERED || 0);
            const lineMissed = parseInt(row.LINE_MISSED || 0);
            const lineTotal = lineCovered + lineMissed;
            const lineCoverage = lineTotal > 0 ? (lineCovered / lineTotal * 100) : 0;

            const branchCovered = parseInt(row.BRANCH_COVERED || 0);
            const branchMissed = parseInt(row.BRANCH_MISSED || 0);
            const branchTotal = branchCovered + branchMissed;
            const branchCoverage = branchTotal > 0 ? (branchCovered / branchTotal * 100) : 100;

            const methodCovered = parseInt(row.METHOD_COVERED || 0);
            const methodMissed = parseInt(row.METHOD_MISSED || 0);
            const methodTotal = methodCovered + methodMissed;
            const methodCoverage = methodTotal > 0 ? (methodCovered / methodTotal * 100) : 0;

            // Combine package and class for full path
            const fullPath = row.PACKAGE ? `${row.PACKAGE}.${row.CLASS}` : row.CLASS;
            
            return `
                <tr>
                    <td><span class="file-path">${fullPath}</span></td>
                    <td>${getCoverageBadge(lineCoverage)}</td>
                    <td>${getCoverageBadge(branchCoverage)}</td>
                    <td>${getCoverageBadge(methodCoverage)}</td>
                </tr>
            `;
        }).join('');

        // Show content, hide loading
        document.getElementById('backend-loading').classList.add('d-none');
        document.getElementById('backend-content').classList.remove('d-none');

    } catch (error) {
        document.getElementById('backend-loading').classList.add('d-none');
        document.getElementById('backend-error').classList.remove('d-none');
        document.getElementById('backend-error').textContent = 'Error loading backend coverage data: ' + error.message;
    }
}

// Load and display frontend coverage data
async function loadFrontendCoverage() {
    try {
        const response = await fetch('./frontend/coverage-summary.json');
        const data = await response.json();
        
        // Create chart with overall coverage
        const ctx = document.getElementById('frontendChart');
        const overallData = data.total;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Lines', 'Functions', 'Branches', 'Statements'],
                datasets: [{
                    data: [
                        overallData.lines.pct,
                        overallData.functions.pct,
                        overallData.branches.pct,
                        overallData.statements.pct
                    ],
                    backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Get file entries for table
        const fileEntries = Object.entries(data).filter(([key]) => key !== 'total');

        // Create table with file details
        const tbody = document.querySelector('#frontendTable tbody');
        
        tbody.innerHTML = fileEntries.map(([filepath, fileData]) => {
            // Show relative path from src/
            const srcIndex = filepath.indexOf('/src/');
            const displayPath = srcIndex !== -1 ? filepath.substring(srcIndex + 1) : filepath;
            return `
                <tr>
                    <td title="${filepath}"><span class="file-path">${displayPath}</span></td>
                    <td>${getCoverageBadge(fileData.lines.pct)}</td>
                    <td>${getCoverageBadge(fileData.functions.pct)}</td>
                    <td>${getCoverageBadge(fileData.branches.pct)}</td>
                </tr>
            `;
        }).join('');

        // Show content, hide loading
        document.getElementById('frontend-loading').classList.add('d-none');
        document.getElementById('frontend-content').classList.remove('d-none');

    } catch (error) {
        document.getElementById('frontend-loading').classList.add('d-none');
        document.getElementById('frontend-error').classList.remove('d-none');
        document.getElementById('frontend-error').textContent = 'Error loading frontend coverage data: ' + error.message;
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadBackendCoverage();
    loadFrontendCoverage();
});