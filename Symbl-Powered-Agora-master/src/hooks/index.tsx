import react, { useContext, useEffect, useState } from 'react';
import PropsContext from '../../agora-rn-uikit/src/PropsContext';
import { SendStream } from '../../bridge/rtc/web/SendStream';

export const useTranscript = () => {
  const [transcriptItems, setTrascriptItems] = useState([]);
  const [insights, setInsights] = useState([]);
  const { callbacks, rtcProps } = useContext(PropsContext);
  const transcriptHandler = {
    onTranscriptCreated: ({ id, message, timeStamp, ...rest }) => {
      const transcriptObj = { id, message, timeStamp, ...rest };
      setTrascriptItems((prev) => [...prev, transcriptObj]);
    },
  };
  const insightHandler = {
    onInsightCreated: ({ data: { id, payload, ...rest } }) => {
      const insightObj = { id, payload, ...rest };
      setInsights((prev) => [...prev, insightObj]);
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SendStream(
          rtcProps.channel,
          rtcProps.uid || 0,
          null,
        );
        data.symbl.subscribeToTranscriptEvents(transcriptHandler);
        data.symbl.subscribeToInsightEvents(insightHandler);
      } catch (error) {
        console.error('Cant open stream -- ', error);
      }
    };
    fetchData();
  }, []);
  return { transcriptItems, insights };
};
