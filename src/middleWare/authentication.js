import passport from 'passport';
import {Strategy as localStrategy} from 'passport-local';

import db from '../../models/index.js';
import bcrypt from 'bcrypt';		//Hash


import passportJWT from 'passport-jwt';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const UserModel = db['Users'];


passport.use('login', new localStrategy({
	usernameField: 'email',
	passwordField: 'passwd',
	passReqToCallback: true
}, async (req, email, passwd, done) => {
	try {

		const user = await UserModel.findOne({where: {email: req.body.email}});

		if (user !== null) {
			//比對加密後的密碼與資料庫的紀錄是否相符
			bcrypt.compare(passwd, user.passwd, async (err, res) => {
				if (res) {
					//取出email與passwd皆相符的使用者資料
					const user = await UserModel.findOne({
						where: {email: req.body.email},
						attributes: {exclude: ['passwd']},
						include: [{
							association: UserModel.Types,
							through: {
								attributes: []
							},
						}]
					});
					return done(null, user);
				} else {
					return done(null, '0');	//帳號或密碼錯誤
				}
			});
		} else if (!user) {
			return done(null, '0');	//帳號或密碼錯誤
		}
	} catch (error) {
		console.log('error:' + error);
		return done(error);
	}
}));

//註冊
passport.use('register', new localStrategy({
	usernameField: 'email',
	passwordField: 'passwd',
	passReqToCallback: true
}, async (req, email, passwd, done) => {
	try {
		console.log('in register');
		//將用戶提供的信息保存到數據庫中


		//將用戶信息發送到下一個中間件

	} catch (error) {
		console.log('error:' + error);
		const user = '2';
		return done(null, user);
	}
}));


const opts = {
	secretOrKey: process.env.JWT_SECRET,
	jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
	passReqToCallback: true,
	failureFlash: true
};

passport.use('jwt', new JWTStrategy(opts, async (req, payload, done) => {
	//console.log("\n" +req.headers.authorization +"\n");
	//我們曾經簽署過JWT的秘密
	try {
		//利用token內的資料檢查是否與資料庫內的相符
		const verification = await UserModel.findOne({
			where: {
				userId: payload.user.id,
				email: payload.user.email,
				name: payload.user.name
			}
		}).catch(err => {
			return done(err, false);
		});

		if (verification === null) {
			throw 'unauthorized';
		} else {
			req.user = payload.user;
			//將jwt中包含的資料回給路由
			return done(null, payload.user);
		}
		
	} catch (error) {
		return done(null, false);
	}
})
);

