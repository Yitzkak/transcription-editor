# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Create a group and user to run the application
RUN groupadd -r myappgroup && useradd -r -g myappgroup myappuser

# Set the working directory inside the container
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY . /code

# Install the dependencies
RUN pip install -r requirements.txt

# Change ownership of the code directory to the new user
RUN chown -R myappuser:myappgroup /code

# Switch to the non-root user
USER myappuser

# Run the Django server
CMD ["gunicorn", "transcription_project.wsgi:application", "--bind", "0.0.0.0:8000"]
