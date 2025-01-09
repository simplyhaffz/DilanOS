// Configure
var MAX_DISTANCE  = 300,
    PARTICLES     = 25,
    PARTICLE_SIZE = 5;

// No configure! 
Math.Tau = Math.PI * 2;
Math.rand = function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame    ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

document.addEventListener('DOMContentLoaded', function(event) {
  // Canvas setup
  const canvas = document.getElementById('c');
  const context = canvas.getContext('2d');
  if (!canvas || !context) {
    console.error('Canvas element or context not found.');
    return;
  }

  // Resize canvas to fit window
  let width, height;
  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resizeCanvas(); // Initial resizing
  window.addEventListener('resize', resizeCanvas); // Resize on window change

  var particleCounter = 0,
      hover = false,
      stats = new Stats(),
      mmon = new MousePositionMonitor();

  stats.setMode(0); // Start off with FPS mode

  // Place the statistics at the bottom right.
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '5px';
  stats.domElement.style.bottom = '5px';
  
  document.body.appendChild(stats.domElement);

  context.lineWidth = 1;
  
  var resize = function(event) {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }; resize();
  
  window.addEventListener('resize', resize);
  
  canvas.addEventListener('mouseenter', function() {
    hover = true;
  });

  canvas.addEventListener('mouseleave', function() {
    hover = false;
  });
  
  var Particle = function Particle(x, y, size, color) {
    this.x  = x;
    this.y  = y;
    this.s  = size;
    this.r  = size / 2;
    this.vx = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.5, 2);
    this.vy = (Math.random() < 0.5 ? -1 : 1) * Math.rand(0.5, 2);
    this.id = particleCounter++;
    this.c  = color;
  };
  
  Particle.prototype.distance = function(that) {
    return Math.sqrt((this.x-that.x) * (this.x - that.x) + (this.y - that.y) * (this.y - that.y));
  };
  
  Particle.prototype.step = function() {
    this.x += this.vx;
    if(this.x < this.r) {
      this.x = this.r;
      this.vx *= -1;
    } else if(this.x > width - this.r) {
      this.x = width - this.r;
      this.vx *= -1;
    }
    
    this.y += this.vy;
    if(this.y < this.r) {
      this.y = this.r;
      this.vy *= -1;
    } else if(this.y > height - this.r) {
      this.y = height - this.r;
      this.vy *= -1;
    }
  };
  
  Particle.prototype.render = function() {
    context.fillStyle = this.c;
    context.beginPath();
      context.arc(this.x, this.y, Math.floor(this.s / 2), 0, Math.Tau);
    context.closePath();
    context.fill();
  };
  
  var particles = [];
  for(var i = 0; i < PARTICLES - 1; i++) {
    particles.push(
      new Particle(
        Math.random() * width, 
        Math.random() * height, 
        PARTICLE_SIZE, 
        'rgba(200, 200, 200, 1)'
      )
    );
  }
  
  // this one is controllable by mouse movement.
  var mouseParticle = new Particle(
    Math.random() * width, 
    Math.random() * height, 
    PARTICLE_SIZE * 2,
    'rgba(50, 200, 90, 1)'
  );
  
  mouseParticle.imp = true;
  
  particles.push(mouseParticle);

  var hue = 0;
  var render = function() {
    hue = ((hue + 0.05) % 360);
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(0, 0, width, height);
    
    if(hover) {
      var pos = mmon.getMousePosition();
      mouseParticle.x = pos.x;
      mouseParticle.y = pos.y;
    }
    
    // render all the particles and check distances
    var paired = {};
    var ipart  = PARTICLES;
    while(ipart--) {
      var p1    = particles[ipart];
      var jpart = ipart;
      
      p1.step();
      p1.render();
      
      while(jpart--) {
        var p2 = particles[jpart],
            ida = ((p1.id << 16) | p2.id), // generate a pair id to prevent rendering the relationship twice
            idb = ((p2.id << 16) | p1.id); // generate a reverse pair id to prevent rendering the relationship twice
                   
        if(p1 !== p2 && !paired[ida] && !paired[idb]) {
          var distance = p1.distance(p2);
          if(distance < MAX_DISTANCE) {
            var alpha = (1 - (distance / MAX_DISTANCE));
            if(p1.imp) {
              context.strokeStyle = 'rgba(50, 200, 90, ' + alpha + ')';
            } else {
              //context.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
              context.strokeStyle = 'hsla(' + hue + ', 75%, 50%, ' + alpha + ')';
            }
            
            context.beginPath();
              context.moveTo(p1.x, p1.y); // start from here
            
              // wiggly woggle wob shock!
              for(var currentPoint = 0.25; currentPoint < 1; currentPoint += 0.20) {
                var ptx = (p1.x + (p2.x - p1.x) * currentPoint),
                    pty = (p1.y + (p2.y - p1.y) * currentPoint);

                context.lineTo(ptx + 12 - (Math.random() * 20), pty + 12 - (Math.random() * 20));
              }
              
              // end here!
              context.lineTo(p2.x, p2.y);
            // context.stroke(); // stroke before closePath, prevent a line back from last point
            context.closePath();
            context.stroke(); // stroke after closePath, render a line back from last point
            
            paired[ida] = paired[idb] = true;
          }
        }
      }
    }
  };
  
  var loop = function() {
    requestAnimFrame(loop);
    stats.begin();
    render();
    stats.end();
  }; loop();
});
