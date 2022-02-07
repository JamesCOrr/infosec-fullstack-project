<?php
//catch input in GET Request
if(isset($_GET['countryString'])) {
    //set input string, use rawurlencode to properly handle spaces in full names
    $country_string = rawurlencode($_GET['countryString']);
    
    //get name endpoint data
    $name_url = "https://restcountries.com/v3.1/name/";
    $name_api_url = $name_url . $country_string;
    $name_json = requestData($name_api_url);

    //get alpha code endpoint data
    $alpha_url = "https://restcountries.com/v3.1/alpha/";
    $alpha_api_url = $alpha_url . $country_string;
    $alpha_json = requestData($alpha_api_url);

    //get full name endpoint data
    $full_name_url = "https://restcountries.com/v3.1/name/";
    $url_suffix = "?fullText=true";
    $full_name_api_url = $full_name_url . $country_string . $url_suffix;
    $full_name_json = requestData($full_name_api_url);

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

function requestData($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    curl_close($curl);
    return $data;
}

//decode data into json, set to null if we receive status code (i.e. failed query)
function decodeData($json_data) {
    $data = json_decode($json_data);
    if(isset($data->status)){
        $data = null;
    }
    return $data;
}

//branching logic for merging data from each endpoint
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

//comparison function for population
function sortByPop($a, $b) {
    return $b->population <=> $a->population;
}
?>


