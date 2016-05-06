//Initialize variables


//Perform petitions to the API.
var Spotify = function () {
	var URL = 'https://api.spotify.com/v1/'
	_getSong = function (id, success_callback) {
		var query = 'tracks/' + encodeURI(id);
		return requestAPI(query, success_callback, false)
	}
	_findSongs = function (keyword, success_callback, number_of_songs) {
		var query = 'search?q=' + encodeURI(keyword) + '&type=track&limit=' + encodeURI(number_of_songs);
		return requestAPI(query, success_callback, true)
	}
	_getArtist = function (artist_id, success_callback) {
		var query = 'artists/' + encodeURI(artist_id);
		return requestAPI(query, success_callback, true)
	}
	_getAlbums = function (artist_id, success_callback) {
		var query = 'artists/' + encodeURI(artist_id) + '/albums';
		return requestAPI(query, success_callback, false)
	}

	requestAPI = function (query, success_callback, async_or_not) {
		$.ajax({
			url: URL + query ,
			success: success_callback,
			async: async_or_not
		});
	}
	return {
		getSong     :  _getSong,
        findSongs   :  _findSongs,
        getArtist   :  _getArtist,
        getAlbums 	:  _getAlbums
    }
};

//Request for song to Spotify, get it if possible and render it.
function getListOfSongs (keyword) {
	Spotify.findSongs(keyword, getListOfSongsSuccess, 7);
};
var getListOfSongsSuccess = function (response) {
	$('.songs-list').empty();
	if (response.tracks.items[0] !== undefined) {
		var songs = response.tracks.items
		songs.forEach( function(song) {
			renderSongInList(song.name, song.artists[0].name, song.id);
		});
	} else{
		$('.songs-list').empty();
		console.log("There is no songs");
	};
};
function renderSongInList (title, artist, id) {
	$('.songs-list').append('<li class="list-song padding-5 hover-fill-green hover-text-white" data-song-id="' + id + '"><i class="fa fa-music" aria-hidden="true"></i><strong>' + artist + '</strong> - ' + title + '</li>')
}

//Request for song to Spotify, get it if possible and render it.
function getSongById (id) {
	Spotify.getSong(id, getSongSuccess);
};
function findSong (keyword) {
	Spotify.findSongs(keyword, getSongSuccess, 1);
};
var getSongSuccess = function (response) {
	if (response.type == "track") {
		var song = response
	} else {
		if (response.tracks.items[0] !== undefined) {var song = response.tracks.items[0]}
	};
	var title = song.name
	var author = song.artists[0].name
	var cover = song.album.images[0].url
	var preview_url = song.preview_url
	var artist_id = song.artists[0].id
	renderSong(title, author, cover, preview_url);
	getArtist(artist_id);
	getAlbums(artist_id);
};
function renderSong (title, author, cover, preview_url) {
	$(".title").text(title);
	$(".author").text(author);
	$(".cover img").attr('src', cover);
	$("#card").flip('toggle');
	$("audio").attr('src', preview_url);
	$(".section-artist").removeClass('hidden');
}

//Request for Artist to Spotify, get it if possible and render it.
function getArtist (id) {
	Spotify.getArtist(id, getArtistSuccess);
};
var getArtistSuccess = function (response) {
	var name = response.name
	var genres = response.genres
	var followers = response.followers.total
	var popularity = response.popularity
	if (response.images[0] != undefined) { var picture = response.images[0].url } else{ var picture = 'unknown.jpg'};
	renderArtist(name, genres, picture, followers, popularity)
};
function renderArtist (name, genres, picture, followers, popularity) {
	$(".artist-header h2").text(name);
	$(".followers").text(followers);
	$(".popularity").text(popularity);
	if (genres.length == 0) {$(".artist-header small").text('unknown');} else{$(".artist-header small").text(genres);};
	$(".img-artist").attr('src', picture);
}

//Request for Albums to Spotify, get them if possible and render them.
function getAlbums (artist_id) {
	$(".bxslider").empty();
	Spotify.getAlbums(artist_id, getAlbumsSuccess);
	reloadSliderAlbums();
};
var getAlbumsSuccess = function (response) {
	response.items.forEach( function(album) {
		renderAlbum(album.images[0].url, album.name)
	});
};
function renderAlbum (album_img, album_name) {
	$(".bxslider").append('<div class="col-3"><span class="album-name hide">' + album_name + '</span><img class="img-album" src="' + album_img + '" alt=""></div>');
}

//Other functions
function reloadSliderAlbums () {
	sliderAlbums.reloadSlider({
		slideWidth: 160,
		minSlides: 2,
		maxSlides: 4,
		slideMargin: 0
	});	
}
function printTime () {
  var current = $('.js-player').prop('currentTime');  
  $('.seekbar progress').attr('value', current)

}
function play (nopause) {
	if ($('.btn-play').hasClass('playing') && nopause == false) {
		$('.js-player').trigger('pause');
		$('.btn-play').removeClass('playing');
	} else{
		$('.js-player').trigger('play');
		$('.btn-play').addClass('playing');
	};
}

//Load on document ready.
$(function(){
	Spotify = new Spotify;

	sliderAlbums = $('.bxslider').bxSlider({
	    slideWidth: 160,
	    minSlides: 2,
	    maxSlides: 4,
	    slideMargin: 0,
	    pager: false
	});
	$('.js-player').on('timeupdate', printTime);
	$("#card").flip({
	  trigger: 'manual'
	});

	$('.song-form').on('submit', function (event) {
		event.preventDefault();
				var keyword = $('.input-song').val();
		findSong(keyword);
		$('.cover').removeClass('hidden');
		$('main').removeClass('hidden')
		$('.header').removeClass('hidden')
		$('.btn-play').removeClass('playing');
		;
	});
	$('.btn-play').on('click', function () {
		play(false);
	})
	$('.input-song').focus(function() {
	    $(this).attr('data-default', $(this).width());
	    $(this).animate({ width: 300 }, 'slow');
	});
	$('.albums').hover(function() {
	    $('.album-name').toggleClass('hide');
	});
	$('.input-song').keyup(function() {
		var keyword = $('.input-song').val();
		if (keyword != "" && keyword.length > 3) {
			$('main').removeClass('hidden')
			$('.cover').removeClass('hidden');
			$('.cover').addClass('hidden');
			getListOfSongs(keyword)
		};
	});
	$('.songs-list').on('click', '.list-song', function (event) {
		var $button = $(event.currentTarget);
		var songId = $button.data("song-id");
		$('.input-song').val('');
		$('.cover').removeClass('hidden');
		$('.header').removeClass('hidden')
		getSongById(songId);
		play(true);
		$('.songs-list').empty();
	});
});