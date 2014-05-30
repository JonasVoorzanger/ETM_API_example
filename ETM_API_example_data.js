// Build Sliders
    // Creates an instance of the Build_Sliders object, as defined in ETM_API_example_functions
    console.log("[Initialization: steps 1-5] \n\n1. Initialize Sliders")
    var Sliders1 = new Build_Sliders({
        SliderHolder: "SliderHolder",
        HolderID: "Sliders",
        LinkedScenario: "Scenario1",
        // At a slider-stop, the following function is exectued
        // The 'Scenario1' needs to match the name of the scenario created with the ETMscenario function below
        // The 'Update_Graphs' function is defined in ETM_API_example_graphs.js
        UpdateFunction: "Scenario1.Update_Scenario(); Update_Graphs(250);", // Updates scenario info and then updates graphs
        SliderData: {
            	households_useful_demand_heat_per_person:   {val: 0,   min: -5,  max: 5,    step: 0.1, unit: "% per year",         show: true, displayname: "Increase heat demand",},
            	households_insulation_level_old_houses:     {val: 0.5, min: 0.5, max: 3,    step: 0.1, unit: "m<sup>2</sup>K/W",   show: true, displayname: "R-value old houses",},
                households_insulation_level_new_houses:     {val: 1.8, min: 1.8, max: 3,    step: 0.1, unit: "m<sup>2</sup>K/W",   show: true, displayname: "R-value new houses",  },             
                households_number_of_old_houses:            {val: 5.7, min: 0,   max: 5.7,  step: 0.1, unit: "million",            show: true, displayname: "Number of old houses",},
            	households_number_of_new_houses:            {val: 1.6, min: 0,   max: 16.4, step: 0.1, unit: "million",            show: true, displayname: "Number of new houses",},
            },
    });
    
// Create new scenario
    // Creates an instance of the ETMscenario object, as defined in ETM_API_example_functions
    console.log("2. Send Initialization settings")
    var Scenario1 = new ETMscenario({
    	Scenario_Name: "House of the Future",
    	End_Year: 2030,
        
        // For these inputs the values of the coresponding sliders are used to update the scenario
        Inputs: [
                "households_insulation_level_new_houses",
                "households_insulation_level_old_houses",
                "households_useful_demand_heat_per_person",
                "households_number_of_old_houses",
                "households_number_of_new_houses",
            ],

        // These Gqueries are sent to the ETM scenario
        // For ease of handling, the resulting specific datapoints are given names
        Gqueries: [
                // CO2 emissions
                {Gquery: "primary_co2_emission_of_households",  Name: "CO2_Houses", Unit: "Mt"},
                {Gquery: "total_co2_emissions",                 Name: "CO2_NL",     Unit: "kg"},

                // Primary Energy Demand households
                {Gquery: "bio_fuels_households_in_mekko_of_primary_demand",                 Name: "E_Houses_Biofuels",   Unit: "PJ"},
                {Gquery: "biomass_households_in_mekko_of_primary_demand",                   Name: "E_Houses_Biomass",    Unit: "PJ"},
                {Gquery: "coal_households_in_mekko_of_primary_demand",                      Name: "E_Houses_Coal",       Unit: "PJ"},
                {Gquery: "gas_households_in_mekko_of_primary_demand",                       Name: "E_Houses_Gas",        Unit: "PJ"},
                {Gquery: "greengas_households_in_mekko_of_primary_demand",                  Name: "E_Houses_Biogas",     Unit: "PJ"},
                {Gquery: "imported_electricity_households_in_mekko_of_primary_demand",      Name: "E_Houses_ElecImport", Unit: "PJ"},
                {Gquery: "lignite_households_in_mekko_of_primary_demand",                   Name: "E_Houses_Lignite",    Unit: "PJ"},
                {Gquery: "oil_households_in_mekko_of_primary_demand",                       Name: "E_Houses_Oil",        Unit: "PJ"},
                {Gquery: "sustainable_electricity_households_in_mekko_of_primary_demand",   Name: "E_Houses_ElecRenew",  Unit: "PJ"},
                {Gquery: "uranium_households_in_mekko_of_primary_demand",                   Name: "E_Houses_Uranium",    Unit: "PJ"},
                {Gquery: "waste_households_in_mekko_of_primary_demand",                     Name: "E_Houses_Waste",      Unit: "PJ"},
                
                // Warmtevraag Huishoudens
                {Gquery: "heat_demand_including_electric_heating_in_effect_of_insulation_in_households",    Name: "Houses_Heat_Demand_Total",    Unit: "PJ"},
                {Gquery: "insulation_savings_old_houses_in_effect_of_insulation_in_households",             Name: "Houses_Heat_Reduction_Old",   Unit: "PJ"},
                {Gquery: "insulation_savings_new_houses_in_effect_of_insulation_in_households",             Name: "Houses_Heat_Reduction_New",   Unit: "PJ"},
                {Gquery: "households_old_houses_useful_demand_for_heating",                                 Name: "Houses_Heat_Demand_Old",      Unit: "MJ"},
                {Gquery: "households_new_houses_useful_demand_for_heating",                                 Name: "Houses_Heat_Demand_New",      Unit: "MJ"},
            ],
    });

Scenario1.Update_Scenario();