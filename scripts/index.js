window.onload = function()
{
	var map = L.map("map").setView([39.50, -98.35], 5);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYWNtZXJyaW1hbiIsImEiOiJjazV2ZXUwb3oxM2c0M25yenJqdnVvdnBnIn0.ra4GCwZ-B5ou6_ha5ETnLg'
	}).addTo(map);
}