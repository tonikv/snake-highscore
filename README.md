# Snake High Score Database API
This is a simple RESTful API for storing and retrieving high scores for a game of Snake. The API is built using Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites
To run this project, you will need:
Node.js (v10.16 or higher)
MongoDB (v4.0 or higher)

### Installation
To install the project, follow these steps:

1. Clone the repository to your local machine:
git clone <https://github.com/YOUR-USERNAME/snake-high-scores.git>

2. Install the project dependencies:
cd snake-high-scores
npm install

3. Set the following environment variables:
PORT: The port on which the server will listen for requests (default: 3000)
URI: The MongoDB connection string

4. Start the server:
npm start

## Usage
The following endpoints are available:

GET /api/all: Retrieve all high scores, sorted by score in descending order.
DELETE /api/delete: Delete the score entry with the smallest score value.
POST /api/store: Store a new high score entry in the database.
The POST /api/store endpoint requires a JSON payload with the following properties:

{
  "name": "player name",
  "score": 100
}

## Rate Limiting
To prevent abuse of the POST /api/store endpoint, this API uses rate limiting. By default, each IP address is limited to 1 request per second. You can adjust the rate limit settings in the app.js file.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
