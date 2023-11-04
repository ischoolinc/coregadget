import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import ScrollToTopButton from './ScrollToTopButton';
import { useAppContext } from './AppContext';


const RankDetailImmediately = () => {

    const { appData, setAppDataValues } = useAppContext();

    const studentID = appData.studentID;
    const semester = appData.semester;
    const storageDomain = appData.domain;
    const storageSubject = appData.subject;
    const subjectType = appData.subjectType;
    const storageScore = appData.score;

    const storageOScore = appData.o_score;
    const storagePScore = appData.p_score;
    const storageRScore = appData.r_score;
    const storageHScore = appData.h_score;
    const storageYScore = appData.y_score;
    //const storageSpecifyScore = appData.specify_score;

    const storagePeriod = appData.period;
    const storageCredit = appData.credit;
    const storageEntry = appData.entry;
    const storagePassingStandard = appData.passingStandard;

    const storageLevel = appData.level;
    const storageRequired_by = appData.required_by;
    const storageIs_required = appData.is_required;




    // 班級學生即時組距資料
    const [scoreLevelData, setScoreLevel] = useState([]);

    const [levelImmediatelyList, setLevelImmediatelyList] = useState([{ name: "100", count: 0 }, { name: "90-99", count: 0 }, { name: "80-89", count: 0 }, { name: "70-79", count: 0 }, { name: "60-69", count: 0 }, { name: "<60", count: 0 }]);

    //取長條圖最大值
    const [chartMax, setChartMax] = useState(0);

    const [rowClassName, setRowClassName] = useState('row row-cols-2');

    const position = window.gadget.params.system_position;

    var _connection = window.gadget.getContract("1campus.h.semester.parent");

    if (position === 'student')
        _connection = window.gadget.getContract("1campus.h.semester.student");


    useEffect(() => {
        if (subjectType === 'entry')
            CalculateEntrytBestScoreLevel();
        else {
            CalculateSubjectBestScoreLevel();
            CountRows();
        }
    }, []);


    useEffect(() => {
        ToBarChartImmediately();
    }, [scoreLevelData]);


    function ToBarChartImmediately() {
        const source = {};

        levelImmediatelyList.forEach(v => source[v.name] = v.count);

        if (scoreLevelData.length > 0) {
            scoreLevelData.forEach(data => {
                //擇優成績
                let score = Number(storageScore);
                let position_name = '';

                if (score >= 100)
                    position_name = '100';
                if (score >= 90 && score < 100)
                    position_name = '90-99';
                if (score >= 80 && score < 90)
                    position_name = '80-89';
                if (score >= 70 && score < 80)
                    position_name = '70-79';
                if (score >= 60 && score < 70)
                    position_name = '60-69';
                if (score < 60)
                    position_name = '<60';

                source["100"] = Number(data.level_gte100);
                source["90-99"] = Number(data.level_90);
                source["80-89"] = Number(data.level_80);
                source["70-79"] = Number(data.level_70);
                source["60-69"] = Number(data.level_60);
                source["<60"] = Number(data.under60);

                const merge = Object.getOwnPropertyNames(source).map(v => ({
                    name: v,
                    count: source[v],
                    fill: v === position_name ? '#F8A1A4' : '#498ED0',
                    labelFill: v === position_name ? '#F47378' : '#2196f3',
                }));

                setLevelImmediatelyList(merge);
                setChartMax(Math.ceil(Math.max(...merge.map(c => c.count)) / 4) * 4);

            });
        }
    }

    function CountRows() {


        let scoreCount = 2; //預設只顯示 原始、補考
        if (storageRScore !== '')//重修3
            scoreCount += 1;
        if (storageHScore !== '')//手動調整成績4
            scoreCount += 1;
        if (storageYScore !== '')//學年調整成績5
            scoreCount += 1;

        let className = 'row row-cols-2';
        if (scoreCount === 3)
            className = 'row row-cols-3';
        if (scoreCount === 4)
            className = 'row row-cols-2 row-cols-md-4 row-cols-lg-4';
        if (scoreCount > 4)
            className = 'row row-cols-3 row-cols-md-3 row-cols-lg-5';

        if (subjectType === 'entry')
            className = 'row row-cols-2';


        setRowClassName(className);
    }

    /** 計算 科目 擇優分數 班級組距資料*/
    async function CalculateSubjectBestScoreLevel() {
        await _connection.send({
            service: "_.CalculateSubjectBestScoreLevel",
            body: {
                StudentID: studentID,
                ViewSemester: semester,
                Subject: storageSubject,
            },
            result: function (response, error, http) {
                if (error !== null) {
                    console.log('CalculateSubjectBestScoreLevel Error', error);
                    return 'err';
                } else {
                    if (response) {
                        setScoreLevel([].concat(response.Response.Level || []));
                    }
                }
            }
        });
    }
    /** 計算 分項 擇優分數 班級組距資料*/
    async function CalculateEntrytBestScoreLevel() {
        await _connection.send({
            service: "_.CalculateEntrytBestScoreLevel",
            body: {
                StudentID: studentID,
                ViewSemester: semester,
                Subject: storageSubject,
            },
            result: function (response, error, http) {
                if (error !== null) {
                    console.log('CalculateEntrytBestScoreLevel Error', error);
                    return 'err';
                } else {
                    if (response) {
                        setScoreLevel([].concat(response.Response.Level || []));
                    }
                }
            }
        });
    }


    const handleBackToHomePage = (e) => {
        setAppDataValues({
            isBack: true,
        });
        window.history.go(-1);
    };


    return (
        <div className="App">
            <div className="container px-3 px-sm-4 py-5 ">

                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-back active d-flex justify-content-start px-0" onClick={handleBackToHomePage}>＜返回</button>

                </div>

                <div className='detailBorder row row-cols-1 row-cols-md-2 row-cols-lg-2'>
                    <div className='col'>
                        <div className='d-flex me-auto align-items-center pt-2 ps-2'>
                            <div className='fs-2 text-white me-1 row align-items-center justify-content-center' style={{ width: '80px', height: '80px', background: "#5B9BD5" }}>{storageScore}</div>
                            <div className='text-start'>
                                <div className='fs-4 fw-bold'>{storageDomain === "" || !storageDomain ? "" : storageDomain + "-"}{storageSubject}</div>
                                {subjectType === 'subject' ? <div className=''>級別{storageLevel} {storageRequired_by} {storageIs_required} {storageCredit}學分</div> : ''}
                            </div>
                        </div>

                    </div>
                    <div className='col align-self-end'>
                        <div className='text-end pt-0 pt-md-2 pt-lg-2 pe-2'>

                            {subjectType === 'subject' ? <div className='mt-1'>{storageEntry}分項</div> : ''}
                            {subjectType === 'subject' ? <div className=''>及格標準：{storagePassingStandard === '' ? '未設定' : storagePassingStandard + '分'}</div> : ''}

                            {/* <div className=''>計算排名時間：{data.create_time === '' ? '未計算' : data.create_time}</div> */}
                        </div>
                    </div>
                </div>



                <div className='col-12 col-md-6 col-lg-6 mt-3'>
                    <div className="card card-pass">
                        <div className="card-body">
                            <div className={rowClassName}>
                                <div className='col my-1'>
                                    <div className='d-flex justify-content-center' >
                                        <div className='fs-4-blue text-nowrap'>{storageOScore}</div>
                                        {/* <div className='text-blue text-nowrap align-self-end'>{data.score_mark}</div> */}
                                    </div>
                                    <div className='text-nowrap'>原始成績</div>
                                </div>
                                {subjectType === 'entry' ?
                                    <div className='col my-1'>
                                        <div className='fs-4-blue text-nowrap'>{storageScore === '' ? '-' : storageScore}</div>
                                        <div className='text-nowrap'>擇優成績</div>
                                    </div>
                                    : <div className='col my-1'>
                                        <div className='fs-4-blue text-nowrap'>{storagePScore === '' ? '-' : storagePScore}</div>
                                        <div className='text-nowrap'>補考成績</div>
                                    </div>}

                                {storageRScore === '' || storageRScore === undefined ? '' :
                                    <div className='col my-1'>
                                        <div className='fs-4-blue text-nowrap'>{storageRScore}</div>
                                        <div className='text-nowrap'>重修成績</div>
                                    </div>}

                                {storageHScore === '' || storageHScore === undefined ? '' :
                                    <div className='col my-1'>
                                        <div className='fs-4-blue text-nowrap'>{storageHScore}</div>
                                        <div className=''>手動調整成績</div>
                                    </div>}

                                {storageYScore === '' || storageYScore === undefined ? '' :
                                    <div className='col my-1'>
                                        <div className='fs-4-blue text-nowrap'>{storageYScore}</div>
                                        <div className=''>學年調整成績</div>
                                    </div>}

                            </div>

                        </div>
                    </div>


                </div>


                <>
                    <div className='row align-items-start mt-2'>
                        <div className='col-12 mt-3'>
                            {/* <div className='chartHeightNoShowRank'> */}
                            <ResponsiveContainer height={450} width="100%">
                                <BarChart data={levelImmediatelyList} layout="vertical" margin={{ top: 30, right: 50, left: 10, bottom: 0 }}>
                                    <XAxis dateKey="count" type="number" label={{ value: '人數', position: 'right', offset: 10, dy: -15, fill: '#498ED0' }} axisLine={{ stroke: "#2196f3" }} allowDecimals={false} domain={[0, () => (chartMax === 0) ? 1 : chartMax]} />
                                    <YAxis dataKey="name" type="category" label={{ value: '組距', position: 'insideTopLeft', offset: 0, dy: -15, dx: 40, fill: '#498ED0' }} axisLine={{ stroke: "#2196f3" }} />
                                    <Bar dataKey="count" barSize={25} label={{ position: 'right' }} fillOpacity={0.8} >
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            {/* </div> */}
                            <div className='mt-3'>組距資訊為該班學生擇優成績即時統計。</div>

                        </div>

                    </div>
                </>
                <ScrollToTopButton />
            </div>
        </div>
    );
};

export default RankDetailImmediately;
