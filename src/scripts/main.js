/**
 * Created with WebStorm.
 * User: hunt
 * Date: 3/25/15
 * Time: 4:33 PM
 * File:
 */

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
    url: "/data/combine_clean.csv",
    dataType: "text",
    success: function(dataClean) {
        var papaConfig = {
            header: true
        };

        var cleanPlayers = Papa.parse(dataClean, papaConfig);
        initCleanPlayers(cleanPlayers.data);


        /* chain ajax requests */
        $.ajax({
            type: "GET",
            url: "/data/combine_dirty.csv",
            dataType: "text",
            success: function(dataDirty) {

                var dirtyPlayers = Papa.parse(dataDirty, papaConfig);
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
