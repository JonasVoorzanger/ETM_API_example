// In Sublime text, the command 'Fold Level 2' will neatly 
// fold all the code below into the relevant subcommands
// (works best after 'Unfold All')

var ETMscenario = function(opts){
    // Default Option values
        // Sets the default options for this object
        this.defaultopts = {
            Scenario_Name: "ETMscenario",
            End_Year: 2050,
            Inputs: [
                    "households_insulation_level_new_houses",
                    "households_insulation_level_old_houses",
                ],
            Gqueries: [
                    {Gquery: "gas_households_in_mekko_of_primary_demand", Name: "Gasverbruik"},
                    {Gquery: "coal_households_in_mekko_of_primary_demand", Name: "Kolenverbruik"},
                ],
            Graphs: ["Warmtevraag"],
            Check4Challenge: true,
            ChallengeQuestionNumber: 90,
            Achievement_Holder: "Achievement_Holder",
            ChallengeName: "Level5",
        };
        // Takes the options and optionvalues from the 'opts'-hash and 
        // overwrites the corresponding values in 'defaultopts'
        for (var i = 0; i < Object.keys(opts).length; i++) {
            this.defaultopts[Object.keys(opts)[i]] = opts[Object.keys(opts)[i]]
        };
        // Stores defaultopts in the variable 'options' for easy access
        var options = this.defaultopts;
    // Initialize scenario
        this.Initialize_Scenario = function(){
            var parent_this = this;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST","http://beta.et-engine.com/api/v3/scenarios",false);
            var params = '{"scenario": {"title": "'+options.Scenario_Name+'", "end_year": "'+options.End_Year+'"}}';
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(params);
            var output = xmlhttp.responseText;
            // Stores the scenario ID of the created scenario
            parent_this.Initialize_Output = JSON.parse(output)
            parent_this.Scenario_ID = parent_this.Initialize_Output["id"];         
        };
    // Update inputs values from sliders
        this.Input_Settings = {};
        this.Update_Inputs_From_Sliders = function(){
            var parent_this = this;
            for (var i = 0; i < options.Inputs.length; i++) {
                parent_this.Input_Settings[options.Inputs[i]] = $("#Slider_"+options.Inputs[i]).slider("value"); 
            };
            // console.log(parent_this.Input_Settings);
        };
    // Update inputs
        this.Update_Inputs = function(){
            var parent_this = this;
            var ID = parent_this.Scenario_ID;    
            var InputsJSON = JSON.stringify(parent_this.Input_Settings)
            var InputsParams = '{"scenario": {"user_values": ' + InputsJSON + '},"detailed": true, "autobalance": true }';      
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("PUT","http://beta.et-engine.com/api/v3/scenarios/"+ID,false);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(InputsParams);
            parent_this.Update_Output = xmlhttp.responseText;
            // console.log(parent_this.Update_Output);
        };     
    // Gqueries
        // Creates a list of all the Gqueries
            this.GqueriesList = [];
            for (var i = 0; i < options.Gqueries.length; i++) {
                this.GqueriesList.push(options.Gqueries[i].Gquery)
            };
        // Creates a list of Gquery names. These names are used in the Data-object
        // to enable easy name-giving by the user
            this.GqueriesNames = [];
            for (var i = 0; i < options.Gqueries.length; i++) {
                this.GqueriesNames.push(options.Gqueries[i].Name)
            }; 
        // Data
            this.Data = {};  
        // This function takes all Gqueries from the GqueriesList and stores the output
        // in the Data object with the following name: this.Data.NAME.Present/Future
        this.Update_Gqueries = function(){
            console.log("3./9. Send Gqueries");
            var parent_this = this;
            var ID = parent_this.Scenario_ID;        
            var GqueriesJSON = JSON.stringify(parent_this.GqueriesList);
            var GqueriesParams = '{"gqueries": ' + GqueriesJSON + '}';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("PUT","http://beta.et-engine.com/api/v3/scenarios/"+ID,false);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(GqueriesParams);
            var output = xmlhttp.responseText;
            console.log("4./10. Receive specific scenario values")
            var gqueries = JSON.parse(output)["gqueries"];
            var present = [];
            var future = [];
            var keys = [];
            for (var i = 0; i < parent_this.GqueriesList.length; i++) {
                var Gquery = parent_this.GqueriesList[i];
                var name = parent_this.GqueriesNames[i];
                var present = gqueries[Gquery].present;
                var future = gqueries[Gquery].future;
                parent_this.Data[name] = {"present": present, "future": future};
            };
        };
    // Update Scenario
        // variable to help initializing on first load
        this.InitializeQ = true;
        this.Update_Scenario = function(){
            var parent_this = this
            // First time updating: initialize scenario
            if (parent_this.InitializeQ) {parent_this.InitializeQ = false; parent_this.Initialize_Scenario()} 
            else {console.log("7. Update inputs from sliders");console.log("8. Send inputs to scenario")};
            // Standard update loop
            parent_this.Update_Inputs_From_Sliders();
            parent_this.Update_Inputs();
            parent_this.Update_Gqueries();
        };
    // Link to ETM
        // This functions opens the current scenario in the Energy Transition Model
        this.Link_2_ETM = function(){
            parent_this = this;
            var ETM_URL = "http://beta.pro.et-model.com/scenarios/"+parent_this.Scenario_ID;
            console.log(ETM_URL);
            var win = window.open(ETM_URL, '_blank');
        };
};

