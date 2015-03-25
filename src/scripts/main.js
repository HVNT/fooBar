/**
 * Created with WebStorm.
 * User: hunt
 * Date: 3/25/15
 * Time: 4:33 PM
 * File:
 */

/* RUNNING BACK SERVICE OBJECT */
function RB (data) {
    data = data || {};
    this.rawData = data;

    //Year,Name,College,POS,Height (in),Weight (lbs),Wonderlic,40 Yard,Bench Press,Vert Leap (in),Broad Jump (in),Shuttle,3Cone
    this.combineYear = data.Year || null;
    this.name = data.Name || null;
    this.college = data.College || null;
    this.pos = data.POS || null;
    this.height = data.Height || null;

    return this;
}

/* GO */
$.ajax({
    type: "GET",
    url: "/data/combine_clean.csv",
    dataType: "text",
    success: function(dataClean) {

        /* chain ajax requests */
        $.ajax({
            type: "GET",
            url: "/data/combine_clean.csv",
            dataType: "text",
            success: function(dataDirty) {

                /* now have all the data, bootstrap up document */
                $(document).ready(function () {


                    /* HIGHCHARTS STUFF*/
                    $('.treemap-container').highcharts({
                        series: [{
                            type: "treemap",
                            layoutAlgorithm: 'stripes',
                            alternateStartingDirection: true,
                            levels: [{
                                level: 1,
                                layoutAlgorithm: 'sliceAndDice',
                                dataLabels: {
                                    enabled: true,
                                    align: 'left',
                                    verticalAlign: 'top',
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: 'bold'
                                    }
                                }
                            }],
                            data: [{
                                id: 'A',
                                name: 'Apples',
                                color: "#EC2500"
                            }, {
                                id: 'B',
                                name: 'Bananas',
                                color: "#ECE100"
                            }, {
                                id: 'O',
                                name: 'Oranges',
                                color: '#EC9800'
                            }, {
                                name: 'Anne',
                                parent: 'A',
                                value: 5
                            }, {
                                name: 'Rick',
                                parent: 'A',
                                value: 3
                            }, {
                                name: 'Peter',
                                parent: 'A',
                                value: 4
                            }, {
                                name: 'Anne',
                                parent: 'B',
                                value: 4
                            }, {
                                name: 'Rick',
                                parent: 'B',
                                value: 10
                            }, {
                                name: 'Peter',
                                parent: 'B',
                                value: 1
                            }, {
                                name: 'Anne',
                                parent: 'O',
                                value: 1
                            }, {
                                name: 'Rick',
                                parent: 'O',
                                value: 3
                            }, {
                                name: 'Peter',
                                parent: 'O',
                                value: 3
                            }, {
                                name: 'Susanne',
                                parent: 'Kiwi',
                                value: 2,
                                color: '#9EDE00'
                            }]
                        }],
                        title: {
                            text: 'Fruit consumption'
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
