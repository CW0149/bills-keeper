/**
 * We don't test the component details here, this file is just for ensuring we don't miss anything on the UI
 * More test details(UI & UX) should be added in each component's test file
 */
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

const server = setupServer(
  rest.get('/bill.csv', (req, res, ctx) => {
    return res(ctx.text(MockedBills));
  }),
  rest.get('/categories.csv', (req, res, ctx) => {
    return res(ctx.text(MockedCategories));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders bills filters', () => {
  render(<App />);
  const filterWrapper = within(screen.getByTestId('bills-filters'));

  // renders bill type filter with 支出 and 收入 selected
  const typeSelector = filterWrapper.getByLabelText('类型');
  const outcomeChip = filterWrapper.getByText('支出');
  const incomeChip = filterWrapper.getByText('收入');

  expect(typeSelector).toBeVisible();
  expect(outcomeChip).toBeVisible();
  expect(incomeChip).toBeVisible();

  // renders date filter with 年和月 in the placeholder
  const dateSelector = filterWrapper.getByText((content, element) => {
    return (
      content === '年和月' && element?.tagName.toLocaleLowerCase() === 'label'
    );
  });
  expect(dateSelector).toBeVisible();
});

test('renders data', async () => {
  render(<App />);

  /**
   * renders bills summary with data
   */
  const summaryWrapper = screen.getByTestId('bills-summary');

  await waitFor(() => {
    expect(summaryWrapper).toHaveTextContent(
      '净收入￥29200.00总收入￥134000.00总支出￥104800.00支出明细：日常饮食 ￥-35200.00；房贷 ￥-32400.00；车贷 ￥-12000.00；房屋租赁 ￥-9000.00；家庭用品 ￥-7000.00；交通 ￥-6400.00；车辆保养 ￥-2000.00；旅游 ￥-800.00；收入明细：工资 ￥139000.00；基金投资 ￥4000.00；股票投资 ￥-9000.00；'
    );
  });

  /**
   * renders table
   */
  // renders table header
  const toRenderColumnNames = ['分类', '类型', '金额￥', '时间'];

  const tableWrapper = within(screen.getByTestId('bills-table-wrapper'));

  toRenderColumnNames.forEach((name) => {
    expect(tableWrapper.getByText(name)).toBeVisible();
  });

  // besides the time column shows the sort icon in desc
  const timeTh = within(tableWrapper.getByText('时间'));
  const sortIcon = timeTh.queryByTestId('ArrowDownwardIcon');

  expect(sortIcon).toHaveClass('MuiTableSortLabel-iconDirectionDesc');
});

test('renders add bills button', () => {
  render(<App />);

  const addBillsFormWrapper = within(screen.getByTestId('bills-add-form'));

  expect(addBillsFormWrapper.queryByText('添加账单')).toBeVisible();
});

test('renders the tool buttons on the top right of the page', () => {
  // ....
});

const MockedBills = `type,time,category,amount
0,1561910400000,8s0p77c323,5400
0,1561910400000,0fnhbcle6hg,1500
0,1563897600000,3tqndrjqgrg,3900
0,1564502400000,bsn20th0k2o,1900
0,1564588800000,8s0p77c323,5400
0,1564588800000,0fnhbcle6hg,1500
0,1564588800000,3tqndrjqgrg,5000
0,1566316800000,bsn20th0k2o,2000
0,1567267200000,8s0p77c323,5400
0,1567267200000,0fnhbcle6hg,1500
0,1569772800000,1bcddudhmh,3000
0,1569772800000,bsn20th0k2o,1500
0,1569772800000,3tqndrjqgrg,5000
0,1569859200000,0fnhbcle6hg,1500
0,1572364800000,odrjk823mj8,3000
0,1572451200000,3tqndrjqgrg,4600
0,1572451200000,3tqndrjqgrg,3800
0,1572537600000,0fnhbcle6hg,1500
0,1574179200000,odrjk823mj8,2000
0,1574870400000,1bcddudhmh,3000
0,1574956800000,8s0p77c323,5400
0,1575043200000,3tqndrjqgrg,5000
0,1575129600000,0fnhbcle6hg,1500
0,1577289600000,3tqndrjqgrg,4000
0,1577345333184,odrjk823mj8,2000
0,1577345367638,1bcddudhmh,3000
0,1577345378418,j1h1nohhmmo,800
0,1577345504140,bsn20th0k2o,1000
0,1577345517217,hc5g66kviq,2000
0,1577345576917,8s0p77c323,5400
0,1577345590283,1bcddudhmh,3000
0,1577345789527,3tqndrjqgrg,3900
0,1577548800000,8s0p77c323,5400
1,1561910400000,s73ijpispio,30000
1,1564502400000,5il79e11628,1000
1,1567094400000,1vjj47vpd28,-3000
1,1567180800000,s73ijpispio,28000
1,1569772800000,s73ijpispio,28000
1,1569772800000,1vjj47vpd28,2000
1,1572451200000,s73ijpispio,20000
1,1577345267529,s73ijpispio,30000
1,1577345303191,1vjj47vpd28,-10000
1,1577345317187,5il79e11628,1000
1,1577345463930,s73ijpispio,3000
1,1577345477581,5il79e11628,2000
1,1577345638784,1vjj47vpd28,2000`;

const MockedCategories = `id,type,name
1bcddudhmh,0,车贷
hc5g66kviq,0,车辆保养
8s0p77c323,0,房贷
0fnhbcle6hg,0,房屋租赁
odrjk823mj8,0,家庭用品
bsn20th0k2o,0,交通
j1h1nohhmmo,0,旅游
3tqndrjqgrg,0,日常饮食
s73ijpispio,1,工资
1vjj47vpd28,1,股票投资
5il79e11628,1,基金投资`;
