/**
 * Created by danturcotte on 6/6/15.
 */
document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.Header = GlobalObject.Header || {};

		GlobalObject.Header = (function () {
			var api = {},
				headerCanvas = null,
				moveableBlock = null,
				nodeShapes = {
					"Doc": "M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z",
					"Folder": "M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z"
				},
				startingShapes = [
					"M 25 25 l 50 0 l 0 50 l -50 0 l 0 -50 z",
					"M 100 25 l 50 0 l 0 50 l -50 0 l 0 -50 z",
					"M 175 25 l 50 0 l 0 50 l -50 0 l 0 -50 z",
					"M 250 25 l 50 0 l 0 50 l -50 0 l 0 -50 z"
				],
				letterShapes = [
					"M 25 75 l 0 -50 l 50 0 l 0 10 l -40 0 l 0 10 l 40 0 l 0 10 l -40 0 l 0 20 l -10 0 z",
					"M 100 25 l 0 50 l 50 0 l 0 -50 l -10 0 l 0 40 l -30 0 l 0 -40 l -10 0 z",
					"M 175 25 l 50 0 l 0 10 l -40 30 l 40 0 l 0 10 l -50 0 l 0 -10 l 40 -30 l -39 0 l 0 -10 z",
					"M 250 25 l 50 0 l 0 10 l -40 30 l 40 0 l 0 10 l -50 0 l 0 -10 l 40 -30 l -39 0 l 0 -10 z"
				],
				shapeArray = [];

			api.init = function () {
				headerCanvas = new Raphael(document.getElementById("headerCanvas"), 350, 100);

				moveableBlock = new Logo("Logo", "M 400 25 l 50 0 l 0 50 l -50 0 l 0 -50 z", "black");

				for (var i = 0; i < letterShapes.length; i++) {
					shapeArray.push([new Logo("Logo", startingShapes[i], "black"), letterShapes[i]]);
				}

				document.getElementById("tryStuff").addEventListener("click", this.tryStuff.bind(this), false);
				document.onmousedown = this.handleMouseDown;
			};
			//set new draw path to whereever I click
			api.handleMouseDown = function (e) {
				//		log("mouse down");
				//	log(e.clientX);
				//test.shape = "M 500 25 l 50 0 l 0 50 l -50 0 l 0 -50 z";
				moveableBlock.shape.animate({
					path: (
					"M " + e.clientX + " " + e.clientY + " l 50 0 l 0 50 l -50 0 l 0 -50 z"
					)
				}, 2000);
			};

			api.tryStuff = function () {
				for (var i = 0; i < shapeArray.length; i++) {
					(function (i) {
						shapeArray[i][0].shape.animate({
							path: (
								shapeArray[i][1]
							)
						}, 1000, 'backOut', function () {
							shapeArray[i][0].shape.attr("fill", "#f00");
							shapeArray[i][0].shape.attr("stroke", "#fff");

						}, 3000);
					})(i);
				}
			};

			var Logo = function (name, shapeCoords, color) {
				//M: Move cursor to 250, 250 without drawing
				//l: draw line RELATIVE to this point at 250 250... so
				//
				this.shape = headerCanvas.path(shapeCoords);
				this.color = color;
				this.path = shapeCoords;

				//	this.shape.attr("fill", "#f00");

				this.shape.onclick = function () {
					alert("clicked");
				};
				//this.shape.attr("stroke", "#fff");

			};

			return api;
		})();
	})();
	(function () {
		GlobalObject.Header.init();
	})();
});
