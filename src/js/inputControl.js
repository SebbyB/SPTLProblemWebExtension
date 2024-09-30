
function removeLeadingZeros(value) {
    // Use regex to remove leading zeros but keep a single "0" if the input is just zeros
    return value.replace(/^0+(?!$)/, '');
}

function addLeadingZeros(value, n) {
    // Convert value to string and pad it with leading zeros
    return value.toString().padStart(n + value.length, '0');
}

var debugTargets = false;
var debugRunnables = false;


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
                if(target.doUpdate){
                    //output object for debugging.
                    if(debugTargets){
                    let out = {
                        changed :changed,
                        target : target,
                        this : this
                    };
                    console.log("TargetUpdate: ", out);
                }
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


//Runnables work with targets.
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


//Targets have a list of runnables and objects that work on some node.
class target{
    constructor(node = null, objects = []){
        this.name = ''; //Gives the target a name. This will make lists of targets easier to deal with when there are a lot of them.
        this.runnables = []; //List of runnables.
        this.targetNode = node;//Parent node of the target.
        this.doUpdate = true; //Targets update by default
        this.objects = objects; //List of objects.
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

                    if(debugRunnables){
                    //output object for debugging.
                    let out = {
                        changed :changed,
                        runnable : runnable,
                        this : this
                    };
                    console.log("RunnableUpdate: ", out);
                }
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
        //ToolTips are contained in a span element.
        this.node = document.createElement("span");
        this.node.classList.add("tooltip");
        this.node.textContent = "Sorry, you can't enter numbers in this format";

        //Switches to be false by default.
        this.switchVisibility(false);

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



            //Tracks the completeness of the inputControl so you can use it in formatting or updating targets. 
            this.isComplete = false;
            

            this.targets = targets;
            //If there aren't any targets than the input control does not have targets.
            if(this.targets.length === 0){
            this.hasTarget = false;
            }
            else{
                this.hasTarget = true;
            }
            

            this.deleteables = [];
            //Keeps track of an input value.
            this.value;

            //Creates a container with an input element.
            this.containerDiv =  document.createElement("div");
            this.input = document.createElement("input");
            this.containerDiv.appendChild(this.input);
             
            //Keeps track of whether or not the input control has formatting.
            this.hasFormattingRules = false;


            //Passable object for the event listener.
            let obj = this;
            
            //When the input is updated:
            this.input.addEventListener("input", function(e){
                
                //If the input has formatting:
                if(obj.hasFormattingRules){
                    //Format
                    obj.format(e.target.value);
                }
                //Otherwise set the value to whatever the input's value is.
                else{
                    obj.setValue(e.target.value);
                }

            });

            //Creates a tooltip and adds it to the container.
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
    
            this.deleteables.forEach(deleteable => {
                deleteable.doRun = true;
                deleteable.func();
            });

            this.setValue('');
            returnValue.remove();
            // updateTargets(this.targets);
            return returnValue;
        }

        //formatting rules -- there are none for this abstract class by default. These can be added at run time.
        format(value){
            
            this.toolTip.changeToolTip("This input does not have formatting!");
            this.toolTip.switchVisibility();
            console.log("This input does not have formatting!");
            this.setValue(value);
            return false;
        }

        //Gets value.
        getValue(){
            //Returns it.
            return this.value;
        }

        //Sets the value of whatever input we're using.
        setValue(value){

            //Keeps track of the previous value if we want it.
            let previousValue = this.value;

            //Changes the value of the input and object value.
            this.value = value;
            this.input.value = this.value;

            //Updates the targets if applicable.
            if(this.targets.length > 0){
              updateTargets(this.targets);
            }

            //Returns the previous value.
            return previousValue;
        }


        addTarget(name,outputNode){
            
         let outTarget = new target(outputNode);
        this.targets.push(outTarget);
        
        outTarget.name = name;
        outTarget.objects.push(this.input);


        //runnable for updating output
        let updateOutput = new runnable("update",true);
        outTarget.runnables.push(updateOutput);
        
        updateOutput.obj = this;
        updateOutput.func = function() {
            this.node.innerText = this.obj.getValue();
        }.bind(updateOutput);
        updateOutput.node = outTarget.targetNode;
        

        //runnable for removing the target
        let removeRunnable = new runnable("remove",false,() =>{
            outputNode.remove();
        })
        removeRunnable.node = outputNode;
        
        outTarget.runnables.push(removeRunnable);
        this.deleteables.push(removeRunnable);
        }
}

//This is a very specific type of input control that will be reused a lot, so it gets its own class.
class accessionedInput extends inputControl{

    constructor(targets = []){
        //An accessioned input is just an input control.
        super(targets)
        //It has formatting.
        this.hasFormattingRules = true;

        //Sets up the input's HTML formatting options.
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

        //For formatting.
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
        } 
        //If the value is of the format 12-123-123456a:
        else {
            //If it is complete update the field.
            if(inputValue.length >= 13){
                this.isComplete = true;
            }
            else{
                this.isComplete = false;
            }

            //If it is complete the tooltip visibility can be off.
            if(this.isComplete){
                this.toolTip.switchVisibility(false);
            }

            //If it is in the propper format, finally, it should set the object's value.
            this.setValue(inputValue);
        }
    }
}


