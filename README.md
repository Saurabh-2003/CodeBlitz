
![Logo](public/codeblitz.png)


# CodeBlitz

Code Blitz is a dynamic, Leetcode-inspired project where users can practice Data Structures and Algorithms (DSA) questions. It supports multiple programming languages, including Python, JavaScript, and C++, offering an immersive environment for learning and problem-solving. The platform is built using cutting-edge web technologies, making it efficient, scalable, and user-friendly.

## Tech Stack

**Client:** NextJS, Redux, TailwindCSS

**Backend:** NextJS, Prisma ORM with MySQL, NextAuth, Docker, Docker Compose


## Features

Code Blitz offers an intuitive and feature-rich environment for both users and administrators:

- Homepage: A welcoming introduction to the platform and its features.
- Problems Page: Browse and select from a comprehensive list of DSA problems.
- Problem Page: View detailed problem descriptions and submit solutions.
- Profile Page: Users can track their recent submissions and update profile information.
- Admin Dashboard: A powerful backend management interface with multiple sections:
  - Stats Overview: Displays critical statistics such as active users, authors, and recently added problems.
  - Problem Management: Administrators can add, update, or delete problems.
  - User Management: Admins can view, update, and delete user accounts, as well as assign roles.


## Lessons Learned

The primary motivation behind building Code Blitz was to enhance my understanding of Prisma, Next.js, Docker, and Docker Compose. Throughout the development, I learned how to:

- Work with Prisma to interact with databases more efficiently.
- Structure and manage routes using Next.js’s app directory.
- Integrate Redux into a Next.js application for state management.
- Group services in Docker Compose, manage volumes, and create private networks for seamless container communication.
## Run Locally

Clone the project

```bash
  git clone https://github.com/Saurabh-2003/CodeBlitz.git
```

Go to the project directory

```bash
  cd CodeBlitz
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET`

`NEXTAUTH_URL=http://localhost:3000`

`DATABASE_URL= mysql://<username>:<password>@host.docker.internal:3306/database`

`NEXTAUTH_SECRET='NEXTAUTH_SECRET'`

`CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET`

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
## Deployment

To deploy this project run.

```bash
  docker compose up --build
```


## Docker Compose Config

```yaml
services:
  cpp_service:
    build:
      context: ./coderunners/cpp_coderunner
      dockerfile: Dockerfile
    volumes:
      - codeblitz_shared_volume:/code_execution
    working_dir: /code_execution
    entrypoint: ["/bin/sh", "-c", 'exec "$@"', "--"]

  js_service:
    build:
      context: ./coderunners/javascript_coderunner
      dockerfile: Dockerfile
    volumes:
      - codeblitz_shared_volume:/code_execution/external
    working_dir: /code_execution
    entrypoint: ["/bin/sh", "-c", 'exec "$@"', "--"]

  python_service:
    build:
      context: ./coderunners/python_coderunner
      dockerfile: Dockerfile
    volumes:
      - codeblitz_shared_volume:/code_execution
    working_dir: /code_execution
    entrypoint: ["/bin/sh", "-c", 'exec "$@"', "--"]

  nextjs_service:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - cpp_service
      - js_service
      - python_service
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      DATABASE_URL: mysql://<username>:<password>@host.docker.internal:3306/codeblitz
      NEXTAUTH_SECRET: NEXTAUTH_SECRET
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - codeblitz_shared_volume:/code_execution
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  docker_sock:
    external: true
  codeblitz_shared_volume:
    external: true
```

## Related

1) This is the project from where I learned how i could use docker with next js backend. Improvements I made over this is that I used shared volume accross the services using docker compose, I also added javascript language cause i love javascript :-)

[myCodeJudge by notpritam](https://github.com/notpritam/myCodeJudge)


2) To connect your local system mysql database to docker container i.e nextjs_service follow this article. I also followed some instructions and I dont know what i did so here is the article  :‑|
[stackoverflow article](https://stackoverflow.com/questions/44543842/how-to-connect-locally-hosted-mysql-database-with-the-docker-container)
