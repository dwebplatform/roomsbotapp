import { useState, useEffect } from 'react'
import { OrderComponent } from './components/OrderComponent';
import { NavigationComponent } from './components/NavigationComponent';
import { FilterOrderComponent } from './components/FilterOrderComponent';
import { AspireComponent } from './components/AspireComponent';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAction } from './reducers/actions';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Header } from './routercomponents/Header';
import { OrderPage } from './routercomponents/OrderPage';
import { ApartmentPage } from './routercomponents/ApartmentPage';


function Home() {
  return <div></div>
}




function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/orders'>
          <OrderPage />
        </Route>
        <Route exact path='/apartments'>
          <ApartmentPage />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