//User Deleteable Accessioned input.
class deletableAccession extends accessionedInput{

    constructor(targets = []){
        //It is an accessioned input.
        super(targets)
        this.hasFormattingRules = true;

        //Makes a delete button.
        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        //It was easier to just remove the tool tip and add it back.
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        //passable object.
        let obj = this;

        //If the button is clicked it deletes the input.
        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}

//This is a very specific type of input control that will be reused a lot, so it gets its own class.
class testCodeInput extends inputControl{
    constructor(targets = []){
        //A Test Code input is just an input control.
        super(targets)
        this.hasFormattingRules = true;

        //Sets up the input's HTML formatting options.
        this.input.maxLength = 7;
        this.input.placeholder="0080388";
        this.containerDiv.classList.add("test-code-input");
        this.input.type ="number";

    }

    format(value){
        //Removes the leading zeros from the value for ease of use.
        let val = removeLeadingZeros(value);
        //Test codes are bound below by 0. Tool Tip rules work accordingly.
        if(val<= 0){
            this.toolTip.changeToolTip("Please Enter a test code.");
            this.toolTip.switchVisibility(true);
            this.input.value =0;
        }
        //If the value is positive.
        else{
            //Only allow a length of 7.
            if(val.length === 7){
                this.setValue(val);
            }
            else{
                //If the user tries to keep going after the input is full it will update the tooltip.
                if(val.length > 7){
                    this.toolTip.changeToolTip("Too Long For A Test Code!");
                    this.toolTip.switchVisibility(true);
                    this.setValue(this.value);
                    throw new Error("TestCode Too Long");
                }
                //If nothing is wrong there shouldn't be a tooltip.
                this.toolTip.switchVisibility(false);
                //How many zeros do we add?
                let zeros = 7 - val.length;
                //Adds the zeros back and sets the value.
                this.setValue(addLeadingZeros(val,zeros));
            }
        }
    }
}

//User Deleteable Test Code input.
class deletableTestCode extends testCodeInput{
    constructor(targets = []){
        //It is a test code input.
        super(targets)
        this.hasFormattingRules = true;

        //Makes a delete button.
        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        //It was easier to just remove the tool tip and add it back.
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        //passable object.
        let obj = this;

        //If the button is clicked it deletes the input.
        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}

//This is a very specific type of input control that will be reused a lot, so it gets its own class.
class trackingNumberInput extends inputControl{
    constructor(targets = []){
        //A Tracking Numver input is just an input control.
        super(targets)
        this.hasFormattingRules = true;

        //Sets up the input's HTML formatting options.
        this.input.maxLength = 10;
        this.input.placeholder="0123456789";
        this.containerDiv.classList.add("tracking-number-input");
        this.input.type ="number";

    }

