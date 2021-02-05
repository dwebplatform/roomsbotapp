import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { submitUserAction } from '../reducers/actions';
export const LoginPage = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const handleEmailChange = (e) => {
        setUserData((prevData) => ({
            ...prevData,
            email: e.target.value
        }))
    }
    const handlePassChange = (e) => {
        setUserData((prevData) => ({
            ...prevData,
            password: e.target.value
        }));
    }
    const handleSubmit = () => {
        dispatch(submitUserAction(userData.email, userData.password));
    }

    const { isAuth } = useSelector(state => state);
    const { authError } = useSelector((state) => state.popupInfo);
    if (isAuth) {
        return <Redirect to="/orders" />
    }
    return (
        <div className="container">
            <div className="my-3">
                {authError && <div className="alert alert-danger">{authError.msg}</div>}
            </div>
            <div className="form-group">

                <div className="my-3">
                    <input type="text"
                        value={userData.email}
                        onChange={handleEmailChange}
                        placeholder="email"
                        className="form-control " />
                </div>
                <div className="my-3">
                    <input
                        type="password"
                        placeholder="pass"
                        value={userData.password}
                        onChange={handlePassChange}
                        className="form-control " />
                </div>
            </div>
            <div className="form-group">
                <button className="btn btn-primary w-100" onClick={handleSubmit}>Войти</button>
            </div>
        </div>);
}