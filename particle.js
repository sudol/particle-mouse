
    //The number of particles on the screen at once
    var PARTICLE_COUNT = 50;
    
    //This array will hold all the circles to be rendered
    var circles = [];
    
    //The current timeout
    var t;
    
    //Is the effect active
    var isActive = false;
    
    //The current mouse position
    var mousePos;
    
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
        
        //Getting canvas and context
        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");
	    
	    //Clear the context
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    
        //Draw all the cirlces
        var currentCircle;
        for (currentCircle in circles) {
            context.globalAlpha = circles[currentCircle].alpha;
            context.beginPath();
            context.moveTo(circles[currentCircle].centerX + circles[currentCircle].radius, circles[currentCircle].centerY);
            context.arc(
                circles[currentCircle].path[circles[currentCircle].currentPoint].x,
                circles[currentCircle].path[circles[currentCircle].currentPoint].y,
                circles[currentCircle].radius,
                circles[currentCircle].startingAngle,
                circles[currentCircle].endingAngle,
                circles[currentCircle].counterclockwise
            );
            
            context.lineWidth = circles[currentCircle].lineWidth;
            context.strokeStyle = circles[currentCircle].strokeStyle;
            context.fillStyle = circles[currentCircle].fillStyle;

            context.fill();
            
            //Increment the point on the path
            circles[currentCircle].currentPoint++;
            
            //Decrement down the alpha channel
            circles[currentCircle].alpha -= circles[currentCircle].alphaIncrement;
            
            //Decrement the radius
            circles[currentCircle].radius -= circles[currentCircle].radiusIncrement;
            
            /*
             * If the circle does not have another point to move to, OR the
             * circle is now invisible OR the radius is less that 1, remove it
             */
            if ((circles[currentCircle].currentPoint > (circles[currentCircle].path.length -1)) || 
                (circles[currentCircle].alpha <= 0) ||
                (circles[currentCircle].radius < 1)) {
                circles.splice(currentCircle, 1);
            }

        }
    
        if (isActive) {
            while (circles.length < PARTICLE_COUNT) {
                circles.splice(0, 0, getCircle());
            }
        } else if (circles.length <= 0) {
            clearInterval(t);
        }
        //If there are still circles left in the array, set a timer to redraw then
        
            
        //    t = setInterval(function (){drawCircle();}, 50);
        //else
        //    context.clearRect(0, 0, canvas.width, canvas.height);
	}
    
    function getCircle() {
        //Get a random radius
        var radius = Math.floor((Math.random()*8)+2);
        
        //Get a random direction
        var direction = Math.floor((Math.random()*360)+1);
        var radians = direction * (Math.PI/180);
        
        //Get a random color from an array
        var colorOption = Math.floor(Math.random() * 3);
        var colors = [
		    "#00495E",
		    "#00BFF7",
		    "#2F2F2F"
		];

        //Get the appropriate x and y increments
        var xIncrement = Math.floor(Math.sin(radians) * 10)/4;
        var yIncrement = Math.floor(Math.cos(radians) * 10)/4;
        
        var path = [];
        
        var currentX = mousePos.x;
        var currentY = mousePos.y;
        
        //The first point on the path is the current mouse position
        path.splice(0, 0, {"x" : currentX, "y" : currentY});
        
        //Put x more points on the path
        var steps = Math.floor((Math.random()*200)+10);
        for (var x=1; x<steps; x++) {
            currentX += xIncrement;
            currentY += yIncrement;
            var coord = {
                "x": currentX,
                "y": currentY
            };
            path.splice(x, 0, coord); 
        }
            
        var myCircle = {
            centerX: mousePos.x,
			centerY: mousePos.y,
			radius: radius,
            radiusIncrement: Math.floor((Math.random()*20) + 10)/100,
			startingAngle: 0 * Math.PI,
	        endingAngle: 2 * Math.PI,
	        counterclockwise: false,
	        lineWidth: 1,
	        fillStyle: colors[colorOption],
            alpha: 1,            
            alphaIncrement: Math.floor((Math.random()*20) + 10)/1000,
            path: path,
            currentPoint: 0
		};
        
        return myCircle;
    }
    
    window.onload = function() {
        var canvas = document.getElementById('myCanvas');
        
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
