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

webroot/index.html

webroot/js/app.js

webroot/css/main.css

webroot/api/index.php

No changes to instructions to start server.

HTML form input is passed to index.php via AJAX GET request, triggered by submit button.
index.php hits REST API using the following endpoints & userinput:

https://restcountries.com/v3.1/name/{userInput}
https://restcountries.com/v3.1/name/{userInput}?fullText=true
https://restcountries.com/v3.1/alpha/{userInput}

index.php merges and sorts the results, and returns them to app.js
On success callback, view data is formatted and displayed
On error callback, an alert is shown to the user with the input string that failed

Data is displayed in a table, and metadata (countries, regions, subregions) are listed at the bottom of the page




