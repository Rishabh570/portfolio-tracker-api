# portfolio-tracker-api

Portfolio tracker API lets you add/update/remove trades from securities. It also shows portfolio data, holdings overview and cumulative returns.

URL: https://portfoliotrackerapi.herokuapp.com/

### How to Use

1. **Add a trade**: Creates a new trade object and adds it to the security.
  - [POST] `/trade/add`
  - Parameters (request body):
    - _price_ (required): Buying price of the share
	- _shares_ (required): Number of shares
	- _security_ (required): Security name
	- _type_ (required): Type of trade, can be 'buy' or 'sell'
  - Returns: [Object] Trade object

2. **Update a trade**: Finds the matching trade object and updates all the fields provided in the request body.
  - [POST] `/trade/update/:tradeId`
  - Parameters (request body):
    - _price_ (optional): Buying price of the share
	- _shares_ (optional): Number of shares
	- _security_ (optional): Security name
	- _type_ (optional): Type of trade, can be 'buy' or 'sell'
  - Returns: [Object] Trade object

3. **Remove a trade**: Finds the matching trade object and removes it from the portfolio.
  - [POST] `/trade/remove/:tradeId`
  - Returns: [Object] Success message

4. **Fetching portfolio**: Fetches all the securities and trades in a portfolio.
  - [GET] `/portfolio/show`
  - Returns: [Object] Portfolio object
    - Trades inside securities are in reverse-chronological order.

5. **Fetching holdings**: Fetches all the securities in a portfolio.
  - [GET] `/portfolio/holdings`
  - Returns: [Object] Securities object

4. **Fetching returns**: Fetches cumulative returns for the portfolio
  - [GET] `/portfolio/returns`
  - Returns: [Object] Portfolio cumulative returns
