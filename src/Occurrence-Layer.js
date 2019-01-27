import DeckGL, {ScatterplotLayer} from 'deck.gl';

const vertexShader = `#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

uniform float currentTime;
attribute float instanceAngles;
attribute float instanceTimes;
varying float vAlpha;

attribute vec3 instancePositions;
attribute float instanceRadius;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float renderPickingBuffer;
uniform float outline;
uniform float strokeWidth;

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

vec3 rotateZ(vec3 vector, float angle) {
  mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  return vec3(rotationMatrix * vector.xy, vector.z);
}

void main(void) {
  // Multiply out radius and clamp to limits
  float outerRadiusPixels = clamp(
    project_scale(radiusScale * instanceRadius),
    radiusMinPixels, radiusMaxPixels
  );
  // outline is centered at the radius
  // outer radius needs to offset by half stroke width
  outerRadiusPixels += outline * strokeWidth / 2.0;

  // position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  // 0 - solid circle, 1 - stroke with lineWidth=0
  innerUnitRadius = outline * (1.0 - strokeWidth / outerRadiusPixels);

  // Find the center of the point and add the current vertex
  vec3 center = project_position(instancePositions);
  vec3 vertex = positions * outerRadiusPixels;
  vertex = rotateZ(vertex, instanceAngles);
  vAlpha = 1.0 - abs(instanceTimes - currentTime);

  gl_Position = project_to_clipspace(vec4(center + vertex, 1.0));

  // Apply opacity to instance color, or return instance picking color
  vec4 color = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;
  vec4 pickingColor = vec4(instancePickingColors / 255., 1.);
  vColor = mix(color, pickingColor, renderPickingBuffer);
}`;

const fragmentShader = `#define SHADER_NAME scatterplot-layer-fragment-shader
#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float vAlpha;

void main(void) {

  float distToCenter = length(unitPosition);

  if (unitPosition.x < 1.0 - abs(unitPosition.y) * 4.0) {
    gl_FragColor = vec4(vColor.rgb, vAlpha);
  } else {
  	discard;
  }
}`;

//The scatterplot layer draws a rectangle around each data point coordinate. The rectangle is sized to match user defined radius.
//Coloring all fragments in the shader yields rectangular points. Thus, not all pixels are inherently available in a shader. 
//The set of pixels is defined by the input data
export default class OccurrenceLayer extends ScatterplotLayer {
	
	initializeState()
	{
		super.initializeState();
		//Attributes transfer data from the CPU to the GPU
		//In this case, we are computing the angle and providing it to the layer as a prop in the layer overlay controller deckgl-overlay.js
		//this.state.attributeManager.addInstanced({
		//	instanceAngles: {size:1, accessor: 'getAngle'},
		//	instanceTimes: {size:1, accessor: 'getTime'}
		//});
	} 

	updateState({props})
	{
    console.log(this.props.data)
		super.updateState(...arguments);
		//this.state.model.setUniforms({ currentTime: props.timeOfDay });
	}

	/*getShaders()
	{
		//console.log(super.getShaders().vs);
		return {
			//...super.getShaders(),
			//vs: vertexShader,
			//fs: fragmentShader
		};
	}*/
}