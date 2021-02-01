
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './apartmentpage.css';

import { createOrderAction, deleteApartmentImageByIndexAction, getAllApartmentsAction, getApartmentByIdAction } from '../reducers/actions';
import { BrowserRouter, Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';


const EditApartment = () => {
    let { apartmentId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {

        dispatch(getApartmentByIdAction(apartmentId))

    }, [apartmentId]);
    const { data: apartment, error, loading } = useSelector((state) => state.apartment);
    const { apartmentImageDeleted } = useSelector((state) => state.popupInfo);
    console.log({ apartmentImageDeleted });
    if (apartmentImageDeleted) {
        document.location.reload();
    }
    const handleEditApartment = (e) => {

    }
    function apartmentHasImage(apartment) {
        return apartment.images && apartment.images.length
    }


    const handleDeleteImage = (imageIndex) => {
        dispatch(deleteApartmentImageByIndexAction(apartmentId, imageIndex));
    }
    return (
        <div className="edit-apartment-contaniner">
            <div className="edit-apartmentcontainer__item">
                <label className="current-apartment-container__field-label">Фотографии</label>
                <div className="image-container">
                    {apartmentHasImage(apartment) ? apartment.images.map((image, imageIndex) => {
                        return (<div className="image-item" key={imageIndex} style={{ width: '200px' }}>
                            <div className="delete-image"><span className="delete-image-btn" onClick={() => handleDeleteImage(imageIndex)}>X</span></div>
                            <img className="img-thumbnail" src={image} />
                        </div>)
                    }) : null}

                </div>
            </div>
            {/* {apartmentId} */}
            {/* <div className="current-apartment-container__item">
                {/* <div className="current-apartment-container__field">
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
            </div> */}
            <div className="current-apartment-container__item">
                <div className="form-group">
                    <button className="btn btn-success w-100" onClick={handleEditApartment}>ИЗМЕНИТЬ</button>
                </div>
            </div>

        </div>
    )
}


const AddApartment = ({ handleAddApartmentListener }) => {
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

    return (<>  <div className="current-apartment-container__item">
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




export const ApartmentPage = () => {
    const dispatch = useDispatch();
    let { path, url } = useRouteMatch();
    const { data: apartments, error, loading } = useSelector((state) => state.apartments);
    const handleAddApartment = (apartmentsField) => {
        dispatch(createOrderAction(apartmentsField));
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