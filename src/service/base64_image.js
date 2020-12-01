import path from "path";
import fs from "fs";
import {readFileSync} from "fs";
// import base64ToImage from "base64-to-image";

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

export function imgToBase(img) {
	var data = readFileSync("./" + img, "base64");
	var base64str = "data:image/jpg;base64," + data;            //base64格式須加上前置
	return base64str;
}

export function baseToImg(base64str, stid, time, i) {
	// eslint-disable-next-line no-undef
	let filePath = path.join(__dirname, "..", "..", "cheatPic");        //轉回圖片後存放位置
	console.log(filePath);
	let fileName = time + "_" + stid + "_" + i + ".jpg";
	let optionalObj = {"fileName": fileName, "type": "jpg"};    //fileName->命名圖片,type->格式

	base64ToImage(base64str, filePath, optionalObj);
}

/**
 * Change base64Str to image and write image file with
   the specified file name to the specified file path.
 * @param {String} base64Str base64 string (mandatory)
 * @param {String} filePath file path e.g. /opt/temp/uploads/ (mandatory)
 * @param {Object} optionalObj holds image type, image filename, debug e.g.{'fileName':fileName, 'type':type,'debug':true} (optional)
 * @public
 */
function base64ToImage(base64Str, filePath, optionalObj) {

	if (!base64Str || !path) {
		throw new Error("Missing mandatory arguments base64 string and/or path string");
	}

	optionalObj = optionalObj || {};
	const imageBuffer = decodeBase64Image(base64Str);
	let imageType = optionalObj.type || imageBuffer.type || "png";
	let fileName = optionalObj.fileName || "img-" + Date.now();
	let abs;
	fileName = "" + fileName;

	if (fileName.indexOf(".") === -1) {
		imageType = imageType.replace("image/", "");
		fileName = fileName + "." + imageType;
	}

	abs = path.join(filePath, fileName);
	fs.writeFile(abs, imageBuffer.data, "base64", function (err) {
		if (err && optionalObj.debug) {
			console.log("File image write error", err);
		}

	});

	return {
		"imageType": imageType,
		"fileName": fileName
	};
}

/**
 * Decode base64 string to buffer.
 *
 * @param {String} base64Str string
 * @return {Object} Image object with image type and data buffer.
 * @public
 */
function decodeBase64Image(base64Str) {
	let matches = base64Str.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
	let image = {};
	if (!matches || matches.length !== 3) {
		throw new Error("Invalid base64 string");
	}

	image.type = matches[1];
	image.data = Buffer.from(matches[2], "base64");

	return image;
}
