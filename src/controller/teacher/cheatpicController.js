import {stuLog} from "../../controller/teacher/examLogController";
import {baseToImg} from "../../service/base64_image";
import jwt from "jsonwebtoken";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const cheatPic = async (req, res) => {

	//let basecode = req.body.basecode;

	let studentName = req.body.studentName;			//姓名
	let studentId = req.body.studentId;				//學號
	let time = req.body.cheatTime;					//作弊時間
	let probability = req.body.cheatProbability;	//作弊可能性
	let cheatimg = req.body.cheatImages;   			//三條base64碼 (圖片)
	let teacherToken = req.headers.authorization;           //從header取token
	stuLog(studentId, studentName, time, probability);         //將Log資訊儲存下來

	var teacherCheatData = {
		"studentId": studentId,
		"studentName": studentName,
		"cheatTime": time,
		"cheatProbability": probability,
		"cheatImages": [
			studentId + "_" + time + "_" + 1 + ".jpg",
			studentId + "_" + time + "_" + 2 + ".jpg",
			studentId + "_" + time + "_" + 3 + ".jpg",
		]
	};

	jwt.verify(teacherToken, "student_key", (err,/*payload*/) => {      //jwt解密
		if (studentName !== "" && studentId !== "" && time !== "" && probability !== "" && cheatimg !== "") {
			for (let i = 0; i <= 2; i++) {
				baseToImg(cheatimg[i], studentId, time, i);
			}
			res.status(200)
				.json({"message": "圖片傳送成功"});

		} else if (err) {
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error: error, message: message});
			console.log("Token Error message : " + err);
		} else {
			let error = "valueIsNotSuitable";
			let message = "欄位值不符合規定或為空值";
			res.status(400)
				.json({error: error, message: message});
		}
	});
};
