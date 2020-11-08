import jwt from "jsonwebtoken";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const studentLogin = async (req, res) => {
	let studentName = req.body.studentName;
	let studentId = req.body.studentId;

	if (studentName != "" && studentId != "") {

		/* jwt */
		const student = {
			studentName: req.body.studentName,
			studentId: req.body.studentId,
			studentIP: req.connection.remoteAddress
		};

		const userLoginToken = jwt.sign({student, exp: Math.floor(Date.now() / 100) + (60 * 15)}, "student_key");

		res.status(200)
			.json({
				"token": userLoginToken,
				"auth": "0"
			});
	} else if (studentName == "" || studentId == "") {
		let error = "requireKeyNotExist";
		let message = "必填欄位為空值";
		res.status(400)
			.json({error: error, message: message});
	} else {
		let error = "valueIsNotSuitable";
		let message = "欄位值不符合規定";
		res.status(400)
			.json({error: error, message: message});
	}
};
