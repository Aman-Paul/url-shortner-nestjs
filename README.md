<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<h1 align="center">NestJS URL Shortener Project</h1>

## Description
This repository hosts a URL shortener service developed using NestJS, a progressive Node.js framework. The primary purpose of this project is to shorten long URLs into concise, manageable links. Additionally, it offers analytical insights into the usage of these shortened URLs.

## Installation
1. Clone the repository to your local machine:
```bash
git clone https://github.com/Aman-Paul/url-shortner-nestjs.git
```

2. Navigate to the project directory:
```bash
cd url-shortner-nestjs
```

3. Install dependencies:
```bash
npm install
```

## Migrate schemas to the connected db
```bash 
# Push migrations to db 
npx prisma migrate deploy
```

## Running the app
```bash
# watch mode
npm run start:dev
```

## Test
```bash
# e2e tests
npm run test:e2e

```

## Important API endpoints
1. User Signup API
```bash
# User Signup
Endpoint: /auth/signup
Body: {
    "firstName": "Your First name",
    "lastName": "Your Last name",
    "email": "Your Email",
    "password": "Your Passowrd"
    }
Response: {
    "access_token": "Access Token"
}
```

2. User Signin API
```bash
# User Signin
Endpoint: /auth/signin
Body: {
    "email": "Your Email",
    "password": "Your Password"

}
Response: {
    "access_token": "Access Token"
}
```

3. Get Short Url API
```bash
# Get Short Url
Endpoint: /short-url
Headers: {
  "Authorization": "Bearer <Your Access Token>"
}
Body: {
    "url": "<Main Url>"
}
Response: {
    "shortUrl": "http://localhost:3333/EwMlY5AL"
}
```

4. Get Short Url Analytics API
```bash
# Get Analytics of a Short Url
Endpoint: /analytics/:shortId
Headers: {
  "Authorization": "Bearer <Your Access Token>"
}
Response: {
    "clickCount": 5,
    "clickAnalytics": [
        {
            "id": 1,
            "createdAt": "2024-03-17T18:49:17.621Z",
            "deviceType": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        },
        {
            "id": 2,
            "createdAt": "2024-03-17T18:49:25.954Z",
            "deviceType": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        },
        {
            "id": 3,
            "createdAt": "2024-03-18T06:28:42.819Z",
            "deviceType": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        },
        {
            "id": 4,
            "createdAt": "2024-03-18T06:28:51.964Z",
            "deviceType": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        },
        {
            "id": 5,
            "createdAt": "2024-03-18T06:29:56.106Z",
            "deviceType": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        }
    ],
    "mostActiveHours": [
        "11"
    ],
    "hourlyClickCounts": {
        "0": 2,
        "11": 3
    }
}
```

5. Get My Details API
```bash
    # Get My Details
    Endpoint: /users/me
    Headers: {
    "Authorization": "Bearer <Your Access Token>"
    }
    Response: {
    "id": 1,
    "email": "USER'S EMAIL",
    "firstName": "User's first name",
    "lastName": "User's Last name",
    "shortUrl": [
            {
            "id": 1,
            "shortId": "4PtFhoDu",
            "redirectUrl": "https://aman-paul.netlify.app/"
            }
        ]
    }
```

6. Get User Details by userId
```bash
    # Get User Details by userId
    Endpoint: users/:userId
    Headers: {
    "Authorization": "Bearer <Your Access Token>"
    }
    Response: {
        "id": 1,
        "email": "USER'S EMAIL",
        "firstName": "User's first name",
        "lastName": "User's Last name",
        "shortUrl": [
            {
                "id": 1,
                "shortId": "4PtFhoDu",
                "redirectUrl": "https://aman-paul.netlify.app/"
                }
            ]
    }
```

## Analytics Approach
Our analytics approach focuses on tracking user interactions, particularly clicks, to gain insights into user behavior. Below is a breakdown of the analytics response:
- **Click Count :** The total number of clicks recorded within the specified timeframe.
- **Click Analytics :** Detailed information about each click, including its unique identifier, timestamp of creation, and the device type used for the click. This data helps in understanding the distribution of clicks over time and across different devices.
- **Most Active Hours:** Identification of the hours during which the platform experiences the highest activity based on the recorded clicks. This insight is valuable for optimizing resource allocation and scheduling maintenance tasks during periods of low activity.
- **Hourly Click Counts :** A breakdown of the click count per hour. This information allows us to identify peak hours of activity and allocate resources accordingly. In the provided example, there were 2 clicks recorded at 12:00 AM (hour 0) and 3 clicks recorded at 11:00 AM (hour 11).


## Scalability Solutions
To ensure scalability and accommodate increasing user demand, we employ the following strategies:
- **Horizontal Scaling :** Our system is designed to scale horizontally, allowing us to add more servers or instances to handle increased traffic efficiently. This approach ensures that our platform remains responsive even during periods of high demand.
- **Load Balancing :** We can utilize load balancers to distribute incoming traffic evenly across multiple servers or instances. This will help prevent any single server from becoming overwhelmed, improving overall system performance and reliability.
- **Caching :** We implement caching mechanisms to store frequently accessed data, such as static content or database query results. By caching data at various layers of our infrastructure, we reduce the need for repeated computations or database accesses, thereby improving response times and reducing server load. We can also use **Redis DB** like services for the caching purposes.
- **Asynchronous Processing :** For resource-intensive tasks or operations that can be performed asynchronously, we leverage asynchronous processing techniques. By offloading these tasks to background processes or worker queues, we free up resources on the main application servers, improving overall system responsiveness.
- **Database Sharding :** As the volume of data grows, we employ database sharding techniques to horizontally partition our database across multiple servers. This allows us to distribute the database workload and queries more evenly, preventing any single database server from becoming a bottleneck.
- **Promisify Asynchronous functions :** Promisifying asynchronous functions throughout our codebase ensures a consistent and standardized approach to handling asynchronous operations. This improves code readability, simplifies error handling, and enhances composability, making our codebase more scalable and maintainable as the system grows.

## Stay in touch

- Author - [Aman Paul](https://aman-paul.netlify.com/)
- Github - [https://github.com/Aman-Paul](https://github.com/Aman-Paul)
- LinkedIn - [My LinkedIn Profile](https://www.linkedin.com/in/aman-paul-js-stack/)

## License
Nest is [MIT licensed](LICENSE).
