# Bus-Ticket-Booking

## Description

This project is created for learning purposes. It is a bus ticket booking application where users can book tickets for bus journeys. The project uses the latest version of Angular for the front-end and Node.js for the back-end. Additionally, it utilizes WebSockets for real-time updates and MySQL for the database.

## Prerequisites

- Node.js (latest version)
- MySQL installed on your machine
- Redis installed on your machine

## Project Setup

### UI Setup

1. Navigate to the project directory:
    ```bash
    cd /Bus-Ticket-Booking/BUS-TICKET-UI
    ```

2. Install the dependencies:
    ```bash
    npm i
    ```

3. Start the UI server:
    ```bash
    npm start
    ```

### Server Setup

1. Navigate to the project directory:
    ```bash
    cd /Bus-Ticket-Booking/BUS-TICKET-SERVER
    ```

2. Install the dependencies:
    ```bash
    npm i
    ```

3. Create a `.env` file and take reference from `/Bus-Ticket-Booking/BUS-TICKET-SERVER/env.js`.

4. Import the `mysqldemo.sql` file into your MySQL database file path `/Bus-Ticket-Booking/BUS-TICKET-SERVER/mysqldemo.sql`.

5. Start the server:
    ```bash
    npm start
    ```

## Additional Information

- Ensure MySQL is running and properly configured.
- Ensure Redis is running and properly configured.
- Make sure to set up the database schema as required by the application.
- For any issues, please check the logs or reach out to the support team.