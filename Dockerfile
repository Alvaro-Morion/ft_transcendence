FROM python:3

WORKDIR /usr/src/app

COPY ./requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 8000

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["./migrate.sh"]