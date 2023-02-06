import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const RankDetail = () => {

	const studentID = sessionStorage.getItem('StudentID');
	const examID = sessionStorage.getItem('ExamID');
	const semester = sessionStorage.getItem('Semester');
	const courseID = sessionStorage.getItem('CourseID');
	const defaultRankType = sessionStorage.getItem('RankType');
	const storageSubject = sessionStorage.getItem('Subject');
	const passingStandard = sessionStorage.getItem('PassingStandard');

	// 取得 學生成績與排名資料
	const [studentSubjectData, setStudentSubjectData] = useState([]);

	//所選的排名類別
	const [selectedRankType, setViewRankType] = useState("");

	//所有的排名類別清單
	const [rankTypeList, setRankTypeList] = useState([]);

	//長條圖
	const [levelList, setLevelList] = useState([{ name: "100", count: 0 }, { name: "90-99", count: 0 }, { name: "80-89", count: 0 }, { name: "70-79", count: 0 }, { name: "60-69", count: 0 }, { name: "<60", count: 0 }]);

	//取長條圖最大值
	const [chartMax, setChartMax] = useState(0);

	//取長條圖height
	const [chartHeight, setChartHeight] = useState('chartHeightNoShowRank');

	// 該校設定 不顯示排名(true:不顯示，false:顯示) (desktop設定需要同時更新才可生效)
	const [showNoRankSetting, setShowNoRankSetting] = useState(true);


	const position = window.gadget.params.system_position;

	var _connection = window.gadget.getContract("1campus.h.exam.parent");

	if (position === 'student')
		_connection = window.gadget.getContract("1campus.h.exam.student");



	useEffect(() => {
		GetRankDetailPageInfo();
		GetViewSetting();
	}, []);

	useEffect(() => {
		GetChartHeight();
	}, [showNoRankSetting]);

	useEffect(() => {
		GetRankTypeList();
	}, [studentSubjectData]);


	useEffect(() => {
		ToBarChart();
	}, [selectedRankType]);


	function ToBarChart() {
		const source = {};

		levelList.forEach(v => source[v.name] = v.count);

		if (studentSubjectData.length > 0) {
			studentSubjectData.forEach(data => {
				//console.log('studentSubjectData', studentSubjectData);
				if (data.rank_type === selectedRankType) //所選的排名類別
				{
					//console.log('data', data);
					source["100"] = Number(data.level_gte100);
					source["90-99"] = Number(data.level_90);
					source["80-89"] = Number(data.level_80);
					source["70-79"] = Number(data.level_70);
					source["60-69"] = Number(data.level_60);
					source["<60"] = Number(data.under60);

					const merge = Object.getOwnPropertyNames(source).map(v => ({ name: v, count: source[v] }));

					setLevelList(merge);
					setChartMax(Math.ceil(Math.max(...merge.map(c => c.count)) / 4) * 4);
				}
			});
		}
	}

	function GetRankTypeList() {
		const typeList = [];
		if (studentSubjectData.length > 0)
			studentSubjectData.forEach(data => {
				if (data.rank_type !== '')
					typeList.push(data.rank_type)
				if (data.rank_type === defaultRankType)
					setViewRankType(defaultRankType);
			});
		setRankTypeList(typeList);
	}

	function GetChartHeight() {
		if (showNoRankSetting) //不顯示排名
			setChartHeight('chartHeightNoShowRank');
		else
			setChartHeight('chartHeightShowRank');
	}



	// 取得該課程之評量之排名
	async function GetRankDetailPageInfo() {
		await _connection.send({
			service: "_.GetRankDetailPageInfo",
			body: {
				StudentID: studentID,
				ViewSemester: semester,
				ExamID: examID,
				Subject: storageSubject,
				CourseID: courseID
			},
			result: function (response, error, http) {
				if (error !== null) {
					console.log('GetRankDetailPageInfoError', error);
					return 'err';
				} else {
					if (response) {
						setStudentSubjectData([].concat(response.RankMatrix || []));
						//console.log('GetRankDetailPageInfo', [].concat(response.RankMatrix || []));
					}
				}
			}
		});
	}

	// 取得顯示 或不顯示排名 
	async function GetViewSetting() {
		await _connection.send({
			service: "_.GetViewSetting",
			body: {},
			result: function (response, error, http) {
				if (error !== null) {
					console.log('GetViewSettingError', error);
					return 'err';
				} else {
					if (response) {
						let isShowRank = (response.Setting.show_no_rank.toLowerCase() === 'true')
						setShowNoRankSetting(isShowRank);
					}
				}
			}
		});
	}


	const handleChangeViewRank = (e) => {
		setViewRankType(e.target.value);
		sessionStorage.setItem('RankType', e.target.value);
	};


	const handleBackToHomePage = (e) => {
		// 按下去的時候才存
		window.history.go(-1);
		sessionStorage.setItem('IsBack', 't');
		//sessionStorage.setItem('RankType', selectedRankType);
		// console.log('The link was clicked.');
	};


	// 手動重新整理保留原本畫面
	window.onunload = function () {
		//sessionStorage.clear();
		sessionStorage.setItem('StudentID', studentID);
		sessionStorage.setItem('ExamID', examID);
		sessionStorage.setItem('RankType', selectedRankType);
		sessionStorage.setItem('CourseID', courseID);
		sessionStorage.setItem('Semester', semester);
		sessionStorage.setItem('Subject', storageSubject);
		sessionStorage.setItem('PassingStandard', passingStandard);
	}




	const handleManual = (e) => {
		// alert(text);
	};

	const text = "【五標】\n" +
		"頂標：該項目前25%考生成績的平均分數\n" +
		"高標：該項目前50%考生成績的平均分數\n" +
		"均標：該項目全體考生成績的平均分數\n" +
		"低標：該項目後50%考生成績的平均分數\n" +
		"底標：該項目後25%考生成績的平均分數\n\n" +
		"【新五標】\n" +
		"新頂標：該項目成績位於第88百分位數之考生分數\n" +
		"新前標：該項目成績位於第75百分位數之考生分數\n" +
		"新均標：該項目成績位於第50百分位數之考生分數\n" +
		"新後標：該項目成績位於第25百分位數之考生分數\n" +
		"新底標：該項目成績位於第12百分位數之考生分數"

	return (
		<div className="App">
			<div className="container px-3 px-sm-4 py-5 ">

				<div class="d-flex justify-content-between">
					<button type="button" className="btn btn-back active d-flex justify-content-start px-0" onClick={handleBackToHomePage}>＜返回</button>
					{/* <OverlayTrigger key='' placement='left' containerPadding={100} overlay={<Tooltip id='0'>{text}</Tooltip>}> */}
					<OverlayTrigger key='' placement='bottom' containerPadding={30} overlay={<Popover id='popover-contained'>
						<Popover.Header as="h3">五標說明</Popover.Header>
						<Popover.Body>
							<strong>【五標】</strong> <br />
							頂標：該項目前25%考生成績的平均分數<br />
							高標：該項目前50%考生成績的平均分數<br />
							均標：該項目全體考生成績的平均分數<br />
							低標：該項目後50%考生成績的平均分數<br />
							底標：該項目後25%考生成績的平均分數<br />
							<strong>【新五標】</strong> <br />
							新頂標：該項目成績位於第88百分位數之考生分數<br />
							新前標：該項目成績位於第75百分位數之考生分數<br />
							新均標：該項目成績位於第50百分位數之考生分數<br />
							新後標：該項目成績位於第25百分位數之考生分數<br />
							新底標：該項目成績位於第12百分位數之考生分數
						</Popover.Body>
					</Popover>}>
						<button type="button" className="btn btn-back active d-flex justify-content-start me-2" onClick={handleManual}>五標說明</button>
					</OverlayTrigger>

				</div>


				{/* <div className='fs-2 text-white me-1 row align-items-center justify-content-center' style={{ width: '100%', height: '1px', background: "#5B9BD5" }}></div> */}

				{studentSubjectData.map((data) => {
					if (data.rank_type === selectedRankType)
						return <div className='detailBorder row row row-cols-1 row-cols-md-2 row-cols-lg-2'>
							<div className='col'>
								<div className='d-flex me-auto p-2 align-items-center'>
									<div className='fs-2 text-white me-1 row align-items-center justify-content-center' style={{ width: '80px', height: '80px', background: "#5B9BD5" }}>{data.subject === '加權平均' || data.subject === '平均' ? Math.round(Number(data.score) * 100) / 100 : data.score}</div>
									<div className='fs-4 fw-bold'>{data.domain === "" ? "" : data.domain + "-"}{data.subject}</div>
								</div>
							</div>

							<div className='col'>
								<div className='justify-content-end'>
									<div className='d-flex justify-content-end text-end'>及格標準：{passingStandard}分</div>
									<div className='d-flex justify-content-end text-end'>計算排名時間：{data.create_time}</div>
								</div>
							</div>
						</div>
				})}


				{[].concat(rankTypeList || []).length < 1 ? <div className='fs-4'>無排名資料</div> :
					<>
						<div className='d-flex align-items-center mb-3'>
							<div className="col-12 col-md-6 col-lg-6 my-2">
								<select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>
									{rankTypeList.map((rankType, index) => {
										return <option key={index} value={rankType}>
											{rankType}</option>
									})}
								</select>
							</div>
						</div>

						<div className='row align-items-start mt-3'>
							<div className='col-12 col-md-6 col-lg-6'>

								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									{studentSubjectData.map((data) => {
										if (data.rank_type === selectedRankType)
											if (showNoRankSetting) //true: 不顯示 false:顯示
												return <tbody style={{ borderTop: '4px solid #fff' }}>
													<tr>
														<td className='w-50' style={{ background: '#BDD7EE' }}>標準差</td>
														<td style={{ background: '#DEEBF7' }}>{data.std_dev_pop === '' ? '' : Math.round(data.std_dev_pop * 100) / 100}</td>
													</tr>
												</tbody>
											else

												return <tbody style={{ borderTop: '4px solid #fff' }}>
													<tr>
														<td style={{ background: '#BDD7EE' }}>名次/母數</td>
														<td style={{ background: '#DEEBF7' }}>{data.rank}/{data.matrix_count}</td>
													</tr>
													<tr>
														<td style={{ background: '#BDD7EE' }}>PR</td>
														<td style={{ background: '#DEEBF7' }}>{data.pr}</td>
													</tr>
													<tr>
														<td style={{ background: '#BDD7EE' }}>百分比</td>
														<td style={{ background: '#DEEBF7' }}>{data.percentile}</td>
													</tr>

													<tr>
														<td className='w-50' style={{ background: '#BDD7EE' }}>標準差</td>
														<td style={{ background: '#DEEBF7' }}>{data.std_dev_pop === '' ? '' : Math.round(data.std_dev_pop * 100) / 100}</td>
													</tr>
												</tbody>

									})}
								</table>

								{/* <div className='d-flex justify-content-center align-items-center'>
									<div className='me-1 p-0' style={{ width: '12px', height: '12px', background: "#5B9BD5" }}></div>
									<div>級距</div>
								</div> */}

								<div className={chartHeight} >
									<ResponsiveContainer width="100%" height="100%">
										{/* <BarChart margin={{ top: 20, right: 30, bottom: 5, left: 0 }} data={levelList} > */}
										<BarChart margin={{ top: 40, right: 50, bottom: 0, left: 0 }} data={levelList} >
											<XAxis dataKey="name" label={{ value: '組距', position: 'right', offset: 10, dy: -15, fill: '#498ED0' }} />
											<YAxis dateKey="count" label={{ value: '人數', position: 'insideTopLeft', offset: 0, dy: -25, dx: 35, fill: '#498ED0' }} type="number" allowDecimals={false} domain={[0, () => (chartMax === 0) ? 1 : chartMax]} />
											<Bar dataKey="count" fill="#498ED0" barSize={'30%'} label={{ position: 'top', fill: '#2196f3' }} fillOpacity={0.8} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>

							{studentSubjectData.map((data) => {
								if (data.rank_type === selectedRankType)
									return <div className='col-12 col-md-6 col-lg-6'>
										<table className="table table-bordered mt-1" style={{ border: '1px solid #fff' }}>
											<thead>
												<tr style={{ background: '#5B9BD5' }}>
													<th colspan="2">五標</th>
												</tr>
											</thead>
											<tbody style={{ borderTop: '4px solid #fff' }}>
												<tr style={{ background: '#D2DEEF' }}>
													<td className='w-50'>頂標</td>
													<td>{Math.round(data.avg_top_25 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#EAEFF7' }}>
													<td>高標</td>
													<td>{Math.round(data.avg_top_50 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#D2DEEF' }}>
													<td>均標</td>
													<td>{Math.round(data.avg * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#EAEFF7' }}>
													<td>低標</td>
													<td>{Math.round(data.avg_bottom_50 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#D2DEEF' }}>
													<td>底標</td>
													<td>{Math.round(data.avg_bottom_25 * 100) / 100}</td>
												</tr>
											</tbody>
										</table>

										<table className="table table-bordered mt-2" style={{ border: '1px solid #fff' }}>
											<thead>
												<tr style={{ background: '#5B9BD5' }}>
													<th colspan="2">新五標</th>
												</tr>
											</thead>
											<tbody style={{ borderTop: '4px solid #fff' }}>
												<tr style={{ background: '#D2DEEF' }}>
													<td className='w-50'>新頂標</td>
													<td>{data.pr_88 === '' ? '' : Math.round(data.pr_88 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#EAEFF7' }}>
													<td>新前標</td>
													<td>{data.pr_75 === '' ? '' : Math.round(data.pr_75 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#D2DEEF' }}>
													<td>新均標</td>
													<td>{data.pr_50 === '' ? '' : Math.round(data.pr_50 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#EAEFF7' }}>
													<td>新後標</td>
													<td>{data.pr_25 === '' ? '' : Math.round(data.pr_25 * 100) / 100}</td>
												</tr>
												<tr style={{ background: '#D2DEEF' }}>
													<td>新底標</td>
													<td>{data.pr_12 === '' ? '' : Math.round(data.pr_12 * 100) / 100}</td>
												</tr>
											</tbody>
										</table>
									</div>
							})}

						</div>
					</>
				}
			</div>
		</div>
	);
};

export default RankDetail;
