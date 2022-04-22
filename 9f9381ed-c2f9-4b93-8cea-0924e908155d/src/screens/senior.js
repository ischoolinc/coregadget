import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dropdown } from '@fengpu-ischool/ischool-gadges.ui.dropdown';
import { CreditCard } from '@fengpu-ischool/ischool-gadges.ui.credit_card';
import { NumberGrid } from '@fengpu-ischool/ischool-gadges.ui.number-grid';
import { SemesterCreditCard } from '@fengpu-ischool/ischool-gadges.ui.semester_credit_card';
import { ggScope } from '../helper/ggScope';
import { FaGreaterThan, FaCheck, FaTimes, FaAngleLeft, FaAddressBook } from "react-icons/fa"
import { SubCategoryCard } from '@fengpu-ischool/ischool-gadges.ui.sub-category-card';
import { Bulb } from '@fengpu-ischool/ischool-gadges.icon.bulb';
import { Wrench } from '@fengpu-ischool/ischool-gadges.icon.wrench';
import { Study } from '@fengpu-ischool/ischool-gadges.icon.study';
import { Soccer } from '@fengpu-ischool/ischool-gadges.icon.soccer';
import { FaUserAlt } from "react-icons/fa";

import Modal from 'react-modal';

import OneCampusTable from '../components/OneCampusTable';
import OneCampusMobileTable from '../components/OneCampusMobileTable';

