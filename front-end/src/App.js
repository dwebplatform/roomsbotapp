import { useState, useEffect } from 'react'
import { OrderComponent } from './components/OrderComponent';
import { NavigationComponent } from './components/NavigationComponent';
import { FilterOrderComponent } from './components/FilterOrderComponent';
import { AspireComponent } from './components/AspireComponent';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAction } from './reducers/actions';
import { BrowserRouter as Router, Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Header } from './routercomponents/Header';
import { OrderPage } from './routercomponents/OrderPage';
import { ApartmentPage } from './routercomponents/ApartmentPage';
import { SubWayPage } from './routercomponents/SubWayPage';

//TODO : LOGIN PAGE
function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/orders'>
          <OrderPage />
        </Route>
        <Route path='/apartments'>
          <ApartmentPage />
        </Route>
        <Route path='/subways'>
          <SubWayPage />
        </Route>
      </Switch>
    </>
  );
}
export default App;
