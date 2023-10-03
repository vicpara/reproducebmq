
# syntax = docker/dockerfile:experimental
# USING PUBLIC DOCKER HUB
# FROM node:19-bullseye-slim as node-base 
# USING AWS DOCKER 
# FROM public.ecr.aws/docker/library/node:current-bullseye-slim 
# FROM node:20-alpine
#############################################
FROM oven/bun:alpine

# ENV CFLAGS=-w CXXFLAGS=-w
# ENV DEBIAN_FRONTEND noninteractive

# RUN apt-get -y update && apt-get -y upgrade
RUN apk add ca-certificates wget curl \
    jq nano bash lsof tree vim less procps \
    net-tools git zip openssh-server openssh-client tini
    

RUN mkdir -m 777 -p /app/code  && \
    mkdir -m 777 -p /app/data && \
    mkdir -m 777 -p /var/log/broadn

COPY . /app/code/
RUN rm -rf /app/code/node_modules

WORKDIR /app/code/
RUN bun install --p

ENTRYPOINT [ "tini", "--" ]
CMD bun run start
