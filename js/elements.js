/**
 * Created by danturcotte on 6/6/15.
 */

document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.Elements = GlobalObject.Elements || {};

		GlobalObject.Elements = (function () {
			var api = {},
				elementsCanvas = null;

			api.init = function () {
				elementsCanvas = new Raphael(document.getElementById("elementsCanvas"), 200, 200);


				var circle = elementsCanvas.circle(100, 100, 80);
				circle.attr({fill: 'red', stroke: 'black', 'stroke-width': 2});

			};

			return api;
		})();
	})();
	(function () {
		GlobalObject.Elements.init();
	})();
});

