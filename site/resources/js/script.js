var draw = function() {
  var canvas = document.getElementById('structure');

  if (!canvas) {
    return;
  }

  var width = $(window).width();
  var height = $(window).height();

  canvas.width = width;
  canvas.height = height;

  var c = canvas.getContext('2d');

  if (!c) {
    return;
  }

  var rnd = function(m) {
    return Math.random() * m;
  }

  var data = c.createImageData(width, height);
  var val, horz, vert, index;

  for(var x = 0; x < data.width; x++) {
    for(var y = 0; y < data.height; y++) {

      val = 0;
      horz = (Math.floor(x / rnd(4)) % 2 == 0);
      vert = (Math.floor(y / 4) % 2 == 0);
      if( (horz && !vert) || (!horz && vert)) {
        val = 255;
      } else {
        val = 0;
      }

      val = val == 0 ? rnd(100) : 255 - rnd(100);

      index = (y * data.width + x) * 4;
      data.data[index] = val;
      data.data[index + 1] = val;
      data.data[index + 2] = val;
      data.data[index + 3] = rnd(30); 
    }
  }

  c.putImageData(data,0,0);
}
