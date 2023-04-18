/*
 *  there are too few configurations possible; these are some of the few:
 *	"kebab","beret","eight","knife","being","idler"
 *	"macho","oasis","tapes","merit","clasp","reads"
 *	"hover","remit","dealt","hoped","psalm","viola"
 *	"metro","onset","tenet","merit","train","reaps"
 *	"genus","serve","horse","girth","nadir","rider"
 */
HouseMiniGames.prototype.SetWordJumble = function() {

   //UNLOGGED

   this.JumbleWordsSelector = new JumbleWordsSelector();
   this.JumbleWordsSelector.Set(this.Randomizer);
   this.JumbleWordsSelector.Select();
};
HouseMiniGames.prototype.SetJumbleData = function() {
   var i;

   //UNLOGGED

   this.JumbleWords = [ Words7a, Words7b, Words7c, Words7d, Words7e, Words7f, Words7g, Words7h, Words7i, Words7j, Words7k, Words7l, Words7m,
			Words7n, Words7o, Words7p, Words7q, Words7r, Words7s, Words7t, Words7u, Words7v, Words7w ];
   this.JumbleDistribution = new Array(this.JumbleWords.length);
   for (i=0;i<this.JumbleWords.length;++i)
      this.JumbleDistribution[i] = this.JumbleWords[i].length;
/*
   this.ShuffleInfo = new ShuffleInfoPanel();
   this.ShuffleInfo.Set(this.Screen, this.GraphicsTool, this.TextWriter);
   this.ShuffleInfo.Display();
*/
};
HouseMiniGames.prototype.SelectJumbleWords = function() {
   var iSlot, iLttr;
   var aWords;

   //UNLOGGED

   //Get first 3 words
   do {

      //Pick top-left letter, get list of words starting with it
      iSlot = this.Randomizer.GetSlot(this.JumbleDistribution);
      this.GetTruncatedList(this.JumbleWords[iSlot]);

      //Get top and left words
      aWords = new Array(2);
      this.Randomizer.GetUniqueIndices(aWords, 2, this.WordList.length);
      this.FourWords[0] = this.WordList[aWords[0]];
      this.FourWords[3] = this.WordList[aWords[1]];

      //Get right word
      iLttr = Alphabet.indexOf(this.FourWords[0][6]);
      this.GetTruncatedList(this.ShuffleWords[iLttr]);
      iSlot = this.Randomizer.GetIndex(this.WordList.length);
      this.FourWords[1] = this.WordList[iSlot];

      //Get bottom word
      iLttr = Alphabet.indexOf(this.FourWords[3][6]);
      this.GetTruncatedList(this.ShuffleWords[iLttr], this.FourWords[1][6]);
   } while (this.WordList.length==0);

   //Pick final word
   iSlot = this.Randomizer.GetIndex(this.WordList.length);
   this.FourWords[2] = this.WordList[iSlot];
};
HouseMiniGames.prototype.PlayWordJumble = function() {

//   this.AnimationFrameHandle = requestAnimationFrame(this.PlayWordJumble.bind(this));

};
