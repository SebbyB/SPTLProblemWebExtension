
function removeLeadingZeros(value) {
    // Use regex to remove leading zeros but keep a single "0" if the input is just zeros
    return value.replace(/^0+(?!$)/, '');
}

function addLeadingZeros(value, n) {
    // Convert value to string and pad it with leading zeros
    return value.toString().padStart(n + value.length, '0');
}


function updateTargets(targets){
        //Pulls length to local scope; 
        let len = targets.length;
        //If there are no targets there is nothing to update.
        if(len === 0){
            throw new Error("You cannot update an empty list.");
        }
        else{
            let changed = false;
            //Iterate over the runnables
            for(var i = 0; i < len; i++){
                let target = targets[i];
                //If the target should be updated, update it. Otherwise Continue.
                // console.log(target);
                // console.log(target.doUpdate);
                if(target.doUpdate){
                    // console.log("akhjgdskfjaghsjhfh");

                    let out = {
                        changed :changed,
                        target : target,
                        this : this
                    };
                    console.log("TargetUpdate: ", out);
                    changed = true;
                    target.updateRunnables();
                }
            }
            //If nothing has changed print that.
            if(!changed){
                console.log("No Updates on target: ",this);
                return this;
            }

        }
}

class runnable{

    constructor(name,doRun=false,func = () => {
        console.log(name);
    }){
        this.name = name;
        this.doRun = doRun;
        this.func = func;
        this.obj = null;
        this.node = null;
    }
}

class target{
    constructor(node = null, obj = null){
        this.name = '';
        this.runnables = [];
        this.targetNode = node;
        this.doUpdate = true;
        this.obj = obj;
    }


    updateRunnables(){

        //Pulls length to local scope; 
        let len = this.runnables.length;
        //If there are no runnables there is nothing to update.
        if(len === 0){
            throw new Error("You cannot update an empty list.");
        }
        else{
            let changed = false;
            //Iterate over the runnables
            for(var i = 0; i < len; i++){
                let runnable = this.runnables[i];
                //If the runnable should be run, run it. Otherwise Continue.
                if(runnable.doRun){

                    let out = {
                        changed :changed,
                        runnable : runnable,
                        this : this
                    };
                    console.log("TargetUpdate: ", out);
                    changed = true;
                    runnable.func();
                }
            }
            //If nothing has changed print that.
            if(!changed){
                console.log("No Updates on target: ",this);
                return this;
            }

        }
    }

    changeRunnableBool(index, doRun = true){
        //Pulls length to local scope; 
        let len = this.runnables.length;
        //If there are no runnables there is nothing to update.
        if(len === 0){
            throw new Error("You cannot update an empty list.");
        }
        //No explaination, if you don't know what you're doing don't use the target or runnable class.
        else if(index < 0){
            throw new Error("Bruh");
        }
        //Checks if the index is within the array.
        else if(index > len){
            throw new Error("Element does not exist"); 
        }
        //Given no errors changes the runnable's state.
        else{
            //Brings it into local scope and changes it, storing it in tmp.
            let runnable = this.runnables[index];
            let previous = runnable.doRun;
            runnable.doRun = doRun;

            //Returns an object containing the target, the runnable, the previous state, and the updated state.
            let returnObject = {
                target : this,
                runnable : runnable,
                previous_state : previous,
                updated_state : runnable.doRun
            };
            return returnObject;
            } 
    }

