/**
 * Obtains parameters from the hash of the URL
 * Gotten from Spotify auth-examples at:
 * https://github.com/spotify/web-api-auth-examples
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
	  q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
	 hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
	userProfileTemplate = Handlebars.compile(userProfileSource),
	userProfilePlaceholder = document.getElementById('user-profile');

var params = getHashParams();

var access_token = params.access_token,
	refresh_token = params.refresh_token,
	error = params.error;

if(error){
	alert('There was an error during the authentication');
} else {
	if(access_token){
		$.ajax({
			url: 'https://api.spotify.com/v1/me',
			headers: {
			  'Authorization': 'Bearer ' + access_token
			},
			success: function(response){
				userProfilePlaceholder.innerHTML = userProfileTemplate(response);

				$('#login').hide();
				$('#loggedin').show();
				document.getElementById('curr-track').innerHTML="No currently playing song :(";
			}
		});

		//trying to get the friggin current song
		$.ajax({
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			type: 'GET',
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response){
				if(response.item === null){
					document.getElementById('curr-track').innerHTML="No currently playing song.";
				}else{
					document.getElementById('curr-track').innerHTML=response.item.name;
				}
			}
		})
	}else{
		$('#login').show();
		$('#loggedin').hide();
	}
}

// window.setInterval(function getCurrentSong(){
	// if(access_token){
	// 	$.ajax({
	// 		url: 'https://api.spotify.com/v1/me/player/currently-playing',
	// 		headers: {
	// 			'Authorization': 'Bearer ' + access_token
	// 		},
	// 		success: function(response){
	// 			if(response.item === null){
	// 				document.getElementById('curr-track').innerHTML="No currently playing song.";
	// 			}else{
	// 				document.getElementById('curr-track').innerHTML=response.item.name;
	// 			}
	// 		}
	// 	})
	// }
// },2000);
