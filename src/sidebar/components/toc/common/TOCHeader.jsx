// REACT
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Switch from "react-switch";
import { Item as MenuItem } from "rc-menu";
import ReactTooltip from "react-tooltip";

//CUSTOM
import * as helpers from "../../../../helpers/helpers";
import FloatingMenu, { FloatingMenuItem } from "../../../../helpers/FloatingMenu.jsx";
import Portal from "../../../../helpers/Portal.jsx";

class TOCHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText:"",
    }
  }

 onSettingsClick = (evt) =>{
    var evtClone = Object.assign({}, evt);
    var switchMenuLabel = `Switch to ${this.props.tocType==="LIST"?"Folder":"List"} View`;
    const menu = (
      <Portal>
        <FloatingMenu
          key={helpers.getUID()}
          buttonEvent={evtClone}
          title="Layer Settings"
          item={this.props.info}
          onMenuItemClick={(action) => this.onSettingsMenuItemClick(action)}
          styleMode="right"
          width={"200px"}
          yOffset={0}
        >
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-switch">
            <FloatingMenuItem imageName={"edit-rotate24.png"} label={switchMenuLabel} />
          </MenuItem>
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-save">
            <FloatingMenuItem imageName={"save-disk.png"} label="Save Layer Changes" />
          </MenuItem>
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-reset">
            <FloatingMenuItem imageName={"reset.png"} label="Reset Layers to Default" />
          </MenuItem>
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-visility">
            <FloatingMenuItem imageName={"layers-off.png"} label="Turn off All Layers" />
          </MenuItem>
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-legend">
            <FloatingMenuItem imageName={"legend24.png"} label="Show Legend" />
          </MenuItem>
          <MenuItem className="sc-floating-menu-toolbox-menu-item" key="sc-floating-menu-sort">
            Sort Layers A-Z <Switch className="sc-toc-sort-switch" onChange={this.props.onSortChange} checked={this.props.sortAlpha} height={20} width={48} />
          </MenuItem>
        </FloatingMenu>
      </Portal>
    );
  
    ReactDOM.render(menu, document.getElementById("portal-root"));
  };
  onSettingsMenuItemClick = (action) => {
    switch (action) {
      case "sc-floating-menu-visility":
        this.props.onTurnOffLayers();
        break;
      case "sc-floating-menu-save":
        // this.onSaveClick();
        this.props.onSaveAllLayers();
        break;
      case "sc-floating-menu-save-all":
        this.props.onSaveAllLayers();
        break;
      case "sc-floating-menu-reset":
        this.props.onResetToDefault();
        break;
      case "sc-floating-menu-legend":
        this.props.onOpenLegend();
        break;
      case "sc-floating-menu-switch":
        this.props.onTOCTypeChange();
        break;
      default:
        break;
    }
    helpers.addAppStat("TOC Settings - ", action);
  };

  onSearchChange = (evt) =>{
    const searchText = evt.target.value;
    this.setState({ searchText: searchText },()=>{
        this.props.onSearchChange(searchText);
      }
    );
   
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchText === "" && this.state.searchText!=="") {
      this.setState({searchText:nextProps.searchText});
    }
  }
  render() {
    return (
      <div>
        <div className={this.props.isLoading ? "sc-toc-main-container-loading" : "sc-toc-main-container-loading sc-hidden"}>
          <img className="sc-toc-loading" src={images["loading.gif"]} alt="loading" />
        </div>
        <div className={this.props.isLoading ? "sc-toc-main-container sc-hidden" : "sc-toc-main-container"}>
          <div className="sc-toc-search-container">
            <input
              id="sc-toc-search-textbox"
              className="sc-toc-search-textbox"
              placeholder={"Filter (" + this.props.layerCount + " layers)..."}
              type="text"
              onChange={this.onSearchChange}
              onFocus={(evt) => {
                helpers.disableKeyboardEvents(true);
              }}
              onBlur={(evt) => {
                helpers.disableKeyboardEvents(false);
              }}
              value={this.state.searchText}
            />
            &nbsp;
            <div data-tip="Layer Settings" data-for="sc-toc-settings-tooltip" className="sc-toc-settings-image" onClick={this.onSettingsClick}>
              <ReactTooltip id="sc-toc-settings-tooltip" className="sc-toc-settings-tooltip" multiline={false} place="right" type="dark" effect="solid" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TOCHeader;

// IMPORT ALL IMAGES
 const images = importAllImages(require.context("../images", false, /\.(png|jpe?g|svg|gif)$/));
 function importAllImages(r) {
     let images = {};
   r.keys().map((item, index) => (images[item.replace("./", "")] = r(item)));
   return images;
 }