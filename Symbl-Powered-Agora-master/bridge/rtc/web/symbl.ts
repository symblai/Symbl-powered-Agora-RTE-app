var currentCaption: Caption = null;
var captionNum = 0;
var ws: WebSocket = null;
var symblSocket: SymblSocket = null;
const insights: any = [];
const topics: any = [];

const hashCode = function (s: string): number {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) {
    while (i < l) {
      h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    }
  }
  return h;
};

export class SymblEvents {
  captionHandlers: any = []; /** Handlers for the caption events **/
  insightHandlers: any = []; /** Handlers for the insight events **/
  transcriptHandlers: any = []; /** Handlers for the transcript events **/
  topicHandlers: any = [];
  constructor() {}
  getHandlerArr(handlerType: string): any {
    let handlerArr;
    if (handlerType === 'caption') {
      handlerArr = this.captionHandlers;
    } else if (handlerType === 'insight') {
      handlerArr = this.insightHandlers;
    } else if (handlerType === 'transcript') {
      handlerArr = this.transcriptHandlers;
    } else if (handlerType === 'topic') {
      handlerArr = this.topicHandlers;
    } else {
      throw new Error(`Unhandled SymblEvent handler type ${handlerType}`);
    }
    return handlerArr;
  }
  /**
   * Subscribe to one of three posible insight handlers
   * @param  type    handler type - can be `caption`, `insight`, and `transcript`
   * @param  handler callback function that will be fired when the corresponding event is emitted
   * @return         function that removes the handler.
   */
  subscribe(type: string, handler: any): any {
    try {
      const handlerArr = this.getHandlerArr(type);
      if (handlerArr) {
        handlerArr.push(handler);
        return () => {
          let index = this.captionHandlers.indexOf(handler);
          if (index > -1) {
            let removedHandler = this.captionHandlers.splice(index, 1);
            return removedHandler;
          }
        };
      }
    } catch (err) {
      console.log(err);
      throw new Error(`Error subscribing to SymblEvent type ${type} ${err}`);
    }
  }
  emit(type: string, event: string, ...args: any[]) {
    try {
      const handlerArr = this.getHandlerArr(type);
      if (handlerArr) {
        handlerArr.forEach((handler: any) => {
          if (handler[event]) {
            handler[event](...args);
          }
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error(`Error emitting event type ${type} ${err}`);
    }
  }
}
const symblEvents = new SymblEvents();

export class Transcript {
  lines: Array<TranscriptItem> = []; /** Full transcript with timestamps **/
  constructor() {}
  addLine(transcriptItem: TranscriptItem): void {
    this.lines.unshift(transcriptItem);
  }
  printAll(): string {
    let content = '';
    for (let line of this.lines) {
      content = content + `${line.userName}: ${line.message}\n`;
    }
    // console.log('Transcript\n', content);
    return content;
  }
}

export class TranscriptItem {
  message: string = null; /** Content of the transcript **/
  userName: string = null; /** Name of the transcript speaker **/
  id: string = null; /** Transcript id **/
  userId: string =
    null; /** Email address of the speaker for the transcript item **/
  timeStamp: Date = new Date(); /** Time when the transcript was received **/
  dismissed: boolean;
  constructor(data: {
    isFinal: true;
    payload: any;
    punctuated: {
      transcript: string;
      type: 'recognition_result';
    };
    user: {
      id: string /** User ID **/;
      name: string /** Transcript item user name **/;
      userId: string;
    };
    duration: {
      /** Duration of the transcription **/
      startTime: string /** Start time of audio being transcribed **/;
      endTime: string /** End time of the audio being transcriped **/;
    };
    type: string;
    dismissed: boolean;
  }) {
    if (data && data.isFinal !== true) {
      throw new Error('Message is not final transcript response');
    }

    this.message = data.punctuated.transcript;
    this.userName = data.user.name;
    this.id = data.user.id;
    this.userId = data.user.userId;
    symblEvents.emit('transcript', 'onTranscriptCreated', this);
  }
}

const transcript = new Transcript();

export class Insight {
  data: {
    assignee: {
      name?: string /** Name of the user the action item has been assigned to **/;
      userId: string /** id of the user the action item is assigned to **/;
      id: string;
    };
    hints?: [{ key: string; value: number }];
    from?: {
      id: string;
      userId: string;
    } /** User from whom the aciton item was assigned **/;
    tags?: {
      text: string /** Tag text **/;
      type: string /** Type of tag **/;
    };
    id: string /** ID of the insight **/;
    text: string /** Insight text **/;
    type: string /** Type of the insight - action_item, question, follow_up **/;
    confidence?: number /** Accuracy quotient of the insight **/;
  } = null;
  id: string = null; /** Insight ID specific to the object **/
  _element: HTMLDivElement = null;

  constructor(data: any) {
    this.data = data;
    this.id = '' + hashCode(data.text + data.confidence);
    console.info('Creating insight', data, insights.includes(data));
    symblEvents.emit('insight', 'onInsightCreated', this);
  }
  createElement(): HTMLDivElement {
    let type = '';
    let color = 'bg-dark';
    let footer = '';
    switch (this.data.type) {
      case 'action_item':
        type = 'Action Item';
        color = 'bg-warning';
        footer = `Assignee: ${this.data.assignee.name}`;
        break;
      case 'question':
        type = 'Question';
        color = 'bg-success';
        footer = `Assignee: ${this.data.assignee.name}`;
        break;
      case 'follow_up':
        type = 'Follow Up';
        color = 'bg-info';
        footer = `Assignee: ${this.data.assignee.name}`;
        break;
      default:
        console.warn('Insight has no valid type?', this.data);
        break;
    }
    let content = this.data.text;
    const insightElementStr = `<div class="card text-white ${color} mb-3" style="max-width: 18rem; margin: 10px;">
            <div class="card-header">${type}</div>
            <div class="card-body">
                <p class="card-text">${content}</p>
                <p class="card-text"><small class="text">${footer}</small></p>
            </div>
        </div>`;
    const element = document.createElement('div');
    element.innerHTML = insightElementStr;
    element.id = this.id;
    this.element = element;
    return element;
  }
  /**
   * Hints are applicable to `follow up` action items. They include information about whether it was a definitive
   * @return [Array] follow up hints
   */
  get hints(): [{ key: string; value: number | boolean }] | void {
    if (this.data && this.data.hints) {
      return this.data.hints;
    }
  }
  get type(): string {
    // action_item || question || follow_up
    return this.data.type;
  }

  /**
   * The assignee of the insight
   * @return {assignee}
   */
  get assignee(): { name?: string; userId: string; id: string } {
    return this.data.assignee;
  }
  /**
   * User that assigned the action item.
   * @return [description]
   */
  get from(): { name?: string; id: string; userId: string } {
    return this.data.from;
  }
  /**
   * ID of the conversational insight generated in the conversation
   * @return ID of the insight
   */
  get insightId(): string {
    return this.data.id;
  }
  /**
   * Content of the insight.
   * @return Insight content
   */
  get text(): string {
    return this.data.text;
  }
  /**
   * Element that is added to the container via the add fuction
   * @return Insight Element
   */
  get element(): HTMLDivElement {
    return this._element;
  }
  /**
   * Sets the element for the insight
   * @param  element [HTMLDivElement] HTML
   * @return         [description]
   */
  set element(element: HTMLDivElement) {
    this._element = element;
  }
  add(container: HTMLElement = null) {
    if (container && this.element) {
      container.append(this.element);
      container.scroll(0, 1000000);
    }
  }
  remove() {
    this.element.remove();
  }
}

export class Topic {
  data: {
    phrases: string /** Topic text **/;
    type: string /** Type  **/;
    confidence?: number;
  } = null;
  id: string = null; /** topic ID specific to the object **/
  _element: HTMLDivElement = null;

  constructor(data: any) {
    this.data = data;
    this.id = '' + hashCode(data.phrases + data.confidence);
    console.info('Creating topic', data, topics.includes(data));
    symblEvents.emit('topic', 'onTopicCreated', this);
  }
  get element(): HTMLDivElement {
    return this._element;
  }
  set element(element: HTMLDivElement) {
    this._element = element;
  }
  createElement(): HTMLDivElement {
    let type = '';
    let color = 'bg-dark';
    let footer = '';

    let content = this.data.phrases;
    const topicElementStr = `<div class="card text-white ${color} mb-3" style="max-width: 18rem; margin: 10px;">
            <div class="card-header">${this.data.type}</div>
            <div class="card-body">
                <p class="card-text">${content}</p>
                <p class="card-text"><small class="text">${this.data.confidence}</small></p>
            </div>
        </div>`;
    const element = document.createElement('div');
    element.innerHTML = topicElementStr;
    element.id = this.id;
    this.element = element;
    return element;
  }
  add(container: HTMLElement = null) {
    if (container && this.element) {
      container.append(this.element);
      container.scroll(0, 1000000);
    }
  }
}

var websocketOpened: boolean = false;
export class Caption {
  data: {
    isFinal: boolean;
    false;
    payload: {
      raw: {
        alternatives: [
          {
            confidence: number;
            transcript: string;
            words: Array<any>;
          },
        ];
      };
    };
    punctuated: {
      transcript: string;
    };
    type: string; // "recognition_result"
    user: {
      id: string;
      userId: string;
      name: string;
    };
  } = null;
  userId: '865ca7f0-a880-73b6-4f6c-0c5a7e19bcac' = null;
  element?: HTMLDivElement =
    null; /** Optional element used to superimpose captions over rather than the HTMLVideoElement **/
  name: string = '';
  captionNum: number = 0; /** Caption number **/
  textTrack: TextTrack = null; /** Text track used for closed captioning **/
  _videoElementId: string =
    null; /** ID of the HTMLVideoElement the CC track will be added to **/
  videoElement: HTMLVideoElement =
    null; /** Video element the closed-caption track is added to **/
  message: string = null; /** Caption content **/
  contentSpan: string = null; /** Finalized caption content **/
  static captionsEnabled: boolean = true;
  static toggleCaptions(enabled: boolean = !Caption.captionsEnabled): void {
    if (currentCaption && currentCaption.videoElement) {
      currentCaption.setVideoElement(currentCaption.videoElement);
    }
    Caption.captionsEnabled = enabled;
    symblEvents.emit('caption', 'onCaptionToggled', enabled);
    // implement
  }
  constructor(data: any) {
    this.data = data;
    this.captionNum = captionNum;
    captionNum++;
    this.setName(data.user.name);
    if (data.punctuated.transcript) {
      this.message = this.truncateMessage(data.punctuated.transcript);
    }
    symblEvents.emit('caption', 'onCaptionCreated', this);
  }
  /**
   * Sets which Video element to superimpose captions over
   * @param  videoElement [description]
   * @return              [description]
   */
  setVideoElement(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.videoElement.style.transform = '';
    if (this.videoElement.textTracks.length === 0) {
      this.textTrack = this.videoElement.addTextTrack('subtitles');
      let cue = new VTTCue(
        this.videoElement.currentTime,
        this.videoElement.currentTime + 1,
        this.message,
      );
      this.textTrack.mode = Caption.captionsEnabled ? 'showing' : 'hidden';
      this.textTrack.addCue(cue);
    } else {
      this.textTrack = this.videoElement.textTracks[0];
      this.textTrack.mode = Caption.captionsEnabled ? 'showing' : 'hidden';
    }
  }
  /**
   * Sets the element that captions should be added to
   * @param  videoElementId id of the HTMLVideoElement to add captions over
   * @return
   */
  set videoElementId(videoElementId: string) {
    let _videoElement = document.getElementById(videoElementId);
    if (_videoElement instanceof HTMLVideoElement) {
      this._videoElementId = videoElementId;
      this.setVideoElement(_videoElement);
    } else {
      console.error('Could not retrieve Video Element by Id.');
    }
  }
  /**
   * Sets caption user name
   * @param  name name of the user the caption belongs to
   * @return      [description]
   */
  setName(name: string): void {
    this.name = name;
  }
  /**
   * truncates the maximum showable words at any given time
   * @param  message Caption message to be truncated
   * @return         Truncated caption message
   */
  truncateMessage(message: string): string {
    if (!message) {
      return '';
    }
    let truncatedMessage = message
      .split(' ')
      .splice(-13 * 2)
      .join(' ');
    if (truncatedMessage.length > 72 * 2) {
      truncatedMessage = message
        .split(' ')
        .splice(-12 * 2)
        .join(' ');
    } else if (truncatedMessage.length < 60 * 2) {
      truncatedMessage = message
        .split(' ')
        .splice(-14 * 2)
        .join(' ');
    }
    return truncatedMessage;
  }
  /**
   * Updates the content of the currently active caption subtitle
   * @param  message Caption content
   * @return
   */
  updateContent(data: any) {
    this.data = data;
    const message = data.punctuated.transcript;
    // Update Text in `closed-captioning-text`
    this.message = this.truncateMessage(message);
    if (this.textTrack) {
      var cue: VTTCue;
      if (this.textTrack.cues.length > 0) {
        cue = this.textTrack.cues[this.textTrack.cues.length - 1] as VTTCue;
      } else {
        cue = new VTTCue(
          this.videoElement.currentTime,
          this.videoElement.currentTime + 1,
          this.message,
        );
        cue.startTime = this.videoElement.currentTime;
      }
      cue.endTime = this.videoElement.currentTime + 1;
      cue.text = this.message;
      this.textTrack.addCue(cue);
    }
    symblEvents.emit('caption', 'onCaptionUpdated', this);
  }
  /**
   * The speaker has finished speaking and the caption is ready to be disposed
   * @param  message final message for the caption
   * @return
   */
  finalize(message: string): void {
    this.contentSpan = message;
  }
  /**
   * Kills the caption
   * @param  killNow if true, the caption will be immediately removed instead of fading out
   * @return void
   */
  kill(killNow: boolean): void {
    currentCaption = null;
    if (this.element) {
      this.element.classList.add('fade-out');
      // this.element.className = this.element.className + ' fade-out';
      if (killNow) {
        this.element.style.display = 'none';
        this.element.remove();
      } else {
        setTimeout(() => {
          this.element.style.display = 'none';
          this.element.remove();
        }, 1000);
      }
    }
  }
}

var ssCount = 0;
export class SymblSocket {
  id: number = ssCount++;
  userName: string = null; /** User name of the client **/
  private bufferSize: number = 8192; /** Buffer size of the audio stream **/
  ws: WebSocket = null; /** The websocket connection **/
  connected: boolean = false; /** Whether the socket connection is open **/
  closed: boolean = true; /** Whether the socket connection is closed **/
  requestStarted: boolean =
    false; /** Whether the initial start request has been made **/
  credentials: any = false;
  _conversationId: string = null;
  gainNode: GainNode = null;
  config: {
    confidenceThreshold: number /** Minimum confidence value for an insight to be detected **/;
    languageCode: string;
    insightsEnabled: boolean;
  } = null;
  observer: {
    captionObservers: {
      onCaptioningToggled: {
        (callback: (isEnabled: boolean, caption?: Caption) => void): void;
      }[];
      onCaptionCreated: (callback: any) => void;
      onCaptionUpdated: { (callback: (caption: Caption) => void): void }[];
    };
    insightObservers: {
      onInsightResult: { (callback: () => void): void };
    };
    transcriptObservers: {
      onTranscriptCreated: {
        (callback: (transcript: Transcript) => void): void;
      };
    };
    topicObservers: {
      onTopicResult: { (callback: () => void): void };
    };
  };
  constructor(
    config: {
      confidenceThreshold: number;
      languageCode: string;
      insightsEnabled: boolean;
    },
    credentials: {
      attendeeId: string /** UUID of the Chime attendee **/;
      userName?: string /** Name of the Chime Attendee **/;
      meetingId: string /** UUID of the Chime meeting **/;
      meeting?: string /** Name of the Chime meeting **/;
    },
  ) {
    this.id = ssCount++;
    this.config = config;
    this.credentials = credentials;
    this.userName = this.credentials.userName;
    const self = this;
    ws.onmessage = (event) => self.onMessage(event);
    ws.onclose = (event) => self.onClose(event);
    ws.onerror = (event) => self.onError(event);
  }
  parseMessage(message: any) {
    const data = JSON.parse(message);
    if (data.type === 'insight_response') {
      console.log(data);
      data.insights.forEach((insight: any) => {
        new Insight(insight);
      });
      return;
    }
    if (data.type === 'topic_response') {
      data.topics.forEach((topic: any) => {
        new Topic(topic);
      });
      return;
    }
    if (!('message' in data)) {
      // Not parsing message. Not transcript.
      return;
    }
    switch (data.message.type) {
      case 'recognition_started':
        this.conversationId = data.message.data.conversationId;
        // Transcript started
        currentCaption = null;
        break;
      case 'recognition_result':
        // transcription continued
        if (data.message && data.message.isFinal) {
          new TranscriptItem(data.message);
        }
        if (currentCaption) {
          currentCaption.updateContent(data.message);
        } else {
          console.info('Creating first caption');
          currentCaption = new Caption(data.message);
        }
        if (data.message.isFinal && currentCaption) {
          currentCaption.kill(false);
          // TODO Post transcript to message channel?
        }
        break;
      case 'recognition_stopped':
        // transcription stopped
        if (currentCaption) {
          currentCaption.kill(false);
        }
        break;
    }
  }
  set conversationId(conversationId) {
    this._conversationId = conversationId;
    console.info('Conversation ID set ', conversationId);
    window.localStorage.setItem('conversationId', conversationId);
    const res = fetch(
      'https://api.symbl.ai/v1/conversations/' +
        conversationId +
        '/experiences',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Symbl.ACCESS_TOKEN,
        },
        mode: 'cors',
        body: JSON.stringify({
          name: 'verbose-text-summary',
        }),
      },
    )
      .then((response) => response.text())
      .then((result) => {
        console.log('summary URL' + JSON.parse(result).url);
        window.localStorage.setItem('summaryUrl', JSON.parse(result).url);
      });
  }
  get conversationId() {
    return this._conversationId;
  }
  onMessage(event: any) {
    if (event.type === 'message') {
      // console.log('on message', event, event.data);  // Print the data for illustration purposes
      this.parseMessage(event.data);
    }
  }
  onClose(...anything: any[]) {
    this.closed = true;

    ///
    console.warn('Websocket closed', ...anything);
  }
  onError(err: Event) {
    console.error('Symbl Websocket Error', err.code, err.message, err.reason);
  }
  /**
   * Sends a start request, that begins a recognition request.
   */
  startRequest(): void {
    this.closed = false;
    console.info('Starting request');
    if (this.requestStarted) {
      console.info('Trying to start request. Must stop request first');
      return;
    }
    this.requestStarted = true;
    ws.send(
      JSON.stringify({
        type: 'start_request',
        insightTypes: this.config.insightsEnabled
          ? ['question', 'action_item']
          : [],
        config: {
          confidenceThreshold: this.config.confidenceThreshold || 0.5,
          // "timezoneOffset": 480, // Your timezone offset from UTC in minutes
          languageCode: this.config.languageCode
            ? this.config.languageCode
            : 'en-US',
          speechRecognition: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100, // Make sure the correct sample rate is provided for best results
          },
          meetingTitle: this.credentials.meeting, // Set meeting name
        },
        speaker: {
          userId: this.credentials.attendeeId,
          name: this.credentials.userName,
        },
      }),
    );
    const handleSuccess = (stream: any) => {
      console.log('inside Handle success');
      const AudioContext = window.AudioContext;
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);
      this.gainNode = context.createGain();
      console.log('Printing gain node' + this.gainNode);
      source.connect(this.gainNode);
      this.gainNode.connect(processor);
      processor.connect(context.destination);
      processor.onaudioprocess = (e: any) => {
        // convert to 16-bit payload
        const inputData =
          e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
        const targetBuffer = new Int16Array(inputData.length);
        for (let index = inputData.length; index > 0; index--) {
          targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
        }
        // Send to websocket
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(targetBuffer.buffer);
        }
      };
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  }
  public mute(isMuted: boolean) {
    console.log('inside mute symblvalue ' + isMuted + this.gainNode);
    if (this.gainNode) {
      console.log('inside mute');
      this.gainNode.gain.value = isMuted ? 0 : 1;
    }
  }
  get isMuted(): boolean {
    if (this.gainNode) {
      return this.gainNode.gain.value === 0;
    } else {
      return false;
    }
  }
  /**
   * Sends a stop request that stops recognition requests.
   */
  stopRequest(): void {
    console.warn('Stopping request');
    if (!this.requestStarted) {
      console.log('Cannot stop request. Request has not started');
      return;
    }
    this.requestStarted = false;
    ws.send(
      JSON.stringify({
        type: 'stop_request',
      }),
    );
  }
  close(): Promise<string> {
    console.info('Symbl closing');
    return new Promise((resolve, reject) => {
      if (!this.closed) {
        ws.addEventListener('close', (e: Event) => {
          console.info('Symbl Connection Closed', e);
          resolve('Closed');
        });
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      } else {
        reject('Failed to close websocket');
      }
    });
  }
}

