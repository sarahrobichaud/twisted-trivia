const forms = Array.from(document.querySelectorAll('.create-game-form'));
const usernameInput = document.getElementById('username');

if (!forms.length) {
    throw new Error('Create form not found');
}

if (!usernameInput) {
    throw new Error('Username input not found');
}

forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('submit');

        const quizId = form.dataset.quizId;
        const username = usernameInput.value;

        if (!username) {
            alert('Please enter a username');
            return;
        }

        if (!quizId) {
            alert('Please select a quiz');
            return;
        }

        const url = new URL("http://localhost:3000/api");

        try {
            const response = await fetch(`${url.toString()}/game/create/${quizId}`, {
                method: 'POST',
            });
            const { data } = await response.json();

            if (!response.ok) {
                throw new Error('Failed to join game');
            }


            const connectResponse = await fetch(`${url.toString()}/game/connect/${data.joinCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-access-code": data.accessCode
                },
                body: JSON.stringify({
                    username: username
                })
            });

            if (!connectResponse.ok) {
                throw new Error('Failed to connect to game');
            }

            const connectJSON = await connectResponse.json();


            window.location.href = connectJSON.data.url;

        } catch (error) {
            alert(error.message);
            return;
        }
    });
});