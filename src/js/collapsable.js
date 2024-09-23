// Collapsables have this format: 
// container  //Container Element -- This is the top level 
// ├── summaryInformation  //This information will  be present  while the menu is not expanded.
// ├── minMaxButton //This will expand or collapse the menu and will always be present.
// │   ├── minimizeButtonIcon
// │   └── maximizeButtonIcon
// ├── details //This will have what ever information you would like
// │   ├── Some Report information
// │   └── Arbitrary action button
// └──
// 
// 


// #AE132A ARUP RED
// To change appearance attributes use the CSS class selectors.
class collapsable{
    //Defaults to document body as DOM node 
    constructor(node = document.body){
        //Container Element -- This is the top level 
        this.container = document.createElement("div"); 

        //Gives the container a class list for css manipulation. 
        this.container.classList.add("collapsable-container");



        //This information will  be present  while the menu is not expanded.
        this.summaryContainer = document.createElement("div");
        this.summaryContainer.classList.add("collapsable-summary");
        
        this.summaryInformation = document.createElement("div");
        this.summaryInformation.classList.add("collapsable-summary-information");
        this.summaryInformation.textContent = "Default Text Content";
        //This will expand or collapse the menu and will always be present.
        this.minMaxButton = document.createElement("button");
        this.minMaxButton.classList.add("collapsable-min-max-button");

        //Button Icons
        this.minimizeButtonIcon = document.createElement("i");
        this.maximizeButtonIcon = document.createElement("i");
        this.minimizeButtonIcon.classList.add("fas", "fa-window-minimize");
        this.maximizeButtonIcon.classList.add("fas", "fa-chevron-down");

        this.minMaxButton.appendChild(this.maximizeButtonIcon);
        this.minMaxButton.appendChild(this.minimizeButtonIcon);







        //This will have what ever information you would like
        this.details = document.createElement("div");
        this.details.classList.add("collapsable-details");


        this.container.appendChild(this.summaryContainer);
        this.summaryContainer.appendChild(this.summaryInformation);
        this.summaryContainer.appendChild(this.minMaxButton);
        this.container.appendChild(this.details);

        this.expanded = true;
        this.changeState();
        let obj = this;

        this.minMaxButton.addEventListener("click", function(){
            obj.changeState();            
        })
        node.appendChild(this.container);
        
    }


    containerNode(){
        return this.container;
    }

    //adds content to the end of a details pane.
    appendToDetails(node){

        let newDetailsContainer = document.createElement("div");
        newDetailsContainer.classList.add("collapsable-detail");
        newDetailsContainer.appendChild(node);
        this.details.appendChild(newDetailsContainer);

    }


    changeSummary(text){
        let returnInfo =this.summaryContainer;
        this.summaryInformation.textContent = text;
        return returnInfo;
    }

    

    changeState() {
        this.expanded = !this.expanded;
    
        if (this.expanded) {
            this.maximizeButtonIcon.style.visibility = 'hidden'; // Hide the maximize icon
            this.minimizeButtonIcon.style.visibility = 'visible'; // Show the minimize icon
    
            this.details.style.display = 'block'; // Show the details
            this.summaryContainer.style.visibility = 'visible';  // Keep the summary visible
        } else {
            this.maximizeButtonIcon.style.visibility = 'visible'; // Show the maximize icon
            this.minimizeButtonIcon.style.visibility = 'hidden'; // Hide the minimize icon
    
            this.details.style.display = 'none'; // Hide the details
            this.summaryContainer.style.visibility = 'visible'; // Keep the summary visible
        }
    }
    
    //removes a detail from some index in a detail pane -- this function returns the element that got deleted.
    removeDetail(index){

        //Basic array error checking...
        let listSize = this.details.childElementCount;
        if(listSize === 0){
            throw new Error("The details are empty");
        }
        if(index>=listSize){
            throw new Error("You cannot access an element that does not exist.");
        }

        //Brings a details list in to the function scope.
        let detailsList = this.details.children;
        //content to remove;
        let deletedElement = detailsList[index];

        //removes it from the dom
        deletedElement.remove();
        //returns the element
        return deletedElement;
    }


     // Array-like behavior
     getDetails() {
        return Array.from(this.details.children);
    }

    // Stack behavior (LIFO)
    pushToDetails(node) {
        this.appendToDetails(node);
    }

    popDetail() {
        if (this.details.childElementCount === 0) {
            throw new Error("No details to pop.");
        }
        return this.removeDetail(this.details.childElementCount - 1);
    }

    // Queue behavior (FIFO)
    enqueueToDetails(node) {
        this.appendToDetails(node);
    }

    dequeueDetail() {
        if (this.details.childElementCount === 0) {
            throw new Error("No details to dequeue.");
        }
        return this.removeDetail(0);
    }


    // Retrieve detail at a specific index
    getDetail(index) {
        let listSize = this.details.childElementCount;
        if (listSize === 0) {
            throw new Error("The details are empty");
        }
        if (index < 0 || index >= listSize) {
            throw new Error("Index out of bounds.");
        }

        return this.details.children[index];
    }

    addDetailList(listOfDetails){

        if (listOfDetails.length === 0){
            throw new Error("You cannot add nothing...");   
        }

        for(var i = 0; i < listOfDetails.length; i++){
            let detail = listOfDetails[i];
            this.appendToDetails(detail.containerNode());
        }
    }

    emptyDetails(){
        let detailsList = this.details.children;
        let count = this.details.childElementCount;

        if(count === 0){
            throw new Error("Already Empty!");
        }
        for(var index = 0; index < count; index++){
            let detail = detailsList[index];
            detail.remove();
        }
        return detailsList;
    }
}