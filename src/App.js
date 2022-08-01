import React from 'react'
import TransformationMap  from './components/TransformationMap'
import sampledata from './sampledata.json'
import sampledata2 from './sampledata2.json'

const App = () => {
  return (
    <div>
      <TransformationMap initialData ={sampledata} completeData ={sampledata2} radius ={400} width = {650} height ={600}  />
    </div>
  )
}

export default App