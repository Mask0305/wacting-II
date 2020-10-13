import jwt from "jsonwebtoken";
import { stuList } from "../../controller/teacher/examStudentListController";
import ping from "ping";


let DetailExamID;
let DetailExamStartTime ;
let DetailExamEndTime ;
let DetailExamCount ;

let examdetal = (ExamID,ExamStartTime,ExamEndTime,ExamCount) => {
	DetailExamID = ExamID;
	DetailExamStartTime = ExamStartTime;
	DetailExamEndTime = ExamEndTime;
	DetailExamCount = ExamCount ;
};

/**
 * 開啟考場
 * @body examName 考試名稱
 * @body examStartTime 考試開始時間
 * @body examEndTime 考時結束時間
 * @body examCount 考試人數
 */
export const openExam = async (req, res) => {

	var examName = req.body.examName;
	var examStartTime = String(req.body.examStartTime);
	var examEndTime = String(req.body.examEndTime);
	var examCount = req.body.examCount;
	var examID = String(Math.floor(Math.random()*10000)+1000);
	var teacherToken = req.headers.authorization;           //從header取token
	
   

	jwt.verify(teacherToken,"teacher_key",(err) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
            
			if(examName!=undefined && examStartTime!=undefined && examEndTime!=undefined && examCount!=undefined && teacherToken != undefined){


				examdetal(examID,examStartTime,examEndTime);		// 將考試資料存起來，給學生端拿
				let message={
					"examID":DetailExamID,                      
					"examStartTime":DetailExamStartTime,     
					"examEndTime":DetailExamEndTime,
					"examCount":DetailExamCount,
					"message":"成功開啟考場"
				};
			
				res.status(200)
					.json({
						message
					});
			}
			// else if(false /* 考試時間錯誤 */){
			// 	let error = "examTimeError";
			// 	let message = "考試時間錯誤";
			// 	res.status(409)
			// 		.json({error:error,message:message});
			// }
			else{
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定或為空值";
				res.status(400)
					.json({error:error,message:message});
			}

		}
	});
};

/**
 * 學生進入考試，取得考試資訊
 * @headers authorization
 * @body teacherIP
 */
export const enterExam = async (req, res) => {
	
	let clientToken = req.headers.authorization;           //從header取token
	jwt.verify(clientToken,"student_key",(err,payload) => {  //jwt解密
		console.log(payload);
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
			let teacherIP = req.body.teacherIP;
			if(payload.studentName !="" && payload.studentId !="" && payload.studentIP !="" && teacherIP !=""){
                
				//console.log('Token:\n'+clientToken);
				
				
				
				if(DetailExamID===undefined){
					res.status(400)
						.json({"message":"尚無考場資料，請稍後再試"});
				}else if(DetailExamID!=undefined){
					var time = new Date();
					var now = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
					
					if(checkTime(now)==="early"){
						res.status(400)
							.json({"message":"考試還未開始，請稍候再試"});
					}else if(checkTime(now)==="late"){
						res.status(400)
							.json({"message":"考試已結束，請向任課老師確認時間"});
					}else{
						let result={
							"examID":DetailExamID,                       
							"examStartTime":DetailExamStartTime,     
							"examEndTime":DetailExamEndTime,   
							"message":"成功進入考場"
						};
						stuList(req.connection.remoteAddress,payload.student.studentId,payload.student.studentName); //將學生資訊儲存下來
						res.status(200)
							.json(result);
					}
				}
			}
		}
	});
};


export const extendExam = async (req, res) => {
	
	let examId = req.body.examId;
	// let oringeEndTime =      //原考試時間
	let examEndTime = req.body.examEndTime;
	//let clientToken = req.signedCookies.userLoginToken;    //從cookie取token
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"teacher_key",(err,/*payload*/) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		}else{
			if(examId === undefined && examEndTime === undefined){
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定或為空值";
				res.status(400)
					.json({error:error,message:message});
			}else{

				var old_end = DetailExamEndTime.substr(11,2) + DetailExamEndTime.substr(14,2);                    //取出時間部分轉化為數字進行比較
				var new_end = examEndTime.substr(11,2) + examEndTime.substr(14,2);
				console.log(old_end+"/"+new_end);
				if(old_end >= new_end){ 
					let error = "examTimeError";
					let message = "考試時間錯誤";
					res.status(409)
						.json({error:error,message:message});
				}else{
					examdetal(examId,DetailExamStartTime,examEndTime);
					let message={
						"examID":DetailExamID,                      
						"examStartTime":DetailExamStartTime,     
						"examEndTime":DetailExamEndTime,
						"examCount":DetailExamCount,
						"message":"成功延長考場"
					};
					res.status(201)
						.json({message:message});
				}
				
			}
		}
	});
    
};


export const closeExam = function(req,res){
	let examId = req.body.examId;
	let examEndTime = req.body.examEndTime;
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"teacher_key",(err,/*payload*/) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		}else{
			if(examId === undefined && examEndTime === undefined){
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定或為空值";
				res.status(400)
					.json({error:error,message:message});
			}else{

				let old_end = DetailExamEndTime.substr(11,2)+DetailExamEndTime.substr(14,2);                    //取出時間部分轉化為數字進行比較
				let new_end = examEndTime.substr(11,2) + examEndTime.substr(14,2);
				console.log(old_end+"/"+new_end);
				if(old_end < new_end){ 
					let error = "examTimeError";
					let message = "考試時間錯誤";
					res.status(400)
						.json({error:error,message:message});
				}else{
					examdetal(examId,DetailExamStartTime,examEndTime);
					let message={
						"examID":DetailExamID,                      
						"examStartTime":DetailExamStartTime,     
						"examEndTime":DetailExamEndTime,
						"examCount":DetailExamCount,
						"message":"成功關閉考試"
					};
					res.status(201)
						.json({message:message});
					
				}
			}
		}
	});
};


/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const tTsConnection = async (req, res) => {
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"teacher_key",(err,/*payload*/) => {      //jwt解密
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
			ping.promise.probe(req.connection.remoteAddress)
				.then(function (re) {
					let pingStatus;
					if(re.time<=10){
						pingStatus = "良好";
					}else if(re.time>10 && re.time<=50){
						pingStatus = "中等";
					}else if(re.time>50){
						pingStatus = "極差";
					}else if(re.time == "unknown"){
						pingStatus = "連線中斷";
					}

					let result = {
						"connectionStatus": pingStatus,
						"connectionTime":re.time
					};
					res.status(200)
						.json({connectionStatus:result,
							examDetail:{
								"examID":DetailExamID,                      
								"examStartTime":DetailExamStartTime,     
								"examEndTime":DetailExamEndTime,
								"examCount":DetailExamCount,
							}});
				});
		} 
	});

};

let checkTime = (now) =>{
	let endTime = DetailExamEndTime.substr(11,2)+DetailExamEndTime.substr(14,2);                    //取出時間部分轉化為數字進行比較
	let startTime = DetailExamStartTime.substr(11,2)+DetailExamStartTime.substr(14,2);                    
	let nowTime = now.substr(11,2) + now.substr(14,2);
	console.log(now);
	console.log(nowTime);
	if(nowTime < startTime){ 
		return "early";
	}else if(nowTime>endTime){
		return "late";
	}else{
		return "";
	}
};