    changeRunnablefunc(index, func = ()=>{
        console.log(this);
    }){
        //Pulls length to local scope; 
        let len = this.runnables.length;
        //If there are no runnables there is nothing to update.
        if(len === 0){
            throw new Error("You cannot update an empty list.");
        }
        //No explaination, if you don't know what you're doing don't use the target or runnable class.
        else if(index < 0){
            throw new Error("Bruh");
        }
        //Checks if the index is within the array.
        else if(index > len){
            throw new Error("Element does not exist"); 
        }
        //Given no errors changes the runnable's state.
        else{
            //Brings it into local scope and changes it, storing it in tmp.
            let runnable = this.runnables[index];
            let previous = runnable.func;
            runnable.func = func;

            //Returns an object containing the target, the runnable, the previous state, and the updated state.
            let returnObject = {
                target : this,
                runnable : runnable,
                previous_function : previous,
                updated_function : runnable.doRun
            };
            return returnObject;
            } 
        
    }
    addRunnable(name,doRun,func){

        let runnable = new runnable(name,doRun,func);
        this.runnables.push(runnable);
    }
    addRunnable(runnable){

        if(!runnable instanceof runnable){
            throw new Error("Needs to be a runnable.");
            
        }
        this.runnables.push(runnable);
    }
}
class toolTip{
    constructor(){
        this.node = document.createElement("span");
        this.node.classList.add("tooltip");
        this.node.textContent = "Sorry, you can't enter numbers in this format";

        //Switches to be false by default.
        this.toolTipVisibility = true;
        this.switchVisibility();

    }

    //Changes the text of the tool tip.
    changeToolTip(text){
        this.node.textContent = text;
    }

    //Switches the visibility of the tooltip.
    switchVisibility(visibility){
        if(visibility){
            this.node.style.visibility = "visible";
        this.toolTipVisibility = true;

        }
        else{
            this.node.style.visibility = "hidden";
        this.toolTipVisibility = false;

        }
    }

}



class inputControl{


        constructor(targets = []){


            this.isComplete = false;
            
            if(targets.length === 0){
            this.targets = [];
            this.hasTarget = false;
            }
            else{
                this.targets = targets;
                this.hasTarget = true;
            }
            
            this.value;
            this.containerDiv =  document.createElement("div");
            this.input = document.createElement("input");
            this.containerDiv.appendChild(this.input);
             

            this.hasFormattingRules = false;
            let obj = this;
            
            this.input.addEventListener("input", function(e){
                
                if(obj.hasFormattingRules){
                    obj.format(e.target.value);
                }else{
                    obj.setValue(e.target.value);
                }

            });

            this.toolTip = new toolTip();
            this.containerDiv.appendChild(this.toolTip.node);


        }


        //Returns the container node of this object for use in the DOM.
        containerNode(){
            return this.containerDiv;
        }

        //removes this input control.
        remove(){

            let returnValue = this.containerNode();
    
            returnValue.remove();
            return returnValue;
        }

        //formatting rules -- there are none for this abstract class.
        format(value){

            this.toolTip.changeToolTip("This input does not have formatting!");
            this.toolTip.switchVisibility();
            console.log("This input does not have formatting!");
            return false;
        }

        getValue(){
            return this.value;
        }

        //sets the value of whatever input we're using.
        setValue(value){
            let previousValue = this.value;
            this.value = value;


            this.input.value = this.value;
            updateTargets(this.targets);

            return previousValue;
        }



}


class accessionedInput extends inputControl{

    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.input.maxLength = 14;
        this.input.placeholder="12-123-123456";
        this.containerDiv.classList.add("accessioned-input");

    }

    format(value){
        let inputValue = value.replace(/[^0-9a-zA-Z]/g, ''); // Remove all non-alphanumeric characters
        // Apply the format: 12-123-123456
        if (inputValue.length > 2) {
            inputValue = inputValue.substring(0, 2) + '-' + inputValue.substring(2);
        }
        if (inputValue.length > 6) {
            inputValue = inputValue.substring(0, 6) + '-' + inputValue.substring(6);
        }
        let isValidFormat = true;
    
        // Check that positions 0-1, 3-5, 7-12 are digits
        for (let i = 0; i < inputValue.length; i++) {
            if ((i < 13 && i !== 2 && i !== 6 && /\D/.test(inputValue[i]))) {
                isValidFormat = false;
            }
        }
    
        // Check that the last character (position 13) is a letter
        if (inputValue.length === 14 && !/[a-zA-Z]/.test(inputValue[13])) {
            isValidFormat = false;
        }
    
        // Show or hide the tooltip based on the format validity
        if (!isValidFormat) {
            this.toolTip.changeToolTip("Incorrect Format - Please Follow 12-123-123456a");
            this.toolTip.switchVisibility(true);
        } else {
            if(inputValue.length >= 13){
                this.isComplete = true;
            }
            else{
                this.isComplete = false;

                
            }
            if(this.isComplete){
                this.toolTip.switchVisibility(false);
            }
            this.setValue(inputValue);
        }
    }
}

