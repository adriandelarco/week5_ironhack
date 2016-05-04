// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

PokemonApp.Pokemon = function (pokemonUri) {
	this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function(){
	console.log("Rednderin pokemon: #" + this.id);
	var self = this;
	$.ajax({
		url: '/api/pokemon/' + this.id,
		success: function (response) {
			self.info = response;
			$(".js-pkmn-name").text(self.info.name);
			$(".js-pkmn-number").text(self.info.pkxd_id);
			$(".js-pkmn-height").text(self.info.height);
			PokemonApp.Pokemon.prototype.renderImg(self.info.sprites[0].resource_uri);
			PokemonApp.Pokemon.prototype.renderDescription(self.info.descriptions);
			$(".js-pkmn-weight").text(self.info.weight);
			$(".js-pokemon-modal").modal("show");
			debugger
		}
	});
};

PokemonApp.Pokemon.prototype.renderImg = function(uri){
	$.ajax({
		url: uri,
		success: function (response) {
			$(".js-pkmn-img").attr('src', 'http://pokeapi.co'+ response.image);
			$(".js-pkmn-img").toggleClass('hidden');
		}
	});
};

PokemonApp.Pokemon.prototype.renderDescription = function(descriptions){
	var higher_uri = 0
	$.makeArray(descriptions).forEach( function(description) {
		var uri_number = parseInt(description.resource_uri.split('/').slice(-2)[0])
		if (uri_number > higher_uri) {
			higher_uri = uri_number
		}
	});
	$.ajax({
		url: '/api/v1/description/' + higher_uri +'/',
		success: function (response) {
			$(".js-pkmn-description").text(response.description);
			$(".js-pkmn-description").toggleClass('hidden');
		}
	});
};


PokemonApp.Pokemon.idFromUri = function (pokemonUri) {
	var uriSegments = pokemonUri.split("/");
	var secondLast = uriSegments.length - 2;
	return uriSegments[secondLast];
};

$(document).on("ready", function (){
	$('.js-show-pokemon').on("click", function(event){
		var $button = $(event.currentTarget);
		var pokemonUri = $button.data("pokemon-uri");

		var pokemon = new PokemonApp.Pokemon(pokemonUri);
		pokemon.render();
	});
});