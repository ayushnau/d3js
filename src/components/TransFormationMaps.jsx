import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const TransFormationMaps = (props) => {
  const [hookwidth, setWidth] = useState(props.radius + 300);
  useEffect(() => {
    const {  completeData } = props;
    let radius = hookwidth -300;
    const width = hookwidth;
    const height = radius + 350;
    const rad1 = 0.25;
    let rad2calcuate = (width -140) /2
    const rad2 =rad2calcuate/radius;
    const { nodes, initalLinks, subtopicLinks } = completeData;
    const hightlightColor = "rgb(61,177,200)";
    const innerDashArray = 19;
    const outerDashArray = 5;
    const strokeColor = "rgb(211, 218, 222)";
    const circleoutlinecolor = 'rgb(122,129,136)';
    const fillColor = "white";
    const centerCircleColor = "rgb(30,78,112)";
    const currentElement = ["CMI Hub"];
   
    d3.select('svg').remove();
    let svg = d3
      .select(".svgContainer")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // getting nodes1 and node2 for group1 and group2
    const node1 = nodes.filter((item) => {
      if (item.group === "outercircle") {
        return item;
      }
    });

    const node2 = nodes.filter((item) => {
      if (item.group === "innercircle") {
        return item;
      }
    });

    const fields = [
      {
        radius: rad1 * radius,
        node: node1,
        length: node1.length,
        circle: "innercircle",
      },
      {
        radius: rad2 * radius,
        node: node2,
        length: node2.length,
        circle: "outercircle",
      },
    ];

    //appending two g inside the g which is in svg
    const field = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("g")
      .data(fields)
      .join("g")
      .attr("id", (d) => {
        return `g${d.circle}`;
      });

    //appending the two big circles
    const bigCircle = field
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", circleoutlinecolor)
      .attr("stroke-width", 1.5)
      .attr("r", 0)
      .transition().duration(1000)
      .attr("r", (d) => d.radius)
      .attr("stroke-dasharray", (i) => {
        if (i.circle === "innercircle") return innerDashArray;
        else return outerDashArray;
      });
      

    //function to add path
    const addingpath = ({ node1, node2, initalLinks }) => {
      //adding coordinates for node1
      d3.select("#goutercircle")
        .selectAll("a")
        .data(node1)
        .join("a")
        .attr("transform", (d, i) => {
          const angle = (i / node1.length) * 2 * (22 / 7) - 22 / 7 / 2;
          const a = Math.cos(angle) * rad2 * radius;
          const b = Math.sin(angle) * rad2 * radius;
          node1[i].information.x = a;
          node1[i].information.y = b;
          initalLinks.map((item) => {
            if (item.source.id === node1[i].id) {
              item.source.x = a;
              item.source.y = b;
            }
            if (item.target.id === node1[i].id) {
              item.target.x = a;
              item.target.y = b;
            }
          });

          return `translate(${a},${b})`;
        });
      //adding coordinates for node2
      d3.select("#ginnercircle")
        .selectAll("a")
        .data(node2)
        .join("a")
        .attr("transform", (d, i) => {
          const angle = (i / node2.length) * 2 * (22 / 7) - 22 / 7 / 2;
          const a = Math.cos(angle) * rad1 * radius;
          const b = Math.sin(angle) * rad1 * radius;
          node2[i].information.x = a;
          node2[i].information.y = b;
          initalLinks.map((item) => {
            if (item.source.id === node2[i].id) {
              item.source.x = a;
              item.source.y = b;
            }
            if (item.target.id === node2[i].id) {
              item.target.x = a;
              item.target.y = b;
            }
          });

          return `translate(${a},${b})`;
        });

      //calculating the path coordinates
      //debugger;

      var link = d3
        .linkHorizontal()
        .source(function (d, i) {
          return [d.source.x, d.source.y];
        })

        .target(function (d) {
          return [d.target.x, d.target.y];
        });
      //adding the path
      const path = d3
        .select("#ginnercircle")
        .selectAll("path")
        .data(initalLinks)
        .join("path")
        .attr("d", link)
        .attr("class", (i, x) => {
          return i.target.id;
        })
        .attr("class", (i, x) => {
          return i.source.id;
        })
        .attr("stroke", strokeColor)
        .attr("fill", "none");
    };
    addingpath({ node1, node2, initalLinks });

    //function to add node in the outercircle
    const addingouterG = () => {
      //appending g and than circle to the outer circle
      const outercircleTick = d3
        .select("#goutercircle")
        .selectAll("g")
        .data(fields[0].node)
        .join("g")
        .attr("transform", (d, i) => {
          const angle = (i / 24) * 2 * (22 / 7) - 22 / 7 / 2;
          const a = Math.cos(angle) * rad2 * radius;
          const b = Math.sin(angle) * rad2 * radius;
          return `translate(${a},${b})`;
        })
        .attr("id", (d, i) => {
          return `Goutercircle${i + 1}`;
        }).on('click',(e)=>{
          if(e.target.innerText)
          {console.log(e.target.innerText);return;}
          console.log(e.target)
          
        })
        .style('cursor','pointer');

      const outerCircle = outercircleTick
        .append("path")
        .attr(
          "d",()=>{
            if(radius <= 260)
            return "M -3.3 -5.1 h 3.6 q 3.6 0 3.6 3.6 v 6 q 0 0.6 -0.6 0.6 h -6.6 q -0.6 0 -0.6 -0.6 v -9 q 0 -0.6 0.6 -0.6 Z"
            return "M-5.5,-8.5 h6 q6,0 6,6 v10 q0,1 -1,1 h-11 q-1,0 -1,-1 v-15 q0,-1 1,-1 Z"
          }
        )
        .attr("fill", fillColor)
        .attr("stroke", circleoutlinecolor)
        .attr("stroke-width", 1.5)
        .on("mouseover", (e) => {
          const currentNode = e.target;
          d3.select(currentNode)
            .transition()
            .attr(
              "d",
              "M -6.6 -10.2 h 7.2 q 7.2 0 7.2 7.2 v 12 q 0 1.2 -1.2 1.2 h -13.2 q -1.2 0 -1.2 -1.2 v -18 q 0 -1.2 1.2 -1.2 Z"
            )
            .transition()
            .attr(
              "d",
              ()=>{
                if(radius <= 260)
                return "M -3.3 -5.1 h 3.6 q 3.6 0 3.6 3.6 v 6 q 0 0.6 -0.6 0.6 h -6.6 q -0.6 0 -0.6 -0.6 v -9 q 0 -0.6 0.6 -0.6 Z"
                return "M-5.5,-8.5 h6 q6,0 6,6 v10 q0,1 -1,1 h-11 q-1,0 -1,-1 v-15 q0,-1 1,-1 Z"
              }
            );
        });

      //adding text on the tick for the big circle
      let foreignObjectWidth = 80;
      let foreignObjectHeight = 35;
      const outerText = outercircleTick
        .append("foreignObject")
        .attr("width", foreignObjectWidth)
        .attr("height", foreignObjectHeight)
        .attr("transform", (d, i) => {
          const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
          const a = Math.cos(angle) * 10;
          const b = Math.sin(angle) * 10;
          return `translate(${a},${b}) rotate(${angle * 57.29})`;
        })
        .append("xhtml:div")
        .style("text-align", "start")
        .style("margin-left", "9px")
        .style("font-size", "10px")
        .html((d) => d.information.name);
    };
    addingouterG();

    //function to add node in the innercircle
    const addinginnerG = ({ node, nodeCount }) => {
      //adding tick for small circle
      const innercircleTick = d3
        .select("#ginnercircle")
        .selectAll("g")
        .data(node)
        .join("g")
        .attr("transform", (d, i) => {
          const angle = (i / nodeCount) * 2 * (22 / 7) - 22 / 7 / 2;
          const a = Math.cos(angle) * rad1 * radius;
          const b = Math.sin(angle) * rad1 * radius;
          return `translate(${a},${b})`;
        })
        .attr("id", (d, i) => {
          return `G${d.group}${i + 1}`;
        });

      //adding circle for the small circle
      const innerCircle = innercircleTick
        .append("path")
        .attr("d",()=>{
           if(radius <= 260)
            return "M 0 0 m -8.4 0 a 8.4 8.4 90 1 0 16.8 0 a 8.4 8.4 90 1 0 -16.8 0"
            return "M 0, 0 m -14, 0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0"}
          )  
          
        
        .attr("r", 9)
        .attr("fill", fillColor)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", (e) => {
          const currentNode = e.target.parentNode;
          const currentNodeId = d3.select(currentNode).attr("id").slice(1);

          //adding highlight color on click
          d3.select(e.target).attr("fill", hightlightColor);
          //adding transition effect
          d3.select(e.target)
            .transition()
            .attr("d", "M 0, 0 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0")
            .transition()
            .attr(
              "d",()=>{
                if(radius <= 260)
                return "M 0 0 m -8.4 0 a 8.4 8.4 90 1 0 16.8 0 a 8.4 8.4 90 1 0 -16.8 0"
                return "M 0, 0 m -14, 0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0"
              }
            );

          if (currentNodeId.slice(0, -1) === "innercircle") {
            initalLinks.forEach((item) => {
              if (item.source.id === currentNodeId) {
                d3.selectAll(`#G${item.target.id}`)
                  .select("path")
                  .attr("fill", hightlightColor);
                d3.selectAll(`path.${currentNodeId}`).attr(
                  "stroke",
                  hightlightColor
                );
              }
            });
          } else {
            subtopicLinks.forEach((item) => {
              if (item.source.id === currentNodeId) {
                d3.selectAll(`#G${item.target.id}`)
                    .select("path")
                    .attr("fill", hightlightColor);
                d3.selectAll(`path.${currentNodeId}`).attr(
                  "stroke",
                  hightlightColor
                );
              }
            });
          }
        })
        .on("mouseout", (e) => {
          const currentNode = e.target.parentNode;
          const currentNodeId = d3.select(currentNode).attr("id").slice(1);

          if (!d3.select(e.target).classed("clicked")) {
            d3.select(e.target).attr("fill", fillColor);
            if (currentNodeId.slice(0, -1) === "innercircle") {
              initalLinks.forEach((item) => {
                if (item.source.id === currentNodeId) {
                  d3.selectAll(`#G${item.target.id}`)
                    .select("path")
                    .attr("fill", fillColor);
                  d3.selectAll(`path.${currentNodeId}`).attr(
                    "stroke",
                    strokeColor
                  );
                }
              });
            } else {
              subtopicLinks.forEach((item) => {
                if (item.source.id === currentNodeId) {
                    d3.selectAll(`#G${item.target.id}`)
                      .select("path")
                      .attr("fill", fillColor);
                  d3.selectAll(`path.${currentNodeId}`).attr(
                    "stroke",
                    fillColor
                  );
                }
              });
            }
          }
        })
        .on("click", (e) => {
          console.log(e.target.parentNode,d3.select(e.target.parentNode).attr('id').slice(1))
          const currentNode = e.target.parentNode;
          const currentNodeId = d3.select(currentNode).attr("id").slice(1);
        
          //removing the path stroke color
         d3.select('#ginnercircle').selectAll('path').attr('stroke',strokeColor)

          //removing the outer nodes fill color
          d3.selectAll("#goutercircle")
            .selectAll("g")
            .selectAll("path")
            .attr("fill", fillColor);
          d3.selectAll("#ginnercircle")
            .selectAll("g")
            .selectAll("path")
            .attr("fill", fillColor);

          //adding highlight color on click
          d3.select(e.target)
            .attr("fill", hightlightColor)
            .classed("clicked", true);
          if (currentNodeId.slice(0, -1) === "innercircle") {
            initalLinks.forEach((item) => {
              if (item.source.id === currentNodeId) {
                d3.selectAll(`#G${item.target.id}`)
                  .select("path")
                  .attr("fill", hightlightColor)
                  .classed("clicked", true);
                d3.selectAll(`path.${currentNodeId}`)
                  .attr("stroke", hightlightColor)
                  .classed("clicked", true);
              }
            });
          } else {
            subtopicLinks.forEach((item) => {
              if (item.source.id === currentNodeId) {
                d3.selectAll(`#G${item.target.id}`)
                    .select("path")
                    .attr("fill", hightlightColor)
                ;
                d3.selectAll(`path.${currentNodeId}`).attr(
                  "stroke",
                  hightlightColor
                );
              }
            });
          }
        });

      //adding text on the tick for the small circle
      console.log(radius)
      let foreignObjectWidth = 83;
      let foreignObjectHeight = 40;
      if(radius <= 260){
        foreignObjectWidth = 64;
        foreignObjectHeight = 20;
        
      }
      else if(radius <= 200){
        foreignObjectWidth = 50;
        foreignObjectHeight = 17;
        
      }
      const innerText = innercircleTick
        .append("foreignObject")
        .attr("height", foreignObjectHeight)
        .attr("width", foreignObjectWidth)
        .attr("transform", (d, i) => {
          const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
          const a = Math.cos(angle) * foreignObjectWidth;
          const b = Math.sin(angle) * foreignObjectHeight;
          return `translate(${a - foreignObjectWidth / 2},${
            b - foreignObjectHeight / 2
          })`;
        })
        .append("xhtml:div")
        .style("font-size", ()=>{
          if(radius <= 260)
          return "15px"
        return "18px"
        
        })
        .style("cursor", "pointer")
        .classed('texthover',true)
        .html((d) => d.information.name)
        .on("click", (e) => {
          //setting the currentElement to currnet node
          currentElement.push(e.target.innerHTML);
          let currentId = e.target.parentNode.parentNode.id.slice(1);
          let newLinks = [];
          let newNodes = [];
          nodes.forEach((item) => {
            if (currentId == item.id) {
              item.information.subtopicIds.forEach((id) => {
                //adding new nodes
                nodes.forEach((nd) => {
                  if (nd.id === id) {
                    newNodes.push(nd);
                  }
                });
                //adding new links
                subtopicLinks.forEach((k) => {
                  if (k.source.id === id) {
                    newLinks.push(k);
                  }
                });
              });
            }
          });

          d3.select("#ginnercircle").selectAll("a").remove();
          d3.select("#ginnercircle").selectAll("g").remove();
          d3.select("#ginnercircle").selectAll("path").remove();
          d3.selectAll("#goutercircle")
            .selectAll("g")
            .selectAll("path")
            .attr("fill", fillColor);
          d3.select("#centerImage").remove();

          addingpath({ node1: node1, node2: newNodes, initalLinks: newLinks });
          addinginnerG({ node: newNodes, nodeCount: newNodes.length });
        });

      //adding the center image and buttons
      let centerImagewidth = rad1 * radius * 2 - 30;
      let centerImageheight = rad1 * radius * 2 - 30;
      if(centerImagewidth < 0){centerImagewidth += 30;}
      if(centerImageheight < 0){centerImageheight += 30;}

      d3.select("#ginnercircle")
        .append("foreignObject")
        .attr("width", centerImagewidth)
        .attr("height", centerImageheight)
        .attr("id", "centerImage")
        .attr("fill", centerCircleColor)
        .attr(
          "transform",
          `translate(${-centerImagewidth / 2},${-centerImageheight / 2})`
        )
        .style("background", centerCircleColor)
        .style("border-radius", "50%");

      //adding the currentElement to the center
      d3.select("#centerImage")
        .append("xhtml:div")
        .style("font-size", "18px")
        .style("color", fillColor)
        .style("margin-top", `${(radius * rad1) / 2}px`)
        .html(`${currentElement[currentElement.length - 1]}`);

      //adding the go back button
      d3.select("#centerImage")
        .append("xhtml:div")
        .attr("id", "goback")
        .style("display", "block")
        .style("margin-top", `${20}px `)
        .style("font-size", "18px")
        .append("xhtml:img")
        .attr("src", "https://img.icons8.com/000000/circled-left-2.png")
        .on("click", () => {
          //popping the last element of the currentElement
          if (currentElement.length > 1) {
            currentElement.pop();
          }

          d3.select("#ginnercircle").selectAll("a").remove();
          d3.select("#ginnercircle").selectAll("g").remove();
          d3.select("#ginnercircle").selectAll("path").remove();
          d3.selectAll("#goutercircle")
            .selectAll("g")
            .selectAll("path")
            .attr("fill", fillColor);
          d3.select("#centerImage").remove();

          addingpath({ node1, node2, initalLinks });
          addinginnerG({ node: fields[1].node, nodeCount: 5 });
        });

      // for toggling the go back button
      if (node[0].group === "subtopiccircle") {
        d3.select("#goback").style("display", "block");
      } else {
        d3.select("#goback").style("display", "none");
      }
    };
    addinginnerG({ node: fields[1].node, nodeCount: 5 });
  }, [hookwidth]);
 
    
    useEffect(() => {
         // const width = document.getElementsByTagName("body")[0].offsetWidth;
    const node = document.getElementsByClassName('svgContainer')[0]
    window.addEventListener('resize', function(event){
        setWidth(node.offsetWidth);
  });
    }, [])
 

  return (
    <>
      <div className="svgContainer"></div>
    </>
  );
};

export default TransFormationMaps;
