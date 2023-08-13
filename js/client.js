// Open nodemon permanently so you don't get any error.

const socket = io("http://localhost:8000", { transports: ["websocket"] });

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages
var message_incomming = new Audio('/music/ding.mp3')
var join = new Audio('/music/user\ join.mp3')
var left = new Audio('/music/user\ left.mp3')


// function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        message_incomming.play();
    }
    else if (position == 'center1'){
        join.play();
    }
    else if (position == 'center2'){
        left.play();
    }
}

// If the form submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, recieve his/her name from the server 
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center1')

})

// If server sents a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'center2')
})


