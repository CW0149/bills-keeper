# Getting Started with Bills Keeper

## Environment

This project runs on node >= 14.17 and uses yarn as package manager. 

### Demo
https://byprinciples.com/bills-keeper/

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Structure of this project
```
├── LICENSE
├── README.md
├── package.json
├── public
│   ├── bill.csv
│   ├── categories.csv
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── components
│   │   ├── AddBillsForm
│   │   │   ├── AddBillItem.tsx
│   │   │   ├── AddBillsForm.tsx
│   │   │   └── index.ts
│   │   ├── BillsDownloader
│   │   │   ├── BillsDownloader.tsx
│   │   │   └── index.ts
│   │   ├── BillsFilters
│   │   │   ├── BillsFilters.tsx
│   │   │   └── index.ts
│   │   ├── BillsSelect
│   │   │   ├── BillsSelect.tsx
│   │   │   └── index.ts
│   │   ├── BillsSummary
│   │   │   ├── BillsSummary.tsx
│   │   │   └── index.ts
│   │   └── BillsTable
│   │       ├── BillsTable.tsx
│   │       └── index.ts
│   ├── constants
│   │   ├── index.ts
│   │   └── types.ts
│   ├── index.css
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   └── utils
│       ├── formatter.ts
│       ├── index.ts
│       └── request.ts
├── tsconfig.json
└── yarn.lock
```

## Descriptions about this project

![avatar](./docs/Bills%20keeper.png)