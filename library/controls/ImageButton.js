
//-------------------------------------------
//---------- IMAGE BUTTON -------------------
var ImageButton = function() {
};
ImageButton.prototype = new GenieButton();
ImageButton.prototype.Draw = function(bPressed) {
   GenieButton.prototype.Draw.call(this, bPressed);

   this.DrawImage();
};
