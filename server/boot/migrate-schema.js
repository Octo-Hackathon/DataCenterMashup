module.exports = function(app) {
  var models = [];
  var dataSource = app.dataSources.mysql;
  dataSource.autoupdate('DataCenterInformation', function(err) {
    if (err) throw err;
  });
  dataSource.autoupdate('DataCenterInventory', function(err) {
    if (err) throw err;
  });
};