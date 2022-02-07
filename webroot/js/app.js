/**
 * Make ajax request to index.php, with user input in html form
 * Called by onclick event of Submit! button
 * @param  {string} input The user inputted string to search for country data
 */
function callCountrySearch(input) {
    $.ajax({url: "api/index.php",
            type: "GET",
            dataType: "json",
            data: { "countryString": input }, 
            success: function (data) {
                generateView(data);
            },
            error: function() {
                alert("Search failed with input string: \"" + input + "\"");
            }
      });
}

/**
 * Generate the view from endpoint data
 * @param  {json} json The json data returned from the endpoint
 */
function generateView(json) {

    //init vars
    var countryCount = 0;
    var regionDict = {};
    var subRegionDict = {};
    var thead = $('<thead/>');
    var tbody = $('<tbody/>');
    
    //clear data and build table header
    clearData();
    buildTableHeader(thead);

    //iterate over the json data and invoke functions to build view
    for (var i = 0; i < json.length; i++) {
        countryCount++;
        incrementRegion(regionDict, json[i].region);
        incrementSubRegion(subRegionDict, json[i].subregion);
        buildTableRow(tbody, json, i);
    }

    //build footer from result metadata
    buildFooter(countryCount, regionDict, subRegionDict);
}

/**
 * Clear html elements in preparation for new data
 */
function clearData() {
    countryCount = 0;
    $('table').html("");
    $('#count').html("");
    $('#regions').html("");
    $('#subregions').html("");
}

/**
 * Build the table header
 * @param  {html} thead  selector for <thead> element to append the header row
 */
function buildTableHeader(thead) {
    var tr = $('<tr/>');
    tr.append("<th>Name</th>");
    tr.append("<th>CCA2</th>");
    tr.append("<th>CCA3</th>");
    tr.append("<th>Flag</th>");
    tr.append("<th>Region</th>");
    tr.append("<th>Subregion</th>");
    tr.append("<th>Population</th>");
    tr.append("<th>Languages</th>");
    thead.append(tr);
    $('table').append(thead);
}

/**
 * Build a row in the table
 * @param  {html} tbody Selector for the <tbody> element to append the row data
 * @param {json} json json data from our endpoint
 * @param {Number} i Index of the loop iteration that is calling the function
 */
function buildTableRow(tbody, json, i) {
    var tr = $('<tr/>');
    tr.append("<td>" + json[i].name.official + "</td>");
    tr.append("<td>" + json[i].cca2 + "</td>");
    tr.append("<td>" + json[i].cca3 + "</td>");
    tr.append("<td>" + json[i].flag + "</td>");
    tr.append("<td>" + json[i].region + "</td>");
    tr.append("<td>" + json[i].subregion + "</td>");
    tr.append("<td>" + json[i].population.toLocaleString() + "</td>");
    //populate languages column
    var langs = formatLanguages(json[i].languages);
    tr.append("<td>" + langs + "</td>");                    
    tbody.append(tr);
    $('table').append(tbody);
}

/**
 * Format the languages data with commas & spaces
 * @param  {dictionary} jsonLangs dictionary of languages for the current country
 * @return {string} Returns the formatted languages string
 */
function formatLanguages(jsonLangs) {
    var langs = "";
    for(var key in jsonLangs) {
        langs += jsonLangs[key] + ", ";
    }
    return langs.substring(0, langs.length-2);
}

/**
 * Increment the region dictionary
 * @param  {dictionary} regionDict dictionary of regions & number of occurrences
 * @param  {string} region the region name for the current country
 */
function incrementRegion(regionDict, region) {
    if(regionDict[region]) {
        regionDict[region] = regionDict[region]+1;
    }
    else {
        regionDict[region] = 1;
    }
}

/**
 * Increment the subregion dictionary
 * @param  {dictionary} subRegionDict dictionary of subregions & number of occurrences
 * @param  {string} subRegion the region name for the current country
 */
function incrementSubRegion(subRegionDict, subRegion) {
    if(subRegionDict[subRegion]) {
        subRegionDict[subRegion] = subRegionDict[subRegion]+1;
    }
    else {
        subRegionDict[subRegion] = 1;
    }
}

/**
 * Generate metadata for count of countries, regions, and subregions
 * @param  {Number} countryCount Number of countries in results
 * @param  {dictionary} regionDict dictionary of regions & number of occurrences
 * @param  {dictionary} subRegionDict dictionary of subregions & number of occurrences
 */
function buildFooter(countryCount, regionDict, subRegionDict) {
    var regions = "";
    var subRegions = "";
    
    //Generate count of countries
    $("#count").html("<b>Countries: </b>" + countryCount);
    
    //Generate list of regions
    $("#regions").append("<b>Regions: </b>");
    Object.keys(regionDict).forEach(k => {
        regions += " " + k + " (" + regionDict[k] + "), ";
    })
    $("#regions").append(regions.substring(0, regions.length-2));

    //Generate list of subregions
    $("#subregions").append("<b>Subregions: </b>");
    Object.keys(subRegionDict).forEach(k => {
        subRegions += " " + k + " (" + subRegionDict[k] + "), ";
    })
    $("#subregions").append(subRegions.substring(0, subRegions.length-2));

    //show footer data
    $(".search-metadata").show();
}

