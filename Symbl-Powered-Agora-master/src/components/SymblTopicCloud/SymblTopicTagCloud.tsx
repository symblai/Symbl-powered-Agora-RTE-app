import React, { useEffect, useState, useReducer, useRef } from 'react';
import { TagCloud } from 'react-tagcloud';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Emitter from '../../../bridge/rtc/web/emitter';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param tags 'react-tagcloud' module consumes the tags as data source
 * @param tag.value string value that will be rendered in the tag cloud
 * @param tag.count number value that is used to control relative tag size
 * @param tag.sentiment sentiment data object
 */
const ref = 2;
let t;
//let intTopic=[{"id":"6345234321","value":"Deep learning","count":0.2,"messageIds":["5089854032688320"],"sentiment":{"polarity":{"score":0.1},"suggested":"neutral"}}];
const intTopic = [];
const SymblTopicTagCloud = () => {
  const [topicData, setTopicData] = useState([]);
  const [preTopicData, setPreTopicData] = useState([
    {
      id: '6345234321',
      value: 'Deep learning',
      count: 0.2,
      messageIds: ['5089854032688320'],
      sentiment: { polarity: { score: 0.1 }, suggested: 'neutral' },
    },
  ]);
  const [topicCreated, setTopicCreated] = useState({});
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const mountedRef = useRef(true);
  const [recentTopic, setRecentTopic] = useState('');

  /*Emitter.on('topic_created',(val)=>{
        console.log(t);
        console.log(JSON.parse(val).data.phrases);

        if(JSON.parse(val).data.phrases!=t) {
            setRecentTopic(JSON.parse(val).data.phrases);
            t=JSON.parse(val).data.phrases;
            setTopicCreated(val);
            console.log("inside tag cloud" + topicCreated);
        }
    });*/
  const isEqual = function (value, other) {
    // Get the value type
    const type = Object.prototype.toString.call(value);

    const valueLen =
      type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen =
      type === '[object Array]' ? other.length : Object.keys(other).length;

    // Compare two items
    const compare = function (item1, item2) {
      console.log('comparing topics' + item1.value + item2.value);
      if (item1.value == item2.value) {
        return true;
      }
    };

    // Compare properties
    let match;
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        match = compare(value[i], other[i]);
      }
    }

    // If nothing failed, return true
    return true;
  };

  const cv = window.localStorage.getItem('conversationId');
  /* Emitter.on('topic_created', (newValue) => {
        let url= 'https://api.symbl.ai/v1/conversations/'+conversationId+'/topics?sentiment=true';
        fetch(url,
                {
                    method: 'GET',
                    headers: {
                         Accept: "application/json",
                        "Authorization": `Bearer ${window.localStorage.getItem('symbltoken')}`
                        }
                }
            )
                .then(response => response.text())
                .then(result => {
                    let  topics  = JSON.parse(result).topics;

                    if (topics.length === 0) {
                        console.log("no topics received");
                    }
                    else {
                        console.log("topic length greater than 0");
                        for(let i=0;i<topics.length;i++){
                             let {index,text, score, messageIds, sentiment}=topics[i];
                            let resu =false;
                            topicData.map(data=>{
                                if(data.value===topics[i].text){
                                    resu=true;

                                }
                            });
                            if(!resu)
                            {
                                setTopicData([...topicData, {id: index, value:text,count:score,messageIds: messageIds,sentiment: sentiment}]);
                                continue;
                            }


                        }
                    }})
                .catch(error => console.log('error', error));



    });*/
  /*useEffect(() => {
        // Update the document title using the browser API


            if(cv!=null){
                let url= 'https://api.symbl.ai/v1/conversations/'+window.localStorage.getItem("conversationId")+'/topics?sentiment=true&parentRefs=true';
                fetch(url,
                    {
                        method: 'GET',
                        headers: {
                            Accept: "application/json",
                            "Authorization": `Bearer ${window.localStorage.getItem('symbltoken')}`
                        }
                    }
                )
                    .then(response => response.text())
                    .then(result => {
                        let  topics  = JSON.parse(result).topics;

                        if (topics.length === 0) {
                            console.log("no topics received");
                        }
                        else {
                            console.log("topic length greater than 0");
                            for(let i=0;i<topics.length;i++) {
                                let {index, text, score, messageIds, sentiment} = topics[i];
                                let resu = false;
                                if (sentiment != undefined) {
                                    if (sentiment.suggested != undefined) {
                                        topicData.map(data => {
                                            if (data.value === topics[i].text) {
                                                resu = true;

                                            }
                                        });
                                        if (!resu) {
                                            setTopicData([...topicData, {
                                                id: uuidv4(),
                                                value: text,
                                                count: score,
                                                messageIds: messageIds,
                                                sentiment: sentiment
                                            }]);
                                            continue;
                                        }
                                        //forceUpdate();//force rendering when

                                    }
                                }
                            }
                        }})
                    .catch(error => console.log('error', error));

            }
            else{
                console.log("conversationId is null"+conversationId);

        }
        return () => { mountedRef.current = false }

    },[topicCreated]);*/
  /*useEffect(() => {
        // Update the document title using the browser API



        if(cv!=null){
            let url= 'https://api.symbl.ai/v1/conversations/'+window.localStorage.getItem("conversationId")+'/topics?sentiment=true&parentRefs=true';
            fetch(url,
                {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Authorization": `Bearer ${window.localStorage.getItem('symbltoken')}`
                    }
                }
            )
                .then(response => response.text())
                .then(result => {
                    let  topics  = JSON.parse(result).topics;

                    if (topics.length === 0) {
                        console.log("no topics received");
                    }
                    else {
                        console.log("topic length greater than 0");
                        let ar=[{"id":6345234321,"value":"Deep learning","count":0.2,"messageIds":["5089854032688320"],"sentiment":{"polarity":{"score":0.1},"suggested":"neutral"}}];
                        for(let i=0;i<topics.length;i++) {
                            let {index, text, score, messageIds, sentiment} = topics[i];
                            console.log("setting topic"+index+text+score+messageIds+sentiment)
                            if(sentiment!=undefined) {
                                if (sentiment.suggested != undefined) {
                                    ar.push({
                                        id: uuidv4(),
                                        value: text,
                                        count: score,
                                        messageIds: messageIds,
                                        sentiment: sentiment
                                    })

                                }
                            }
                        }
                        console.log(ar);
                        setTopicData([...topicData, ...ar]);
                        console.log(topicData);

                        //forceUpdate();//force rendering when
                    }})
                .catch(error => console.log('error', error));

        }
        else{
            console.log("conversationId is null"+conversationId);

        }
        return () => { mountedRef.current = false }


    },[]);*/
  useEffect(() => {
    isEqual(topicData, intTopic);
    setTopicData(intTopic);
    let isCancelled = false;
    function getTopics() {
      if (cv != null) {
        const url =
          'https://api-dev.symbl.ai/v1/conversations/' +
          window.localStorage.getItem('conversationId') +
          '/topics?sentiment=true&parentRefs=true';

        fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem(
              'symblTokenBE',
            )}`,
          },
        })
          .then((response) => response.text())
          .then((result) => {
            const topics = JSON.parse(result).topics;

            if (topics.length === 0) {
              console.log('no topics received');
            } else {
              const ar = [];
              for (let i = 0; i < topics.length; i++) {
                const { index, text, score, messageIds, sentiment } = topics[i];
                if (sentiment != undefined) {
                  if (sentiment.suggested != undefined) {
                    ar.push({
                      id: uuidv4(),
                      value: text,
                      count: score * 100,
                      messageIds: messageIds,
                      sentiment: sentiment,
                    });
                  }
                }
              }

              setTopicData([...topicData, ...ar]);
              t = { topicData };
              intTopic.length = 0;
              intTopic.push.apply(intTopic, ar);

              //forceUpdate();//force rendering when
            }
          })
          .catch((error) => console.log('error', error));
      } else {
        console.log('conversationId is null' + cv);
      }
    }
    if (!isCancelled) {
      getTopics();
    }
    const interval = setInterval(() => getTopics(), 5000);
    return () => {
      clearInterval(interval);
      isCancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <div
        style={{
          backgroundColor: 'rgba(30, 164, 253, 0.1)',
          padding: '10px',
          color: 'rgba(0, 0, 0, 1)',
        }}
      >
        <TagCloud
          minSize={12}
          maxSize={35}
          padding={20}
          tags={topicData}
          disableRandomColor={false}
          colorOptions={{
            hue: 'monochrome',
            luminosity: 'dark',
            seed: 'same',
          }}
          shuffle={false}
          renderer={customRenderer}
        />
      </div>
    </div>
  );
};

const styles = {
  gradientBar: {
    position: 'relative',
    height: '8px',
    width: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    marginTop: '8px',
    marginBottom: '6px',
    background: 'linear-gradient(to right, red, white, green)',
  },
  marker: {
    width: '2px',
    height: '18px',
    backgroundColor: '#00000090',
    position: 'absolute',
    top: -5,
  },
};

const customRenderer = (tag, size, color) => {
  if (
    tag != undefined &&
    tag.sentiment != undefined &&
    tag.sentiment.suggested != undefined
  ) {
    const getSentimentColor = (str) => {
      if (str === 'negative') {
        return '#FF7F7F';
      } // red
      if (str === 'positive') {
        return '#90ee90';
      } // green
      return 'grey';
    };

    function getMarkerPosition(score) {
      if (score <= -1) {
        return 0;
      }
      return ((score + 1) / 2) * 100;
    }

    const sentimentTooltip = (
      <>
        <Typography display="block" variant="caption" align="center">
          <b>{`${tag.value}`}</b>
        </Typography>
        <Divider light style={{ marginBottom: '6px' }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption">Sentiment:&nbsp;</Typography>
          <Typography
            variant="caption"
            style={{ color: getSentimentColor(tag.sentiment.suggested) }}
          >
            <b>{tag.sentiment.suggested}</b>
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption">Score:&nbsp;</Typography>
          <Typography variant="caption">
            <b>{`${tag.sentiment.polarity.score.toFixed(2)}`}</b>
          </Typography>
        </div>
        <div style={{ ...styles.gradientBar }}>
          <div
            style={{
              ...styles.marker,
              left: `${getMarkerPosition(tag.sentiment.polarity.score)}%`,
            }}
          />
        </div>
      </>
    );

    return (
      <Tooltip title={sentimentTooltip} arrow key={tag.id}>
        <span
          key={tag.id}
          style={{
            fontSize: `${size}px`,
            color,
            display: 'inline-block',
            margin: '0px 3px',
            verticalAlign: 'middle',
            cursor: 'default',
          }}
        >
          {tag.value}
        </span>
      </Tooltip>
    );
  } else {
    return <></>;
  }
};

export default SymblTopicTagCloud;