    format(value){
        //Removes the leading zeros from the value for ease of use.
        let val = removeLeadingZeros(value);
        //Tracking Numvers are bound below by 0. Tool Tip rules work accordingly.
        if(val<= 0){
            this.toolTip.changeToolTip("Please Enter a test code.");
            this.toolTip.switchVisibility(true);
            this.input.value =0;
        }
        //If the value is positive.
        else{
            //Only allow a length of 10.
            if(val.length === 10){
                this.setValue(val);
            }
            else{
                //If the user tries to keep going after the input is full it will update the tooltip.
                if(val.length > 10){
                    this.toolTip.changeToolTip("Too Long For A Tracking Number!");
                    this.toolTip.switchVisibility(true);
                    this.setValue(this.value);
                    throw new Error("Tracking Numver Too Long");
                }
                //If nothing is wrong there shouldn't be a tooltip.
                this.toolTip.switchVisibility(false);
                //How many zeros do we add?
                let zeros = 10 - val.length;
                //Adds the zeros back and sets the value.
                this.setValue(addLeadingZeros(val,zeros));
            }
        }
    }



}

//User Deleteable Tracking Number input.
class deletableTrackingNumber extends trackingNumberInput{
    constructor(targets = []){
        //It is a Tracking Number input.
        super(targets)
        this.hasFormattingRules = true;

        //Makes a delete button.
        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        //It was easier to just remove the tool tip and add it back.
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        //passable object.
        let obj = this;

        //If the button is clicked it deletes the input.
        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}


//Numbered Input Control - It has its own behavior.
class numberInput extends inputControl{
    //Takes in a default value.
    constructor(targets = [],defaultValue = 0){

        //It is pretty much just a normal input control with formatting rules.
        super(targets)
        this.hasFormattingRules = true;

        //HTML and CSS options.
        this.containerDiv.classList.add("number-input");
        this.input.type ="number";

        //Sets the default value.
        this.setValue(defaultValue)

        //Keeps track of an upper and lower bound for the input.
        this.boundedAbove = false;
        this.upperbound = 1;
        this.boundedBelow = true;
        this.lowerBound = 0;
    }

