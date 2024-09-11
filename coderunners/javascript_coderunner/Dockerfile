# Use Node.js 14
FROM node:18

# Create the working directory
WORKDIR /code_execution

# Copy the package.json and package-lock.json for dependencies
COPY package*.json ./

# Modify the package.json to set "type": "module"
RUN if [ -f package.json ]; then sed -i 's/"scripts": {/"type": "module",\n  "scripts": {/' package.json; fi

# Install ESLint and necessary plugins
RUN npm install eslint@9.10.0 @eslint/js --save-dev

# Copy the rest of the application code
COPY . .

# Set permissions for all application files
RUN chmod -R 777 /code_execution

# Create an ESLint config file using ES module syntax
RUN echo 'import js from "@eslint/js";\n\nexport default [\n  js.configs.recommended,\n  {\n    rules: {\n      "no-unused-vars": "warn",\n      "no-undef": "warn"\n    }\n  }\n];' > /code_execution/eslint.config.js

# Set permissions for the ESLint config file
RUN chmod 777 /code_execution/eslint.config.js

# Create a script to handle linting and running files
RUN echo '#!/bin/bash\n\
    if [ "$1" = "lint" ]; then\n\
    npx eslint --config /code_execution/eslint.config.js "$2"\n\
    elif [ "$1" = "run" ]; then\n\
    node "$2"\n\
    else\n\
    echo "Usage: $0 [lint|run] <file>"\n\
    exit 1\n\
    fi' > /usr/local/bin/code-checker && chmod +x /usr/local/bin/code-checker

# Set the default command to bash
CMD ["bash", "sh"]
