import React, { useState, useEffect } from 'react';
import './App.css';
import ScrollToTopButton from './ScrollToTopButton';
import { useAppContext } from './AppContext';

const CreditDetail = () => {
	const { appData, setAppDataValues } = useAppContext();


	const studentID = appData.studentID;
	const semester = appData.semester;
	const semesterText = appData.semesterText;

	//取得學生本學期學分狀況
	const [currentSemesterCredit, setCurrentSemesterCredit] = useState([]);

	//取得學生累計學分狀況
	const [semesterGrandTotalCredit, setSemesterGrandTotalCredit] = useState([]);

	const position = window.gadget.params.system_position;

	var _connection = window.gadget.getContract("1campus.h.semester.parent");

	if (position === 'student')
		_connection = window.gadget.getContract("1campus.h.semester.student");


	useEffect(() => {
		GetSemesterCredit();
		GetSemesterGrandTotalCredit();
	}, []);


	// 取得本學期學分狀況
	async function GetSemesterCredit() {
		await _connection.send({
			service: "_.GetSemesterCredit",
			body: {
				StudentID: studentID,
				ViewSemester: semester,
			},
			result: function (response, error, http) {
				if (error !== null) {
					console.log('GetSemesterCredit Err', error);
					return 'err';
				} else {
					if (response) {
						setCurrentSemesterCredit([].concat(response.SemesterCredit || []));
						//console.log('GetSemesterCredit', [].concat(response.SemesterCredit || []));
					}
				}
			}
		});
	}

	// 取得累計學分狀況
	async function GetSemesterGrandTotalCredit() {
		await _connection.send({
			service: "_.GetSemesterGrandTotalCredit",
			body: {
				StudentID: studentID,
				ViewSemester: semester,
			},
			result: function (response, error, http) {
				if (error !== null) {
					console.log('GetSemesterGrandTotalCredit Err', error);
					return 'err';
				} else {
					if (response) {
						setSemesterGrandTotalCredit([].concat(response.SemesterCredit || []));
						//console.log('GetSemesterGrandTotalCredit', [].concat(response.SemesterCredit || []));
					}
				}
			}
		});
	}


	const handleBackToHomePage = (e) => {
		window.history.go(-1);
		localStorage.setItem('IsBack', 't');
	};


	return (
		<div className="App">
			<div className="container px-3 px-sm-4 py-5 ">

				<div className="d-flex justify-content-between credit-detail-border">
					<button type="button" className="btn btn-back active d-flex justify-content-start px-0" onClick={handleBackToHomePage}>＜返回</button>
				</div>
				{[].concat(currentSemesterCredit || []).map((credit) => {
					return <>
						<div className='col-12 col-md-12 col-lg-6 mt-2'>
							<div className='text-start fs-4 fw-bold'>{semesterText}取得學分狀況</div>
							<div className='text-end'>取得學分/修習學分</div>
						</div>

						<div className='row align-items-start text-table'>
							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#BDD7EE' }}>必修</td>
											<td style={{ background: '#DEEBF7' }}>{Number(credit.must_pass_count)}/{Number(credit.must_studied_count)}</td>
											<td style={{ background: '#BDD7EE' }}>選修</td>
											<td style={{ background: '#DEEBF7' }}>{Number(credit.choose_pass_count)}/{Number(credit.choose_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#BDD7EE' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#DEEBF7' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div className='row align-items-start text-table'>
							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#C5E0B4' }}>部定必修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.b_must_pass_count)}/{Number(credit.b_must_studied_count)}</td>
											<td style={{ background: '#C5E0B4' }}>部定選修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.b_choose_pass_count)}/{Number(credit.b_choose_studied_count)}</td>
										</tr>
										<tr>
											<td style={{ background: '#C5E0B4' }}>校訂必修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.school_must_pass_count)}/{Number(credit.school_must_studied_count)}</td>
											<td style={{ background: '#C5E0B4' }}>校訂選修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.school_choose_pass_count)}/{Number(credit.school_choose_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#C5E0B4' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#E2F0D9' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#FFE699' }}>一般科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.r_pass_count)}/{Number(credit.r_studied_count)}</td>
											<td style={{ background: '#FFE699' }}>專業科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.zy_pass_count)}/{Number(credit.zy_studied_count)}</td>
										</tr>
										<tr>
											<td style={{ background: '#FFE699' }}>實習科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.sx_pass_count)}/{Number(credit.sx_studied_count)}</td>
											<td style={{ background: '#FFE699' }}>核心科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.core_pass_count)}/{Number(credit.core_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#FFE699' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#FFF2CC' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</>
				})}

				{[].concat(semesterGrandTotalCredit || []).map((credit) => {
					return <>
						<div className='col-12 col-md-12 col-lg-6 mt-2'>
							<div className='text-start fs-4 fw-bold'>累計取得學分狀況</div>
							<div className='text-end'>取得學分/修習學分</div>
						</div>

						<div className='row align-items-start text-table'>
							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#BDD7EE' }}>必修</td>
											<td style={{ background: '#DEEBF7' }}>{Number(credit.must_pass_count)}/{Number(credit.must_studied_count)}</td>
											<td style={{ background: '#BDD7EE' }}>選修</td>
											<td style={{ background: '#DEEBF7' }}>{Number(credit.choose_pass_count)}/{Number(credit.choose_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#BDD7EE' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#DEEBF7' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div className='row align-items-start text-table'>
							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#C5E0B4' }}>部定必修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.b_must_pass_count)}/{Number(credit.b_must_studied_count)}</td>
											<td style={{ background: '#C5E0B4' }}>部定選修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.b_choose_pass_count)}/{Number(credit.b_choose_studied_count)}</td>
										</tr>
										<tr>
											<td style={{ background: '#C5E0B4' }}>校訂必修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.school_must_pass_count)}/{Number(credit.school_must_studied_count)}</td>
											<td style={{ background: '#C5E0B4' }}>校訂選修</td>
											<td style={{ background: '#E2F0D9' }}>{Number(credit.school_choose_pass_count)}/{Number(credit.school_choose_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#C5E0B4' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#E2F0D9' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className='col-12 col-md-12 col-lg-6'>
								<table className="table table-bordered" style={{ border: '1px solid #fff' }}>
									<tbody style={{ borderTop: '4px solid #fff' }}>
										<tr>
											<td style={{ background: '#FFE699' }}>一般科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.r_pass_count)}/{Number(credit.r_studied_count)}</td>
											<td style={{ background: '#FFE699' }}>專業科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.zy_pass_count)}/{Number(credit.zy_studied_count)}</td>
										</tr>
										<tr>
											<td style={{ background: '#FFE699' }}>實習科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.sx_pass_count)}/{Number(credit.sx_studied_count)}</td>
											<td style={{ background: '#FFE699' }}>核心科目</td>
											<td style={{ background: '#FFF2CC' }}>{Number(credit.core_pass_count)}/{Number(credit.core_studied_count)}</td>
										</tr>
										<tr>
											<td colSpan="2" style={{ background: '#FFE699' }}>合計學分</td>
											<td colSpan="2" style={{ background: '#FFF2CC' }}>{Number(credit.pass_count)}/{Number(credit.studied_count)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</>
				})}
				<ScrollToTopButton />
			</div>
		</div>
	);
};

export default CreditDetail;
