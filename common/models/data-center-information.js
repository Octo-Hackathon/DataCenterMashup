module.exports = function(DataCenterInformation) {
	/*
		Set Create Date and Update Date
	*/
	DataCenterInformation.observe('before save', function setTimestamp(ctx, next) {
	  if(ctx.isNewInstance){
	  	 ctx.instance.createdDt = new Date();
	  	 ctx.instance.updatedDt = new Date();
	  }else{
	  	 ctx.data.updatedDt = new Date();
	  }
	  next();
	});
};
