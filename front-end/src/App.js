import { useState, useEffect } from 'react'
import { OrderComponent } from './components/OrderComponent';
import { NavigationComponent } from './components/NavigationComponent';
import { FilterOrderComponent } from './components/FilterOrderComponent';
import { AspireComponent } from './components/AspireComponent';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAction, logoutAction } from './reducers/actions';
import { BrowserRouter as Router, Link, Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Header } from './routercomponents/Header';
import { OrderPage } from './routercomponents/OrderPage';
import { ApartmentPage } from './routercomponents/ApartmentPage';
import { LoginPage } from './routercomponents/LoginPage';
import { SubWayPage } from './routercomponents/SubWayPage';
import { ServiceForApartmentPage } from './routercomponents/ServiceForApartmentPage';
import { PrivateRoute } from './components/PrivateRoute';

function LogOutPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logoutAction());
  }, []);
  return <Redirect to="/login" />;
}
//TODO : LOGIN PAGE
function App() {
  function logOut() {
    localStorage.removeItem('token');
    return true;
  }
  return (
    <>
      <Header />
      <Switch>
        <Route path="/logout">
          <LogOutPage />
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <PrivateRoute exact path='/orders'>
          <OrderPage />
        </PrivateRoute>
        <Route path='/apartments'>
          <ApartmentPage />
        </Route>
        <Route path='/subways'>
          <SubWayPage />
        </Route>
        <Route path='/services'>
          <ServiceForApartmentPage />
        </Route>
      </Switch>
    </>
  );
}
export default App;
