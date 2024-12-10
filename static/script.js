const form = document.getElementById('query-form');
const inputField = document.getElementById('input');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = document.getElementById('submit-btn-text');
const loadingIcon = document.getElementById('loading-icon');
const responseContainer = document.getElementById('response-container');
const responseField = document.getElementById('response');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    loadingIcon.classList.toggle('hidden', !isLoading);
    submitBtnText.textContent = isLoading ? 'Processing...' : 'Send Message';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    responseContainer.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function typewriterEffect(text, element, speed = 20) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = inputField.value.trim();
    
    if (userInput) {
        try {
            hideError();
            setLoading(true);
            
            const response = await fetch('/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input: userInput })
            });
            
            const data = await response.json();
            
            if (data.error) {
                showError(data.error);
            } else {
                responseContainer.classList.remove('hidden');
                typewriterEffect(data.response, responseField);
            }
        } catch (error) {
            showError(error.message || 'An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    }
});
