//Importing {React} using braces causes failure
import React, {Component} from 'react';

import { Route, Switch } from "react-router-dom";

export default class Routes extends Component
{
	render(){
	return(<Switch>
    			<Route path="/" exact component={App} />
  		   </Switch>);
	}
}