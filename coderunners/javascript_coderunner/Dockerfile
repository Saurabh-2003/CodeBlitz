# Use an older Node.js version for better compatibility
FROM node:14

# Create a directory for the external files
RUN mkdir -p /code_execution/external && chmod -R 777 /code_execution/external

# Set the working directory
WORKDIR /code_execution

# Install ESLint
RUN npm install -g eslint@7.32.0
RUN npm i eslint-config-standard

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set permissions before creating the config files
RUN chmod -R 777 /code_execution

# Copy ESLint config files and set appropriate permissions
COPY .eslintrc.json /.eslintrc.json
COPY .eslintrc.json /external/.eslintrc.json

# Set read permission for ESLint config files
RUN chmod 777 /code_execution/.eslintrc.json /external/.eslintrc.json

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

# Set the default command to bash
CMD ["bash"]
