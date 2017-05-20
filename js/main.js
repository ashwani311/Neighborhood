var global = {
    fs_url_start: "https:api.foursquare.com/v2/venues/",
    fs_url_end: "?client_id=4KJA1IBMXZKJF1SNSZGHVF3WVZOO5BC4BQOZ2GZD3CJMMBRQ&client_secret=XRJRIWXZDRVSV2MHVGLGBFWGJDMTKKQRGM00051EXN2DA5ER&v=20170514",
    fs_error: "Data Milla Nahi"

}
//ViewModel function
var model = function(){
  var self = this;
  self.rests = [];

  for(var i=0;i<rest.length;i++){
    var marker = new google.maps.Marker({
    position: {lat: rest[i].lat, lng: rest[i].lng},
    map: map,
    title: rest[i].name,
    resid: rest[i].id,
    show: ko.observable(rest[i].show),
    animation: google.maps.Animation.DROP
    });
    self.rests.push(marker);
    self.rests[self.rests.length - 1].setVisible(self.rests[self.rests.length - 1].show());
    self.request = function(marker){
          $.ajax({
            type:"GET",
            url: global.fs_url_start + marker.resid + global.fs_url_end,
            dataTypes: "json",
            success: function(data){
              var dat = data.response.venue;
              if (dat.hasOwnProperty('likes')){ marker.likes = dat.likes.count; }else{ marker.likes = global.fs_error; }
            },
            error : function(e){
              self.errorinfo(global.fs_error);
            }
        })
    }

  }


    for(var mar=0;mar<rest.length;mar++){
      (function(marker){

        self.request(marker);
        marker.addListener('click', function() {
          self.minfo(marker);
        });
      })(self.rests[mar]);
    }


    self.setVisibilty = function(show){
        for(var i = 0; i < rest.length; i++){
            self.rests[i].show(show);
        }
    };

    self.sText = ko.observable("");
    self.searchIt = function(){
      var sText = self.sText();
      if((sText == "")||((sText.length === 0))){
        self.setVisibilty(true);
      }
      else{
        for(var mar = 0;mar<rest.length;mar++){
          if(self.rests[mar]['title'].toLowerCase().indexOf(sText.toLowerCase()) >= 0){
            self.rests[mar].show(true);
            self.rests[mar].setVisible(true);
          }
          else{
            self.rests[mar].show(false);
            self.rests[mar].setVisible(false);
          }
        }
      }
    };


    self.BounceMarker = function(marker){
        self.dt = marker;
        self.dt.setAnimation(google.maps.Animation.BOUNCE);
		     setTimeout(function(){
            self.dt.setAnimation(null);
        }, 1000);
    };

    self.minfo = function(marker) {
      self.dt = marker;
      formatData = function() {
        if(self.dt.likes=="" || self.dt.likes== undefined){
          return global.fs_error;
        }
        else
          {
            return "likes: " +self.dt.likes;
          }
      }


      //to display the likes of the restraunts
      var resinfo = "Name: " +self.dt.title+ "<br>" + formatData();
      markerdata.setContent(resinfo);
      markerdata.open(map, marker);
      self.BounceMarker(marker);

    };


};
