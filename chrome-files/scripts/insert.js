if (window.SupertreeChrome._readinessDeferrals === 1) {
  window.SupertreeChrome.start();
} else {
  this.$('#supertree-chrome-extension').toggleClass('hidden');
}
