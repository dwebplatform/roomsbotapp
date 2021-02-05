import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ children: Component, ...rest }) => {
    const { isAuth } = useSelector((state) => state);
    return <Route {...rest}  >
        {(() => {
            return isAuth ? Component : <Redirect to='/login' />;
        })()}
    </Route>
}