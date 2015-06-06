/**
 * Created by danturcotte on 6/5/15.
 */
document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.Charts = GlobalObject.Charts || {};

		GlobalObject.Charts = (function () {
			var api = {},
				chartsCanvas = null;

			api.init = function () {
				chartsCanvas = new Raphael(document.getElementById("chartsCanvas"), 1000, 500);
			};

			api.generateChart = function () {
				var r = chartsCanvas,
					e = [],
					clr = [],
					months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					values = [],
					now = 0,
					offset = 500,
					month = r.text(310, 27, months[now]).attr({
						fill: "#fff",
						stroke: "black",
						"font": '100 18px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
					}),
					rightc = r.circle(364, 27, 10).attr({fill: "#fff", stroke: "none"}),
					right = r.path("M360,22l10,5 -10,5z").attr({fill: "#000"}),
					leftc = r.circle(256, 27, 10).attr({fill: "#fff", stroke: "none"}),
					left = r.path("M260,22l-10,5 10,5z").attr({fill: "#000"}),
					c = r.path("M0,0").attr({fill: "none", "stroke-width": 4, "stroke-linecap": "round"}),
					bg = r.path("M0,0").attr({stroke: "none", opacity: .3}),
					dotsy = [];

				function randomPath(length, j) {
					var path = "",
						x = 10,
						y = 0;
					dotsy[j] = dotsy[j] || [];
					for (var i = 0; i < length; i++) {
						dotsy[j][i] = Math.round(Math.random() * 200);
						// if (i) {
						//     path += "C" + [x + 10, y, (x += 20) - 10, (y = 240 - dotsy[j][i]), x, y];
						// } else {
						//     path += "M" + [10, (y = 240 - dotsy[j][i])];
						// }
						if (i) {
							x += 20;
							y = 240 - dotsy[j][i];
							path += "," + [x, y];
						} else {
							path += "M" + [10, (y = 240 - dotsy[j][i])] + "R";
						}
					}
					return path;
				}

				for (var i = 0; i < 12; i++) {
					values[i] = randomPath(30, i);
					clr[i] = Raphael.getColor(1);
				}
				c.attr({path: values[0], stroke: clr[0]});
				bg.attr({path: values[0] + "L590,250 10,250z", fill: clr[0]});
				var animation = function () {
					var time = 500;
					if (now == 12) {
						now = 0;
					}
					if (now == -1) {
						now = 11;
					}
					var anim = Raphael.animation({path: values[now], stroke: clr[now]}, time, "<>");
					c.animate(anim);
					bg.animateWith(c, anim, {path: values[now] + "L590,250 10,250z", fill: clr[now]}, time, "<>");
					month.attr({text: months[now]});
					month.attr({
						stroke : "black"
					});
				};
				var next = function () {
						now++;
						animation();
					},
					prev = function () {
						now--;
						animation();
					};
				rightc.click(next);
				right.click(next);
				leftc.click(prev);
				left.click(prev);

			};

			api.addMoreOptions = function () {
				var choice = document.getElementById("addOption").value;
				log("choice: " + choice);

				var input = document.createElement("input");
				input.type = "text";
				input.className = choice;
				input.name = choice;
				input.placeholder=choice;
				document.getElementById("Inputs").appendChild(input);
			};


			api.generatePie = function () {
			//	this.generateChart();
				chartsCanvas.clear();
				var allInputs = document.getElementById("Inputs"),
					labels = [],
					values = [];
				for (var i = 0; i < allInputs.children.length; i++) {
					log(allInputs.children[i].name);
					labels.push("%%.%% - " + allInputs.children[i].className);
					values.push(parseInt(allInputs.children[i].value));
				}

				var pie = chartsCanvas.piechart(320, 240, 100, values,
					{
						legend: labels,
						legendpos: "south",
						href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]
					});

				chartsCanvas.text(320, 100, "Favorite Sports").attr({font: "20px sans-serif"});

				pie.hover(function () {
					this.sector.stop();
					this.sector.scale(1.1, 1.1, this.cx, this.cy);

					if (this.label) {
						this.label[0].stop();
						this.label[0].attr({r: 7.5});
						this.label[1].attr({"font-weight": 800});
					}
				}, function () {
					this.sector.animate({transform: 's1 1 ' + this.cx + ' ' + this.cy}, 500, "bounce");

					if (this.label) {
						this.label[0].animate({r: 5}, 500, "bounce");
						this.label[1].attr({"font-weight": 400});
					}
				});
			};
			return api;
		})();
	})();
	(function () {
		GlobalObject.Charts.init();
	})();
});
