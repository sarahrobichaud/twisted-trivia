const form = document.querySelector('#join-form');
const usernameInput = document.querySelector('#username');

if (!form) {
    throw new Error('Join form not found');
}

if (!usernameInput) {
    throw new Error('Username input not found');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('submit');

    const code = form.code.value;
    const username = usernameInput.value;

    if (!username) {
        alert('Please enter a username');
        return;
    }

    if (!code) {
        alert('Please enter a game code');
        return;
    }

    let accessCode = null;

    const url = new URL("http://localhost:3000/api");

    try {
        const response = await fetch(`${url.toString()}/game/join/${code}`, {
            method: 'POST',
        });
        const { data } = await response.json();

        if (!response.ok) {
            throw new Error('Failed to join game');
        }


        accessCode = data.accessCode;

        const connectResponse = await fetch(`${url.toString()}/game/connect/${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-code": accessCode
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