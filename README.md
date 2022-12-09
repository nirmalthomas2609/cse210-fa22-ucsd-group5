# Local-First Tweet Manager Application

To view our most recent release: https://github.com/nirmalthomas2609/cse210-fa22-ucsd-group5/releases/tag/V1  

Welcome to the Github repository for Tweet Manager, the a local first application that acts as a note taking and tweet management system!  

The contents of this repository were developed by the Gordan Ramsey Engineering Company (GRECo):

Kalen Cantrell  
Alexis Flores  
Anshul Shah  
Mayank Sharan  
Akshaya Sundaram  
Nirmal Thomas  
Yizheng Yu  

# Resources for Onboarding

Welcome to the codebase! We have a range of tools you should add to your boookmarks to help in your development. Please navigate to each of the links below and explore the contents, as they will help understand our system as a whole, our codebase, and our decisions.

GRECo Development Resources Homepage:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/

Architecture/Component Overview:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/c4_model/C4_Documentation.html

- Before you start any coding, please review the diagrams in the link above. In it, you will find a System Context Diagram, a container diagram, a component diagram, and a code map. We believe these are essential to review in order to navigate the code base easily.

Natural Docs Documentation:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/naturaldocs/

- This source will walk you through the front end code and back end code. Please remember to keep comment formatting consistent to ensure automatic generation and maintenance of the Natural Docs.

Architectural Decision Records:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/decisions/

- We also believe that to effectively contribute to this application, you should understand the set of decisions that led to the current version of the application and the vision for its future. The records of backend, frontend, and UX decisions will be found in the link above.

Product Evolution:
https://coda.io/d/Product-Evolution_deTs8LnIArk

- This document shows the different stages of our product, as we progressed through the different iterations of our app.

## Getting Started Developing

1. First, use the command below to clone the repository to your local machine (If you do not have permission, please reach out to a current team member for permission):

`git clone git@github.com:nirmalthomas2609/cse210-fa22-ucsd-group5.git`

2. Second, using the IDE of your choice, open the repository on your local machine.

3. Third, ensure you have Node.js and npm installed using:  

`node -v`  
`npm -v`  

If either are not installed, use the directions here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm  

4. Fourth, install all dependencies using the following command in terminal in the project directory:  

`npm install -d`  

5. Fifth, you should build the system by running the following command in terminal in the project directory:  

`npm run build`  

If successful, there should now be a folder called dist, which contains the application bundle.  

6. Sixth, run the following command in terminal in the project directory to run the development version:  

`npm run dev`  

If you get an issue that there is a process running, you will need to shut down the current process running in port 3000. Now, you are fully set up with a local, development version of Tweet Manager. Congrats!   

## To run unit tests

In the terminal in the project directory, run the following commands to test our backend code:  

`npx jest`  

Feel free to change the test cases in the file src/db/tests/db.test.js and then rerun the unit tests to see how your changes can break the unit tests!

## Branching Policies and CI/CD Pipeline

We maintain two key branches: main and develop. 

Whenever you push to a branch, we automatically run a linter, unit tests, build natural docs, and the code coverage summary report. 

For pull requests to main, you need one approving review and all the automated tests to pass.

## Internal Documentation

Meeting Policies:  
https://coda.io/d/Meetings-Policies_dzJaSfaoHaC 

UI/UX and Frontend ADR:
https://coda.io/d/Frontend-ADR_dWFJbslsd6F

Sprint Planning:  
Taiga

Communication:  
Discord


