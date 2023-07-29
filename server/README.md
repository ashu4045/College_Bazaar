# Documentation

**BASE ROUTE https://localhost:8000/api**

## Admin APIs
### Get all students
```js
POST /admin/getall
```

### Approve a user
```js
POST /admin/approve/user
```
### Approve a product
```js
POST /admin/approve/product
```

### Blacklist any user
```js
POST /admin/blacklist
```

### Remove any product
```js
POST /admin/remove
```
### Whitelist any blacklisted user
```js
 POST /admin/whitelist
 ```
### Get all blacklisted users
```js
POST /admin/getAllBlacklist
```

## Authentication APIs

### Login
```js
POST /auth/login
```

### Register
```js
POST /auth/register
```

### Logout
```js
GET /auth/logout
```
### Update Profile
```js
POST /auth/update/:id
```
### View Profile
```js
GET /auth/view/:id
```
## Product APIs
### Add a product for sale
```js
POST /product/add/:sid
```

### Remove a product
```js
GET /product/remove/:sid/:pid
```

### Update a product
```js
POST /product/update/:sid/:pid
```

### View a product
```js
GET /product/viewone/:pid
```

### View all products of a particular user
```js
GET /product/view/:sid
```

### Get all products
```js
GET /product/viewall
```
### Get all products sorted according to category
```js
GET /product/get-all-category-sorted
```

### Get all products purchased by a particular user
```js
GET /product/purchased/:id
```

## Payment APIs

### To create an order on razorpay
```js
POST /payment/orders
```

### To verify the particular order while payment
```js
POST /payment/verify
```
## Key points:-
* Some abstracted routes are not mentioned here
* :id refers to user id or product id as the case may be. And :sid and :pid are seller and product ids respectively.
* For detailed information of any route, please have a look into the code itself.
