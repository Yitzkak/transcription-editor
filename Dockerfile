# Use an official Python runtime as a parent image
FROM python:3.11.9-bullseye

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the working directory
COPY requirements.txt /code/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /code
COPY . /code/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000 to the outside world
EXPOSE 8000

# Run the Django server
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "transcription_project.wsgi:application"]
