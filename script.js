let currentStep = 0;
console.log('🔍 Initial currentStep:', currentStep);
let steps;

function goToStep(index) {
  if (!steps || index < 0 || index >= steps.length) {
    console.warn(`goToStep aborted — invalid index: ${index}`);
    return;
  }

  console.log(`🔁 Transitioning from step ${currentStep} → ${index}`);
  console.log(`Current step element:`, steps[currentStep]);
  console.log(`Next step element:`, steps[index]);

  if (!steps[currentStep]) {
    console.error(`⚠️ No element found for currentStep index: ${currentStep}`);
    return;
  }

  steps[currentStep].classList.remove('active');
  currentStep = index;
  steps[currentStep].classList.add('active');
}


document.addEventListener('DOMContentLoaded', () => {
  steps = document.querySelectorAll('.form-step');
  console.log('🧩 Steps found:', steps.length, steps);
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const providerSelect = document.getElementById('iva-provider');
  const otherProviderInput = document.getElementById('other-provider');
  const formSection = document.getElementById('form-section');

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

    const radioGroups = {
      employmentStatus: 'Please select your employment status',
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
  const previousBank = document.getElementById('previousBank');
  if (!previousBank.value.trim()) {
    showError(previousBank, 'Please enter your previous bank');
    valid = false;
  } else {
    clearError(previousBank);
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
  }));

  prevBtns.forEach(btn => btn.addEventListener('click', () => {
    goToStep(currentStep - 1);
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

});





