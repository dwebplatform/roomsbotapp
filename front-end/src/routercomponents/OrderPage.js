
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderComponent } from '../components/OrderComponent';
import { FilterOrderComponent } from '../components/FilterOrderComponent';
import { getOrdersAction } from '../reducers/actions';
import { useRouteMatch } from 'react-router-dom';
export const OrderPage = () => {

    const dispatch = useDispatch();
    const [curPage, setPage] = useState(1);
    const [filterObject, setFilterObject] = useState({
        fromDate: new Date().getTime() / 1000,
        toDate: new Date().getTime() / 1000 + 30 * 24 * 3600
    });
    const handleFilterChange = ({ fromDate, toDate }) => {
        let unixFromDate = Date.parse(fromDate) / 1000;
        let unixToDate = Date.parse(toDate) / 1000;
        // затем setим filterObject  фильтр в надежде что заработает
        setFilterObject({
            fromDate: unixFromDate,
            toDate: unixToDate
        });
    }
    useEffect(() => {
        //TODO: check protected
        // ! получаем  заказы
        dispatch(getOrdersAction(curPage, { filterObject }));
    }, [curPage, filterObject]);
    const { data: orders, loading, error } = useSelector((store) => store.orders);

    function OrderList() {
        return (orders && orders.map((item, i) => {
            return <OrderComponent id={item.id} className="main-container__item" fullInfo={item.fullInfo} status={item.status} key={i} />
        }));

    }
    return (
        <section className="app">
            <div className="paddinger" >
                {/*//TODO: добавить  в фильтр поле статус !!!  */}
                <FilterOrderComponent curentFilter={{ ...filterObject }} filterHandleChange={handleFilterChange} />
            </div>
            <main className="main-container">
                {error && <pre>{JSON.stringify(error)}</pre>}
                <OrderList />
            </main>
            <nav className="main-navigation" aria-label="Orders navigation ">
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link my-link" onClick={(e) => {
                            e.preventDefault();
                            if (curPage <= 0) {
                                return;
                            } else {
                                setPage((p) => p - 1);
                            }
                        }} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                    </li>
                    <li className="page-item "><a className="page-link" href="!#">...</a></li>
                    <li className="page-item">
                        <a className="page-link my-link" onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => p + 1);
                        }} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only" >Next</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </section>
    );
}