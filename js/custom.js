function addUser(){
    window.location.href = 'add-user.html';
}
function backToUsers(){
    window.location.href='users.html';
}
function editUser(){
    window.location.href='edit-user.html'
}
const togglePassword = document
            .querySelector('#togglePassword');
        const password = document.querySelector('#password');
        togglePassword.addEventListener('click', () => {
            // Toggle the type attribute using
            // getAttribure() method
            const type = password
                .getAttribute('type') === 'password' ?
                'text' : 'password';
            password.setAttribute('type', type);
            // Toggle the eye and bi-eye icon
            this.classList.toggle('bi-eye');
        });
        $('.nav-link').click(function(){
            $('.nav-link').removeClass('active');
            $('.nav-link').removeClass('show');
            $(this).addClass('active');
            $(this).addClass('show');
        })