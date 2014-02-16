 //<![CDATA[
var map;
var infowindow;
$(document).keypress(function(e){
  if(e.which == 13){
    initialize();
    return  false;
  }
});
function initialize(divId,isit) {
var queryinput;
var query;
  if (isit == 'true'){
    queryinput = document.getElementById("search").value;
    query = queryinput.toLowerCase();
  }
  else{
    query = 'show_all';
  }
    console.log(query);
    $("#full_content").empty();
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById(divId),
    mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

          infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
          });
          var marker = new google.maps.Marker({
            map: map,
            position: pos,
            icon : "img/map_icon.png"
          });
          infowindow.setContent('<h5 style="margin:10px">Your location :)</h5>');

          var request = {
            location: pos,
            radius: 500,
            types: ['food']
          }; 

          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);

          //console.log(pos);

          map.setCenter(pos);
        }, function() {
        handleNoGeolocation(true);
        });

    }
    else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }

    var array = [];
    var div = document.getElementById("full_content");

    function userreview(){

    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        downloadUrl("http://talentedash.co.uk/veggps/php_to_xml.php",function(data){
          var xml = data.responseXML;
          var markers = xml.documentElement.getElementsByTagName("resdetails");
          var detail = xml.documentElement.getElementsByTagName("detail1");

          for (r = 0; r < detail.length; r++){
              var maindetail = detail[r].childNodes[0].getAttribute('name');
              var mainid = detail[r].childNodes[0].getAttribute('id');
              var address = detail[r].childNodes[0].getAttribute('address');
              var pc = detail[r].childNodes[0].getAttribute('pc');

              var dishes=[];
              for (j = 1; j<detail[r].childNodes.length;j++){  // start at 1 because 0 should be resdetails
                  var info = detail[r].childNodes[j].getAttributeNode('dishname');
                  var info_price = detail[r].childNodes[j].getAttributeNode('price');
                  if (info != null){
                      dishes.push([info.nodeValue,info_price.nodeValue]); 
                  };
              };
              array.push([mainid,address,pc,maindetail,dishes]);  
          };

          for (var i = 0; i < results.length; i++){
            var place = results[i];
            console.log(results[i]);
            for (d = 0;d < array.length; d++){
              for (z = 0; z<array[d][4].length; z++){
                for (m = 0; m < array[d][4][z].length; m++ ){
                  nameres = array[d][3].replace(/&#39;/g,"'");
                  if (place.name == nameres && array[d][4][z][m].indexOf(query) > -1){
                    createMarker(results[i]);
                    $(div).show();
                    div.innerHTML += 
                    "<h2>"+array[d][4][z].join(" - ")+"</h2>"+
                    "<p>"+place.name+"</p>"+
                    "<p>"+place.vicinity + " - " + array[d][2] + "</p>";
                  }
                  if(!query || query == "show_all"){
                    if(place.name == nameres){
                      createMarker(results[i]);
                      $(div).hide();
                    }
                  }
                };//array -> dish content loop end

              };//array -> dish loop end

            };//array loop end

          };//main result loop end
        console.log(array);
        });//download url function end

      };

    };


    function createMarker(place) {
      var placeLoc = place.geometry.location;
           var contentString = 
           '<div id="content">'+
                '<h1 id="firstHeading" class="firstHeading">'+place.name+'</h1>'+
                '<h5>'+place.vicinity+'</h5>'+
                '<div id="bodyContent">'+
                '<p>'+array[d][2]+'</p>'+
                '<p>'+array[d][4]+'</p>'+
                '<a href="#" class="reviews" onclick="userreview();">View User Reviews</a>'
                '</div>'+
            '</div>';
      var marker = new google.maps.Marker({
        map: map,
        content: contentString,
        position: place.geometry.location,
        maxWidth: 500,
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, this);
      });

    };
};//main initialize function end

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
  new ActiveXObject('Microsoft.XMLHTTP') :
  new XMLHttpRequest;

  request.onreadystatechange = function() {
  if (request.readyState == 4) {
    request.onreadystatechange = doNothing;
    callback(request, request.status);
  }
};

function doNothing() {}
  request.open('GET', url, true);
  request.send(null);
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed, please enable from setting.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}
  
  //]]>