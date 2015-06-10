/**
 * Created by danturcotte on 6/5/15.
 */
document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.Charts = GlobalObject.Charts || {};

		GlobalObject.Charts = (function () {
			var api = {},
				chartsCanvas = null,
				allSports = [],
				initialBarValues = true,
				barTextObjects = [];

			api.init = function () {
				chartsCanvas = new Raphael(document.getElementById("chartsCanvas"), 1500, 500);
			};

			api.generateChart = function () {
					var monthColor = [],
					months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthPath = [],
					now = 0,
					chartWidth= 590,
					chartStartX = 750,
					chartStartY = 355,
					clickerY = 108,
					month = chartsCanvas.text(310+chartStartX-100, clickerY, months[now]).attr({
						fill: "black",
						stroke: "black",
						"font": '100 20px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
					}),
					nextMonthClicker = chartsCanvas.circle(364+chartStartX-100, clickerY, 10).attr({fill: "none", stroke: "none"}),
					rightArrow = chartsCanvas.path("M " + (360+chartStartX-100) + " " + (clickerY-5) + " l 10 , 5 -10 , 5 z").attr({fill: "#000"}),
					prevMonthClicker = chartsCanvas.circle(256+chartStartX-100, clickerY, 10).attr({fill: "none", stroke: "none"}),
					leftArrow = chartsCanvas.path("M " + (260+chartStartX-100) + " " + (clickerY-5) + " l -10 , 5 10 , 5 z").attr({fill: "#000"}),

					lineChart = chartsCanvas.path("M0,0").attr({fill: "none", "stroke-width": 4, "stroke-linecap": "round"}),
					chartFill = chartsCanvas.path("M0,0").attr({stroke: "none", opacity: .3}),
					dataPoints = [];

				//loop through 12 months and create a new random path for each:
				for (var monthRow = 0; monthRow < 12; monthRow++) {
					monthPath[monthRow] = randomPath(30, monthRow);
					monthColor[monthRow] = Raphael.getColor(1);
				}

				//create initial line and fill for first month
				lineChart.attr({path: monthPath[0], stroke: monthColor[0]});
				chartFill.attr({path: monthPath[0] + "L"+(chartWidth+chartStartX) +","+chartStartY+" " + chartStartX + "," + chartStartY + "z", fill: monthColor[0]}); //draw fill from L: width of chart (start x400+ width590) to start of chart (x=400)

				function randomPath(length, monthRow) {
					var path = "",
						x = chartStartX,
						y = 0;
					dataPoints[monthRow] = dataPoints[monthRow] || [];
					for (var col = 0; col < length; col++) {
						dataPoints[monthRow][col] = Math.round(Math.random() * 200);

						if (col) {
							x += 20;
							y = chartStartY - dataPoints[monthRow][col];
							path += "," + [x, y];
						} else {
							path += "M" + [chartStartX, (y = chartStartY - dataPoints[monthRow][col])] + "R";
						}
					}
					return path;
				}

				//Onclick: generate new line chart
				var animation = function () {
					var time = 500;
					if (now == 12) {
						now = 0;
					}
					if (now == -1) {
						now = 11;
					}
					var anim = Raphael.animation({path: monthPath[now], stroke: monthColor[now]}, time, "<>");
					lineChart.animate(anim);
					chartFill.animateWith(lineChart, anim, {path: monthPath[now] + "L"+(chartWidth+chartStartX) +","+chartStartY+" " + chartStartX + "," + chartStartY + "z", fill: monthColor[now]}, time, "<>");
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
				nextMonthClicker.click(next);
				rightArrow.click(next);
				prevMonthClicker.click(prev);
				leftArrow.click(prev);
			};

			api.addMoreOptions = function () {
				var choice = document.getElementById("addOption").value;
				var input = document.createElement("input");
				input.type = "text";
				input.className = choice;
				input.name = choice;
				input.placeholder=choice;
				document.getElementById("Inputs").appendChild(input);
				allSports = [];
				initialBarValues = true;
			};

			api.generateBar = function (allSportsMatrix, labels) {
				mouseoverFlag = function () {
					log(this.bars);
					var yArray = [], res = [];
					for (var i = this.bars.length; i--;) {
						yArray.push(this.bars[i].y);
						res.push(this.bars[i].value || "0");
					}
					//Math.min.apply()
					this.flag = chartsCanvas.popup(this.bars[0].x, Math.min.apply(Math, yArray), res.join(", ")).insertBefore(this);
				//	this.flag2 = chartsCanvas.popup(this.bars[0].x, Math.min.apply(Math, yArray), "Hello").insertBefore(this);

				};
				mouseoutFlag = function () {
					this.flag.animate({opacity: 0}, 300, function () {this.remove();});
				//	this.flag2.animate({opacity: 0}, 300, function () {this.remove();});
				};
				txtattr = { font: "20px sans-serif" };
				chartsCanvas.text(480, 100, "Sports Bar").attr(txtattr);
				var bottomLabel = chartsCanvas.text(480, 400, "Voting round " + allSportsMatrix[0].length).attr({ font: "12px sans-serif" });
				barTextObjects.push(bottomLabel);
				var c = chartsCanvas.barchart(330, 150, 300, 220,
					allSportsMatrix,
					{
						stacked: true,
						gutter: "30%",
						type: "soft",
						legend: labels
					}
				).hoverColumn(mouseoverFlag, mouseoutFlag);
			};

			api.generateCharts = function () {
				chartsCanvas.clear();
				var allInputs = document.getElementById("Inputs"),
					labels = [],
					values = [];
				/*
				 - allSports[0]: [23, ...]	basketball
				 - allSports[1]: [34, ...]	baseball
				 - allSports[2]: [44, ...]	frisbee
				 */
				for (var row = 0; row < allInputs.children.length; row++) {
					//create an initial array for each sport
					if (initialBarValues) {
						values.push(parseInt(allInputs.children[row].value));
						allSports.push([parseInt(allInputs.children[row].value)]);
					}
					//do not need to create new arrays... just push next set of values into matrix
					else {
						var col = allSports[allInputs.children.length-1].length;
						values.push(parseInt(allInputs.children[row].value));
						allSports[row][col] = parseInt(allInputs.children[row].value);
					}
					labels.push("%%.%% - " + allInputs.children[row].className);
				}
				initialBarValues = false;
				this.generateBar(allSports, labels);
				this.generatePie(values, labels);
				this.generateChart();
			};

			api.generatePie = function (values, labels) {
				var pie = chartsCanvas.piechart(200, 240, 100, values,
					{
						legend: labels,
						legendpos: "south",
						href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]
					});

				chartsCanvas.text(200, 100, "Favorite Sports").attr({font: "20px sans-serif"});

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
