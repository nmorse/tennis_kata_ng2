export class TennisPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('tennis-app h1')).getText();
  }
}
