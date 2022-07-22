import React, { useEffect, useState } from 'react'
import './app.css'
import * as d3 from 'd3'
import sampledata from './sampledata.json'
import sampledata2 from './sampledata2.json'




const App = () => {

  const [data, setdata] = useState([sampledata.nodes[0].information]);

  useEffect(() => {
    //initilization
    let radius = 300;
    let width = 450;
    let height = 500;
    const rad1 = .2;
    const rad2 = .6;

  let svg = d3.select(".svgContainer").append('svg')
  .attr("width",width).attr('height',height)
      
    //function to add the nodes in svg

    function finalproduct({ nodes, links }) {
      const linkdata = [];  

      // getting nodes1 and node2 for group1 and group2
      const node1 = nodes.filter(item => {
        if (item.group === 2) {
          return item
        }
      })

      const node2 = nodes.filter(item => {
        if (item.group === 1) {
          return item
        }
      })

      // fields represent two big cirle in the dom
      const fields = [
        { radius: rad1 * radius, node: node1, length: node1.length },
        { radius: rad2 * radius, node: node2, length: node2.length }
      ]


      let idcount = 0;

      //appending two g inside the g which is in svg
      const field = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("g")
        .data(fields)
        .join("g")
        .attr("id", () => {
          idcount++;
          return `g${idcount}`
        });


        //  //creating a circle to be used in bigcircle
        //   var defs = svg.append('svg:defs');
        //   defs.append('svg:pattern')
        //     .attr('id', 'tile-ww')
        //     .attr('patternUnits', 'userSpaceOnUse')
        //     .attr('width', '200')
        //     .attr('height', '200')
        //     .append('svg:image')
        //     .attr('xlink:href', 'https://picsum.photos/250/250')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', 200)
        //     .attr('height', 200);
    
    
    
    
          //appending the bigger circles
          const bigCircle = field.append("circle")
            .attr("fill", "none")
            .attr("stroke", (d) => { if (d.radius === rad1 * radius) return "blue"; else { return "white" } })
            .attr("stroke-width", 1.5)
            .attr("r", d => d.radius)
            .style('margin', '40')
            .style('fill', (d) => { if (d.radius === rad1 * radius) return "url(#tile-ww)" })
            .attr("stroke-dasharray", (i) => {
              if (i.radius === 60) {
                return ("19")
              }
              else {
                return ("5")
              }
    
            });
    
            
              //getting the position for the pathdata to be used for appending path
          field.selectAll("a")
          .data((d, i) => {
            return d.node.map(t => ({ field: d }));
          })
          .join("a") 
          .attr("transform", (d, i) => {
            const angle = i / d.field.length * 2 * (22 / 7) - (22 / 7) / 2;
            const a = Math.cos(angle) * d.field.radius;
            const b = Math.sin(angle) * d.field.radius;
            //linkdata is used for placing the small cirle in big cirle  
            linkdata.push({ x: a, y: b, id: d.field.node[i].id })
            return `translate(${a},${b})`;
          });
    
        console.log(linkdata)
        
        //adding x and y coordinated to links;
        const a = linkdata.map(item => {
          const b = links.map(i => {
            if (item.id === i.source.id) {
              i.source.x = item.x;
              i.source.y = item.y;
            }
            else if (item.id === i.target.id) {
              i.target.x = item.x;
              i.target.y = item.y;
            }
            return
          })
        })
        console.log(links)
        //calculating the path coordinates
    
        var link = d3.linkHorizontal()
          .source(function (d, i) {
            // console.log(d,i) 
            return [d.source.x, d.source.y];
          })
    
          .target(function (d) {
            return [d.target.x, d.target.y]
          })
          ;
        //adding the path
          console.log(d3.select(`[id="g1"]`))
        const path = d3.select('#g1').selectAll("path")
          .data(links)
          .join("path")
          .attr("d", link)
          .attr('class', (i, x) => {
            // console.log(i);
            return i.target.id
          })
          .attr('stroke', "rgb(211, 218, 222)")
          .classed("link", true)
    
          console.log(path)
    
    
         
    
    
          //adding text
    
          const text = field.selectAll("text")
            .data(d => {
              return d.node.map(t => ({ field: d }));
            })
            .join('text')
            .text((d, i) => {
              return d.field.node[i].id
            }).attr("stroke", 'white')
            .attr("class", (d)=>{ 
    
              if(d.field.radius === rad1* radius)
              return "text-inner"
            
              else {return "text-outer"}
            })
             
            
            .attr("transform", (d, i) => {
              // console.log(d,i)
              const angle = i / d.field.length * 2 * Math.PI - Math.PI / 2;
              if (d.field.radius === rad2 * radius) {
                const a = Math.cos(angle) * (d.field.radius + 20);
                const b = Math.sin(angle) * (d.field.radius + 20);
                return `translate(${a},${b}) rotate(${angle * 57.29})`;
              }
    
    
              else {
                const a = Math.cos(angle) * (d.field.radius + 30);
                const b = Math.sin(angle) * (d.field.radius + 30);
                return `translate(${a},${b})`
              }
    
    
    
            })
    
    
    
    
    
    
    
    
    
          // adding the g inside the big circle for the small circle to be added on them
    
          const fieldTick = field.selectAll("g")
            .data(d => {
    
              return d.node.map(t => ({ field: d }));
            })
            .join("g")
            .attr("class", (d)=>{ 
    
              if(d.field.radius === rad1* radius)
              return "field-tick-inner"
            
              else {return "field-tick-outer"}
            })
            .attr("id", (d, i) => {
              // console.log(d, i)
              return d.field.node[i].id
            })
            
      
            .attr("transform", (d, i) => {
              const angle = i / d.field.length * 2 * (22 / 7) - (22 / 7) / 2;
    
              const a = Math.cos(angle) * d.field.radius;
              const b = Math.sin(angle) * d.field.radius;
    
              return `translate(${a},${b})`;
            });
          
    
    
          // adding the small circle
    
          const fieldCircle = fieldTick.append("path")
        
            .attr("d", (i) => {
              if (i.field.radius === rad2 * radius)
                return "M-5.5,-8.5 h6 q6,0 6,6 v10 q0,1 -1,1 h-11 q-1,0 -1,-1 v-15 q0,-1 1,-1 Z"
              else { return "M 0, 0 m -9, 0 a 9,9 0 1,0 18,0 a 9,9 0 1,0 -18,0" }
            })
            .attr('r', 9)
            
            .attr("fill", "white")
            .attr("stroke", "rgb(211, 218, 222)")
            .on('mouseover',(e)=>{
              console.log(e)
              const currentId = e.target.parentElement.id;
              let group = nodes.filter(item => item.id === currentId)[0].group;
              if(group ===2){
                d3.select(e.target).transition().duration(10).attr("d", "M 0, 0 m -11, 0 a 11,11 0 1,0 22,0 a 11,11 0 1,0 -22,0")
              }
            })
            .on('mouseout',(e)=>{
              console.log(e)
              const currentId = e.target.parentElement.id;
              let group = nodes.filter(item => item.id === currentId)[0].group;
              if(group ===2){
                d3.select(e.target).transition().duration(10).attr("d", "M 0, 0 m -9, 0 a 9,9 0 1,0 18,0 a 9,9 0 1,0 -18,0")
              }
            })
            .on('click', (e) => {
              const currentId = e.target.parentElement.id;
              const parentOfId = [];
              const newLinks = [];
              let newNode = [];

              //adding the info to the useeffect variable
              console.log(nodes)
              nodes.map(item =>{
                sampledata2.nodes.map(i =>{
                  if(item.id === i.id){
                    setdata(i.information)
                  }
                })
              })              
    
              //getting the group of node clicked
    
              let group = nodes.filter(item => item.id === currentId)[0].group
    
              if (group === 1) {
                //getting the parent nodes of cliked node.
    
                const a = sampledata2.links.map(item => {
                  if (currentId === item.source.id) {
                    parentOfId.push({ "id": item.target.id });
    
                  }
                })
                //getting newdata for by getting all the children of parent and adding it to newlinks and newnode
    
                const b = parentOfId.filter(item => {
                  const links = sampledata2.links.filter(i => {
                    if (item.id === i.target.id) {
                      newLinks.push(i);
                      newNode.push({ "id": i.source.id, "group": 1 }, { "id": i.target.id, "group": 2 })
                    }
                  })
                })
                //fitering the duplicate object from newNode
    
                newNode = newNode.filter((value, index, self) => index === self.findIndex((t) => (
                  t.id === value.id)))

                  
    
                //removing the circle and path before updating.
    
                fieldTick.remove()
                path.remove();
                text.remove();
    
                //updating
                finalproduct({ "nodes": newNode, "links": newLinks })
              }
    
              else if (group === 2) {
               
                //removing any blue color before updating
                nodes.map(item => { 
                  d3.select(`[id="${item.id}"]`)._groups[0][0].children[0].setAttribute('fill','white')
                })
                d3.selectAll('path').attr('stroke', 'white')
                
                d3.selectAll(`[id="${currentId}"]`)._groups[0][0].children[0].setAttribute('fill', 'blue')
                let a = d3.selectAll(`.${currentId}`).attr('stroke', 'blue')
               
                //for making outer nodes blue on click
                links.forEach(item => {
                  
                  if (item.target.id === currentId) {
                    const targetId = item.source.id;
                    const a = d3.selectAll(`[id="${targetId}"]`)._groups[0][0];
                    a.children[0].setAttribute('fill', 'blue')
                  }
     
                
                });}
    
            })
    
    
           
    

 

    }
     finalproduct(sampledata);

    // console.log( document.getElementsByClassName('svgContainer')[0].length)
    
    

  }, [])
  useEffect(() => {
    console.log(data)
  }, [data])
  


  return (
    <>
      <div className="masterContainer  ">
        <div className="svgMasterContainer">

          <div className="svgContainer">
            <div className="centerPic">
            <img src ="https://picsum.photos/100/100" alt="" />
          </div>
          </div>
          
        </div>

        <div className="svgCard">
          {data.heading}
          {/* {data.img} */}
        </div>
      </div>
    </>
  )
}

export default App
