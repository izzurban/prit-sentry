
export const InputDbKey = ({ setDbKey }) => {
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
};


export const InputJsonList = ({setNewJson}) => {
  return (
    <div className="form-group">
      <a href="https://sentry.io/api/0/projects/prit-app/prit-app-business/issues/" target="_blank" rel="noreferrer noopener">
        New Json from https://sentry.io/api/0/projects/prit-app/prit-app-business/issues/
      </a>
      <textarea
        style={{ width: '90%', textAlign: 'center', margin: 20, marginLeft: 60 }}
        className="form-control"
        rows="1"
        onChange={el => {
          setNewJson(JSON.parse(el.target.value))
          el.target.value = 'Ok'
        }}
      />
    </div>
  );
};

  
export const InputJsonDetails = ({ issueId, setNewDetails, disabled }) => {
  return (
    <div className="form-group">
      <a href={`https://sentry.io/api/0/issues/${issueId}/hashes/`} target="_blank" rel="noreferrer noopener">
        {`New Details from https://sentry.io/api/0/issues/${issueId}/hashes/`}
      </a>
      <textarea
        style={{ width: '90%', textAlign: 'center', margin: 20, marginLeft: 60 }}
        className="form-control"
        disabled={disabled}
        rows="1"
        onChange={el => {
          setNewDetails(JSON.parse(el.target.value))
          el.target.value = 'Ok'
        }}
      />
    </div>
  )
};

const saveOnDb = async (item, success) => {
  try {
    let result = await item.save();
    console.log('New object created with objectId: ' + result);
    success++;
  } catch (error) {
    alert('Failed to create new object, with error code: ' + error.message);
  };
};

export const saveIssuesList = async (Parse, resultIssues) => {
  let success = 0;
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
        saveOnDb(issue, success);
      }
    });
  } catch (err) {
    console.log('erro', err)
  }
  alert(`${success} issues atualizados com sucesso!`)
};

export const newListCompare = (issuesData, resultIssues, newList) => {
  const newErrors = newList;
  const issuesOldData = JSON.parse(JSON.stringify(issuesData));

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

  issuesOldData.forEach((element) => {
    const el = element.attributes ? element.attributes : element;
    resultIssues.push({
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

export const cleanDetails = (e, setCleanNewDetails) => {
    if (!e.length) { return null }
    const event = e[0].latestEvent;
    const result = {
      id: event.groupID,
      device: event.contexts.device,
      os: event.contexts.os,
      tags: event.tags,
      user: event.user,
    }
    setCleanNewDetails(result);
};


export const saveDetails = async (
  Parse,
  newIssueDetail,
  lastSeen,
  setResult,
  setNewIssueDetail,
) => {
  const saveOnDb = async (item) => {
    try {
      let result = await item.save();
      console.log('New object created with objectId: ', result);
      setNewIssueDetail(null);
        
    } catch (error) {
      alert('Failed to create new object, with error code: ' + error.message);
      console.log('erro ao salvar: ', error);
    };
  };

  try {
    const result = new Parse.Object("issuesDetails");
    result.set("id", newIssueDetail.objectId || null);
    result.set("issueId", newIssueDetail.id);
    result.set("os", newIssueDetail.os);
    result.set("tags", newIssueDetail.tags);
    result.set("user", newIssueDetail.user);
    result.set("device", newIssueDetail.device);
    result.set("lastSeen", lastSeen);

    saveOnDb(result);
    setResult(result);
  } catch (err) {
    console.log('erro', err)
  }
};