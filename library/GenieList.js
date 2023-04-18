
//------------------------------------------
//---------- GENIE LIST --------------------  NOTE: mimics behaviour of singly linked-list, with some slight differences
var GenieList = function() {
   var Type;
   var SetArguments;
   var Length, TrueLength;
};
GenieList.prototype = new GenieArray();
GenieList.prototype.Set = function(quantity, type) {
   var i;

   GenieArray.prototype.Set.call(this, quantity, type);

   if (type)
      this.Type = type;

   //Apply arguments - rarely used
   if (arguments.length>2) {
      this.SetArguments = new Array(arguments.length-2);
      for (i=0;i<this.SetArguments.length;++i)
	 this.SetArguments[i] = arguments[i+2];
      for (i=0;i<quantity;++i)
	 this[i].Set.apply(this[i], this.SetArguments);
   }

   this.Length = 0;
};
GenieList.prototype.Reset = function() {

   this.Length = 0;
};
GenieList.prototype.Add = function(item) {

   if (this.Length==this.length) {
      this.push(item);
   } else {
      if (this.Type)
	 this[this.Length] = Object.assign({}, item);
      else
	 this[this.Length] = item;
   }
   ++this.Length;
};
GenieList.prototype.Remove = function(iItem) {
   GenieArray.prototype.Remove.call(this, iItem);

   --this.Length;
   this.Extend();	//NOTE: doing this to ensure original list size remains constant
};
GenieList.prototype.Extend = function(nItems) {		//NOTE: may never be used
   var i;
   var item;

   nItems = nItems || 1;
   for (i=0;i<nItems;++i) {
      if (this.Type) {
	 item = new this.Type();
	 item.Set.apply(item, this.SetArguments);
      } else
	 item = 0;
      this.push(item);
   }
};
GenieList.prototype.Draw = function() {  //ASSUMPTION: this, and ::Update, will be rarely used, hence the locally declared iterators
   var i;

   for (i=0;i<this.Length;++i)
      this[i].Draw();
};
GenieList.prototype.Update = function() {
   var i;

   for (i=0;i<this.Length;++i)
      this[i].Update();
};
