import React, { Component } from 'react';
import { ReactiveBase, DataSearch, ResultList } from '@appbaseio/reactivesearch';
import './App.css';
import dotenv from 'dotenv'

dotenv.config()

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

  return (
    <div dangerouslySetInnerHTML={{ __html: truncate(document.text, 500) }}></div>
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

function ToIndexName(baseIndex, language) {
  let lang = language == null ? "nl" : language.toLowerCase(); 
  return baseIndex + "-" + lang
}

class App extends Component {
  default_country = "NL"
  index_name = ToIndexName(process.env.REACT_APP_INDEX, this.defaultCountry);

  render() {
    return (
       <div className="container">
          <div className="title">
            SURFpol
          </div>
          <ReactiveBase
            app={this.index_name}
            credentials={process.env.REACT_APP_CREDENTIALS}
            url={process.env.REACT_APP_URL}
            headers={{
              "X-SURFpol-Search-Session-ID": this.props.session_id
            }}
            analytics={true}
            >
            <DataSearch
              componentId="SearchText"
              dataField={["text", "title^2"]}
              placeholder=""
              debounce={250}
              queryFormat="and"
              highlight
              autosuggest={false}
              customHighlight={(props) => ({
                highlight: {
                    pre_tags: ['<mark>'],
                    post_tags: ['</mark>'],
                    fields: {
                        'text': {},
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
