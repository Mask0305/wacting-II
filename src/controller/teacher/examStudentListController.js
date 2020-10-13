import jwt from "jsonwebtoken";

let studentList = new Array();
export const stuList = (studentIP,studentId,studentName)=>{    //接取學生資訊
	studentList.push({
		"studentIP":studentIP,
		"studentId":studentId,
		"studentName":studentName});
};


/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const examStudentList = async (req, res) => {
	
	let clientToken = req.headers.authorization;           //從header取token
	jwt.verify(clientToken,"teacher_key",(err,/*payload*/) => {
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		}else{
			res.status(200)
				.json(studentList);     //第25行的陣列，儲存學生資訊的
		}
	});
};
