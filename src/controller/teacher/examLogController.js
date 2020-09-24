

/**
 * Display list of all examples.
 * @param req
 * @param res
 */
export const examLog = async (req, res) => {
	
	res.status(200)
		.json({
			message: "get Successful",
		});
};
