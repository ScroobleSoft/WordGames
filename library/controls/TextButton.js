
//------------------------------------------
//---------- TEXT BUTTON -------------------
var TextButton = function() {
};
TextButton.prototype = new GenieButton();
TextButton.prototype.Set = function(cnvs, specs, tWriter) {
   GenieButton.prototype.Set.call(this, cnvs, specs);

   this.TextWriter = tWriter;
};
TextButton.prototype.Draw = function(bPressed) {
   GenieButton.prototype.Draw.call(this, bPressed);

   this.WriteLabel();
};
TextButton.prototype.ReLabel = function(lbl) {  //ASSUMPTION: will only be called for Enabled buttons
   this.Context.fillStyle = this.Specs.COLOUR || "lightgrey";		//NOTE: "lightgrey" is "rgb(211,211,211)
   this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
   this.WriteLabel(null, lbl);
};
