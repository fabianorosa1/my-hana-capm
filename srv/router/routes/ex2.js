/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = () => {
	var app = express.Router();

//Hello Router
	app.get("/toc", (req, res) => {
		let output =
			`<H1>Exercise #2</H1></br>
			<a href="${req.baseUrl}/">/</a> - HANA DB Client</br>
			<a href="${req.baseUrl}/express">/express</a> - Simple Database Select Via Client Wrapper/Middelware - In-line Callbacks</br>
			<a href="${req.baseUrl}/waterfall">/waterfall</a> - Simple Database Select Via Client Wrapper/Middelware - Async Waterfall</br>	
			<a href="${req.baseUrl}/promises">/promises</a> - Simple Database Select Via Client Wrapper/Middelware - Promises</br>	
			<a href="${req.baseUrl}/await">/await</a> - Simple Database Select Via Client Wrapper/Middelware - Await</br>	
			<a href="${req.baseUrl}/procedures">/procedures</a> - Simple Database Call Stored Procedure</br>		
			<a href="${req.baseUrl}/procedures2">/procedures2</a> - Database Call Stored Procedure With Inputs</br>		
			<a href="${req.baseUrl}/proceduresParallel">/proceduresParallel</a> - Call 2 Database Stored Procedures in Parallel</br>	
			<a href="${req.baseUrl}/whoAmI">/whoAmI</a> - Current User Info</br>	
			<a href="${req.baseUrl}/env">/env</a> - Environment Info</br>
			<a href="${req.baseUrl}/cfApi">/cfApi</a> - Current Cloud Foundry API</br>	
			<a href="${req.baseUrl}/space">/space</a> - Current Space</br>
			<a href="${req.baseUrl}/userinfo">/userinfo</a> - Detailed User Info</br>	
			<a href="${req.baseUrl}/hdb">/hdb</a> - HANA DB Query</br>	
			<a href="${req.baseUrl}/tables">/tables</a> - All Local Tables</br>	
			<a href="${req.baseUrl}/views">/views</a> - All Local Views</br>				
			<a href="${req.baseUrl}/os">/os</a> - OS Info</br>	
			<a href="${req.baseUrl}/osUser">/osUser</a> - OS User</br>`;
		res.type("text/html").status(200).send(output);
	});
	
	//Hello Router
	app.get("/", (req, res) => {
		let hanaClient = require("@sap/hana-client");
		//Lookup HANA DB Connection from Bound HDB Container Service
		const xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		//Create DB connection with options from the bound service
		var connParams = {
			serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
			uid: hanaOptions.hana.user,
			pwd: hanaOptions.hana.password,
			CURRENTSCHEMA: hanaOptions.hana.schema,
			ca: hanaOptions.hana.certificate
		};
		let client = hanaClient.createClient(connParams);
		//connect
		client.connect((err) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				client.exec(`SELECT SESSION_USER, CURRENT_SCHEMA 
				             FROM "DUMMY"`, (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						client.disconnect();
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});
	});
	
	//Simple Database Select Via Client Wrapper/Middelware - In-line Callbacks
	app.get("/express", (req, res) => {
		let client = req.db;
		client.prepare(
			`SELECT SESSION_USER, CURRENT_SCHEMA 
				             FROM "DUMMY"`,
			(err, statement) => {
				if (err) {
					return res.type("text/plain").status(500).send("ERROR: " + err.toString());
				}
				statement.exec([],
					(err, results) => {
						if (err) {
							return res.type("text/plain").status(500).send("ERROR: " + err.toString());
						} else {
							var result = JSON.stringify({
								Objects: results
							});
							return res.type("application/json").status(200).send(result);
						}
					});
				return null;
			});
    });

    	
	return app;
};