class deletableAccession extends accessionedInput{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        let obj = this;

        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}


class testCodeInput extends inputControl{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.input.maxLength = 7;
        this.input.placeholder="0080388";
        this.containerDiv.classList.add("test-code-input");
        this.input.type ="number";

    }

    format(value){
        let val = removeLeadingZeros(value);
        if(val<= 0){
            this.toolTip.changeToolTip("Please Enter a test code.");
            this.toolTip.switchVisibility(true);
            this.input.value =0;

        }
        else{
            if(val.length === 7){
                this.setValue(val);
            }
            else{
                if(val.length > 7){
                    this.toolTip.changeToolTip("Too Long For A Test Code!");
                    this.toolTip.switchVisibility(true);
                    this.setValue(this.value);
                    throw new Error("TestCode Too Long");
                }
                this.toolTip.switchVisibility(false);
                let zeros = 7 - val.length;
                this.setValue(addLeadingZeros(val,zeros));
            }
        }
    }



}

class deletableTestCode extends testCodeInput{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        let obj = this;

        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}


class trackingNumberInput extends inputControl{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.input.maxLength = 10;
        this.input.placeholder="0123456789";
        this.containerDiv.classList.add("tracking-number-input");
        this.input.type ="number";

    }

    format(value){
        let val = removeLeadingZeros(value);
        if(val<= 0){
            this.toolTip.changeToolTip("Please Enter a Tracking Number.");
            this.toolTip.switchVisibility(true);
            this.input.value =0;

        }
        else{
            if(val.length === 10){
                this.setValue(val);
            }
            else{
                if(val.length > 10){
                    this.toolTip.changeToolTip("Too Long For A Tracking Number!");
                    this.toolTip.switchVisibility(true);
                    this.setValue(this.value);
                    throw new Error("Tracking Number Too Long");
                }
                this.toolTip.switchVisibility(false);
                let zeros = 10 - val.length;
                this.setValue(addLeadingZeros(val,zeros));
            }
        }
    }



}

class deletableTrackingNumber extends trackingNumberInput{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        let obj = this;

        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}

class numberInput extends inputControl{
    constructor(targets = [],defaultValue = 0){
        super(targets)
        this.hasFormattingRules = true;


        this.containerDiv.classList.add("number-input");
        this.input.type ="number";

    this.setValue(defaultValue)
    this.boundedAbove = false;
    this.upperbound = -1;
    this.boundedBelow = true;
    this.lowerBound = 0;
    }
    format(value){
        let val = parseInt(value);
        let previousValue = this.value;
        // console.log(val);
        if(this.boundedAbove || this.boundedBelow){
            if(val > this.upperbound && this.boundedAbove){
                this.setValue(this.upperbound);
                throw new Error("You cannot go above the upper bound.");
            }
            if(val < this.lowerBound && this.boundedBelow){
                this.setValue(this.lowerBound);
                throw new Error("You cannot go below the lower bound.");
            }
            if(val > previousValue){
                this.up();
            }
            else{
                this.down();
            };
        }
        else{
            this.setValue(val);
            if(val > previousValue){
                this.up();
            }
            else{
                this.down();
            };
        }
    }

    up(){
        console.log("Incrementing Value");
    }
    down(){
        console.log("Decrementing Value;");
    }

}


class deletableNumberInput extends numberInput{
    constructor(targets = []){
        super(targets)
        this.hasFormattingRules = true;

        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        let obj = this;

        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }

}

class dynamicInputList{

        
    constructor(){

        this.inputTargets = [];
        this.doorManTargets = [];
        let passableList = this;
        this.inputList = [];
        this.doorMan = new numberInput();
        this.doorMan.up() = () => {   
            let newInput = new inputControl();
            this.inputList.push(newInput);

        };

        this.doorMan.down() = () =>{
            
            if(this.inputList.length === 0){
                throw new Error("There are no inputs to change");
            }

        }
    }

}