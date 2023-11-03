import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appData, setAppData] = useState({

        studentID: null,
        semester: null,
        examID : null,    
        courseID: null,
        rankType: null,
        subject: null,
        subjectType:null,
     
        domain: null,
        period:null,
        credit:null,
        score: null,

        selectedSubjectType:0,//0 subject //1 domain
        
        currentSemester: null,
        isBack:false,
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
