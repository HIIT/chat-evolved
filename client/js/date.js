/** re-implement parts of Date **/

Date.prototype._leadingZeros = function( digit ) {
	return digit < 10 ? '0' + digit : '' + digit;
}

Date.prototype.seconds = function() {
    return this._leadingZeros( this.getSeconds() );
}

Date.prototype.minutes = function() {
	return this._leadingZeros( this.getMinutes() );
}

Date.prototype.hours = function() { 
        return this._leadingZeros( this.getHours() );
}

Date.prototype.date = function() { 
        return this._leadingZeros( this.getDate() );
}

Date.prototype.month = function() { 
        return this._leadingZeros( this.getMonth() + 1 );
}

Date.prototype.year = function() {
        return '' + this.getFullYear();
}

// customize the Date toString-function
Date.prototype.toString = function(){
   // hh:mm:ss
   return this.hours() + ':' + this.minutes() + ':' + this.seconds();
}
