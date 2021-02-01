# What is Bay Area Corona Virus Tracker?

Bay Area Corona Virus Tracker is a web application that monitors COVID-19 growth rates across Bay Area counties. The time series data is sourced from SF Chronicle's [Coronavirus Tracker](https://projects.sfchronicle.com/2020/coronavirus-map/). Original data compiled by the SF Chronicle was collected from the [Centers for Disese Control](https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html), [California Department of Public Health](https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/Immunization/nCOV2019.aspx), and individual county public health departments.

The web application is fully responsive and designed to be viewed on both mobile and desktop devices. It was developed using Material-UI framework on top of Create React App (CRA). Material-UI is a simple and customizable component library to build faster, beautiful, and more accessible React applications. CRA is an integrated toolchain that provides a massive head start when building React apps. It saves time from setup and configuration and requires a single command to set up the tools to start a React project.

Bay Area Corona Virus Tracker fetches data daily from SF Chronicle's API on page load. Any data collected is cached into local storage in order to limit hits to the API. If new data is unavailable, the web application will fallback to rendering the previously fetched data.

## Mobile

<img src="/readme/mobile.png" width="197" height="400">

## Desktop

<img src="/readme/desktop.png" width="710" height="400">

# Application Features

## Data Filters

- Filter data set by 1 month, 3 months, 6 months, max data
- Filter data by total vs new cases and deaths
- Filter data by multiples vs growth rates

<img src="/readme/mobile_data_filters.png" width="197" height="400">
<img src="/readme/desktop_data_filters.png" width="710" height="400">

## Total Cases and Deaths - Multiple

- View total cases and deaths by counties
- View growth multiple from start to end date

```
multiple = end value / start value
```

<img src="/readme/mobile_total_multiple.png" width="197" height="400">
<img src="/readme/desktop_total_multiple.png" width="710" height="400">

## Total Cases and Deaths - Growth Rate

- View total cases and deaths by counties
- View growth rates from start to end date

```
growth rate = ((end value - start value) / start value) * 100
```

<img src="/readme/mobile_total_growth_rate.png" width="197" height="400">
<img src="/readme/desktop_total_growth_rate.png" width="710" height="400">

## New Cases and Deaths - Multiple

- View new cases and deaths by counties
- View growth multiple from start to end date

```
multiple = end value / start value
```

<img src="/readme/mobile_new_multiple.png" width="197" height="400">
<img src="/readme/desktop_new_multiple.png" width="710" height="400">

## New Cases and Deaths - Growth Rate

- View new cases and deaths by counties
- View growth rates from start to end date

```
growth rate = ((end value - start value) / start value) * 100
```

<img src="/readme/mobile_new_growth_rate.png" width="197" height="400">
<img src="/readme/desktop_new_growth_rate.png" width="710" height="400">

## COVID-19 Related Events

- Cross reference growth rate changes against major COVID-19 events via chart milestone flags
- View details of each major COVID-19 related event via chart tooltips

<img src="/readme/mobile_event_tooltip.png" width="197" height="400">
<img src="/readme/desktop_event_tooltip.png" width="710" height="400">

## Case and Death Numbers Reported

- View exact cases and deaths reported by each county via chart tooltips

<img src="/readme/mobile_value_tooltip.png" width="197" height="400">
<img src="/readme/desktop_value_tooltip.png" width="710" height="400">

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
