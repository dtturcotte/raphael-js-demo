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
				//lineCanvas = new Raphael(document.getElementById("lineCanvas"), 1000, 500);
				api.generatePie();
			};

			//Pathing operators: http://raphaeljs.com/reference.html#Paper.path

			api.generateChart = function () {
				log('generating chart');
					var monthColor = [],
					months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					monthPath = [],
					now = 0,
					offset = 500,
					chartWidth= 590,
					chartStartX = 600,
					chartStartY = 280,
					month = chartsCanvas.text(310+chartStartX-100, 27, months[now]).attr({
						fill: "#fff",
						stroke: "black",
						"font": '100 18px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
					}),
					nextMonthClicker = chartsCanvas.circle(364+chartStartX-100, 27, 10).attr({fill: "#fff", stroke: "black"}),
					rightArrow = chartsCanvas.path("M " + (360+chartStartX-100) + " 22 l 10 , 5 -10 , 5 z").attr({fill: "#000"}),
					prevMonthClicker = chartsCanvas.circle(256+chartStartX-100, 27, 10).attr({fill: "#fff", stroke: "black"}),
					leftArrow = chartsCanvas.path("M " + (260+chartStartX-100) + " 22 l -10 , 5 10 , 5 z").attr({fill: "#000"}),

					lineChart = chartsCanvas.path("M0,0").attr({fill: "none", "stroke-width": 4, "stroke-linecap": "round"}),
					chartFill = chartsCanvas.path("M0,0").attr({stroke: "none", opacity: .3}),
					dataPoints = [];


				//loop through 12 months and create a new random path for each...
				for (var monthRow = 0; monthRow < 12; monthRow++) {
					//generate a new array of numbers (new path string) for month j
					monthPath[monthRow] = randomPath(30, monthRow);
					monthColor[monthRow] = Raphael.getColor(1);
				}

				//create initial line and fill for first month
				log(monthPath[0]);
				lineChart.attr({path: monthPath[0], stroke: monthColor[0]});
				chartFill.attr({path: monthPath[0] + "L"+(chartWidth+chartStartX) +","+chartStartY+" " + chartStartX + "," + chartStartY + "z", fill: monthColor[0]}); //draw fill from L: width of chart (start x400+ width590) to start of chart (x=400)

				function randomPath(length, monthRow) {
					var path = "",
						x = chartStartX,
						y = 0;
					dataPoints[monthRow] = dataPoints[monthRow] || [];
					for (var col = 0; col < length; col++) {
						/*for i < 30...
							dotsy[
								[monthRow, col],
								[monthRow, col]

							]

							aka: paths for each month

							dotsy[
								[monthRow]		[100, 200, 1, 45, 22, 0]
								[monthRow+1]	[44, 24, 325, 23, 11, 88]

							]


						*/


						//add a random Num for 0 to 200 at matrix position [j][i]
						dataPoints[monthRow][col] = Math.round(Math.random() * 200);
						//log(dotsy[monthRow]);

						//dotsy[j] will contain an array of random numbers used to generate a path
						//alter the path
						if (col) {
							x += 20; //x spacing for each data point
							y = chartStartY - dataPoints[monthRow][col]; //put starting y position at 240 down... then subtract path value from it (make path rise up)
							path += "," + [x, y];
						} else {
							//else: no path exists yet... draw first path

							//start path at x,y (10, 240-path val)
							path += "M" + [chartStartX, (y = chartStartY - dataPoints[monthRow][col])] + "R"; //R: Curve to
						}
					}
					//log(path);
					return path;
				}

				/////////////////////////////////////////
				//ONCLICK FUNCTIONS... DYNAMICALLY GENERATE NEW GRAPH
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
				log("choice: " + choice);

				var input = document.createElement("input");
				input.type = "text";
				input.className = choice;
				input.name = choice;
				input.placeholder=choice;
				document.getElementById("Inputs").appendChild(input);
			};

			api.updateChart = function () {
				log("true");


			};

			api.generatePie = function () {

				chartsCanvas.clear();
				this.generateChart();
				$('.basketball').bind('input', function(e) {
					api.updateChart();

				});

				//var allInputs = document.getElementById("Inputs"),
				//	labels = [],
				//	values = [];
				var values = [50, 30, 20];
				var labels = ['test', 'test 2', 'test 3'];

				//for (var i = 0; i < allInputs.children.length; i++) {
				//
				//	labels.push("%%.%% - " + allInputs.children[i].className);
				//	values.push(parseInt(allInputs.children[i].value));
				//}

				var pie = chartsCanvas.piechart(320, 240, 100, values,
					{
						legend: labels,
						legendpos: "south",
						href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]
					});

				log(pie);


				chartsCanvas.text(320, 100, "Favorite Sports").attr({font: "20px sans-serif"});

				pie.hover(function () {
					log(this.sector);
					//this.sector.value = 100;
					//log(this.sector.)
					this.sector.stop();
					this.sector.scale(1.1, 1.1, this.cx, this.cy);

					//this.sector.animate({
					//	path: (
					//		"M 0 0 l 100 100 l 200 200"
					//	)
					//});

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
