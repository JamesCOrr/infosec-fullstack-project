<?php

//catch input in GET Request
if(isset($_GET['countryString'])) {
    
    //set input string, use rawurlencode to properly handle spaces in full names
    $country_string = rawurlencode($_GET['countryString']);
    
    //get name endpoint data
    $name_url = "https://restcountries.com/v3.1/name/";
    $name_api_url = $name_url . $country_string;
    try {
        $name_json = requestData($name_api_url);
    } catch (Exception $e) {
        $name_json = null;
    }

    //get alpha code endpoint data
    $alpha_url = "https://restcountries.com/v3.1/alpha/";
    $alpha_api_url = $alpha_url . $country_string;
    try {
        $alpha_json = requestData($alpha_api_url);
    } catch (Exception $e) {
        $alpha_json = null;
    }

    //get full name endpoint data
    $full_name_url = "https://restcountries.com/v3.1/name/";
    $url_suffix = "?fullText=true";
    $full_name_api_url = $full_name_url . $country_string . $url_suffix;
    try {
        $full_name_json = requestData($full_name_api_url);
    } catch (Exception $e) {
        $full_name_json = null;
    }

    //decode data
    $name_json_data = decodeData($name_json);
    $alpha_json_data = decodeData($alpha_json);
    $full_name_json_data = decodeData($full_name_json);

    //merge data
    $merged_data = mergeData($name_json_data, $alpha_json_data, $full_name_json_data);

    //deduplicate data & sort
    $deduplicated_data = array_unique($merged_data, SORT_REGULAR);
    usort($deduplicated_data, 'sortByPop');
    $sorted_json = json_encode($deduplicated_data);

    //return sorted json
    echo $sorted_json;
}

/**
 *
 * Open and close a curl session and retrieve data from the rest API url
 * @param string $url The url of the rest API
 * @return json
 */
function requestData($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    if(curl_errno($curl)) {
        throw new Exception(curl_error($curl));
    }
    curl_close($curl);
    return $data;
}

/**
 *
 * Decode json data and set to null if we received a status code, then return as an array
 * @param json $json
 * @return array
 */
function decodeData($json) {
    $data = json_decode($json);
    if(isset($data->status)){
        $data = null;
    }
    return $data;
}

/**
 *
 * Merge arrays of json data from each endpoint iff they are not set to null
 * @param array $name_json_data The array of data from the name endpoint
 * @param array $alpha_json_data The array of data from the alpha (character code) endpoint
 * @param array $full_name_json_data The array of data from the full name endpoint
 * @return array Merged array
 */
function mergeData($name_json_data, $alpha_json_data, $full_name_json_data) {    
    if(isset($name_json_data) && isset($alpha_json_data) && isset($full_name_json_data)){
        $merged_data = array_merge($name_json_data, $alpha_json_data, $full_name_json_data);
    }
    else if (isset($name_json_data) && isset($alpha_json_data)){
        $merged_data = array_merge($name_json_data, $alpha_json_data);
    }
    else if(isset($name_json_data) && isset($full_name_json_data)){
        $merged_data = array_merge($name_json_data, $full_name_json_data);
    }
    else if(isset($alpha_json_data) && isset($full_name_json_data)){
        $merged_data = array_merge($alpha_json_data, $full_name_json_data);
    }
    else if(isset($name_json_data)){
        $merged_data = $name_json_data;
    }
    else if(isset($alpha_json_data)){
        $merged_data = $alpha_json_data;
    }
    else if(isset($full_name_json_data)){
        $merged_data = $full_name_json_data;
    }
    return $merged_data;
}

/**
 *
 * Callback function for usort to sort by population descending
 * @param object $a first element in comparison
 * @param object $b second element in comparison
 * @return int -1, 0, 1 used by usort to determine order of elements in the array based on population comparison
 */
function sortByPop($a, $b) {
    return $b->population <=> $a->population;
}
?>