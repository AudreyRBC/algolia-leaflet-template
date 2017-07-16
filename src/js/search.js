// import instantsearch from 'instantsearch.js';
// import instantsearchGoogleMaps from 'instantsearch-googlemaps';

import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import leaflet from 'leaflet';
import leafletMap from 'leaflet-map';
import $ from 'jquery';

//param algolia

var appID = 'appID';
var appKey = 'appKey';
var indexName = 'indexName';

var client = algoliasearch(appID, appKey);
var helper = algoliasearchHelper(client, indexName, {
  facets: ['post_title', 'type_annonce']
});


//array for popup marker
var allHits = [];
var $container =  document.querySelector('.container');

var map = L.map('mapid',{
  center : [43.300000, 5.400000],
  zoom : 13,
  doubleClickZoom : false,
  scrollWheelZoom : false,
});

createMap(map)

helper.on('result', function(content) {
  renderHits(content)
  renderFacetList(content);
  console.log(content)
});


$('.facet-list').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');
  helper.toggleRefinement('type_annonce', facetValue)
        .search();
});

function renderFacetList(content) {

  $('.facet-list').html(function() {

    return $.map(content.getFacetValues('type_annonce'), function(facet) {

      //create input
      var checkbox = $('<input type=checkbox>')
        .data('facet', facet.name)
        .attr('id', facet.name);

      //refine result
      if(facet.isRefined) checkbox.attr('checked', 'checked');

      //print input
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', facet.name);

      return $('<li>').append(checkbox).append(label);

    });

  });

}

// $('#search-box').on('keyup', function() {
//   helper.setQuery($(this).val())
//         .search();
// });

function renderHits(content) {
  var data = content.hits;
  getData(data)
  printMarker(map)


  $('#container').html(function() {
    return $.map(data, function(hit) {
      return '<li data-id="'+hit.objectID+'">' + hit._snippetResult.post_title.value +'</li>';
    });
  });


}

function getData(data){

  for (var i = 0; i < data.length; i++) {
    var hit = data[i]._snippetResult

    var lat = "";
    var lng = "";
    if (data[i]._geoloc) {
      lat = data[i]._geoloc.lat;
      if (!lat) return
      lng = data[i]._geoloc.lng
    }
    var myHit = {
      'id'       : hit.post_id,
      'title'    : hit.post_title.value,
      'image'    : hit.images.featured.url.value,
      'url'      : hit.permalink.value,
      'lat'      : lat,
      'lng'      : lng,
      'dataValue': data[i].objectID
    }
    // console.log(myHit)
    allHits.push(myHit)

  }

}


helper.search();


//MARKER
function createMap(map){
  //layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
  }).addTo(map);
}


function popUp(boxAct){

}
function printMarker(map){

  var boxAct = "ok"
  for (var result = 0; result < allHits.length; result++) {

    var hit = allHits[result];
    var data = hit.data
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize:     [40, 40],
            iconAnchor:   [22, 94],
            popupAnchor:  [0, -20]
        }
    });

    L.icon = function (option) {
        return new L.Icon(options);
    };
    L.title = data

    var lng = hit.lng;
    if (!lng) return
    var lat = hit.lat;
    if (!lat) return


    var hitsMarker = new LeafIcon({iconUrl: 'dist/images/marker.png'})


    L.marker([lat, lng], {icon: hitsMarker})
            .addTo(map)
            .bindPopup('<p>Hello world!<br />This is a nice popup.</p>');

  }

}
