// lyar Aisarov CSE383 Final Project
const KEY = '3IFlN2R9hkBCqguu0cbeiuz00yonYO5d';
const URL1 = 'http://www.mapquestapi.com/directions/v2/route';
const URL2 = 'http://aisaroi.aws.csi.miamioh.edu/final.php?method=setLookup&location=45056&sensor=1';
const URL3 = 'https://open.mapquestapi.com/elevation/v1/chart?key=3IFlN2R9hkBCqguu0cbeiuz00yonYO5d&shapeFormat=raw&width=425&height=350&latLngCollection='
/**
 * send method sends the supplied JSON file to the database using the rest server
 * @param {*} insert JSON file containing the information about the last request
 */
function send(insert) {
    a = $.ajax({
        method: "POST",
        url: URL2,
        data: {value : JSON.stringify(insert)}
    }).done(function() {
        // done
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
 * direction method is called when the button is pressed. Prints the directions from 1 address to another
 */
function directions() {
    if ($("#from").val() == "" || $("#to").val() == "") {
        alert("Must supply both addresses");
    } else {
        // Variable that stores a collection of latitudes and longitudes that are later used to get an elevation chart
        var latlng = "";
        a = $.ajax({
            url: URL1 + "?" + $.param({
                "key": KEY,
                "from": $("#from").val(),
                "to": $("#to").val()
            }),
            method: "GET"
        }).done(function(result) {
            $("#outp").html("");
            // -400 errorCode indicates that the call was successful
            // If it's not the same ErrorCode then one of the inputs is incorrect
            if (result.route.routeError.errorCode!="-400") {
                alert("Invalid input address");
                return;
            }
            var route = result.route.legs[0].maneuvers;
            var mvr = [];
            var distance = 0;
            for (let i = 0; i < route.length - 1; i++) {
                $("#outp").append("<br>" + route[i].narrative + "<br>Distance: " + route[i].distance + " km<br>Time: " +
                    convert(route[i].time) + "<br>" + "<img alt=\"Thank You For Using Our Service\" src=\"" + route[i].mapUrl + "\"><br>");
                // since the mapquest API doesn't accept the long distances, we're only taking the first
                // 250 km on the route for the elevation chart
                if (distance < 250) {
                    latlng += route[i].startPoint.lat + "," + route[i].startPoint.lng + ",";
                    distance += route[i].distance;
                }
                // Create object that contains only necessary information for the given maneuvers
                var curUrl = route[i].mapUrl;
                var obj = {
                    "narrative": route[i].narrative,
                    "distance": route[i].distance,
                    "time": route[i].time,
                    "mapUrl": curUrl.substring(0,curUrl.search("session")-1)
                };
                mvr[i] = obj;
            }
            $("#outp").append("<h4>Finish. Thank You For Using Our Service.</h4>");
            // remove last comma
            var link = URL3 + latlng.substring(0, (latlng.length - 1));
            // object that's going to be sent to the database
            var insert = {
                "from": $("#from").val(),
                "to": $("#to").val(),
                "maneuvers": mvr,
                "elevation": link,
                "time":result.route.formattedTime
            };
            // Print the elevation chart
            $("#outp").append("<img src=\"" + link + "\"><br>");
            send(insert);
        }).fail(function(er) {
            console.log("error", error.statusText);
            alert(er.statusText);
        });
    }
}
