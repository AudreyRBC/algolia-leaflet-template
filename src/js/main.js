//
import $ from 'jquery'



function animationForm(){
  var $customSelect = $('.customSelect-search .ais-root');
  var that;
  var childrenLength;
  var calcHeight;

  $customSelect.each(function(){
    that = $(this);
    childrenLength = this.find('.ais-menu--item').length
    calcHeight = childrenLength * 64;
    that.parents('.customSelect-search').on('click', function(){
      $customSelect.not(that).removeClass('visible');
      if(that.addCLass('visible')){
        that.removeClass('visible').css({'height':'0px'})
      }else{
        that.addClass('visible').css({'height' : + calcHeight + 'px'})
      }
    })
  });

    HoverCollapse()

}animationForm();

function HoverCollapse(){
  if ($(window).width() > 1023) {
    $('.uk-width-small-1-1').mouseenter(function(){
      $(this).find('.ais-root__collapsible').css({'transition':'all .3s ease'}).removeClass('ais-root__collapsed');
      // init(collapsed)
    })
    $('.uk-width-small-1-1').mouseleave(function(){
      $(this).find('.ais-root__collapsible').addClass('ais-root__collapsed');
      // init(collapsed)
    })
  }
}
function popUpForm(){
  var $btnPopUp = $('#home-btn');
  var $body = $('body');

  if(!$btnPopUp) return;
  var $bodyPopup = $('.home-popup')

  var $close = $('.close-popup')
  $btnPopUp.on('click', function(event){
    $bodyPopup.addClass('visible')
    $body.addClass('overflow')
  })
  // touch.$btnPopUp.trigger( "click" );
  $close.on('click', function(event){
    $bodyPopup.removeClass('visible')
    $body.removeClass('overflow')
  })

  if ($('.home-popup').length > 0) {
    $(window).on('scroll', function(){
      scroll = $(window).scrollTop()
      if (scroll > 80) {
        if ($(window).width() <= 1024 ) {
          $bodyPopup.css({'top': '70px'})
          $('#filter-form-wrapper').css({'height':'calc(50vh - 80px)'})
        }
        if ($(window).width() >= 1024 ) {
          $bodyPopup.css({'top': '80px'})
          $('#filter-form-wrapper').css({'height':'calc(30vh - 80px)'})
        }

      }else{
        $bodyPopup.css({'top': '0'})
        if ($(window).width() >= 1024 ) {
          $('#filter-form-wrapper').css({'height':'30vh'})
        }
      }
    })
    var $position = $(window).scrollTop()
    if ($position > 80) {
      if ($(window).width() <= 1024 ) {
        $bodyPopup.css({'top': '70px'})
        $('#filter-form-wrapper').css({'height':'calc(50vh - 80px)'})
      }
      if ($(window).width() >= 1024 ) {
        $bodyPopup.css({'top': '80px'})
        $('#filter-form-wrapper').css({'height':'calc(30vh - 80px)'})
      }

    }else{
      $bodyPopup.css({'top': '0'})
      if ($(window).width() >= 1024 ) {
        $('#filter-form-wrapper').css({'height':'30vh'})
      }
    }
    $(window).on('resize', function(){
      HoverCollapse()
      $bodyPopup.removeAttr('style')
      $('#filter-form-wrapper').removeAttr('style')
    })
  }

}popUpForm()
