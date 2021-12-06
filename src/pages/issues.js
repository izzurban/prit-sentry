import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row, Container } from 'react-bootstrap';
import styles from './issues.style.native.js';

const Issues = () => {
  const [issuesData, setIssuesData] = useState([]);
  const [resultIssues, setResultIssues] = useState([]);
  const [newJson, setNewJson] = useState([]);
  const [dbKey, setDbKey] = useState(null);
  
  const lastUpdated = '01/01 - 00:00h';
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
  
  var Parse = require('parse/node');

  useEffect(() => { 
    if (dbKey) {
      Parse.initialize("AOIkbVtbBP9IfqV80DyYBCNul4DYR03MNcikFamg", dbKey); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
      Parse.serverURL = 'https://parseapi.back4app.com/'
    }
  }, [dbKey])

  const transformData = (origin, destiny) => {
    origin.forEach((element) => {
      const el = element.attributes ? element.attributes : element;
      destiny.push({
        objectId: element.objectId || '',
        issueId: el.issueId || el.id,
        title: el.title,
        culprit: el.culprit,
        permalink: el.permalink,
        level: el.level,
        platform: el.platform,
        projectName: el.project?.name || '',
        type: el.type,
        metadata: {
          value: el.metadata.value,
          type: el.metadata.type,
          filename: el.metadata.filename,
          function: el.metadata.function,
          display_title_with_tree_label: el.metadata.display_title_with_tree_label,
        },
        hasSeen: el.hasSeen,
        isUnhandled: el.isUnhandled,
        count: el.count,
        userCount: el.userCount,
        firstSeen: el.firstSeen,
        lastSeen: el.lastSeen,
        updated: el.updated,
      })
    });
  };
  
  const getIssuesList = async (issue_id = null) => {
    const issuesListData = Parse.Object.extend('issuesList');
    const query = new Parse.Query(issuesListData);

    // You can also query by using a parameter of an object
    // query.equalTo('issue_id', '1668114260');
    try {
      const results = await query.find();
      const newData = toObject(results);
      setIssuesData(newData);
    } catch (error) {
      console.error('Error while fetching issuesList', error);
    };
  };

  useEffect(() => {
    getIssuesList();
  }, [Parse, dbKey]);

  const toObject = (data) => {
    return JSON.parse(JSON.stringify(data))
  }

  const GetDbKey = () => {
    return (
      <div className="form-group">
        <label>
          Insira o dbKey
        </label>
        <textarea
          style={{ width: '90%', textAlign: 'center', margin: 20, marginLeft: 60 }}
          className="form-control"
          rows="1"
          onChange={el => { if (el.target.value.length === 40) { setDbKey(el.target.value) } }}
        />
      </div>
    )
  }

  const IssuesRow = () => {
    return (
      <Container>
        {issuesData.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)).map((issue, index) => {
          return (
            <Row style={row1BgGrey}>
              <Col style={{ minWidth: '60%' }}>
                <Row style={rowTitle}>
                  <text style={title}>
                    {`${issue.metadata?.type ? issue.metadata?.type : "<Unknown>"}`}
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
              {/**? coluna data ocorrencias */}
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
              {/** aaaaaaaaaaaaaaaaaaa  */}
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
              <Button variant="primary" href={issue.permalink}>Ver no Sentry</Button>
            </Row>
          )
        })}
      </Container>
    )
  }

  const TextareaPage = () => {
    return (
      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1" href="https://sentry.io/api/0/projects/prit-app/prit-app-business/issues/">
          New Json from https://sentry.io/api/0/projects/prit-app/prit-app-business/issues/
        </label>
        <textarea
          style={{ width: '90%', textAlign: 'center', margin: 20, marginLeft: 60 }}
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="1"
          onChange={el => { setNewJson(JSON.parse(el.target.value)) }}
        />
      </div>
    )
  };

  const compare = () => {
    const newErrors = newJson;
    const issuesOldData = toObject(issuesData);

    newErrors.forEach((newError, index) => {
      const foundOld = issuesOldData.findIndex(el => el.issueId === newError.id);
      console.log(`${index} - issue Id: ${newError.id} / duplicado: ${foundOld !== -1} new: ${newError.lastSeen} old: ${foundOld !== -1 ? issuesOldData[foundOld].lastSeen : ''}`)
      if (foundOld !== -1 && newError.lastSeen === issuesOldData[foundOld].lastSeen) {
        issuesOldData[foundOld].updated = false;
        issuesOldData.splice(foundOld, 1);
        console.log('updated false')
      } else {
        console.log('updated true - novo')
        newError.updated = true;
        if (foundOld !== -1) {
          console.log('updated true  - atualizado')
          newError.objectId = issuesOldData[foundOld].objectId;
          issuesOldData.splice(foundOld, 1);
        }
        issuesOldData.push(newError);
      }
    });

    transformData(issuesOldData, resultIssues);
  };

  const validadeJson = () => {
    return !!(newJson.length===0 || (Array.isArray(newJson) && newJson.length>0 && newJson[0].id));
  };

  useEffect(() => {
    const valid = validadeJson();
    if (!valid) { setNewJson([]) };
  }, [newJson])

  const saveIssuesList = async () => {
    let sucess = 0;

    const saveOnDb = async (item) => {
      try {
        let result = await item.save();
        console.log('New object created with objectId: ' + result);
        sucess++;
      } catch (error) {
        alert('Failed to create new object, with error code: ' + error.message);
      };
    };

    try {
      resultIssues.forEach((el) => {
        if (el.updated) {
          const issue = new Parse.Object("issuesList");
          issue.set("id", el.objectId || null);
          issue.set("issueId", el.issueId);
          issue.set("shareId", el.shareId)
          issue.set("shortId", el.shortId)
          issue.set("title", el.title)
          issue.set("culprit", el.culprit)
          issue.set("permalink", el.permalink)
          issue.set("logger", el.logger)
          issue.set("level", el.level)
          issue.set("status", el.status)
          issue.set("statusDetails", el.statusDetails)
          issue.set("isPublic", el.isPublic)
          issue.set("platform", el.platform)
          issue.set("projectName", el.project?.name || '')
          issue.set("type", el.type)
          issue.set("numComments", el.numComments)
          issue.set("assignedTo", el.assignedTo)
          issue.set("isBookmarked", el.isBookmarked)
          issue.set("isSubscribed", el.isSubscribed)
          issue.set("subscriptionDetails", el.subscriptionDetails)
          issue.set("hasSeen", el.hasSeen)
          issue.set("annotations", el.annotations)
          issue.set("isUnhandled", el.isUnhandled)
          issue.set("count", el.count)
          issue.set("userCount", el.userCount)
          issue.set("firstSeen", el.firstSeen)
          issue.set("lastSeen", el.lastSeen)
          issue.set("stats", el.stats)
          issue.set("metadata", {
            "value": el.metadata.value,
            "type": el.metadata.type,
            "filename": el.metadata.filename,
            "function": el.metadata.function,
            "display_title_with_tree_label": el.metadata.display_title_with_tree_label,
          })
          saveOnDb(issue);
        }
      });
    } catch (err) {
      console.log('erro', err)
    }
    alert(`${sucess} issues atualizados com sucesso!`)
  };

  return (
    <div style={{ width: '100%', textAlign: 'center', padding: 20 }}>
      <h1>Issues from Sentry</h1>
      {!dbKey &&
        <GetDbKey/>
      }
      {dbKey &&
        <>
          <h4>Updated at {lastUpdated}</h4>
          <IssuesRow />
          <TextareaPage />
          <Button variant="primary" onClick={() => compare()} >Comparar</Button>
          <Button variant="primary" onClick={() => saveIssuesList()} >Save Issues List</Button>
        </>
      }
    </div>
  )
};

export default Issues;
