var moveXAmount=0;
var moveYAmount=0;
var isDragging=false;
var hitText = false;
var pic_image;
var context;
var lastX=0, lastY=0;
var img_src;

var textRect = {x:150,y:300,width:0,height:0};

var downloadButton = $('#download-canvas');

function fixEvent(e) {
  //Use offset is better, but FF does not have offset
    if (! e.hasOwnProperty('offsetX')) {
        var curleft = curtop = 0;
        if (e.offsetParent) {
           var obj=e;
           do {
              curleft += obj.offsetLeft;
              curtop += obj.offsetTop;
           } while (obj = obj.offsetParent);
        }
        e.offsetX=e.layerX-curleft;
        e.offsetY=e.layerY-curtop;
    }
    return e;
}

function buildcanvas() {
  console.log("buildcanvas");
  make_pic();
}

function uploadByButton() {
    var f = document.getElementById("uploadimage").files[0];
    if(f == null) return;
    var url = window.URL || window.webkitURL;
    img_src = url.createObjectURL(f);
    buildcanvas();
}

function getTextCenter() {
  var pos = {x:0,y:0};
  return pos;
}

// prepare image to fit canvas;
function prep_image(pic_w, pic_h) {
    xfact =  pic_h / canvas.height * 50;
    return xfact;
}

CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }
};

function fillTextMultiLine(ctx, text, x, y) {
  var linespace = 1.2;
  var lineHeight = ctx.measureText("M").width * linespace;
  var lines = text.split("\n");
  var maxWidth = 0;
  var totalHeight = 0;

  for (var i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    var measureWidth = context.measureText(lines[i]).width;
    if(measureWidth>maxWidth) {maxWidth = measureWidth;}
    y += lineHeight;
  }
  totalHeight = lineHeight * lines * linespace;

  textRect.width=maxWidth;
  textRect.height=lineHeight;
}

function drawCanvas() {
      //redraw canvas
        if(img_src == null) return;

        context.clear();

        xfact = prep_image(pic_image.width , pic_image.height);

        var im_width = parseInt(pic_image.width * $('#resize').val() / xfact);
        var im_height = parseInt(pic_image.height * $('#resize').val() / xfact);
        var currentX = lastX;
        var currentY = lastY;
        if(!hitText) {
          currentX = lastX + moveXAmount;
          currentY = lastY + moveYAmount;

          // bound
          currentX = Math.max(currentX, -im_width+100);
          currentX = Math.min(canvas.width -100,currentX);
          currentY = Math.max(currentY, -im_height+100);
          currentY = Math.min(canvas.height -100,currentY);
        }
        lastX = currentX;
        lastY = currentY;
        
        // BG
        context.rect(0,0,canvas.width,canvas.height);
        context.fillStyle= $(".bg-color").val();
        context.fill();

        context.drawImage(pic_image, currentX, currentY, im_width, im_height);

        //  Text
        // store text area. and hit text
        var fontsize = $(".font-size").val();
        var fontFamily = $(".font-family").val();
        context.font = 'bold '+fontsize+'pt '+fontFamily;
        context.fillStyle = $(".text-color").val();
        // context.shadowColor = '#999';
        // context.shadowBlur = 5;
        // context.shadowOffsetX = 0;
        // context.shadowOffsetY = 0;

        var txt = $(".text-field").val();

        if(hitText) {
          textRect.x = textRect.x + moveXAmount;
          textRect.y = textRect.y + moveYAmount;

          // bound
          textRect.x = Math.max(textRect.x, 0);
          textRect.x = Math.min(canvas.width,textRect.x);
          textRect.y = Math.max(textRect.y, 0);
          textRect.y = Math.min(canvas.height,textRect.y);
        }

        lineHeight=context.measureText('M').width; // estimate using an "M"

        //context.fillText("width:" + context.measureText(txt).width + ", "+lineHeight,10,50);
        //console.log(context.measureText(txt));

        fillTextMultiLine(context,txt,textRect.x,textRect.y)
        // context.fillText(txt,textRect.x,textRect.y);
        context.restore();

        downloadButton.removeClass("disabled");
}

function initCanvas() {
    //redraw canvas
      var stcanvas = document.getElementById('canvas');
      context = stcanvas.getContext('2d');
      context.clear();
      // BG
      context.rect(0,0,canvas.width,canvas.height);
      context.fillStyle= "#eeeeee"
      context.fill();

      //  Text
      context.font = 'italic 50pt Georgia';
      context.fillStyle = "#ccc"

      var txt = "Drop files here"

      //console.log(context.measureText(txt));

      fillTextMultiLine(context,txt,380 ,350)
      // context.fillText(txt,textRect.x,textRect.y);
      context.restore();
      downloadButton.addClass("disabled");
}

function make_pic() {
    var stcanvas = document.getElementById('canvas');
    context = stcanvas.getContext('2d');
    context.clear();
    pic_image = new Image();

    // Reset position
    lastX=0;
    lastY=0;

    pic_image.src = img_src;
    pic_image.onload = drawCanvas;
}

$("#canvas").mousedown(function(event){
    lastMoveEvent = event;

    // Do a hit test
    var x = fixEvent(event.originalEvent).offsetX;
    var y = fixEvent(event.originalEvent).offsetY;
    console.log(""+x+","+y);
    hitX = x;
    hitY = y;

    if ((hitX > textRect.x - 80) && (hitX < textRect.x+textRect.width + 80) && (hitY > textRect.y - 80) && (hitY < textRect.y+textRect.height + 80)) {
      hitText = true;
      console.log("HIT")
    }

    isDragging = true;
});

$(window).mouseup(function(event){
    isDragging = false;
    hitText = false;
    moveXAmount = 0;
    moveYAmount = 0;
});

var lastMoveEvent;

$("#canvas").mousemove(function(event) {
    if( isDragging == true )
    {
        var x = fixEvent(event.originalEvent).offsetX;
        var y = fixEvent(event.originalEvent).offsetY;

        var lastX = fixEvent(lastMoveEvent.originalEvent).offsetX;
        var lastY = fixEvent(lastMoveEvent.originalEvent).offsetY;
        if(lastMoveEvent != null) {
          moveXAmount = x - lastX;
          moveYAmount = y - lastY;
        }
        lastMoveEvent = event;
        drawCanvas();
    }
});

 function downloadCanvas (event) {
    if(img_src==null) {
      event.preventDefault();
      return false;
    }
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL('image/png');

    console.log(dataURL);
    event.target.href = dataURL;
}

$().ready(function (){
  initCanvas();
});


// Drag and Drop
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var url = window.URL || window.webkitURL;
      img_src = url.createObjectURL(f);
    }
    buildcanvas();
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

var dropZone = document.getElementById('canvas');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

document.getElementById("download-canvas").addEventListener('click', downloadCanvas, false);

document.getElementById("uploadimage").addEventListener("change", uploadByButton, false);
$("#resize").on("input change", drawCanvas);
$(".text-field").on("input change", drawCanvas);
$(".text-color").on("input change", drawCanvas);
$(".bg-color").on("input change", drawCanvas);
$(".font-size").on("input change", drawCanvas);
$(".font-family").on("input change", drawCanvas);
