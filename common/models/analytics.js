var mysql      = require('mysql');
var async      = require('async');
var quartersRef = ['XXX','March','June','September','December'];
var datasources = require('../../server/datasources.json');
module.exports = function(Analytics) {

	/*
		This method parses the quarterYear input and return quarter object that 
		contains inValid, quarter and year 
	*/
	parseQuarterInput = function(quarterYear){
		var quarterObj;
		if(quarterYear){
			quarterObj = {};
			quarterObj.isValid = true;			
			var arr = quarterYear.split(':');
			if(arr.length != 2){
				quarterObj.isValid = false;		
			}
			quarterObj.quarter = parseInt(arr[0]);
			if(quarterObj.quarter <1 || quarterObj.quarter>4){
				quarterObj.isValid = false;
			}
			quarterObj.year = parseInt(arr[1]);
			if(isNaN(quarterObj.quarter) 
					|| isNaN(quarterObj.year)){
				quarterObj.isValid = false;
			}
		}
		return quarterObj;
	}

	/*
		Implementation of getQuarterlyDifferences REST API endpoint.
	*/
	Analytics.getQuarterlyDifferences = function(quarterYear1, quarterYear2, dataCenterId, cb) {
		var quarterObj1;
		if(quarterYear1){
			quarterObj1 = parseQuarterInput(quarterYear1);
			if(!quarterObj1.isValid){
				cb(new Error("Invalid input for: quarterYear1") , null);			
			}		
		}
		var quarterObj2;
		if(quarterYear2){
			quarterObj2 = parseQuarterInput(quarterYear2);
			if(!quarterObj2.isValid){
				cb(new Error("Invalid input for: quarterYear1") , null);			
			}		
		}
		async.parallel(
		{
			one: function(callback){
				calculateQuarterlyTotals(quarterObj1, dataCenterId, function(err, data){
					if(err){
						callback(err, null);
					}
					if(!data || data.length == 0){
						var errorMessage = "No data found for the given quarter - " 
							+ quarterObj1.quarter 
							+ ":"
							+quarterObj1.year;
						if(dataCenterId){
							errorMessage = errorMessage + " and data center id -  " + dataCenterId;
						}
						callback(new Error(errorMessage), null);
					}else{
						callback(null, data);	
					}						
				});
			},
			two: function(callback){
				calculateQuarterlyTotals(quarterObj2, dataCenterId, function(err, data){
					if(err){
						callback(err, null);
					}
					if(!data || data.length == 0){
						var errorMessage = "No data found for the given quarter - " 
							+ quarterObj1.quarter 
							+ ":"
							+quarterObj1.year;
						if(dataCenterId){
							errorMessage = errorMessage + " and data center id -  " + dataCenterId;
						}
						callback(new Error(errorMessage) , null);
					}else{
						callback(null, data);	
					}		
				});
			}

		}, function(err, results){
			if(err){
				cb(err, null);
			}else{
				var quarter1Data = results.one[0];
				var quarter2Data = results.two[0];
				var difference = {};
				difference.quarter1 = quartersRef[quarter1Data.quarter] + " "+ quarter1Data.year;
				difference.quarter2 = quartersRef[quarter2Data.quarter] + " "+ quarter2Data.year;				
				difference.fteCost = quarter2Data.fteCost - quarter1Data.fteCost;
				difference.averageElectricityUsage = quarter2Data.averageElectricityUsage - quarter1Data.averageElectricityUsage;				
				difference.averageITElectricityUsage = quarter2Data.averageITElectricityUsage - quarter1Data.averageITElectricityUsage;
				difference.totalStorage = quarter2Data.totalStorage - quarter1Data.totalStorage;
				difference.usedStorage = quarter2Data.usedStorage - quarter1Data.usedStorage;
				difference.totalVirtualHosts = quarter2Data.totalVirtualHosts - quarter1Data.totalVirtualHosts;
				difference.totalVirtualOS = quarter2Data.totalVirtualOS - quarter1Data.totalVirtualOS;				
				difference.storageUtilization = quarter2Data.storageUtilization - quarter1Data.storageUtilization;
				difference.totalOSCount = quarter2Data.totalOSCount - quarter1Data.totalOSCount;
				difference.totalWindowsServers = quarter2Data.totalWindowsServers - quarter1Data.totalWindowsServers;
				difference.totalUnixServers = quarter2Data.totalUnixServers - quarter1Data.totalUnixServers;
				difference.totalLinuxServers = quarter2Data.totalLinuxServers - quarter1Data.totalLinuxServers;
				difference.totalHPCClusterNodes = quarter2Data.totalHPCClusterNodes - quarter1Data.totalHPCClusterNodes;
				difference.otherServers = quarter2Data.otherServers - quarter1Data.otherServers;
				difference.totalDecommissionedPhysicalServers = quarter2Data.totalDecommissionedPhysicalServers - quarter1Data.totalDecommissionedPhysicalServers;
				cb(err, difference);
			}
		}
		);

	};

	getConnection = function(){
		var connection = mysql.createConnection({
		  host     : datasources.mysql.host,
		  port     : datasources.mysql.port,
		  user     : datasources.mysql.username,
		  password : datasources.mysql.password,		 
		  database : datasources.mysql.database
		});
		return connection;
	}

	calculateQuarterlyTotals = function(quarterObj, dataCenterId, cb){
		var connection = getConnection();
		connection.connect();
		var selectClause = "select quarter quarter, year year, sum(fteCost) fteCost, sum(averageElectricityUsage) averageElectricityUsage, "
							+"sum(averageITElectricityUsage) averageITElectricityUsage, sum(totalStorage) totalStorage, sum(usedStorage) usedStorage,"
							+" sum(totalVirtualOS) totalVirtualOS, sum(totalOSCount) totalOSCount,"
							+" sum(totalVirtualHosts) totalVirtualHosts, sum(storageUtilization) storageUtilization, "
							+" sum(totalWindowsServers) totalWindowsServers, sum(totalUnixServers) totalUnixServers,"
							+" sum(totalLinuxServers) totalLinuxServers, sum(totalHPCClusterNodes) totalHPCClusterNodes,"
							+" sum(otherServers) otherServers, sum(totalDecommissionedPhysicalServers) totalDecommissionedPhysicalServers";
		var fromClause = " from datacenterinformation ";
		var groupByClause = " group by quarter ";		
		var whereClause = "";
		if(quarterObj && quarterObj.quarter){
			if(whereClause.length == 0){
				whereClause = whereClause + " where ";
			}else{
				whereClause = whereClause + " and  ";
			}
			whereClause = whereClause + " quarter = " + quarterObj.quarter;
		}
		if(quarterObj && quarterObj.year){
			if(whereClause.length == 0){
				whereClause = whereClause + " where ";
			}else{
				whereClause = whereClause + " and  ";
			}
			whereClause = whereClause + " year = " + quarterObj.year;
		}
		if(dataCenterId){
			if(whereClause.length == 0){
				whereClause = whereClause + " where ";
			}else{
				whereClause = whereClause + " and  ";
			}
			whereClause = whereClause + " dataCenterInventoryId = " + dataCenterId;
		}
		var query = selectClause + fromClause + whereClause + groupByClause;
		//console.log("Query ::: "+ query);
		connection.query(query, function(err, rows, fields) {
			connection.end();
		  	if(err){
				cb(err, null);
			}			
			cb(null, rows);	 
		  	
		});
	}

	/**
		Implementation of getQuarterlyTotals REST API endpoint.
	*/
	Analytics.getQuarterlyTotals = function(quarterYear, dataCenterId, cb) {	
		var quarterObj;
		if(quarterYear){
			quarterObj = parseQuarterInput(quarterYear);
			if(!quarterObj.isValid){
				cb(new Error("Invalid input for: quarterYear") , null);			
			}		
		}
		calculateQuarterlyTotals(quarterObj, dataCenterId, function(err, data){
			if(err){
				cb(err, null);
			}
			if(data && data.length >0){
				for(var i in data){
					var row = data[i];
					row.quarter = quartersRef[row.quarter] + " "+ row.year;
					row.year = undefined;
				}
			}
			cb(null, data);		
		});
	};

	//REST API Endpoint Configuration
 	Analytics.remoteMethod(
	'getQuarterlyDifferences',
		{
		  description: 'Fetch all data centers',
		  accepts: [{arg: 'quarterYear1', type: 'string', required: true},
		  		{arg: 'quarterYear2', type: 'string', required: true},
                {arg: 'dataCenterId', type: 'number', required: false}],
		  returns: {arg: 'results', type: 'array'},
		  http: {path: '/getQuarterlyDifferences', verb: 'get'}
		}
	);

 	Analytics.remoteMethod(
	'getQuarterlyTotals',
		{
		  description: 'Fetch all data centers',
		  accepts: [{arg: 'quarterYear', type: 'string', required: false},
                {arg: 'dataCenterId', type: 'number', required: false}],
		  returns: {arg: 'results', type: 'array'},
		  http: {path: '/getQuarterlyTotals', verb: 'get'}
		}
	);

};
