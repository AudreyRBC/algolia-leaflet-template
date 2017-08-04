// import instantsearch from 'instantsearch.js';
// import instantsearchGoogleMaps from 'instantsearch-googlemaps';

import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import leaflet from 'leaflet';
import leafletMap from 'leaflet-map';
import $ from 'jquery';

//param algolia

var appID ='M2KGCKU1OY';
var appKey = 'f5cadaff3a60bd354ad9eeb0c9d2bde5';
var indexName = 'testtest_posts_annonce';

var client = algoliasearch(appID, appKey);
var helper = algoliasearchHelper(client, indexName,
  {
  facets: ['type_annonce', 'wpcf-property-price', 'wpcf-code-surface', 'taxonomies_hierarchical.arrondissement.lvl0' , 'wpcf-type-bien'],
},

);



//array for popup marker
var allHits = [];
var urlResult = [];
var $container =  document.querySelector('#opts');
var LeafIcon;


var map = L.map('map',{
  center : [43.300000, 5.400000],
  zoom : 15,
  doubleClickZoom : false,
  scrollWheelZoom : false,
});

createMap(map)

helper.on('result', function(content) {
  renderHits(content)
  renderFacetList(content);
  console.log('result here ')
});


facetClick('nb-chambre', 'wpcf-code-surface');
facetClick('type-annonce', 'type_annonce');
facetClick('arrondissement', 'taxonomies_hierarchical.arrondissement.lvl0');
facetClick('bien', 'wpcf-type-bien');



function renderFacetList(content) {
  createCheckBox(content, 'nb-chambre', 'wpcf-code-surface', 'checkbox', 'checked')
  createCheckBox(content, 'type-annonce', 'type_annonce', 'checkbox', 'checked')
  createCheckBox(content, 'arrondissement', 'taxonomies_hierarchical.arrondissement.lvl0', 'checkbox', 'checked')
  createCheckBox(content, 'bien', 'wpcf-type-bien', 'checkbox', 'checked')
}

function encodeReplace($str){
  if(!$str) return
  if(typeof $str != 'string') return $str
  return $str.toLowerCase().split(' ').join('-')
}
function reverseReplace($str){
  if(!$str) return
  if(typeof $str != 'string') return $str
  return $str.toLowerCase().split('-').join(' ')
}
function createCheckBox(content, className, facetName, type, isRefined){
    $('.' + className).html(function() {
      return $.map(content.getFacetValues(facetName), function(facet) {
        var status = 'unchecked'
        var theName = facet.name
        if(facet.isRefined) status = 'checked';
        var templateCheckbox = '<div class="ais-menu--item">'
                                +'<div class="flex-item">'
                                  // +'<a href="javascript:void(0);" class="facet-item">'
                                    +'<input id="'+encodeReplace(theName)+'" type="checkbox" data-facet="'+theName+'" data-name="'+facetName+'" '+ status +' value="'+encodeReplace(theName)+'"> '
                                      +'<p>'
                                        + facet.name
                                        +'<span class="facet-count">(' + facet.count + ')</span>'
                                      +'</p>'
                                  // +'</a>'
                                +'</div>'
                               +'</div>';
                              //  console.log($(this))
        return templateCheckbox
      });
  });
}

