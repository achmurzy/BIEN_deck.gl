import React from 'react';
import ReactDOM from 'react-dom';

import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap'

//import FontAwesome from 'react-fontawesome'
//import onClickOutside from "react-onclickoutside"

const ddStyle = 
{
	margin: '10px',
	height: '30px'
}
const liStyle = 
{
	fontSize: '15px',
	textAlign: 'center',
	height: '20px'
}
const fontStyle =
{
	width: '10px',
	height: '10px'
}

export default class SpeciesDropdown extends React.Component
{
	constructor(props)
	{
		super(props);
		this.toggleList = this.toggleList.bind(this);
		this.state = 
		{
			listOpen: false,
			headerTitle: this.props.title,
			speciesString: ""
		}
	}

	handleClickOutside()
	{
  		this.setState({ listOpen: false });
	}

	toggleList()
	{
  		//this.setState(prevState => ({listOpen: !prevState.listOpen}));
	}

	render()
	{
	  const{list} = this.props;
	  return(
	  	<Dropdown isOpen={this.state.listOpen} toggle={this.toggleList}>
	  		<DropdownToggle>
	  			<Input type="text" onChange={e => this.setState({speciesString: e.target.value}, this.typeHandler())} value={this.state.speciesString} placeholder={this.state.headerTitle}/>
	  		</DropdownToggle>
	  		<DropdownMenu  modifiers={{
					      setMaxHeight: {
					        enabled: true,
					        order: 890,
					        fn: (data) => {
					          return {
					            ...data,
					            styles: {
					              ...data.styles,
					              overflow: 'auto',
					              maxHeight: 100,
            							},
          							};
        						},
      						},
    		}}>
				{/*Make a DropdownItem for each list member*/
					list.map((item) =>
					{
						return(<DropdownItem onClick={this.clickFunction.bind(this)} key={item.id}>
								{item.species}
							  </DropdownItem>);
					})
				}
        	</DropdownMenu>
        </Dropdown>);
	}

	clickFunction(dropdownItem)
	{
		var spp = dropdownItem.currentTarget.textContent;
		this.setState({headerTitle: spp, speciesString: spp, listOpen: false});
		this.props.select(spp);
	}

	typeHandler()
	{
		if(this.state.speciesString.length > 2)
		{
			this.props.match(this.state.speciesString);
			this.setState({listOpen: true});
		}
		else
		{
			this.setState({listOpen: false});
		}
	}
}