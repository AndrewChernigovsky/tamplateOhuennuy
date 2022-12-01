import * as $ from 'jquery'
import Post from '@models/Post'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import WebpackLogo from '@/assets/webpack-logo.png'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './babel'
import './styles/styles.css'
import './styles/scss.scss'
import { constant } from 'lodash'

const post = new Post('Webpack Post Title', WebpackLogo)
$('pre').addClass('code').html(post.toString())

function UserGreeting(props) {
    return <h1>С возвращением!!!</h1>;
}
  
function GuestGreeting(props) {
    return <h1>Войдите, пожалуйста.</h1>;
}

function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }
  
ReactDOM.render(

    <Greeting isLoggedIn={true} />,
    document.getElementById('app')
);


// ReactDOM.render(<App />,  'div');

// ReactDOM.render(<App />, document.getElementById('app'))
// ReactDOM.render(<Div />, document.getElementById('app'))

// console.log('JSON:', json)
// console.log('XML:', xml)
// console.log('CSV:', csv)
