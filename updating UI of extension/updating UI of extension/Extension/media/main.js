window.addEventListener('DOMContentLoaded', (event) => {
    
    document.getElementById('Submit').addEventListener('click', Help);
    document.getElementById('userInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            Help();
        }
    });
    const chatWindow = document.getElementById('display');
    const initialBotMessageDiv = document.createElement('div');
    initialBotMessageDiv.id = 'initialBotMessage';
    initialBotMessageDiv.classList.add('message', 'bot-message');
    initialBotMessageDiv.innerHTML = `<strong>Bot:</strong><br>Hi, I am here to rescue`;
    chatWindow.appendChild(initialBotMessageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

});

let query = '';

function Help() {
    const inputField = document.getElementById('userInput');
    const message = inputField.value.trim();
    query = message;
    console.log(message);

    if (message === "") return;

    const chatWindow = document.getElementById('display');

    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.innerHTML = `<strong>Me:</strong><br>${message}`;
    chatWindow.prepend(userMessageDiv);

    inputField.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    fetchresponse();
}

async function fetchresponse() {
    const url = `http://127.0.0.1:5000/api/send_message`;
    
    const formData = new FormData();
    formData.append('user_input', query);
    
    const options = {
        method: 'POST',
        body: formData
    };
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const data = result.response;
        // console.log(result.response);

        const chatWindow = document.getElementById('display');
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message', 'bot-message');
        // botMessageDiv.textContent = "Chatbot" + data;
        botMessageDiv.innerHTML = `<strong>Bot:</strong><br>${data}`;
        // botMessageDiv.textContent = data;
        chatWindow.prepend(botMessageDiv);
        

        chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
    }
}
