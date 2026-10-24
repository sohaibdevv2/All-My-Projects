            const form = document.getElementById('contactForm');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');

            function validateName() {
                if (nameInput.value.trim() === '') {
                    nameError.textContent = 'Name is required.';
                    return false;
                }
                nameError.textContent = '';
                return true;
            }

            function validateEmail() {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.trim() === '') {
                    emailError.textContent = 'Email is required.';
                    return false;
                } else if (!emailPattern.test(emailInput.value.trim())) {
                    emailError.textContent = 'Please enter a valid email.';
                    return false;
                }
                emailError.textContent = '';
                return true;
            }

            function validateMessage() {
                if (messageInput.value.trim() === '') {
                    messageError.textContent = 'Message is required.';
                    return false;
                }
                messageError.textContent = '';
                return true;
            }

            nameInput.addEventListener('input', validateName);
            emailInput.addEventListener('input', validateEmail);
            messageInput.addEventListener('input', validateMessage);

            form.addEventListener('submit', function (e) {
                let valid = true;
                if (!validateName()) valid = false;
                if (!validateEmail()) valid = false;
                if (!validateMessage()) valid = false;
                if (!valid) e.preventDefault();
            });

document.addEventListener("DOMContentLoaded", function() {
    const year = new Date().getFullYear();
    const copyright = document.querySelector("footer .footerb h3");
    if (copyright) {
        copyright.textContent = `Copyright © ${year}. All rights are reserved`;
    }
});