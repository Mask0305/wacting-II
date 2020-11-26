// Modules to control application life and create native browser window
/* eslint-disable no-undef */
import cors from "cors";
import express from "express";
import bodyparser from "body-parser";
import passport from "passport";
import _ from "lodash";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import debug from "debug";
import {app, BrowserWindow, Menu} from "electron";
import path from "path";

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// preload: path.join(__dirname, "preload.js")
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile("dist/watching/index.html");

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// 禁止開發人員工具
	Menu.setApplicationMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	// todo 阿路看我
	// session.defaultSession.clearStorageData();
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// from app.js

/** For router */
import rootRouter from "./route/rootRouter.js";

/** For socket */
//import {onConnection, onUserReceiverMessage} from "./controllers/auth/socket/socketController.js";

export const expressApp = express();


/* cors */
expressApp.use(cors());  // 跨網域

expressApp.use(bodyparser.json({limit: "50mb"}));
expressApp.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
expressApp.use(passport.initialize());

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
		expressApp.use(middleware[0], middleware[1]);
		return;
	}
	expressApp.use(middleware);
});

expressApp.use("/", express.static(path.join(__dirname, "../dist/watching")));	//TODO 改那些path
/**
 * Routers
 */
expressApp.disable("etag");	//禁用緩存，不會回304

expressApp.use("/watching/api/v1/", rootRouter);
expressApp.use("/watching/cheatPic/", express.static("cheatPic"));

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
const port = normalizePort(process.env.APP_PORT || "5000");
expressApp.set("port", port);

/** dev */
const dd = debug("monolithic:server");
const server = http.createServer(expressApp);
server.listen(port, "0.0.0.0");


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
