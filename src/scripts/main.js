/**
 * Created with WebStorm.
 * User: hunt
 * Date: 3/25/15
 * Time: 4:33 PM
 * File:
 */

/* global mappings */
var CollegeConferenceMap = {
    'Florida': 'SEC',
    'Georgia': 'SEC',
    'Kentucky': 'SEC',
    'Missouri': 'SEC',
    'South Carolina': 'SEC',
    'Tennessee': 'SEC',
    'Vanderbilt': 'SEC',
    'Alabama': 'SEC',
    'Arkansas': 'SEC',
    'Auburn': 'SEC',
    'LSU': 'SEC',
    'Mississippi State': 'SEC',
    'Texas A&M': 'SEC',
    'Arizona' : 'PAC-12',
    'California' : 'PAC-12',
    'Oregon' : 'PAC-12',
    'Arizona State' : 'PAC-12',
    'Oregon State' : 'PAC-12',
    'Colorado' : 'PAC-12',
    'Stanford' : 'PAC-12',
    'UCLA' : 'PAC-12',
    'Washington' : 'PAC-12',
    'USC' : 'PAC-12',
    'Washington State' : 'PAC-12',
    'Utah' : 'PAC-12',
    'Boston College' : 'ACC',
    'Duke' : 'ACC',
    'Clemson' : 'ACC',
    'Georgia Tech' : 'ACC',
    'Florida State' : 'ACC',
    'Miami (FL)' : 'ACC',
    'Louisville' : 'ACC',
    'North Carolina' : 'ACC',
    'North Carolina State' : 'ACC',
    'Pittsburgh' : 'ACC',
    'Syracuse' : 'ACC',
    'Virginia' : 'ACC',
    'Wake Forest' : 'ACC',
    'Virginia Tech' : 'ACC',
    'Indiana' : 'Big Ten',
    'Illinois' : 'Big Ten',
    'Maryland' : 'Big Ten',
    'Iowa' : 'Big Ten',
    'Michigan' : 'Big Ten',
    'Minnesota' : 'Big Ten',
    'Michigan State' : 'Big Ten',
    'Nebraska' : 'Big Ten',
    'Ohio State' : 'Big Ten',
    'Northwestern' : 'Big Ten',
    'Penn State' : 'Big Ten',
    'Purdue' : 'Big Ten',
    'Rutgers' : 'Big Ten',
    'Wisconsin' : 'Big Ten',
    'Baylor' : 'Big 12',
    'Iowa State' : 'Big 12',
    'Kansas' : 'Big 12',
    'Kansas State' : 'Big 12',
    'Oklahoma' : 'Big 12',
    'Oklahoma State' : 'Big 12',
    'TCU' : 'Big 12',
    'Texas' : 'Big 12',
    'Texas Tech' : 'Big 12',
    'West Virginia' : 'Big 12',
    'Cincinnati' : 'American',
    'Connecticut' : 'American',
    'East Carolina' : 'American',
    'Houston' : 'American',
    'Memphis' : 'American',
    'Southern Methodist' : 'American',
    'South Florida' : 'American',
    'Temple' : 'American',
    'Tulane' : 'American',
    'Tulsa' : 'American',
    'UCF' : 'American',
    'Fresno State' : 'Mountain West',
    'Air Force' : 'Mountain West',
    'Hawaii' : 'Mountain West',
    'Boise State' : 'Mountain West',
    'Nevada' : 'Mountain West',
    'Colorado State' : 'Mountain West',
    'San Diego State' : 'Mountain West',
    'New Mexico' : 'Mountain West',
    'San Jose State' : 'Mountain West',
    'Utah State' : 'Mountain West',
    'UNLV' : 'Mountain West',
    'Wyoming' : 'Mountain West',
    'Fresno State' : 'Mountain West',
    'Florida Atlantic' : 'Conference USA',
    'Louisiana Tech' : 'Conference USA',
    'Florida International' : 'Conference USA',
    'North Texas' : 'Conference USA',
    'Marshall' : 'Conference USA',
    'Rice' : 'Conference USA',
    'Middle Tennessee State'  : 'Conference USA',
    'Southern Miss' : 'Conference USA',
    'Old Dominion' : 'Conference USA',
    'UTEP' : 'Conference USA',
    'UAB' : 'Conference USA',
    'UTSA' : 'Conference USA',
    'Western Kentucky' : 'Conference USA'
};

