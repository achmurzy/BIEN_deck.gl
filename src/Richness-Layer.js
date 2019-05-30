import DeckGL, {GridCellLayer, ScreenGridLayer} from 'deck.gl';

export default class RichnessLayer extends GridCellLayer
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

RichnessLayer.layerName = 'RichnessLayer';
