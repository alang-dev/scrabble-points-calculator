async function loadFrontendCoverage() {
    try {
        const coverageSummaryResponse = await fetch('./frontend/coverage-summary.json');
        const coverageData = await coverageSummaryResponse.json();
        
        const fileEntriesWithCoverage = Object.entries(coverageData).filter(([key]) => key !== 'total');

        const frontendTableBody = document.querySelector('#frontendTable tbody');
        frontendTableBody.replaceChildren();
        
        createFrontendSummaryRow(frontendTableBody, coverageData.total);
        
        fileEntriesWithCoverage.forEach(([filepath, fileData]) => {
            createFrontendFileRow(frontendTableBody, filepath, fileData);
        });

        showFrontendContent();

    } catch (error) {
        showFrontendError(error.message);
    }
}

function createFrontendSummaryRow(tbody, totalData) {
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-dark';
    
    const nameCell = document.createElement('td');
    const nameStrong = document.createElement('strong');
    nameStrong.textContent = 'Overall Frontend Coverage';
    nameCell.appendChild(nameStrong);
    summaryRow.appendChild(nameCell);
    
    const lineCell = document.createElement('td');
    lineCell.appendChild(createCoverageBadgeElement(totalData.lines.pct));
    summaryRow.appendChild(lineCell);
    
    const functionCell = document.createElement('td');
    functionCell.appendChild(createCoverageBadgeElement(totalData.functions.pct));
    summaryRow.appendChild(functionCell);
    
    const branchCell = document.createElement('td');
    branchCell.appendChild(createCoverageBadgeElement(totalData.branches.pct));
    summaryRow.appendChild(branchCell);
    
    tbody.appendChild(summaryRow);
}

function createFrontendFileRow(tableBody, filepath, fileData) {
    const srcIndex = filepath.indexOf('/src/');
    const relativeFilePath = srcIndex !== -1 ? filepath.substring(srcIndex + 1) : filepath;
    
    const fileRowElement = document.createElement('tr');
    
    const pathCell = document.createElement('td');
    pathCell.title = filepath;
    const pathSpan = document.createElement('span');
    pathSpan.className = 'file-path';
    pathSpan.textContent = relativeFilePath;
    pathCell.appendChild(pathSpan);
    fileRowElement.appendChild(pathCell);
    
    const lineCell = document.createElement('td');
    lineCell.appendChild(createCoverageBadgeElement(fileData.lines.pct));
    fileRowElement.appendChild(lineCell);
    
    const functionCell = document.createElement('td');
    functionCell.appendChild(createCoverageBadgeElement(fileData.functions.pct));
    fileRowElement.appendChild(functionCell);
    
    const branchCell = document.createElement('td');
    branchCell.appendChild(createCoverageBadgeElement(fileData.branches.pct));
    fileRowElement.appendChild(branchCell);
    
    tableBody.appendChild(fileRowElement);
}

function showFrontendContent() {
    document.getElementById('frontend-loading').classList.add('d-none');
    document.getElementById('frontend-content').classList.remove('d-none');
}

function showFrontendError(errorMessage) {
    document.getElementById('frontend-loading').classList.add('d-none');
    document.getElementById('frontend-error').classList.remove('d-none');
    document.getElementById('frontend-error').textContent = 'Error loading frontend coverage data: ' + errorMessage;
}