import { TennisPage } from './app.po';

describe('tennis App', function() {
  let page: TennisPage;

  beforeEach(() => {
    page = new TennisPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tennis works!');
  });
});