export class Symbl {
  static ACCESS_TOKEN: string =
    null; /** Access token generated using Symbl App ID and Secret **/
  static events: SymblEvents = symblEvents;
  static transcripts: Transcript = transcript;
  static state: string = 'DISCONNECTED'; /** State of Symbl's connectors **/
  public credentials: {
    attendeeId: string;
    userName: string;
    meetingId: string;
    meeting: string;
  };
  public meeting: any = null;
  isMuted: boolean = false; /** Whether the user is on mute **/
  config?: {
    confidenceThreshold: number /** Minimum confidence needed for an insight to be created **/;
    languageCode: string /** language code for the meeting - can be `en-US, en-AU, en-GB, es-ES, de-DE, nl-NL, it-IT, fr-FR, fr-CA, ja-JP` **/;
    insightsEnabled: boolean /** Whether to enable real-time insights **/;
  } = {
    // Symbl Config
    confidenceThreshold: 0.5,
    languageCode: 'en-US',
    insightsEnabled: true,
  };
  url: string = null; /** Realtime API endpoint **/
  meetingId: string = null; /** UUID of the Chime meeting **/
  constructor(
    chime: {
      attendeeId: string /** UUID of the Chime attendee **/;
      userName: string /** Name of the Chime Attendee **/;
      meetingId: string /** UUID of the Chime meeting **/;
      meeting: string /** Name of the Chime meeting **/;
    },
    config?: {
      confidenceThreshold: number /** Minimum confidence needed for an insight to be created **/;
      languageCode: string /** language code for the meeting - can be `en-US, en-AU, en-GB, es-ES, de-DE, nl-NL, it-IT, fr-FR, fr-CA, ja-JP` **/;
      insightsEnabled: boolean /** Whether to enable real-time insights **/;
    },
  ) {
    this.credentials = chime;
    this.meetingId = chime.meetingId;
    this.meeting = chime.meeting;

    console.log('credentials', this.credentials, 'meetingId', this.meetingId);

    // this.videoContainerId = videoContainerId;
    if (!Symbl.ACCESS_TOKEN) {
      throw new Error('Cannot connect to symbl. Access token undefined');
    }
    if (!chime.meetingId) {
      throw new Error('Chime Meeting ID not provided.');
    }
    this.url = `wss://api.symbl.ai/v1/realtime/insights/${chime.meetingId}?access_token=${Symbl.ACCESS_TOKEN}`;

    if (config) {
      this.config = config;
    }
  }
  /**
   * Toggle closed captioning on or off.
   * @param force Sets the captioning to a state rather than toggling. If true, the captions
   */
  toggleClosedCaptioning(force?: boolean): void {
    Caption.toggleCaptions(force);
  }
  /**
   * Subscribes to closed captioning events
   * @param  handler contains events that may be subscribed to
   * @return         function that ubsubscribes hanlder
   */
  subscribeToCaptioningEvents(handler: {
    onCaptioningToggled: (callback: any) => void;
    onCaptionCreated: (callback: any) => void;
    onCaptionUpdated: (callback: any) => void;
  }): any {
    return symblEvents.subscribe('caption', handler);
  }

