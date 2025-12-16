import { buildHtml } from '../src/components/RealTimeChart/AmChart';

describe('AmChart HTML', () => {
  it('embeds provided accent colors', () => {
    const html = buildHtml('#111111', '#222222', '#333333');
    expect(html).toContain('#111111');
    expect(html).toContain('#333333');
  });

  it('includes chart container and series wiring', () => {
    const html = buildHtml('#123456', '#abcdef', '#fedcba');
    expect(html).toContain('<div id="chartdiv"></div>');
    expect(html).toContain('am5xy.SmoothedXLineSeries');
  });
});
