import React, { Component } from "react";
import "./UrlWindow.css";
import * as helpers from "./helpers";
import * as mainConfig from "../config.json";

class URLWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: false,
    };

    this.storageKey = mainConfig.storageKeys.URLDontShowAgain;
  }

  onCloseClick = (value) => {
    this.setState({ hide: true });
  };

  onPopoutClick = () => {
    window.open(this.props.url, "_blank");
  };

  componentWillUnmount() {
    this.sidebarEmitter.remove();
    document.removeEventListener("keydown", this.escFunction, false);
  }

  componentDidMount() {
    if (this.props.honorDontShow) {
      const saved = this.getStorage();
      if (saved.includes(this.props.url)) this.setState({ hide: true });
    }

    document.addEventListener("keydown", this.escFunction, false);

    // LISTEN FOR SIDEPANEL CHANGES
    this.sidebarEmitter = window.emitter.addListener("sidebarChanged", (isSidebarOpen) => this.sidebarChanged(isSidebarOpen));
  }

  isDontShow = () => {
    if (this.props.honorDontShow) {
      const saved = this.getStorage();
      if (saved.includes(this.props.url)) return true;
      else return false;
    }
  };

  sidebarChanged = (isSidebarOpen) => {
    this.forceUpdate();
  };

  escFunction = (event) => {
    if (event.keyCode === 27) {
      this.setState({ hide: true });
    }
  };

  onDontShowThisAgain = () => {
    this.saveToStorage();
  };

  saveToStorage = () => {
    helpers.appendToStorage(this.storageKey, this.props.url);
    this.setState({ hide: true });
  };

  // GET STORAGE
  getStorage() {
    const storage = localStorage.getItem(this.storageKey);
    if (storage === null) return [];

    const data = JSON.parse(storage);
    return data;
  }

  render() {
    // DONT RENDER IF WERE NOT SHOWING, OTHERWISE ALL DATA/IMAGES FROM URL LINK WILL DOWNLOAD
    if (this.isDontShow()) return <div />;

    let className = "";
    if (this.state.hide) className = "sc-hidden";
    else if (this.props.mode === "full") className = "full";
    else if (!window.sidebarOpen) className = "full";

    let hideScrollClassName = "";
    if (this.props.hideScroll) hideScrollClassName = "sc-url-window-content-no-scroll";
    return (
      <div id="sc-url-window-container" className={className}>
        <div className="sc-url-window-header">
          <div className="sc-url-window-header-title">Information</div>
          <div className="sc-url-window-header-popout-button" title="Open New Window">
            <button className="sc-button sc-button-blue sc-url-window-header-button" onClick={this.onPopoutClick}>
              <img src={images["new-window.png"]} alt="new window" />
            </button>
          </div>
          <div className="sc-url-window-header-close-button" title="Close Window">
            <button style={{ fontWeight: "bolder" }} className="sc-button sc-button-blue sc-url-window-header-button" onClick={this.onCloseClick}>
              X
            </button>
          </div>
        </div>
        <div id="sc-url-window-content" className={this.props.showFooter ? "sc-url-window-content with-footer " + hideScrollClassName : "sc-url-window-content " + hideScrollClassName}>
          <iframe id="sc-url-window-iframe" className="sc-url-window-iframe" src={this.props.url} frameBorder="0" title="Information" />
        </div>
        <div className={this.props.showFooter ? "sc-url-window-footer" : "sc-hidden"}>
          <button className="sc-button" onClick={this.onCloseClick}>
            Close Window
          </button>
          <button id="sc-url-window-dont-show-this-again" className="sc-button" onClick={this.onDontShowThisAgain}>
            Don't Show this Again
          </button>
        </div>
      </div>
    );
  }
}

export default URLWindow;

// IMPORT ALL IMAGES
const images = importAllImages(require.context("./images", false, /\.(png|jpe?g|svg|gif)$/));
function importAllImages(r) {
  let images = {};
  r.keys().map((item, index) => (images[item.replace("./", "")] = r(item)));
  return images;
}
