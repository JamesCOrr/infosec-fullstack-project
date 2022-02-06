//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here


function callCountrySearch(input)
{
    $.ajax({url: "api/index.php",
            type: "GET",
            dataType: "json",
            data: { "countryString": input }, 
            success: function (data) {
                generateView(data);
            },
            error: function(){
                alert("Search failed with input string: \"" + input + "\"");
            }
      });
}

function generateView(json){

    let countryCount = 0;
    var regionDict = {};
    var subRegionDict = {};

    clearData();
    buildTable(json, regionDict, subRegionDict);
    createFooter(regionDict, subRegionDict);
}
//clear elements
function clearData()
{
    countryCount = 0;
    $('table').html("");
    $('#count').html("");
    $('#regions').html("");
    $('#subregions').html("");
}

function buildTable(json, regionDict, subRegionDict)
{
    //initialize table header
    var tr;
    tr = $('<tr/>');
    tr.append("<th>Name</th>");
    tr.append("<th>CCA2</th>");
    tr.append("<th>CCA3</th>");
    tr.append("<th>Flag</th>");
    tr.append("<th>Region</th>");
    tr.append("<th>Subregion</th>");
    tr.append("<th>Population</th>");
    tr.append("<th>Languages</th>");
    $('table').append(tr);

    //populate table
    for (var i = 0; i < json.length; i++) {
        countryCount++;
        tr = $('<tr/>');
        tr.append("<td>" + json[i].name.official + "</td>");
        tr.append("<td>" + json[i].cca2 + "</td>");
        tr.append("<td>" + json[i].cca3 + "</td>");
        tr.append("<td>" + json[i].flag + "</td>");
        tr.append("<td>" + json[i].region + "</td>");
        tr.append("<td>" + json[i].subregion + "</td>");
        tr.append("<td>" + json[i].population + "</td>");
        
        //construct region and subregion dictionaries
        if(regionDict[json[i].region]){
            regionDict[json[i].region] = regionDict[json[i].region]+1;
        }
        else{
            regionDict[json[i].region] = 1;
        }
        if(subRegionDict[json[i].subregion]){
            subRegionDict[json[i].subregion] = subRegionDict[json[i].subregion]+1;
        }
        else{
            subRegionDict[json[i].subregion] = 1
        }
        //populate languages row
        var langs = "";
        for(var key in json[i].languages){
            langs += "\n"+json[i].languages[key];
        }
        tr.append("<td>" + langs + "</td>");                    
        $('table').append(tr);
    }
}

//write data to footer
function createFooter(regionDict, subRegionDict)
{
    $("#count").html("<b>Countries: </b>" + countryCount);
    $("#regions").append("<b>Regions: </b>");
    Object.keys(regionDict).forEach(k => {
        $("#regions").append(" " + k + " (" + regionDict[k] + ")");
    })
    $("#subregions").append("<b>Subregions: </b>");
    Object.keys(subRegionDict).forEach(k => {
        $("#subregions").append(" " + k + " (" + subRegionDict[k] + ")");
    })
}

