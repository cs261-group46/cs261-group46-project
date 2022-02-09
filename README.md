<h1>CS261 Group Project</h1>

Please follow the steps below to make
sure you have the same setup to everyone else.

<h3>Step 1: Cloning the repository</h3>
Run

```shell
git clone https://github.com/cs261-group46/cs261-group46-project.git
```

in the directory you wish the project to reside in.


<h3>Step 2: Creating a virtual environment</h3>

If you have never worked with python much before, and you don't
know what a virtual environment is, to put it simply,
it's a way for the developer to isolate the Python interpreter
and libraries installed as part of a project from other projects
and the system - so you definitely want to use them!

In order to create a virtual environment, run:

```shell
python3 -m venv ./cs261-group46-project/venv
```

<h3>Step 3: Activating the virtual environment</h3>

```shell
   cd cs261-group46-project
```

Then run:

```shell
. venv/bin/activate
```

<h3>Step 4: Installing dependencies</h3>
To install python dependencies, run (make sure you activated venv in step 3):

```shell
pip install -r requirements.txt
```

To install node dependencies, run:

```shell
npm install
```

To run some initial setup tasks, run

```shell
npm run setup
```

<h3>Bonus: Running the server(s)</h3>
During the development, there are two servers
that will need to run : the backend server and the react server.

1. Start the backend server by running : `npm run start-api` or `yarn start-api`. This
   will start a server on port 5000.
2. In a different terminal, start the react server by running `npm start` or `yarn start`. This
   will start a react server.