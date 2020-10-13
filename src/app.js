/* eslint-disable no-undef */
import cors from "cors";
import express from "express";
import bodyparser from "body-parser";
import passport from "passport";
import _ from "lodash";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import debug from "debug";

/** For router */
import rootRouter from "./route/rootRouter.js";

/** For socket */
//import {onConnection, onUserReceiverMessage} from "./controllers/auth/socket/socketController.js";

export const app = express();


/* cors */
app.use(cors());  // 跨網域

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(passport.initialize());

/**
 * Middlewares
 */
const globalMiddlewares = [
	morgan("dev"),
	express.json(),
	express.urlencoded({extended: false}),
	cookieParser(),
	passport.initialize(),
	//express.static(path.join(__dirname, "../public")),
];

_.each(globalMiddlewares, (middleware) => {
	if (_.isArray(middleware)) {
		app.use(middleware[0], middleware[1]);
		return;
	}
	app.use(middleware);
});

app.use("/public" ,express.static(path.join(__dirname, "../public")));	//TODO 改那些path

/**
 * Routers
 */
app.disable("etag");	//禁用緩存，不會回304

app.use("/watching/api/v1/", rootRouter);

/* * * Server start * * */

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	const res = parseInt(val, 10);
	if (Number.isNaN(res)) {
		// named pipe
		return val;
	}
	if (res >= 0) {
		// port number
		return res;
	}
	return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.APP_PORT || "3000");
app.set("port", port);

/** dev */
const dd = debug("monolithic:server");
const server = http.createServer(app);
server.listen(port,"0.0.0.0");


/**
 * Event listener for HTTP server "listening" event.
 */
server.on("listening", () => {
	const addr = server.address();
	const bind =
		typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
	dd(`Listening on ${bind}`);
	console.log(`✅  Node server is listen on ${bind}`); // eslint-disable-line no-console
});

// // socket
// export let ioServer = io(server);

// ioServer.on("connection", onConnection);
// ioServer.on("message-receiver", onUserReceiverMessage);

//test
/*ioServer.origins((origin, callback) => {
	// if (origin !== 'http://localhost') {
	// 	return callback('origin not allowed', false);
	// }
	callback(null, true);
});*/

