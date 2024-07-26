FROM gcc:latest

# Create the working directory and set permissions
RUN mkdir -p /code_execution && chmod -R 777 /code_execution

# Set the working directory inside the container
WORKDIR /code_execution

# Copy entrypoint.sh to the container
COPY . .

# Command to use entrypoint script
CMD [ "g++", "main.cpp", "-o", "main" ]
