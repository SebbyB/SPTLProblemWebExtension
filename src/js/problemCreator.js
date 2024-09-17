

const accessionListSize = document.getElementById('accession-size-input');
const accessionListSizeAccess = document.getElementById('accession-size-input-record');
var accessionList = [];
var accessionElementList = [];
const accessionInputs = document.getElementById('accession-input-fields');


// document.getElementById("hide-accessions-button").addEventListener('click', function() {
//     const exampleDiv = document.querySelector('.example');
//     if (exampleDiv.style.display === 'none') {
//       exampleDiv.style.display = 'block';
//     } else {
//       exampleDiv.style.display = 'none';
//     }
//   });

//Example Hiden By Default
// document.getElementById('hideButton').click();



function addAccessionedInput(){

    // Check if the value is NaN, and handle accordingly
    var newVal;
    if (isNaN(parseInt(accessionListSizeAccess.value))) {
        newVal = 1;  // Set to 1 if value is not a number
    } else {
        // If it's a number, increment it
        newVal = parseInt(accessionListSizeAccess.value) + 1;
    }

    // console.log(newVal);


    accessionListSizeAccess.value = newVal.toString();
    console.log(accessionListSizeAccess.value);
    var accessionDiv = document.createElement("div");
    var accessionCompressDiv = document.createElement("div");
    var accessionExpandDiv = document.createElement("div");
    accessionDiv.classList.add("accession");
    accessionElementList.push(accessionDiv);
    accessionInputs.appendChild(accessionDiv);

    let toolTip = document.createElement("span");
    toolTip.classList.add("tooltip");
    toolTip.textContent = "Sorry, you can't enter numbers in this format";
    let input = document.createElement("input");
    input.addEventListener('input',function(e){
        {
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
                toolTip.style.visibility = 'visible';
            } else {
                toolTip.style.visibility = 'hidden';
            }
        
            e.target.value = value;  // Update the input field with formatted value
        }
    });

    input.maxLength = 14;
    input.placeholder="12-123-123456";

    // Creates Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("removeAccession");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas","fa-times");

    // Creates folding Button
    
    let expandButton = document.createElement("button");
    expandButton.classList.add("expandButton");
    let minimizeButton = document.createElement("i");
    let maximizeButton = document.createElement("i");

    maximizeButton.classList.add("fas", "fa-chevron-down");
    minimizeButton.classList.add("fas", "fa-window-minimize");
    expandButton.appendChild(maximizeButton);
    expandButton.appendChild(minimizeButton);
    
    deleteButton.appendChild(deleteIcon);
    accessionCompressDiv.appendChild(input);
    accessionCompressDiv.appendChild(deleteButton);
    accessionCompressDiv.appendChild(toolTip);
    accessionDiv.appendChild(accessionCompressDiv);
    accessionDiv.appendChild(expandButton);



    deleteButton.addEventListener('click', function(){
            this.parentElement.remove();
            var val = (parseInt(accessionListSizeAccess.value)-1);
        accessionListSizeAccess.value = val.toString();
        accessionListSize.value =val;
    });
    console.log("Added");

}


function deleteAccessionedInput(){
    


    if(parseInt(accessionListSizeAccess.value)<= 0){
        console.log("Please Enter an Accession!");
        accessionElementList = [];
        accessionList = [];
        accessionListSizeAccess.value = 0;
    }
    else{
        accessionListSizeAccess.value = (parseInt(accessionListSizeAccess.value)-1).toString();
        
        if(accessionElementList.length === 0){
            console.log("No Negative Numbers!");
        }
        else{
            var deletedElement = accessionElementList.pop();
            deletedElement.remove();
        }

    }
    console.log("Deleted");

}


accessionListSize.addEventListener('input', function (e) {
    // Get the current value and ensure it's a number
    let currentValue = parseInt(e.target.value, 10); // Parse the current input value

    // If the value is empty or invalid, set it back to 0
    if (currentValue <= 0) {
        currentValue = 0;
        e.target.value = '0';
        console.log("Incorrect Formatting... Resetting to 0");
        accessionElementList = [];
        accessionList = [];
        accessionListSizeAccess.value = 0;
    }
    else{
    console.log(currentValue);

    }

    var previousValue =  parseInt(accessionListSizeAccess.value);
  
    // console.log(currentValue);
    console.log("Entering Conditional Statement");
    // Compare the current value with the previous value
    if ((currentValue > previousValue) || isNaN(previousValue) ) {
        addAccessionedInput(); // Call the function if the value increased
    } else if (currentValue < previousValue) {
        deleteAccessionedInput(); // Call the function if the value decreased
    }
});
