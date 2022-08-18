import React, { useEffect, useState } from "react";
import TransformationMap from "./components/TransformationMap";
import TransFormationMaps from "./components/TransFormationMaps";
import sampledata from "./sampledata.json";
import sampledata2 from "./sampledata2.json";
import data from "./data.json";
import image from "./image.jpg";


const App = () => {

  
 

  return (
    
    <div className="master">
      {/* <TransformationMap initialData ={sampledata} completeData ={sampledata2} radius ={400} width = {650} height ={600}  /> */}
      <TransFormationMaps completeData={data} radius={300} />
      <div className="cardmaster">
        <h2>Card</h2>

        <div className="card">
          <img src={image} />
          <div className="container">
            <h4>
              <b>John Doe</b>
            </h4>
            <p>Architect & Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
