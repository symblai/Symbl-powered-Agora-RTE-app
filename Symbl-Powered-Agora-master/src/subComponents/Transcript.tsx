import React, { useContext } from 'react';

const Transcript = ({ transcript }) => {
  return transcript.map((element) => {
    return (
      <div key={element.id} style={styles.wrapper}>
        <div style={styles.userName}> {element.userName}</div>
        <div style={styles.message}> {element.message} </div>
        <div style={styles.date}>
          {' '}
          {new Date(element.timeStamp).toLocaleString()}{' '}
        </div>
      </div>
    );
  });
};

export default Transcript;

const styles = {
  wrapper: {
    backgroundColor: 'rgba(30, 164, 253, 0.1)',
    margin: '5px 15px',
    padding: 8,
    color: 'rgba(0, 0, 0, 1)',
  },
  userName: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontSize: 16,
    padding: 2,
  },
  message: { padding: 2, fontSize: 14, fontFamily: 'Helvetica' },
  date: {
    textAlign: 'right',
    fontWeight: 200,
    fontSize: 11,
    marginLeft: 15,
    fontFamily: 'Helvetica',
  },
};
