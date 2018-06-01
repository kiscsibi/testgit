define(["jquery", "text!./ujcluster.css","./d3.v3.min","./kmeans"],
function($, cssContent) {'use strict';
 $("<style>").html(cssContent).appendTo("head")
	return {
	   initialProperties : {
        version: 1.0, 
         qHyperCubeDef : {
              qDimensions : [], 
              qMeasures : [], 
              qInitialDataFetch : [{ 
                   qWidth : 4, 
                   qHeight : 1000
               }]
           }
        }, 
		        definition : {
            type : "items",
            component : "accordion",
            items : {
                dimensions : {
                    uses : "dimensions",
                    min : 2,
                    max: 2
                },
                measures : {
                    uses : "measures",
                    min : 2,
                    max: 2
                },
                sorting : {
                    uses : "sorting"
                },
                settings : {
                    uses : "settings"
                },
				cluster: {
					label: "Cluster",
					type: "integer",
					defaultValue: "3"
				}
            }
        },
		paint : function($element, layout) {
            console.log($element);
            console.info(layout);
			
		// get qMatrix data array
        var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
        // create a new array that contains the measure labels
        var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d){
        return d.qFallbackTitle;
                 });
		var data = qMatrix.map(function(d){
                     return{
                         "Metric1":d[2].qNum,
                         "Metric2":d[3].qNum,
                     }
                });
				
	//	var data = [ [6,5], [9,10], [10,1], [5,5], [7,7], [4,1], [10,7], [6,8], [10,2], [9,4], [2,5], [9,1], [10,9], [2,8], [1,1], [6,10], [3,8], [2,3], [7,9], [7,7], [3,6], [5,8], [7,5], [10,9], [10,9]10 ];

                //Chart object width
                var width = $element.width();
                //Chart object height
                var height = $element.height();
                //Chart object id
                var id = "container_" + layout.qInfo.qld;

                // Check to see if the chart element has already been created
                if(document.getElementById(id)){
                    $("#"+id).empty();
                }
                else{
                    $element.append($('<canvas/>;').attr("id",id).width(width).height(height));
                }
                viz(data,measureLabels,width,height,id);				
		}
	};

} );
var viz = function(data,labels,width,height,id) {

 	var clusterData = [ [6,5], [9,10], [10,1], [5,5], [7,7], [4,1], [10,7], [6,8], [10,2], [9,4], [2,5], [9,1], [10,9], [2,8], [1,1], [6,10], [3,8], [2,3], [7,9], [7,7], [3,6], [5,8], [7,5], [10,9], [10,9] ];

	var kmeans = new KMeans({canvas:document.getElementById(id),data: clusterData, k:3});
	return;
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var svg = d3.select("#"+id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) { return d.Metric1; })).nice();
    y.domain(d3.extent(data, function(d) { return d.Metric2; })).nice();

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("labels[0]");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("labels[1]")

    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.Metric1); })
    .attr("cy", function(d) { return y(d.Metric2); });
  /*  .style("fill", function(d) { return color(d.Dim1); }); 

    var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });*/
};
