# YADiSMon: Yet Another Linux Disk Space Monitor

Yet another Linus Disk Space Monitor

Monitors disk space of a linux server and sends alerts via slack when necessary.

## Table of Contents
 - [Requrirements](#requrirements)
   - [Linux Server](#linux-server)
   - [Git](#git)
   - [Node.js](#nodejs)
   - [A Slack account](#a-slack-account)
   - [Internet connection](#internet-connection)
 - [Installation](#installation)
   - [Summary of steps](#summary-of-steps)
 - [License](#license)
 - [Running tests](#running-tests)
 - [Problems](#problems)

## Requirements

### Linux Server

I haven't tested this on any other unix flavored system.
It might work, but it might not.

### Git

You will need git to be able to clone this repo and, in the future, to be able to update the code via git pull.
If you don't want to install git you can just download the [zip version](https://github.com/EveryMundo/YADiSMon/archive/master.zip) of this.

### Node.js

Why Node.js? We know, It could've been done with another language, but we created this monitor thinking because of our servers that are already running Node.js applications, so ...

We strongly recommend you to install it via [nvm](https://github.com/creationix/nvm) (but it is not extremely necessary)

Installation link: https://github.com/creationix/nvm#install-script

### A [Slack](http://slack.com) account

You need to have a slack team to be able to be notified via slack.

We recommend you to also install the slack app on your smartphone, then you will really be notified.

### Internet connection

Without it the script will not be able to send the message to slack.

## Installation

1. Clone this repo with: `git clone https://github.com/EveryMundo/YADiSMon.git`
2. Enter the directory: `cd YADiSMon`
3. Install npm production packages: `npm install --prod`
4. Create a logs directory: `mkdir logs`
5. Copy the .env-sample to a .env file: `cp .env-dist .env`
6. Set the SLACK_CHANNEL variable in your .env file. (or leave it as #general)
7. Set the SLACK_TOKEN variable within the .env file using your preferred text editor.
   If you don't yet have it check the next section of this document, then come back to the
   step #8
8. Test the integration by running the the script disk-space-checker.sh passing 0 as the threshold for disk usage. This way, if you are using more than 0% of the disk, it should send you a message on slack.
  `./disk-space-checker.sh 0`

### Summary of steps
```
git clone https://github.com/EveryMundo/YADiSMon.git
cd YADiSMon
npm install --prod
mkdir logs
cp .env-dist .env #then you configure it before running the next command
./disk-space-checker.sh 0
```

### Create a Slack Bot User

* Go to https://my.slack.com/services/new/bot
* Enter a name to your Bot User and click on the **[Create bot integration]** buntton

On the next screen you'll see the **Integration Settings** section, which contains the Bot's token. 

Copy that token and configure your .env file by setting the **SLACK_TOKEN** variable with it.

The token value is probably going to be something like *xoxb-99999999999-LETTERSandNUMBERS*

```bash
# this is your .env file
SLACK_TOKE='xoxb-....'
```

### Crontab

Run the helper script passing as first argument your desired threshold. For example, if you want to receive an alert if you main disk usage is over 80%, you run this command like this:
```
./show-recommended-crontab-line 80
```

It will print on your console a recommended line to add to the crontab of the server which you want to monitor.

This will output a line that will run the the disk-space-checker every minute.

But if you think that every minute is too much, you can pass a number, like 5 for example, as a parameter and it will output a crontab line to run the monitor every 5 minutes instead.  `./show-recommended-crontab-line 80 5`

Copy the output of that command and open your crontab file via `crontab -e`.
Paste the line you've copied at the end of the file and save it.

### Congratulations

If you follow the instructions above you will receive an alert whenever your main mount point **/** is over the configured **threshold**
