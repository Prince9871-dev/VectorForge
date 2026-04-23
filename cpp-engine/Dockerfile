FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    make \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN g++ -std=c++17 -O2 -pthread main.cpp -o vector-engine

EXPOSE 8080

CMD ["./vector-engine"]