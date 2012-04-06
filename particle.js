
    //The number of particles on the screen at once
    var PARTICLE_COUNT = 150;
    var FOREGROUND_COLOR = "black";    
    
    var COMPOSITION_MODE = "destination-out";
    //The colors of the particles
    var colors = [
    	    "#00495E",
		    "#00BFF7",
		    "#2F2F2F"
		];
        
    //This array will hold all the particles to be rendered
    var circles = [];
    
    //Holds the timeout
    var t;
    
    //Is the effect active
    var isActive = false;
    
    //The current mouse position
    var mousePos;
    
    var canvas;
    var context;
    
    function getMousePos(canvas, evt) {
        var obj = canvas;
        var top = 0;
        var left = 0;
    
        while (obj && obj.tagName != 'BODY') {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x: mouseX,
            y: mouseY
        };
    }
    
    function drawCircle() {
        
	    //Clear the canvas
        canvas.width = canvas.width;
        
        context.fillStyle = FOREGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = COMPOSITION_MODE;
        
        //Draw all the cirlces
        var currentCircle;
        for (currentCircle in circles) {
            context.globalAlpha = circles[currentCircle].alpha;
            context.beginPath();
            context.moveTo(circles[currentCircle].centerX + circles[currentCircle].radius, circles[currentCircle].centerY);
            context.arc(
                circles[currentCircle].centerX,
                circles[currentCircle].centerY,
                circles[currentCircle].radius,
                circles[currentCircle].startingAngle,
                circles[currentCircle].endingAngle,
                circles[currentCircle].counterclockwise
            );
            
            context.lineWidth = circles[currentCircle].lineWidth;
            context.strokeStyle = circles[currentCircle].strokeStyle;
            context.fillStyle = circles[currentCircle].fillStyle;

            context.fill();
            
            //Increment the x and y position
            circles[currentCircle].centerX += circles[currentCircle].xIncrement;
            circles[currentCircle].centerY += circles[currentCircle].yIncrement;
            
            //Decrement down the alpha channel
            circles[currentCircle].alpha -= circles[currentCircle].alphaIncrement;
            
            //Decrement the radius
            circles[currentCircle].radius -= circles[currentCircle].radiusIncrement;
            
            /*
             * If the circle does not have another point to move to, OR the
             * circle is now invisible OR the radius is less that 1, remove it
             */
            if ((circles[currentCircle].alpha <= 0) ||
                (circles[currentCircle].radius < 1)) {
                circles.splice(currentCircle, 1);
            }
        }
    
        if (isActive) {
            //Add more particles until we have enough
            while (circles.length < PARTICLE_COUNT) {
                circles.splice(0, 0, getCircle());
            }
        } else if (circles.length <= 0) {
            clearInterval(t);
        }

	}
    
    function getCircle() {
        //Get a random radius
        var radius = Math.floor((Math.random()*8)+2);
        
        //Get a random direction
        var direction = Math.floor((Math.random()*360)+1);
        var radians = direction * (Math.PI/180);
        
        //Get a random color from an array
        var colorOption = Math.floor(Math.random() * colors.length);

        //Get the appropriate x and y increments
        var xIncrement = Math.floor(Math.sin(radians) * 10)/5;
        var yIncrement = Math.floor(Math.cos(radians) * 10)/5;
            
        var myCircle = {
            centerX: mousePos.x,
			centerY: mousePos.y,
			radius: radius,
            radiusIncrement: Math.floor((Math.random()*20) + 10)/100,
            xIncrement: xIncrement,
            yIncrement: yIncrement,
			startingAngle: 0 * Math.PI,
	        endingAngle: 2 * Math.PI,
	        counterclockwise: false,
	        fillStyle: colors[colorOption],
            alpha: 1,            
            alphaIncrement: Math.floor((Math.random()*20) + 10)/1000
		};
        
        return myCircle;
    }
    
    window.onload = function() {
        canvas = document.getElementById('myCanvas');
        //var title = document.getElementById('title');
        context = canvas.getContext("2d");
        
        context.fillStyle = FOREGROUND_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas.addEventListener('mousemove', function(evt){
            mousePos = getMousePos(canvas, evt);
            
        }, false);
        
        canvas.addEventListener('mouseover', function(evt){
            mousePos = getMousePos(canvas, evt);
            isActive = true;
            
            clearInterval(t);
            t = setInterval(function (){drawCircle();}, 1000/30);
        }, false);
        
        canvas.addEventListener('mouseout', function(){
            isActive = false;
        }, false);
    };
