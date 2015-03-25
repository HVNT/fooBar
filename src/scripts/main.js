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
    'Texas A&M': 'SEC'
};
var CollegeMap = {};

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
        treeMapDataMap = {};

    initCollegesAndDraftValues();
    
    if (players && players.length > 0) {
        //wait first we can add all colleges then all conferences
        for (college in CollegeMap) {

        }
    }
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
                debugger;

                /* now have all the data ready, bootstrap up document */
                $(document).ready(function () {

                    var treeMapData = initTreeMapData();

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
