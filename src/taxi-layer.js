import DeckGL, {ArcLayer, CompositeLayer, ScatterplotLayer} from 'deck.gl'

//A custom layer
//Questions: 
//-What props does it accept?
//-How much can the user control the output? i.e. how much state does the layer have exposed?
export default class TaxiLayer extends CompositeLayer
{
	renderLayers()
	{
		console.log(this.props.data);
		return [
	  new ScatterplotLayer({
        id: `${this.props.id}-pickup`,
        data: this.props.data,
        getPosition: this.props.getPickupLocation,
        getColor: d => this.props.pickupColor,
        radiusScale: 40
      }),
      new ArcLayer({
        id: `${this.props.id}-arc`,
        data: this.props.data,
        getSourcePosition: this.props.getPickupLocation,
        getTargetPosition: this.props.getDropoffLocation,
        getSourceColor: d => this.props.pickupColor,
        getTargetColor: d => this.props.dropoffColor,
        strokeWidth: 2
      })];
	}
}