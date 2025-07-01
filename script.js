function showFormAndScroll() {
  const formSection = document.getElementById('form-section');
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('start-check').addEventListener('click', showFormAndScroll);
document.getElementById('check-iva').addEventListener('click', showFormAndScroll);