class accessionedInput{

    constructor(del = false){
        
    this.accessionDiv = document.createElement("div");
    this.accessionDiv.classList.add("accessioned-input");
        this.isComplete = false;
    this.toolTip = document.createElement("span");
    this.accession = "";
    let tt = this.toolTip;
    this.toolTip.classList.add("tooltip");
    this.toolTip.textContent = "Sorry, you can't enter numbers in this format";
    this.input = document.createElement("input");
    let obj = this;
    this.input.addEventListener('input',function(e){
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
                tt.style.visibility = 'visible';
            } else {
                if(value.length >= 13){
                    obj.isComplete = true;
                }
                else{
                    obj.isComplete = false;
                }
                tt.style.visibility = 'hidden';
                obj.setAccession(value);
            }
        
            e.target.value = value;  // Update the input field with formatted value

        }
    });

    this.input.maxLength = 14;
    this.input.placeholder="12-123-123456";


    this.accessionDiv.appendChild(this.input);

    // Creates Delete Button
    if(del){
    this.deleteButton = document.createElement("button");
    this.deleteButton.classList.add("removeAccession");
    this.deleteIcon = document.createElement("i");
    this.deleteIcon.classList.add("fas","fa-times");
    this.deleteButton.appendChild(this.deleteIcon);
    this.accessionDiv.appendChild(this.deleteButton);

    }

    this.accessionDiv.appendChild(this.toolTip);




    }



    containerNode(){
        return this.accessionDiv;
    }

    remove(){

        let returnValue = this.containerNode();

        returnValue.remove();
        return returnValue;
    }
    setAccession(value){
        let returnValue = this.accession;
        this.accession = value;
        this.input.value = value;
        return returnValue;
    }

    changeToolTipText(text){
        //Brings toolTip into function scope
        let tt = this.toolTip;
        let oldText = tt.textContent;
        tt.textContent = text;
        return oldText;
    }
}


class accessionInputList{

    constructor(){
        this.accessionTicker = document.createElement("input");
        this.accessionTicker.type = "number";
        this.accessionTicker.value = 0;
        this.curVal = 0;

        let obj = this;
        this.hasListTarget = false;
        this.hastickerTarget = false;


        
        this.accessionList = [];
        this.accessionTicker.addEventListener("input", function(e){
            
        let currentValue = parseInt(e.target.value, 10); // Parse the current input value
            if(currentValue < obj.curVal){
                console.log("Removing Accession");
                if(obj.curVal === 0){
                    this.value = 0;
                    throw new Error("Accession List is Empty");
                    
                }
                obj.pop();
            }
            else{
                console.log("Adding Accession");
                obj.push();
            }
        })

    }


    push(){

        let accession = new accessionedInput(true);
        let obj = this;
        this.accessionList.push(accession);
        this.curVal++;
        this.accessionTicker.value = this.curVal;
        if(this.hasListTarget){
            this.listTarget.appendChild(accession.containerNode());
        }
        accession.deleteButton.addEventListener("click",function(){
            obj.remove(accession);
        })



    }



    setListTarget(node){
        
        this.listTarget = node;
        this.hasListTarget = true;
        let list = this.accessionList;
        if(this.curVal >=1){
        for(var i = 0; i < this.curVal; i++){
            this.listTarget.appendChild(list[i].containerNode());
        }
        }
    }
    setTickerTarget(node){
        this.tickerTarget = node;
        this.hastickerTarget = true;

         node.appendChild(this.accessionTicker);
    }


    remove(accession){
        console.log("Removing Accession: ", accession);
        if(this.curVal <= 0){
            throw new Error("List is Empty");
        }
        this.curVal--;
        let list = this.accessionList;
        let removed = list.find(acc => acc === accession);
        this.accessionList = list.filter(acc => acc !== accession);

        this.accessionTicker.value = this.curVal;
        removed.remove();
        return removed;
    }

    pop(){
        this.curVal--;
        let accn = this.accessionList.pop();
        accn.remove();
        return;
    }
}










function createNAccessions(n){
    var accessions = [];
            
        for(var i = 0; i < n; i++){
            accessions.push(new accessionedInput())
        }
        
    return accessions;
}
