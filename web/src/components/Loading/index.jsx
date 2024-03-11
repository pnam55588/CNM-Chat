import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import clsx from 'clsx';
import Styles from './Loading.module.scss'



export default function Loading() {
  return (
    <div className={clsx(Styles.loadingWrap)}>
      <Spinner animation="border" role="status">
      </Spinner>
    </div>
  );
}
