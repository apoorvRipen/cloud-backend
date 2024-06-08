# Node Project README

This is a Node.js project designed to demonstrate basic setup and commands using npm scripts.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

### Development

To start the project in development mode with live reload, run:

```bash
npm run watch
```

This command will watch for changes in your files and automatically restart the server.

### Build

To build the project, run:

```bash
npm run build
```

This command will generate a production-ready build of the project, which will be located in the `dist` folder.

### Running the Build

To run the built project, navigate to the `dist` folder and execute:

```bash
node dist/index.js
```

This command will start the application using the compiled files from the `dist` folder.

## Folder Structure

- `src`: Contains the source code of the project.
- `dist`: Contains the built and compiled files.
- `node_modules`: Contains the installed npm packages.

## Contributing

Feel free to contribute to this project by creating issues or pull requests. All contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
