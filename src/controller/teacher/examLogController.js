import jwt from "jsonwebtoken";
import os from "os";

const getLocalIP = () => {
	const interfaces = os.networkInterfaces();

	for(var devName in interfaces){  
		var iface = interfaces[devName];  
		for(var i=0;i<iface.length;i++){  
			var alias = iface[i];  
			if(alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal){  
				return alias.address;  
			}  
		}  
	} 
};

var studentLog = new Array();
export const stuLog = (studentId,studentName,time,probability) => {
	let ResProbability = Math.round(probability * 10000) / 100;
	let LocalIP = getLocalIP();
	const url="http://"+ LocalIP +":3000/watching/cheatPic/";
	studentLog.unshift({        //最新的會在第一筆
		"studentId":studentId,
		"studentName":studentName,
		"time":time,
		"probability": ResProbability + "%",
		"cheatImages": [
			url+time+"_"+studentId+"_"+0+".jpg",
			url+time+"_"+studentId+"_"+1+".jpg",
			url+time+"_"+studentId+"_"+2+".jpg",
		] 
	});
};

/**
 * Display list of all examples.s
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
