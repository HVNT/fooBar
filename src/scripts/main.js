"use strict";
/**
 * Created with WebStorm.
 * User: hunt
 * Date: 3/25/15
 * Time: 4:33 PM
 * File:
 */
angular.module('FooBar', [])
    .controller('FooBarCtrl', function ($scope, $q, Player, PlayerUtilities) {
        $scope.Player = Player;
        $scope.activePlayers = [];

        $scope.filters = {
            pos: 'CB',
            metric: Player.metrics[0],
            playerSearch: '',
            reverse: false
        };

        Player.query().then(function () {
            $scope.positions = Player.getPositionsAndWeights(Player.players);
            repaintGraph();
        }, function (err) {
            throw new Error(err);
        });

        $scope.filterPosition = function (filter) {
            $scope.filters.pos = filter || 'CB';
            repaintGraph();
        };

        $scope.filterMetric = function (filter) {
            if (filter) {
                $scope.filters.metric = filter
            } else {
                $scope.filters.metric = {
                    key: 'height',
                    value: 'Height'
                }
            }

            repaintGraph();
        };

        $scope.toggleFilter = function () {
            $scope.filters.reverse = !$scope.filters.reverse;
        };

        function repaintGraph() {
            var repaintData = Player.getMetric($scope.filters.pos, $scope.filters.metric.key);
            //getMetric call updates activePlayers for us
            $scope.activePlayers = Player.activePlayers;

            var _repaintData = [];
            for (var i = 0; i < Player.combineYears.length; i++) {
                _repaintData.push(Player.getMetricAverage($scope.filters.pos, $scope.filters.metric.key, Player.combineYears[i]));
            }

            $('#linegraph-container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Combine ' + $scope.filters.metric.value + ' ' + $scope.filters.pos
                },
                xAxis: {
                    categories: Player.combineYears,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: $scope.filters.pos
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Avg ' + $scope.filters.metric.value,
                    data: _repaintData

                }]
            });

