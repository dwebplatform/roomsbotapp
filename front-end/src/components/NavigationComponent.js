import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const routes = [{ path: '/orders', title: 'Заказы' }, { path: '/apartments', title: 'Квартиры' }, { path: '/subways', title: 'Метро' }, { path: '/services', title: 'Услуги' }];

export const NavigationComponent = () => {
    const { isAuth } = useSelector(state => state);
    return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link className="nav-link" to="/">Главная <span className="sr-only"></span></Link>
                </li>
                <li className="nav-item">
                    {!isAuth && <Link className="nav-link" to="/login" >Войти</Link>}
                    {isAuth && <Link className="nav-link" to="/logout">Выйти</Link>}
                </li>
                {isAuth && routes.map((item) => {
                    return (<li className="nav-item">
                        <Link className="nav-link" to={item.path} >{item.title}</Link>
                    </li>)
                })}
            </ul>
        </div>
    </nav>)
}