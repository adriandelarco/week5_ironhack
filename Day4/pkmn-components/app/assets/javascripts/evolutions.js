PokemonApp.Evolution = function (evolutionUri, evolutionName) {
	this.uri = evolutionUri;
	this.name = evolutionName;
};

PokemonApp.Evolution.prototype.getEvo = function() {
	console.log("Rendering Evolution: #" + this.name);
	var self = this;
	$.ajax({
		url: this.uri,
		success: function (response) {
			self.info = response;
			//Render first evolution
			if (self.info.sprites[0] !== undefined) { 
				PokemonApp.Evolution.prototype.renderEvo(self.info.sprites[0].resource_uri, self.info.name)
			;}
			//Iterate this protoype to render all next evolutions
			if (self.info.evolutions[0] !== undefined) { 
				var new_evo = new PokemonApp.Evolution(self.info.evolutions[0].resource_uri, self.info.name);
				new_evo.getEvo();
			} else {
				console.log('No more evolutions');
			}
			$(".js-evolution-modal").modal("show");
		}
	});
};

PokemonApp.Evolution.prototype.renderEvo = function(uri, name){
	$.ajax({
		url: uri,
		success: function (response) {
			$('.div-evolutions').append('<div class="col-sm-3 evolution-img"><img class="evo-img" uri="' + uri + '" src="http://pokeapi.co' + response.image + '"><p class="text-center">' + name + '</p></div>');
		}
	});
};

$(document).on("ready", function (){
	$('.evo-img').on("click", function(event){
		var $img = $(event.currentTarget);
		var pokemonUri = $img.attr("uri");
		var pokemon = new PokemonApp.Pokemon(pokemonUri);
		pokemon.render();
	});
});