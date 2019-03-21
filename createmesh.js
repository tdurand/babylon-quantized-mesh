function loadMesh (path) {
    return window.fetch(path)
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Could not load the mesh')
            }

            return res.arrayBuffer()
        })
}

function constructPositions(vertexData) {
    const elementsPerVertex = 3
    const vertexCount = vertexData.length / elementsPerVertex
    const positionAttributeArray = new Array(vertexData.length)
  
    const vertexMaxPosition = 32767
  
    var containerSize = {
        x: 100,
        y: 100, 
        z: 50
    }
  
    const xScale = containerSize.x / vertexMaxPosition
    const yScale = containerSize.y / vertexMaxPosition
    const zScale = containerSize.z / vertexMaxPosition
  
    for (let i = 0; i < vertexData.length; i++) {
      positionAttributeArray[i * elementsPerVertex] = vertexData[i] * xScale - containerSize.x / 2
      positionAttributeArray[i * elementsPerVertex + 1] = vertexData[i + vertexCount] * yScale - containerSize.y / 2
      positionAttributeArray[i * elementsPerVertex + 2] = vertexData[i + vertexCount * 2] * zScale
    }
  
    // console.log(JSON.stringify(positionAttributeArray));
  
    return positionAttributeArray
}

function createQuantizedMesh (scene) {
  
    return loadMesh("5176.terrain")
      // See https://github.com/heremaps/quantized-mesh-decoder#decoderoptions
      .then(buffer => decode(buffer, {
        maxDecodingStep: 4
      }))
      .then(decodedMesh => {
        console.log(decodedMesh)
  
        if (decodedMesh.vertexData === undefined) {
          return
        }

        // Custom mesh
        var quantizedTileMesh = new BABYLON.Mesh("quantizedTile", scene);
        
        // Need to do some conversion to get from decodedMesh
        //var positions = decodedMesh.vertexData;
        //var indices = decodedMesh.triangleIndices;
    
        var vertexData = new BABYLON.VertexData();
    
        vertexData.positions = constructPositions(decodedMesh.vertexData)
        vertexData.indices = Array.from(decodedMesh.triangleIndices);
    
        vertexData.applyToMesh(quantizedTileMesh);
    
        /******Display custom mesh in wireframe view to show its creation****************/
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.wireframe = true;
        quantizedTileMesh.material = mat;
        /*******************************************************************************/
  

      })
      .catch(err => {
        console.log(err)
      })
  }