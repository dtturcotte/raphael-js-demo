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
				elementsCanvas = new Raphael(document.getElementById("elementsCanvas"), 600, 100);
				var circle = new Shape (130, 60, 32);
				this.addClickEventForCSS();
			};

			var Shape = function (x, y, r) {
				var that = this;
				this.set = elementsCanvas.set();
				this.shape = elementsCanvas.circle(x, y, r);
				this.shape.attr({
					fill: 'blue',
					stroke: 'blue',
					'stroke-width': 1,
					'fill-opacity':.5
				});
				this.text = elementsCanvas.text(x, y, 'RAPHAEL	');
				this.text.attr({
					'font-size': 13,
					'fill': "#fff"
				});

				this.set.push(this.shape, this.text);

				this.shape.node.onclick = function () {
					that.set.animate({ cx: 450, x: 450}, 1000);
				};
			};

			api.addClickEventForCSS = function () {
				$('#circle').on('click', function() {
					$(this).toggleClass('clicked');
				});
			};

			return api;
		})();
	})();
	(function () {
		GlobalObject.Elements.init();
	})();
});

