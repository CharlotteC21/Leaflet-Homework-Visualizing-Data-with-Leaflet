//fetch call/async func
async function main() {

    //Fetch data 
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson");
    const data = await response.json();

    createFeatures(data);
}
//binding/visuals
function createFeatures(data) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, 
            {
                radius:getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: getColor(feature.geometry.coordinates[2])
            });
    }    

    //labeling magnitude differentials/sort
    function getRadius(mag) {
        return mag > 6 ? 20:
            mag > 5.7 ? 15:
            mag > 5.4 ? 13:
            mag > 5.1 ? 11:
            mag > 4.8 ? 9:
            mag > 4.5 ? 7:
            mag > 4.2 ? 5:
            2;
    }

    function getColor (d) {
        return d > 100 ? '#0000ad' :
            d > 50  ? '#2424ff' :
            d > 20  ? '#00adad' :
            d > 15  ? '#24ffff' :
            d > 10   ? '#ffff24' :
            d > 5   ? '#FEB24C' :
            d > 2   ? '#ffc252' :
            '#570000';
    }

    ////https://html-color.codes/ --- used this to amend color codes for color blindness

    // Created GeoJSON layer which contains features array on earthquakeData obj
    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    //Create baseMaps
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    //Create an overlay obj for overlay
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Create map giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        37.7, -122.4
        ],
        zoom: 3,
        layers: [street, earthquakes]
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        grades = [0, 2, 5, 10, 15, 20, 50, 100]
        var labels = [];
        var colors= [
            '#0000ad', '#2424ff', '#00adad', '#24ffff', '#52ff52', '#ffff24', '#ffc252', '#570000'
        ];

        var legendInfo = "<h3>Size of Earthquake</h3>"
            ;

        div.innerHTML=legendInfo;
        //for loop sizing/color
        for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? ""  + "<br>" : "");
            }
        return div;
    };

    //Adding legend to map
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    //closeout
}
main();