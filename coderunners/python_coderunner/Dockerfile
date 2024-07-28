# Dockerfile for Python container
FROM python:latest

# Create the working directory and set permissions
RUN mkdir -p /code_execution && chmod -R 777 /code_execution

# Set the working directory inside the container
WORKDIR /code_execution

# Default command (can be overridden)
CMD ["sh", "-c", "echo 'No command specified'"]
