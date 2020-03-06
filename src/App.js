import React from "react";
import "./App.css";
import text from "./quote.js";
import Axios from "axios";
import Graph from "./graph.js"
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedTyping: false,
      startTime: 0,
      quote: text,
      endTime: 0,
      tags: [],
      typedText: "",
      disableInput: true
    };
  }

  loadQuote = (e) => {
    if (e.keyCode === 27) {
      Axios.get("https://api.quotable.io/random?minLength=150")
      .then((payload) => {
        this.setState({
          quote: payload.data.content,
          startedTyping: false,
          startTime: 0,
          tags: [],
          typedText: "",
          disableInput: false,
          displayChart: false
        });
        document.getElementById("testInput").value = "";
        document.getElementById("testInput").setAttribute("autofocus", "");
        document.getElementById("result").innerHTML = "";
      });
    }
  };
  componentDidMount() {
    this.loadQuote({ keyCode: 27 });
    document.addEventListener("keydown", this.loadQuote);
  }
  handleTyping = (e) => {
    if (this.state.startedTyping) {
      let timeElapsed = Date.now() - this.state.startTime;
      let words = e.target.value.length / 5;
      let minutes = timeElapsed / 60000;
      let wpm = (words / minutes).toFixed(2);
      let count = 0;
      for (var i = 0; i < e.target.value.length; i++) {
        if (this.state.quote[i] === e.target.value[i]) {
          count += 1;
        }
      }
      let accuracy = ((count / e.target.value.length) * 100).toFixed(2);
      document.getElementById("result").innerHTML =
        "WPM: " + wpm + "<br/>" + "Accuracy: " + accuracy + "%";
      //e.target.setAttribute("disabled", "true");
    } else {
      this.setState({
        startedTyping: true,
        startTime: Date.now()
      });
    }
    if (e.target.value.length === this.state.quote.length) {
      this.setState({
        disableInput: true
      });
    }
    this.highlightText(e.target.value);
  };

  highlightText = (typedText) => {
    let tags = [];
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === this.state.quote[i]) {
        if (tags.length === 0) {
          let correctHighlight = <mark className="correct">{this.state.quote[i]}</mark>;
          tags.push(correctHighlight);
        } else if (tags[tags.length - 1].props.className === "correct") {
          let correctHighlight = (
            <mark className="correct">
              {tags[tags.length - 1].props.children + typedText[i]}
            </mark>
          );
          tags[tags.length - 1] = correctHighlight;
        } else {
          let correctHighlight = <mark className="correct">{this.state.quote[i]}</mark>;
          tags.push(correctHighlight);
        }
      } else {
        if (tags.length === 0) {
          let incorrectHighlight = (
            <mark className="incorrect">{this.state.quote[i]}</mark>
          );
          tags.push(incorrectHighlight);
        } else if (tags[tags.length - 1].props.className === "incorrect") {
          let incorrectHighlight = (
            <mark className="incorrect">
              {tags[tags.length - 1].props.children + this.state.quote[i]}
            </mark>
          );
          tags[tags.length - 1] = incorrectHighlight;
        } else {
          let incorrectHighlight = (
            <mark className="incorrect">{this.state.quote[i]}</mark>
          );
          tags.push(incorrectHighlight);
        }
      }
    }
    this.setState({
      tags: tags,
      typedText: typedText
    });
  };
  render() {
    return (
      <div className="App">
        <div className="content is-small quote" id="quote">
          {this.state.tags.map((tag) => {
            return tag;
          })}
          {this.state.quote.substring(this.state.typedText.length)}
        </div>
        <input
          type="text"
          placeholder="Begin typing here"
          autoFocus="true"
          onChange={this.handleTyping}
          id="testInput"
          className="type-box"
          disabled={this.state.disableInput}
        ></input>

        <div id="result"></div>
        {/* <Graph /> */}
      </div>
    );
  }
}

export default App;
