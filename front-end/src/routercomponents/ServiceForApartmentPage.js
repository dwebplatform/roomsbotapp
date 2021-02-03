import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAction, deleteServiceAction, addServiceAction, updateServiceNameAction } from '../reducers/actions'
import './subway.css';


export const ServiceForApartmentPage = () => {

    const dispatch = useDispatch();
    const [servicesName, setServicesName] = useState('');
    const handleServicesNameChange = (e) => {
        setServicesName(e.target.value);
    }
    const handleAddService = (e) => {
        dispatch(addServiceAction(servicesName));
    }

    const { data: allServices, error, loading } = useSelector((state) => state.services);

    const [curServiceId, setCurServiceId] = useState(null);
    const [chosenServiceName, setChosenServiceName] = useState('');

    useEffect(() => {
        dispatch(getAllServiceAction());
    }, [handleAddService]);

    const handleCurentServiceChoose = (id, name) => {
        setCurServiceId(id);
        setChosenServiceName(name);
    }
    const handleDeleteService = (serviceId) => {
        dispatch(deleteServiceAction(serviceId));
    }
    const handleBlurChange = () => {
        if (curServiceId) {
            dispatch(updateServiceNameAction(curServiceId, chosenServiceName));
        }
        setCurServiceId(null);
    }
    const { addNewServiceSuccess } = useSelector(state => state.popupInfo);
    return (<div className="subway-container d-flex">
        <aside className="all-subways">
            <ul className="list-group apartment-list-container__item-list">
                <li className="list-group-item active">Список услуг</li>
                {(allServices && allServices.length) ? (
                    allServices.map((item) => {
                        if (curServiceId == item.id) {
                            return (<li
                                key={item.id} className="list-group-item active"><input
                                    type="text"
                                    onBlur={() => handleBlurChange()}
                                    className="form-control"
                                    value={chosenServiceName}
                                    onChange={(e) => setChosenServiceName(e.target.value)}
                                /></li>)
                        }
                        return <li className="list-group-item d-flex justify-content-between"
                            onClick={() => handleCurentServiceChoose(item.id, item.name)}
                            key={item.id}><span>{item.name}</span><button className="btn btn-danger" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteService(item.id);
                            }}>x</button></li>
                    })
                ) : null}
            </ul>
        </aside>
        <section className="subway-create-metro" >
            {addNewServiceSuccess && (<div className="alert alert-success">{addNewServiceSuccess.msg}</div>)}
            <div className="form-group ">
                <input className="form-control " type="text"
                    value={servicesName}
                    onChange={handleServicesNameChange}
                    placeholder="Название услуги" />
                <button className="btn btn-success  my-1" onClick={handleAddService}>Сохранить услугу</button>
            </div>
        </section>
    </div>);
}