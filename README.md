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
This application is supported only on Google Chrome.

## Setup and Deploy
The first step to getting setup is to [sign up][signup]. 

Gather your Symbl credentials:
1. Your App Id that you can get from [Platform](https://platform.symbl.ai)
2. Your App Secret that you can get from [Platform](https://platform.symbl.ai)
3. Go to the file SymblConfig.js and update your Symbl AppId and AppSecret .

Create Agora RTE APP:
1. Go to https://appbuilder.agora.io/ and follow the step by step guide to build Agora RTE app . 
2. You will need to select Precall Screen and Screen share options in the step 4 : Video call.
3. Please select web under the platforms in step 5 .
4. On the last step , please select One click deployment to Heroku and your backend will automatically be hosted on heroku .Note the backend URL and download the Forntend and Backend code .

5.  Clone this repo and go to app.json , in the “name” and “displayName” field please enter the exact name(Case Sensitive) of the app that you used while creating Agora RTE app(in step 1-4).
6. Go to file config.json
Enter the name used in step 5 to projectName and displayName .
In the AppId field , enter your Agora AppID.
At the end of this file , enter the backend url generated in step 4 to backendURL variable.
Save and quit.
7. Now install all the necessary packages needed for the application. Please run below command fro project root directory.
      ```
      $ npm install
      ```
8. To start the application 
     ```
     $ npm run web
     ```
   The application will be running on port 3000 on your machine. You can browse to http://localhost:3000 and use the application.

Note : You can also integrate Symbl to directly to the generated RTE app frontend code as well by copying and replacing the bridge directory from this repo  to the RTE app repo.   




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


