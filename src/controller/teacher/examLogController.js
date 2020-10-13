import jwt from "jsonwebtoken";




var studentLog = new Array();
export const stuLog = (studentId,studentName,time,probability) => {
	studentLog.unshift({        //最新的會在第一筆
		"studentId":studentId,
		"studentName":studentName,
		"time":time,
		"probability":probability,
		"cheatImages": [
			studentId+"_"+time+"_"+1+".jpg",
			studentId+"_"+time+"_"+2+".jpg",
			studentId+"_"+time+"_"+3+".jpg",
		] 
	});
};

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const examLog = async (req, res) => {
	let clientToken = req.headers.authorization;           //從header取token
	jwt.verify(clientToken,"teacher_key",(err,payload) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		}else{
			res.status(200)
				.json(studentLog);     //儲存作弊Log的
		}
	});
};
