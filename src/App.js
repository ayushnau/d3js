import React, { useEffect } from 'react'
import './app.css'
import * as d3 from 'd3'
// import data from '../public/static/data.json'
import { bin, linkHorizontal, select, tree } from 'd3'



const App = () => {
  useEffect(() => {
    
    const width = document.body.clientWidth;
    const height = 960;
    const treeLayout =d3.tree().size([height,width])

    let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
    
    const radialdata = async()=>{
      const data = await d3.json('../data.json');
      const root = d3.hierarchy(data);
      const links =treeLayout(root).links();
      const linkPathGenerator = linkHorizontal().x(d=>d.y).y(d=>d.x)
   
      svg.selectAll('path').data(links).enter().append('path').attr('d', linkPathGenerator)

      svg.selectAll('text').data(root.descendants()).enter().append('text').attr('x',d=>d.y).attr('y',d=>d.x).text(d=>d.data.data.id)
   
    } 
    radialdata();

  
  }, [])
  
  
 
  return ( 
    <>
  
        </>
  )
}

export default App