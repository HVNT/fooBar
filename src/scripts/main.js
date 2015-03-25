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
var CollegeMap = {},
    ConferenceMap = { //just hardcode this shit
        'SEC': {
            id: 500000,
            color: 'RED'
        },
        'PAC-12': {
            id: 500001,
            color: 'GREEN'
        },
        'ACC': {
            id: 500002,
            color: 'BLUE'
        },
        'Big Ten': {
            id: 500003,
            color: 'ORANGE'
        },
        'Big 12': {
            id: 500004,
            color: 'PURPLE'
        },
        'American': {
            id: 500005,
            color: 'YELLOW'
        },
        'Mountain West': {
            id: 500006,
            color: 'BROWN'
        },
        'Conference USA': {
            id: 500007,
            color: 'PINK'
        },
        'Other': {
            id: 500008,
            color: 'Gray'
        }
    };

/* global variables */
var players = [];
var playerMap = {};

/* RUNNING BACK SERVICE OBJECT */
function Player (data) {
    data = data || {};
    this.id = null; //eh
    this.parent = null; //eh --> really this is parentID, used for highcharts

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
                newFolder.id = i.toString();
                players.push(newFolder);
                playerMap[newFolder.name] = newFolder; //use new folder as key for now, should be unique (mispellings might cause an issue)
            }
        }
    }
}

function initDirtyPlayers (playersData) {
    if (playersData && playersData.length > 0) {
        for (var i = 0; i < playersData.length; i++) {
            if (playerMap[playersData[i].Name]) { //updating only existing Players
                /* NOTE: we could have this live in the constructor, but would rather know what's been updated vs
                    having null values on certain Players
                 */

                //it looks like some values might be set to "0" if null -- such as draft pick and wonderlic etc
                //better to have these values null? or like "undrafted"?
                playerMap[playersData[i].Name].arms = parseInt(playersData[i].Arms) || null;
                playerMap[playersData[i].Name].hands = parseInt(playersData[i].Hands) || null;
                playerMap[playersData[i].Name].twentyYard = parseInt(playersData[i].TwentyYD) || null;
                playerMap[playersData[i].Name].tenYard = parseInt(playersData[i].TenYD) || null;
                playerMap[playersData[i].Name].broad = parseInt(playersData[i].Broad) || null;
                playerMap[playersData[i].Name].round = parseInt(playersData[i].Round) || null;
                playerMap[playersData[i].Name].pickRound = parseInt(playersData[i].PickRound) || null;
                playerMap[playersData[i].Name].pick = parseInt(playersData[i].Pick) || null;
                playerMap[playersData[i].Name].pickTotal = parseInt(playersData[i].PickTotal) || null;
                playerMap[playersData[i].Name].conference = playersData[i].Conference;
                playerMap[playersData[i].Name].wonderlic = parseInt(playersData[i].Wonderlic) || null;
            }
        }
    }
}

function mapConferences () {
    if (players && players.length > 0) {
        var _conference;
        for (var i = 0; i < players.length; i++) {
            players[i].conference = CollegeConferenceMap[players[i].college] || 'Other';
        }
    }
}

function initTreeMapData () {
    var treeMapData = [],
        runningTreeMapIds = {};

    initCollegesAndDraftValues();


    if (players && players.length > 0) {
        for (conference in ConferenceMap) {
            if (ConferenceMap.hasOwnProperty(conference)) { //check if exists
                if (!runningTreeMapIds[ConferenceMap[conference].id]) { //if conference not added, add
                    treeMapData.push({
                        id: ConferenceMap[conference].id.toString(),
                        name: conference,
                        color: ConferenceMap[conference].color
                    })
                }
            }
        }

        for (college in CollegeMap) {
            if (CollegeMap.hasOwnProperty(college)) { //check if exists
                if (!runningTreeMapIds[CollegeMap[college].id]) { //if college not added, add
                    runningTreeMapIds[CollegeMap[college].id] = 1; //don't re-add

                    treeMapData.push({
                        id: CollegeMap[college].id.toString(),
                        name: college,
                        value: CollegeMap[college].draftValue,
                        parent: ConferenceMap[CollegeConferenceMap[college]] ?
                            ConferenceMap[CollegeConferenceMap[college]].id.toString() : '500008' //500008 = id for 'Other' conference
                    })
                }
            }
        }
    }

    return treeMapData;
}

function initCollegesAndDraftValues () {
    if (players && players.length > 0) {
        var pCollege = '',
            collegeId = 100000; //start college ids at 100000 to avoid collision
        for (var i = 0; i < players.length; i++) {
            pCollege = players[i].college;

            if (!CollegeMap[pCollege]) { //doesnt exist in college map, new college
                collegeId++;

                CollegeMap[pCollege] = {
                    id: collegeId,
                    draftValue: weightPick(players[i].round),
                    numPicks: 1
                };
            } else {
                //id doesnt change..
                CollegeMap[pCollege].draftValue += weightPick(players[i].round);
                CollegeMap[pCollege].numPicks++;
            }

            players[i].parent = collegeId; //set parentid for highcharts
        }
    }
}

//32 picks per round
function weightPick(round) {
    var weight = 0;
    switch (round) {
        case 1:
            weight = 7;
            break;
        case 2:
            weight = 6;
            break;
        case 3:
            weight = 5;
            break;
        case 4:
            weight = 4;
            break;
        case 5:
            weight = 3;
            break;
        case 6:
            weight = 2;
            break;
        case 7:
            weight = 1;
            break;
        default:
            weight = 0;
            break;
    }
    return weight;
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
                mapConferences();

                /* now have all the data ready, bootstrap up document */
                $(document).ready(function () {

                    var treeMapData = initTreeMapData();

                    ////////////////////////////////////////////////////
                    ///////////////* HIGHCHARTS STUFF HERE*/////////////
                    ////////////////////////////////////////////////////
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'treemap-container'
                        },
                        series: [{
                            type: "treemap",
                            layoutAlgorithm: 'squarified',
                            allowDrillToNode: true,
                            dataLabels: {
                                enabled: false
                            },
                            levelIsConstant: false,
                            levels: [{
                                level: 1,
                                dataLabels: {
                                    enabled: true
                                },
                                borderWidth: 3
                            }],
                            data: treeMapData
                        }],
                        subtitle: {
                            text: 'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">WHO</a>.'
                        },
                        title: {
                            text: 'COMBINE DATA'
                        }
                    });
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
