/**
 * Created by danturcotte on 6/5/15.
 */

document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.TreeTraversal = GlobalObject.TreeTraversal || {};

		GlobalObject.TreeTraversal = (function () {
			var api = {},
				treeCanvas = null,
				connect = [],
				nodeData = null,
				letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
				nodeNameCounter = 1;

			api.init = function () {
				treeCanvas = new Raphael(document.getElementById("treeCanvas"), 500, 500);

				this.totalNodes = 10;
				this.nodeList = [];
				this.allNodes = [];
				this.rowToHighlight = [];

				var totalLines = 10;
				var multiplier = treeCanvas.width / totalLines;
				for (var i = 0; i < totalLines; i++) {
					var j = treeCanvas.path("M 0 " + i * multiplier + " l " + treeCanvas.width + " 0");
					j.attr("stroke", "#fff");
					j.attr("stroke-opacity", .2);

					var j2 = treeCanvas.path("M 0 " + ((i * multiplier) + 25) + " l " + treeCanvas.width + " 0");
					j2.attr("stroke", "#fff");
					j2.attr("stroke-opacity", .08);

					var z = treeCanvas.path("M " + i * multiplier + " 0 l 0 " + treeCanvas.height);
					z.attr("stroke", "#fff");
					z.attr("stroke-opacity", .2);

					var z2 = treeCanvas.path("M " + ((i * multiplier) + 25) + " 0 l 0 " + treeCanvas.height);
					z2.attr("stroke", "#fff");
					z2.attr("stroke-opacity", .08);
				}

				this.nodeList.push(
					new Node("A", treeCanvas.width / 2, 50, "black")
				);

				nodeData = treeCanvas.text(50, treeCanvas.height - 50, "Node Data");

				this.adjMatrix = this.createAdjMatrix();

				this.drawGrid(this.adjMatrix);

				document.getElementById("runBFS").addEventListener("click", this.traversal.bind(this), false);
				document.getElementById("runDFS").addEventListener("click", this.traversal.bind(this), false);
				document.getElementById("createNode").addEventListener("click", this.createNode.bind(this), false);
			};

			api.reset = function () {
				//loop thru nodeList... set all Visited to false, set colors back to red
				for (var i = 0; i < this.nodeList.length; i++) {
					this.nodeList[i].visited = false;
					this.nodeList[i].shape.attr("fill", "#acff66");
				}

				for (var i = 0; i < this.rowToHighlight.length; i++) {
					this.rowToHighlight[i].style.color = "black";
					this.rowToHighlight[i].style.border = "none";
				}
				this.rowToHighlight = [];

				document.getElementById("myQueue").innerHTML = "";
			};

			api.getTreeData = function (node, levels) {
				if (node.name === "A" || typeof node.name === "undefined" || node.orphan) {
					return levels;
				}
				levels++;
				return this.getTreeData(node.parentNode, levels);
			};

			api.createNode = function () {
				if (nodeNameCounter < letters.split("").length) {
					if (this.allNodes.length > 0) {
						var newNode = new Node(letters.split("")[nodeNameCounter], this.allNodes[this.allNodes.length - 1].x + 20, 400, "black");
					}
					else {
						var newNode = new Node(letters.split("")[nodeNameCounter], 50, 400, "black");
					}
					this.allNodes.push(newNode);
					newNode.orphan = true;
					nodeNameCounter++;
				}
				else {
					alert("Enough nodes...");
				}
			};

			api.addChild = function () {
				if (connect.length === 2) {
					var childCnt = 0,
						parentCnt = 0;

					for (var i = 0; i < connect.length; i++) {
						if (connect[i].orphan === true) {
							var child = connect[i];
							childCnt++;
						}
						else if (connect[i].orphan === false) {
							var parent = connect[i];
							parentCnt++;
						}
					}
					if (childCnt === 1 && parentCnt === 1) {
						var breakConnectionCheck = false;
						var childrensChildren = parent.getChildren();

						for (var i = 0; i < childrensChildren.length; i++) {
							if (childrensChildren[i].getChildren().length > 0) {
								breakConnectionCheck = true;
							}
						}

						if (parent.getChildren().length < 3 && !breakConnectionCheck) {
							child.orphan = false;
							this.nodeList.push(child);

							var newMatrix = this.createAdjMatrix();

							for (var i = 0; i < this.adjMatrix.length; i++) {
								for (var j = 0; j < this.adjMatrix[i].length; j++) {
									newMatrix[i][j] = this.adjMatrix[i][j];
								}
							}

							child.parentNode = parent;
							var childIndex = this.nodeList.indexOf(child);
							var parentIndex = this.nodeList.indexOf(parent);

							newMatrix[parentIndex][childIndex] = 1;
							this.adjMatrix = newMatrix;

							this.drawGrid(this.adjMatrix);
							parent.addChildren(child);

							child.treeLevel = GlobalObject.TreeTraversal.getTreeData(child, 0);

							this.drawConnection(parent, child, true);
						}
						else {
							if (breakConnectionCheck) {
								alert("Parent has children with children. Cannot break.");
							}
							else {
								alert("Cannot connect more than 3 children.");
							}
						}
					}
					else {
						alert("You need to connect an orphan to a parent.");
					}
					connect = [];
				}
			};

			api.connectNodes = function (fromNode, toNode) {

				var index1 = this.nodeList.indexOf(fromNode);
				var index2 = this.nodeList.indexOf(toNode);
				toNode.parentNode = fromNode;

				this.drawConnection(fromNode, toNode, false);
				fromNode.addChildren(toNode);

				this.adjMatrix[index1][index2] = 1;
				this.adjMatrix[index2][index1] = 1;
			};

			api.drawGrid = function (matrix) {
				var counter = 0,
					grid = document.getElementById("grid");

				grid.innerHTML = "";

				for (var i = 0; i < this.nodeList.length; i++) {
					var nodeName = document.createElement("span");
					nodeName.className = this.nodeList[i].name + "col";
					nodeName.innerHTML = this.nodeList[i].name;
					nodeName.style.left = 10 + "px";
					nodeName.style.top = nodeName.offsetTop;
					grid.appendChild(nodeName);

				}
				grid.appendChild(document.createElement("br"));
				for (var i = 0; i < this.adjMatrix.length; i++) {
					for (var j = 0; j < this.adjMatrix[i].length; j++) {
						if (j == 0) {
							var row = document.createElement("div");
							row.id = this.nodeList[i].name;
							row.innerHTML = this.nodeList[i].name;
							grid.appendChild(row);
						}
						var el = document.createElement("span");
						el.innerHTML = matrix[i][j];
						row.appendChild(el);
					}
				}
			};

			api.traverseNodes = function (nodesToDraw, dataStructureList, algType, enableButtonsCallback) {
				var i = 0,
					j = 0,
					self = this,
					matrixTraversalRunning = true,
					dsTraversalRunning = true;

				//disable buttons while traversal is running
				document.getElementById("runDFS").style.pointerEvents = "none";
				document.getElementById("runBFS").style.pointerEvents = "none";
				document.getElementById("createNode").style.pointerEvents = "none";

				if (myInterval) clearInterval(myInterval);

				var myInterval = setInterval(function () {
					if (i >= nodesToDraw.length - 1) {
						matrixTraversalRunning = false;
						enableButtonsCallback(dsTraversalRunning, matrixTraversalRunning);
						clearInterval(myInterval);
					}
					nodesToDraw[i].shape.attr("fill", "black");
					if (i > 0) {
						self.rowToHighlight[i - 1].style.color = "blue";
						self.rowToHighlight[i - 1].style.border = "none";
					}
					self.rowToHighlight[i].style.border = "thin solid red";
					i++;
				}, 1000);

				var myInterval2 = setInterval(function () {
					var dsType = (algType === "runBFS") ? "Queue: " : "Stack: ",
						dsElement = document.createElement("span");

					dsElement.innerHTML = dsType + dataStructureList[j];
					document.getElementById("myQueue").appendChild(dsElement);
					document.getElementById("myQueue").appendChild(document.createElement("br"));
					j++;

					if (j >= dataStructureList.length) {
						var dsElement = document.createElement("span");
						dsElement.innerHTML = "Datastructure empty.";
						document.getElementById("myQueue").appendChild(dsElement);
						dsTraversalRunning = false;
						clearInterval(myInterval2);
						enableButtonsCallback(dsTraversalRunning, matrixTraversalRunning);
					}
				}, 500);

			};

			api.enableButtons = function (bool1, bool2) {
				if (!bool1 && !bool2) {
					document.getElementById("runDFS").style.pointerEvents = "auto";
					document.getElementById("runBFS").style.pointerEvents = "auto";
					document.getElementById("createNode").style.pointerEvents = "auto";
				}
			};

			api.createAdjMatrix = function () {
				var adjMatrix = [];
				for (var i = 0; i < this.nodeList.length; i++) {
					adjMatrix[i] = [];
					for (var j = 0; j < this.nodeList.length; j++) {
						adjMatrix[i][j] = 0;
					}
				}
				return adjMatrix;
			};

			api.drawConnection = function (fromNode, toNode, bool) {
				//if you're dynamically creating and connecting nodes
				if (bool) {
					var children = fromNode.getChildren();
					var that = this;

					//Node does not have siblings, set x,y in relation to parent
					if (children.length === 1) {
						children[children.length - 1].set.animate({
							cx: children[children.length - 1].parentNode.set[0].attrs.cx,
							cy: children[children.length - 1].parentNode.set[0].attrs.cy + 50,

							//x, y: coordinates of text
							x: children[children.length - 1].parentNode.set[0].attrs.cx,
							y: children[children.length - 1].parentNode.set[0].attrs.cy + 35
						}, 1000, "backOut", function () {
							var connectPath = treeCanvas.path("M " + children[children.length - 1].parentNode.set[0].attrs.cx + " " + (children[children.length - 1].parentNode.set[0].attrs.cy + 8) + " z");
							children[children.length - 1].path = connectPath;
							connectPath.animate({
								path: ("M " + children[children.length - 1].parentNode.set[0].attrs.cx + " " + (children[children.length - 1].parentNode.set[0].attrs.cy + 8) + " L " + children[children.length - 1].set[0].attrs.cx + " " + (children[children.length - 1].set[0].attrs.cy - 19) + " z")
							}, 1000, function () {
								api.resetSelectedNodes(children[children.length - 1], children[children.length - 1].parentNode);
							});
						});
					}
					//Node has siblings, set child node x,y in relation to sibling
					else {
						children[children.length - 1].set.animate({
							cx: children[children.length - 2].set[0].attrs.cx + 150 / children[children.length - 1].treeLevel,
							cy: children[children.length - 2].set[0].attrs.cy,

							//x, y: coordinates of text
							x: children[children.length - 2].set[1].attrs.x + 150 / children[children.length - 1].treeLevel,
							y: children[children.length - 2].set[1].attrs.y

						}, 1000, "backOut", function () {
							var connectPath = treeCanvas.path("M " + children[children.length - 1].parentNode.set[0].attrs.cx + " " + children[children.length - 1].parentNode.set[0].attrs.cy + " z");
							children[children.length - 1].path = connectPath;

							for (var i = 0; i < children.length; i++) {
								(function (i) {
									children[i].set.animate({
										cx: children[i].set[0].attrs.cx -= 75 / children[children.length - 1].treeLevel,

										x: children[i].set[0].attrs.cx

									}, 1000, "backOut", function () {
										children[i].path.animate({
											path: ("M " + children[i].parentNode.set[0].attrs.cx +
											" " + (children[i].parentNode.set[0].attrs.cy + 8) +

											" L " + children[i].set[0].attrs.cx +
											" " + (children[i].set[0].attrs.cy - 19) + " z")
										}, 1000, function () {
											api.resetSelectedNodes(children[i], children[i].parentNode);
										});
									});
								})(i);
							}
						});
					}
				}
				//if you're just connecting nodes to create tree on load
				else {
					var connectPath = treeCanvas.path("M " + fromNode.x + " " + (fromNode.y + 10) + " L " + toNode.x + " " + (toNode.y - 20) + " z");
				}
			};

			api.resetSelectedNodes = function (toNode, fromNode) {
				log("called");

				toNode.shape.attr("stroke-width", 2);
				fromNode.shape.attr("stroke-width", 2);

				toNode.shape.attr("stroke", "#acff66");
				fromNode.shape.attr("stroke-width", 2);
			};

			api.getUnvisitedChildren = function (node) {
				var index = this.nodeList.indexOf(node);
				var col = 0;
				while (col < this.nodeList.length) {
					log("[Row: " + node.name + ", Col: " + this.nodeList[col].name + "] ");

					var row = document.getElementById(node.name);

					if (this.rowToHighlight.indexOf(row) == -1) {
						this.rowToHighlight.push(row);
					}

					if (this.adjMatrix[index][col] === 1 && this.nodeList[col].visited === false) {
						return this.nodeList[col];
					}
					col++;
				}
				return null;
			};

			//When I push... I can get total nodes for that level
			api.traversal = function (e) {
				this.reset();

				var removeMsg = (e.target.id === "runBFS") ? "Shifting: " : "Popping: ";
				var pushMsg = (e.target.id === "runBFS") ? "Enqueuing: " : "Stacking: ";

				var root = this.nodeList[0];
				var dataStructure = [], nodesToDraw = [], aryList = [];
				//aryList[[A], [A, B], [B, C], [C]...]
				dataStructure.push(root);

				while (dataStructure.length > 0) {
					var ary = [];

					for (var j in dataStructure) {
						ary.push(dataStructure[j].name);
					}

					aryList.push("[" + ary + "]");

					var node = (e.target.id == "runBFS") ? dataStructure.shift() : dataStructure.pop();

					nodesToDraw.push(node);

					log(removeMsg + node.name);
					aryList.push(removeMsg + node.name);
					node.visited = true;
					var child = null;
					while ((child = this.getUnvisitedChildren(node)) !== null) {
						child.visited = true;
						log(pushMsg + child.name);
						aryList.push(pushMsg + child.name);
						dataStructure.push(child);
					}
				}
				this.traverseNodes(nodesToDraw, aryList, e.target.id, this.enableButtons); //callback to re-enable buttons after traversal finishes
			};

			var Node = function (name, x, y, color) {
				this.set = treeCanvas.set();
				this.shape = treeCanvas.circle(x, y, 10);
				this.path = null;

				treeCanvas.setStart();
				this.radius = 10;
				this.treeLevel = 0;
				this.name = name;
				this.parentNode = this;
				this.orphan = false;
				this.visited = false;
				this.x = x || 0;
				this.y = y || 0;

				this.text = treeCanvas.text(x, y - 15, this.name);
				this.text.attr({
					'font-size': 10,
					'fill': "#fff"
				});

				var myChildren = [];

				this.getChildren = function () {
					return myChildren;
				};

				this.getChildrenNames = function () {
					var tmpAry = [];
					for (var i = 0; i < myChildren.length; i++) {
						tmpAry.push(myChildren[i].name);
					}
					return tmpAry;
				};

				this.addChildren = function (node) {
					myChildren.push(node);
				};

				this.color = color;
				this.shape.attr("fill", "#acff66");
				this.shape.attr("fill-opacity", .4);
				this.shape.attr("stroke-width", 2);
				this.shape.attr("stroke", "#acff66");
				var that = this;

				this.set.push(this.shape, this.text);

				this.set[0].node.onclick = function () {
					connect.push(that);
					that.shape.attr("stroke-width", 3);
					GlobalObject.TreeTraversal.addChild();
				};

				this.set[0].hover(
					function () {
						this.g = this.glow({
							color: "#fff",
							width: 20,
							opacity: .5
						});
						this.node.style.cursor = 'pointer';

						nodeData.attr({
							text: "Node: " + that.name + "\n Parent: " + that.parentNode.name + "\n Children: " + that.getChildrenNames().join(", ") + "\n Tree level: " + GlobalObject.TreeTraversal.getTreeData(that, 0),
							color: "white"
						});
					},
					function () {
						this.g.remove();
					}
				);

			};

			return api;
		})();

	})();

	(function () {
		GlobalObject.TreeTraversal.init();
	})();
});
