// lyar Aisarov CSE383 Final Project
const KEY = '3IFlN2R9hkBCqguu0cbeiuz00yonYO5d';
const URL = 'http://aisaroi.aws.csi.miamioh.edu/final.php?method=getLookup&date=';
var data = {};

/**
 * hist method is called when button is pressed. Prints a table that contains the latest requests
 */
function hist() {
    a = $.ajax({
        url: URL + $("#date").val(),
        method: "GET"
    }).done(function(result) {
        var arr = result.result;
        writeTable(arr)
    }).fail(function(er) {
        console.log("error", error.statusText);
        alert(er.statusText);
    });
}

/**
 * Method to convert time in seconds into hours/minutes/seconds
 * @param {*} seconds time in seconds
 * @returns time converted
 */
 function convert(seconds) {
    var time = "";
    if (Math.floor(seconds/3600)!=0) {
        time+=Math.floor(seconds/3600) + " hours ";
    }
    if (Math.floor(seconds/60)!=0) {
        time+=Math.floor(seconds/60) + " minutes ";
    }
    time+=seconds%60 + " seconds";
    return time;
}

/**
 * Helper method to print the table using the supplied array
 * @param {*} arr array of objects, retrieved from the database
 */
function writeTable(arr) {
    data = {};
    $("#hd").html("");
    $("#bd").html("");
    if ($("#maxNum").val() < 1) {
        alert("invalid number of listings");
    } else if (arr.length === 0) {
        alert("There is no history for the given date");
    } else {
        // Set the endpoint for the output
        var end = Math.min($("#maxNum").val(), arr.length);
        // Print the headers
        $("#hd").html('<tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Time</th><th scope="col">From</th><th scope="col">To</th><th scope="col">Number Of Maneuvers</th></tr>');
        // Print the rows for the given table
        for (let i = 0; i < end; i++) {
            var obj = JSON.parse(arr[i].value);
            data[i] = obj;
            $("#bd").append('<tr id="' + i + '" onclick="print(this)"><th scope="row">' + (i + 1) + '</th><td>' + arr[i].date + '</td><td>' 
                            + obj.time + '</td><td>' + obj.from + '</td><td>' + obj.to + '</td><td>' + obj.maneuvers.length + '</td></tr>');
        }
    }
}

/**
 * Print method is called when the table rows are clicked. Prints the output for the selected directions request
 * @param {*} element row clicked
 */
function print(element) {
    $("#outp2").html("");
    var arr = data[element.id].maneuvers;
    for (let i = 0; i < arr.length; i++) {
        $("#outp2").append("<br>" + arr[i].narrative + "<br>Distance: " + arr[i].distance + " km<br>Time: " +
            convert(arr[i].time) + "<br>" + "<img src=\"" + arr[i].mapUrl + "\"><br>");
    }
    $("#outp2").append("<h4>Finish. Thank You For Using Our Service.</h4>");
    $("#outp2").append("<img src=\"" + data[element.id].elevation + "\"><br>");
}
