import jwt from "jsonwebtoken";
import ping from "ping";

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const tTsConnection = async (req, res) => {
	let clientToken = req.headers.authorization;           //從header取token

	jwt.verify(clientToken,"teacher_key",(err,/*payload*/) => {      //jwt解密
		if(err){
			let error = "unauthorized";
			let message = "header沒有authorization或解析錯誤";
			res.status(401)
				.json({error:error,message:message});
			console.log("Token Error message : "+err);
		} else {
			ping.promise.probe(req.connection.remoteAddress)
				.then(function (re) {
					let pingStatus;
					if(re.time<=10){
						pingStatus = "良好";
					}else if(re.time>10 && re.time<=50){
						pingStatus = "中等";
					}else if(re.time>50){
						pingStatus = "極差";
					}else if(re.time == "unknown"){
						pingStatus = "連線中斷";
					}

					let result = {
						"connectionStatus": pingStatus,
						"connectionTime":re.time
					};
					res.status(200)
						.json(result);
				});
		}
        
	});

};
