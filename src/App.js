import React from "react";
import "./App.css";
import text from "./quote.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedTyping: false,
      startTime: 0,
      quote: text,
      endTime: 0
    };
  }

  handleTyping = (e) => {
    if (this.state.startedTyping) {
      if (e.target.value.length === this.state.quote.length) {
        let timeElapsed = Date.now() - this.state.startTime;
        let words = this.state.quote.length / 5;
        let minutes = timeElapsed / 60000;
        let wpm = words / minutes;
        let count = 0;
        for (var i = 0; i < this.state.quote.length; i++) {
          if (this.state.quote[i] === e.target.value[i]) {
            count += 1;
          }
        }
        let accuracy = (count / this.state.quote.length) * 100;
        document.getElementById("result").innerHTML =
          "WPM: " + wpm + "\n" + "Accuracy: " + accuracy;
        e.target.setAttribute("disabled", "true");
      }
    } else {
      this.setState({
        startedTyping: true,
        startTime: Date.now()
      });
    }
  };
  render() {
    return (
      <div className="App">
        <textarea
        rows = "10"
        cols = "70"
        spellCheck = "false"
        >
          {this.state.quote}
        </textarea>
        <br />
        <input
          type="text"
          placeholder="Begin typing here"
          autoFocus
          onChange={this.handleTyping}
          id="testInput"
        ></input>
        <br />
        <span id="result"></span>
      </div>
    );
  }
}

export default App;
