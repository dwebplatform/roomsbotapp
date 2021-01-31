
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './apartmentpage.css';

import { createOrderAction } from '../reducers/actions';
export const ApartmentPage = () => {
    const [apartmentFields, setApartmentFields] = useState({
        address: '',
        isVip: 0,
        roomAmount: 1,
        images: [],
        price: 2500
    });
    const dispatch = useDispatch();

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
        // let formData = new FormData();
        // formData.append('file', file);

        // let { data } = await axios.post('/api/apartments/create', formData);
    }

    const handleAddApartment = async (e) => {
        e.preventDefault();

        let copyApatrmentsFields = { ...apartmentFields };
        dispatch(createOrderAction(copyApatrmentsFields));
        // createApartment();
        // let index = 1;
        // copyApatrmentsFields.images.forEach((image) => {
        //     formData.append(`image_${index}`, image);
        //     index++;
        // });
        // delete copyApatrmentsFields['images'];
        // console.log({ copyApatrmentsFields });
        // // create formData 
        // let formData = new FormData();
        // for (let key in copyApatrmentsFields) {
        //     formData.append(key, copyApatrmentsFields[key]);
        // }

        // formData.append(`file`, apartmentFields.images[0]);
        // let { data } = await axios.post('/api/apartments/create', formData);
        // console.log(data);
    }
    return (
        <div className="apartment-container">
            <aside className="apartment-list-container">
                <div className="apartment-list-container__item">
                    {/* todo из store получать список всех квартир */}
                    <ul className="list-group apartment-list-container__item-list">
                        <li className="list-group-item active">Все квартиры</li>
                        <li className="list-group-item">Dapibus ac facilisis in</li>
                        <li className="list-group-item">Morbi leo risus</li>
                        <li className="list-group-item">Porta ac consectetur ac</li>
                        <li className="list-group-item">Vestibulum at eros</li>
                    </ul>
                </div>
                <div className="apartment-list-container__item">
                </div>
            </aside>
            <section className="current-apartment-container ">
                <div className="current-apartment-container__item">
                    <div className="current-apartment-container__field">
                        <label className="curretn-apartment-container__field-label">Адрес:</label>
                        <input className="curretn-apartment-container__field-input form-control" type="text"
                            onChange={handleAddressChange}
                            value={apartmentFields.address}
                        />
                    </div>
                </div>
                <div className="current-apartment-container__item">
                    <div className="current-apartment-container__field">
                        <label className="curretn-apartment-container__field-label">Статус:</label>
                        <select className="custom-select" onChange={handleIsVipChange} >
                            <option value="1">VIP</option>
                            <option value="0">Эконом</option>
                        </select>
                    </div>
                </div>
                <div className="current-apartment-container__item">
                    <div className="current-apartment-container__field">
                        <label className="curretn-apartment-container__field-label" >Количество комнат:</label>
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
                        <label className="curretn-apartment-container__field-label">Цена:</label>
                        <input className="curretn-apartment-container__field-input form-control" onChange={handlePriceChange} value={apartmentFields.price} type="text" />
                    </div>
                </div>
                <div className="current-apartment-container__item">
                    <div className="form-group">
                        <button className="btn btn-success w-100" onClick={handleAddApartment}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </section>
        </div>
    )
}