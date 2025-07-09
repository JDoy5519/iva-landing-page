let currentStep = 0;
console.log('🔍 Initial currentStep:', currentStep);
let steps;







document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  console.log('🔍 Initial currentStep:', currentStep);
  let steps;
  steps = document.querySelectorAll('.form-step');
  console.log('🧩 Steps found:', steps.length, steps);
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const providerSelect = document.getElementById('iva-provider');
  const otherProviderInput = document.getElementById('other-provider');
  const formSection = document.getElementById('form-section');
  const testimonyInput = document.getElementById('userTestimony');
  const testimonyCount = document.getElementById('testimonyCount');
  const form = document.getElementById('iva-check-form');
  const thankYouMessage = document.getElementById('thank-you');
  const livedAtAddressRadios = document.querySelectorAll('input[name="livedAtAddress"]');
const previousAddressContainer = document.getElementById('previous-address');
const vulnerableRadios = document.querySelectorAll('input[name="feltVulnerable"]');
const explanationBox = document.getElementById('vulnerability-explanation');
const vulnerabilityTextarea = document.getElementById('vulnerabilityReason');
const charCountDisplay = document.getElementById('charCount');
const changeBankRadios = document.querySelectorAll('input[name="changeBank"]');
const previousBankContainer = document.getElementById('previous-bank-container');
const previousBankInput = document.getElementById('previousBank');
loadFormData();

changeBankRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'Yes' && radio.checked) {
      previousBankContainer.classList.remove('hidden');
      previousBankInput.setAttribute('required', 'required');
    } else if (radio.value === 'No' && radio.checked) {
      previousBankContainer.classList.add('hidden');
      previousBankInput.removeAttribute('required');
      previousBankInput.value = '';
      clearError(previousBankInput);
    }
  });
});

vulnerableRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'Yes' && radio.checked) {
      explanationBox.classList.remove('hidden');
    } else if (radio.value === 'No' && radio.checked) {
      explanationBox.classList.add('hidden');
    }
  });
});

if (vulnerabilityTextarea && charCountDisplay) {
  vulnerabilityTextarea.addEventListener('input', () => {
    const length = vulnerabilityTextarea.value.length;
    charCountDisplay.textContent = length;
  });
}

  document.getElementById('iva-check-form').addEventListener('input', () => {
    saveFormData();
  });

  document.getElementById('resume-check')?.addEventListener('click', () => {
  const formSection = document.getElementById('form-section');
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
});



function goToStep(index) {
  if (!steps || index < 0 || index >= steps.length) return;

  steps[currentStep].classList.remove('active');
  currentStep = index;
  steps[currentStep].classList.add('active');

  const progressBar = document.getElementById('progress-bar');
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
  document.getElementById('progress-label').textContent = `Step ${currentStep + 1} of ${steps.length}`;


  saveFormData(); // Save step when navigating
}

//local storage
function saveFormData() {
  const formData = new FormData(document.getElementById('iva-check-form'));
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });

  const payload = {
    formData: obj,
    currentStep: currentStep
  };

  localStorage.setItem('ivaFormState', JSON.stringify(payload));
}


function loadFormData() {
  const saved = localStorage.getItem('ivaFormState');
  if (!saved) return;

  const data = JSON.parse(saved);
  if (data.formData) {
    Object.entries(data.formData).forEach(([key, value]) => {
      const field = document.querySelector(`[name="${key}"]`);
      if (!field) return;

      if (field.type === 'radio' || field.type === 'checkbox') {
        const match = document.querySelector(`[name="${key}"][value="${value}"]`);
        if (match) match.checked = true;
      } else {
        field.value = value;
      }
    });

    if (typeof data.currentStep === 'number' && steps[data.currentStep]) {
  // Reveal the form section if it was hidden
  formSection.classList.remove('hidden');

  // Scroll to the form
  formSection.scrollIntoView({ behavior: 'smooth' });

  // Jump to the saved step
  goToStep(data.currentStep);
}

  }

  if (typeof data.currentStep === 'number' && steps[data.currentStep]) {
    goToStep(data.currentStep);
  }
}



//previous address logic
livedAtAddressRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'No' && radio.checked) {
      previousAddressContainer.classList.remove('hidden');
    } else if (radio.value === 'Yes' && radio.checked) {
      previousAddressContainer.classList.add('hidden');
    }
  });
});


form.addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent default submission

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    // ✅ Treat 200 and 204 as success (FormSubmit uses 204)
    if (response.status === 200 || response.status === 204) {
      // 🔥 Google Analytics conversion event
        gtag('event', 'iva_form_submission', {
          event_category: 'Form',
          event_label: 'IVA Claim Submitted',
          value: 1
        });

      // Reset saved data
      localStorage.removeItem('ivaFormState');
      form.reset();

      // Reset form step view
      document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
      document.querySelector('[data-step="0"]').classList.add('active');

      // Reset progress bar and label
      document.getElementById('progress-label').textContent = 'Step 1 of 10';
      document.getElementById('progress-bar').style.width = '10%';

      // Show thank-you modal
      const thankYouModal = document.getElementById('thank-you');
      thankYouModal.classList.remove('hidden');
      thankYouModal.classList.add('fade-in');
    } else {
      console.error('Unexpected response:', response);
      alert('Oops! Something went wrong submitting your claim. Please try again.');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Error submitting form. Please check your connection.');
  }
});


  


