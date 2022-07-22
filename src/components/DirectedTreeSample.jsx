import React, { useEffect } from 'react'
import miserable from '../miserablesampledata.json'
import * as d3 from 'd3'
// console.log(miserable)

const DirectedTreeSample = () => {
    useEffect(() => {
        function ForceGraph({nodes,links},{nodeGroup,nodeStrength}){
          let nodeTitle;
          let nodeGroups;
          let linkStrokeWidth =1.5; 
          let linkStroke ="#999";
          let colors = ['red','blue'];   
          let linkStrength;
          let width =500;
          let height =600;
          let linkStrokeOpacity = 0.6;
          let linkStrokeLinecap;
          let nodeFill = "currentColor";
          let nodeStroke ="#fff";
          let nodeStrokeOpacity=1;
          let nodeStrokeWidth =1.5;
          let nodeRadius= 5;

          let invalidation;
          
          
        
        
        
          //compute the values
          const N = d3.map(nodes , d=>d.id);
          const LS = d3.map(links,({source}) => source)
          const LT = d3.map(links,({target})=>target)
        
        
          if (nodeTitle === undefined) {nodeTitle = (_, i) => N[i]};
          const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
            const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup);
            const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
            const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
        // console.log(T,G,W,L)
        // console.log(N,LS,LT)
        
        //replace the input nodes and links with mutable objects for similutation
        nodes = d3.map(nodes, (_,i)=>({id: N[i]}));
        links = d3.map(links,(_,i)=>({source:LS[i], target: LT[i]}));
        // console.log(nodes,links)
        
        
        // console.log(nodeGroups)
        //compute the default domains
        if(G && nodeGroups === undefined) nodeGroups = d3.sort(G);
        // console.log("nodeGroups",nodeGroups)
        
        //construct the scales
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
        // console.log("color",color)
        // console.log(colors,nodeGroups)
        // console.log(color)
        
        //construct the forces
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(links).id(({index:i})=>N[i]);
        console.log(forceNode,forceLink)
        if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        if (linkStrength !== undefined) forceLink.strength(linkStrength);
        
        const simulation = d3.forceSimulation(nodes)
        .force("link",forceLink)
        .force("charge",forceNode)
        .force("center",d3.forceCenter())
        .on("tick",ticked)
        
        const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        
        const link = svg.append("g")
                .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
                .attr("stroke-opacity", linkStrokeOpacity)
                .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
                .attr("stroke-linecap", linkStrokeLinecap)
              .selectAll("line")
              .data(links)
              .join("line");
              
              
              const node = svg.append("g")
              .attr("fill", nodeFill)
              .attr("stroke", nodeStroke)
              .attr("stroke-opacity", nodeStrokeOpacity)
              .attr("stroke-width", nodeStrokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", nodeRadius)
            .call(drag(simulation));
            
            
            const text = svg.append('g').selectAll('text').data(nodes).enter().append('text')
                .attr('fill','red').attr('stroke','red').text(d=> d.id)
        
        
              if (W) link.attr("stroke-width", ({index: i}) => W[i]);
              if (L) link.attr("stroke", ({index: i}) => L[i]);
              if (G) node.attr("fill", ({index: i}) => color(G[i]));
              if (T) node.append("title").text(({index: i}) => T[i]);
              // if (invalidation != null) invalidation.then(() => simulation.stop());
            
        
        function ticked() {
          link
            .attr("x1", d => {
              console.log(d)
              return d.source.x})
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

            text
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        }
        
       
        
      
        function drag(simulation) {    
          function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }
          
          function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          }
          
          function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }
          
          return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        }
        // console.log({scales:{colors}})
        return Object.assign(svg.node(),{scales:{color}})
        }
        const a = ForceGraph(miserable,{ nodeId: d => d.id,
            nodeGroup: d => d.group,
            nodeTitle: d => `${d.id}\n${d.group}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            // nodeStrength:-700,
            linkStrength:-200
         
             });
        console.log(a)
        document.getElementsByTagName('body')[0].appendChild(a);
        
    
        }, [])


        
  return (  
    <div>DirectedTreeSample</div>
  )
}

export default DirectedTreeSample