 //<![CDATA[
var map;
var infowindow;
$(document).keypress(function(e){
  if(e.which == 13){
    initialize();
    return  false;
  }
});
function initialize() {
    console.log(document.getElementById("search").value)
    var queryinput = document.getElementById("search").value;
    var query = queryinput.toLowerCase();
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
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

    function userreview(){

    }

    function callback(results, status) {
      //$("#details").empty();
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
                  if (info != null){
                      dishes.push(info.nodeValue); 
                  }
              }
              array.push([mainid,address,pc,maindetail,dishes]);  
          }
          for (var i = 0; i < results.length; i++){
            var place = results[i];
            //console.log(results[i].id + " " + results[i].name);
            console.log(results[i]);
            for (d = 0;d < array.length; d++){
             // console.log(d + "=" + array[d]);
             console.log(array[d]);
              for (z = 0; z<array[d][4].length; z++){
                if (place.name == array[d][3] && array[d][4][z].indexOf(query) > -1){
                  createMarker(results[i]);                            
                }
                else{
                  //alert(query+ 'is not present in our database');
                }
              }
            }
          }

        });
      }
    }


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

    }
}

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
        var content = 'Error: The Geolocation service failed.';
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
//google.maps.event.addDomListener(window, 'load', initialize);