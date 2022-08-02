import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import addsvg from "../../../assets/img/add182.svg";
import auth from "../../../authentication/auth";
import axios from "axios";
import * as ConstClass from "../../../common/Constants";

class Plot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      items: [],
      total: 0,
      skip: 0,
      pageSize: 10,
      pageable: this.state
        ? this.state.pageable
        : {
            buttonCount: 5,
            info: true,
            type: "numeric",
            pageSizes: true,
            previousNext: true
          }
    };
    this.pageChange = this.pageChange.bind(this);
    this.updatePagerState = this.updatePagerState.bind(this);
  }

  pageChange(event) {
    this.setState({
      skip: event.page.skip,
      pageSize: event.page.take,
      items: this.state.data.slice(
        event.page.skip,
        event.page.skip + event.page.take
      )
    });
  }

  componentDidMount() {
    axios
      .get(ConstClass.SHF_BACK_END + "plots")
      .then(res => {
        this.setState({
          data: res.data.data.plots,
          items: res.data.data.plots.slice(
            this.state.skip,
            this.state.skip + this.state.pageSize
          ),
          total: res.data.data.plots.length
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  updatePagerState(key, value) {
    const newPageableState = Object.assign({}, this.state.pageable, {
      [key]: value
    });
    this.setState(
      Object.assign({}, this.state, { pageable: newPageableState })
    );
  }

  render() {
    if (!auth.isAuthenticated()) {
      this.props.history.push("/login");
    }
    return [
      <div className="animated fadeIn">
        <h4>
          Plots
          <Link style={{ textDecoration: "none" }} to="/plot/addPlot">
            {" "}
            <img
              style={{ maxHeight: "30px" }}
              src={addsvg}
              className="App-logo"
              alt="logo"
            />
          </Link>
        </h4>

        <div className="nutrition-grid">
          <Grid
            style={{ maxHeight: "530px" }}
            data={this.state.items}
            onPageChange={this.pageChange}
            total={this.state.total}
            skip={this.state.skip}
            pageable={this.state.pageable}
            pageSize={this.state.pageSize}
          >
            <Column
              field="plotNumber"
              title="Plot Number"
              cell={props => (
                <td>
                  <Link
                    id="3"
                    style={{ textDecoration: "none" }}
                    to={"/plot/editPlot/" + props.dataItem.id}
                  >
                    {props.dataItem.plotNumber}
                  </Link>
                </td>
              )}
            />
            <Column field="price" title="Price" />
            <Column field="premittedUse" title="Premitted Use" />
            <Column field="area" title="Area" />
            <Column field="areaUnit" title="Area Unit" />
            <Column field="buildingType" title="Building Type" />
            <Column field="status" title="Status" />
          </Grid>
        </div>
      </div>
    ];
  }
}

export default Plot;
