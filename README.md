## Title
**Store details and Ratings Managment**

## Objective

The goal is to build a web application for submitting and managing store ratings, with role-based access for different users.

## Tech Stack

-**Backend**: Node.js with Express.js for API development. Use it to handle routes, middleware for authentication, and database interactions.

- **Database**: SQLite for lightweight, file-based storage. Ideal for this project as it requires no server setup. Use an ORM like Sequelize or raw SQL queries via `sqlite3` package.

- **Frontend**: React.js for building dynamic UIs. Use hooks for state management, React Router for navigation

## Completion Instructions

***Database Schema Design***

Design a normalized schema to avoid redundancy and ensure data integrity. Use SQLite's features like foreign keys for relationships.

### Suggested Tables

1. **Users** (Stores all user data, including admins, normal users, and store owners)
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `name`: TEXT NOT NULL (min 20 chars, max 60 chars)
    - `email`: TEXT UNIQUE NOT NULL (validated as email)
    - `password`: TEXT NOT NULL (hashed; 8-16 chars with uppercase and special char)
    - `address`: TEXT (max 400 chars)
    - `role`: TEXT NOT NULL (enum-like: 'admin', 'user', 'owner')

2. **Stores** (Stores registered on the platform, owned by users with 'owner' role)
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `name`: TEXT NOT NULL (min 20 chars, max 60 chars)
    - `email`: TEXT UNIQUE NOT NULL (validated as email)
    - `address`: TEXT (max 400 chars)
    - `owner_id`: INTEGER REFERENCES Users(id) ON DELETE CASCADE (links to a Store Owner user)

3. **Ratings** (User-submitted ratings for stores)
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `user_id`: INTEGER REFERENCES Users(id) ON DELETE CASCADE
    - `store_id`: INTEGER REFERENCES Stores(id) ON DELETE CASCADE
    - `rating`: INTEGER NOT NULL (1-5)
    - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP
    - UNIQUE (user_id, store_id) to prevent duplicate ratings per user-store pair (allow updates via replacement)

### Schema Best Practices

- **Normalization**: Separate users, stores, and ratings to avoid data duplication.
- **Indexes**: Add indexes on frequently queried fields like `email` in Users, `name` in Stores, and `store_id` in Ratings for faster searches.
- **Constraints**: Enforce uniqueness (e.g., emails) and foreign keys.
- **Migrations**: Use a script to create tables on app start or via a migration tool.
- **Calculated Fields**: Don't store average ratings in Stores; compute them dynamically via SQL queries (e.g., `AVG(rating)` GROUP BY store_id).
- **Potential Extension**: If a store owner can own multiple stores, adjust the schema accordingly (but requirements suggest one-to-one for simplicity).

Example SQL for table creation (in backend init script):

```
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT,
    role TEXT NOT NULL
);

```
-- Similar for Stores and Ratings

### Functionality

***Backend Design (Node.js + Express.js)***
    Build a RESTful API to handle all operations. Use middleware for authentication 

***Authentication and Authorization***

- Implement JWT: On login, verify credentials and issue a token with user ID and role.
- Middleware: Protect routes with `authMiddleware` that verifies token and attaches user data to req.
- Password Handling: Always hash passwords with bcrypt before storing.
- Sessions: Alternative to JWT, but JWT is stateless and simpler for this scale.

### Suggested API Endpoints

Group endpoints by role/functionality for organization.

- **Auth Routes** (Public):
    - POST `/api/auth/signup`: For Normal Users (validate fields, hash password, insert into Users with role 'user').
    - POST `/api/auth/login`: Verify email/password, return JWT.
    - POST `/api/auth/logout`: Client-side token removal (no server action needed).
    - PATCH `/api/auth/update-password`: Authenticated; update user's password (validate old/new).

- **Admin Routes** (Protected; role='admin'):
    - POST `/api/admin/users`: Add new user (any role; validate fields).
    - GET `/api/admin/dashboard`: Fetch totals (users count, stores count, ratings count).
    - GET `/api/admin/stores`: List stores with name, email, address, average rating (support filters/sort via query params).
    - POST `/api/admin/stores`: Add new store (assign owner_id if applicable).
    - GET `/api/admin/users`: List users with name, email, address, role (support filters/sort).
    - GET `/api/admin/users/:id`: View user details (include store rating if role='owner').

- **User Routes** (Protected; role='user'):
    - GET `/api/user/stores`: List stores with name, address, overall rating, user's rating (join Ratings), search by name/address.
    - POST `/api/user/ratings`: Submit rating for a store (1-5; insert or update in Ratings).
    - PATCH `/api/user/ratings/:storeId`: Modify existing rating.
- **Owner Routes** (Protected; role='owner'):
    - GET `/api/owner/dashboard`: Get average rating and list of raters (users who rated their store).

```
Given two files `app.js` and a database file `database.db` consisting of four tables `colleges`, `users`, `favorite_colleges` and `reviews`.

Write APIs to perform CRUD operations on the tables `users`, `stores`, `ratings` containing the following columns,

**users Table**

| Columns    | Type       |
| ---------- | ---------- |
| id         | INTEGER    |
| name       | VARCHAR(60)|
| password   | TEXT       |
| address    | TEXT       |
| role       | VARCHAR(20)|

**stores Table**

| Columns       | Type    |
| ------------- | ------- |
|  id           | INTEGER |
|  name         | VARCHAR |
|  email        | VARCHAR |
|  address      | VARCHAR |
|  owner_id     | INTEGER |

**ratings Table**

| Columns       | Type    |
| ------------- | ------- |
| id            | INTEGER |
| owner_id      | INTEGER |
| rating        | INTEGER |
| created_at    | TEXT    |

```

### API 1

#### Path: `/api/auth/signup

#### Method: `POST`

