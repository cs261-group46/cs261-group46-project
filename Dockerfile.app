FROM python:3.10
WORKDIR /app

COPY requirements.txt app/* .flaskenv ./
RUN pip install -r ./requirements.txt
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "app:app"]