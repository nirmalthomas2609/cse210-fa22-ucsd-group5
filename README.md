# Local-First Tweet Manager Application

Welcome to the Github repository for Tweet Manager, the a local first application that acts as a note taking and tweet management system!

To view our most recent release, please check [Releases](https://github.com/nirmalthomas2609/cse210-fa22-ucsd-group5/releases).

To run the application download a release, unzip and open the index.html within on your favorite browser!

The contents of this repository were developed by the Gordan Ramsey Engineering Company (GRECo):

Kalen Cantrell, Alexis Flores, Anshul Shah, Mayank Sharan, Akshaya Sundaram, Nirmal Thomas, Yizheng Yu

# Resources for Onboarding

Welcome to the codebase! We have a range of tools you should add to your boookmarks to help in your development. Please navigate to each of the links below and explore the contents, as they will help understand our system as a whole, our codebase, and our decisions.

### [GRECo Development Resources Homepage](https://nirmalthomas2609.github.io/cse210-fa22-ucsd-group5/)

### [Architecture/Component Overview](https://nirmalthomas2609.github.io/cse210-fa22-ucsd-group5/c4_model/C4_Documentation.html)

- Before you start any coding, please review the diagrams in the link above. In it, you will find a System Context Diagram, a container diagram, a component diagram, and a code map. We believe these are essential to review in order to navigate the code base easily.

### [Natural Docs Documentation](https://nirmalthomas2609.github.io/cse210-fa22-ucsd-group5/naturaldocs/)

- This source will walk you through the front end code and back end code. Please remember to keep comment formatting consistent to ensure automatic generation and maintenance of the Natural Docs.

### [Architectural Decision Records](https://nirmalthomas2609.github.io/cse210-fa22-ucsd-group5/decisions/)

- We also believe that to effectively contribute to this application, you should understand the set of decisions that led to the current version of the application and the vision for its future. The records of backend, frontend, and UX decisions will be found in the link above.

### [Product Evolution](https://coda.io/d/Product-Evolution_deTs8LnIArk)

- This document shows the different stages of our product, as we progressed through the different iterations of our app.

- Also completed an exploratory study on Twitter integration (and built an independent demo for the same): [Twitter Demo](https://github.com/CSE210-Group5/twitter_post_api_demo_app)

## Getting Started Developing

1. First, use the command below to clone the repository to your local machine (If you do not have permission, please reach out to a current team member for permission):

`git clone git@github.com:nirmalthomas2609/cse210-fa22-ucsd-group5.git`

2. Second, using the IDE of your choice, open the repository on your local machine.

3. Third, ensure you have Node.js and npm installed using:  

`node -v`  
`npm -v`  

If either are not installed, use the directions here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm  

4. Then run the following commands from the root of the repo

`chown +x ./build_scripts/build_app.sh`
`./build_scripts/build_app.sh`

*In case any of this does not work please push your code to your branch and our CI/CD pipeline will create a build for you. This build is generated within 1 minute of the push can can be downloaded from [Releases](https://github.com/nirmalthomas2609/cse210-fa22-ucsd-group5/releases)*

Now, you are fully set up with a local, development version of Tweet Manager. Congrats!
You can launch the application by opening the index.html in the greco_notes_app folder in a browser of your choice!

## To run unit tests

In the terminal in the project directory, run the following commands to test our backend code:  

`npx jest`  

Feel free to change the test cases in the file src/db/tests/db.test.js and then rerun the unit tests to see how your changes can break the unit tests!

## Branching Policies and CI/CD Pipeline

We maintain two key branches: main and develop. 

Whenever you push to a branch, we automatically run a unit tests, build natural docs, generate a release and a code coverage summary report. These can be reviewed as workflows set up using github actions.

For pull requests to main, you need one approving review and all the automated tests to pass including an additional code linter (recommended).

## Internal Documentation

* [Decision Docs](https://coda.io/workspaces/ws-NEOCxZp2yH/folders/fl-eO22fp3pi_)
* [Processes](https://coda.io/workspaces/ws-NEOCxZp2yH/folders/fl-E7VJ8DGEow)
* [Product Specs](https://coda.io/workspaces/ws-NEOCxZp2yH/folders/fl-E7VJ8DGEow)
* [Testing Reports](https://coda.io/workspaces/ws-NEOCxZp2yH/folders/fl-0PWeswvamv)
* [Sprint Planning](https://tree.taiga.io/project/mayanksharan-cse-210-group-5/timeline)

Communication:  
Discord


