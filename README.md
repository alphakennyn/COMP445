# COMP 445
taught by Prof. Aiman Hanna

## Student Name
Kenny Hoang Khang Nguyen

## Student ID
27079427

Fall 2018

## How to run

#### Mac

`./httpc your_command`

#### Windows

`httpc your_command`

---

## Commands

### GET

./httpc.sh get 'http://httpbin.org/get?course=networking&assignment=1'

### GET VERBOSE

./httpc.sh get -v 'http://httpbin.org/get?course=networking&assignment=1'

### POST

./httpc.sh post -h Content-Type:application/json --d {"Assignment":1} http://httpbin.org/post
