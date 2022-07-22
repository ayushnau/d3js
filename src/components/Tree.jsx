import React, { useEffect } from 'react'
import '../app.css'
import * as d3 from 'd3'
// import data from '../public/static/data.json'
import { bin, linkHorizontal, select, text, tree } from 'd3'

const Tree = () => {
    useEffect(() => {
      
        const width = document.body.clientWidth;
        const height = 4000;
        const treeLayout =d3.tree().size([height,width])
        let mouseX = 0;
        let buttonTracker = [];
    
        let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
      
        
        const radialdata = async()=>{
          const data = await d3.json('../data.json');
          const root = d3.hierarchy(data);
          console.log(root)
          let pathLinks =treeLayout(root).links();
         
    
            
    
    
          
          function update(links){
           console.log(links)
            const linkPathGenerator = linkHorizontal().x(d =>{
              console.log(d)
              return d.y})
          .y(d=>d.x)
            svg.selectAll('path').data(links, (d,i) => d.target.data.name)
            .join(function(enter) {
              return enter
              .append('path').attr('d', linkPathGenerator);
            },
            function(update) {
              return update.append('path').attr('d', linkPathGenerator);
            })
    
          }
          update(pathLinks)
         
          
    
          function updateCircles(data){
            svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('fill','white')
            .attr('stroke','white')
            .attr('cx', function(d) { 
               
                                    let valx
                                if(mouseX === 0){valx = d.y}
                                else{valx = mouseX}
                            
                                return valx
                            })
            .attr('cy', function(d) {return d.x;})
            .attr('r', 4)
            .attr('id',(d,i)=>{return d.data.name;})
    
            .on('click', async function(event,d){
              var valueArray;
             
              let buttonId = d3.select(this)["_groups"][0][0]["attributes"].id.value;
              console.log(buttonId)
              mouseX = d3.select(this)["_groups"][0][0]["attributes"].cx.value;
    
    
    
    
    
    
              let checkButtonExists = buttonTracker.filter(button => button.buttonId === buttonId);
              console.log("checkButtonExists",checkButtonExists)
             if(checkButtonExists[0]!== undefined){
                  //also remove this item from button tracker
                  console.log("buttonTracker",buttonTracker);
                 buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);
                 
                 //handle path update
                 pathLinks = checkButtonExists[0].buttonPathData.concat(pathLinks);
                      //  console.log(pathLinks)         
                 update(pathLinks);
                  return;
    
             }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
          
             var valueArray = await processedlinks(d.links()); 
              
              let updatePathLinks = pathLinks.filter(function(item){   
                     
                          return !valueArray.includes(item.source.data.name);
                        });                  
                        update(updatePathLinks);
    
              var clickedPathData = pathLinks.filter(function(item){
                return valueArray.includes(item.source.data.name);
                });
    
                buttonTracker.push({
                  buttonId:buttonId,
                  buttonPathData: clickedPathData,              
              })
             
    
    
              async function processedlinks(dlinks) {
                var valueArray = [];
         
                    return new Promise((resolve, reject)=>{
                          dlinks.forEach(async(element) =>{
    
                               valueArray.push(element.source.data.name); 
                          });
                          resolve(valueArray);      
                    });
                }
                pathLinks = updatePathLinks;
            })
          }
          updateCircles(root.descendants());
    
    
    
          
          // function updateText(){
          //   svg.selectAll('text').data(root.descendants()).enter().append('text').attr('x',d=>d.y)
          //   .attr('y',d=>d.x-15).attr('fill','white').attr('stroke','white').text(d=>d.data.name)
          //   svg.selectAll('text').on("click", function(event){
          //     console.log(d3.select(this)["_groups"])
          //     d3.select(this)
          //       .style("text-transform", "uppercase");
          //     })
          // }
          // updateText(root.descendants());
         
          
         
            
       
        } 
        radialdata();
      
    }, [])
    
  return (
    <div>Tree</div>
  )
}

export default Tree










  // useEffect(() => {
  //   const width = 960;
  //   const height = 1060;
  //   const treeLayout =d3.tree().size([2 * Math.PI, 200])
  //   let svg = d3.select("body")
  //   .append("svg")
  //   .attr("width", width)
  //   .attr("height", height),
  //   g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");
  //   async function radialtree() {
  //     let deriveddata = [];
      
  //     const data = await d3.json('../sampledata.json');
  //     const root = d3.hierarchy(data);
  //     let pathLinks =treeLayout(root).links()
  //       console.log(pathLinks);
  //       console.log((root.descendants()))
  //       console.log(root.links())

      

  //       function circleupdate(data){

          

  //         var node = g.selectAll(".node")
  //         .data(data)
  //         .enter().append("g")
  //         .attr("transform", function(d) {return "translate(" + radialPoint(d.x, d.y,d.data.name) + ")"; });


  //         node.append('circle').attr('r',5)
  //         .on("click", function(event,d)
  //         {
  //           let id;
  //           if(typeof(d.data.value) === "string"){
  //             id = d.data.value;
  //           }
  //           let newdata =[];
  //             function addnodes(Links){
  //              Links.forEach(item => {
                
  //                 console.log(item)
  //               if(typeof(item.data.value) === 'string' && item.data.value === id){
  //                 newdata.push(item);
  //               }else{
  //                 return addnodes(item.children)
  //               }
  //              });

  //             // console.log(item.target.children)
              
  //             }
  //             console.log(newdata)
  //             addnodes(root.descendants())
            
           

                 

  //         }
  
  //         )
  //       }
  //       circleupdate(root.descendants())
    

  //       function update(data){
    
  //         g.selectAll('path').data(data)
  //           .enter()
  //           .append("path")
  //           .attr("class", "radial")
  //           .attr("d", d3.linkRadial().angle(d => 
  //             d.x).radius(d => d.y));
  //         } 
  
  //         update(pathLinks);

  //       console.log(deriveddata);
  //           function radialPoint(x, y,id) {
  //             let a=(y = +y) * Math.cos(x -= Math.PI / 2);
  //             let b=y * Math.sin(x);
             
  //             const n=deriveddata.push({a,b,id});
  //             // console.log(n)
  //             return [a,b];
  //           }

         
  //   }
  //   radialtree()


  // }, [])

// 
