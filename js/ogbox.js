(OGBox = function (undefined) {
  var VERSION = "0.1.1";
  var _D = function(){};
  var _P = _D.prototype;

  _D.opengraphbox = true; // To test if library installed

  appendURLBox = function(dataJSON) {
    console.log(dataJSON["success"]);
    if (dataJSON["success"] == false) {
      return false;
    }

    var container = $(".ogbox-container");

    var imgEle;
    // Load Image TODO, distingiush picture size
    if (dataJSON['og:image']) {
      imgEle = '<div class="center-cropped" style="height:325px;background-repeat:no-repeat;background-image:url(\''+dataJSON['og:image']+'\');"></div>​';
    }
    if (dataJSON['image']) {
      imgEle = '<div class="center-cropped" style="height:325px;background-repeat:no-repeat;background-image:url(\''+dataJSON['url']+dataJSON['image']+'\');"></div>​';
    }

//    var boxEle = $('<div class="ogbox-card slider">'+imgEle+'<b>'+dataJSON['url']+'</b><br/>'+dataJSON['og:description']+'</div>');

    var desc = dataJSON.hasOwnProperty("og:description") ? dataJSON['og:description'] : dataJSON['description'];
    var title = dataJSON.hasOwnProperty("og:site_name") ? dataJSON['og:site_name'] : dataJSON['title'];

    var author = dataJSON.hasOwnProperty("author") ? "| by "+dataJSON['author'] : "";

    var fbPostRaw = '<div class="fb-preview">'+
                    '<div class="og-image-wrapper">'+
                    imgEle+
                    '</div>'+
                    '<div class="fb-title"><input class="inline-edit full-width" value="'+title+'" /> </div>'+
                    '<div class="fb-content"><input class="inline-edit full-width" value="'+desc+'" /></div>'+
                    '<div class="fb-link-wrapper">'+
                    '<div class="fb-link"><input class="inline-edit full-width" value="'+dataJSON['url']+author+'" /></div>'+
                    '</div>'+
                    '</div>';

    var  fbPostEle = $(fbPostRaw);
    container.append(fbPostEle);
  }

  crawlForURLCallback = function crawlForURLCallback(resultJSON) {
    console.log("crawlForURLCallback");
    console.log(resultJSON);
    appendURLBox(resultJSON);
  }

  _D.crawlForURLCallback = crawlForURLCallback;

  _D.crawlForURL = function (urlString) {
    var url = "http://opengraphbox.appspot.com/OGTags";

    var crawlForURLCallback = _D.crawlForURLCallback;

    $.ajax({
      url : url,
      type: "get",
      async: false,
      data : {"url" : urlString},
      dataType: "jsonp",
      jsonp: "callback",
      cache: true,
      jsonpCallback:"crawlForURLCallback",
    }).done(function (data) {
        console.log("Done");
    }).fail(function (XHR, status, error) {
        console.log(error);
    });

  }

  return _D;

}());