//            $('#linegraph-container').highcharts('StockChart', {
//                rangeSelector: {
//                    selected: 5
//                },
//                title: {
//                    text: 'Combine ' + $scope.filters.metric.value + ' ' + $scope.filters.pos
//                },
//                series: [
//                    {
//                        name: $scope.filters.metric.value,
//                        data: repaintData,
//                        tooltip: {
//                            valueDecimals: 2
//                        }
//                    }
//                ]
//            });
        }

    })
    .factory('Player', function ($http, $q, PlayerUtilities) {
        function Player(data) {
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
            this.fortyYard = parseFloat(data['40 Yard'], 2) || null;
            this.benchPress = parseInt(data['Bench Press']) || null;
            this.vertLeap = parseInt(data['Vert Leap (in)']) || null;
            this.broadJump = parseInt(data['Broad Jump (in)']) || null;
            this.shuttle = parseInt(data.shuttle) || null;
            this.threeCone = parseInt(data['3Cone']) || null;
        }

        Player.players = [];
        Player.playerMap = {};
        Player.activePlayers = [];

        Player.query = function () {
            var defer = $q.defer(),
                pathClean = '/data/combine_clean.csv',
                pathDirty = '/data/combine_dirty.csv';

            $http.get(pathClean).then(function (responseClean) {

                /* NOTE: Papa is a javascript tool included in
                 our project used to parse CSV stuff to JSON */
                var cleanPlayers = Papa.parse(responseClean.data, {header: true});
                Player._initCleanPlayers(cleanPlayers.data);

                $http.get(pathDirty).then(function (responseDirty) {
                    var dirtyPlayers = Papa.parse(responseDirty.data, {header: true});

                    Player._initDirtyPlayers(dirtyPlayers.data);
                    Player._mapConferences();

                    defer.resolve(Player);
                })
            });

            return defer.promise;
        };

        Player.getPositionsAndWeights = function () {
            var positionMap = {};
            if (this.players && this.players.length > 0) {

                for (var i = 0; i < this.players.length; i++) {
                    if (!positionMap[this.players[i].pos]) {
                        positionMap[this.players[i].pos] = { players: [this.players[i]], count: 1 };
                    } else {
                        positionMap[this.players[i].pos].players.push(this.players[i]);
                        positionMap[this.players[i].pos].count++;
                    }
                }
            }
            return positionMap;
        };

        /* note this updates the activePlayers collection as well */
        Player.getMetric = function (position, metric) {
            var metricData = [],
                date = null;
            this.activePlayers = [];

            if (position && this.players && this.players.length > 0) {
                for (var i = 0; i < this.players.length; i++) {
                    if (this.players[i].pos === position) {
                        date = new Date(this.players[i].combineYear, 1, 1, 0, 0, 0, 0); //?

                        //only push if player metric isn't null
                        if (this.players[i][metric]) {
                            metricData.push([date.getTime(), this.players[i][metric]]);
                            this.activePlayers.push(this.players[i]);
                        }
                    }
                }
            }
            return metricData;
        };

        Player.getMetricAverage = function (position, metric, year) {
            var metricAvgData = 0,
                validPlayers = 0;

            if (position && metric && year
                && this.players && this.players.length > 0) {

                for (var i = 0; i < this.players.length; i++) {
                    if (this.players[i].combineYear == year
                        && this.players[i].pos === position && this.players[i][metric]) {
                        metricAvgData += this.players[i][metric];
                        validPlayers++;
                    }
                }
            } else {
                throw new Error('Need @params position, metric, and year');
            }
            return metricAvgData / (validPlayers || 1);
        };

        Player._initCleanPlayers = function (playersData) {
            if (playersData && playersData.length > 0) {
                for (var i = 0; i < playersData.length; i++) {

                    if (!Player.playerMap[playersData[i].name]) { //if currently not in map init and add to players collection and playerMap
                        if (playersData[i].POS == 'K' ||
                            playersData[i].POS == 'LS'||
                            playersData[i].POS == 'P'||
                            playersData[i].POS == 'FB') {
                            console.log('Not initializing this players of this pos currently.', playersData[i]);
                        } else {
                            var newPlayer = new Player(playersData[i]);
                            newPlayer.id = i.toString();

                            /* using new player name as key for now,
                            should be unique (mispellings might cause an issue) */
                            Player.playerMap[newPlayer.name] = newPlayer;
                            Player.players.push(newPlayer);
                        }
                    }
                }
            }
        };

        Player._initDirtyPlayers = function (playersData) {
            if (playersData && playersData.length > 0) {
                for (var i = 0; i < playersData.length; i++) {
                    if (Player.playerMap[playersData[i].Name]) { //updating only existing Players
                        /* NOTE: we could have this live in the constructor, but would rather know what's been updated vs
                         having null values on certain Players

                         */
                        //it looks like some values might be set to "0" if null -- such as draft pick and wonderlic etc
                        //better to have these values null? or like "undrafted"?
                        Player.playerMap[playersData[i].Name].arms = parseInt(playersData[i].Arms) || null;
                        Player.playerMap[playersData[i].Name].hands = parseInt(playersData[i].Hands) || null;

                        //this data is fucked
                        Player.playerMap[playersData[i].Name].twentyYard = parseFloat(playersData[i].TwentyYD) || null;
                        Player.playerMap[playersData[i].Name].tenYard = parseFloat(playersData[i].TenYD) || null;

                        Player.playerMap[playersData[i].Name].broad = parseInt(playersData[i].Broad) || null;
                        Player.playerMap[playersData[i].Name].round = parseInt(playersData[i].Round) || null;
                        Player.playerMap[playersData[i].Name].pickRound = parseInt(playersData[i].PickRound) || null;
                        Player.playerMap[playersData[i].Name].pick = parseInt(playersData[i].Pick) || null;
                        Player.playerMap[playersData[i].Name].pickTotal = parseInt(playersData[i].PickTotal) || null;
                        Player.playerMap[playersData[i].Name].conference = playersData[i].Conference;
                        Player.playerMap[playersData[i].Name].wonderlic = parseInt(playersData[i].Wonderlic) || null;
                    }
                }
            }
        };

        Player._mapConferences = function () {
            if (Player.players && Player.players.length > 0) {
                for (var i = 0; i < Player.players.length; i++) {
                    Player.players[i].conference = PlayerUtilities.collegeConferenceMap[Player.players[i].college] || 'Other';
                }
            }
        };

        Player.metrics = [
            {
                key: 'height',
                value: 'Height (cm)'
            },
            {
                key: 'weight',
                value: 'Weight (kgs)'
            },
            {
                key: 'fortyYard',
                value: '40 yard dash'
            },
            {
                key: 'vertLeap',
                value: 'Vertical leap'
            },
            {
                key: 'broadJump',
                value: 'Broad jump (cm)'
            },
            {
                key: 'benchPress',
                value: 'Bench press (reps)'
            }
        ];

        Player.combineYears = [
            '1999', '2001', '2002', '2003', '2004', '2005', '2006',
            '2009', '2010', '2011', '2012', '2013', '2014', '2015'
        ];


        return Player;
    })
    .service('PlayerUtilities', function () {

        this.conferenceMap = {
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

        this.collegeConferenceMap = {
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
            'Mississippi': 'SEC',
            'Texas A&M': 'SEC',
            'Arizona': 'PAC-12',
            'California': 'PAC-12',
            'Oregon': 'PAC-12',
            'Arizona State': 'PAC-12',
            'Oregon State': 'PAC-12',
            'Colorado': 'PAC-12',
            'Stanford': 'PAC-12',
            'UCLA': 'PAC-12',
            'Washington': 'PAC-12',
            'Southern California': 'PAC-12',
            'Washington State': 'PAC-12',
            'Utah': 'PAC-12',
            'Boston College': 'ACC',
            'Duke': 'ACC',
            'Clemson': 'ACC',
            'Georgia Tech': 'ACC',
            'Florida State': 'ACC',
            'Miami': 'ACC',
            'Louisville': 'ACC',
            'North Carolina': 'ACC',
            'North Carolina State': 'ACC',
            'Pittsburgh': 'ACC',
            'Syracuse': 'ACC',
            'Virginia': 'ACC',
            'Wake Forest': 'ACC',
            'Virginia Tech': 'ACC',
            'Indiana': 'Big Ten',
            'Illinois': 'Big Ten',
            'Maryland': 'Big Ten',
            'Iowa': 'Big Ten',
            'Michigan': 'Big Ten',
            'Minnesota': 'Big Ten',
            'Michigan State': 'Big Ten',
            'Nebraska': 'Big Ten',
            'Ohio State': 'Big Ten',
            'Northwestern': 'Big Ten',
            'Penn State': 'Big Ten',
            'Purdue': 'Big Ten',
            'Rutgers': 'Big Ten',
            'Wisconsin': 'Big Ten',
            'Baylor': 'Big 12',
            'Iowa State': 'Big 12',
            'Kansas': 'Big 12',
            'Kansas State': 'Big 12',
            'Oklahoma': 'Big 12',
            'Oklahoma State': 'Big 12',
            'TCU': 'Big 12',
            'Texas': 'Big 12',
            'Texas Tech': 'Big 12',
            'West Virginia': 'Big 12',
            'Cincinnati': 'American',
            'Connecticut': 'American',
            'East Carolina': 'American',
            'Houston': 'American',
            'Memphis': 'American',
            'Southern Methodist': 'American',
            'South Florida': 'American',
            'Temple': 'American',
            'Tulane': 'American',
            'Tulsa': 'American',
            'UCF': 'American',
            'Fresno State': 'Mountain West',
            'Air Force': 'Mountain West',
            'Hawaii': 'Mountain West',
            'Boise State': 'Mountain West',
            'Nevada': 'Mountain West',
            'Colorado State': 'Mountain West',
            'San Diego State': 'Mountain West',
            'New Mexico': 'Mountain West',
            'San Jose State': 'Mountain West',
            'Utah State': 'Mountain West',
            'UNLV': 'Mountain West',
            'Wyoming': 'Mountain West',
            'Florida Atlantic': 'Conference USA',
            'Louisiana Tech': 'Conference USA',
            'Florida International': 'Conference USA',
            'North Texas': 'Conference USA',
            'Marshall': 'Conference USA',
            'Rice': 'Conference USA',
            'Middle Tennessee State': 'Conference USA',
            'Southern Miss': 'Conference USA',
            'Old Dominion': 'Conference USA',
            'UTEP': 'Conference USA',
            'UAB': 'Conference USA',
            'UTSA': 'Conference USA',
            'Western Kentucky': 'Conference USA'
        };

        this.weightPick = function (round) {
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
        };

    });

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// DEPRECATED TREE MAP STUFF IS DOWN HERE, WE CAN USE IF YALL WANT
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

/* treemap */
//                    var treeMapData = initTreeMapData();
//
//                    var chart = new Highcharts.Chart({
//                        chart: {
//                            renderTo: 'treemap-container'
//                        },
//                        series: [{
//                            type: "treemap",
//                            layoutAlgorithm: 'squarified',
//                            allowDrillToNode: true,
//                            dataLabels: {
//                                enabled: false
//                            },
//                            levelIsConstant: false,
//                            levels: [{
//                                level: 1,
//                                dataLabels: {
//                                    enabled: true
//                                },
//                                borderWidth: 3
//                            }],
//                            data: treeMapData
//                        }],
//                        subtitle: {
//                            text: 'Click to drill down.'
//                        },
//                        title: {
//                            text: 'Conferences/Colleges with the best Draft Prospects'
//                        }
//                    });
//function initTreeMapData() {
//    var treeMapData = [],
//        runningTreeMapIds = {};
//
//    initCollegesAndDraftValues();
//
//    if (players && players.length > 0) {
//        for (conference in PlayerUtilities.conferenceMap) {
//            if (PlayerUtilities.conferenceMap.hasOwnProperty(conference)) { //check if exists
//                if (!runningTreeMapIds[PlayerUtilities.conferenceMap[conference].id]) { //if conference not added, add
//                    treeMapData.push({
//                        id: PlayerUtilities.conferenceMap[conference].id.toString(),
//                        name: conference,
//                        color: PlayerUtilities.conferenceMap[conference].color
//                    })
//                }
//            }
//        }
//
//        for (college in CollegeMap) {
//            if (CollegeMap.hasOwnProperty(college)) { //check if exists
//                if (!runningTreeMapIds[CollegeMap[college].id]) { //if college not added, add
//                    runningTreeMapIds[CollegeMap[college].id] = 1; //don't re-add
//
//                    treeMapData.push({
//                        id: CollegeMap[college].id.toString(),
//                        name: college,
//                        value: CollegeMap[college].draftValue,
//                        parent: ConferenceMap[CollegeConferenceMap[college]] ?
//                            ConferenceMap[CollegeConferenceMap[college]].id.toString() : '500008' //500008 = id for 'Other' conference
//                    })
//                }
//            }
//        }
//    }
//
//    return treeMapData;
//}
//
//function initCollegesAndDraftValues(players) {
//    if (players && players.length > 0) {
//        var pCollege = '',
//            collegeId = 100000; //start college ids at 100000 to avoid collision
//        for (var i = 0; i < players.length; i++) {
//            pCollege = players[i].college;
//
//            if (!CollegeMap[pCollege]) { //doesnt exist in college map, new college
//                collegeId++;
//
//                CollegeMap[pCollege] = {
//                    id: collegeId,
//                    draftValue: PlayerUtilities.weightPick(players[i].round),
//                    numPicks: 1
//                };
//            } else {
//                //id doesnt change..
//                CollegeMap[pCollege].draftValue += PlayerUtilities.weightPick(players[i].round);
//                CollegeMap[pCollege].numPicks++;
//            }
//
//            players[i].parent = collegeId; //set parentid for highcharts
//        }
//    }
//}

