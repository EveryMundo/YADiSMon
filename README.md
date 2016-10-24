# YADiSMon: Yet Another Linux Disk Space Monitor

Yet another Linus Disk Space Monitor

Monitors disk space of a linux server and sends alerts via slack when necessary.

# Requirements

## Linux Server

I haven't tested this on any other unix flavored system.
It might work, but it might not.

## Node.js

It could've be done with another language, but we are created this monitor thinking about the servers we have already with Node.js applications, so ...

We strongly recommend you to install it via [nvm](https://github.com/creationix/nvm) (but it is not extremely necessary)

https://github.com/creationix/nvm#install-script

## A [Slack](http://slack.com) account

* Go to https://api.slack.com/apps and click on the button **[Create New App]**
* Give your app a name and select a team for it
* DO NOT CHECK THE OPTION *I plan to submit this app to the Slack App Directory.*
* Click on the button **[Create App]**
