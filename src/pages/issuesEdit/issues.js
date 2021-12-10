import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Container } from 'react-bootstrap';
import styles from './issues.style.native.js';
import CardList from './CardList.js';
import CardDetails from './CardDetails.js';
import { InputDbKey, InputJsonList, saveIssuesList, newListCompare, cleanDetails } from './utils.js';

const IssuesEdit = ({edit = false}) => {
  const [issuesData, setIssuesData] = useState([]);
  const [newList, setNewList] = useState([]);
  const [resultIssues, setResultIssues] = useState([]);
  const [dbKey, setDbKey] = useState(null);
  const [detailsData, setDetailsData] = useState([]);
  const [newDetails, setNewDetails] = useState([]);
  const [cleanNewDetails, setCleanNewDetails] = useState([]);
  const [showCard, setShowCard] = useState(false);
  
  const lastUpdated = '01/01 - 00:00h';
  
  const {
    row1BgGrey,
  } = styles;
  
  var Parse = require('parse/node');
  const getIssuesList = async () => {
    const issuesListData = Parse.Object.extend('issuesList');
    const query = new Parse.Query(issuesListData);
    // You can also query by using a parameter of an object
    // query.equalTo('issue_id', '1668114260');
    try {
      const results = await query.find();
      const newData = JSON.parse(JSON.stringify(results));
      setIssuesData(newData);
    } catch (error) {
      console.error('Error while fetching issuesList', error);
    };
  };

  const getDetails = async () => {
    const issueDetailsData = Parse.Object.extend('issuesDetails');
    const query = new Parse.Query(issueDetailsData);

    // You can also query by using a parameter of an object
    // query.equalTo('issueId', issueId.toString());
    try {
      const results = await query.find();
      const newData = JSON.parse(JSON.stringify(results));
      setDetailsData(newData);
    } catch (error) {
      console.error('Error while fetching issuesList', error);
    };
  };
  
  useEffect(() => {
    if (dbKey) {
      Parse.initialize("AOIkbVtbBP9IfqV80DyYBCNul4DYR03MNcikFamg", dbKey); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
      Parse.serverURL = 'https://parseapi.back4app.com/'
      getIssuesList();
      getDetails();
    }
  }, [dbKey]);

  useEffect(() => {
    const isValid = (newList.length === 0
      || (Array.isArray(newList)
        && newList.length > 0
        && newList[0].id)
    );
    if (!isValid) { setNewList([]) };
  }, [newList]);
  
  useEffect(() => {
    const isValid = (newDetails.length === 0
      || (Array.isArray(newDetails)
        && newDetails.length > 0
        && newDetails[0].latestEvent
        && newDetails[0].latestEvent.groupID === showCard)
    );

    if (!isValid) {
      setNewDetails([])
      alert('Dados inválidos!')
    } else {
      cleanDetails(newDetails, setCleanNewDetails);
      //salvar db
    }
  }, [newDetails])
  
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: 20 }}>
      <h1>Issues from Sentry</h1>
      {!dbKey &&
        <InputDbKey setDbKey={setDbKey} />
      }
      {dbKey &&
        <>
          <h4>Updated at {lastUpdated}</h4>
          <Container>
          {issuesData.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)).map((issue, index) => {
            const detailIssueData = detailsData.find(e => e.issueId === issue.issueId);
            const updated = detailIssueData ? (issue.lastSeen === detailIssueData.lastSeen)?"success": "danger" : "danger" ;
              return (
                <Row style={row1BgGrey}>
                  <Col style={{ minWidth: '60%' }}>
                    <CardList
                      issue={issue}
                      order={index + 1}
                      updated={updated}
                    />
                  </Col>
                  <CardDetails
                    detailsData={detailIssueData}
                    showCard={showCard}
                    setShowCard={setShowCard}
                    issueId={issue.issueId}
                    cleanNewDetails={cleanNewDetails}
                    setNewDetails={setNewDetails}
                    resultIssues={resultIssues}
                    lastSeen={issue.lastSeen}
                    edit={edit}
                  />
                </Row>
              )
            })}
        </Container>
        {edit &&
          <>
            <InputJsonList setNewJson={setNewList} />
            <Button variant="primary" onClick={() => newListCompare(issuesData, resultIssues, newList)} >Comparar</Button>
            <Button variant="primary" onClick={() => saveIssuesList(Parse, resultIssues)} >Save Issues List</Button>
          </>
        }
        </>
      }
    </div>
  )
};

export default IssuesEdit;
