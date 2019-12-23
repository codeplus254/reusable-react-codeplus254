const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const parse = require('react-docgen').parse;
const chokidar = require('chokidar');

const paths = {
    examples: path.join(__dirname, '../src', 'docs', 'examples'),
    components: path.join(__dirname, '../src', 'components'),
    output: path.join(__dirname, '../config', 'componentData.js')
};

const enableWatchMode= process.argv.slice(2) == '--watch';
if (enableWatchMode) {
    // Regenerate component metadata when components or examples change
    chokidar.watch([paths.examples, paths.components]).on('change', function(event, path) {
        generate(paths);
    });
} else {
    // Generate component metadata
    generate(paths);  
}

function generate(paths) {
    let errors = [];
    const componentData = getDirectories(paths.components).map(function(componentName) {
        try {
            return getComponentData(paths, componentName)
        } catch(error) {
            errors.push(`An error occurred while attempting to generate metadata for ${componentName}. ${error}`);
        }
    });
    writeFile(paths.output, "module.exports = "+ JSON.stringify(errors.length ? errors : componentData));
}

function getComponentData(paths, componentName) {
    const content = readFile(path.join(paths.components, componentName, componentName + '.js'));
    const info = parse(content);
    return {
        name: componentName,
        description: info.description,
        props: info.props,
        code: content,
        examples: getExampleData(paths.examples, componentName)
    }
}

function getExampleData(examplesPath, componentName) {
    const examples = getExampleFiles(examplesPath, componentName);
    return examples.map(function(file) {
        const filePath = path.join(examplesPath, componentName, file)
        const content = readFile(filePath)
        const info = parse(content);
        return {
            // By convention, component name should match the filename.
            // So remove the .js extension to get the component name.
            name: file.slice(0, -3),
            description: info.description,
            code: content,
        };
    });
}

function getExampleFiles(examplesPath, componentName) {
    let exampleFiles = [];
    try {
        exampleFiles = getFiles(path.join(examplesPath, componentName));
    } catch(error) {
        console.log(chalk.red(`No examples found for ${componentName}`))
    }
    return exampleFiles;
}

function getDirectories(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isDirectory();
    });
}

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isFile();
    });
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, function (err) {
        err ? console.log(chalk.red(err)) : console.log(chalk.green("Component data saved."));
    });
}

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}