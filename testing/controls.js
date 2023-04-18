
HouseTesting.prototype.SetControlTest = function() {

   this.SetControlButtons();
   this.DisplayControlInfo();
};
HouseTesting.prototype.DisplayControlInfo = function() {

   this.TextWriter.Write("Disabled buttons drawn with 0.5", 5, 40, null, CANVAS.ZOOM);
   this.TextWriter.Write("opacity don't look so good, so tried", 5, 55, null, CANVAS.ZOOM);
   this.TextWriter.Write("a 0.5 opacity black overlay over a", 5, 70, null, CANVAS.ZOOM);
   this.TextWriter.Write("regular button as an alternate look,", 5, 85, null, CANVAS.ZOOM);
   this.TextWriter.Write("and that makes things even worse.", 5, 100, null, CANVAS.ZOOM);

   this.TextWriter.Write("Finally, tried only 'halving' the", 5, 140, null, CANVAS.ZOOM);
   this.TextWriter.Write("colour of the button and the label,", 5, 155, null, CANVAS.ZOOM);
   this.TextWriter.Write("and it looks much better.", 5, 170, null, CANVAS.ZOOM);
};
HouseTesting.prototype.SetControlButtons = function() {

   this.TestButton1 = new TextButton();
   this.TestButton1.Set(this.Interface.PrimeScape, { L: 50, T: 100, W: 80, H: 20, LABEL: "Enabled", BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.TestButton2 = new TextButton();
   this.TestButton2.Set(this.Interface.PrimeScape, { L: 250, T: 100, W: 80, H: 20, LABEL: "Disabled", BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.TestButton3 = new TextButton();
   this.TestButton3.Set(this.Interface.PrimeScape, { L: 450, T: 100, W: 80, H: 20, LABEL: "Overlaid", BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.TestButton4 = new TextButton();
   this.TestButton4.Set(this.Interface.PrimeScape, { L: 50, T: 150, W: 80, H: 20, LABEL: "", COLOUR: "rgb(233,233,233)", BACKGROUND: GREY.LIGHT }, this.TextWriter);
};
HouseTesting.prototype.PlayControlTest = function() {

//   this.AnimationFrameHandle = requestAnimationFrame(this.PlayControlTest.bind(this));

   this.DrawControlButtons();
};
HouseTesting.prototype.DrawControlButtons = function() {

   this.Screen.fillStyle = GREY.LIGHT;
   this.Screen.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

   this.TestButton1.Show();
   this.TestButton2.Show();
   this.TestButton2.Disable();
   this.TestButton3.Show();
   this.Screen.globalAlpha = 0.5;
   this.Screen.fillStyle = "black";
   this.Screen.fillRect(this.TestButton3.Specs.L, this.TestButton3.Specs.T, this.TestButton3.Specs.W, this.TestButton3.Specs.H);
   this.Screen.globalAlpha = 1.0;
   this.TestButton4.Show();
   this.Screen.globalAlpha = 0.5;
   this.TextWriter.Write("Halved", 65, 165);
   this.Screen.globalAlpha = 1.0;
};
