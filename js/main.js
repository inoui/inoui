var App = {
  part:null,
	contact_map:{},  
	init: function () {

	  this._resize();
	  this._intitializeMap();

    // this.scroller = new IScroll('#wrapScroll', {
    //   mouseWheel: true
    // });    
    // $('.work').hide();
    
    // $("#nav li").mouseover(function() {
    //   if (!$(this).hasClass('current')) {
    //     var t = $(this).find('a').text();
    //     $(this).find('a').data('t', t);
    //     $(this).find('a').text('- '+t+' -');        
    //   };
    // }).mouseout(function() {
    //   if (!$(this).hasClass('current')) $(this).find('a').text($(this).find('a').data('t'));
    // });
    
	  $('body').on('click', ".action", $.proxy(this.__do, this));
    $(window).on('resize', $.proxy(this._resize, this));
    $("#projects").hide();
    $("#wrapper").delay(1000).fadeTo(500,1);
  },
  
  gotoPart:function (elt) {
    this.closeProject();
    $('.current').removeClass('current').trigger('mouseout');
    elt.addClass('current');


    if (this.part!=null) return this.hidePart(elt);

    this.part = $(elt).data('part');
    document.location.hash = '/'+this.part;

    ga('send', 'pageview', {'page': '/'+this.part,'title': this.part});

    $('#wrapper').attr('class', this.part);
    var that = this;

    setTimeout(function() {
      that[that.part]();
    }, 1000);
  },

  hidePart:function(elt) {
    var that = this;
    $("#" + this.part + " .content").fadeTo(500,0, function() {
      $("#contact").hide();
      $("#projects").hide();
      $("#projects")[0].scrollTop = 0;
      that.part = null;
      that.gotoPart(elt);
    });    
  },
  
  contact:function () {
    $("#contact").removeClass('hidden').show();
    $("#contact .content").fadeTo(500,1);
    google.maps.event.trigger(contact_map, 'resize');
  },
  about:function () {
    $("#about .content").fadeTo(500,1);
    this._resize();
  },
  inspirations:function () {
    $("#inspirations .content").html('<iframe src="http://inouistudio.tumblr.com" frameborder="0" id="tumblr"></iframe>');
    $("#inspirations .content").fadeTo(500,1);
    this._resize();
  },
  projects:function () {
      $("#projects").show();
      var $container = $('#projects .content');
      $container.fadeTo(500,1);
      var that = this;
      $container.imagesLoaded( function() {
        $('.work').css({opacity:0}).show();
        $container.masonry({
          'columnWidth': ".work",
          itemSelector: '.work'
        });
        var i=4;
        $('.work').each(function(){
          $(this).find('.infos').css({'padding-top':($(this).height()- $(this).find('.infos').height())*.5});
          $(this).delay(i*200).fadeTo(1000,1);
          i++;
          // that.scroller.refresh();
        });
        
      });
      setTimeout(function(){
          // that.scroller.refresh();
      }, 2000)
  },


  
  work:function(elt) {

    var that = this;
    this.project = elt;
    var u = this.project.find('h2>a').attr('href');
    document.location.hash = u;
    ga('send', 'pageview', {'page': u,'title': u});
        
    // $('.projects .part').css("overflow-y", "hidden");
    $("#mask").css({'background-color':'#'+this.project.data('color')});
    $("#mask").animate({
        width: '100%',
    }, 500, function() {
      var w = elt.data('work');
      $("#projects")[0].scrollTop = 0;      
      $.ajax({
        dataType: "json",
        data:{'project':w},
        url: '/p.php',
        success: $.proxy(that.showWork, that)
      });
    });
  },
  closeProject:function() {
    $(".tools").fadeTo(500,0);
    // $('.projects .part').css("overflow-y", "scroll");
    $("#mask").animate({
        width: '0%'
    }, function() {
      $("#mask .project").html('');
    })
  },

  nextProject:function() {
    var that = this;
    if (this.project.next().hasClass("work")) {
      this.project = this.project.next();      
    } else {
      this.project = $('.work').eq(0);
    }

    $("#mask").css({'background-color':'#'+this.project.data('color')});
    var w = this.project.data('work');
    
    $('.projectReicept').fadeOut(function(){
      $("#projects")[0].scrollTop = 0;      
      $.ajax({
        dataType: "json",
        data:{'project':w},
        url: '/p.php',
        success: $.proxy(that.showWork, that)
      });
      
    });

  },


  showWork:function(data) {

    var o = {
      title:this.project.data('title'), 
      path:this.project.data('work'), 
      images:data,
      desc:this.project.find('.description').html(),
      medium:this.project.data('medium')
    };
    
    
    var view = $('#workTpl').html();
    $("#mask .project").html( _.template(view,o) );
    $("#mask .description").fadeIn();
    $(".tools").fadeTo(500,1);
    var i=1;
  	$('.video-thumb').smartVimeoEmbed({width:$(".img-receipt").width()});
    $("#mask .project img").each(function(){
      $(this).css({opacity:0}).removeClass('hidden').delay(i++*400).fadeTo(1000,1);
    });
  },
	_intitializeMap:function() {
        var e = new google.maps.LatLng(48.86683, 2.37217),
            t = new google.maps.LatLng(48.88000, 2.35500),
            n = new google.maps.StyledMapType([{
            featureType: "all",
            elementType: "all",
            stylers: [
            { hue: "#00ccff" },
            { saturation: 100 },
            { lightness: 50 },
            { gamma: 0.42 },
            
{
              visibility: "simplified"
            }]
          }, {
            featureType: "road.arterial",
            elementType: "all",
            stylers: [{
              visibility: "on"
            }]
          }, {
            featureType: "transit.station",
            elementType: "all",
            stylers: [{
              visibility: "on"
            }]
          }], {
            name: "Greyscale"
          });
        contact_map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: t,
          panControl: !1,
          zoomControl: !1,
          scaleControl: !1,
          streetViewControl: !1,
          mapTypeControl: !1,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        contact_map.mapTypes.set("greyscale", n);
        contact_map.setMapTypeId("greyscale");
        var r = new google.maps.Marker({
          position: e,
          map: contact_map,
          icon: 'img/icon.png'

        });
  
	},
	
  __do:function(evt) {
    evt.preventDefault();
    var $elt = $(evt.currentTarget); 
    var action = $elt.data('action').split(',');
    this[action[0]]($elt);
  },
  _resize:function() {
    $('.va').each(function(){
      $(this).css("padding-top", .5 * ($(window).height() - $(this).height()) + "px")
    });

    $('#tumblr').height($(window).height());
  }
};

$(document).ready(function() {
  App.init();
})