var Build_Sliders = function(opts){
    // Default Option values
        // Sets the default options for this object
        // These values are overwritten by the 'opts'-object that is passed to this function
        this.defaultopts = {
            SliderHolder: "SliderHolder",
            HolderID: "Sliders",
            UpdateFunction: "console.log('SliderStop')",
            LinkedScenario: "Scenario1",
            SliderData: {
                households_insulation_level_new_houses:  {val: 0.5, min: 0.5, max: 3, step: 0.1, unit: "R",  show: true, displayname: "Isolatie nieuwe huizen",  },
                households_insulation_level_old_houses: {val: 0.5, min: 0.5, max: 3, step: 0.1, unit: "R",  show: true, displayname: "Isolatie oude huizen",},
            },
        };
        // Takes the options and optionvalues from the 'opts'-hash and 
        // overwrites the corresponding values in 'defaultopts'
        for (var i = 0; i < Object.keys(opts).length; i++) {
            this.defaultopts[Object.keys(opts)[i]] = opts[Object.keys(opts)[i]]
        };
        // Stores defaultopts in the variable 'options' for easy access
        var options = this.defaultopts;
        var HolderID = options.HolderID;
        this.SliderData = options.SliderData;        
    // Append Slider-table
        this.Slider_Holder = d3.select("#"+options.SliderHolder);
        this.Slider_Table = this.Slider_Holder.append("table")
                                .attr("id","Slider_Table_"+HolderID)
                                .attr("class","slider_table")
    // Append Slider function
        // Append a row with name, slider, value and unit to the table of sliders
        this.SliderAppend = function(key){
            var row = this.Slider_Table.append("tr").attr("id","SliderRow_" + key);
            row.append("td").attr("class",HolderID+"_Slider_Name").html(this.SliderData[key].displayname);
            row.append("td").attr("class",HolderID+"_Slider_Slider").html("<div class='slider' id='Slider_"+key+"'></div>");
            row.append("td").attr("class",HolderID+"_Slider_Value Slider_Value").attr("id","Slider_"+key+"_value").html(Math.round(10*this.SliderData[key].val)/10);
            row.append("td").attr("class",HolderID+"_Slider_Unit").html(this.SliderData[key].unit);
        };
    // Initialize slider
        // Sliders initializeren-functie
        this.SliderInitialize = function(key){
            var SliderData = this.SliderData;
            var parent_this = this;
            $( "#Slider_"+key ).slider({
                min: SliderData[key].min,
                max: SliderData[key].max,
                value: SliderData[key].val,
                step: SliderData[key].step,
                slide: function( event, ui ) {
                    $("#Slider_"+key+"_value").html(Math.round(10 * ui.value)/10);
                    parent_this.SliderData[key].val = ui.value;
                    },
                stop: function(event, ui){
                    console.log("\n[Update loop: steps 6-11] \n\n6. Moved a slider")
                    eval(options.UpdateFunction);
                    },
            });
        };        
    // Build Sliders
        // For all keys in SliderData a Sliderrow is appended, using the SliderAppend
            this.SliderDataKeys = Object.keys(this.SliderData);
            for (var i = 0; i < this.SliderDataKeys.length; i++) {
                this.SliderAppend(this.SliderDataKeys[i]);
                this.SliderInitialize(this.SliderDataKeys[i]);
                };                
    // Reset Slidersvalues
        this.StartValues = {};
        for (var i = 0; i < this.SliderDataKeys.length; i++) {
            var key = this.SliderDataKeys[i];
            this.StartValues[key] = this.SliderData[key].val;
        };
        this.Reset_Sliders = function(){
            var parent_this = this;
            for (var i = 0; i < parent_this.SliderDataKeys.length; i++) {
                // Sets key as the id of the slider
                var key = parent_this.SliderDataKeys[i];
                var val = parent_this.StartValues[key];
                // sets de SliderData of the key to be equal to the startvalue
                parent_this.SliderData[key] = val;
                // Sets the slidervalue equal to the Sliderdata value
                $( "#Slider_"+key ).slider("value",val);
                $( "#Slider_"+key+"_value").html(Math.round(10 * val)/10);                
            };            
            eval(options.UpdateFunction);
        }
        this.Reset_Button = this.Slider_Holder.append("button").attr("id","ResetIsolatieSliders").html("Reset sliders");
        // Connect Reset-buttong to the Slider-update function
        $("#ResetIsolatieSliders").click(function(){
            Sliders1.Reset_Sliders();
        });
    // Open ETM scenario-button
        this.ETM_Button = this.Slider_Holder.append("button").attr("id","Link2ETM_Button").html("Open ETM scenario");
        // Connect Reset-button to the Slider-update function
        $("#Link2ETM_Button").click(function(){
            eval(options.LinkedScenario + ".Link_2_ETM()");
        });                     
}
