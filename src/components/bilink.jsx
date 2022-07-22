import React, { useEffect } from 'react'
import * as d3 from 'd3'
import data from '../sampledata2.json'

const Bilink = () => {
    // useEffect(() => {
    //     const root = d3.tree(bilink(d3.hierarchy(data)
    //     .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

    //     console.log(root)
    //     function bilink(root) {
    //         const map = new Map(root.leaves().map(d => [id(d), d]));
    //         for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
    //         for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
    //         return root;
    //       }
    //       function id(node) {
    //         return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
    //       }
    // }, [])
    
  return (
    <div>bilink</div>
  )
}

export default Bilink