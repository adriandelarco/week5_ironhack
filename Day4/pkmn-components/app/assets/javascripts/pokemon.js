PokemonApp.Pokemon = function (pokemonUri) {
	this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function(){
	console.log("Redndering pokemon: #" + this.id);
	var self = this;
	$.ajax({
		url: '/api/pokemon/' + this.id,
		success: function (response) {
			self.info = response;

			$(".js-pkmn-name").text(self.info.name);
			$(".js-pkmn-number").text(self.info.pkdx_id);
			$(".js-pkmn-height").text(self.info.height);
			$(".js-pkmn-weight").text(self.info.weight);
			PokemonApp.Pokemon.prototype.renderDescription(self.info.descriptions);

			if (self.info.sprites[0] !== undefined) { PokemonApp.Pokemon.prototype.renderImg(self.info.sprites[0].resource_uri);}

			if (self.info.evolutions[0] !== undefined) {
				$(".js-pkmn-evolution").removeClass('hidden');
				$(".js-pkmn-evolution").data("evolution-uri", self.info.evolutions[0].resource_uri);
				$(".js-pkmn-evolution").data("evolution-name", self.info.name);
			} else {
				console.log('No evolution')
			}

			$(".js-pokemon-modal").modal("show");
		}
	});
};

PokemonApp.Pokemon.prototype.renderImg = function(uri){
	$.ajax({
		url: uri,
		success: function (response) {
			$(".js-pkmn-img").attr('src', 'http://pokeapi.co'+ response.image);
		}
	});
};

PokemonApp.Pokemon.prototype.renderDescription = function(descriptions){
	var highest_uri = 0
	$.makeArray(descriptions).forEach( function(description) {
		var uri_number = parseInt(description.resource_uri.split('/').slice(-2)[0])
		if (uri_number > highest_uri) {
			highest_uri = uri_number
		}
	});
	$.ajax({
		url: '/api/v1/description/' + highest_uri +'/',
		success: function (response) {
			$(".js-pkmn-description").text(response.description);
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
		$(".js-pkmn-evolution").addClass('hidden');
		var $button = $(event.currentTarget);
		var pokemonUri = $button.data("pokemon-uri");
		var pokemon = new PokemonApp.Pokemon(pokemonUri);
		pokemon.render();
	});
	$('.modal-body').on('click', ".js-pkmn-evolution", function(event) {
		$(".js-pkmn-evolution").addClass('hidden');
		$(".div-evolutions .col-sm-3").remove();
		var $button = $(event.currentTarget);
		var evolutionUri = $button.data("evolution-uri");
		var evolutionName = $button.data("evolution-name");
		var evolution = new PokemonApp.Evolution(evolutionUri, evolutionName);
		evolution.getEvo();
	});
});