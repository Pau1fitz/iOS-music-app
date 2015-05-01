angular.module('songhop.services', [])

.factory('User', function(){

	var o = {
		favorites: [],
		newFavorites: 0
	}

	o.addSongToFavorites = function(song){
		if(!song) return false;
		o.favorites.unshift(song);
		o.newFavorites++;
	}

	o.removeSongFromFavorites = function(song, index){
		if(!song) return false;
		o.favorites.splice(index, 1)
	}

	o.favoriteCount = function(){
		return o.newFavorites;
	}

	return o;

})

.factory('Recommendations', function($http, SERVER, $q){

	var media;

	var o = {
		queue: []
	}

	o.getNextSongs = function() {
    	return $http({
      	method: 'GET',
      	url: SERVER.url + '/recommendations'
    	}).success(function(data){
      	// merge data into the queue
      	o.queue = o.queue.concat(data);
    });
  }

    o.nextSong = function() {
    // pop the index 0 off
    o.queue.shift();

    o.haltAudio();

    // low on the queue? lets fill it up
    if (o.queue.length <= 3) {
      o.getNextSongs();
    }

  }

  o.playCurrentSong = function() {
    var defer = $q.defer();

    // play the current song's preview
    media = new Audio(o.queue[0].preview_url);

    // when song loaded, resolve the promise to let controller know.
    media.addEventListener("loadeddata", function() {
      defer.resolve();
    });

    media.play();

    return defer.promise;
  }

  // used when switching to favorites tab
  o.haltAudio = function() {
    if (media) media.pause();
  }

    o.init = function() {
    if (o.queue.length === 0) {
      // if there's nothing in the queue, fill it.
      // this also means that this is the first call of init.
      return o.getNextSongs();

    } else {
      // otherwise, play the current song
      return o.playCurrentSong();
    }
  }


	return o;
});
