import DeckGL, {GeoJsonLayer} from 'deck.gl';

export default class RangeLayer extends GeoJsonLayer
{
	initializeState()
	{
		super.initializeState();
		console.log(this.props.data);
	} 

	updateState({props})
	{
		super.updateState(...arguments);
	}
}

RangeLayer.layerName = 'RangeLayer';