// function createRange(content, className, facetName, type, isRefined){
//     $('.' + className).html(function() {
//       return $.map(content.getFacetValues(facetName), function(facet) {
//         var status = 'unchecked'
//         if(facet.isRefined) status = 'checked';
//         var templateCheckbox = '<div class="ais-menu--item">'
//                                 +'<div class="flex-item">'
//                                   // +'<a href="javascript:void(0);" class="facet-item">'
//                                     +'<input id="'+facet.name+'" type="checkbox" data-facet="'+facet.name+'" class="" '+ status +' value="'+facet.name+'"> '
//                                       +'<p>'
//                                         + facet.name
//                                         +'<span class="facet-count">(' + facet.count + ')</span>'
//                                       +'</p>'
//                                   // +'</a>'
//                                 +'</div>'
//                                +'</div>';
//                               //  console.log($(this))
//         return templateCheckbox
//       });
//   });
// }
var dataUrl = []
function injectDataUrl(){
  var url = location.href;
  url = url.replace(/^.+#q/,'').split('&')
  url = url.filter(v => v!='')

  for (var i = 0; i < url.length; i++) {
    var theUrl = url[i].split('=')
    theUrl = {
      'facet' : theUrl[0],
      'data' : theUrl[1],
      'value' : theUrl[2],
    };
    dataUrl.push(theUrl)
  }
  pushValue(dataUrl)


}injectDataUrl()



function pushValue(dataUrl){

  console.table(dataUrl)
  //helper.on('result', function(test) {
    console.log('result here 2')
    for (var j = 0; j < dataUrl.length; j++) {
      var data = dataUrl[j].data;
      var values = dataUrl[j].value;
      var facet = dataUrl[j].facet;
      var valueFacet = reverseReplace(values)


        const $heads = document.querySelectorAll('[data-url]')
        for (var k = 0; k < $heads.length; k++) {
          const $head = $heads[k]

          if ($head.getAttribute('data-url') === data) {
            // console.log($head.getAttribute('data-url'))
            // console.log(data, values, facet, valueFacet)

              const $inputs = $head.querySelectorAll('[data-facet]');

              for (var l = 0; l < $inputs.length; l++) {
                var $input = $inputs[l]
                  if($input.value === values) if($input.checked === false) $input.checked = true;
                // else $input.checked = false;
                console.log('test',test)
              }
            }
          }

          helper.toggleRefinement(facet, valueFacet).search()
      }
  //});
}



// facetClick('nb-chambre', 'wpcf-code-surface');
// facetClick('type-annonce', 'type_annonce');
// facetClick('arrondissement', 'taxonomies_hierarchical.arrondissement.lvl0');
// facetClick('bien', 'wpcf-type-bien');



function facetClick(className, facetName){
  $('.'+className).on('click', 'input[type=checkbox]', function(e) {
    var facetValue = $(this).data('facet');
    facetValue = facetValue
    var facetEncode = encodeReplace(facetValue)
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    createMap(map)
    helper.toggleRefinement(facetName, facetValue)
          .search();

    if($(this).is(':checked')) {
      urlResult.push(facetName+'='+className+'='+facetEncode)
      var theUrl = urlResult.join('&').toLowerCase();
      location = '#q&'+theUrl;

    } else {
        var index = urlResult.indexOf(facetName+'='+className+'='+facetEncode)
        if (index > -1) {
          urlResult.splice(index, 1);
          var theUrl = urlResult.join('&').toLowerCase();
          location = '#q&'+theUrl

        }
    }
    // getUrl(className,facetValue)
  });
}
function getUrl(className,facetValue){
  urlResult.push(className+'='+encodeReplace(facetValue))
  var theUrl = urlResult.join('&').toLowerCase();
  location = '#q&'+theUrl

}

function renderHits(content) {
  var data = content.hits;

  $('#habitation--list').html(function() {
    return $.map(data, function(hit) {
      return hitTemplate(data, hit);
    });
  });
  $('.search-results__item').each(function(){
    $(this).on('mouseover', function(){
      var itemLat = $(this).data('lat');
      var itemLng = $(this).data('lng');
      if (itemLat === " ") return
      if (itemLng === " ") return
        map.panTo(new L.LatLng(itemLat, itemLng));
    })
  })

  printMarker(data, map)

}

helper.search();

//MARKER
function createMap(map){
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  	subdomains: 'abcd',
      maxZoom: 18,
  }).addTo(map);
}

function printMarker(data, map){

  return $.map(data, function(hit) {
    LeafIcon = L.Icon.extend({
        options: {
            iconSize:     [19, 27],
            iconAnchor:   [0, 0],
            popupAnchor:  [0, -20]
        }
    });
    L.icon = function (option) {
        return new L.Icon(options);
    };

    if (hit._geoloc){
      if (!hit._geoloc.lat) return
      var lat = hit._geoloc.lat;
      if (!hit._geoloc.lng) return
      var lng = hit._geoloc.lng;

      var hitsMarker = new LeafIcon({iconUrl: 'dist/images/marker.png'})
      var $marker = L.marker([lat,lng], {icon: hitsMarker, title: hit.objectID})
      .addTo(map)
      .bindPopup(templatePopUp(data, hit))

      $marker.on('mouseover', function(e){
        this.openPopup(templatePopUp(data, hit))
      })

      $('.search-results__item').each(function(){
        $(this).on('mouseover', function(){
          var itemLat = $(this).data('lat');
          var itemLng = $(this).data('lng');
          if (itemLat === " ") return
          if (itemLng === " ") return
          if ($marker.options.title === $(this).attr('id')) {
            $marker.openPopup(templatePopUp(data, hit))
          }
        })
      })

    }
  });
}


