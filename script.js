let queries = [];
let currentQueryIndex = 0;
let results = [];

async function loadQueries() {
    try {
        const response = await fetch('data/question_solution_pairs.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        queries = await response.json();
        displayCurrentQuery();
    } catch (error) {
        console.error('Error loading queries:', error);
        document.getElementById('query-container').innerHTML = '<p class="text-danger">Error loading queries. Please try again later.</p>';
    }
}

function displayCurrentQuery() {
    if (currentQueryIndex < queries.length) {
        const currentQuery = queries[currentQueryIndex];
        document.getElementById('query').textContent = currentQuery.query;
        document.getElementById('solution').textContent = currentQuery.solution;
    } else {
        document.getElementById('query-container').style.display = 'none';
        document.getElementById('buttons').style.display = 'none';
        document.getElementById('download-container').style.display = 'block';
    }
}

function handleCorrect() {
    saveResult('Correct');
    nextQuery();
}

function handleWrong() {
    document.getElementById('buttons').style.display = 'none';
    document.getElementById('correction-form').style.display = 'block';
}

function handleSubmitCorrection() {
    const correctedSolution = document.getElementById('corrected-solution').value;
    saveResult('Incorrect', correctedSolution);
    document.getElementById('correction-form').style.display = 'none';
    document.getElementById('buttons').style.display = 'block';
    document.getElementById('corrected-solution').value = '';
    nextQuery();
}

function saveResult(status, correctedSolution = null) {
    const currentQuery = queries[currentQueryIndex];
    const result = {
        query: currentQuery.query,
        originalSolution: currentQuery.solution,
        status: status 
    };
    if (correctedSolution) {
        result.correctedSolution = correctedSolution;
    }
    results.push(result);
}

function nextQuery() {
    currentQueryIndex++;
    displayCurrentQuery();
}

function downloadResults() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

document.getElementById('correct-btn').addEventListener('click', handleCorrect);
document.getElementById('wrong-btn').addEventListener('click', handleWrong);
document.getElementById('submit-correction').addEventListener('click', handleSubmitCorrection);
document.getElementById('download-btn').addEventListener('click', downloadResults);

loadQueries();

