<h1>CS261 Group Project</h1>

Please follow the steps below to run the project on your machine

<h3>Step 1: Install docker</h3>
We recommend installing Docker Desktop : https://www.docker.com/products/docker-desktop

<h3>Step 2: Start docker</h3>
Run Docker Desktop if downloaded.

<h3>Step 3: Build and run containers</h3>
Run the following command in the root directory of the project.
```
   docker-compose up --build
```

<h3>Step 4: Enjoy using SkillQuest!</h3>
Go to <a href="localhost:3000">localhost:3000</a> and start using skillQuest!

<hr>

<h3>Email Verification</h3>
As registration requires email verification, we decided to continue using Mailtrap (<a href="https://mailtrap.io">https://mailtrap.io </a>) in the 
production environment - this is to avoid spamming the inbox of whoever might run this 
application. That said, in a real deployment, a production grade mail server would be used.

The credentials to the Mailtrap account are as follows:

```
Email : skillquest.group46@gmail.com
Password: gJESf(2xh*ph{Q9h
```

<hr>

<h3>Possible Issues</h3>
1) It has been noted, that installing Flask in the <strong>api</strong> container via pip occasionally 
results in a timeout. In such circumstances, please re-run the provided command.

2) It has been noted, that running the containers for the 
first time, despite the introduced retry logic and 
correctly set dependencies in the docker-compose.yml file, 
might still result in no connection being made to the database (although rarely), 
in such cases, re-run the provided command.

Please do not be deterred by long container building times, there are a number of dependencies that
yarn has to install, which can take up to two, three minutes.



