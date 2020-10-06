import jwt from "jsonwebtoken";

let id;
let startTime ;
let endTime ;

export const examdetal = (examID,examStartTime,examEndTime) => {
	id = examID;
	startTime = examStartTime;
	endTime= examEndTime;
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


