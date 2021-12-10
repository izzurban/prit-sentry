import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Container } from 'react-bootstrap';
import styles from './issues.style.native.js';
import { InputJsonDetails, saveDetails } from './utils.js';

const CardDetails = (
  { issueId,
    cleanNewDetails,
    showCard,
    setNewDetails,
    detailsData,
    setShowCard,
    lastSeen,
    edit,
  }) => {
  
  const {
    colTitle,
    rowValue,
    rowCard2,
  } = styles;
  var Parse = require('parse/node');

  const [inputDetailsDisabled, setInputDetailsDisabled] = useState(false);
  const [newIssueDetail, setNewIssueDetail] = useState(null);
  const [result, setResult] = useState(null);
  const [issueDetail, setIssueDetail] = useState(detailsData);

  useEffect(()=>{
    setIssueDetail(detailsData)
  }, [detailsData]);
  
  useEffect(() => {
    if (cleanNewDetails.id === issueId) {
      const auxNewDetails = cleanNewDetails;
      if (issueDetail) {
        auxNewDetails.objectId = issueDetail.objectId;
      }
      setNewIssueDetail(auxNewDetails);
    }
  }, [cleanNewDetails]);
  
  useEffect(() => {
    if (newIssueDetail) {
      saveDetails(Parse, newIssueDetail, lastSeen, setResult, setNewIssueDetail)
      setInputDetailsDisabled(true);
    };
  }, [newIssueDetail]);
  
  useEffect(() => {
    if (result) {
      const aux = JSON.parse(JSON.stringify(result));
      setIssueDetail({
        device: aux.device,
        issueId: aux.issueId,
        os: aux.os,
        tags: aux.tags,
        user: aux.user,
      })
    }
  }, [result]);

  const DetailCol = ({ data, title }) => {
    return (
      <Container>
        <Row>
          <text style={colTitle}>
            <b>{title}</b>
          </text>
        </Row>
        {data && Object.keys(data).map((e) => {
          const isBytes = (
            e === 'memory_size'
            || e === 'free_memory'
            || e === 'storage_size'
            || e === 'free_storage'
          );
          const text = data[e]=== null ? 'null' : isBytes? Math.floor(data[e]/1000000) + ' Mb' : data[e].toString();
          return (
            <Row>
              <Col style={rowValue}>
                <text style={colTitle}>
                  <b>{e}</b>
                </text>
              </Col>
              <Col style={rowValue}>
                <text style={colTitle}>
                  {text}
                </text>
              </Col>
            </Row>
          )
        })}
      </Container>
    )
  }

  const Tag = ({ tags }) => {
    return (
      <Container>
        <Row>
          <text style={colTitle}>
            <b>TAGS DATA</b>
          </text>
        </Row>
        {tags.map((tag) => {
          return (
            <Row>
              <Col>
                <text style={colTitle}>
                  <b>{tag.key}</b>
                </text>
              </Col>
              <Col style={rowValue}>
                <text style={colTitle}>
                  {tag.value}
                </text>
              </Col>
            </Row>
          )
        })}
      </Container>
    )
  };

  return (
    <Container>
      {(showCard !== issueId) && <Button style={{ width: '100%', marginTop: 20, marginBottom: 8 }} variant="primary" onClick={() => setShowCard(issueId)}>MoreInfo</Button>}
      {(showCard === issueId) &&
        <Col style={{ width: '90%' }}>
        {issueDetail &&
          <Container>
            <Row style={{ minWidth: '60%' }}>
              <Col style={{ width: '50%' }}>
                <Row style={rowCard2}>
                  <DetailCol data={issueDetail.os} title={'OS INFORMATION'} />
                </Row>
              </Col>
              <Col style={{ width: '50%' }}>
                <Row style={rowCard2}>
                  <DetailCol data={issueDetail.user} title={'USER INFORMATION'} />
                </Row>
              </Col>
            </Row>
            <Row style={{ minWidth: '60%' }}>
              <Col style={{ width: '50%' }}>
                <Row style={rowCard2}>
                  <Tag tags={issueDetail.tags} />
                </Row>
              </Col>
              <Col style={{ width: '50%' }}>
                <Row style={rowCard2}>
                  <DetailCol data={issueDetail.device} title={'DEVICE INFORMATION'} />
                </Row>
              </Col>
            </Row>
          </Container>
        }
        {!issueDetail &&
          <Row>
            <text>Nenhum dado para exibir</text>
          </Row>
        }
        {edit && <InputJsonDetails issueId={issueId} setNewDetails={setNewDetails} disabled={inputDetailsDisabled} />}
        </Col>
      }
    </Container>
  );
};

export default CardDetails;
