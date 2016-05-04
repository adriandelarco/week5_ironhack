var map;

if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(onLocation, onError);
}

function onLocation(position){
  var myPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  createMap(myPosition);
  setupAutocomplete();
}
  
function onError(err){
  console.log("What are you using, IE 7??", err);
}

function createMap(currentposition){
  map = new google.maps.Map($('#map')[0], {
    center: currentposition,
    zoom: 17
  });
  createMarker(currentposition, "My location");
  createVisitedMarkers();
}

function createMarker(position, address) {
  var marker = new google.maps.Marker({
   position: position,
   map: map
  });
  createInfoWindow(marker,address);
}

function  createInfoWindow (marker, address) {
  var infowindow = new google.maps.InfoWindow({
    content: address
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function createVisitedMarkers () {
  var VisitedPositions = getVisitedPositions();
  $.makeArray(VisitedPositions).forEach( function(position) {
    createMarker(position.pos, position.add)
  });
}

function getVisitedPositions() {
  return JSON.parse(window.localStorage.getItem("positions"));
}

function setupAutocomplete(){
  var input = $('#get-places')[0];
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function(){
    var place = autocomplete.getPlace();
    if (place.geometry.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
      createMarker(place.geometry.location,place.formatted_address);
      saveLocation(place.geometry.location,place.formatted_address);
    } else {
      alert("The place has no location...?")
    }
  });
}

function saveLocation (position,address) {
  var oldPositions = JSON.parse(localStorage.getItem('positions')) || [];
  
  var newPosition = {
    pos: position,
    add: address
  };
  oldPositions.push(newPosition);
  localStorage.setItem('positions', JSON.stringify(oldPositions));
}