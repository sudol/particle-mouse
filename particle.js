
    var MIN_RADIUS = 2;
    var MAX_RADIUS = 8;

    var MIN_RADIUS_DECREMENT = 10;
    var MAX_RADIUS_DECREMENT = 20;

    var MIN_ALPHA_DECREMENT = 10;
    var MAX_ALPHA_DECREMENT = 20;

    var MIN_BLUR = 1;
    var MAX_BLUR = 10;

    //The number of particles on the screen at once
    var PARTICLE_COUNT = 200;

    var ACCELERATION = .005;

    //This array will hold all the circles to be rendered
    var circles = [];

    //The current timeout
    var t;

    //Is the effect active
    var isActive = false;

    //The current mouse position
    var mousePos;

    var canvas, context;

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
	    context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;
	    //Clear the context
	    context.clearRect(0, 0, canvas.width, canvas.height);

        //Draw all the cirlces
        var currentCircle;
        var toRemove = [];
        for (var currentCircle = circles.length -1; currentCircle > 0; currentCircle--) {
            context.globalAlpha = Math.round(circles[currentCircle].alpha*1000)/1000;
            context.shadowBlur = circles[currentCircle].blur;
            context.shadowColor = circles[currentCircle].fillStyle;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            if(circles[currentCircle].radius > 1) {
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

                context.fillStyle = circles[currentCircle].fillStyle;
                context.fill();
                context.closePath();

                //Decrement down the alpha channel
                circles[currentCircle].alpha -= circles[currentCircle].alphaIncrement;

                //Decrement the radius
                circles[currentCircle].radius -= circles[currentCircle].radiusIncrement;

                circles[currentCircle].centerX += circles[currentCircle].incrementX;
                circles[currentCircle].centerY += circles[currentCircle].incrementY;

                circles[currentCircle].incrementX += circles[currentCircle].incrementX * ACCELERATION;
                circles[currentCircle].incrementY += circles[currentCircle].incrementY * ACCELERATION;
            }
            /*
             * If the circle is now invisible OR the radius is less that 1, remove it
             */

            if (circles[currentCircle].alpha <= 0 || circles[currentCircle].radius < 1) {
                toRemove.push(currentCircle);
                circles.splice(currentCircle, 1);
            }
        }

        if (isActive) {
            var limit = 0;
            while ((circles.length < PARTICLE_COUNT) && limit < 5) {
                circles.splice(0, 0, getCircle());
                limit++;
            }
        } else if (circles.length <= 0) {
            clearInterval(t);
        }

        //If there are still circles left in the array, set a timer to redraw


        t = setTimeout(function (){drawCircle();}, 1000/60);
        //else
        //    context.clearRect(0, 0, canvas.width, canvas.height);
	}

    function getCircle() {
        //Get a random radius
        var radius = Math.floor((Math.random()*MAX_RADIUS)+MIN_RADIUS);

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
        var incrementX = Math.floor(Math.sin(radians) * 10)/16;
        var incrementY = Math.floor(Math.cos(radians) * 10)/16;

        var speed = Math.random();

        var myCircle = {
            centerX: mousePos.x,
			centerY: mousePos.y,
			incrementX: incrementX,
			incrementY: incrementY,
			radius: radius,
            radiusIncrement: Math.floor((Math.random() * MAX_RADIUS_DECREMENT) + MIN_RADIUS_DECREMENT)/1000,
			startingAngle: 0 * Math.PI,
	        endingAngle: 2 * Math.PI,
	        counterclockwise: false,
	        speed: speed,
	        fillStyle: colors[colorOption],
            alpha: 1.0,
            alphaIncrement: Math.floor((Math.random() * MAX_ALPHA_DECREMENT) + MIN_ALPHA_DECREMENT)/10000,
            blur: Math.floor((Math.random() * MAX_BLUR) + MIN_BLUR)
		};

        return myCircle;
    }

    window.onload = function() {
        canvas = document.getElementById("the-canvas");
        context = canvas.getContext("2d");



        canvas.addEventListener('mousemove', function(evt){
            mousePos = getMousePos(canvas, evt);
            // if (t == undefined) {
            //   t = setTimeout(function (){drawCircle();}, 1000/60);
            // }
        }, false);

        canvas.addEventListener('mouseover', function(evt){
            mousePos = getMousePos(canvas, evt);
            isActive = true;
            clearInterval(t);
            t = setTimeout(function (){drawCircle();}, 1000/60);
            //t = setInterval(function (){drawCircle();}, 1000/60);
        }, false);

        canvas.addEventListener('mouseout', function(){
            isActive = false;
        }, false);

        $(canvas).trigger("mouseover");
    };
