This project is to demostrate the work of React+Redux+Metamask in typescript by implementing a **Crypto Swap Demo**.

![image](https://user-images.githubusercontent.com/85455/143508661-be3ac5f4-0a76-4033-ba41-202c036e4259.png)

The application can let you:
- connect with Metamask for login
- connect to [CoinGecko API](https://www.coingecko.com/api/documentations/v3#/) to get the real time price of USDC/WBTC/ETH
- swap between USDC/WBTC/ETH with dummy data in the wallet in Redux (no blockchain transactions)
- keyboard navigation support through TAB

## Overview
### Tech Stack
#### React+Redux (Web application framework)
Start with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
```
npx create-react-app crypto-swap-demo --template redux-typescript
```

The template will come with redux [slice pattern](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go).

After installation you will need to eject CRA:
```
npm run eject
```

#### react-router (React modules for handling navigation)
React applications are commonly built as a SPA (Single Page Application) with URL dynamically rewriting. [react-router](https://reactrouter.com/) is essential and also [connected-react-router](https://github.com/supasate/connected-react-router) for Redux binding with react-router.

After deployed on Github page, without server-side support, the web application will get a 404 fail if user do a browser refresh on some path (non-root path). To solve this, either use `HashRouter` with `HashHistory` in [react-router](https://reactrouter.com/web/api/HashRouter), or [do a trick with 404 handling](https://github.com/rafgraph/spa-github-pages). This project uses the latter one.

#### webpack (bundler)
[webpack](https://webpack.js.org/) comes with CRA (Create React App) for bunlding. Also [babel](https://babeljs.io/) and other webpack plugins. You may refer to `package.json` for detail.

#### node-sass (SCSS support)
This project uses SCSS modules so [node-sass](https://www.npmjs.com/package/node-sass) is required for devDependency.

#### numeral.js (number formatting and calculation)
By default the number in JS is a 64bits double with 53bits mantissa which is dangerous for decimal calculation (BTC is expensive!). Thus you may want to have a library to help you to calculate and format the numbers.

In particular, since CoinGecko API only provides a limited list of `vs_currency` for coin pairs (no WBTC and USDC in the list), to get the price of WBTC/USDC you will need to get the price of WBTC and USDC in USD first and then calculate the price for the WBTC/USDC:
`WBTC/USDC = WBTC/USD * USD/USDC = (WBTC/USD) / (USDC/USD)`

#### ethers.js (Ethereum interacting library)
[ethers.js](https://docs.ethers.io/v5/) is used to connect Metamask and handle further tasks on ethereum if necessary.

---
### Avalable scripts
dev run:
```
npm start
```
build for web application (on Github page, [here](https://shawtim.github.io/crypto-swap-demo/))
```
npm run build:github
```
---
### UI flow
There are 2 pages in this application.

![image](https://user-images.githubusercontent.com/85455/143505399-6b295d2f-d111-4e96-83ce-152829a759d5.png)

No matter which pages or what path you are at, if you dont have Metamask connected, you will be redirected to the *Connect Wallet Page*.
Click the button to connect Metamask to continue.

![image](https://user-images.githubusercontent.com/85455/143505549-e7d7a8dd-a7ce-4b19-9292-98acdef238c7.png)

Once you have Metamask connected, no matter which pages or what path you are at, you will be redirected to the *Swap Page*.
In *Swap Page* there are 2 components. On the left hand side it's *Crypto Balances Component*, on the right hand side it's *Crypto Swap Component*.

![image](https://user-images.githubusercontent.com/85455/143505823-add92ecf-f6f3-4bf0-aaff-89d726103b14.png)

In *Crypto Balance Component* you may check the crypto balance in your dummy wallet, with the market value of your crypto asset calculated in USD.
You may click on the button with right arrow to start swapping cryptos.

![image](https://user-images.githubusercontent.com/85455/143506024-627ee3e5-ed5c-488f-beb0-29d8b2821631.png)

For example you can set a certain amount of Ethereum:
The swapped crypto amount will be reflected immediately.

![image](https://user-images.githubusercontent.com/85455/143508786-5072fb85-b0a4-4585-94ea-b0f10b740377.png)

You can choose another pair, say, ETH/WBTC.

![image](https://user-images.githubusercontent.com/85455/143508875-1262f76d-17b4-4d3b-8788-68372c2acfaa.png)

The *Review Button* will only be active when the coin pair is different pair and the amount of crypto being swapped is not zero. Click *Review Button* to continue.

![image](https://user-images.githubusercontent.com/85455/143509095-58656f2d-4479-4515-a6f0-623e1aae5359.png)

Now you will be able to review the transaction details, what and how much you will receive and how much is the fee. If no problem, click *Approve Swap Button* to continue. If not, you may click either the *Cancel Button* or the *X Button* to cancel the transaction.

Note that if the received amount < 0 (i.e. transaction fee > swapped amount), you cannot approve the transaction (technically you can, but why?)

![image](https://user-images.githubusercontent.com/85455/143509239-77d44e82-13d4-43fa-861a-f29fb3eec037.png)

This is the final step for swapping. You will need to click *Confirm Button* to continue, or, click either the *Cancel Button* or the *X Button* to cancel the transaction.

![image](https://user-images.githubusercontent.com/85455/143509283-b774cda7-682f-4147-a074-ae0f708ef7c7.png)

Success! You can now see 8.45 ETH is swapped to WBTC.
