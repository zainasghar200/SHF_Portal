import React, { Component } from "react";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import auth from "../../../authentication/auth";
import axios from "axios";
import * as ConstClass from "../../../common/Constants";

class Appointment extends Component {
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
      .get(ConstClass.SHF_BACK_END + "appointment")
      .then(res => {
        this.setState({
          data: res.data.data.appointments,
          items: res.data.data.appointments.slice(
            this.state.skip,
            this.state.skip + this.state.pageSize
          ),
          total: res.data.data.appointments.length
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
        <h4>Appointment</h4>

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
            <Column field="name" title="Name" />
            <Column field="email" title="Email" />
            <Column field="contactNumber" title="Contact Number" />
            <Column field="message" title="Message" />
          </Grid>
        </div>
      </div>
    ];
  }
}

export default Appointment;
