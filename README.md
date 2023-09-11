# NodeJsProj - Michael Shermak

## Server Configuration

- The server runs on port 8181 on localhost.
- The server utilizes MongoDB as the database.
- The server initiates an initial data for the DB, as long as there is no data at all on the Database

## Server's Characteristics

- the server is made for managing the Database with business cards and serve a few commands that will be detailed and explained at the API DOCS.

## Google API Integration

To use the Google API, follow these steps:

1. Open the server's front (index) page.
2. Click on the login button to initiate the Google API integration.

## Server Connection

When connecting to the server, you will encounter the following messages:

- Connection to MongoDB = local/atlas
- Server running on http://localhost:8181/
- Connected to MongoDB

## Environment Setup

The server can be run in two environments: production and development.

- To start the server in production mode, use the command: [npm start]:(atlas MongoDB)
- To start the server in development mode, use the command: [npm run dev]:(localhost mongoDB)

## Input Requirements

Certain API endpoints may require specific inputs from the client. Please refer to the documentation for each API for the required inputs.

## Authorization and Authentication

To access certain endpoints, [AUTHORIZATION known as TOKEN] and [AUTHENTICATION such as ADMIN or Business User] may be required. Please refer to the documentation for each API to understand the authorization and authentication process.

## BONUSES INCLUDED

- ### You may change business number for a card for as long as its not already occupied by another business card

- ### You may login or register using the google API using the front page (expanded explanation at the paragraph above)

- ### For every error hapenning on the server - there will be a document log (.log) including all the errors happened during using the session, each document is made for each date on the calendar

- ### For every 3rd time a user has failed logging into an account using wrong password but for the same email - the email will be blocked from logging in thus email for the duration of 24 hours. this block is saved on the mongoDB, that way the server will block the failed logging user even if the app has crashed and re-established

## API Documentation

### **url:http://localhost:8181/**

### **Default URL for proxy: /api**

### GET ALL USERS

#### USAGE: get all users info on the DB

- HTTP Method: [GET]
- URL End Point Request: [/users/users]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]

### GET A USER

#### USAGE: get user info from the DB

- HTTP Method: [GET]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### GET USER THEMSELVES

#### USAGE: get user info from the DB using token info for themselves

- HTTP Method: [GET]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### REGISTER USER

#### USAGE: Register a user into the DB

- HTTP Method: [POST]
- URL End Point Request: [/users/users]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Requirements for body (object):

  - name{
    - first: string, min length 2, required
    - last: string, min length 2, required
      }
  - email: string, email regex (example@email.com), required
  - password: string, min length 8, must contain: 1 capital letter, 1 small letter, 1 digit and one
    of the following chars {#?!@$%^&\*-}, required
  - image{
    - url: string, must be url, required
    - alt: string, min length 2, max length 256, required
      }
  - isBusiness: boolean, required

### LOGIN USER

#### USAGE: Recieve a token from the server for a user

- HTTP Method: [POST]
- URL End Point Request: [/users/login]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Requirements for body (object):
  - email: string, email regex (example@email.com), required
  - password: string, min length 8, must contain: 1 capital letter, 1 small letter, 1 digit and one
    of the following chars {\*#?!@$%^&-}, required

### EDIT USER

#### USAGE:Edit the user's own details

- HTTP Method: [PUT]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]
- Requirements for body (object):
  - name{
    - first: string, min length 2, required
    - last: string, min length 2, required
      }
  - image{
    - url: string, must be url, required
    - alt: string, min length 2, max length 256, required
      }
  - isBusiness: boolean, required

### EDIT BUSINESS STATUS

#### USAGE: Invoke/revoke isBusiness boolean value

- HTTP Method: [PATCH]
- URL End Point Request: [users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### DELETE USER THEMSELVES

#### USAGE: Delete the user of the given token from the DB

- HTTP Method: [DELETE]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### DELETE A USER

#### USAGE: Delete a user from the DB

- HTTP Method: [DELETE]

- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### GET ALL CARDS

#### USAGE: Recieve an array containing all the card in the DB

- HTTP Method: [GET]
- URL End Point Request: [/cards/cards]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]

### GET A SPECIFIC CARD

#### USAGE: Recieve Information of a specific card

- HTTP Method: [GET]
- URL End Point Request: [/cards/cards/:id]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the card the api should ask the info for]

### GET USER'S CARDS

#### USAGE: Recieve an array containing all the cards made by specific user provided by token

- HTTP Method: [GET]
- URL End Point Request: [/cards/my-cards]
- Authentication Needed (token): [Yes(owner)]
- Authorizations Needed: [none]

### CREATE A CARD

#### USAGE: Create a card file into the DB

- HTTP Method: [POST]
- URL End Point Request: [/cards/cards]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [BUSINESS]
- Requirements for body (object):
  - title: string, min length 2, max length 256, required
  - price: string, min length 2, max length 256, required
  - image{
    - url: string, must be url, required
    - alt: string, min length 2, max length 256, required
      }

### EDIT A CARD

#### USAGE: Edit the card's details on the DB

- HTTP Method: [PUT]
- URL End Point Request: [/cards/cards/:id]
- Authentication Needed (token): [Yes(owner)]
- Authorizations Needed: [CARD OWNER ONLY]
- Params:
  - [id]: [the id of the card the api should ask the info for]
- Requirements for body (object):
  - title: string, min length 2, max length 256, required
  - price: string, min length 2, max length 256, required
  - image{
    - url: string, must be url, required
    - alt: string, min length 2, max length 256, required
      }

### LIKE A CARD

#### USAGE: Adds the id of the provided token into an array of 'likes' property in the card-object

- HTTP Method: [PATCH]
- URL End Point Request: [/cards/cards/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the card the api should ask the info for]

### DELETE A CARD

#### USAGE: Delete a card from the DB

- HTTP Method: [DELETE]
- URL End Point Request: [/cards/cards/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN/OWNER OF CARD]
- Params:
  - [id]: [the id of the card the api should ask the info for]

for any question you can contact me :
Micasher1996@gmail.com
Michael Shermak
