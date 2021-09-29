# Symbl-powered-Agora-RTE-app

[![Websocket](https://img.shields.io/badge/symbl-websocket-brightgreen)](https://docs.symbl.ai/docs/streamingapi/overview/introduction)

Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

**This app is meant for demo purposes only , please feel free to report any issue in the issues section**

<hr />

## Enable Symbl for Agora [RTE App][agorarte] 

<hr />

 * [Introduction](#introduction)
 * [Pre-requisites](#pre-requisites)
 * [Features](#features)
 * [Browser Support](#browsersupport)
 * [Setup and Deploy](#setupanddeploy)
 * [Dependencies](#dependencies)
 * [Conclusion](#conclusion)
 * [Community](#community)

## Introduction

This is a multi-party video conferencing application that demonstrates [Symbl's Real-time APIs](https://docs.symbl.ai/docs/streamingapi/overview/introduction). 

## Pre-requisites

* JS ES6+
* [Node.js v10+](https://nodejs.org/en/download/)*
* NPM v6+
* Agora account - https://console.agora.io/

## Features
* Live Closed Captioning
* Real-time Transcription
* Real-time insights : Questions , Action-Items , Follow-ups
* Real time Topic with sentiments 
* Video conferencing with real-time video and audio
* Enable/Disable camera
* Mute/unmute mic
* Screen sharing


## Browser Support
This application is supported only on Google Chrome and Firefox.

## Setup and Deploy
The first step to getting setup is to [sign up][signup]. 

Gather your Symbl credentials:
1. Your App Id that you can get from [Platform](https://platform.symbl.ai)
2. Your App Secret that you can get from [Platform](https://platform.symbl.ai)

Gather your Agora credentials :
 Acquire your Agora App ID and App Certificate. If you don’t have an App ID, you can get one by following this [Guide](https://www.agora.io/en/blog/how-to-get-started-with-agora/)

### Setup the Database :

  * Install PostgresSQL on the server or your local machine (where you plan to deploy this applciation)
  * create a database with name of your choice .
  * You can follow this guide [here](https://www.postgresql.org/) .
  * Please note the username , password and database name that you have created. 

### Setup the Backend :

Download the repo and open the file config.json in folder Symbl-Powered-Agora-Backend-Master
Make following changes:

1. Add AppID and AppSecret in the config.json file in 

``` 
"SYMBL_APPID": ""
"SYMBL_SECRET": ""
``` 

2. Open the file /models/db.go and add your Postgres database url(that you have set up in the previous step) in line 16.
It should contain the database url, username and password for the db in the following format:

```
postgres://user:pass@host/dbname
```

### Run the Backend server:

Go to the root of the folder and rub below command .
  
```
go run server.go
```

Your Backend server should be running on localhost:8080

### Setup the frontend :

  Open file config.json in folder Symbl-Powered-Agora-Master and enter following Agora attributes
  
    "projectName": ""
    "displayName": ""
    "AppID":""
    
  
  Add the backend url in same config.json file (it is the url of the same backend server that you just started )
	"backEndURL": "http://localhost:8080"

### Run the frontend :

  From the terminal go to the root folder of the project and run below commands :
    
   
    npm install  (This will install all the necessary dependencies )
 
    npm run web 
    

  Your application will be running on http://localhost:3000



## Conclusion
When implemented this application will allow you to join a demo Agora video conference meeting, and Symbl transcripts along with Insights , topics and sentiments will be displayed on screen in real time. 

## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [Apache License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/symbl-for-zoom/issues
[agorarte]: https://appbuilder.agora.io/
[pulls]: https://github.com/symblai/symbl-for-zoom/pulls


