# Which?

Which? the simple <i>mobile</i> app for picking one of each pair or photos or text.  Get input!  See how your judgements match up with those of the crowd!

## Team

  - __Product Owner__: Brendan
  - __Scrum Master__: Madeline
  - __Development Team Members__: Song, V

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

Clone the repo.

Make sure that you have a mongo database running.  Try command ```mongod```.

Start the back end server.  From root directory:  ```nodemon server/server.js```.

Use ionic to serve the front end.  From the root directory:
```sh
cd client
ionic serve
```

## Requirements

- Node 4.2.x
- Mongo

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
npm install -g cordova
npm install -g ionic
npm install ./client
  (if node-sass fails because of your node version, try installing it separately: npm install ./client node-sass)
bower install ./client
```

### Roadmap

View the project roadmap at https://waffle.io/HRR-TeamTesla/TeamTesla.


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
