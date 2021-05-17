import React, {useContext,useEffect, useState} from 'react';
import { TagCloud } from 'react-tagcloud';
import {Typography} from "@material-ui/core";
import Emitter from '../../bridge/rtc/web/emitter';
import {render} from "react-dom";



let data = [
    { value: 'jQuery', count: 25 },
    { value: 'MongoDB', count: 18 },
    { value: 'JavaScript', count: 38 },
    { value: 'React', count: 30 },
    { value: 'Nodejs', count: 28 },
    { value: 'Express.js', count: 25 },
    { value: 'HTML5', count: 33 },
    { value: 'CSS3', count: 20 },
    { value: 'Webpack', count: 22 },
    { value: 'Babel.js', count: 7 },
    { value: 'ECMAScript', count: 25 },
    { value: 'Jest', count: 15 },
    { value: 'Mocha', count: 17 },
    { value: 'React Native', count: 27 },
    { value: 'Angular.js', count: 30 },
    { value: 'TypeScript', count: 15 },
    { value: 'Flow', count: 30 },
    { value: 'NPM', count: 11 },
]


export default (props:any) => {
    let t=[{value:"test",count:20}];
    const [topic,setTopic]= useState(t);

    Emitter.on('topic_created', (newValue) => {
        let d1=JSON.parse(newValue);
        if(d1.data.score>.01) {


            //t.push({value:d1.data.phrases,count:d1.data.score*100});
            console.log(t);
            let flag=true;
            for(let i=0;i<topic.length;i++)
            {
                if(topic[i].value.includes(d1.data.phrases)){
                    flag=!flag;
                    break;
                }
            }
            if(flag)
            {
                setTopic([...topic, {value: d1.data.phrases, count: d1.data.score * 100}]);

            }
        }

    });
    useEffect(()=>{
        console.log("inside Symbl Topics");
    },[t]);

    return(
        <div id="to">
    <TagCloud
        id="top"
        minSize={12}
        maxSize={35}
        tags={topic}
        className="simple-cloud"
        onClick={tag => alert(`'${tag.value}' was selected!`)}
    >

    </TagCloud>
        </div>)
}