/*eslint no-console: 0, no-unused-vars: 0*/
/*eslint-env node, es6 */

"use strict";

module.exports = (app, server) => {
	app.use("/node/intro", require("./routes/node")());
	app.use("/node/cdsConv", require("./routes/cdsConv")());

	app.use("/node", require("./routes/myNode")());
	app.use("/node/ex1", require("./routes/ex1")());
	app.use("/node/ex2", require("./routes/ex2")());
	if (server !== null) {
		app.use("/node/chat", require("./routes/chatServer")(server));
	}

	app.use((err, req, res, next) => {
		console.error(JSON.stringify(err));
		res.status(500).send(`System Error ${JSON.stringify(err)}`);
	});
};