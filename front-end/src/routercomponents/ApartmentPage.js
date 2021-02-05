
import axios from 'axios';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'react-hooks-lib';
import { BsXCircle } from 'react-icons/bs';
import './apartmentpage.css';
import { objectHasProps } from '../util/helpers';


import { addServiceToApartmentAction, clearOrderEventAction, getAllServiceAction, createApartmentAction, deleteServiceFromApartmentAction, getServicesForApartmentAction, removeSubWayFromApartmentAction, deleteApartmentByIdAction, addSubwayForApartmentAction, deleteApartmentImageByIndexAction, getAllSubWaysAction, getAllApartmentsAction, getApartmentByIdAction, updateBasicApartmentFieldsAction, addNewImageToApartmentAction } from '../reducers/actions';
import { BrowserRouter, Redirect, Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';


export function useApartmentUpdate(apartmentId, apartment) {
    const [editFields, setEditFields] = useState({
        address: '',
        price: 2500,
        roomAmount: 1,
        isVip: "0",
        subways: [],
    });
    useEffect(() => {

        // console.log(objectHasProps(apartment,['address','price','roomAmount','isVip','Subways']));
        if (objectHasProps(apartment, ['address', 'price', 'roomAmount', 'isVip', 'Subways'])) {
            setEditFields({
                address: apartment.address,
                price: apartment.price,
                roomAmount: apartment.roomAmount,
                isVip: apartment.isVip ? "1" : "0",
                subways: apartment.Subways,
            });
        }
    }, [apartment, apartmentId]);
    return [editFields, setEditFields];
}

const EditApartment = () => {
    let { apartmentId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getApartmentByIdAction(apartmentId))
    }, [apartmentId]);

    const { data: apartment, error, loading } = useSelector((state) => state.apartment);
    const { apartmentImageDeleted, removeSubWayFromApartmentSuccess, successfullyAdded, deletedApartmentSuccess } = useSelector((state) => state.popupInfo);
    const [editFields, setEditFields] = useApartmentUpdate(apartmentId, apartment);

    const handleBasicFieldsChange = (e) => {
        setEditFields((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        });
    }
    // добавляем image для текущей комнаты
    const [addedImages, setAddedImages] = useState([]);
    const [preloadedUrls, setPreloadedUrls] = useState([]);// preloaded urls
    const handleShowAddPreview = (e) => {
        let files = e.target.files;
        if (files.length > 0) {
            let src = URL.createObjectURL(e.target.files[0]);
            if (preloadedUrls.length < 10) {
                setPreloadedUrls([...preloadedUrls, src]);
            }
            setAddedImages((prevState) => {
                return [...prevState, e.target.files[0]];
            });
        }
    }
    if (removeSubWayFromApartmentSuccess) { // при успешном удалении перезагрузить
        console.log('SUCCESSFULLY REMOVED SUBWAY FROM APARTMENT');
    }
    if (successfullyAdded) {// после добавления изображений
        console.log('SUCCESSFULLY ADDED IMAGE')
    }
    if (deletedApartmentSuccess) {// после удаления квартиры
        return <Redirect to='/apartments' />;
    }
    if (apartmentImageDeleted) {// после каждого удаления изображения
        console.log('SUCCEFULLY DELETED IMAGE');
    }
    const handleEditApartment = (e) => {

        dispatch(updateBasicApartmentFieldsAction(apartmentId, editFields));
    }
    function apartmentHasImage(apartment) {
        return apartment.images && apartment.images.length
    }
    const handleDeleteImage = (imageIndex) => {
        dispatch(deleteApartmentImageByIndexAction(apartmentId, imageIndex));
    }

    const handleAddImagesToApartment = () => {
        dispatch(addNewImageToApartmentAction(apartmentId, [...addedImages]));
    }
    const handleDeleteApartment = () => {
        dispatch(deleteApartmentByIdAction(apartmentId));
    }

    const handleDeleteSubWayFromApartment = (subwayId) => {
        dispatch(removeSubWayFromApartmentAction(apartmentId, subwayId));
    }

    return (
        <div className="edit-apartment-container">
            <div className="edit-apartmentcontainer__item form-group">
                <label htmlFor={"apartment-adress-" + apartmentId}>Адрес:</label>
                <input id={"apartment-adress-" + apartmentId} type="text" className="form-control"
                    value={editFields.address}
                    name="address"
                    onChange={handleBasicFieldsChange}
                />
            </div>
            <div className="edit-apartmentcontainer__item form-group">
                <label htmlFor={"apartment-amount-" + apartmentId}>Количество комнат:</label>
                <input id={"apartment-amount-" + apartmentId} type="text" className="form-control"
                    value={editFields.roomAmount}
                    name="roomAmount"
                    onChange={handleBasicFieldsChange}
                />
            </div>
            <div className="edit-apartmentcontainer__item form-group">
                <label htmlFor={"apartment-price-" + apartmentId}>Цена:</label>
                <input id={"apartment-price-" + apartmentId} type="text" className="form-control"
                    value={editFields.price}
                    name="price"
                    onChange={handleBasicFieldsChange}
                />
            </div>

            <div className="edit-apartmentcontainer__item form-group edit-apartmentcontainer__item--added-image">
                <div className="custom-file">
                    <input type="file" className="custom-file-input"
                        id={"add-image-input" + apartmentId}
                        onChange={handleShowAddPreview}
                    />
                    <label className="custom-file-label" htmlFor={"add-image-input" + apartmentId}>Choose file</label>
                </div>
                <div className="container" >
                    <button className="btn btn-success" onClick={handleAddImagesToApartment} style={{ fontWeight: 'bold', fontSize: '16px' }}>+</button>
                </div>
            </div>
            <div className="preloaded-image-container">
                {preloadedUrls.map((item, index) => {
                    return <div className="preloaded-image-container__item" key={index} ><img className="img-thumbnail apartment-image" src={item} /></div>
                })}
            </div>
            <div className="edit-apartmentcontainer__item form-group">
                <label htmlFor={"apartment-status-" + apartmentId}>Статус квартиры:</label>
                <select className="form-control" id={"apartment-status-" + apartmentId}
                    name="isVip"
                    value={editFields.isVip}
                    onChange={handleBasicFieldsChange}
                >
                    <option value="1">VIP</option>
                    <option value="0">Эконом</option>
                </select>
            </div>
            <div className="all-subway-for-apartment-container d-flex">

                {(editFields.subways && editFields.subways.length) ?
                    editFields.subways.map((subWayItem) => {
                        return <span className="badge badge-light p-3 m-2 subway-item" key={subWayItem.id}>
                            {subWayItem.name}!!!
                            <BsXCircle onClick={() => handleDeleteSubWayFromApartment(subWayItem.id)} className="subway-item-icon" />
                        </span>
                    }) : null
                }
            </div>
            <EditSubWayInput apartmentId={apartmentId} />
            <hr />
            <EditServiceInput apartmentId={apartmentId} />
            <div className="edit-apartmentcontainer__item">
                <label className="current-apartment-container__field-label">Фотографии</label>
                <div className="image-container">
                    {apartmentHasImage(apartment) ? apartment.images.map((image, imageIndex) => {
                        return (<div className="image-item" key={imageIndex} >
                            <div className="delete-image"><span className="delete-image-btn" onClick={() => handleDeleteImage(imageIndex)}>X</span></div>
                            <img className="img-thumbnail apartment-image" src={image} />
                        </div>)
                    }) : null}
                </div>
            </div>


            <div className="current-apartment-container__item">
                <div className="form-group">
                    <button className="btn btn-success w-100" onClick={handleEditApartment}>ИЗМЕНИТЬ</button>
                    <button className="btn btn-danger w-100 my-3" onClick={handleDeleteApartment} >УДАЛИТЬ КВАРТИРУ</button>
                </div>
            </div>

        </div>
    )
}




