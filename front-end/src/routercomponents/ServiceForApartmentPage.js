
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAction,updateServiceNameAction } from '../reducers/actions'
import './subway.css';


export const ServiceForApartmentPage = () => {
   
    const dispatch = useDispatch();
    const [servicesName, setServicesName] = useState('');
    const handleServicesNameChange=(e)=>{
        if(e.target.value){
            setServicesName(e.target.value);
        }
    }
    const handleAddService=()=>{
    }
    
    const { data: allServices, error, loading } = useSelector((state) => state.services);
    
    const [curServiceId, setCurServiceId] = useState(null);
    const [chosenServiceName, setChosenServiceName] = useState('');

    useEffect(()=>{
        dispatch(getAllServiceAction());
    },[]);

    const handleCurentServiceChoose=(id,name)=>{
        setCurServiceId(id);
        setChosenServiceName(name);
    }

    const handleBlurChange=()=>{
        if(curServiceId){
            dispatch(updateServiceNameAction(curServiceId,chosenServiceName));
        }
        setCurServiceId(null);

    }
    return (<div className="subway-container d-flex">
        <aside className="all-subways">
            <ul className="list-group apartment-list-container__item-list">
                <li className="list-group-item active">Список услуг</li>
                {(allServices && allServices.length)?(
                    allServices.map((item)=>{
                        if(curServiceId ==item.id){
                            return (<li
                             key={item.id} className="list-group-item active"><input 
                             type="text" 
                              onBlur={()=>handleBlurChange()}
                             className="form-control" 
                                value={chosenServiceName}
                                onChange={(e)=>setChosenServiceName(e.target.value)}
                             /></li>)
                        }

                        return <li className="list-group-item"
                            onClick={()=>handleCurentServiceChoose(item.id, item.name)}
                         key={item.id}>{item.name}  </li>
                    })
                    ):null}
            </ul>
        </aside>
        <section className="subway-create-metro" >
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