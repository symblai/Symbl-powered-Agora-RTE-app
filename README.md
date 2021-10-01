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

* [Node.js v10+](https://nodejs.org/en/download/)
* [PostgreSQL Database](https://www.postgresql.org/)
* [Go](https://golang.org/)
* [Agora account](https://console.agora.io/)
* [Symbl account](https://platform.symbl.ai/#/signup?utm_source=get-info&utm_medium=marcelo&utm_campaign=rep)

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

Get your Symbl credentials (`App Id` and `App Secret`) from the [Symbl Platform Console](https://platform.symbl.ai).

Get your Agora credentials (`App Id` and `App Certificate`) from the [Agora Platform Console](https://console.agora.io/). See [here](https://www.agora.io/en/blog/how-to-get-started-with-agora/) for more information on how to do that.

### Setup the Database
* Download and install [PostgreSQL](https://www.postgresql.org/download/).
* Create a database with the name of your choice. See [here](https://www.postgresql.org/docs/13/manage-ag-createdb.html) for more information.
* Note the username, password and database name that you have created. 

### Setup the Backend

1. Clone the [repo](https://github.com/symblai/Symbl-powered-Agora-RTE-app).
2. Navigate to the `Symbl-Powered-Agora-Backend-master` directory and open the `config.json` file.
3. Add your Symbl `App Id` and `App Secret` values in the respective fields below:

``` 
"SYMBL_APPID": ""
"SYMBL_SECRET": ""
``` 

4. Open the file `models/db.go` and provide your PostgreSQL database user, password, host and database name under the `CreateDB` function as described below.

```
db, err := gorm.Open("postgres", "postgres://<user>:<password>@<host>/<db_name>?sslmode=disable")
```

### Run the Backend server

Navigate to the `Symbl-Powered-Agora-Backend-master` directory and run the following command:
  
```
go run server.go
```

Your backend server should be running on port `8080`.

### Setup the Frontend

1. Open the file `config.json` under the folder `Symbl-Powered-Agora-Master` and provide your Agora project name, display name and App Id in the respective fields below:

```
"projectName": ""
"displayName": ""
"AppID":""
```

2. Add the Backend url in respective field below:

```
"backEndURL": "http://localhost:8080"
```

### Run the Frontend

Navigate to the `Symbl-Powered-Agora-master` directory and run the following command:
  
```
npm install
```

This command will install all the necessary frontend dependencies.

Run the following command to start the frontend application:

```
npm run web 
```
    
Your frontend server should be running on port `3000` (http://localhost:3000).

### Testing the Application
With your backend and frontend servers up and running, navigate to [http://localhost:3000](http://localhost:3000), click on the `Create a meeting` button, enter a room name and click the `Create a meeting` button again.
When the meeting URL is created, click on the `Enter Meeting (as host)` button to enter the meeting.
Select your camera, microphone and type your display name before clicking on the `Join Room` button.

## Conclusion
This application allows you to join an Agora video conference meeting with Symbl Transcripts and Insights, Topics and Sentiments enabled and displayed on the screen in real-time. 

## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [Apache License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[issues]: https://github.com/symblai/Symbl-powered-Agora-RTE-app/issues
[agorarte]: https://appbuilder.agora.io/
[pulls]: https://github.com/symblai/Symbl-powered-Agora-RTE-app/pulls


