import { readFileSync } from "fs";
import base64toimg from "base64-to-image";
/*
fs.readFile('./Testimg.jpg','base64',(err,data)=> {             //data回傳轉換後的base64碼
    if (err) throw err;
    var base64str='data:image/jpg;base64,'+data;                //base64格式須加上前置
    var path = __dirname + '/';                                 //轉回圖片後存放位置
    var optionalObj  = {"fileName":"newImg01","type":"jpg"};    //fileName->命名圖片,type->格式
    var imginfo = base64toimg(base64str,path,optionalObj);
}) 
//console.log(base64str);
*/
export function imgtobase(img){
	var data = readFileSync("./"+img,"base64");
	var base64str="data:image/jpg;base64,"+data;            //base64格式須加上前置
	return base64str;
}

export function basetoimg(base64str,stid,time,i){
	var path = __dirname + "/cheatpic/";                                 //轉回圖片後存放位置
	var optionalObj  = {"fileName":time+"_"+stid+ "_" + i,"type":"jpg"};    //fileName->命名圖片,type->格式
	base64toimg(base64str,path,optionalObj);
        
}

               

//console.log(base);