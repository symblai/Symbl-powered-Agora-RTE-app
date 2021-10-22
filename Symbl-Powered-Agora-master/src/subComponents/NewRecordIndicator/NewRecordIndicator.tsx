import React from 'react';
import styles from './NewRecordingIndicatore.styles';

interface NewRecordIndicatorProps {
  color: string;
  show: boolean;
}

const NewRecordIndicator = (props: NewRecordIndicatorProps) => {
  const { color, show } = props;

  return show ? showNewRecordIndicator(color) : <></>;
};

const showNewRecordIndicator = (color: string) => {
  return (
    <span style={{ ...styles.indicatorDot, backgroundColor: color }}> </span>
  );
};

export default NewRecordIndicator;
