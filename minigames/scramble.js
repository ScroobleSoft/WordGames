/*
 *  ** real-time Scrabble
 *  ** double-letter, triple-letter, double-word, triple-word tiles scattered completely randomly over the board (only 1 per row)
 */
HouseMiniGames.prototype.SetWordScramble = function() {

   //UNLOGGED

};
HouseMiniGames.prototype.PlayWordScramble = function() {

   this.AnimationFrameHandle = requestAnimationFrame(this.PlayWordScramble.bind(this));

};
