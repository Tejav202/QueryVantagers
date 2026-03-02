document.getElementById('generateBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    const outputCode = document.getElementById('outputCode');
    const statusBadge = document.getElementById('statusBadge');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');

    // 1. Validation for empty input
    if (!userInput.trim()) return alert("Please enter a query!");

    // 2. Reset UI State
    outputCode.textContent = "// Generating query...";
    statusBadge.classList.add('hidden');
    
    // Clear any previous results list
    const oldResults = document.getElementById('resultsList');
    if (oldResults) oldResults.remove();

    try {
        // 3. API Call to your local Node.js server
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userInput })
        });

        const data = await response.json();

        if (data.success) {
            // 4. Display the Generated MQL Query in the console
            outputCode.textContent = JSON.stringify(data.result, null, 2);
            
            // 5. Update Security Badge
            statusBadge.className = "status-badge safe";
            statusIcon.className = "fas fa-shield-alt";
            statusText.textContent = "Query Validated & Secure";

            // 6. Display Database Records (Maddi, Teja, etc.)
            if (data.data && data.data.length > 0) {
                const resultsContainer = document.createElement('div');
                resultsContainer.id = 'resultsList';
                resultsContainer.style.marginTop = "20px";
                resultsContainer.innerHTML = '<h3 style="color: #38bdf8; margin-bottom: 10px;">Database Records:</h3>';
                
                data.data.forEach(student => {
                    const item = document.createElement('p');
                    item.style.background = "#1e293b";
                    item.style.padding = "10px";
                    item.style.borderRadius = "5px";
                    item.style.marginBottom = "5px";
                    item.textContent = `👤 Name: ${student.name} | 📊 Marks: ${student.marks}`;
                    resultsContainer.appendChild(item);
                });
                
                document.querySelector('.output-area').appendChild(resultsContainer);
            }
        } else {
            throw new Error(data.message);
        }

    } catch (err) {
        // 7. Error Handling (Security blocks or Connection failures)
        outputCode.textContent = `Error: ${err.message}`;
        statusBadge.className = "status-badge unsafe";
        statusIcon.className = "fas fa-exclamation-triangle";
        statusText.textContent = "Security Block: Unsafe Operation";
    }

    statusBadge.classList.remove('hidden');
});