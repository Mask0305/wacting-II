import jwt from "jsonwebtoken";
import { stuList } from "../../controller/teacher/examStudentListController";

// 這支包含 open enter extend close

let id;
let startTime ;
let endTime ;

const examdetal = (examID,examStartTime,examEndTime) => {
	id = examID;
	startTime = examStartTime;
	endTime= examEndTime;
};

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const openExam = async (req, res) => {

	var examName = req.body.examName;
	var examStartTime = String(req.body.examStartTime);
	var examEndTime = String(req.body.examEndTime);
    
	var examCount = req.body.examCount;
	var examID = String(Math.floor(Math.random()*10000)+1000);
	examdetal(examID,examStartTime,examEndTime);		// 將考試資料放到detail，給學生端拿
	//let clientToken = req.signedCookies.userLoginToken;    //從cookie取token
	var teacherToken = req.headers.authorization;           //從header取token
	let message={
		"examID":examID,                      
		"examStartTime":examStartTime,     
		"examEndTime":examEndTime,      
		"message":"成功開啟考場"
	};

   

	jwt.verify(teacherToken,"teacher_key",(err) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
            
			if(examName!="" && examStartTime!="" && examEndTime!="" && examCount!="" && teacherToken != undefined){
				
				//let sql = "INSERT INTO exam_record(examID,name,teacher,count,startTime,endTime) VALUES(\""+examID+"\",\""+examName+"\",\""+payload.payload.teacherName+"\",\""+parseInt(examCount)+"\",\""+examStartTime+"\",\""+examEndTime+"\")";
				console.log("1 record insert successful");
			
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
 * Display list of all examples.
 * @param req
 * @param res
 */
export const enterExam = async (req, res) => {
	
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"student_key",(err,payload) => {  //jwt解密
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
			let teacherIP = req.body.teacherIP;
			if(payload.studentName !="" || payload.studentId !="" || payload.studentIP !="" || teacherIP !=""){
                
				//console.log('Token:\n'+clientToken);
				let result={
					"examID":id,                       
					"examStartTime":startTime,     
					"examEndTime":endTime,   
					"message":"成功進入考場"
				};
				stuList(req.connection.remoteAddress,payload.studentId,payload.studentName); //將學生資訊傳給teacherAPI
				if(result.examID != ""){
					res.status(200)
						.json(result);
				}else{
					res.status(400)
						.json({"message":"尚無考場資料，請稍後再試"});
				}

			}else if(payload.studentName =="" || payload.studentId =="" || payload.studentIP =="" || teacherIP ==""){
				let error = "requireKeyNotExist";
				let message = "必填欄位為空值";
				res.status(400)
					.json({error:error,message:message});
			}else if(clientToken == undefined){
				let error = "unauthorized";
				let message = "header沒有authorization或解析錯誤";
				res.status(401)
					.json({error:error,message:message});
			}
			// else if(false /*考場不存在*/){
			// 	let error = "examNotFound";
			// 	let message = "考場不存在";
			// 	res.status(404)
			// 		.json({error:error,message:message});
			// }
			else{
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定";
				res.status(400)
					.json({error:error,message:message});
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
			if(examId =="" && examEndTime ==""){
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定或為空值";
				res.status(400)
					.json({error:error,message:message});
			}else{

				var old_end = endTime.substr(24,2) + endTime.substr(27,2);                    //取出時間部分轉化為數字進行比較
				var new_end = examEndTime.substr(11,2) + examEndTime.substr(14,2);
				console.log(old_end+"/"+new_end);
				if(old_end <= new_end){ 
					let error = "examTimeError";
					let message = "考試時間錯誤";
					res.status(409)
						.json({error:error,message:message});
				}else{
					let message="成功延長考試";
					console.log("1 recode has been change");
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
			if(examId =="" && examEndTime ==""){
				let error = "valueIsNotSuitable";
				let message = "欄位值不符合規定或為空值";
				res.status(400)
					.json({error:error,message:message});
			}else{
				let old_end = endTime.substr(24,2)+endTime.substr(27,2);                    //取出時間部分轉化為數字進行比較
				let new_end = examEndTime.substr(11,2) + examEndTime.substr(14,2);
				console.log(old_end+"/"+new_end);
				if(old_end < new_end){ 
					let error = "examTimeError	";
					let message = "考試時間錯誤";
					res.status(409)
						.json({error:error,message:message});
				}else{
					let message="成功關閉考試";
					console.log("1 recode has been change");
					res.status(201)
						.json({message:message});
					
				}
			
			}
		}
	});
};

