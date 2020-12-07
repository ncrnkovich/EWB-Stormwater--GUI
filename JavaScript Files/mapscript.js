        // Creates the map element, names it "mapid" and sets the view. Those are the coords of downtown SB.
        // Adds Mapbox Streets tile layer
        const mymap = L.map('mapid', {
            measureControl: true, // Enables measuring
            center: [41.68, -86.25], // Coordinates of DT south bend
            //sets start/min/max zoom level for the layer. May need to change to work on individual properties
            zoom: 13,
            minZoom: 10,
            maxZoom: 25,
            doubleClickZoom: true, //useful UI settings
            boxZoom: true, // can zoom by holding shift and dragging box with cursor

        });


        // // Add satellite layer to map
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            // mapbox/streets-v11 tiles from Mapbox's Static Tiles API
            // Attribution gives the copyright stuff at the bottom of the map. Important since this is for the government and we don't want them to get sued.
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            // this id specifies the type of layer. Satellite view with location tiles
            id: 'mapbox/satellite-streets-v10',
            // id: 'mapbox/streets-v11',
            tileSize: 512,
            // API automatically returns 512x512 tiles, need to specify tile size and offset zoom
            zoomOffset: -1,
            maxZoom: 25
        }).addTo(mymap);



        // //create popup marker
        var popup = L.popup()
            //control where it is on map with Latitude/longitude
            .setLatLng([41.68, -86.25])
            .setContent("Welcome to South Bend!")
            .openOn(mymap) //places on the map called "mymap"
            //openOn automatically closes previously opened popup when opening new one

        var searchControl = L.esri.Geocoding.geosearch().addTo(mymap);

        var results = L.layerGroup().addTo(mymap);

        searchControl.on('results', function(data) {
            results.clearLayers();
            for (var i = data.results.length - 1; i >= 0; i--) {
                results.addLayer(L.marker(data.results[i].latlng));
            }
        });