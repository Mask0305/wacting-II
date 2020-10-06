import jwt from "jsonwebtoken";


/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const recordLsit = async (req, res) => {
	
	let clientToken = req.headers.authorization;           //從header取token
	//let clientToken = req.signedCookies.userLoginToken;

	let result=[    //測試資料
		{
			"examId":"20101",
			"examTeacher": "蕭老師",
			"examName": "物件導向程式設計",
			"examTime": "2020-02-01 09:00~12:00",
			"examLog": "/log/:examId.txt"
		},
		{
			"examId": "30102",
			"examTeacher": "陳老師",
			"examName": "Python爬蟲",
			"examTime": "2020-03-11 14:00~16:00",
			"examLog": "/log/:examId.txt"
		},
		{
			"examId": "40103",
			"examTeacher": "王老師",
			"examName": "C語言入門",
			"examTime": "2020-02-17 09:30~11:30",
			"examLog": "/log/:examId.txt"
		}];

	jwt.verify(clientToken,"student_key",(err/*,payload*/) => {      //jwt解密
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
			
			res.status(200)
				.json(result);
		}
	});
};
