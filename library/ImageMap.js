
//------------------------------------------------
//----------- GENIE IMAGE MAP --------------------
var GenieImageMap = function () {
   var Map;

   var i, x, y;
};
GenieImageMap.prototype = new GenieImage();
GenieImageMap.prototype.Set = function(cntxt, pic, specs, aMap) {
   GenieImage.prototype.Set.call(this, cntxt, pic, specs);

   if (aMap)
      this.Map = aMap;
   else
      this.Map = new Array();

   //Adjust entry map if position fixed in specs
   if (!(this.Specs.X===undefined))
      this.AdjustEntryMap(this.Specs);
};
GenieImageMap.prototype.AdjustEntryMap = function(coords) {
   var i;

   for (i=0;i<this.Map.length;++i) {
      this.Map[i].L += coords.X;
      this.Map[i].T += coords.Y;
   }
};
GenieImageMap.prototype.AddMapEntry = function(entry) {

   //UNLOGGED - maybe unnecessary

   this.Map.push(entry);
};
GenieImageMap.prototype.GetMapEntry = function(bClicked) {  //return -1 if no entries matched

   if (bClicked) {
      this.x = Mouse.ClickX;
      this.y = Mouse.ClickY;
   } else {
      this.x = Mouse.X;
      this.y = Mouse.Y;
   }

   for (this.i=0;this.i<this.Map.length;++this.i)
      if (GeoUtils.CheckPointInBox( { X: this.x, Y: this.y }, this.Map[this.i]))
	 return (this.i);

   return (-1);
};
GenieImageMap.prototype.Draw = function(x, y, scale) {
   GenieImage.prototype.Draw.call(this, x, y, scale);

   //UNLOGGED

   //NOTE: moving image around will give errors

   if (!(x===undefined))
      this.AdjustEntryMap( { X: x, Y: y } );
};
