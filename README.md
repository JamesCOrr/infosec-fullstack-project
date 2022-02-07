# Fullstack evaluation template

## How to use
The files included in this repository are here to get you started by giving
you an idea on how you might start the project.

To start the server open a terminal window on unix/linux based systems and change
directory to the project root. Then execute this command:

```
  ./server
```

The command assumes you have a PHP binary in your system path. If you don't you
will get an error and the server will not start.

After starting the server go to:

```
http://localhost:8765/index.html  
```

If you setup the http server differently, please provide direction on how to start it
in your submitted project's readme file.

## JCO Update 2/6/22
Updated the following files:

```
webroot/index.html

webroot/js/app.js

webroot/css/main.css

webroot/api/index.php
```

See instructions above to start the server.

HTML form input is passed to the server via AJAX GET request in app.js, triggered by the submit button. Server hits REST API using the following endpoints & {userInput} string:

```
https://restcountries.com/v3.1/name/{userInput}

https://restcountries.com/v3.1/name/{userInput}?fullText=true

https://restcountries.com/v3.1/alpha/{userInput}
```

The data from each endpoint is merged and sorted, then returned to the front end as json. On a successful callback, the view data is formatted and displayed to the end user. On an error callback, an alert is shown to the user with the input string that failed.

Data is displayed in an HTML table, and metadata (count of countries, regions, and subregions) is listed at the bottom of the page.