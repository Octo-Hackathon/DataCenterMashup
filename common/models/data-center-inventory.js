module.exports = function(DataCenterInventory) {
	/*
		Set Create Date and Update Date
	*/
	DataCenterInventory.observe('before save', function setTimestamp(ctx, next) {
	  if(ctx.isNewInstance){
	  	 ctx.instance.createdDt = new Date();
	  	 ctx.instance.updatedDt = new Date();
	  }else{
	  	 ctx.data.updatedDt = new Date();
	  }
	  next();
	});
};
