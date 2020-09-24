import express from "express";
import { enterExam } from "../controller/student/enterExamController";
import { studentLogin } from "../controller/student/loginController";
import { recordLsit } from "../controller/student/recordListController";
import { sTtConnection } from "../controller/student/sTtConnectionController";

const router = express.Router();

/** 學生登入 **/
router.post("/studentLogin",studentLogin);

/** 學生進入考場 **/
router.post("/enterExam",enterExam);

/** 學生查看考試紀錄 **/
router.get("/recordList",recordLsit);

/** 學生端與教師端確認連現狀控 **/
router.get("/sTtConnection",sTtConnection);

export default router;