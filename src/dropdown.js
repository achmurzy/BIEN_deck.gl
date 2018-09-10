import React from 'react';
import ReactDOM from 'react-dom';
import onClickOutside from "react-onclickoutside"
import FontAwesome from 'react-fontawesome'

import {charts} from './style'

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

export default class Dropdown extends React.Component
{
	constructor(props)
	{
		super(props);
		console.log(this.props)
		this.state = 
		{
			listOpen: false,
			headerTitle: this.props.title
		}
	}

	handleClickOutside()
	{
  		this.setState({ listOpen: false });
	}

	toggleList()
	{
  		this.setState(prevState => ({listOpen: !prevState.listOpen}));
	}

	render()
	{
	  const{list} = this.props;
	  const{listOpen, headerTitle} = this.state;
	  return(
	    <div style = {charts} className="dd-wrapper">
	    <div className="dd-header" onClick={() => this.toggleList()}>
	        <div className="dd-header-title">{headerTitle}</div>
	        {listOpen
	          ? <FontAwesome name="angle-up" size="2x" style={fontStyle}/>
	          : <FontAwesome name="angle-down" size="2x" style={fontStyle}/>
	        }
	    </div>
	     {listOpen && <ul className="dd-list">
	       {list.map((item) => (
	         <li className="dd-list-item" key={item.id} style={liStyle}>{item.title}</li>
	        ))}
	      </ul>}
	    </div>
	  )
	}
}