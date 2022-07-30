import React, { useEffect, useState } from 'react'
import './app.css'
import * as d3 from 'd3'
import sampledata from './sampledata.json'
import sampledata2 from './sampledata2.json'
import { image, schemeDark2, transition } from 'd3'
import sampleImage from './image.jpg'




const App = () => {

  const [data, setdata] = useState([sampledata.nodes[0].information]);
  const [nodename, setnodename] = useState('ayush')



  useEffect(() => {
    //initilization
    let radius = 300;
    let width = 550;
    let height = 500;
    const rad1 = .2493;
    const rad2 = .68557;

    const strokeColor = 'rgb(211, 218, 222)';
    const hightlightColor = 'blue';
    const fillColor = 'white';
    let currentNodeInfo =[{item:{"id": "1", "group": 1,"information":{"img":"https://picsum.photos/100/100","heading":"lorem piscum1","about":"this is about this of this particular"}}}];

    let svg = d3.select(".svgContainer").append('svg')
      .attr("width", width).attr('height', height)

    //function to add the nodes in svg

    function finalproduct({ nodes, links },{sameNodeList}={}) {
      const linkdata = [];
      if(sameNodeList){
       sameNodeList.forEach(item =>{
        // console.log(item.item.id)
       })
      }

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

        

      //appending the two big circles
      const bigCircle = field.append("circle")
        .attr("fill", "none")
        .attr("stroke", (d) => { if (d.radius === rad1 * radius) return hightlightColor; else { return "#aaaaaa" } })
        .attr("stroke-width", 1.5)
        .attr("r", d => d.radius)
        .style('margin', '40')
        .style('fill', (d) => { if (d.radius === rad1 * radius) return "url(#tile-ww)" })
        .attr("stroke-dasharray", (i) => {
          if (i.radius === radius * rad1) {
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
      //calculating the path coordinates
      //debugger;

      var link = d3.linkHorizontal()
        .source(function (d, i) {
          return [d.source.x, d.source.y];
        })

        .target(function (d) {
          return [d.target.x, d.target.y] 
        })
        ;


//debugger;

      //adding the path
      const path = d3.select('#g1').selectAll("path")
        .data(links)
        .join("path")
        .attr("d", link)
        .attr('class', (i, x) => {
          return i.target.id
        })
        .attr('stroke', strokeColor)
        .classed("link", true).on('mouseover', (e) => {
          d3.select(e.target).attr('stroke', hightlightColor)
        }).on('mouseout', (e) => {
         
          if (!d3.select(e.target).classed('linkHighlighted')) {
            d3.select(e.target).attr('stroke', strokeColor)
          }
        })



      //adding center image in the svg

      d3.select('#g1').append('foreignObject').classed('imageContainer', true).attr("width", 110)
        .attr("height", 110).attr('transform', 'translate(-55,-55 )').style('position','relative')
        .append('xhtml:div').classed('centerImageholder', true).append('xhtml:img')
        .attr('src','https://picsum.photos/120/120')
        



      //adding animation to center image
      d3.select('.imageContainer').select('.centerImageholder')
                                  .style('width', '110px')
                                  .style('height', '110px')
      .transition()               .style('transform','scale(0)')
      .transition().duration(1000).style('transform','scale(1)')

        d3.select('.imageContainer').append('xhtml:div').classed('textHolder',true).html(`${currentNodeInfo[0].item.information.heading}`)


    
      //debugger;
      let sameTextNewCoordinates =[];
      const text = field.selectAll("text")
        .data(d => {
          return d.node.map(t => ({ field: d }));
        })
        .join('foreignObject')
        .attr("width", 50)
        .attr("height", 50)
        .attr("class", (d) => {
          if (d.field.radius === rad1 * radius)
            return "text-inner"

          else { return "text-outer" }
        })


        .attr("transform", (d, i) => {
          const angle = i / d.field.length * 2 * Math.PI - Math.PI / 2;
          if (d.field.radius === rad2 * radius) {
            
            // console.log(d)
            const a = Math.cos(angle) * (d.field.radius);
            const b = Math.sin(angle) * (d.field.radius);
            if(sameNodeList){
              // console.log(sameNodeList)
              sameNodeList.forEach(item => {
              if(  d.field.node[i].id === item.item.id){
                sameTextNewCoordinates.push({id:item.item.id,x:a,y:b,angle})
              } 
            
               
              });
            }
            return `translate(${a},${b}) rotate(${angle * 57.29})`;
          }


          else {
            let a;
            if (angle * 57.296 >= 100 && angle * 57.296 <= 250) {
              a = Math.cos(angle) * (d.field.radius + 90);
            }
            else {
              a = Math.cos(angle) * (d.field.radius + 40);
            }
            const b = Math.sin(angle) * (d.field.radius + 50);
            return `translate(${a},${b})`
          }
        })
        .append("xhtml:div")
        .classed('text', true)
        .attr('id', (d, i) => {
          return d.field.node[i].id
        })
        .style('font-size', (d, i) => { if (d.field.node[0].group === 1) { return '8px' } else { return '15px' } })
        .html((d, i) => {
          let retelement;
          sampledata2.nodes.forEach((item, index) => {
            if (item.id === d.field.node[i].id) {
              retelement = item.information.heading;
              return item.information.heading
            }
          })
          return retelement

        })





        //debugger;
      // adding the g inside the big circle for the small circle to be added on them
        let oldNodeNewCoordinates= [];
      const fieldTick = field.selectAll("g")
        .data(d => {

          return d.node.map(t => ({ field: d }));
        })
        .join("g")
        .attr("class", (d) => {

          if (d.field.radius === rad1 * radius)
            return "field-tick-inner"

          else { return "field-tick-outer" }
        })
        .attr("id", (d, i) => {
         
          return d.field.node[i].id
        })


        .attr("transform", (d, i) => {
          const angle = i / d.field.length * 2 * (22 / 7) - (22 / 7) / 2;
          
          const a = Math.cos(angle) * d.field.radius;
          const b = Math.sin(angle) * d.field.radius;
        
          if(sameNodeList){
              sameNodeList.forEach(item =>{
            if(item.item.id === d.field.node[i].id){
            
              oldNodeNewCoordinates.push({id:item.item.id, x:a, y:b})
            }
          })
        }
        return `translate(${a},${b})`;
        
        
        });

        // console.log(fieldTick)
        // console.log(oldNodeNewCoordinates);


        //debugger;
      // adding the small circle

      const fieldCircle = fieldTick.append("path")

        .attr("d", (i) => {
     
          if (i.field.radius === rad2 * radius)
            return "M-5.5,-8.5 h6 q6,0 6,6 v10 q0,1 -1,1 h-11 q-1,0 -1,-1 v-15 q0,-1 1,-1 Z"
          else { return "M 0, 0 m -14, 0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0" }
        })
        .attr('r', 9)

        .attr("fill", fillColor)
        .attr("stroke", strokeColor)
        .attr('stroke-width', 1.5)

        .on('mouseover', (e) => {
       
          const currentElement = d3.select(e.target);
          const currentId = e.target.parentElement.id;
          let group = nodes.filter(item => item.id === currentId)[0].group;
          if (group === 2) {
           
            currentElement.transition().attr("d", "M 0, 0 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0").transition().attr("d", "M 0, 0 m -14, 0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0")
          }
          else {
            currentElement.transition().attr("d", "M -6.6 -10.2 h 7.2 q 7.2 0 7.2 7.2 v 12 q 0 1.2 -1.2 1.2 h -13.2 q -1.2 0 -1.2 -1.2 v -18 q 0 -1.2 1.2 -1.2 Z").transition().attr("d", "M-5.5,-8.5 h6 q6,0 6,6 v10 q0,1 -1,1 h-11 q-1,0 -1,-1 v-15 q0,-1 1,-1 Z")

          }
          currentElement.attr('fill', hightlightColor)


        })
        .on('mouseout', (e) => {
          const currentElement = d3.select(e.target);
          // console.log(e)
          const currentId = e.target.parentElement.id;
          let group = nodes.filter(item => item.id === currentId)[0].group;
          if (group === 2) {
            currentElement.transition().duration(10).attr("d", "M 0, 0 m -14, 0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0")
          }
          // console.log(currentElement.classed('nodeHighlighted'))
          if (currentElement.classed('nodeHighlighted') !== true) {
            currentElement.attr('fill', fillColor)
          }
        })
        .on('click', (e) => {
          const currentElement = d3.select(e.target);
          const currentId = e.target.parentElement.id;
         
          const parentOfId = [];
          const newLinks = [];
          let newNode = [];


         
          sampledata2.nodes.forEach(item =>{
            if(item.id === currentId){
              currentNodeInfo.pop();
              currentNodeInfo.push({item})
            }
          })
          console.log(currentNodeInfo)

          //adding click event for the element true for handling clash bewteen mouseout/click event
          d3.selectAll('*').classed('clicked', false)
          d3.select(e.target).classed('clicked', true)

          //adding the info to the usestate variable
         
          nodes.map(item => {
            sampledata2.nodes.map(i => {
              if (item.id === i.id) {
                setdata(i.information)
              }
            })
          })

          //getting the group of node clicked

          let group = nodes.filter(item => item.id === currentId)[0].group

          setnodename(currentId)
         

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


              //making the list of node which are  before and after in the list
              let sameNodeList = [];
             
              
              // console.log(nodes,newNode);
              nodes.forEach(item =>{
                newNode.forEach(i =>{
                  if(item.id === i.id && item.group === 1){
                    d3.selectAll(`g[id="${item.id}"]`).classed('sameNode',true)

                    sameNodeList.push({item})
                  }
                })
              })
              // console.log(sameNodeList)


            //removing the circle and path before updating.

            //only removing those nodes which are not in sameNodeList
            d3.select('#g2').selectAll('g:not(.sameNode)').remove()
            d3.select('#g1').remove();

            // field.remove()
            path.remove();


            //removing only those text which are not in sameNodeList

            //adding sameText class to the same text div
            sameNodeList.forEach(i =>{
               d3.selectAll('div.text')._groups[0].forEach(item =>{
                  if(i.item.id === d3.select(item).attr('id') ){
                   d3.select(item).classed('sameText',true)
                  }
                })
            })
            //removing all other text
            d3.selectAll('.text:not(.sameText)').remove()

            // text.remove();

            d3.select('.imageContainer').remove()


            //giving old g class of oldg for deleting it later
         
            d3.select('svg').select('g').classed('oldg',true);

            //updating
            finalproduct({ "nodes": newNode, "links": newLinks },{sameNodeList})
          }

          else if (group === 2) {

            //removing any blue color before updating
            d3.selectAll('path:not(.clicked)').attr('fill', fillColor)
            d3.selectAll('path').classed('nodeHighlighted', false)

            //removing the blue color from path from updating 
            d3.selectAll('.link').classed('linkHighlighted', false).transition().attr('stroke', strokeColor)


            //making smaller circle node blue 
            d3.selectAll(`[id="${currentId}"]`).select('path').classed('nodeHighlighted', true).transition().attr('fill', hightlightColor)

            //for making path blue
            let a = d3.selectAll(`.${currentId}`).classed('linkHighlighted', true).transition().attr('stroke', hightlightColor)


            //for making outer nodes blue on click
            links.forEach(item => {

              if (item.target.id === currentId) {
                const targetId = item.source.id;

                d3.selectAll(`[id="${targetId}"]`).selectAll('path').classed('nodeHighlighted', true).transition().attr('fill', hightlightColor)

              }


            });
          }

        }) 

        //transforming nodes from previous location to new location

          d3.selectAll('.sameNode')._groups[0].forEach(item =>{
           oldNodeNewCoordinates.forEach(i =>{
           if(i.id === d3.select(item).attr('id')){
              d3.select(item).transition().duration(1000).attr('transform',`translate(${i.x},${i.y})`)
           }
           })
          })

          //tranforming text from previous location to new location
          d3.selectAll('.sameText')._groups[0].forEach(item =>{
            sameTextNewCoordinates.forEach(i =>{
              if(i.id === d3.select(item).attr('id')){
                console.log(d3.select(item.parentElement),i.x,i.y,i.angle)
                d3.select(item.parentElement).transition().duration(1000).attr('transform',`translate(${i.x},${i.y}) rotate(${i.angle*57.29})`)
              }
            })
          })
          //removing old g inside the svg
         d3.select('.oldg').transition().duration(1001).remove();
          



    } 
    finalproduct(sampledata); 

    // console.log( document.getElementsByClassName('svgContainer')[0].length)



  }, [])




  return (
    <>
      <div className="masterContainer  ">
        <div className="svgMasterContainer">

          <div className="svgContainer">
            <div className="centerPic">
              {/* <img src ="https://picsum.photos/120/120" alt="" /> */}
            </div>
          </div>

        </div>

        <div className="svgCard">
          {nodename}
          {/* {data.img} */}
        </div>
      </div>
    </>
  )
}

export default App