  /**
   * [subscribeToInsightEvents description]
   * @param  handler contains handler emitted when an insight is created.
   * @return         [description]
   */
  subscribeToInsightEvents(handler: {
    onInsightCreated: (callback: any) => void;
  }): any {
    return symblEvents.subscribe('insight', handler);
  }
  subscribeToTopicEvents(handler: {
    onTopicCreated: (callback: any) => void;
  }): any {
    return symblEvents.subscribe('topic', handler);
  }

  subscribeToTranscriptEvents(handler: {
    onTranscriptCreated: (callback: any) => void;
  }): any {
    return symblEvents.subscribe('transcript', handler);
  }
  /**
   * Get's Symbl's conversationId
   * @return      Symbl Websocket conversation id.
   */
  get conversationId(): string {
    if (!symblSocket) {
      throw new Error(
        'Cannot retrieve conversation ID. Symbl is not connected.',
      );
    }
    return symblSocket.conversationId;
  }
  muteHandler(isMuted: boolean) {
    console.log('Symbl mute', isMuted);
    if (symblSocket) {
      symblSocket.mute(isMuted);
    }
    if (isMuted && symblSocket) {
      if (symblSocket.requestStarted) {
        symblSocket.gainNode.gain.value = 0;
        symblSocket.stopRequest();
        symblSocket.close();
        symblSocket = null;
      }
    }
    this.isMuted = isMuted;
  }
  /**
   * Disconnect the Symbl adapter
   */
  disconnect(): void {
    try {
      symblSocket.close();
    } catch (err) {
      console.error('Error on Symbl Disconnect', err);
    }
  }
  /**
   * Connects Symbl to the real-time meeting room
   * @return Promise that resolves with an instance of the Symbl Socket class after connection
   */
  async start(): Promise<any> {
    console.log('Symbl Connecting!');
    if (this.isMuted) {
      console.log('Symbl not connecting, muted');
      return;
    }
    if (ws) {
      console.log('SymblSocket already exists', SymblSocket, websocketOpened);
      if (symblSocket && symblSocket.requestStarted) {
        return;
      } else {
        //new code by me
        websocketOpened = false;
        //return;
      }
    }
    if (websocketOpened) {
      return;
    }
    websocketOpened = true;
    const wsPromise = new Promise<SymblSocket>((resolve, reject) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        ws = null;
      }
      ws = new WebSocket(this.url);
      Symbl.state = 'CONNECTING';
      ws.onerror = (err: Event) => {
        console.error('Connection Failed.', err);
        Symbl.state = 'FAILED';
        reject(err);
      };
      ws.onopen = () => {
        Symbl.state = 'CONNECTED';
        console.log('Connection established.');
        symblSocket = new SymblSocket(this.config, this.credentials);
        if (ws.readyState === WebSocket.OPEN) {
          symblSocket.startRequest();
        }
        resolve(symblSocket);
      };
    });
    try {
      await wsPromise;
      return Promise.resolve(symblSocket);
    } catch (error) {
      console.error('ERROR - failed to initialize websocket - ', error);
    }
  }

  /**
   * Sends a `stop_recognition` event.
   * @return
   */
  stop(): void {
    if (symblSocket && symblSocket.requestStarted) {
      symblSocket.stopRequest();
      symblSocket
        .close()
        .then(() => {
          symblSocket = null;
        })
        .catch((error) =>
          console.error('Error while closing the socket', error),
        );
      console.log('inside symbl class stop.');

      symblSocket.ws = null;
      symblSocket = null;
    }
  }
  /**
   * Retrieves the meeting summary URL.
   * @return Promise that resolves the Meeting Summary URL.
   */
  async getSummaryUrl(): Promise<string> {
    const res = await fetch(
      `https://api.symbl.ai/v1/conversations/${this.conversationId}/experiences`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Symbl.ACCESS_TOKEN,
        },
        mode: 'cors',
        body: JSON.stringify({
          name: 'verbose-text-summary',
        }),
      },
    );
    const data = await res.json();

    ///storing summary url in storage

    ////
    return Promise.resolve(data.url);
  }
}
