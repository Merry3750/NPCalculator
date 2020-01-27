window.onload = function()
{
	var map = L.map("map").setView([39.50, -98.35], 5);

	L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
		maxZoom: 18,
		id: "mapbox/streets-v11",
		accessToken: "pk.eyJ1IjoiYWNtZXJyaW1hbiIsImEiOiJjazV2ZXUwb3oxM2c0M25yenJqdnVvdnBnIn0.ra4GCwZ-B5ou6_ha5ETnLg"
	}).addTo(map);

	var markers = L.layerGroup().addTo(map);

	//clear markers and popups when user clicks elsewhere on the map
	map.on("click", function()
	{
		markers.clearLayers();
	});

	//con click submit, go to entered address and zoom the appropriate amount
	document.getElementById("addressSubmit").onclick = function()
	{
		var address = document.getElementById("addressInput").value;

		//serch location using mapbox API
		fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(address) + ".json?access_token=pk.eyJ1IjoiYWNtZXJyaW1hbiIsImEiOiJjazV2ZXUwb3oxM2c0M25yenJqdnVvdnBnIn0.ra4GCwZ-B5ou6_ha5ETnLg")
		.then(function(data){return data.json();})
		.then(function(response)
		{
			if(response && response.features && response.features[0])
			{
				console.log(response.features[0]);
				target = response.features[0]

				//clear markers and add a new one on the searched location
				markers.clearLayers();
				marker = L.marker([target.center[1], target.center[0]]).addTo(markers);
				marker.bindPopup(target.place_name).openPopup()

				//set view to searched location
				map.setView([target.center[1], target.center[0]], 18);

				//if searched location has a bounding box, zoom out to contain the whole area
				if(target.bbox)
				{
					map.fitBounds([
						[target.bbox[1], target.bbox[0]],
						[target.bbox[3], target.bbox[2]]
					]);
				}
			}
			//display error if search yields no results
			else
			{
				L.popup({className:"error"}).setLatLng(map.getCenter()).setContent("Unable to find " + address).openOn(map);
			}
		});
	};

	//call the on click for the submit button when the user hits enter
	document.getElementById("addressInput").onkeypress = function(e)
	{
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == "13"){
			document.getElementById("addressSubmit").onclick();
		}
	}

	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawPluginOptions = {
		position: "topleft",
		draw: 
		{
			polygon: 
			{
				allowIntersection: false,
				drawError: 
				{
					color: "#F00", // Color the shape will turn when intersects
					message: "Please do not draw intersecting shapes"
				},
				shapeOptions: 
				{
					color: "#0F0"
				}
			},
			// disable toolbar item by setting it to false
			polyline: false,
			circle: false,
			rectangle: false,
			marker: false,
		},
		edit: 
		{
			featureGroup: drawnItems,
		}
	};

	var drawControl = new L.Control.Draw(drawPluginOptions);
	map.addControl(drawControl);

	//when the user draws a polygon, add it to the list and do the calculations
	map.on("draw:created", function(e) 
	{
		var layer = e.layer;

		drawnItems.addLayer(layer);
		doCalculations(layer);
		layer.openPopup();
	});	

	var updateCalculations = function()
	{
		drawnItems.eachLayer(function (layer) {
			doCalculations(layer);
		});
	};

	//when the user edits a polygon, update the calculations
	map.on('draw:edited', updateCalculations);
	document.getElementById("tiltInput").onchange = updateCalculations;

}

//calculating nominal power
function doCalculations(layer)
{
	var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]).toFixed(2);
	var efficiency = 0.20; //assuming 20% yield
	var peakPower = (area * efficiency).toFixed(2);

	popupText = "";
	popupText += "Area: " + area + "m<sup>2</sup><br />";
	popupText += "Nominal Power: " + peakPower + "kWp<br />";

	var tilt = parseFloat(document.getElementById("tiltInput").value);
	console.log(typeof tilt)
	if(tilt && tilt > 0)
	{
		var tiltRadians = tilt * Math.PI / 180.0;
		var tiltArea = (area * Math.cos(tiltRadians)).toFixed(2);
		var tiltPeakPower = (tiltArea * efficiency).toFixed(2);

		popupText += "Projected Area: " + tiltArea + "m<sup>2</sup><br />";
		popupText += "Porjected Nominal Power: " + tiltPeakPower + "kWp<br />";
	}

	layer.bindPopup(popupText);
}