const AddApartment = ({ handleAddApartmentListener }) => {
    const dispatch = useDispatch();
    const [apartmentFields, setApartmentFields] = useState({
        address: '',
        isVip: 0,
        roomAmount: 1,
        images: [],
        price: 2500
    });
    const handleAddressChange = (e) => {
        setApartmentFields((prevState) => {
            return {
                ...prevState,
                address: e.target.value
            }
        });
    }
    const handleIsVipChange = (e) => {
        let value = e.target.value;
        if (value == "1") {
            setApartmentFields((prevState) => {
                return {
                    ...prevState,
                    isVip: 1
                }
            })
        } else {
            setApartmentFields((prevState) => {
                return {
                    ...prevState,
                    isVip: 0
                }
            })
        }
    }

    const handlePriceChange = (e) => {
        setApartmentFields((prevState) => {
            return {
                ...prevState,
                price: e.target.value
            }
        });
    }

    const handleRoomAmountChange = (e) => {
        setApartmentFields((prevState) => {
            return {
                ...prevState,
                roomAmount: e.target.value
            }
        })
    }
    const handleImageLoad = async (e) => {
        let file = e.target.files[0] || null;
        if (!file) {
            return;
        }
        setApartmentFields((prevState) => {
            return {
                ...prevState,
                images: prevState.images.concat(file)
            }
        });
    }
    const handleAddApartment = async (e) => {
        e.preventDefault();
        let copyApatrmentsFields = { ...apartmentFields };
        handleAddApartmentListener(copyApatrmentsFields);
    }
    const { createApartmentEvent } = useSelector((state) => state.popupInfo);
    useEffect(() => {
        if (createApartmentEvent) {
            dispatch(clearOrderEventAction());
        }
    }, []);
    return (<>  <div className="current-apartment-container__item">
        {createApartmentEvent && <div className="alert alert-success">{createApartmentEvent.msg}</div>}
        <div className="current-apartment-container__field">
            <label className="current-apartment-container__field-label">Адрес:</label>
            <input className="curretn-apartment-container__field-input form-control" type="text"
                onChange={handleAddressChange}
                value={apartmentFields.address}
            />
        </div>
    </div>
        <div className="current-apartment-container__item">
            <div className="current-apartment-container__field">
                <label className="current-apartment-container__field-label">Статус:</label>
                <select className="custom-select" onChange={handleIsVipChange} >
                    <option value="1">VIP</option>
                    <option value="0">Эконом</option>
                </select>
            </div>
        </div>
        <div className="current-apartment-container__item">
            <div className="current-apartment-container__field">
                <label className="current-apartment-container__field-label" >Количество комнат:</label>
                <input className="curretn-apartment-container__field-input form-control"
                    onChange={handleRoomAmountChange}
                    value={apartmentFields.roomAmount}
                    type="text" />
            </div>
        </div>
        <div className="current-apartment-container__item">
            <div className="current-apartment-container__field">
                <div className="custom-file  pointer" >
                    <input type="file" className="custom-file-input" id="loadapartment-images " onChange={handleImageLoad} />
                    <label className="custom-file-label" htmlFor="loadapartment-images">Выберите файл для загрузки фотографии квартиры</label>
                </div>
            </div>
        </div>
        <div className="current-apartment-container__item">
            <div className="current-apartment-container__field">
                <label className="current-apartment-container__field-label">Цена:</label>
                <input className="curretn-apartment-container__field-input form-control" onChange={handlePriceChange} value={apartmentFields.price} type="text" />
            </div>
        </div>
        <div className="current-apartment-container__item">
            <div className="form-group">
                <button className="btn btn-success w-100" onClick={handleAddApartment}>ДОБАВИТЬ</button>
            </div>
        </div></>);
}