/* global variables */
var players = [];
var playerMap = {};

/* RUNNING BACK SERVICE OBJECT */
function Player (data) {
    data = data || {};

    this.combineYear = parseInt(data.Year) || null;
    this.name = data.Name || null;
    this.college = data.College || null;
    this.pos = data.POS || null;
    this.height = parseInt(data['Height (in)']) || null;
    this.weight = parseInt(data['Weight (lbs)']) || null;
    this.wonderlic = data.Wonderlic || null;
    this.fortyYard = parseInt(data['40 Yard']) || null;
    this.benchPress = parseInt(data['Bench Press']) || null;
    this.vertLeap = parseInt(data['Vert Leap (in)']) || null;
    this.broadJump = parseInt(data['Broad Jump (in)']) || null;
    this.shuttle = parseInt(data.shuttle) || null;
    this.threeCone = parseInt(data['3Cone']) || null;

    return this;
}

function initCleanPlayers (playersData) {
    if (playersData && playersData.length > 0) {
        for (var i = 0; i < playersData.length; i++) {
            if (!playerMap[playersData[i].name]) { //if currently not in map init and add to players collection and playerMap
                var newFolder = new Player(playersData[i]);
                players.push(newFolder);
                playerMap[newFolder.name] = newFolder; //use new folder as key for now, should be unique (mispellings might cause an issue)
            }
        }
    }
}

function initDirtyPlayers (playersData) {
    if (playersData && playersData.length > 0) {
        for (var i = 0; i < playersData.length; i++) {
            if (playerMap[playersData[i].name]) { //updating only existing Players
                /* NOTE: we could have this live in the constructor, but would rather know what's been updated vs
                    having null values on certain Players
                 */

                //it looks like some values might be set to "0" if null -- such as draft pick and wonderlic etc
                //better to have these values null? or like "undrafted"?
                playerMap[playersData[i].name].arms = parseInt(playersData[i].Arms) || null;
                playerMap[playersData[i].name].hands = parseInt(playersData[i].Hands) || null;
                playerMap[playersData[i].name].twentyYard = parseInt(playersData[i].TwentyYD) || null;
                playerMap[playersData[i].name].tenYard = parseInt(playersData[i].TenYD) || null;
                playerMap[playersData[i].name].broad = parseInt(playersData[i].Broad) || null;
                playerMap[playersData[i].name].round = parseInt(playersData[i].Round) || null;
                playerMap[playersData[i].name].pickRound = parseInt(playersData[i].PickRound) || null;
                playerMap[playersData[i].name].pick = parseInt(playersData[i].Pick) || null;
                playerMap[playersData[i].name].pickTotl = parseInt(playersData[i].PickTotal) || null;
                playerMap[playersData[i].name].conference = playersData[i].Conference;
                playerMap[playersData[i].name].wonderlic = parseInt(playersData[i].Wonderlic) || null;
            }
        }
    }
}


/* GO */
$.ajax({
    type: "GET",
    url: "/data/combine_clean.csv", //we wanna request the data that we know has all the college info first
    dataType: "text",
    success: function(dataClean) {
        var papaConfig = {
            header: true
        };

        /* NOTE: Papa is a javascript tool included in
        our project used to parse CSV stuff to JSON */
        var cleanPlayers = Papa.parse(dataClean, papaConfig);
        initCleanPlayers(cleanPlayers.data);


        /* chain ajax requests */
        $.ajax({
            type: "GET",
            url: "/data/combine_dirty.csv", //now that the clean player data is initialized, we can merge the dirty data
            dataType: "text",
            success: function(dataDirty) {

                var dirtyPlayers = Papa.parse(dataDirty, papaConfig); //here we are using Papa again
                initDirtyPlayers(dirtyPlayers.data);
                debugger;

                /* now have all the data, bootstrap up document */
                $(document).ready(function () {

                    ////////////////////////////////////////////////////
                    ///////////////* HIGHCHARTS STUFF HERE*/////////////
                    ////////////////////////////////////////////////////
                    $('.treemap-container').highcharts({


                    })
                });
            },
            error: function (request, status, error) {
                alert(request.responseText);
            }
        });
    },
    error: function (request, status, error) {
        alert(request.responseText);
    }
});
