var originalImage = null;
var filteredImage = null;

var oCanvas = document.getElementById("originalCanvas");
var fCanvas = document.getElementById("filterCanvas");

function loadImage() {
  var fileinput = document.getElementById("finput");
  var fileName = fileinput.value;
  
  // reinstating these global variables because of "toCanvas is null" error in Firefox
  oCanvas = document.getElementById("originalCanvas");
  fCanvas = document.getElementById("filterCanvas");

  originalImage = new SimpleImage(fileinput);
  originalImage.drawTo(oCanvas);
}
 
function filter( filterName ) {
  if ( originalImage == null ) {
    alert('Please choose an image first');
  }
  else if ( filterName == "grayscale" ) {
    makeGrayscale();
  }
  else if ( filterName == "rgbStriped" ) {
    makeRGBStriped();
  }
  else if ( filterName == "blur" ) {
    makeBlur();
  }
  else {
    alert('no filter specified');
  }
}

function makeGrayscale() {
  filteredImage = new SimpleImage(originalImage);
  
  for (var pixel of filteredImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue() )/3;
    
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }

  filteredImage.drawTo(fCanvas);
}

function makeRGBStriped() {
  filteredImage = originalImage;
  
  for (var pixel of filteredImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue() )/3;
    
    // Red stripe. See red-filter-algorithm.pdf for theory
    if (pixel.getY()/filteredImage.getHeight() <= 1/7) {
      if (avg<128) {
        pixel.setRed(2*avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(2*avg-255);
      }
    }
    
    // Orange stripe
    else if (pixel.getY()/filteredImage.getHeight() <= 2/7) {
      if (avg<128) {
        pixel.setRed(2*avg);
        pixel.setGreen(0.8*avg);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(1.2*avg-51);
        pixel.setBlue(2*avg-255);
      }
    }
    
    // Yellow stripe
    else if (pixel.getY()/filteredImage.getHeight() <= 3/7) {
      if (avg<128) {
        pixel.setRed(2*avg);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2*avg-255);
      }
    }
    
    // Green stripe
    else if (pixel.getY()/filteredImage.getHeight() <= 4/7) {
      if (avg<128) {
        pixel.setRed(0);
        pixel.setGreen(avg*2);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(avg*2-255);
        pixel.setGreen(255);
        pixel.setBlue(avg*2-255);
      }
    }
    
    // Blue stripe
    else if (pixel.getY()/filteredImage.getHeight() <= 5/7) {
      if (avg<128) {
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(avg*2);
      }
      else {
        pixel.setRed(avg*2-255);
        pixel.setGreen(avg*2-255);
        pixel.setBlue(255);
      }
    }
    
    // Indigo stripe
    else if (pixel.getY()/filteredImage.getHeight() <= 6/7) {
      if (avg<128) {
        pixel.setRed(0.8*avg);
        pixel.setGreen(0);
        pixel.setBlue(avg*2);
      }
      else {
        pixel.setRed(1.2*avg-51);
        pixel.setGreen(avg*2-255);
        pixel.setBlue(255);
      }
    }
    
    // Violet stripe
    else {
      if (avg<128) {
        pixel.setRed(1.6*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6*avg);
      }
      else {
        pixel.setRed(0.4*avg+153);
        pixel.setGreen(2*avg-255);
        pixel.setBlue(0.4*avg+153);
      }
    }
  }
  
  filteredImage.drawTo(fCanvas);
}

function makeBlur() {
  filteredImage = originalImage;
  
  for (var pixel of filteredImage.values()) {
    var curX = pixel.getX();
    var curY = pixel.getY();
    
    if ( isEven(curX+curY) ) {
      var swapX = curX;
      var swapY = curY;
      var direction = getRndInteger(0, 3);
      
      // top swap
      if ( direction == 0 ) {
        if ( curY != 0 ) {
          swapY = curY-1;
        }
      }
      // bottom swap
      else if ( direction == 1 ) {
        if (curY != filteredImage.getHeight()-1) {
          swapY = curY+1;
       }
      }
      // left swap
      else if ( direction ==2 ) {
        if(curX != 0) {
          swapX = curX-1;
        }
      }
      // right swap
      else if ( direction == 3 ) {
        if(curX != filteredImage.getWidth()-1) {
          swapX = curX+1;
        }
      }
      else {}

      var swapPixel = filteredImage.getPixel(swapX,swapY);
      var curRed = pixel.getRed();
      var curGreen = pixel.getGreen();
      var curBlue = pixel.getBlue();

      pixel.setAllFrom(swapPixel);
      swapPixel.setRed(curRed);
      swapPixel.setGreen(curGreen);
      swapPixel.setBlue(curBlue);
    }

  }
  
  filteredImage.drawTo(fCanvas);
}

function reset() {
  originalImage = null;
  filteredImage = null;
  
  var oCtx = oCanvas.getContext("2d");
  var fCtx = fCanvas.getContext("2d");
  oCtx.clearRect(0,0,oCanvas.width,oCanvas.height);
fCtx.clearRect(0,0,fCanvas.width,fCanvas.height);
}

// my isEven function counts 0 as even because I want it to
function isEven(value) {
	return (value%2 == 0);
}

// from W3 schools, return includes min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


