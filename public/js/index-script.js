const tableContainer = document.querySelector('#item-container');
const categorySort = document.querySelector('#categorySort');

tableContainer.addEventListener('submit', (event) => {
  if (event.target.classList.contains('remove-item')) {
    event.preventDefault();
    if (confirm('Sure to remove?')) {
      event.target.submit();
    }
  }
});

categorySort.addEventListener('change', (event) => {
  event.target.parentElement.submit();
});
