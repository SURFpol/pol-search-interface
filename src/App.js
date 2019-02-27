import React, { Component } from 'react';
import { ReactiveBase, DataSearch, ResultList } from '@appbaseio/reactivesearch';
import './App.css';

function Keywords(props) {
  if (props.keywords.length === 0)
    return null; 

  return (
    <div className="keywords">
      {props.keywords.map((keyword, i) => {
        return <Badge key={i} name={keyword}/>; 
      })}
    </div>
  );
}

function truncate(string, length) {
  if (string.length > length)
    return string.substring(0, length) + '...';
  return string;
}

function Title(props) {
  return ( 
    <span dangerouslySetInnerHTML={{ __html: props.text}}></span>
  );
}

function Text(props) {
  const document = props.document;

  var html = null;
  if ('text.en' in document)
    html = document['text.en'];
  else if ('text.nl' in document)
    html = document['text.nl'];
  else {
    if ('nl' in document.text)
      html = truncate(document.text['nl'], 500);
    else
      html = truncate(document.text['en'], 500);
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: html}}></div>
  )
}

function Badge(props) {
  // Strip leading hashbang
  let name = props.name;
  if (name[0] === '#')
    name = name.slice(1, name.length); 

  return (
    <span className="badge">{name}</span>
  );
}

function HumanizedMimeType(props) {
  let mapping = new Map([
    ['powerp.', 'ppt'],
    ['word', 'doc'],
    ['video', 'video'],
    ['pdf', 'pdf']
  ]);

  let hum_mime_type = mapping.get(props.mime_type);

  return (
    <p className="mime-type">[{hum_mime_type}]</p>
  );
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="title">
          SURFpol
        </div>
        <ReactiveBase
          app=""
          credentials=""
          url=""
          headers={{
            "X-SURFpol-Search-Session-ID": this.props.session_id
          }}
          analytics={true}
          >
          <DataSearch
            componentId="SearchText"
            dataField={["text.en", "text.nl", "title"]}
            defaultSelected="injectie"
            debounce={250}
            highlight
            autosuggest={false}
            customHighlight={(props) => ({
              highlight: {
                  pre_tags: ['<mark>'],
                  post_tags: ['</mark>'],
                  fields: {
                      'text.en': {},
                      'text.nl': {},
                      title: {}
                  },
                  number_of_fragments: 100,
                  fragment_size: 500
              },
            })}
          />
          <ResultList
            componentId="SearchResult"
            dataField={"text"}
            size={10}
            onData={this.onData}
            className="result-list-container"
            pagination
            react={{
              and: 'SearchText',
            }}
          />
        </ReactiveBase>
      </div>
    );
  }

  onData(data) {
    return ({
      title: (
        <div>
          <a className="title-link" href={data.url}><HumanizedMimeType mime_type={data.humanized_mime_type}/> <Title text={data.title}/></a>
          <br/>
          <a className="subtitle-link" href={data.url}>{data.url}</a>
        </div>
      ),
      description: (
        <div>
          <Text document={data}/>
          <div className="article-footer">
            <p className="corpus-name">Collectie</p><p>: {data.collection_name}</p>
          </div>
          <Keywords keywords={data.keywords}/>
        </div>
      )
    });
  }
}


export default App;
