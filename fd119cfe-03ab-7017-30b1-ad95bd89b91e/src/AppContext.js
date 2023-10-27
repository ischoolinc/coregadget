import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appData, setAppData] = useState({
        studentID: null,
        examID: null,
        semester: null,
        subject: null,

        domain: null,
        score: null,

        exam_type: null,  //exam //assignment//total
        score_type: 0, //0 subject //1 domain

        total_type:null , //八大領域 //含彈性領域

        currentSemester: '',
        studentList: [],
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