function hoverMarker(){
  $('.leaflet-marker-icon').on('mouseover', function (e) {
      this.openPopup();

  });
  $('.leaflet-marker-icon').on('mouseout', function (e) {
      this.closePopup();
  });
}hoverMarker()
function hitTemplate(data, hit){

  //check type_annonce
  var type = hit.type_annonce;
  var nameType;
  if (type === "Location") {nameType = "à louer"}
  else if (type === "Vente") {nameType = "à vendre"}
  else { nameType = " " }

  var lat = " ";
  var lng = " ";
  if (hit._geoloc){
    if (!hit._geoloc.lat) return
    var lat = hit._geoloc.lat;
    if (!hit._geoloc.lng) return
    var lng = hit._geoloc.lng;
  }
  var excerpt = hit.post_excerpt;

  var hitTemplate = '<section id="'+ hit.objectID +'" data-lat="'+ lat +'" data-lng="' + lng + '" class="search-results__item">'+
  	'<div class="uk-grid">'+

      '<div class="uk-width-1-4">'+
        '<a href="' + hit.permalink + '" title="' + hit.post_title + '">'+
        	'<img src="' + hit.images.featured.url + '" alt="" width="200" height="200">'+
        '</a>'+
      '</div>'+ //uk-width-1-4

      '<div class="uk-width-3-4">'+
        '<div class="uk-teaser--property">'+
          '<h3><a href="' + hit.permalink + '">' + hit.post_title + '</a></h3>'+


  				//price
          '<div class="uk-grid">'+

            '<div class="uk-width-1-2 line-height-min">'+

              '<strong>'+ hit['wpcf-property-price']+ '€</strong>'+
              '<br>'+

  					//type
            '<small class="property-type text-gray">'+ hit['wpcf-code-surface'] +' '+ nameType +'</small></div>'+

            '<div class="uk-width-1-2 uk-text-right">'+

  				 		//nb room
  					  '<span class="uk-badge" title="Pièces">'+
  					      	'<i class="chicon-box2"></i>'+
  					    		hit['wpcf-property-allrooms']+
  					  '</span>'+

  						//surface
  					  '<span class="uk-badge" title="Surface">'+
  					      	'<i class="chicon-expand1"></i>'+
  					    		'12 m<sup>2</sup>'+
  					  '</span>'+

  						//arrondissement
  					  '<span class="uk-badge" title="Lieu">'+
  					      	'<i class="chicon-map-marker"></i>'+
  					    		'<a href="https://pujol.spade.be/arrondissement/'+ hit.taxonomies.arrondissement +'/">'+ hit.taxonomies.arrondissement +'</a>'+
  					  '</span>'+


            '</div>'+ //uk-width-1-2 uk-text-right


          '</div>'+ //uk-width-1-2 line-height-min

          '<div class="excerpt">'+ excerpt.substring(0,150) +'…</div>'+
          '<div class="uk-teaser__date"><i class="chicon-clock"></i>'+ hit.post_date_formatted +'</div>'+

        '</div>'+ //uk-grid

      '</div>'+  //uk-teaser--property
    '</section>'; //uk-width-3-4
    return hitTemplate
}
function templatePopUp(data, hit){

  var popUp = '<div id="' + hit.objectID + '" style="overflow:hidden">' +
                '<a href="' + hit.permalink + '" title="' + hit.post_title + '">'+
                  '<img src="' + hit.images.featured.url + '" alt="" width="230" height="230">'+
                '</a>'+
                '<h3 class="map-title"><a href="' + hit.permalink + '" data-pys-event-id="' + hit.objectID + '">' + hit.post_title + '</a></h3>'+
                '<div class="uk-clearfix map-title" style="font-size:13px">' + hit.taxonomies_hierarchical.bien.lvl0 + '</div>'+
                '<div class="uk-float-right">'+

                  '<span class="uk-badge" title="Pièces">'+
                        '<i class="chicon-box2"></i> '+
                        hit['wpcf-property-allrooms']+
                  '</span>'+


                  '<span class="uk-badge" title="Surface">'+
                        '<i class="chicon-expand1"></i>'+
                        '10.00 m<sup>2</sup>'+
                  '</span>'+

                  '<span class="uk-badge" title="Lieu">'+
                        '<i class="chicon-map-marker"></i>'+
                        '<a href="https://pujol.spade.be/arrondissement/'+ hit.taxonomies.arrondissement +'/">'+ hit.taxonomies.arrondissement +'</a>'+
                  '</span>'+
                '</div>'+
                '<p class="map-price uk-float-left">'+
                  '<strong>'+ hit['wpcf-property-price']+ '€</strong>'+
                '</p>'+
              '</div>';
  return popUp;
}
