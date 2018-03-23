(() => {
	const canvas = document.querySelector('.c'),
		  $ = canvas.getContext('2d');
		  
	let width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		random = num => Math.random() * num;
		
	let options = {
		bgc: '#111',
		pi2: Math.PI * 2,
		radius: 2,
		addRadius: 2,
		particles: 10,
		speed: 3,
		addSpeed: 2,
		color: 'rgba(255, 255, 255, .8)',
		
		boundRadius: 150,
		lineColor: 'rgba(255, 255, 255, alpha)',
		lineWidth: .5
	};
	let particles = [];
	function distanceFormula(x1, y1, x2, y2) {
		return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
	}
	function sub(x1, x2) {
		return x1 - x2;
	}
	class Ball {
		constructor(x, y) {
			this.x = x || 0;
			this.y = y || 0;
			
			this.radius = 30;
			this.color = 'lavender';
			
			canvas.onmousemove = ($event) => {
				let rect = canvas.getBoundingClientRect();
				this.x = $event.clientX - rect.x;
				this.y = $event.clientY - rect.y;
			}
		}
		draw() {
			$.beginPath();
			$.strokeStyle = this.color;
			$.arc(this.x, this.y, this.radius, 0, options.pi2);
			$.stroke();
			$.closePath();
		}
	}
	class Particle {
		constructor(posX, posY) {
			this.x = posX || 0;
			this.y = posY || 0;
			
			this.radius = options.radius + random(options.addRadius);
			this.speed = options.speed + random(options.addSpeed);
			this.color = options.color;
			this.angle = random(options.pi2);
			this.direction = {
				x: Math.cos(this.angle) * this.speed,
				y: Math.sin(this.angle) * this.speed
			}
			
			this.velX = 0;
			this.velY = 0;
			this.friction = 0.3;
		}
		draw() {
			$.beginPath();
			$.fillStyle = this.color;
			$.arc(this.x, this.y, this.radius, 0, options.pi2)
			$.fill();
			$.closePath();
		}
		
		update() {
			this.x += this.direction.x;
			this.y += this.direction.y;
			
			this.border();
		}
		border() {
			if(this.x > width || this.x < 0) {
				this.direction.x *= -1;
			}
			if(this.y > height || this.y < 0) {
				this.direction.y *= -1;
			}
			
			this.x > width ? this.x = width : this.x;
			this.y > height ? this.y = height : this.y;
			this.x < 0 ? this.x = 0 : this.x;
			this.y < 0 ? this.y = 0 : this.y;
		}
		pushing(coords) {
			let dx = sub(this.x, coords.x),
				dy = sub(this.y, coords.y);
			let distance = distanceFormula(this.x, this.y, coords.x, coords.y);
			if(distance < 100) {
				let angle = Math.atan2(dy, dx);
				let pushX = -dx + 100 * Math.cos(angle),
					pushY = -dy + 100 * Math.sin(angle);
				this.velX += pushX;
				this.velY += pushY;
			}
			this.frictionForce();
			
			
			this.x += this.velX;
			this.y += this.velY;
		}
		frictionForce() {
			this.velX *= this.friction;
			this.velY *= this.friction;
		}
	}
	let ball = new Ball();
	for(let i = 0; i < options.particles; i++) {
		particles.push( new Particle(
			random(width),
			random(height)
		) );
	}
	
	function boundingParticles(particle, siblings) {
		for(let i = 0; i < siblings.length; i++) {
			let distance = distanceFormula(particle.x, particle.y, siblings[i].x, siblings[i].y);
			let opacity = 1 - distance / options.boundRadius;
			
			if(opacity > 0) {
				$.beginPath();
				$.strokeStyle = options.lineColor.replace('alpha', opacity);
				$.lineWidth = options.lineWidth;
				$.moveTo(particle.x, particle.y);
				$.lineTo(siblings[i].x, siblings[i].y);
				$.stroke();
				$.closePath();
			}
		}
	}
	function animation() {
		$.fillStyle = options.bgc;
		$.fillRect(0, 0, width, height);
		ball.draw();
		particles.forEach((p) => {
			p.draw();
			
			p.pushing(ball);
			p.update();
			boundingParticles(p, particles);
		});
		window.requestAnimationFrame(animation);
	}
	animation();
	canvas.onclick = ($event) => {
		particles.push(
			new Particle(
				$event.clientX,
				$event.clientY
			)
		);
	}
	canvas.oncontextmenu = ($event) => {
		$event.preventDefault();
		particles.splice(particles.length - 1, 1);
	}
	
	window.onresize = () => {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}
})();