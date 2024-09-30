function collapsableInputControl(name,controlType = inputControl,node = rootNode){

    //Makes a collapsable container.
    let container = new collapsable(node);


        //Container Summary
        container.changeSummary(name);
    //makes collapsables.
    let collapsables = createNcollapsables(2,container.newDetail());

    // IO Summaries
    collapsables[0].changeSummary("Input");
    collapsables[1].changeSummary("Output");


    let i = collapsables[0].newDetail();
    let o = collapsables[1].newDetail();

    let input = inputControlOnNodes(name,i,o,controlType);



    return {container,input}
}

function collapsableDynamicInputList(name, controlType = inputControl, node = rootNode){


    //Makes a collapsable container.
    let container = new collapsable(node);


    //Container Summary
    container.changeSummary(name);
    //makes collapsables.
    let collapsables = createNcollapsables(3,container.newDetail());

    // IO Summaries
    collapsables[0].changeSummary("DoorMan Input");
    collapsables[1].changeSummary("DoorMan Output");


    
    let dO = collapsables[1].newDetail();

    var inputs = new dynamicInputList(controlType);

    collapsables[0].appendToDetails(inputs.doorMan.containerNode());
    inputs.addTarget("List Output",dO);

    return {inputs,container};
}