const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  if (!form.checkValidity() || !pwCheck.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add('was-validated'); // 標記表單已驗證
});

const pwCheck = document.querySelector('#confirmPassword');
pwCheck.addEventListener('input', (event) => {
  const password = document.querySelector('#password').value;
  if (password !== event.target.value) {
    event.target.classList.add('is-invalid');
    event.target.classList.remove('is-valid');
  } else {
    event.target.classList.add('is-valid');
    event.target.classList.remove('is-invalid');
    event.target.setCustomValidity('');
  }
});
