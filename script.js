function showFormAndScroll() {
  const formSection = document.getElementById('form-section');
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('start-check').addEventListener('click', showFormAndScroll);
document.getElementById('check-iva').addEventListener('click', showFormAndScroll);

const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove("active");
      currentStep++;
      steps[currentStep].classList.add("active");
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      steps[currentStep].classList.remove("active");
      currentStep--;
      steps[currentStep].classList.add("active");
    }
  });
});

const providerSelect = document.getElementById('iva-provider');
const otherContainer = document.getElementById('other-provider-container');

providerSelect.addEventListener('change', function () {
  if (this.value === 'Other') {
    otherContainer.classList.remove('hidden');
    document.getElementById('other-provider').setAttribute('required', 'required');
  } else {
    otherContainer.classList.add('hidden');
    document.getElementById('other-provider').removeAttribute('required');
  }
});
