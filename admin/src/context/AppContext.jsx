import { createContext, useState, useEffect } from "react";
import socket from "../socket";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currency = '$';

    const calculateAge = (dob) => {

        if (!dob) return '-';

        const birthDate = new Date(dob);

        if (isNaN(birthDate.getTime())) return '-';

        const today = new Date();

        return today.getFullYear() - birthDate.getFullYear();
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const slotDateFormat = (slotDate) => {

        if (!slotDate) return '-';

        const dateArray = slotDate.split('_');

        return (
            dateArray[0] +
            " " +
            months[Number(dateArray[1]) - 1] +
            " " +
            dateArray[2]
        );
    };


    const value = {
    calculateAge,
    slotDateFormat,
    currency
};

return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
);
};

export default AppContextProvider;