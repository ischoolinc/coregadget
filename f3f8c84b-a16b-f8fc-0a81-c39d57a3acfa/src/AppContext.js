import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appData, setAppData] = useState({
        studentID: null,
        semester: null,

        subject: null,
        domain: null,
        period:null,
        credit:null,
        score: null,
        o_score:null,
        p_score:null,
        text:null,

        currentSemester: null,
        rankType: null,
        isBack:false,

        subjectType:null,
        selectedSubjectType:0,//0 subject //1 domain

    });

    const setAppDataValues = (data) => {
        setAppData({ ...appData, ...data });
    };

    return (
        <AppContext.Provider value={{ appData, setAppDataValues }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
