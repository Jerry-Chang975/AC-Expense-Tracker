const form = document.querySelector('#recordForm');
console.log(form);
form.addEventListener('submit', function (event) {
  console.log(event);
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add('was-validated'); // 標記表單已驗證
});
