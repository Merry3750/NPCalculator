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
		.then(function(response){
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
				console.log(map.getCenter())
				L.popup({"className":"error"}).setLatLng(map.getCenter()).setContent("Unable to find " + address).openOn(map);
			}
		});
	};

	//call the on click for the submit button when the user hits enter
	document.getElementById('addressInput').onkeypress = function(e)
	{
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == '13'){
			document.getElementById("addressSubmit").onclick();
		}
	}
}

