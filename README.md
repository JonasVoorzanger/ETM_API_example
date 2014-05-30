ETM_API_example
===============

*All the code required to use the API of the Energy Transition Model (ETM) within an external web application*

This repository contains all the code required to build a simple interactive example with the ETM API, as can be seen in this live [example](http://energietransitie.info/ETM_API_example.html). A graphical overview of what the code does is shown in this [PDF file](http://energietransitie.info/ETM_API_overview.pdf). 

This repository contains the following files:

* **[ETM_API_example.html](https://github.com/JonasVoorzanger/ETM_API_example/blob/master/ETM_API_example.html)**. The html file where all external code is loaded and that contains holders for the charts and sliders.
* **[ETM_API_example_style.css](https://github.com/JonasVoorzanger/ETM_API_example/blob/master/ETM_API_example_style.css)**. The stylesheet used to make the page look pretty. Some of the jQuery UI styling elements are essential.
* **[ETM_API_example_functions.js](https://github.com/JonasVoorzanger/ETM_API_example/blob/master/ETM_API_example_functions.js)**. The script file that contains the main objects that construct the scenario and the sliders.
* **[ETM_API_example_data.js](https://github.com/JonasVoorzanger/ETM_API_example/blob/master/ETM_API_example_data.js)**. The script file where instances of the scenario and the sliders are built. This is also where options are given.
* **[ETM_API_example_graphs.js](https://github.com/JonasVoorzanger/ETM_API_example/blob/master/ETM_API_example_graphs.js)**. The script file that constructs the highcharts charts.
