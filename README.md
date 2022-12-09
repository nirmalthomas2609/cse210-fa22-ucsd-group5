# Local-First Tweet Manager Application

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

Before you start any coding, please review the diagrams in the link above. In it, you will find a System Context Diagram, a container diagram, a component diagram, and a code map. We believe these are essential to review in order to navigate the code base easily.

Natural Docs Documentation:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/naturaldocs/

This source will walk you through the front end code and back end code. Please remember to keep comment formatting consistent to ensure automatic generation and maintenance of the Natural Docs.

Architectural Decision Records:
https://cse210-group5.github.io/cse210-fa22-ucsd-group5/decisions/

We also believe that to effectively contribute to this application, you should understand the set of decisions that led to the current version of the application and the vision for its future. The records of backend, frontend, and UX decisions will be found in the link above.

## Getting Started Developing

First, use the command below to clone the repository to your local machine (If you do not have permission, please reach out to a current team member for permission):

git clone git@github.com:nirmalthomas2609/cse210-fa22-ucsd-group5.git

Second, using the IDE of your choice, open the repository on your local machine.

Third, ensure you have Node.js and npm installed using:
node -v
npm -v

If either are not installed, use the directions here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Fourth, install all dependencies using the following command in terminal in the project directory:

npm install -d

Fifth, you should build the system by running the following command in terminal in the project directory:

npm run build

If successful, there should now be a folder called dist, which contains the application bundle. 

Sixth, run the following command in terminal in the project directory to run the development version:

npm run dev

Now, you are fully set up with a local, development version of Tweet Manager. Congrats! 

## To run unit tests

In the terminal in the project directory, run the following commands to test our backend code:

npx jest

Feel free to change the test cases in the file db.test.js and then rerun the unit tests to see how your changes can break the unit tests!





