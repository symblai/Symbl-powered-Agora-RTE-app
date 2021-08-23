import React, { useContext } from 'react';

const Insights = ({ insights }) => {
  return insights.map((element) => {
    return (
      <div style={styles.wrapper}>
        <div style={styles.type}>{element.type}</div>
        <div style={styles.text}>{element.payload.content}</div>
        <div style={styles.date}>{new Date().toLocaleString()} </div>
      </div>
      // let interInsight = ``;

      // console.log('Insight created', insight, insight.type);
      // insight.createElement();
      //       const div = document.createElement("div");
      //       div.innerHTML = `
      //                     <div style="background-color: rgba(30, 164, 253, 0.1); margin: 15px; padding: 8px; color: rgba(0, 0, 0, 1);">
      //     <div style="font-weight: bold;font-family: Roboto;font-style: normal; font-size: 12px;line-height: 14px;letter-spacing: 0.04em;text-align: left; margin-bottom: 5px;"> ${insight.type} </div>
      //     <div style="padding: 2px; font-size:13px "> ${insight.text} </div>
      //     <div style="text-align: right; font-weight: 200; font-size: 10px; margin-left: 15px;"> ${new Date().toLocaleString()} </span>
      // </div>
      //                         `;
      //       insight.element = div;
      //       const container = document.getElementById("transcriptContainer");
      //       insight.add(container);
      //       console.log("neeraj" + JSON.stringify(insight));
      //       console.log("neeraj" + JSON.stringify(insight.data.payload.content));
      //       console.log("neeraj" + JSON.stringify(insight));
      //       let insight_type = "";
      //       let helping_verb = "";
      //       if (insight.type == "action_item") {
      //         insight_type = "Action Item"
      //         helping_verb = "";
      //       }
      //       else if (insight.type == "follow_up") {
      //         insight_type = "Follow up";
      //         helping_verb = "";
      //       }
      //       else if (insight.type == "question") {
      //         insight_type = "Question";
      //         helping_verb = "asked";
      //       }
      //       else {
      //         insight_type = insight.type;
      //         console.log("new insight" + insight_type);
      //       }

      //       interInsight += `
      //                 <div style="background-color: rgba(30, 164, 253, 0.1); margin: 15px; padding: 8px; color: rgba(0, 0, 0, 1);">
      //     <div style="font-weight: bold;font-family: Helvetica;font-style: normal; font-size: 16px;line-height: 14px;letter-spacing: 0.04em;text-align: left; margin-bottom: 5px;"> ${insight_type} </div>
      //     <div style="padding: 2px; font-size:14px ;font-family: Helvetica"> ${insight.data.payload.content} </div>
      //     <div style="text-align: right; font-weight: 200; font-size: 10px; margin-left: 15px;"> ${new Date().toLocaleString()} </div>
      // </div>
      //                 `;
      //       console.log(interInsight);
      // if (document.getElementById("ST2")) {
      //   document.getElementById("ST2").innerHTML = interInsight;
      // }
    );
  });
};

export default Insights;

const styles = {
  wrapper: {
    backgroundColor: 'rgba(30, 164, 253, 0.1)',
    margin: 15,
    marginBottom: 0,
    padding: 8,
    color: 'rgba(0, 0, 0, 1)',
  },
  type: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontSize: 16,
    linHeight: 14,
    letterSpacing: '0.04em',
    textSlign: 'left',
    marginBottom: 5,
  },
  text: {
    fontFamily: 'Helvetica',
    padding: 2,
    fontSize: 13,
  },
  date: {
    textAlign: 'right',
    fontWeight: 200,
    fontSize: 11,
    marginLeft: 15,
    fontFamily: 'Helvetica',
  },
};
