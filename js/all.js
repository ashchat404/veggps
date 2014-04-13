var postcode;
var address_full;
var name_res;
function bk() {
  var mapOptions = {
    center: new google.maps.LatLng(51.481383, -0.043945),
    zoom: 10
  };
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

  var types;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    for (var f = 0;f < place.address_components.length;f++){
      var adr = place.address_components[f];

        if (adr.types[0] == "postal_code"){
          postcode = adr.long_name;
          address_full = place.vicinity;
          name_res = place.name;
          name_res.replace(/&#([^\s]*);/g, function(match, match2) {return String.fromCharCode(Number(match2));})
          console.log(name_res);
        }

    }
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>'+ 
                          place.vicinity +
                          ' <br />'+ 
                          postcode +
                          '<button class="dishnames" onclick="show()">Add</button>'
    );
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    google.maps.event.addDomListener(radioButton, 'click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);
}

google.maps.event.addDomListener(window, 'load', bk);
var newarray = [];
function show(){
   $('.modalBox').show('slow');
};
var disharray = [];
function postinfo(){
  disharray.length = 0;
  var numbertotal;
  var numbertotal = $(".modalBox .row").length;

  var inputs = $(".modalBox .row input");

  for(h=0;h<numbertotal;h++){
    var y = $("input[name=dish"+h+"][type=text]").val();
    var z = $("input[name=dish"+h+"][type=number]").val();
    if(!y == "" & !z == ""){
      disharray.push([y,z]);
    }
    else{
      //alert("you have provide both dish-name and dish-cost, oe else they will not be saved in our database")
    }
    
  }
  console.log(disharray);
  var jsoncvrt = JSON.stringify(disharray);
  var htp =  $.ajax({
    type: 'POST',
    url: 'http://talentedash.co.uk/veggps/transfer.php',
    data: {
      postal: postcode,
      name: name_res,
      addrs: address_full,
      strings: jsoncvrt
    }  
  }).done(function(){
    console.log("success");
    $('input').val('');
    $('.modalBox').hide('slow');
  });
}