const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Get the popup
var popup = document.getElementById("contactPopup");

// Get the button that opens the popup
var contactButton = document.querySelector(".button"); // Assuming this is your "Contact" button

// Get the <span> element that closes the popup
var closeBtn = document.querySelector(".close-btn");

// When the user clicks the button, open the popup
contactButton.onclick = function() {
    popup.style.display = "flex"; // Show popup as a flexbox
}

// When the user clicks on <span> (x), close the popup
closeBtn.onclick = function() {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

// Get the popup
var popup = document.getElementById("contactPopup");

// Get all buttons that should trigger the popup
var popupButtons = document.querySelectorAll(".popup-trigger");

// Get the <span> element that closes the popup
var closeBtn = document.querySelector(".close-btn");

// Loop through all popup-trigger buttons and add event listeners
popupButtons.forEach(function(button) {
    button.onclick = function() {
        popup.style.display = "flex"; // Show popup as a flexbox
    };
});

// When the user clicks on <span> (x), close the popup
closeBtn.onclick = function() {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const comment = document.getElementById("comment");

function sendEmail() {
    const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phone.value}<br> Comment: ${comment.value}`;
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "hsiao.david888@gmail.com",
        Password : "F98F34CF97B65D14E3ED8302B1FD4DE3018D",
        To : 'hsiao.david888@gmail.com',
        From : "hsiao.david888@gmail.com",
        Subject : "Real Estate",
        Body : bodyMessage
    }).then(
      message => alert(message)
    );
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    sendEmail();
});