const EditServiceInput = ({ apartmentId }) => {


    const { data: allServices, error, loading } = useSelector((state) => state.services);
    const { data: services } = useSelector(state => state.servicesForCurrentApartment);
    const { value: selectedServiceId, bind } = useField('null');
    const dispatch = useDispatch();
    // console.log(allServices);
    useEffect(() => {
        dispatch(getAllServiceAction());
    }, []);
    useEffect(() => {
        dispatch(getServicesForApartmentAction(apartmentId));
    }, [apartmentId]);
    const handleAddServiceToApartment = () => {
        if (!(selectedServiceId == 'null')) {
            dispatch(addServiceToApartmentAction(apartmentId, selectedServiceId));
        }
    }
    const handleDeleteServiceFromApartment = (apartmentId, serviceId) => {
        dispatch(deleteServiceFromApartmentAction(apartmentId, serviceId));
    }
    return (<div className="edit-apartmentcontainer__item d-flex">
        <div className="apartment-service-container">
            {(services && services.length) ? (
                services.map((item) => {
                    return <span className="apartment-service-container-item"
                        key={item.id}>{item.name}<BsXCircle
                            onClick={() => { handleDeleteServiceFromApartment(apartmentId, item.id) }}
                            className="apartment-service-icon" /></span>
                })
            ) : null}
        </div>
        <div className="form-group">
            <select {...bind} className="form-control" >
                <option value="null">выберите услугу</option>
                {allServices.map((serviceInstance) => {
                    let curServicesIds = services.map((el) => el.id);
                    if (curServicesIds.includes(serviceInstance.id)) {
                        return null;
                    }
                    return (<option
                        key={serviceInstance.id}
                        value={serviceInstance.id}
                    >{serviceInstance.name}</option>)
                })}
            </select>
        </div>
        <div className="ml-3">
            <button disabled={selectedServiceId == 'null'} onClick={handleAddServiceToApartment} className="btn btn-success add-subway-btn">+</button>
        </div>
    </div>);
}

