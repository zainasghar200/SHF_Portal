import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { Input } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import auth from "../../../authentication/auth";
import axios from "axios";
import * as ConstClass from "../../../common/Constants";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import LoadingScreen from "react-loading-screen";
class EditPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: false
    };
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount() {
    const plotID = this.props.match.params.id;

    axios
      .get(ConstClass.SHF_BACK_END + "plots/" + plotID)
      .then(res => {
        this.setState({
          id: res.data.data.plots.id,
          plotNumber: res.data.data.plots.plotNumber,
          price: res.data.data.plots.price,
          bedRooms: res.data.data.plots.bedRooms,
          area: res.data.data.plots.area,
          areaUnit: res.data.data.plots.areaUnit,
          unitType: res.data.data.plots.unitType,
          premittedUse: res.data.data.plots.premittedUse,
          buildingType: res.data.data.plots.buildingType,
          status: res.data.data.plots.status
          // thumbnail: res.data.data.plots.thumbnail[0],
          // fileName: res.data.data.plots.thumbnail[0].originalName
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  addNotification(titleTXT, messageTXT, typeTXT, duration) {
    this.notificationDOMRef.current.addNotification({
      title: titleTXT,
      message: messageTXT,
      type: typeTXT,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: duration },
      dismissable: { click: true }
    });
  }

  handleFieldChange = event => {
    if (event.target.name === "thumbnail") {
      this.setState({
        thumbnail: event.target.files[0]
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  };

  handleDelete = () => {
    axios
      .delete(ConstClass.SHF_BACK_END + "plots/" + this.state.id)
      .then(res => {
        this.setState({
          dataLoading: false
        });
        if (res.status === 200) {
          this.setState({
            data: res.data.data.attachments
          });
          this.addNotification(
            "Success!",
            res.data.message,
            ConstClass.NOTIFY_SUCCESS,
            5000
          );
        } else if (res.status === 401) {
          this.addNotification(
            "Conflict!",
            res.data.message,
            ConstClass.NOTIFY_INFO,
            0
          );
        }
        console.log(res);
      })
      .catch(error => {
        this.setState({
          dataLoading: false
        });
        this.addNotification("Error!", error, ConstClass.NOTIFY_DANGER, 0);
        console.log(error);
      });
  };

  handleSubmit = event => {
    event.preventDefault();

    console.log(this.state);
    this.setState({
      dataLoading: true
    });
    const data = new FormData();
    data.append("plotNumber", this.state.plotNumber);
    data.append("price", this.state.price);
    data.append("bedRooms", this.state.bedRooms);
    data.append("area", this.state.area);
    data.append("areaUnit", this.state.areaUnit);
    data.append("unitType", this.state.unitType);
    data.append("premittedUse", this.state.premittedUse);
    data.append("buildingType", this.state.buildingType);
    data.append("status", this.state.status);
    data.append("thumbnail", this.state.thumbnail);
    axios
      .patch(ConstClass.SHF_BACK_END + "plots/" + this.state.id, data, {
        // receive two parameter endpoint url ,form data
      })
      .then(res => {
        this.setState({
          dataLoading: false
        });
        if (res.status === 200) {
          this.addNotification(
            "Success!",
            res.data.message,
            ConstClass.NOTIFY_SUCCESS,
            5000
          );
        } else if (res.status === 205) {
          this.addNotification(
            "Conflict!",
            "Plot number already exist.",
            ConstClass.NOTIFY_INFO,
            0
          );
        }
        //console.log(res);
      })
      .catch(error => {
        this.setState({
          dataLoading: false
        });
        this.addNotification(
          "Error!",
          error.message,
          ConstClass.NOTIFY_DANGER,
          0
        );
        console.log(error);
      });
  };

  render() {
    if (!auth.isAuthenticated()) {
      this.props.history.push("/login");
    }
    return (
      <LoadingScreen
        loading={this.state.dataLoading}
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Here an introduction sentence (Optional)"
      >
        <div className="animated fadeIn">
          <h4>Edit Plot</h4>
          <div className="animated fadeIn">
            <ReactNotification ref={this.notificationDOMRef} />
            <Row>
              <Col xs="12" sm="12">
                <Card>
                  <CardHeader>
                    <strong>Plot</strong>
                  </CardHeader>
                  <CardBody>
                    <div className="row example-wrapper">
                      <div className="col-xs-12 col-sm-12 example-col">
                        <form className="k-form" onSubmit={this.handleSubmit}>
                          <div className="row">
                            <div className="col-xs-12 col-sm-4 ">
                              <label className="k-form-field">
                                <span>Plot Number</span>
                                <Input
                                  name="plotNumber"
                                  width={"100%"}
                                  format="n0"
                                  min={0}
                                  required={true}
                                  onChange={this.handleFieldChange}
                                  value={this.state.plotNumber}
                                />
                              </label>
                            </div>
                            <div className="col-xs-12 col-sm-4 ">
                              <label className="k-form-field">
                                <span>Price</span>
                                <Input
                                  name="price"
                                  width={"100%"}
                                  format="n0"
                                  min={0}
                                  required={true}
                                  onChange={this.handleFieldChange}
                                  value={this.state.price}
                                />
                              </label>
                            </div>

                            <div className="col-xs-12 col-sm-4 ">
                              <label className="k-form-field">
                                <span>Bedrooms</span>
                                <Input
                                  name="bedRooms"
                                  width={"100%"}
                                  format="n0"
                                  min={0}
                                  required={true}
                                  onChange={this.handleFieldChange}
                                  value={this.state.bedRooms}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-xs-12 col-sm-4 ">
                              <label className="k-form-field">
                                <span>Area</span>
                                <Input
                                  name="area"
                                  width={"100%"}
                                  format="n0"
                                  min={0}
                                  required={true}
                                  onChange={this.handleFieldChange}
                                  value={this.state.area}
                                />
                              </label>
                            </div>

                            <div className="col-xs-12 col-sm-4 example-col">
                              <label className="k-form-field">
                                <span>Area Unit</span>
                                <ComboBox
                                  name="areaUnit"
                                  required={true}
                                  data={ConstClass.SHF_AREAUNITTYPE}
                                  style={{ width: "100%" }}
                                  onChange={this.handleFieldChange}
                                  value={this.state.areaUnit}
                                />
                              </label>
                            </div>
                            <div className="col-xs-12 col-sm-4 example-col">
                              <label className="k-form-field">
                                <span>Unit Type</span>
                                <ComboBox
                                  name="unitType"
                                  required={true}
                                  data={ConstClass.SHF_UNITTYPE}
                                  style={{ width: "100%" }}
                                  onChange={this.handleFieldChange}
                                  value={this.state.unitType}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-xs-12 col-sm-4 example-col">
                              <label className="k-form-field">
                                <span>Premited Use</span>
                                <ComboBox
                                  name="premittedUse"
                                  required={true}
                                  data={ConstClass.SHF_PLOTTYPE}
                                  style={{ width: "100%" }}
                                  onChange={this.handleFieldChange}
                                  value={this.state.premittedUse}
                                />
                              </label>
                            </div>
                            <div className="col-xs-12 col-sm-4 example-col">
                              <label className="k-form-field">
                                <span>Building Type</span>
                                <ComboBox
                                  name="buildingType"
                                  required={true}
                                  data={ConstClass.SHF_BUILDINGTYPE}
                                  style={{ width: "100%" }}
                                  onChange={this.handleFieldChange}
                                  value={this.state.buildingType}
                                />
                              </label>
                            </div>
                            <div className="col-xs-12 col-sm-4 example-col">
                              <label className="k-form-field">
                                <span>Status</span>
                                <ComboBox
                                  name="status"
                                  required={true}
                                  data={ConstClass.SHF_STATUS}
                                  style={{ width: "100%" }}
                                  onChange={this.handleFieldChange}
                                  value={this.state.status}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 example-col">
                              {/* <Upload
                                batch={false}
                                required={true}
                                multiple={false}
                                defaultFiles={[]}
                                withCredentials={false}
                                name="thumbnail"
                              /> */}
                              <input
                                type="file"
                                name="thumbnail"
                                onChange={this.handleFieldChange}
                              ></input>
                            </div>
                          </div>
                          <div className="text-center" style={{ margin: 10 }}>
                            <Button
                              type="Submit"
                              className="k-button k-primary"
                              style={{ margin: 3 }}
                            >
                              Edit Plot
                            </Button>
                            {/* <Button
                              onClick={this.handleDelete}
                              className="k-button "
                              style={{
                                margin: 3,
                                color: "white",
                                backgroundColor: "red"
                              }}
                            >
                              Delete Plot
                            </Button> */}
                          </div>
                        </form>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </LoadingScreen>
    );
  }
}

export default EditPlot;
