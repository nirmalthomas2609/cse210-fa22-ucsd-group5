# Backend ADR

## Usage of third-party libraries

- Decision on 10/28/2022
- Minimize the usage of third-party libraries as much as possible to keep the backend simple enough and to also ensure that the reliability of the system developed is within our control
- Status: Decided
- Confidence: High

## Initial System Architecture
![image](img/arch-1.png)

- Decision on 10/28/2022
- Confidence: Decided
- Status: High

## Database

- Decision on 10/28/2022
- Indexed DB for the main database, Local Storage for the app config. Indexed DB supports media content while local storage serves as a simple key-value pair which should be sufficient to store the app config.
- Status: Decided
- Confidence: Moderate

## Backend Language

- Decision on 11/03/2022
- Node.Js? Requires more knowledge of web tech.
- Status: Proposal
- Confidence: High