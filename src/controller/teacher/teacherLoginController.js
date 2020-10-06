import jwt from "jsonwebtoken";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const teacherLogin = async (req, res) => {

	try{
		
		if(teacherName == ""){
			let err = "requireKeyNotExist";
			throw err;
		}
	}catch(err){
		switch(err){
		case "requireKeyNotExist":
			res.status(400)
				.json({error:err,message:"必填欄位不可為空值"});
			break;
		}
	}
	
	let teacherName = req.body.teacherName;

	var payload={
		teacherName : req.body.teacherName,
		teacherIP : req.connection.remoteAddress
	};
	var userLoginToken = jwt.sign({payload,exp:Math.floor(Date.now()/100)+(60*15)},"teacher_key");

	res.status(200)
		.json({"token":userLoginToken,"auth":"9"});
	
};