// Close thank-you modal
const closeThankYouBtn = document.getElementById('close-thank-you');
if (closeThankYouBtn) {
  closeThankYouBtn.addEventListener('click', function () {
    document.getElementById('thank-you').classList.add('hidden');
  });
}


//character counter for the testimony

if (testimonyInput && testimonyCount) {
  testimonyInput.addEventListener('input', () => {
    testimonyCount.textContent = testimonyInput.value.length;
  });
}

document.getElementById('start-check').addEventListener('click', () => {
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth' });
  });

  // Show error message linked to input/group container
  function showError(element, message) {
    const errorEl = document.getElementById(element.id + '-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
    element.classList.add('input-error');
  }

  // Clear error message linked to input/group container
  function clearError(element) {
    const errorEl = document.getElementById(element.id + '-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    element.classList.remove('input-error');
  }

  function isValidName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s'.-]+$/.test(name.trim());
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // Validate Step 1: Contact Details
  function validateStep1() {
    let valid = true;
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!isValidName(name)) {
      const msg = !name ? 'Please enter your full name' : 'Please enter a valid full name';
      showError(nameInput, msg);
      valid = false;
    } else {
      clearError(nameInput);
    }

    if (!isValidEmail(email)) {
      showError(emailInput, 'Please enter a valid email address');
      valid = false;
    } else {
      clearError(emailInput);
    }
    return valid;
  }

  // Validate Step 2: IVA Provider
  function validateStep2() {
    let valid = true;

    if (!providerSelect.value) {
      showError(providerSelect, 'Please select your IVA provider');
      valid = false;
    } else {
      clearError(providerSelect);
    }

    if (providerSelect.value === 'Other') {
      if (!otherProviderInput.value.trim()) {
        showError(otherProviderInput, 'Please enter your provider name');
        valid = false;
      } else {
        clearError(otherProviderInput);
      }
    } else {
      clearError(otherProviderInput);
    }
    return valid;
  }

  // Utility to check if a radio group has a checked input
  function isRadioGroupChecked(name) {
    return !!document.querySelector(`input[name="${name}"]:checked`);
  }

  function validateStep3() {
  let valid = true;

  const monthlyPayment = document.getElementById('monthlyPayment');
  const groupLabels = {
    ivaStatus: 'IVA status',
    debtLevel: 'debt level',
    ivaType: 'IVA type',
    setupBy: 'who set up your IVA'
  };

  // Validate radio groups
  Object.keys(groupLabels).forEach(name => {
    const errorElement = document.getElementById(`${name}-error`);
    const isChecked = document.querySelector(`input[name="${name}"]:checked`);
    if (!isChecked) {
      if (errorElement) {
        errorElement.textContent = `Please select ${groupLabels[name]}`;
        errorElement.style.display = 'block';
      }
      valid = false;
    } else if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  });

  // Validate monthly payment
  if (!monthlyPayment.value || Number(monthlyPayment.value) < 1) {
    showError(monthlyPayment, 'Please enter your monthly IVA payment');
    valid = false;
  } else {
    clearError(monthlyPayment);
  }

  return valid;
}


  function validateStep4() {
  let valid = true;

  const fieldMap = [
    { id: 'currentAddress', message: 'Please enter your current street address' },
    { id: 'city', message: 'Please enter your city' },
    { id: 'postcode', message: 'Please enter your postcode' },
    { id: 'residentialStatus', message: 'Please select your residential status' }
  ];

  fieldMap.forEach(({ id, message }) => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      showError(field, message);
      valid = false;
    } else {
      clearError(field);
    }
  });

  const radioGroups = {
    livedAtAddress: 'Please select whether you lived at this property when you entered your IVA',
    mortgageArrears: 'Please select if you were in mortgage arrears'
  };

  Object.entries(radioGroups).forEach(([name, message]) => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const error = document.getElementById(`${name}-error`);
    if (!selected) {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      }
      valid = false;
    } else if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  return valid;
}

  function validateStep5() {
  let valid = true;

  const textFields = [
    { id: 'jobTitle', message: 'Please enter your job title' },
    { id: 'salary', message: 'Please enter your estimated salary' }
  ];

  textFields.forEach(({ id, message }) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      showError(input, message);
      valid = false;
    } else {
      clearError(input);
    }
  });

  const salaryInput = document.getElementById('salary');
  if (salaryInput.value && isNaN(Number(salaryInput.value))) {
    showError(salaryInput, 'Salary must be a valid number');
    valid = false;
  }

  // ✅ Updated for <select> dropdown for employment status
  const employmentSelect = document.getElementById('employmentStatus');
  const employmentError = document.getElementById('employmentStatus-error');
  if (!employmentSelect.value) {
    employmentError.textContent = 'Please select your employment status';
    employmentError.style.display = 'block';
    valid = false;
  } else {
    employmentError.textContent = '';
    employmentError.style.display = 'none';
  }

  // ✅ Still validating radio groups
  const radioGroups = {
    commissionBased: 'Please indicate if your income was commission based',
    incomeChanged: 'Please indicate if your income changed during the IVA'
  };

  Object.entries(radioGroups).forEach(([name, message]) => {
    const input = document.querySelector(`input[name="${name}"]`);
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const error = document.getElementById(`${name}-error`);
    if (!selected) {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      } else if (input) {
        showError(input, message);
      }
      valid = false;
    } else if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  return valid;
}


  function validateStep6() {
  let valid = true;

  const radioGroups = {
    hadDependants: 'Please indicate if you had dependants',
    feltVulnerable: 'Please indicate if you felt vulnerable'
  };

  Object.entries(radioGroups).forEach(([name, message]) => {
    const input = document.querySelector(`input[name="${name}"]`);
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const error = document.getElementById(`${name}-error`);
    if (!selected) {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      } else if (input) {
        showError(input, message);
      }
      valid = false;
    } else if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  return valid;
}

function validateStep7() {
  let valid = true;

  // Validate select field
  const marketingSource = document.getElementById('marketingSource');
  if (!marketingSource.value) {
    showError(marketingSource, 'Please select how you first heard of the IVA provider');
    valid = false;
  } else {
    clearError(marketingSource);
  }

  // Validate text field
  const changeBankYes = document.querySelector('input[name="changeBank"][value="Yes"]');
if (changeBankYes && changeBankYes.checked) {
  if (!previousBank.value.trim()) {
    showError(previousBank, 'Please enter your previous bank');
    valid = false;
  } else {
    clearError(previousBank);
  }
} else {
  clearError(previousBank); // Clear errors if not required
}

  // Validate radio groups
  const radioGroups = {
    wasInDMP: 'Please select whether you were in a DMP before your IVA',
    salesApproach: 'Please select how the company explained debt solutions',
    signedElectronically: 'Please select if you signed documents electronically',
    vehicleFinance: 'Please indicate if you had vehicle finance before the IVA',
    changeBank: 'Please indicate if you were advised to change bank accounts'
  };

  Object.entries(radioGroups).forEach(([name, message]) => {
    const error = document.getElementById(`${name}-error`);
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (!selected) {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      }
      valid = false;
    } else if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  return valid;
}

function validateStep8() {
  let valid = true;

  const radioGroups = {
    paymentAffordable: 'Please select if the payment was affordable when IVA began',
    struggledPayments: 'Please indicate if you struggled to maintain payments',
    reduceSpending: 'Please indicate if you were told to cut spending',
    believedAffordable: 'Please select if you thought payments would stay affordable',
    warnedOfRisks: 'Please indicate if the consequences of failure were explained'
  };

  Object.entries(radioGroups).forEach(([name, message]) => {
    const error = document.getElementById(`${name}-error`);
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (!selected) {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      }
      valid = false;
    } else if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  });

  return valid;
}

function validateStep9() {
  const testimony = document.getElementById('userTestimony');
  const error = document.getElementById('userTestimony-error');
  let valid = true;

  if (!testimony.value.trim()) {
    error.textContent = 'Please enter your testimony before continuing';
    error.style.display = 'block';
    valid = false;
  } else {
    error.textContent = '';
    error.style.display = 'none';
  }

  return valid;
}

function validateStep10() {
  const consentRadios = document.querySelectorAll('input[name="consentGiven"]');
  const consentError = document.getElementById('consentGiven-error');

  const isChecked = Array.from(consentRadios).some(radio => radio.checked);

  if (!isChecked) {
    consentError.textContent = 'Please indicate if you give consent.';
    consentError.style.display = 'block';
    return false;
  } else {
    consentError.textContent = '';
    consentError.style.display = 'none';
    return true;
  }
}



  const validators = [
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
    validateStep7,
    validateStep8,
    validateStep9,
    validateStep10
  ];

  nextBtns.forEach(btn => btn.addEventListener('click', () => {
    if (validators[currentStep]) {
      if (!validators[currentStep]()) {
        return;
      }
    }
    console.log('Current step before advancing:', currentStep, '| Trying to go to:', currentStep + 1);
    goToStep(currentStep + 1);
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  }));

  prevBtns.forEach(btn => btn.addEventListener('click', () => {
    goToStep(currentStep - 1);
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  }));

  providerSelect.addEventListener('change', () => {
    const otherContainer = document.getElementById('other-provider-container');
    if (providerSelect.value === 'Other') {
      otherContainer.classList.remove('hidden');
      otherProviderInput.setAttribute('required', 'required');
    } else {
      otherContainer.classList.add('hidden');
      otherProviderInput.removeAttribute('required');
      clearError(otherProviderInput);
    }
  });

  document.getElementById('check-iva')?.addEventListener('click', () => {
  formSection.classList.remove('hidden');
  formSection.scrollIntoView({ behavior: 'smooth' });
});


});



lucide.createIcons();




