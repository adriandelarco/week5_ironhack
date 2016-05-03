$(function(){
	$('.artist-form').on('submit', function (event){
		event.preventDefault();
		get_artists($('#artist-input').val());
	});
	$(document).delegate('img', 'click', function () {
		var artist_id = $(this).attr("id");
		var artist_name = $(this).attr("alt");
		var pre_url = "https://api.spotify.com/v1/artists/"
		var post_url = "/albums"
		getSomething('album', artist_id, artist_name, pre_url, post_url)
		$('#myModal').modal('show')
	});
	$(document).delegate('.album-button', 'click', function () {
		var album_id = $(this).attr("id");
		var album_name = $(this).text();
		var pre_url =  "https://api.spotify.com/v1/albums/"
		var post_url = "/tracks"
		getSomething('track', album_id, album_name, pre_url, post_url)
		$('#myModal').modal('show')
	})
});
function get_artists(keyword) {
	$('.artists .artist').remove();
	var url = "https://api.spotify.com/v1/search?type=artist&query="
	$.get((url+keyword), printArtists)
	function printArtists (artists) {
		artists.artists.items.forEach(function (artist){
			appendArtist(artist);
		});
	}
}
function appendArtist (artist){
	var html = '<div class="artist col-sm-6 col-md-3"></div>'
	var html_image = '<div class="thumbnail"><img src="' + artist.images[1].url + '" alt="' + artist.name+'" id="'+ artist.id +'"></div>'
	var html_caption = ' <div class="caption"><h5><strong>' + artist.name + '</strong></h5></div>'
	$('.artists').append(html);
	$('.artists .artist:last-child').append(html_image);
	$('.artists .artist:last-child .thumbnail').append(html_caption);
}
function getSomething(something_type, something_id, something_name, pre_url, post_url){
	$('.modal-list button').remove();
	$('.modal-title').text('Tracks of ' + something_name);
	$.get((pre_url+something_id+post_url), printSomething);
	function printSomething (somethings) {
		somethings.items.forEach(function (something){
			appendSomething(something_type, something);
		});
	}
}
function appendSomething (something_type, something){
	$('.modal-list').append('<button type="button" class="'+something_type+'-button list-group-item" id="'+something.id+'">'+something.name+'</button>');
	if (something_type === "track") {
		$('.modal-list button:last-child').append('<audio controls><source src="'+something.preview_url+'" type="audio/ogg"></audio>')
	}
}
function showModal (id){
	$('#modal-artist-'+ id +'').modal('show')
}