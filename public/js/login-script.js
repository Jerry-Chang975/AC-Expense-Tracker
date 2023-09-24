const rememberMe = document.querySelector('#rememberMe');
const email = document.querySelector('#email');
window.addEventListener('load', () => {
  rememberMe.checked =
    localStorage.getItem('rememberMe') === 'true' ? true : false;
  email.value = localStorage.getItem('email') || '';
});

const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add('was-validated');
  if (rememberMe.checked) {
    localStorage.setItem('email', document.querySelector('#email').value);
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('email');
    localStorage.setItem('rememberMe', 'false');
  }
});
