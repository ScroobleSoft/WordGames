
//-------------------------------------------
//---------- AGENT ARRAY --------------------
var AgentArray = function() {
   var SelectedAgent;
   var Agent;
   var Distance;

   var i, distance;
};
AgentArray.prototype = new GenieArray();
AgentArray.prototype.Set = function(quantity, type, indxd) {
   var i;
   var element;
   var aArray;  //a- arguments

   this.Empty = 0;

   if (arguments.length>3) {
      aArray = new Array(arguments.length-3);
      for (i=0;i<aArray.length;++i)
	 aArray[i] = arguments[i+3];
   }

   for (i=0;i<quantity;++i) {
      if (arguments[1]) {
	 element = new type();
	 if (indxd)
	    element.Index = i;
	 if (element.Set && aArray)
	    element.Set.apply(element, aArray);
      } else
	 element = 0;
      this.push(element);
   }
};
AgentArray.prototype.SetLinks = function() {
   var i;

   for (i=0;i<this.length;++i)
      this[i].SetLinks.apply(this[i], arguments);
};
AgentArray.prototype.SetComrades = function() {  //maybe REDUNDANT if GenieSpace is implemented
   var cmrds;

   cmrds = this;
   this.forEach(function(item){item.Comrades=cmrds;});
};
AgentArray.prototype.SetFoes = function(foes) {
   this.forEach(function(item){item.Foes=foes;});
};
AgentArray.prototype.SetExtant = function() {
   this.forEach(function(agnt){agnt.SetExtant();});
};
AgentArray.prototype.SetVisible = function() {
   this.forEach(function(agnt){agnt.SetVisible();});
};
AgentArray.prototype.UnsetExtant = function() {
   this.forEach(function(agnt){agnt.UnsetExtant();});
};
AgentArray.prototype.UnsetVisible = function() {
   this.forEach(function(agnt){agnt.UnsetVisible();});
};
AgentArray.prototype.Draw = function() {
   this.forEach(function(agnt){if (agnt.CheckVisible()) agnt.Draw();});
};
AgentArray.prototype.Update = function() {
   this.forEach(function(agnt){if (agnt.CheckExtant()) agnt.Update();});
};
AgentArray.prototype.Select = function(agent) {
   this.UnSelect();
   if (agent===parseInt(agent, 10)) { 	//check if an index is passed in
      this[agent].Select();
      this.SelectedAgent = this[agent];
   } else {
      agent.Select();
      this.SelectedAgent = agent;
   }
};
AgentArray.prototype.UnSelect = function() {
   if (this.SelectedAgent) {
      this.SelectedAgent.DeSelect();
      this.SelectedAgent = null;
   }
};
AgentArray.prototype.UpdateSelection = function() {
   this.Agent = this.CheckAgentClicked();
   if (!this.Agent)
      return (false);				//NOTE: this is an indication that none were clicked
   if (this.Agent===this.SelectedAgent)
      return (true);
   else {
      this.UnSelect();
      this.Select(this.Agent);
      return (true);
   }
};
AgentArray.prototype.GetClosestAgent = function(pos, rds) {  //pos- position of caller; not bothered by anything outside 'rds'
   /* UNTESTED */
   this.Agent = null;
   this.Distance = 2*SCREEN.WIDTH;	//inexact, but a safe figure
   rds = rds || this.Distance;
   for (this.i=0;this.i<this.length;++this.i) {
      if (Math.abs(pos.X-this[this.i].Position.X)>rds || Math.abs(pos.Y-this[this.i].Position.Y)>rds) //do a basic check first
	 continue;
      this.distance = Utilities.GetDistance(pos, this[this.i].Position);
      if (this.distance>rds)
	 continue;
//      if (!this.distance)
//	 this.distance = this.newDistance;
      else if (this.distance<this.Distance) {
	 this.Distance = this.distance;
	 this.Agent = this[this.i];
      }
   }
   return (this.Agent);
};
AgentArray.prototype.CheckAgentNearby = function(pos, rds) {  //NOTE: this is a soft check only, but with some justification
   /* UNTESTED */
   for (this.i=0;this.i<this.length;++this.i)
      if (Math.abs(pos.X-this[this.i].Position.X)>rds || Math.abs(pos.Y-this[this.i].Position.Y)>rds)
	 return (true);
   return (false);
};
AgentArray.prototype.CheckAgentClicked = function() {
   var i;

   for (i=0;i<this.length;++i)
      if (this[i].CheckClicked())
	 return (this[i]);
   return (null);
};
