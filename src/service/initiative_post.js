import request from "request";


/*  GET
request('http://google.com',function(err,res,body){
    if(!err && res.statusCode == 200){
        console.log(body);
    }
})

*/

/*
    範例data
    {
        basecode:圖片的base64碼
        student:該圖片的學生姓名
    }
*/

export const post_cheatpic = (data) => {
	request({
		url:"http://127.0.0.1:5000/api/v1/teacher/cheatpic",
		method:"POST",
		json:true,
		body:data
	},function(err,res,body){
		if(!err){
			console.log(body);
		}
	});
    
};