    format(value){
        //It will always be a number.
        let val = parseInt(value);
        //Keeps track of the previous value.
        let previousValue = this.value;

        //If the input is bounded above or below follow the rules.
        if(this.boundedAbove || this.boundedBelow){

            //If the value is greater than the upper bound:
            if(val > this.upperbound && this.boundedAbove){
                //Set the value to the upper bound, change the tooltip and throw an error.
                this.setValue(this.upperbound);
                this.toolTip.changeToolTip("You cannot go above the upper bound.");
                this.toolTip.switchVisibility(true);
                throw new Error("You cannot go above the upper bound.");
            }

            //If the value is less than the lower bound:
            if(val < this.lowerBound && this.boundedBelow){
                //Set the value to the lower bound, change the tooltip and throw an error.
                this.setValue(this.lowerBound);
                this.toolTip.changeToolTip("You cannot go below the lower bound.");
                this.toolTip.switchVisibility(true);
                throw new Error("You cannot go below the lower bound.");
            }
        
            //If there are no errors sets the value and makes sure there is no visible tooltip.
            this.setValue(val);
            this.toolTip.switchVisibility(false);

            //If the new value is greater run the up function.
            if(val > previousValue){
                for(var i = 0; i < val - previousValue; i++){
                this.up();
                }
            }
            //otherwise run the down function.
            else{
                for(var i = 0; i < previousValue - val; i++){
                    this.down();
                    }
            }
        }
        //if there is no bounding just set the value.
        else{
            this.setValue(val);
            //If the new value is greater run the up function.
            if(val > previousValue){
                this.up();
            }
            //otherwise run the down function.
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

//User Deleteable Number input.
class deletableNumberInput extends numberInput{
    constructor(targets = []){
        //It is a Number input.
        super(targets)
        this.hasFormattingRules = true;

        //Makes a delete button.
        this.deleteButton = document.createElement("button");
        this.deleteButton.classList.add("removeAccession");
        this.deleteIcon = document.createElement("i");
        this.deleteIcon.classList.add("fas","fa-times");
        this.deleteButton.appendChild(this.deleteIcon);
        
        //It was easier to just remove the tool tip and add it back.
        let tmp = this.containerDiv.lastChild;
        tmp.remove();
        this.containerDiv.appendChild(this.deleteButton);
        this.containerDiv.appendChild(tmp);

        //passable object.
        let obj = this;

        //If the button is clicked it deletes the input.
        this.deleteButton.addEventListener("click", function(){
            obj.remove();
        });
    }
}



function inputControlOnNodes(name,inputNode = null, outputNode = null, controlType = inputControl){
        //Makes an input control
        let input = new controlType();

        //output
        let outTarget = new target(outputNode);
        input.targets.push(outTarget);

        outTarget.name = name;
        outTarget.objects.push(input);


        //runnable for updating output
        let updateOutput = new runnable("update",true);
        outTarget.runnables.push(updateOutput);
        
        updateOutput.obj = input;
        updateOutput.func = function() {
            this.node.innerText = this.obj.getValue();
        }.bind(updateOutput);
        updateOutput.node = outTarget.targetNode;
        

//This does not work
        //runnable for removing the target
        let removeRunnable = new runnable("remove",false,() =>{
            this.node.remove();
        })
        removeRunnable.node = outputNode;
        outTarget.runnables.push(removeRunnable);

        inputNode.appendChild(input.containerNode());
        return input;
}



class dynamicInputList{

        
    constructor(inputType){
        this.deleteables = [];
        this.inputTargets = [];
        this.doorManTargets = [];
        let passableList = this;
        this.inputList = [];
        this.doorMan = new numberInput();
        this.listSize = 0;
        this.doorMan.up = () => {   
            let newInput = new inputType();
            passableList.inputList.push(newInput);

            let deletable = new runnable("change-list-values",false,()=>{
                passableList.remove(newInput);
            })
            passableList.listSize = passableList.listSize + 1;

            newInput.targets.push(deletable);
            // newInput.deletables.push(deletable);
            // passableList.addTarget("inputControl",newInput.containerNode());
            updateTargets(passableList.inputTargets);

        };
        

        this.doorMan.down = () =>{
            
            if(this.inputList.length === 0){
                throw new Error("There are no inputs to change");
            }

            let deleted = this.inputList.pop(); 
            deleted.remove();

            
            if(this.inputTargets.length > 0){
                updateTargets(this.inputTargets);
            }
            passableList.listSize = passableList.listSize - 1;

        }
    }


    remove(item){
        
        let tmpList = this.inputList;

        this.inputList = tmpList.filter(input => {input === item});
        passableList.listSize = passableList.listSize - 1;

        this.doorMan.setValue(passableList.listSize);

    }


    addTarget(name,outputNode){
            
        let outTarget = new target(outputNode);
       this.inputTargets.push(outTarget);
       
       outTarget.name = name;
       outTarget.objects = this.inputList;


       //runnable for updating output
       let updateOutput = new runnable("update",true);
       outTarget.runnables.push(updateOutput);
       
       updateOutput.obj = this;
       updateOutput.func = function() {
           this.obj.inputList.forEach(input => {

            outputNode.appendChild(input.containerNode());
           });
       }.bind(updateOutput);
       updateOutput.node = outTarget.targetNode;
       

       //runnable for removing the target
       let removeRunnable = new runnable("remove",false,() =>{
            this.obj.inputList = this.obj.inputList.filter(input => input === this.obj);
            this.obj.doorMan.setValue(this.obj.inputList.length);
           outputNode.remove();
       })
       removeRunnable.node = outputNode;
       
       outTarget.runnables.push(removeRunnable);
       this.deleteables.push(removeRunnable);
       }
}