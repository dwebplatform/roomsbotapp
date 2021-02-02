
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubWayAction } from '../reducers/actions'
import './subway.css';
export const SubWayPage = () => {
    const [subWayFields, setSubWayFields] = useState({
        name: '',
        geo: ''
    });
    const dispatch = useDispatch();
    const { error, success } = useSelector((state) => state.popupInfo);
    const changeSubNameHandler = (e) => {
        setSubWayFields((prevState) => {
            return {
                ...prevState,
                name: e.target.value
            }
        });
    }
    const changeSubWayGeo = (e) => {
        let fullStr = e.target.value;
        setSubWayFields((prevState) => {
            return {
                ...prevState,
                geo: fullStr
            }
        })
    }
    const handleAddSubWay = () => {
        dispatch(addSubWayAction(subWayFields));
    }
    return (<div className="subway-container d-flex">
        <aside className="all-subways">
            <ul className="list-group apartment-list-container__item-list">
                <li className="list-group-item active" >Список метро</li>
            </ul>
        </aside>
        <section className="subway-create-metro" >
            {success && <div className="alert alert-success">{success.msg}</div>}
            {error && <div className="alert alert-danger">{error.msg}</div>}
            <div className="form-group ">
                <input className="form-control " type="text"
                    value={subWayFields.name}
                    onChange={changeSubNameHandler}
                    placeholder="Название метро" />
                <textarea className="form-control  my-3"
                    value={subWayFields.geo}
                    onChange={changeSubWayGeo}
                    placeholder="Введите координаты метро через запятую Например 124,243" />
                <button className="btn btn-success  my-1" onClick={handleAddSubWay}>Сохранить метро</button>
            </div>
        </section>
    </div>);
}