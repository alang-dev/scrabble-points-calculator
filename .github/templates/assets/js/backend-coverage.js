async function loadBackendCoverage() {
    try {
        const jacocoResponse = await fetch('./backend/jacocoTestReport.csv');
        const csvText = await jacocoResponse.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;
        
        const classRowsWithData = parsedData.filter(row => row.CLASS && row.CLASS !== 'CLASS');
        
        const backendTableBody = document.querySelector('#backendTable tbody');
        backendTableBody.replaceChildren();
        
        let totalLineCovered = 0, totalLineMissed = 0;
        let totalBranchCovered = 0, totalBranchMissed = 0;
        let totalMethodCovered = 0, totalMethodMissed = 0;
        
        classRowsWithData.forEach(classRow => {
            totalLineCovered += parseInt(classRow.LINE_COVERED || 0);
            totalLineMissed += parseInt(classRow.LINE_MISSED || 0);
            totalBranchCovered += parseInt(classRow.BRANCH_COVERED || 0);
            totalBranchMissed += parseInt(classRow.BRANCH_MISSED || 0);
            totalMethodCovered += parseInt(classRow.METHOD_COVERED || 0);
            totalMethodMissed += parseInt(classRow.METHOD_MISSED || 0);
        });
        
        const overallLineCoverage = totalLineCovered + totalLineMissed > 0 ? 
            (totalLineCovered / (totalLineCovered + totalLineMissed) * 100) : 0;
        const overallBranchCoverage = totalBranchCovered + totalBranchMissed > 0 ? 
            (totalBranchCovered / (totalBranchCovered + totalBranchMissed) * 100) : 100;
        const overallMethodCoverage = totalMethodCovered + totalMethodMissed > 0 ? 
            (totalMethodCovered / (totalMethodCovered + totalMethodMissed) * 100) : 0;
        
        createBackendSummaryRow(backendTableBody, overallLineCoverage, overallBranchCoverage, overallMethodCoverage);
        
        classRowsWithData.forEach(classRow => {
            createBackendClassRow(backendTableBody, classRow);
        });

        showBackendContent();

    } catch (error) {
        showBackendError(error.message);
    }
}

function createBackendSummaryRow(tbody, lineCoverage, branchCoverage, methodCoverage) {
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-dark';
    
    const nameCell = document.createElement('td');
    const nameStrong = document.createElement('strong');
    nameStrong.textContent = 'Overall Backend Coverage';
    nameCell.appendChild(nameStrong);
    summaryRow.appendChild(nameCell);
    
    const lineCell = document.createElement('td');
    lineCell.appendChild(createCoverageBadgeElement(lineCoverage));
    summaryRow.appendChild(lineCell);
    
    const branchCell = document.createElement('td');
    branchCell.appendChild(createCoverageBadgeElement(branchCoverage));
    summaryRow.appendChild(branchCell);
    
    const methodCell = document.createElement('td');
    methodCell.appendChild(createCoverageBadgeElement(methodCoverage));
    summaryRow.appendChild(methodCell);
    
    tbody.appendChild(summaryRow);
}

function createBackendClassRow(tableBody, classRow) {
    const lineCovered = parseInt(classRow.LINE_COVERED || 0);
    const lineMissed = parseInt(classRow.LINE_MISSED || 0);
    const lineTotal = lineCovered + lineMissed;
    const lineCoverage = lineTotal > 0 ? (lineCovered / lineTotal * 100) : 0;

    const branchCovered = parseInt(classRow.BRANCH_COVERED || 0);
    const branchMissed = parseInt(classRow.BRANCH_MISSED || 0);
    const branchTotal = branchCovered + branchMissed;
    const branchCoverage = branchTotal > 0 ? (branchCovered / branchTotal * 100) : 100;

    const methodCovered = parseInt(classRow.METHOD_COVERED || 0);
    const methodMissed = parseInt(classRow.METHOD_MISSED || 0);
    const methodTotal = methodCovered + methodMissed;
    const methodCoverage = methodTotal > 0 ? (methodCovered / methodTotal * 100) : 0;

    const fullClassPath = classRow.PACKAGE ? `${classRow.PACKAGE}.${classRow.CLASS}` : classRow.CLASS;
    
    const classRowElement = document.createElement('tr');
    
    const pathCell = document.createElement('td');
    const pathSpan = document.createElement('span');
    pathSpan.className = 'file-path';
    pathSpan.textContent = fullClassPath;
    pathCell.appendChild(pathSpan);
    classRowElement.appendChild(pathCell);
    
    const lineCell = document.createElement('td');
    lineCell.appendChild(createCoverageBadgeElement(lineCoverage));
    classRowElement.appendChild(lineCell);
    
    const branchCell = document.createElement('td');
    branchCell.appendChild(createCoverageBadgeElement(branchCoverage));
    classRowElement.appendChild(branchCell);
    
    const methodCell = document.createElement('td');
    methodCell.appendChild(createCoverageBadgeElement(methodCoverage));
    classRowElement.appendChild(methodCell);
    
    tableBody.appendChild(classRowElement);
}

function showBackendContent() {
    document.getElementById('backend-loading').classList.add('d-none');
    document.getElementById('backend-content').classList.remove('d-none');
}

function showBackendError(errorMessage) {
    document.getElementById('backend-loading').classList.add('d-none');
    document.getElementById('backend-error').classList.remove('d-none');
    document.getElementById('backend-error').textContent = 'Error loading backend coverage data: ' + errorMessage;
}