import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";


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


	function ToBarChart() {
		const source = {};

		levelList.forEach(v => source[v.name] = v.count);

		if (studentSubjectData.length > 0) {
			studentSubjectData.forEach(data => {
				//rankTypeSource.push(matrix.rank_type);
				console.log('studentSubjectData', studentSubjectData);
				if (data.rank_type === selectedRankType) //所選的排名類別
				{
					console.log('data', data);
					source["100"] = data.level_gte100;
					source["90-99"] = data.level_90;
					source["80-89"] = data.level_80;
					source["70-79"] = data.level_70;
					source["60-69"] = data.level_60;
					source["<60"] = data.under60;

					const merge = Object.getOwnPropertyNames(source).map(v => ({ name: v, count: source[v] }));

					setLevelList(merge);
					setChartMax(Math.ceil(Math.max(...merge.map(c => c.count)) / 4) * 4);
				}
			});

		}


	}

	//JS 四捨五入
	// Math.round(18.62645 * 10) / 10     // 18.6
	// Math.round(18.62645 * 100) / 100   // 18.63
	// Math.round(18.62645 * 1000) / 1000 // 18.626

	//table
	//https://bootstrap5.hexschool.com/docs/5.0/content/tables/

	//不要一直跑啊= =
	useEffect(() => {
		GetRankDetailPageInfo();
		console.log('GetRankDetailPageInfo', '123');
	}, []);

	useEffect(() => {
		GetRankTypeList();
		console.log('GetRankTypeList', '123');
	}, [studentSubjectData]);


	useEffect(() => {
		ToBarChart();
		//debugger;
	}, [selectedRankType]);


	function GetRankTypeList() {
		const typeList = [];
		if (studentSubjectData.length > 0)
			studentSubjectData.forEach(data => {
				typeList.push(data.rank_type)
				if (data.rank_type === defaultRankType)
					setViewRankType(defaultRankType);
			});
		setRankTypeList(typeList);
		console.log(typeList);
	}


	var _connection = window.gadget.getContract("1campus.exam.parent");

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
					console.log('GetRankDetailPageInfo', error);
					return 'err';
				} else {
					if (response) {
						setStudentSubjectData([].concat(response.RankMatrix || []));
						console.log('GetRankDetailPageInfo', [].concat(response.RankMatrix || []));
						//GetRankTypeList();
					}
				}
			}
		});
	}

	const handleChangeViewRank = (e) => {
		setViewRankType(e.target.value);
	};


	const handleBackToHomePage = (e) => {
		window.history.go(-1);

		console.log('The link was clicked.');
	};

	const handleHistoryBack = (e) => {
		window.history.back();
		console.log('The link was clicked.');
	};

	const handleMe = (e) => {
		alert("Hello\nHow are you?");
	};

	return (
		<div className="App">
			<div className="container px-3 px-sm-4 py-5 ">

			<div class="d-flex justify-content-between">

			<button type="button" className="btn btn-back active d-flex justify-content-start px-0" onClick={handleBackToHomePage}>＜返回</button>
			<button type="button" className="btn btn-back active d-flex justify-content-start me-2" onClick={handleMe}>五標說明</button>
			</div>
			<div className='fs-2 text-white me-1 row align-items-center justify-content-center' style={{ width: '100%', height: '1px', background: "#5B9BD5" }}></div>
				{/* <button onClick={handleBackToHomePage}>window.history.go(-1)</button>
				<button onClick={handleHistoryBack}>window.history.back()</button> */}
				{studentSubjectData.map((data) => {
					if (data.rank_type === defaultRankType)
						return <div className='d-flex'>
							<div className='d-flex me-auto p-2 align-items-center'>
								<div className='fs-2 text-white me-1 row align-items-center justify-content-center' style={{ width: '80px', height: '80px', background: "#5B9BD5" }}>{studentSubjectData.score}50</div>
								<div className='fs-4 fw-bold'>{data.domain === "" ? "" : data.domain + "-"}{data.subject}</div>
							</div>
							<div className='justify-content-end'>
								<div className='d-flex justify-content-end'>及格標準：{passingStandard}分</div>
								<div className='d-flex justify-content-end'>計算排名時間：{data.create_time}</div>
							</div>
						</div>
				})}
				<div className='d-flex align-items-center mb-3'>
					<div className="col-12 col-md-6 col-lg-6 my-2">
						<select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>
							{/* <option value="Y" key="Y">(選擇排名類別)</option> */}
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

							<tbody style={{ borderTop: '4px solid #fff' }}>
								<tr>
									<td style={{ background: '#BDD7EE' }}>名次/母數</td>
									<td style={{ background: '#DEEBF7' }}>20</td>
								</tr>
								<tr>
									<td style={{ background: '#BDD7EE' }}>PR</td>
									<td style={{ background: '#DEEBF7' }}>98</td>
								</tr>
								<tr>
									<td style={{ background: '#BDD7EE' }}>百分比</td>
									<td style={{ background: '#DEEBF7' }}>82</td>
								</tr>
								<tr>
									<td className='w-50' style={{ background: '#BDD7EE' }}>標準差</td>
									<td style={{ background: '#DEEBF7' }}>30.5</td>
								</tr>
							</tbody>
						</table>

						<div className='d-flex justify-content-center align-items-center'><div className='me-1 p-0' style={{ width: '12px', height: '12px', background: "#5B9BD5" }}></div><div>級距</div></div>
						<ResponsiveContainer width="100%" height={350}>

							<BarChart margin={{ top: 20, right: 30, bottom: 5, left: 0 }} data={levelList} >
								<XAxis dataKey="name" />
								<YAxis dateKey="count" type="number" allowDecimals={false} domain={[0, () => (chartMax === 0) ? 1 : chartMax]} />
								<Bar dataKey="count" fill="#498ED0" barSize={'30%'} label={{ position: 'top', fill: '#2196f3' }} fillOpacity={0.8} />
							</BarChart>
						</ResponsiveContainer>

					</div>


					<div className='col-12 col-md-6 col-lg-6'>
						<table className="table table-bordered mt-2" style={{ border: '1px solid #fff' }}>
							<thead>
								<tr style={{ background: '#5B9BD5' }}>
									<th colspan="2">五標</th>
								</tr>
							</thead>
							<tbody style={{ borderTop: '4px solid #fff' }}>
								<tr style={{ background: '#D2DEEF' }}>
									<td className='w-50'>頂標</td>
									<td>20</td>
								</tr>
								<tr style={{ background: '#EAEFF7' }}>
									<td>高標</td>
									<td>2</td>
								</tr>
								<tr style={{ background: '#D2DEEF' }}>
									<td>均標</td>
									<td>@3</td>
								</tr>
								<tr style={{ background: '#EAEFF7' }}>
									<td>低標</td>
									<td>@4</td>
								</tr>
								<tr style={{ background: '#D2DEEF' }}>
									<td>底標</td>
									<td>@5</td>
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
									<td>20</td>
								</tr>
								<tr style={{ background: '#EAEFF7' }}>
									<td>新前標</td>
									<td>2</td>
								</tr>
								<tr style={{ background: '#D2DEEF' }}>
									<td>新均標</td>
									<td>@3</td>
								</tr>
								<tr style={{ background: '#EAEFF7' }}>
									<td>新後標</td>
									<td>@4</td>
								</tr>
								<tr style={{ background: '#D2DEEF' }}>
									<td>新底標</td>
									<td>@5</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>


			</div>
		</div>
	);
};

export default RankDetail;
