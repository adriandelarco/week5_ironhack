if ("geolocation" in navigator) {
  var button = $('#where-am-i');
  button.on('click', getLocation);
} else {
  alert("Geolocation is not available")
}

function getLocation() {
  console.log('Getting location...');
  navigator.geolocation.getCurrentPosition(onLocation, onError, options);
}

var options = {
  enableHighAccuracy: true 
};

function onLocation (position) {
  var lat = position.coords.latitude
  var lon = position.coords.longitude
  $('#location').toggleClass('hidden');
  $('#location').text('Your position is: ' + lat.toFixed(2) + ' /  ' + lon.toFixed(2))
  displayMap(lat, lon);
}

function onError(error) {
  console.log("Getting location failed: " + error);
}

function displayMap(lat, lon) {
	$('#map').toggleClass('hidden');
	 $('#map').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?&zoom=13&size=900x600&maptype=roadmap&markers=color:black%7Clabel:PP%7C'+lat+','+lon+'&key=%20AIzaSyBm63PZOw-72wO2shBXGy0b_maFxO_CF6M')
}