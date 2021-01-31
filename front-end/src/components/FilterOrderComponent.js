import { useState } from 'react';
import moment from 'moment';
import './filterorder.css';

export const FilterOrderComponent = ({ curentFilter, filterHandleChange }) => {

    let initialFromDate = moment.unix(curentFilter.fromDate).format("YYYY-MM-DD");
    let initialToDate = moment.unix(curentFilter.toDate).format("YYYY-MM-DD");
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(initialToDate);
    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    }
    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    }
    return (<div className="filter-container" >
        <div className="filter-container__item date-from-container">
            <label>заселение от:</label>
            <input type="date" name="trip-start" onChange={handleFromDateChange} value={fromDate} />
        </div>
        <div className="filter-container__item date-to-container">
            <label>заселение по:</label>
            <input type="date" name="trip-start" value={toDate} onChange={handleToDateChange} />
        </div>
        <div className="filter-container__item">
            <button className="btn btn-primary" onClick={() => {
                filterHandleChange({ fromDate, toDate })
            }}>Фильтровать</button>
        </div>
    </div>
    );
}