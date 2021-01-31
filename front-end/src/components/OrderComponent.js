import { useField } from 'react-hooks-lib';
import { useDispatch } from 'react-redux';
import { updateStatusAction } from '../reducers/actions';
import './order.css';

const statuses = {
    0: 'Новый заказ',
    1: 'Аннулирован',
    2: 'Совершен'
};
export const OrderComponent = ({ id, className, fullInfo, status }) => {
    //TODO: найти песню i like being
    const { client, rooms } = fullInfo;
    let copiedClient = client || {};
    //TODO: сделать пагинацию в двух классах Service и Dummy
    const { value: selectedStatus, bind } = useField(status + '');
    const dispatch = useDispatch();
    const handleChangeStatus = () => {
        // dispatch async ...
        dispatch(updateStatusAction(selectedStatus, id));
    }
    return (<div className={`order-container ${className ? className : ''}`}>
        <div className={`order ${status == 0 ? 'order__status-new' : ''} `}>
            <div className="order__client">
                <h3>Клиент</h3>
                <div className="order__client-info ">
                    <span className="order__client-field">Имя:{copiedClient.name}</span>
                    <span className="order__client-field">Фамилия:{copiedClient.secondName}</span>
                    <span className="order__client-field">Возраст:{copiedClient.age}</span>
                    <span className="order__client-field">Телефон:{copiedClient.phone}</span>
                    <span className="order__client-field">mail:{copiedClient.email}</span>
                </div>
            </div>
            <div className="order__apartments">
                <div className="order__apartments-items">
                    <h3 className="order__apartments-header"><span>Квартиры</span><span> Статус : {statuses[status]}</span></h3>
                    {
                        Array.isArray(rooms) && rooms.map((room, index) => {
                            return (<div className="order__apartments-item" key={index}>
                                <span className="order__apartment-field">адрес:{room.address}</span>
                                <span className="order__apartment-field">кол-во гостей:{room.personsAmount}</span>
                                <span className="order__apartment-field">Наличие животных: {room.withAnimals ? 'Да' : 'Нет'}</span>
                                <span className="order__apartment-field">Дети:{room.withChilds ? 'Да' : 'Нет'}</span>
                                {/* TODO: сделать тут услуги из бд-ки */}
                                <span className="order__apartment-field">Услуги:</span>
                                <span className="order__apartment-field">Время заезда:{room.fromDate}</span>
                                <span className="order__apartment-field">Время выезда:{room.toDate}</span>
                                <span className="order__apartment-field">Цена за апартаменты:{room.price}</span>
                                <span className="order__apartment-field">Цена c учетом услуг:{room.totalPrice}</span>
                            </div>)
                        })
                    }
                    <div className="order__status-btn-container">
                        <select className="order__status-selector" {...bind}>
                            {
                                Object.keys(statuses).map((statusId) => {
                                    return <option key={statusId} value={statusId}>{statuses[statusId]}</option>
                                })
                            }
                        </select>
                        <button className="order__status-btn" onClick={handleChangeStatus}>Сменить статус </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}