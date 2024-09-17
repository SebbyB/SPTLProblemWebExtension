// Example Stuff!
document.getElementById('hideButton').addEventListener('click', function() {
    const exampleDiv = document.querySelector('.example');
    if (exampleDiv.style.display === 'none') {
      exampleDiv.style.display = 'block';
    } else {
      exampleDiv.style.display = 'none';
    }
  });

//Example Hiden By Default
document.getElementById('hideButton').click();
//Toggles
const toggleCheckbox = document.getElementById('toggle');
toggleCheckbox.addEventListener('change', function() {
  if (this.checked) {
    console.log("Toggle is ON");
  } else {
    console.log("Toggle is OFF");
  }
});


//Formatted Inputs with tooltips
const dashedInputField = document.getElementById('dashed-Input');
const dashedToolTip = document.getElementById('dashed-tooltip');

// 
dashedInputField.addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^0-9a-zA-Z]/g, ''); // Remove all non-alphanumeric characters

    // Apply the format: 12-123-123456
    if (value.length > 2) {
        value = value.substring(0, 2) + '-' + value.substring(2);
    }
    if (value.length > 6) {
        value = value.substring(0, 6) + '-' + value.substring(6);
    }

    let isValidFormat = true;

    // Check that positions 0-1, 3-5, 7-12 are digits
    for (let i = 0; i < value.length; i++) {
        if ((i < 13 && i !== 2 && i !== 6 && /\D/.test(value[i]))) {
            isValidFormat = false;
        }
    }

    // Check that the last character (position 13) is a letter
    if (value.length === 14 && !/[a-zA-Z]/.test(value[13])) {
        isValidFormat = false;
    }

    // Show or hide the tooltip based on the format validity
    if (!isValidFormat) {
        dashedToolTip.style.visibility = 'visible';
    } else {
        dashedToolTip.style.visibility = 'hidden';
    }

    e.target.value = value;  // Update the input field with formatted value
});

// Hide the tooltip when the user clicks away
dashedInputField.addEventListener('blur', function () {
    dashedToolTip.style.visibility = 'hidden';
});

const tenNumberinputSize = 10;
const tenNumberInput = document.getElementById('10-number-Input');
const tenNumberToolTip = document.getElementById('10-number-tooltip');
tenNumberInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters

    // Limit the input to 10 digits
    if (value.length > tenNumberinputSize) {
        value = value.substring(0, tenNumberinputSize);
    }

    e.target.value = value;  // Set the cleaned value back to the input field
});
tenNumberInput.addEventListener('blur', function () {
    tenNumberToolTip.style.visibility = 'hidden';
});






const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const numberPicker = document.getElementById('numberPicker');
const pickerToolTip = document.getElementById('ticker-tooltip');

// Ensure only positive numbers and remove leading zeros
numberPicker.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    value = value.replace(/^0+/, ''); // Remove leading zeros
    e.target.value = value === '' ? '0' : value; // If the input is empty, set it back to '0'
});

// Increase the number when the "+" button is clicked
increaseBtn.addEventListener('click', function() {
  numberPicker.value = parseInt(numberPicker.value) + 1;
  numberPicker.value = numberPicker.value.replace(/^0+/, ''); // Remove leading zeros if any
});

// Decrease the number when the "-" button is clicked
decreaseBtn.addEventListener('click', function() {
  let newValue = parseInt(numberPicker.value) - 1;
  numberPicker.value = newValue < 0 ? '0' : newValue; // Prevent negative values, default to '0'
  numberPicker.value = numberPicker.value.replace(/^0+/, ''); // Remove leading zeros if any
});
