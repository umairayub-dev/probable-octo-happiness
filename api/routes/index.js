const scrapRoutes = require('./scrap-routes');

module.exports = (app, apiVersion) => {
	app.use(apiVersion, scrapRoutes);
};
