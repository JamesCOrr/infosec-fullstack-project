//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here

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

//generate view function - invokes clearData, buildTable, and buildFooter to generate the view
function generateView(json) {

    let countryCount = 0;
    var regionDict = {};
    var subRegionDict = {};

    //clear data and build table header
    clearData();
    buildTableHeader();

    //iterate over the json data and invoke functions to build view
    for (var i = 0; i < json.length; i++) {
        countryCount++;
        incrementRegion(regionDict, json[i].region);
        incrementSubRegion(subRegionDict, json[i].subregion);
        buildTableRow(json, i);
    }

    //build footer from result metadata
    buildFooter(countryCount, regionDict, subRegionDict);
}

//clear view elements
function clearData() {
    countryCount = 0;
    $('table').html("");
    $('#count').html("");
    $('#regions').html("");
    $('#subregions').html("");
}

//build table headers
function buildTableHeader() {
    var tr = $('<tr/>');
    tr.append("<th>Name</th>");
    tr.append("<th>CCA2</th>");
    tr.append("<th>CCA3</th>");
    tr.append("<th>Flag</th>");
    tr.append("<th>Region</th>");
    tr.append("<th>Subregion</th>");
    tr.append("<th>Population</th>");
    tr.append("<th>Languages</th>");
    $('table').append(tr);
}

//build table row from json data
function buildTableRow(json, i) {
    var tr = $('<tr/>');
    tr.append("<td>" + json[i].name.official + "</td>");
    tr.append("<td class=\"centered\">" + json[i].cca2 + "</td>");
    tr.append("<td class=\"centered\">" + json[i].cca3 + "</td>");
    tr.append("<td class=\"centered\">" + json[i].flag + "</td>");
    tr.append("<td>" + json[i].region + "</td>");
    tr.append("<td>" + json[i].subregion + "</td>");
    tr.append("<td>" + json[i].population.toLocaleString() + "</td>");
    //populate languages column
    var langs = formatLanguages(json[i].languages);
    tr.append("<td>" + langs + "</td>");                    
    $('table').append(tr);
}

//format languages to display in table
function formatLanguages(jsonLangs) {
    var langs = "";
    for(var key in jsonLangs) {
        langs += jsonLangs[key] + ", ";
    }
    return langs.substring(0, langs.length-2);
}

//update region dictionary
function incrementRegion(regionDict, region) {
    if(regionDict[region]) {
        regionDict[region] = regionDict[region]+1;
    }
    else {
        regionDict[region] = 1;
    }
}

//update subregion dictionary
function incrementSubRegion(subRegionDict, subRegion) {
    if(subRegionDict[subRegion]) {
        subRegionDict[subRegion] = subRegionDict[subRegion]+1;
    }
    else {
        subRegionDict[subRegion] = 1;
    }
}

//write data to footer
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
}

