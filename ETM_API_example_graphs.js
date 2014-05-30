// In Sublime text, the command 'Fold Level 2' will neatly 
// fold all the code below into the relevant subcommands
// (works best after 'Unfold All')

// The code below builds three graphs:
//   * The primary energy consumption of households
//   * The final heat demand of households
//   * The CO2 emissions of households and total emissions
// To build and update these graphs, there are four steps:
//   1. Definitions of constants and functions
//   2. Initialize data series
//   3. Initialize graphs
//   4. Update graphs

// [1] Constants and functions
    // Contstants
        var scenario_choice = "Scenario1"; 
            // needs to match the name of the
            // scenario created by the ETMscenario function 
        var BILLIONS = 1000000000;
        var col = {
            heat_new: "rgb(192,67,60)",
            heat_old: "rgb(45,62,77)",
            prim_renew: "rgb(110,164,90)",
            prim_other: "rgb(164,164,164)",
            prim_coal: "rgb(25,25,25)",
            prim_gas: "rgb(59,108,157)",
            CO2_houses: "rgb(64,38,69)",
            CO2_NL: "rgb(131,81,140)",
        }
    // Functions
        // Used to return the dataset from the selected scenario
        var dataset = function(scenario){
            return eval(scenario).Data;}
        // Used to get the present value of a Gquery
        var present = function(name,factor,scenario){
            return Math.round(dataset(scenario)[name].present/factor)};
        // Used to get the future value of a Gquery    
        var future = function(name,factor,scenario){
            return Math.round(dataset(scenario)[name].future/factor)};
        // Used to build datasets
        var DataSet = function(scenario, name_object){
            // console.log("running Dataset...");
            var present_value = 0;
            var future_value = 0;
            // console.log(name_object);
            for (var key in name_object){
                var name = key;
                var factor = name_object[key];
                // console.log("name: ",name, " factor: ",factor);
                present_value += present(name, factor, scenario);
                future_value += future(name, factor, scenario);
            }
            return [present_value, future_value];
        };

// [2] Initialize data series
    // The Highcharts libary used to make the graphs, requires series
    // to have the following information:
    // - a color
    // - a name
    // - a dataset
    // For the graphs used in this example, all datasets consist of 2 values,
    // a present value and a future value. These datasets are constructed
    // using the functing DataSet, defined above
    // The names of the Gqueries have to match the names given in the 
    // ETM_API_example_Data.js-file

    // The final heat demand of households [HeatSeries]
        var HeatSeries = function(scenario){
            return [{
                        color: col.heat_new,
                        name: 'New houses',
                        data: DataSet(scenario, {
                            "Houses_Heat_Demand_New": BILLIONS,
                            "Houses_Heat_Reduction_New": -1
                        })
                    }, {
                        color: col.heat_old,
                        name: 'Old houses',
                        data: DataSet(scenario, {
                            "Houses_Heat_Demand_Old": BILLIONS,
                            "Houses_Heat_Reduction_Old": -1
                        }) 
                    }];
        };
    // The primary energy consumption of households [PrimarySeries]
        var PrimarySeries = function(scenario){
            return [{
                        color: col.prim_renew,
                        name: 'Renewable energy',
                        data: DataSet(scenario, {
                            "E_Houses_Biofuels": 1,
                            "E_Houses_Biomass": 1,
                            "E_Houses_Biogas": 1,
                            "E_Houses_ElecRenew": 1,
                        })
                    },
                    {
                        color: col.prim_other,
                        name: 'Other',
                        data: DataSet(scenario, {
                            "E_Houses_ElecImport": 1,
                            "E_Houses_Lignite": 1,
                            "E_Houses_Oil": 1,
                            "E_Houses_Uranium": 1,
                            "E_Houses_Waste": 1,
                        })
                    },
                    {
                        color: col.prim_coal,
                        name: 'Coal',
                        data: DataSet(scenario, {"E_Houses_Coal": 1}) 
                    },
                    {
                        color: col.prim_gas,
                        name: 'Gas',
                        data: DataSet(scenario, {"E_Houses_Gas": 1})
                    }
                    ];            
        };        
    // The CO2 emissions of households and total emissions [CO2Series]
        var CO2Series = function(scenario){
            return [{
                        color: col.CO2_NL,
                        name: 'The Netherlands',
                        visible:false,
                        data: DataSet(scenario, {"CO2_NL": BILLIONS})
                    },
                    {
                        color: col.CO2_houses,
                        name: 'Households',
                        data: DataSet(scenario, {"CO2_Houses": 1})
                    }
                    ];
        };

// [3] Initialize charts
    console.log("5. Initialize graphics");
    // Heat demand chart
        $('#Heat_chart').highcharts({
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Gill Sans',
                },
            },
            title: {
                text: 'Heat demand households'
            },
            xAxis: {
                categories: ['2011', '2030']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Heat demand (PJ)'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor)
                                 || 'gray'
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +' PJ<br/>'+
                        'Total: '+ this.point.stackTotal +' PJ';
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme 
                            && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            },
            series: HeatSeries(scenario_choice),
        });
    // Primary energy demand charts
        $('#Primary_chart').highcharts({
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Gill Sans',
                },
            },
            title: {
                text: 'Primary energy households'
            },
            xAxis: {
                categories: ['2011', '2030']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Primary energy (PJ)'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme 
                            && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +' PJ<br/>'+
                        'Total: '+ this.point.stackTotal +' PJ';
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme 
                            && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            },
            series: PrimarySeries(scenario_choice),
        });
    // CO2 emissions charts
        $('#CO2_chart').highcharts({
                    chart: {
                        type: 'column',
                        style: {
                            fontFamily: 'Gill Sans',
                        },
                    },
                    title: {
                        text: 'CO2 emissions'
                    },
                    xAxis: {
                        categories: ['2011', '2030']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'CO<sub>2</sub> emissions (Mt)'
                        },
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.x +'</b><br/>'+
                                this.series.name +': '+ this.y +' Mt';
                        }
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                style:{
                                    fontWeight: 'bold',
                                },
                                enabled: true,
                                color: 'gray',
                            }
                        }
                    },
                    series: CO2Series(scenario_choice),
                });
    
// [4] Update grahps
    // Create handles for the different charts
        var Heat_chart = $('#Heat_chart').highcharts();
        var CO2_chart = $('#CO2_chart').highcharts();
        var Primary_chart = $('#Primary_chart').highcharts();
    // Series updater
        // For the selected chart, data is update with chartdata
        // The transition time is set to transtime
        var seriesupdater = function(chart, chartdata, transtime){
            for (var i = 0; i < chartdata.length; i++) {
                var dataset = chartdata[i].data;
                chart.series[i].setData(dataset,true,transtime);
            };
        }
    // Update functions
        var updategraphQ = true
        var Update_Graphs = function(transtime){
            console.log("11. Update graphics");
            if (updategraphQ) {
                updategraphQ = false;
                setTimeout(function(){
                    seriesupdater(Heat_chart, HeatSeries(scenario_choice),transtime);
                    seriesupdater(CO2_chart, CO2Series(scenario_choice),transtime);
                    seriesupdater(Primary_chart, PrimarySeries(scenario_choice),transtime);
                    // Update-statements for other graphs can be added here
                    updategraphQ = true;
                },50)
            };
        }

