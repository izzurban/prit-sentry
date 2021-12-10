import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Button } from 'react-bootstrap';
import styles from './issues.style.native.js';

const CardList = ({ issue, order, updated }) => {  
  const {
    row1BgGrey,
    rowTitle,
    title,
    subtitle,
    textSubtitle,
    rowError,
    col2,
    colTitle,
    rowValue,
  } = styles;
  
  return (
    <Row style={row1BgGrey}>
      <Col style={{ minWidth: '10%', marginLeft: 0 }}>
        <a href={issue.permalink.toString()} target="_blank" rel="noreferrer noopener">
          <Button variant={updated}>Ver no Sentry</Button>
        </a>
      </Col>
      <Col style={{ minWidth: '50%', marginLeft: 0 }}>
        <Row style={rowTitle}>
          <text style={title}>
            {`${order} - ${issue.metadata?.type ? issue.metadata?.type : "<Unknown>"}`}
          </text>
        </Row>
        <Row style={subtitle}>
          <text style={textSubtitle}>
            {issue.culprit}
          </text>
        </Row>
        <Row style={rowError}>
          {issue.metadata?.value}
        </Row>
      </Col>
      <Col style={col2}>
        <Row style={{ width: '100%', height: '40%' }}>
          <text style={colTitle}>
            <b>{`Primeira`}</b>
          </text>
        </Row>
        <Row style={rowValue}>
          {`${issue.firstSeen?.substr(0, 10)} \n ${issue.firstSeen?.substr(11, 5)}h`}
        </Row>
      </Col>
      <Col style={col2}>
        <Row style={{ width: '100%', height: '40%' }}>
          <text style={colTitle}>
            <b>{`Última`}</b>
          </text>
        </Row>
        <Row style={rowValue}>
          {`${issue.lastSeen?.substr(0, 10)} \n ${issue.lastSeen?.substr(11, 5)}h`}
        </Row>
      </Col>
      <Col style={col2}>
        <Row style={{ width: '100%', height: '40%' }}>
          <text style={colTitle}>
            <b>{`All Users`}</b>
          </text>
        </Row>
        <Row style={rowValue}>
          {`${issue.userCount}`}
        </Row>
      </Col>
      <Col style={col2}>
        <Row style={{ width: '100%', height: '40%' }}>
          <text style={colTitle}>
            <b>{`All Events`}</b>
          </text>
        </Row>
        <Row style={rowValue}>
          {`${issue.count}`}
        </Row>
      </Col>
    </Row>
  );
};

export default CardList;
