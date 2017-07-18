const defaultOptions = {
	activeClass: "is-active",
	rightClass: "is-right",
	rightPassiveClass:"is-passive-right",
	leftClass: "is-left",
	leftPassiveClass:"is-passive-left",
	prevButton: "js-next",
	nextButton: "js-prev",
	navWrapper: "slider__nav", 
	navPrevText: "<",
	navNextText: ">",
}

class Slider {

	constructor(selector, options = {}){

		this.selector = selector;
		this.children = this.selector.children;
		this.parent = this.selector.parentNode;
		this.options = {
			activeClass: options.activeClass || defaultOptions.activeClass,
			rightClass: options.rightClass || defaultOptions.rightClass,
			rightPassiveClass: options.rightPassiveClass || defaultOptions.rightPassiveClass,
			leftClass: options.leftClass || defaultOptions.leftClass,
			leftPassiveClass: options.leftPassiveClass || defaultOptions.leftPassiveClass,
			prevButton: options.prevButton || defaultOptions.prevButton,
			nextButton: options.nextButton || defaultOptions.nextButton,
			navWrapper: options.navWrapper || defaultOptions.navWrapper,
			prevText: options.prevText || defaultOptions.prevText,
			nextText: options.nextText || defaultOptions.nextText
		};
		this.initialClasses();
		this.buildNavigation();
		this.swipeOnMobile();
	}

	initialClasses(){
		if( this.children.length > 5) {
			this.children[this.children.length - 1].classList.add(this.options.leftPassiveClass);
			this.children[3].classList.add(this.options.rightPassiveClass);
		}
		this.children[0].classList.add(this.options.leftClass);
		this.children[1].classList.add(this.options.activeClass);
		this.children[2].classList.add(this.options.rightClass);
	}

	indexOf(className){
		let i;
		for (i = 0; i < this.children.length; i++) {
			if(this.children[i].classList.contains(className)){
				return i;
			}
		}
	}

	removeClasses(){
		let i;
		for (i = 0; i < this.children.length; i++) {
			this.children[i].className = "";
		}	
	}

	indexExist(direction, index) {
		if(direction == 'next') {
			let totalIndex = this.children.length - 1;
			if (index < totalIndex )
				return (index + 1)
			else
				return 0
		} else {
			let totalIndex = 0;
			if (index > totalIndex )
				return (index - 1)
			else
				return (this.children.length - 1)
		}
	}

	changeClasses(direction) {
		let total = this.children.length - 1;
		
		let leftPassClass = parseInt(this.indexOf(this.options.leftPassiveClass)),
			leftClass = parseInt(this.indexOf(this.options.leftClass)),
			activeClass =parseInt( this.indexOf(this.options.activeClass)),
			rightClass = parseInt(this.indexOf(this.options.rightClass)),
			rightPassClass = parseInt(this.indexOf(this.options.rightPassiveClass));

		let nextLeftPassClass = this.indexExist(direction, leftPassClass),
			nextLeftClass = this.indexExist(direction, leftClass),
			nextActiveClass = this.indexExist(direction, activeClass),
			nextRightClass = this.indexExist(direction, rightClass),
			nextRightPassClass = this.indexExist(direction, rightPassClass);
		
		console.log(`${leftPassClass}, ${leftClass}, ${activeClass}, ${rightClass}, ${rightPassClass}`);
		console.log(`${nextLeftPassClass}, ${nextLeftClass}, ${nextActiveClass}, ${nextRightClass}, ${nextRightPassClass}`);

		this.removeClasses();

		this.children[nextActiveClass].classList.add(this.options.activeClass);
		this.children[nextLeftClass].classList.add(this.options.leftClass);
		this.children[nextRightClass].classList.add(this.options.rightClass);
		if( this.children.length > 5) {
			this.children[nextLeftPassClass].classList.add(this.options.leftPassiveClass);
			this.children[nextRightPassClass].classList.add(this.options.rightPassiveClass);
		}
	}

	buildNavigation() {
		const navButtons = `
				<span class='${this.options.prevButton}'>${this.options.prevText}</span>
				<span class='${this.options.nextButton}'>${this.options.nextText}</span>
			`;

		const navWrapper = document.createElement('div');
		
		navWrapper.classList.add(this.options.navWrapper);
		this.parent.appendChild(navWrapper);
		navWrapper.innerHTML = navButtons;

		let parent = this.selector.parentNode,
			prev = parent.querySelector(`.${this.options.prevButton}`),
			next = parent.querySelector(`.${this.options.nextButton}`);
		
		next.addEventListener('click', () => {
			this.changeClasses('next');
		}, false);
		prev.addEventListener('click', () => {
			this.changeClasses('prev');
		}, false);
	}

	// SWIPE on mobile
	swipeOnMobile(){
		let touchsurface = this.selector,
			dist,
			swipeDir, 
			startX, 
			startY,
			distX,
			distY,
			threshold = 150, //required min distance traveled to be considered swipe
			restraint = 100, // maximum distance allowed at the same time in perpendicular direction
			allowedTime = 300,
			elapsedTime, 
			startTime,
			handler = () => {
				this.changeClasses(swipeDir)
			},
			isDown = false;

		// MOBILE TOUCH EVENT
		touchsurface.addEventListener('touchstart', (e) => {
			let touchObj = e.changedTouches[0];
			swipeDir = "none"
			dist = 0
			startX = touchObj.pageX
			startY = touchObj.pageY
			startTime = new Date().getTime()
			e.preventDefault()
		}, false);

		touchsurface.addEventListener('touchmove', (e) => {
			e.preventDefault();
		}, false);

		touchsurface.addEventListener('touchend', (e) =>{
			let touchObj = e.changedTouches[0];
			distX = touchObj.pageX - startX;
			distY = touchObj.pageY - startY;
			elapsedTime = new Date().getTime() - startTime;
			if(elapsedTime <= allowedTime) {
				if(Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
					swipeDir = (distX < 0) ? 'next' : 'prev'
				}
			}
			if (swipeDir != 'none') {
				handler();
			}
			e.preventDefault();
		}, false);
	}
}