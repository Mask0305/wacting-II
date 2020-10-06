import jwt from "jsonwebtoken";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */

export const extendExam = async (req, res) => {
	
	let examId = req.body.examId;
	// let oringeEndTime =      //原考試時間
	let examEndTime = req.body.examEndTime;
	//let clientToken = req.signedCookies.userLoginToken;    //從cookie取token
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"teacher_key",(err,payload) => {
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
				let sql1 = "SELECT endTime FROM exam_record WHERE examID = \""+examId+"\"";
				con.filterTable(sql1,function(result){
					var str = JSON.stringify(result);
					old_end = str.substr(24,2)+str.substr(27,2);                    //取出時間部分轉化為數字進行比較
					new_end = examEndTime.substr(11,2) + examEndTime.substr(14,2);
					console.log(old_end+"/"+new_end);
					if(old_end <= new_end){ 
						let error = "examTimeError	";
						let message = "考試時間錯誤";
						res.status(409)
							.json({error:error,message:message});
					}else{
						message="成功延長考試";
						showup("Teacher_extendExam",req.connection.remoteAddress);
						let sql ="UPDATE exam_record SET endTime =\"" + examEndTime + "\"WHERE examID = \"" + examId +"\"";
						con.filterTable(sql,function(result){
							console.log("1 recode has been change");
							res.status(201)
								.json({message:message});
						});
					}
				});
			}
		}
	});
    
};
