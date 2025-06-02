import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io("http://localhost:3000/io/lobby", { path: "/trivia-app" });


socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('searching');
});

socket.on('update-searching-count', (count) => {
    console.log({ count })
    const searchingCountElement = document.getElementById('searching-count');

    console.log({ searchingCountElement })
    if (searchingCountElement) {
        searchingCountElement.textContent = count;
    }
});

