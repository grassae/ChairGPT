
function redirectToShowSeating() {
    window.location.href = 'results.html';
}

async function generateSeating() {
     // Display the loading indicator
     document.getElementById('loadingIndicator').style.display = 'block';
    // Get values from input fields
    const guestList = document.getElementById('guestList').value.trim();
    const numTables = document.getElementById('numTables').value;
    const vibe = document.getElementById('vibe').value;

    try {
        // Call ChatGPT API with input values
        const seatingResult = await callChatGPTAPI(guestList, numTables, vibe);

        // Redirect to "results.html" with the seating result as a query parameter
        const queryString = `?seatingResult=${encodeURIComponent(JSON.stringify(seatingResult))}`;
        window.location.href = `results.html${queryString}`;
    } catch (error) {
        console.error('Error:', error.message);
        // Display error on the same page if needed
        document.getElementById('seatingResult').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function callChatGPTAPI(guestList, numTables, vibe) {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = process.env.YOUR_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';



    try {
        // Construct the ChatGPT API prompt based on selected vibe
        const apiPrompt = constructApiPrompt(guestList, numTables, vibe);

        // Call the ChatGPT API with system prompt
        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful event planner that generates optimised seating arrangements to enhance experiences for every guest. Organise output in compact format and include 2 sentences on how the proposed seating arrangement optimises social interactions, with short examples."
                },
                {
                    role: "user",
                    content: apiPrompt
                }
            ]
        }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

        // Log the entire API response
        console.log('API Response:', response.data);

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            throw new Error('Invalid response from ChatGPT API.');
        }

        // Parse the API response and extract suggested seating
        const data = response.data.choices[0].message;

        // Check if 'content' property is present in the response
        if (!data || !data.content) {
            throw new Error('Invalid response from ChatGPT API: Missing content property.');
        }

        const suggestedSeating = data.content.trim().split('\n').map(name => name.trim());

        return suggestedSeating;
    } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        throw new Error('Error calling ChatGPT API. Please check the console for details.');
    }
}

function constructApiPrompt(guestList, numTables, vibe) {
    // Construct the ChatGPT API prompt based on user inputs
    const vibePrompt = getVibePrompt(vibe);
    const prompt = `Generate seating arrangement in a compact list, each table should have its own header with guests info in comma-separated format. Every guest must be accounted for and distributed amongst ${numTables} equally-sized tables,  from this guestlist:\n${guestList}\n\nVibe: ${vibePrompt}\n`;

    return prompt;
}

function getVibePrompt(vibe) {
    // Return the specific prompt for the selected vibe
    switch (vibe) {
        case 'chic':
            return 'Chic & Cheerful: Sort by similarity, including ages or dietary requirements.';
        case 'mingle':
            return 'Mingle Madness: Sort by an engaging and optimal mix of MBTI.';
        case 'rowdy':
            return 'Rowdy Revelry: Randomize groupings to include a diverse mix of people based on data provided';
        default:
            return 'Undefined Vibe: No specific instructions.';
    }
}

function generateResultHTML(seatingResult) {
    // Generate HTML for a simple result
    let resultHTML = '';
    for (let i = 0; i < seatingResult.length; i++) {
        resultHTML += `<p>${seatingResult[i]}</p>`;
    }
    resultHTML += '<p>The proposed seating arrangement enhances events and social interactions by strategically mixing guests, creating a vibrant and inclusive vibe.</p>';
    return resultHTML;
}


