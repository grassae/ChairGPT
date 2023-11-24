document.addEventListener('DOMContentLoaded', function () {
    // Retrieve seating result from the URL query parameter
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const seatingResultString = urlParams.get('seatingResult');

    if (seatingResultString) {
        // Parse seating result from the query parameter
        const seatingResult = JSON.parse(decodeURIComponent(seatingResultString));

        // Display the seating result on the page
        displaySeatingResult(seatingResult);
    } else {
        // Handle case when no seating result is provided
        document.getElementById('seatingResult').innerHTML = '<p>No seating result available.</p>';
    }
});

function displaySeatingResult(seatingResult) {
    // Generate HTML for displaying the seating result
    let resultHTML = '';
    for (let i = 0; i < seatingResult.length; i++) {
        resultHTML += `<p>${seatingResult[i]}</p>`;
    }
    resultHTML += '<p><br>We use data to mix and match guests so that you can put the fun in function!</p>';

    document.getElementById('seatingResult').innerHTML = resultHTML;
}

function goToLandingPage() {
    // Replace 'index.html' with the actual name of your landing page
    window.location.href = 'index.html';
}