#### Description:

Signup Api for Normal Users

#### Request

```
[
  {
    "name" : "Bhanu Prakash",
    "password" : "bhanu@1234",
    "address" : "1-22/A-6, Kukatpally, Hyderabad",
    "email" : "bhanuprakashdevari@gmail.com",
    "role" : "admin"
}
]
```
### Response

```
{jwt_token, id}

```

### API 2

#### Path: `/api/admin/user

#### Method: `POST`

#### Description:

POST Api to add user only for Admins

#### Request

```
[
  {
    "name" : "Bhanu Prakash",
    "password" : "bhanu@2025",
    "address" : "1-22/A-6, Kukatpally, Hyderabad",
    "email" : "bhanuprakashdevari@gmail.com",
    "role" : "admin"
}
]
```

### API 3

#### Path: `/api/auth/login`

#### Method: `POST`

#### Description: 

Login api for authencate users

#### Request

```
{
    "email" : "bhanuprakashdevari@gmail",
    "password : "bhanu@2025"
}
```

#### Response 

```
{jwt_token, id}

```

### API 4

#### Path: `//api/auth/update-password`

#### Method: `PUT`

#### Description:

PUT Api to change password for authencate users

#### Response

Password Updated

### API 5

#### Path: `/api/adim/users`

#### Method: `GET`

#### Description:

GET API to display all users
#### Response

```
[
    {
        "name": "Vara Prasad Madivala",
        "email": "varaprasad@gmail.com",
        "address": "5-33/e-33, Aziz Nagar, Hyderabad",
        "role": "owner"
    }
    ...
]
```

### API 6

#### Path: `/api/admin/users/:userId`

#### Method: `GET`

#### Description:

GET Api to get a single user details

#### Response

```
{
    "name": "Vara Prasad Madivala",
    "email": "varaprasad@gmail.com",
    "address": "5-33/e-33, Aziz Nagar, Hyderabad",
    "role": "owner"
}

```

#### API 7

#### PATH : `/api/admin/dashboard`

#### Method: `GET`

#### Description:

GET Api to display all table count

#### Response

```
{
    "stores": 4,
    "users": 3,
    "rating": 4
}

```

#### API 8

#### PATH : `/api/admin/stores`

#### Method: `POST`

#### Description:

POST API to add store to store table

#### Request

```
{
    "name" : "Techworld Electonics",
    "email" : "techworld@gmail.com",
    "address" : "KPHB, Kukatpally, Hyderabd",
    "owner_id" : 3
}

```
#### Response

"Store added successfully"

#### API 9

#### PATH : `/api/admin/stores`

#### Method: `GET`

#### Description:

GET Api to display all stores and their average ratings

#### Response

```
[
    {
        "storeName": "Book store",
        "email": "bookstore@gmail.com",
        "address": "Vivek Nagar, Kukatpally, Hyderabd",
        "rating": 3.75
    },
    ...
]

```

<br/>

Use `npm install` to install the packages.


## Frontend Design (React.js)

Build a single-page application (SPA) with role-based routing. Use React Router to redirect based on role after login.

### Component Structure

- **Shared Components**: Header (with logout), Footer, Form Components (with validation).
- **Auth Pages**: LoginForm, SignupForm (for Normal Users).
- **Admin Dashboard**: Stats cards (totals), Tables for users/stores (with filters, sorting via libraries like `react-table`).
- **User Dashboard**: Store list (search bar, rating submission via stars or dropdown), Profile for password update.
- **Owner Dashboard**: Rating summary, Rater list.

#### Must Have
    
-**Backend**: Node.js with Express.js for API development. Use it to handle routes, middleware for authentication, and database interactions.
- **Database**: SQLite for lightweight, file-based storage. Ideal for this project as it requires no server setup. Use an ORM like Sequelize or raw SQL queries via `sqlite3` package.
- **Frontend**: React.js for building dynamic UIs. Use hooks for state management, React Router for navigation,


#### Nice to Have

**Additional Libraries** (optional but recommended):

- Backend: `bcrypt` for password hashing, `jsonwebtoken` (JWT) for authentication, `body-parser` for request parsing.
- Frontend: `react-router-dom` for routing, `formik` or similar for form handling and validation, `antd` or `material-ui` for UI components.

    - Cross-cutting: `cors` for enabling frontend-backend communication.

***Additional Best Practices***

- **Security**: Hash passwords, use HTTPS in prod, sanitize inputs.
- **Performance**: Optimize queries (e.g., use JOINs for ratings), lazy-load components.
- **Code Quality**: ESLint/Prettier for formatting, modular files, comments.
- **Testing/Deployment**: Test locally, consider deploying to Heroku/Vercel for demo.
- **Edge Cases**: Handle no ratings (show 0 or N/A), duplicate emails, invalid roles.
- **Accessibility**: Add ARIA labels, keyboard navigation.


### Submission Guidelines

- Provide a GitHub repository with the complete codebase.
- Include a `README.md` with:
    - Setup instructions (e.g., `npm install`, database setup).
    - API documentation (endpoints, request/response formats).
    - Screenshots or a demo link (if hosted).
- Ensure the application is fully functional and meets all requirements.
- Test thoroughly for edge cases and validations.

### BackEnd Links

Github     :https://github.com/Bhanu-techy/storesListBackend.git
Api(render):https://storeslistbackend.onrender.com

### Sample Login details for testing
 
 ***Admin***
1. email:bhanuprakashdevari@gmail.com
   password : bhanu@1234

 ***owner***

1. email : varaprasad@gmail.com
   password : vara@1234

2. email : sharathchandra@gmail.com
   password : sharath@2025

***user***

1. email : saikumar@gmail.com
   password : sai@1234

2. email:bhanu@gmail.com
   password : bhanu@1234