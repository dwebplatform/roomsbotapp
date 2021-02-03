import { Link } from 'react-router-dom';

export const NavigationComponent = () => {

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
                    <Link className="nav-link" to="/login" >Войти</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/orders" >Заказы</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/apartments">Квартиры</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/subways">Метро</Link>
                </li>
                 
                <li className="nav-item">
                    <Link className="nav-link" to="/services">Услуги</Link>
                </li>
            </ul>
        </div>
    </nav>)
}