const SeniorScoreScreen = (props) => {
    //const commonRankTypes = ['班排名', '科排名', '年排名'];
    const distinctRankTypes = ['班排名', '科排名', '年排名']
    const [distinctRankTypes2, setDistinctRankTypes] = useState([]);//refactoring: replace commonRankTypes with distinctRankTypes

    const [currentSemester, setCurrentSemesterIndex] = useState(0);
    const [currentRankType, setCurrentRankType] = useState(0);
    const [credits, setCredits] = useState([]);
    const [mySemsSubjScore, setMySemsSubjScore] = useState([]);
    const [semsEntryScore, setSemsEntryScore] = useState([]);
    const [student, setStudent] = useState({});
    const [currentRank, setCurrentRank] = useState([]);

    useEffect(() => {

        let distinctRankTypesSet = new Set();

        for (let a in currentRank) {
            //console.log('distinctRankTypesSet.a.rank_type', currentRank[a].rank_type)
            distinctRankTypesSet.add(currentRank[a].rank_type);
        }
        console.log('distinctRankTypesSet', distinctRankTypesSet);

        setDistinctRankTypes(Array.from(distinctRankTypesSet))

    }, [currentRank])

    // 呼叫 Service
    var _connection = null;
    // 判斷傳入參數，是家長或學生，依身分呼叫不同 Contract。
    if (window.gadget._system_position === "parent") {
        _connection = window.gadget.getContract("ischool.exam.parent");
    } else {
        _connection = window.gadget.getContract("ischool.exam.student");
    }

    async function GetRank(schoolYear, semester, setCurrentRank) {

        /*

        matrix item example:
        ----
        batch_id: "5"
        calculation_description: "107 1 計算學期成績排名"
        create_time: "2020-02-06 08:34:11.453816+08"
        detail_id: "54472"
        exam_name: ""
        item_name: "中華文化基本教材"
        item_type: "學期/科目成績"
        level_10: "0"
        level_20: "0"
        level_30: "0"
        level_40: "0"
        level_50: "0"
        level_60: "2"
        level_70: "23"
        level_80: "28"
        level_90: "3"
        level_gte100: "0"
        level_lt10: "0"
        matrix_count: "56"
        matrix_id: "3234"
        name: "蔡梅蓁"
        percentile: "15"
        pr: ""
        rank: "9"
        rank_name: "1年級"
        rank_type: "年排名"
        ref_exam_id: "-1"
        school_year: "107"
        score: "86.70"
        semester: "1"


        */
        await _connection.send({
            service: "_.GetRank",
            body: {
                SchoolYear: schoolYear,
                Semester: semester
            },
            result: function (response, error, http) {
                if (error !== null) {
                    console.log('ranks error', error);
                    return 'err';
                } else {
                    if (response) {
                        //測試結果: 無錯誤例外 {}


                        // let distinctItemTypes = new Set(response.RankMatrix.filter((v) => v.rank_type == '年排名').map((d) => d.item_type));
                        // let distinctItemTypesArray = [...distinctItemTypes.keys()]

                        //item_type1: 學期/科目成績  subjectRanks
                        //item_type2: 學期/分項成績  subCategoryRanks

                        //rank_type:  '班排名', '科排名', '年排名' ...

                        // let distinctRankTypes = new Set(response.RankMatrix.map((d) => d.rank_type));
                        // let distinctRankTypesArray = [...distinctRankTypes.keys()]

                        if (response.hasOwnProperty('RankMatrix')) {
                            console.log('ranks 2', response.RankMatrix.filter(value => {
                                return (value.item_name == "中華文化基本教材") && (value.item_type == "學期/科目成績")

                            }));
                        }
                        // console.log('ranks 2', response.RankMatrix); //.filter((v) => v.rank_type == '年排名').map((d) => d.item_name)
                        // console.log('ranks 2 item type', distinctItemTypesArray);
                        // console.log('ranks 2 rank types ', distinctRankTypesArray);

                        setCurrentRank((response.hasOwnProperty('RankMatrix')) ? response.RankMatrix : []);//

                        // console.log('ranks 2', response.RankMatrix.filter((v) => v.rank_type == '年排名').filter((d) => d.item_name == '體育'));
                        // console.log('ranks 2', response.RankMatrix.filter((v) => v.rank_type == '年排名'));

                        //var ranks = [].concat(response.Course.Semester || []);


                    }
                }
            }
        });


    }

    const [subjectOrder, setSubjectOrder] = useState({ rs: [] });

    const getSubjectsOrder = async () => {
        await _connection.send({
            service: "_.GetSHSubjectsOrder",
            body: {
            },
            result: function (response, error, http) {
                if (error !== null) {
                    console.log('getSubjectsOrder error', error);
                    return 'err';
                } else {
                    if (response) {
                        console.log('detailTransform2 getSubjectsOrder', response);
                        setSubjectOrder(response);
                        console.log('to firebase if the service is not available')

                    }
                }
            }
        });
    }

    useEffect(() => {

        getSubjectsOrder();

        // 讀取排名
        if (currentSemester == 0) {
            setCurrentRank([]);
        } else {
            let cyrrentYear = parseInt(credits[currentSemester - 1].SchoolYear)
            let cyrrentSemester = parseInt(credits[currentSemester - 1].Semester)
            GetRank(cyrrentYear, cyrrentSemester, setCurrentRank);
        }



    }, [currentSemester]);

    const [templateData, setTemplateData] = useState({});
    //option pattern: "110學年度第1學期"
    // const optionParser = (option)=>{
    //     let schoolYear = option.split('學年度第')[0];
    //     let semester = option.split('學年度第').length>1?option.split('學年度第')[1].replace('學期',''):'0';

    //     return {schoolYear, semester};
    // }

    const CommonVerticalMargin = (props) => <div style={{ height: 10 }}></div>

    const bigRadius = 8;
    const styles = {
        footer: {
            height: 100
        }
    }


    useEffect(() => {

        const getGG = async () => {
            let gg = await ggScope('107', '1', setCredits, setMySemsSubjScore, setSemsEntryScore, setStudent);
        }

        getGG();

    }, []);

    const ScoreBoard = (props) => {
        if (props.device == 'web') {

            return (<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f0f5f4', padding: 40, borderRadius: bigRadius }}>
                <div style={{ fontSize: 20, letterSpacing: 1.15, marginBottom: 20, fontWeight: '500' }}>{props.title}</div>

                {<div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                    <CreditCard passedCreditNum={props.credit.S_True_Credit} totalCreditNum={props.credit.S_Total_Credit}></CreditCard>

                    <NumberGrid device={'web'} data={[
                        { 'title': '必修', 'number': props.credit.S_Required },
                        { 'title': '選修', 'number': props.credit.S_Choose },
                        { 'title': '部定必修', 'number': props.credit.S_Required_By_Edu },
                        { 'title': '校訂必修', 'number': props.credit.S_Required_By_School },
                        { 'title': '校訂選修', 'number': props.credit.S_Choose_By_School },
                        { 'title': '實習', 'number': props.credit.S_Internships },
                        { 'title': '專業', 'number': props.studyCredits }
                    ]}></NumberGrid>
                </div>}

            </div>)

        } else {
            return (<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f0f5f4', borderRadius: 8, paddingLeft: 16, paddingRight: 16 }}>

                <CommonVerticalMargin />
                <div style={{ fontWeight: '500', letterSpacing: 1.15, fontSize: 18, color: '#4F4F4F' }}>{'在校期間已修得學分'}</div>


                <CommonVerticalMargin />
                <CreditCard passedCreditNum={props.credit.S_True_Credit} totalCreditNum={props.credit.S_Total_Credit}></CreditCard>
                <CommonVerticalMargin />



                <NumberGrid device={'mobile'} data={[
                    { 'title': '必修', 'number': props.credit.S_Required },
                    { 'title': '選修', 'number': props.credit.S_Choose },
                    { 'title': '部定必修', 'number': props.credit.S_Required_By_Edu },
                    { 'title': '校訂必修', 'number': props.credit.S_Required_By_School },
                    { 'title': '校訂選修', 'number': props.credit.S_Choose_By_School },
                    { 'title': '實習', 'number': props.credit.S_Internships }]}></NumberGrid>
                <CommonVerticalMargin />

                <div>

                </div>


            </div>);
        }

    }

    const OverviewScreen = (props) => {
        const [studyCredits, setStudyCredits] = useState(0);
        const caculateCredit = () => {
            let dataArray = props.mySemsSubjScore.map((scoreData) => {

                let data = scoreData.ScoreInfo.SemesterSubjectScoreInfo.Subject;


                let studyData = data.filter(d => (d.開課分項類別 == '學業') && (d.是否取得學分 == '是'));
                let studyDataCredits = studyData.map(d => Number(d.開課學分數));

                const initialValue = 0;
                const sumWithInitial = studyDataCredits.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                return sumWithInitial;
            })


            const initialValue = 0;
            const sumWithInitial = dataArray.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                initialValue
            );

            setStudyCredits(sumWithInitial);

        }

        useEffect(() => {
            caculateCredit();
        }, [props.mySemsSubjScore]);

        const initialValue = { "S_Total_Credit": 0, "S_True_Credit": 0, "S_Required": 0, "S_Choose": 0, "S_Required_By_Edu": 0, "S_Required_By_School": 0, "S_Choose_By_Edu": 0, "S_Choose_By_School": 0, "S_Internships": 0 };
        const reduceFunction = (previousValue, currentValue) => {
            //previousValue + currentValue
            return {
                "S_Total_Credit": previousValue.S_Total_Credit + currentValue.S_Total_Credit,
                "S_True_Credit": previousValue.S_True_Credit + currentValue.S_True_Credit,
                "S_Required": previousValue.S_Required + currentValue.S_Required,
                "S_Choose": previousValue.S_Choose + currentValue.S_Choose,
                "S_Required_By_Edu": previousValue.S_Required_By_Edu + currentValue.S_Required_By_Edu,
                "S_Required_By_School": previousValue.S_Required_By_School + currentValue.S_Required_By_School,
                "S_Choose_By_Edu": previousValue.S_Choose_By_Edu + currentValue.S_Choose_By_Edu,
                "S_Choose_By_School": previousValue.S_Choose_By_School + currentValue.S_Choose_By_School,
                "S_Internships": previousValue.S_Internships + currentValue.S_Internships
            }

        }

        if (props.device == 'web') {

            console.log('props.mySemsSubjScore', props.mySemsSubjScore);

            return (
                <div style={{ borderWidth: 1, borderColor: '#F0F5F4', borderRadius: bigRadius, borderStyle: 'solid' }}>
                    {<ScoreBoard device={'web'} studyCredits={studyCredits} credit={props.credits.reduce(reduceFunction, initialValue)}
                        title={'所有已修得學分'} />}

                    <div style={{ marginTop: 40 }}>

                        <div style={{ fontSize: 18, fontWeight: '500', marginLeft: 10, marginBottom: 20 }}>{'各學期修得學分'}</div>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {props.credits.map((value, index) => {

                                return (<div key={`credit_${index}`} style={{ margin: 10 }} onClick={() => {
                                    setCurrentSemesterIndex(index + 1);
                                }}>

                                    <SemesterCreditCard index={`SemesterCreditCard${index.toString()}`} width={184} title={`${value.SchoolYear}學年度第${value.Semester}學期`} get={value.S_True_Credit} total={value.S_Total_Credit}></SemesterCreditCard>
                                </div>)
                            })}
                        </div>

                    </div>
                </div>
            )

        } else {

            return (<>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f0f5f4', borderRadius: 8, paddingLeft: 16, paddingRight: 16 }}>

                    <CommonVerticalMargin />
                    <ScoreBoard device={'mobile'} credit={props.credits.reduce(reduceFunction, initialValue)} studyCredits={studyCredits}
                        title={'所有已修得學分'} />

                </div>




                <CommonVerticalMargin />

                <div style={{ fontSize: 18, fontWeight: '500', marginLeft: 10, marginBottom: 20 }}>{'各學期修得學分'}</div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {props.credits.map((value, index) => {

                        return (<div key={`credit_${index}`} style={{ margin: 10 }} onClick={() => {
                            setCurrentSemesterIndex(index + 1);
                        }}>
                            <SemesterCreditCard index={`SemesterCreditCard${index.toString()}`} width={(props.windowWidth - 80) / 2} title={`${value.SchoolYear}學年度第${value.Semester}學期`} get={value.S_True_Credit} total={value.S_Total_Credit}></SemesterCreditCard>
                        </div>)
                    })}
                </div>

                <CommonVerticalMargin />
                <CommonVerticalMargin />
            </>);


        }



    }

    //<div>{JSON.stringify(props.scores.filter((value)=>(value.SchoolYear==props.semesters[currentSemester-1].SchoolYear)&&(value.Semester==props.semesters[currentSemester-1].Semester)))}</div>


    /*

    科目成績會用這些原始成績、學年調整成績、擇優採計成績、補考成績、重修成績，取最高成績

    */
    const getFinalGrade = (rawGrades) => {
        let allNotAssign = (rawGrades.原始成績 == '' && rawGrades.學年調整成績 == '' && rawGrades.擇優採計成績 == '' && rawGrades.補考成績 == '' && rawGrades.重修成績 == '');
        let annotation = { icon: '', type: '' };
        let maxGrade = Math.max(Number(rawGrades.原始成績), Number(rawGrades.學年調整成績), Number(rawGrades.擇優採計成績), Number(rawGrades.補考成績), Number(rawGrades.重修成績)).toFixed(2);
        if (allNotAssign) {
            // no-op for annotation
        } else {
            if (Number(rawGrades.補考成績).toFixed(2) == maxGrade) {
                annotation = { icon: ' *', type: '補考成績' };
            }
            if (Number(rawGrades.重修成績).toFixed(2) == maxGrade) {
                annotation = { icon: ' /', type: '重修成績' };
            }
        }

        return { grade: allNotAssign ? '--' : maxGrade, annotation };

    }
    const SemesterScreen = (props) => {

        const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(-1);
        const CategoryEnum = Object.freeze({ "study": '學業', "master": '專業科目', "internship": '實習科目', "sport": '體育' });
        const CategoryList = [CategoryEnum.study, CategoryEnum.master, CategoryEnum.internship, CategoryEnum.sport];

        //.分項 === "學業"
        //.分項 === "實習科目"
        const [dataInstallDetail, setDataInstallDetail] = useState([]);

        const subCategoryList = [
            {
                title: '學業成績',
                key: '學業'
            },
            {
                title: '專業科目',
                key: '專業科目'
            },
            {
                title: '實習科目',
                key: '實習科目'
            },
            {
                title: '體育成績',
                key: '體育'
            }
        ];

        /*
                 不計學分: "否"
                 不需評分: "否"
                 修課必選修: "必修"
                 修課校部訂: "部訂"
                 原始成績: "80.10"
                 學年調整成績: ""
                 擇優採計成績: ""
                 是否取得學分: "是"
                 科目: "國文"
                 科目級別: "1"
                 補考成績: ""
                 重修成績: ""
                 開課分項類別: "學業"
                 開課學分數: "3"
               */
        const detailTransform = (rawData) => {

            return rawData.map((value) => {

                let cRank = currentRank.filter(crt => {
                    if ((crt.item_name == value.科目) && (crt.rank_type == distinctRankTypes[currentRankType]) && (crt.rank_type == '類別2排名')) {
                        //console.log('類別2排名:', crt.rank_type, distinctRankTypes[currentRankType], crt.item_type);
                    }

                    return ((crt.item_name == value.科目) && (crt.item_type == "學期/科目成績") && (crt.rank_type == distinctRankTypes[currentRankType]))
                });


                let bestGrade = getFinalGrade(value).grade + '' + getFinalGrade(value).annotation.icon;
                return {
                    subject: { value: value.科目, active: (value.不計學分 == '否') ? true : false },
                    grade: { value: value.科目級別, active: (value.不計學分 == '否') ? true : false },
                    credit: { value: value.開課學分數, active: (value.不計學分 == '否') ? true : false },
                    source: { value: (value.修課校部訂 == '部訂') ? '部定' : value.修課校部訂, active: (value.不計學分 == '否') ? true : false },
                    required: { value: value.修課必選修, active: (value.不計學分 == '否') ? true : false },
                    score: { value: bestGrade, active: (value.不計學分 == '否') ? true : false },
                    rawscore: { value: (value.原始成績 == '') ? '--' : value.原始成績, active: (value.不計學分 == '否') ? true : false },
                    truecredit: { value: (value.是否取得學分 == '是') ? true : false, active: (value.不計學分 == '否') ? true : false },
                    rank: { value: (cRank.length > 0) ? cRank[0].rank : '--', active: (value.不計學分 == '否') ? true : false },
                    count: (value.不計學分 == '否') ? true : false,
                    setModalOpen: {
                        isModalVisible: props.setIsModalNow,
                        setTemplateData: props.setTData,
                        data: {
                            category: {
                                value: ((subCategoryList.filter((v) => v.key == value.開課分項類別)).length > 0) ? subCategoryList.filter((v) => {
                                    //console.log('wdfadf ', v.key, value.開課分項類別)
                                    return v.key == value.開課分項類別
                                })[0].title : ''
                            },
                            subject: { value: value.科目, active: (value.不計學分 == '否') ? true : false },
                            grade: { value: value.科目級別, active: (value.不計學分 == '否') ? true : false },
                            credit: { value: value.開課學分數, active: (value.不計學分 == '否') ? true : false },
                            source: { value: value.修課校部訂, active: (value.不計學分 == '否') ? true : false },
                            required: { value: value.修課必選修, active: (value.不計學分 == '否') ? true : false },
                            score: { value: bestGrade, active: (value.不計學分 == '否') ? true : false },
                            rawscore: { value: (value.原始成績 == '') ? '--' : value.原始成績, active: (value.不計學分 == '否') ? true : false },
                            truecredit: { value: (value.是否取得學分 == '是') ? true : false, active: (value.不計學分 == '否') ? true : false },
                            count: (value.不計學分 == '否') ? true : false


                        }
                    }
                }
            })
        }

        const orderByAPI = (rawData) => {

            let transformedDataSubjectSet_A = rawData.map(tds => {
                return tds.subject.value;
            })
            let apiDefinedSubjectOrder_B = subjectOrder.rs.map((adso => {
                return adso.subject_name
            }))


            let AminusB = transformedDataSubjectSet_A.filter(af => {
                return !apiDefinedSubjectOrder_B.includes(af);
            }).sort((x, y) => x.localeCompare(y, 'zh-TW'));
            let AintersectB = apiDefinedSubjectOrder_B.filter(af => {
                return transformedDataSubjectSet_A.includes(af);
            });

            //arr.sort((x,y)=>x.localeCompare(y, 'zh-TW'))
            console.log('detailTransform2-a', subjectOrder, transformedDataSubjectSet_A, apiDefinedSubjectOrder_B);
            console.log('detailTransform2-1', AintersectB, AminusB, [...AintersectB, ...AminusB]);

            let orderedSubjectNames = [...AintersectB, ...AminusB];
            let orderedData = orderedSubjectNames.map(subject_name => {
                return rawData.filter(r => r.subject.value == subject_name)[0]
            });

            console.log('detailTransform3', rawData, orderedData);

            return orderedData;
        }

        //(detail) => setDataInstallDetail(detailTransform(detail));
        const [studyCredits, setStudyCredits] = useState(0);
        useEffect(() => {
            console.log('studyData123 currentSemester', currentSemester.toString())
            if (activeSubCategoryIndex == -1) {
                let data = props.mySemsSubjScore[currentSemester - 1].ScoreInfo.SemesterSubjectScoreInfo.Subject;
                console.log('value.開課分項類別1', data);




                let transformedData = detailTransform(data);
                console.log('transformedData', transformedData);

                setDataInstallDetail(orderByAPI(transformedData));
                setSubCategoryDataAppDetail([]);

                let studyData = data.filter(d => (d.開課分項類別 == '學業') && (d.是否取得學分 == '是'));
                let studyDataCredits = studyData.map(d => Number(d.開課學分數));

                const initialValue = 0;
                const sumWithInitial = studyDataCredits.reduce(
                    (previousValue, currentValue) => previousValue + currentValue,
                    initialValue
                );

                console.log('studyData123', studyData, studyDataCredits, sumWithInitial);
                setStudyCredits(sumWithInitial);

            } else {
                let data = props.mySemsSubjScore[currentSemester - 1].ScoreInfo.SemesterSubjectScoreInfo.Subject;
                let filteredData = data.filter((value) => {

                    return value.開課分項類別 == CategoryList[activeSubCategoryIndex]
                })

                let transformedData = detailTransform(filteredData);
                console.log('transformedData', transformedData);
                setDataInstallDetail(orderByAPI(transformedData));
                setSubCategoryDataAppDetail(transformedData);//detailTransform(filteredData));

            }


        }, [props.mySemsSubjScore, currentSemester, activeSubCategoryIndex, subjectOrder]);



        //科目名稱	級別	學分	校訂/部定	必修/選修	成績	原始成績	取得學分
        const columnsInstallDetail = React.useMemo(
            () => [
                {
                    Header: '科目名稱',
                    accessor: 'subject', // accessor is the "key" in the data
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '級別',
                    accessor: 'grade',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '學分',
                    accessor: 'credit',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '校訂/部定',
                    accessor: 'source',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '必修/選修',
                    accessor: 'required',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '成績',
                    accessor: 'score',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '原始成績',
                    accessor: 'rawscore',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '取得學分',
                    accessor: 'truecredit',
                    Cell: (props) => ((props.value.active) ? (props.value.value) ? <FaCheck style={{ color: '#ADC57C' }} /> : <FaTimes style={{ color: '#D87A89' }} /> : <div style={{ color: '#aaaaaa' }}>{'不列入'}</div>)
                }
            ],
            []
        );

        const columnsInstallDetailWithRank = React.useMemo(
            () => [
                {
                    Header: '科目名稱',
                    accessor: 'subject', // accessor is the "key" in the data
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '級別',
                    accessor: 'grade',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '學分',
                    accessor: 'credit',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '校訂/部定',
                    accessor: 'source',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '必修/選修',
                    accessor: 'required',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '成績',
                    accessor: 'score',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '原始成績',
                    accessor: 'rawscore',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '排名',
                    accessor: 'rank',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '取得學分',
                    accessor: 'truecredit',
                    Cell: (props) => ((props.value.active) ? (props.value.value) ? <FaCheck style={{ color: '#ADC57C' }} /> : <FaTimes style={{ color: '#D87A89' }} /> : <div style={{ color: '#aaaaaa' }}>{'不列入'}</div>)
                }
            ],
            []
        );

        //currentRank.length == 0
        const columnsAppDetail = React.useMemo(
            () => [
                {
                    Header: '科目名稱',
                    accessor: 'subject', // accessor is the "key" in the data
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '級別',
                    accessor: 'grade',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '學分',
                    accessor: 'credit',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '成績',
                    accessor: 'score',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '詳細',
                    accessor: 'setModalOpen',
                    Cell: (props) => (<div onClick={() => {
                        props.value.isModalVisible(true);
                        console.log('props.value.data', props.value.data);
                        props.value.setTemplateData(props.value.data);
                    }}><FaGreaterThan style={{ fontSize: 12, fontWeight: '100' }} /></div>)
                }
            ],
            []
        );

        const columnsAppDetailWithRank = React.useMemo(
            () => [
                {
                    Header: '科目名稱',
                    accessor: 'subject', // accessor is the "key" in the data
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '級別',
                    accessor: 'grade',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '學分',
                    accessor: 'credit',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '成績',
                    accessor: 'score',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '排名',
                    accessor: 'rank',
                    Cell: (props) => ((props.value.active) ? <div>{props.value.value}</div> : <div style={{ color: '#aaaaaa' }}>{props.value.value}</div>)
                },
                {
                    Header: '詳細',
                    accessor: 'setModalOpen',
                    Cell: (props) => (<div onClick={() => {
                        props.value.isModalVisible(true);
                        console.log('props.value.data', props.value.data);
                        props.value.setTemplateData(props.value.data);
                    }}><FaGreaterThan style={{ fontSize: 12, fontWeight: '100' }} /></div>)
                }
            ],
            []
        );

        //const [height, setHeight] = useState(null);
        const [ischoolGadgetWiredwidth, setIschoolGadgetWiredwidth] = useState(null);
        const gadgetBlock = useCallback(node => {
            if (node !== null) {
                //setHeight(node.getBoundingClientRect().height);
                setIschoolGadgetWiredwidth(node.getBoundingClientRect().width);
            }
        }, []);


        const [subCategoryDataAppDetail, setSubCategoryDataAppDetail] = useState([]);





        const getCurrentSubjectRank = (sub) => {
            let subRank = currentRank.filter(crt => {
                return (crt.item_name == sub) && (crt.item_type == "學期/分項成績") && (crt.rank_type == distinctRankTypes[currentRankType])
            });
            //console.log('ranks www', subRank);
            if (subRank.length > 0) {
                return subRank[0].rank
            } else {
                return '--'
            }
        }



        return (<div>

            <ScoreBoard device={props.device} credit={props.credits[currentSemester - 1]} title={'本學期學分資訊'} studyCredits={studyCredits} />



            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginTop: 20, marginBottom: 10 }}>
                <div style={{ fontSize: 17, fontWeight: '500', letterSpacing: 2 }}>{'分項成績'}</div>
                {(activeSubCategoryIndex != -1) && <div onClick={() => {
                    setActiveSubCategoryIndex(-1)
                }} style={{ fontSize: 12, fontWeight: '400', color: '#547cb4', marginLeft: 10, textDecoration: 'underline' }}>{'顯示所有分項成績'}</div>}
            </div>

            {<div ref={gadgetBlock} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div key={'學業成績'} style={{ marginTop: 10 }}>
                    {(currentRank.length > 0) ? <SubCategoryCard subject={'學業成績'} rank={getCurrentSubjectRank('學業')} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                        ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "學業"))).length > 0) ?
                            (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "學業")))[0].成績.toString() : '--'
                    } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                        setActiveSubCategoryIndex(activeIndex)
                    }} currentActiveIndex={activeSubCategoryIndex} itemIndex={0}><Study /></SubCategoryCard>
                        : <SubCategoryCard subject={'學業成績'} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                            ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "學業"))).length > 0) ?
                                (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "學業")))[0].成績.toString() : '--'
                        } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                            setActiveSubCategoryIndex(activeIndex)
                        }} currentActiveIndex={activeSubCategoryIndex} itemIndex={0}><Study /></SubCategoryCard>}
                </div>
                <div key={'專業科目'} style={{ marginTop: 10 }}>
                    {(currentRank.length > 0) ? <SubCategoryCard subject={'專業科目'} rank={getCurrentSubjectRank('專業科目')} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                        ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "專業科目"))).length > 0) ?
                            (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "專業科目")))[0].成績.toString() : '--'
                    } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                        setActiveSubCategoryIndex(activeIndex)
                    }} currentActiveIndex={activeSubCategoryIndex} itemIndex={1}><Wrench /></SubCategoryCard>
                        : <SubCategoryCard subject={'專業科目'} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                            ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "專業科目"))).length > 0) ?
                                (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "專業科目")))[0].成績.toString() : '--'
                        } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                            setActiveSubCategoryIndex(activeIndex)
                        }} currentActiveIndex={activeSubCategoryIndex} itemIndex={1}><Wrench /></SubCategoryCard>}
                </div>
                <div key={'實習科目'} style={{ marginTop: 10 }}>
                    {(currentRank.length > 0) ? <SubCategoryCard subject={'實習科目'} rank={getCurrentSubjectRank('實習科目')} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                        ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "實習科目"))).length > 0) ?
                            (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "實習科目")))[0].成績.toString() : '--'
                    } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                        setActiveSubCategoryIndex(activeIndex)
                    }} currentActiveIndex={activeSubCategoryIndex} itemIndex={2}><Bulb /></SubCategoryCard>
                        : <SubCategoryCard subject={'實習科目'} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                            ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "實習科目"))).length > 0) ?
                                (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "實習科目")))[0].成績.toString() : '--'
                        } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                            setActiveSubCategoryIndex(activeIndex)
                        }} currentActiveIndex={activeSubCategoryIndex} itemIndex={2}><Bulb /></SubCategoryCard>}
                </div>
                <div key={'體育成績'} style={{ marginTop: 10 }}>
                    {(currentRank.length > 0) ? <SubCategoryCard subject={'體育成績'} rank={getCurrentSubjectRank('體育')} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                        ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "體育"))).length > 0) ?
                            (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "體育")))[0].成績.toString() : '--'
                    } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                        setActiveSubCategoryIndex(activeIndex)
                    }} currentActiveIndex={activeSubCategoryIndex} itemIndex={3}><Soccer /></SubCategoryCard>
                        : <SubCategoryCard subject={'體育成績'} direction={(props.device == 'web') ? 'raw' : 'raw'} score={
                            ((semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "體育"))).length > 0) ?
                                (semsEntryScore[currentSemester - 1].ScoreInfo.SemesterEntryScore.Entry.filter(value => (value.分項 === "體育")))[0].成績.toString() : '--'
                        } device={props.device} width={(props.device == 'web') ? ((ischoolGadgetWiredwidth - 20) / 4) : ((ischoolGadgetWiredwidth - 10) / 2)} setCurrentActiveIndex={(activeIndex) => {
                            setActiveSubCategoryIndex(activeIndex)
                        }} currentActiveIndex={activeSubCategoryIndex} itemIndex={3}><Soccer /></SubCategoryCard>}
                </div>
            </div>}

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 17, fontWeight: '500', letterSpacing: 2, marginTop: 20, marginBottom: 20 }}>{'科目成績'}</div>
                <div style={{ color: 'gray', fontSize: 14, fontWeight: '500', letterSpacing: 2, marginLeft: 20, marginTop: 20, marginBottom: 20 }}>{'(*:補考, /:重修)'}</div>
            </div>
            {/* {<div>

            總覽/分項  camel naming
                </div>} */}

            {(props.device == 'web') ? <OneCampusTable columns={(currentRank.length == 0) ? columnsInstallDetail : columnsInstallDetailWithRank} data={orderByAPI(dataInstallDetail)} /> :
                (activeSubCategoryIndex == -1) ? subCategoryList.map((value, index) => {
                    let data = props.mySemsSubjScore[currentSemester - 1].ScoreInfo.SemesterSubjectScoreInfo.Subject;
                    let filteredData = data.filter((value) => value.開課分項類別 == CategoryList[index])
                    let transformedData = detailTransform(filteredData);
                    let transformedDataSubjectSet_A = transformedData.map(tds => {
                        return tds.subject.value;
                    })
                    let apiDefinedSubjectOrder_B = subjectOrder.rs.map((adso => {
                        return adso.subject_name
                    }))


                    let AminusB = transformedDataSubjectSet_A.filter(af => {
                        return apiDefinedSubjectOrder_B.includes(af);
                    });
                    let AintersectB = transformedDataSubjectSet_A.filter(af => {
                        return !apiDefinedSubjectOrder_B.includes(af);
                    });

                    console.log('detailTransform2', transformedDataSubjectSet_A, apiDefinedSubjectOrder_B);
                    console.log('detailTransform2-1', AminusB, AintersectB);

                    return (<div key={`subCategoryTable_${index.toString()}`}>
                        <div style={{ marginTop: 20, marginBottom: 10 }}>{value.title}</div>
                        {<OneCampusTable columns={(currentRank.length == 0) ? columnsAppDetail : columnsAppDetailWithRank} data={transformedData} />}
                        {/* {(currentRank.length==0)&&<OneCampusTable columns={columnsAppDetail} data={transformedData} />}
                        {(currentRank.length==0)&&<OneCampusTable columns={columnsAppDetailWithRank} data={transformedData} />} */}
                    </div>);
                }) : <div>
                    <div style={{ marginTop: 20, marginBottom: 10 }}>{subCategoryList[activeSubCategoryIndex].title}</div>
                    <OneCampusTable columns={(currentRank.length == 0) ? columnsAppDetail : columnsAppDetailWithRank} data={subCategoryDataAppDetail} />
                    {/* {(currentRank.length==0)&&<OneCampusTable columns={columnsAppDetail} data={subCategoryDataAppDetail} />}
                    {(currentRank.length>0)&&<OneCampusTable columns={columnsAppDetailWithRank} data={subCategoryDataAppDetail} />} */}
                </div>
            }

        </div>)
    }

    const LableLookUPTable = {
        category: '分項類別',
        subject: '科目名稱',
        grade: '級別',
        credit: '學分',
        source: '校訂/部定',
        required: '必修/選修',
        score: '成績',
        rawscore: '原始成績',
        truecredit: '取得學分'
    }

    const IschoolGadgetFullScreenModal = (props) => {

        const columnsInstallDetail = React.useMemo(
            () => [
                {
                    Header: '',
                    accessor: 'key', // accessor is the "key" in the data
                    Cell: (props) => <div style={{ backgroundColor: '#A0CECB', color: '#394867', height: 48, textAlign: 'center', lineHeight: 3 }}>{LableLookUPTable[props.value]}</div>
                },
                {
                    Header: '',
                    accessor: 'value',
                    Cell: (props) => {
                        if (props.value.active) {
                            return (((typeof props.value.value == "boolean")) ? (props.value.value) ? <div> <FaCheck style={{ color: '#ADC57C' }} /> </div> : <div> <FaTimes style={{ color: '#CD5B6D' }} /> </div> : <div style={{ width: '100%', backgroundColor: 'transparent', color: '#4F4F4F' }}>{props.value.value}</div>)
                        } else {
                            //color: '#aaaaaa' inactive color style
                            return (((typeof props.value.value == "boolean")) ? (props.value.value) ? <div> <div style={{ color: '#aaaaaa' }}>{'不列入'}</div> </div> : <div> <FaTimes style={{ color: '#aaaaaa' }} /> </div> : <div style={{ width: '100%', backgroundColor: 'transparent', color: '#aaaaaa' }}>{props.value.value}</div>)
                        }

                    }
                }
            ],
            []
        );

        const dataInstallDetail = [{
            key: 'a',
            value: '5'
        },
        {
            key: 'a1',
            value: '51'
        },
        {
            key: 'a2',
            value: '52'
        }
        ];

        const V2HTransform = (vData) => {

            let keys = Object.keys(vData);
            let hData = keys.map((k, index) => {
                return {
                    key: k,
                    value: vData[k],
                    active: vData.score.active
                }
            }).filter((v) => v.key != 'count');

            return hData;

        }



        //marginTop: -10, marginLeft: -94,
        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: props.windowHeight, backgroundColor: 'white', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', borderColor: '#C4C4C4', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 1 }}>
                    <div onClick={() => { props.setIsModalNow(false) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'white' }}><FaAngleLeft style={{ fontSize: 30, color: '#A3A3A3', fontWeight: '100' }} /></div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: props.windowWidth - 50, backgroundColor: 'white', height: '100%' }}>
                        <div style={{ fontSize: 23, fontWeight: '500', letterSpacing: 1.5, marginLeft: -50 }}>{'詳細資訊'}</div>
                    </div>
                </div>
                <div style={{ width: '80%', marginTop: 30 }}>
                    <OneCampusMobileTable columns={columnsInstallDetail} data={V2HTransform(props.templateData)} />
                </div>

            </div>)
    }

    const MobileScreen = (props) => {

        const setTData = (data) => {

            props.setTemplateData(data);
            //console.log('setTemplateData std', 'ee')
        }

        //google keyword: metrics google rank/last updated date/weekly download (npm trend)
        //npm yarn
        //import /example

        //abstraction(restriction)
        function setModalClose() {
            props.setIsModalNow(false);
        }

        return ((props.isModalNow) ? <div style={{ width: '100%', height: '100%' }}><IschoolGadgetFullScreenModal templateData={props.templateData} {...props} setModalClose={setModalClose} /></div> :

            <div style={{ width: '100%', height: props.windowHeight, backgroundColor: 'white' }}>

                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', borderColor: '#C4C4C4', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 1, marginBottom: 30 }}>
                    <div onClick={() => { alert('TODO: 問耀明 back to app 的 url'); /*  TODO: 問耀明 back to app 的 url*/ }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'white' }}><FaAngleLeft style={{ fontSize: 30, color: '#A3A3A3', fontWeight: '100' }} /></div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: props.windowWidth - 50, backgroundColor: 'white', height: '100%' }}>
                        <div style={{ fontSize: 23, fontWeight: '500', letterSpacing: 1.5, marginLeft: -50 }}>{'高中評量成績'}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>

                    {<Dropdown currentOption={currentSemester} options={['總覽', ...credits.map((value) => `${value.SchoolYear}學年度第${value.Semester}學期`)]} indexChangeHandler={setCurrentSemesterIndex} />}

                    {(currentRank.length != 0) && <Dropdown currentOption={currentRankType} options={distinctRankTypes} indexChangeHandler={setCurrentRankType} />}

                </div>

                <CommonVerticalMargin />

                {(currentSemester == 0) ? <OverviewScreen device={'mobile'} currentSemester={currentSemester} mySemsSubjScore={mySemsSubjScore} credits={credits} {...props} /> : <SemesterScreen setTData={setTData} setTemplateData={props.setTemplateData} device={'mobile'} mySemsSubjScore={mySemsSubjScore} currentSemester={currentSemester} credits={credits} {...props} />}
                <div style={styles.footer}></div>

                {/* <button onClick={() => { props.setIsModalNow(true) }}>{'open modal!'}</button> */}

            </div>
        );


    }

    const NameBadge = (props) => {
        return (<div
            style={{ 
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: -24, marginLeft: 20,
                height: 48, width: props.width, backgroundColor: '#F0F5F4', borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#A0CECB'
            }}>
            <div style={{marginRight: 10, width: 30, height: 30, borderRadius: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#A0CECB' }}>
                {<FaUserAlt />}
                
            </div>
            <div style={{fontSize: 20, fontWeight: '500'}}>{props.subject}</div>

        </div>);
    }

    const WebScreen = (props) => {
        //return JSX
        return (<div style={{ wodth: '100%', height: '100%', backgroundColor: 'white' }}>

            {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', borderColor: '#C4C4C4', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 1 }}>
                <div onClick={() => { props.setIsModalNow(false) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'white' }}><FaAngleLeft style={{ fontSize: 30, color: '#A3A3A3', fontWeight: '100' }} /></div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: props.windowWidth - 50, backgroundColor: 'white', height: '100%' }}>
                    <div style={{ fontSize: 23, fontWeight: '500', letterSpacing: 1.5, marginLeft: -50 }}>{'高中評量成績'}</div>
                </div>
            </div> */}




            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* <div className="d-none d-md-block fs-36 fw-600 pt-5" style={{ letterSpacing: "6px", marginBottom: 24 }} >{"學期成績"}</div> */}
            </div>


            {/* <Dropdown options={['總覽', ...props.semesters.map((value)=>value.label)]} indexChangeHandler={setCurrentSemesterIndex} /> */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Dropdown currentOption={currentSemester} options={['總覽', ...credits.map((value) => `${value.SchoolYear}學年度第${value.Semester}學期`)]} indexChangeHandler={setCurrentSemesterIndex} />
                {(currentRank.length != 0) && <Dropdown currentOption={currentRankType} options={distinctRankTypes} indexChangeHandler={setCurrentRankType} />}
            </div>

            <div style={{ height: 25 }}></div>
            {(currentSemester == 0) ? <OverviewScreen device={'web'} currentSemester={currentSemester} credits={credits} mySemsSubjScore={mySemsSubjScore} /> : <SemesterScreen device={'web'} mySemsSubjScore={mySemsSubjScore} currentSemester={currentSemester} credits={credits} />}
            <div style={styles.footer}></div>
        </div>);

    }
    //JSX
    //1300 as the threshold of mobile width
    return (<div style={{ height: '100%', width: '100%' }}>
        {(props.windowWidth > 1300) ? <WebScreen {...props} student={student} /> : <MobileScreen style={{ height: '100%', width: '100%' }} student={student} templateData={templateData} setTemplateData={setTemplateData}{...props} />}
    </div>
    );
}
//
export default SeniorScoreScreen;


//app  -> senior -> Web
//property drilling (redux/context API)

//component: UI-reuse
//hook: logic-reuse

//JSX 

//parent => child (props)

//UI = f(state)
//conditional rendering 



/*

 <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>

*/