# Use an older Node.js version for better compatibility
FROM node:14


# Create a directory for the external files
RUN mkdir -p /code_execution/external && chmod -R 777 /code_execution/external

# Set the working directory
WORKDIR /code_execution

# Install ESLint
RUN npm install -g eslint@7.32.0

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the ESLint config file in both locations
RUN echo '{\n\
    "env": {\n\
    "node": true,\n\
    "es6": true\n\
    },\n\
    "extends": "eslint:recommended",\n\
    "rules": {\n\
    "no-unused-vars": "warn",\n\
    "no-console": "off"\n\
    }\n\
    }' > /code_execution/.eslintrc.json && \
    cp /code_execution/.eslintrc.json /code_execution/external/.eslintrc.json

# Make sure the working directory and external folder are writable
RUN chmod -R 777 /code_execution

# Create a script to handle linting and running files
RUN echo '#!/bin/bash\n\
    if [ "$1" = "lint" ]; then\n\
    eslint "$2"\n\
    elif [ "$1" = "run" ]; then\n\
    node "$2"\n\
    else\n\
    echo "Usage: $0 [lint|run] <file>"\n\
    exit 1\n\
    fi' > /usr/local/bin/code-checker && chmod +x /usr/local/bin/code-checker

CMD ["bash"]
