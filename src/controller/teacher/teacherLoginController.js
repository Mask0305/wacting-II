import jwt from "jsonwebtoken";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const teacherLogin = async (req, res) => {

	try{
		let teacherName = req.body.teacherName;

		if(teacherName == ""){
			let err = "requireKeyNotExist";
			throw err;
		}

		var teacher={
			teacherName : req.body.teacherName,
			teacherIP : req.connection.remoteAddress
		};
		
		var userLoginToken = jwt.sign({teacher,exp:Math.floor(Date.now()/100)+(60*15)},"teacher_key");
	
		res.status(200)
			.json({"token":userLoginToken,"auth":"9"});

	}catch(err){
		switch(err){
		case "requireKeyNotExist":
			res.status(400)
				.json({error:err,message:"必填欄位不可為空值"});
			break;
		}
	}
	
	

	
};
