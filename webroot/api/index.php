<?php

//catch input in GET Request
if(isset($_GET['countryString']))
{
    $cString = $_GET['countryString'];
    $url = "https://restcountries.com/v3.1/name/";
    $apiURL = $url . $cString;
    $json = file_get_contents($apiURL);
    
    //Sort array
    $json_data = json_decode($json);
    usort($json_data, 'sortByPop');
    $sorted_json = json_encode($json_data);

    //return sorted json
    echo $sorted_json;
}

//comparison function for population
function sortByPop($a, $b) {
    return $b->population <=> $a->population;
}
?>