const EditSubWayInput = ({ apartmentId }) => {
    const dispatch = useDispatch();
    const { data: subways, error, loading } = useSelector(state => state.subwaysNotIncludedInApartment);
    const popupInfo = useSelector(state => state.popupInfo);

    const { value: addedSubway, bind } = useField('null');
    if (popupInfo.subwayAdded) {// если успешно добавлено метро
        console.log('SUCCEFULLY ADDED SUBWAY');
    }
    const handleAddSubWayToApartment = () => {
        if (addedSubway == 'null') {
            return;
        }
        // добавляем метро к текущей комнате
        dispatch(addSubwayForApartmentAction(addedSubway, apartmentId));
    }
    useEffect(() => {
        dispatch(getAllSubWaysAction(apartmentId));
    }, [apartmentId]);

    return (<div className="edit-apartmentcontainer__item d-flex" >
        <div className="form-group">
            <select {...bind} className="form-control" >
                <option value="null">выберите метро</option>
                {(subways && subways.length) && (
                    subways.map((item) => {
                        return <option key={item.id} value={item.id}>{item.name}</option>
                    })
                )}
            </select>
        </div>
        <div className="ml-3">
            <button onClick={handleAddSubWayToApartment} className="btn btn-success add-subway-btn">+</button>
        </div>
    </div>);
}

export const ApartmentPage = () => {
    const dispatch = useDispatch();
    let { path, url } = useRouteMatch();
    const { data: apartments, error, loading } = useSelector((state) => state.apartments);
    const handleAddApartment = (apartmentsField) => {
        dispatch(createApartmentAction(apartmentsField));
    }
    useEffect(() => {
        dispatch(getAllApartmentsAction());
    }, []);
    return (
        <div className="apartment-container">
            <aside className="apartment-list-container">
                <div className="apartment-list-container__item">
                    <ul className="list-group apartment-list-container__item-list">
                        <li className="list-group-item active">Все квартиры</li>
                        {(apartments && apartments.length) ? apartments.map((apartment) => {
                            return (<li className="list-group-item" key={apartment.id}>
                                <Link to={`${url}/${apartment.id}`}>{apartment.address}</Link></li>)
                        }) : null}
                        <li className="list-group-item"><Link to='/apartments'>Создать квартиру</Link></li>
                    </ul>
                </div>
                <div className="apartment-list-container__item">
                </div>
            </aside>
            <section className="current-apartment-container ">
                <Switch>
                    <Route path={path} exact>
                        <AddApartment handleAddApartmentListener={handleAddApartment} />
                    </Route>
                    <Route path={`${path}/:apartmentId`}>

                        <EditApartment />

                    </Route>
                </Switch>
            </section>
        </div>
    )
}