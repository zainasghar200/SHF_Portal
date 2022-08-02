import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { Button } from "@progress/kendo-react-buttons";
import "@progress/kendo-theme-bootstrap/dist/all.css";
import auth from "../../authentication/auth";
import { Input } from "@progress/kendo-react-inputs";
import axios from "axios";
import * as ConstClass from "../../common/Constants";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import LoadingScreen from "react-loading-screen";
import ReactPlayer from "react-player";
class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: false,
      data: [],
      dbURL: null
    };
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
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
  componentDidMount() {
    axios
      .get(ConstClass.SHF_BACK_END + "video")
      .then(res => {
        this.setState({
          dbURL: res.data.data.video[0].url
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    axios
      .get(ConstClass.SHF_BACK_END + "attachments")
      .then(res => {
        this.setState({
          data: res.data.data.attachments
        });
      })
      .catch(function(error) {
        console.log(error);
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

  handleDelete = id => {
    //alert(id.id);
    axios
      .delete(ConstClass.SHF_BACK_END + "attachments/" + id.id)
      .then(res => {
        this.setState({
          dataLoading: false
        });
        if (res.data.status === 200) {
          this.setState({
            data: res.data.data.attachments
          });
          this.addNotification(
            "Success!",
            res.data.message,
            ConstClass.NOTIFY_SUCCESS,
            5000
          );
        } else if (res.data.status.code === 404) {
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

    const data = new FormData();
    data.append("attachment", this.state.thumbnail);
    this.setState({
      dataLoading: true
    });
    axios
      .post(ConstClass.SHF_BACK_END + "attachments/upload", data, {
        // receive two parameter endpoint url ,form data
      })
      .then(res => {
        this.setState({
          dataLoading: false
        });
        if (res.data.status === 200) {
          this.setState({
            data: res.data.data.attachments
          });
          this.addNotification(
            "Success!",
            res.data.message,
            ConstClass.NOTIFY_SUCCESS,
            5000
          );
        } else if (res.data.status.code === 404) {
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
  handleSubmitURL = event => {
    event.preventDefault();

    //    console.log(this.state);

    const data = new FormData();
    data.append("url", this.state.url);
    this.setState({
      dataLoading: true
    });
    axios
      .post(ConstClass.SHF_BACK_END + "video", data, {
        // receive two parameter endpoint url ,form data
      })
      .then(res => {
        this.setState({
          dataLoading: false
        });
        if (res.status === 200) {
          this.setState({
            dbURL: res.data.data.video.url
          });
          this.addNotification(
            "Success!",
            res.data.message,
            ConstClass.NOTIFY_SUCCESS,
            5000
          );
        } else if (res.code === 401) {
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
          <div className="animated fadeIn">
            <ReactNotification ref={this.notificationDOMRef} />
            <Row>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <strong>Add Images</strong>
                  </CardHeader>
                  <CardBody>
                    <div className="row example-wrapper">
                      <div className="col-xs-12 col-sm-12 example-col">
                        <form className="k-form" onSubmit={this.handleSubmit}>
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 ">
                              <input
                                type="file"
                                name="thumbnail"
                                required
                                onChange={this.handleFieldChange}
                                style={{ marginTop: 28 }}
                              ></input>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 ">
                              <div
                                className="text-center"
                                style={{ margin: 10 }}
                              >
                                <Button
                                  type="Submit"
                                  className="k-button k-primary"
                                  style={{ marginTop: 28 }}
                                >
                                  Add Image
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <strong>Add Video Link</strong>
                  </CardHeader>
                  <CardBody>
                    <div className="row example-wrapper">
                      <div className="col-xs-12 col-sm-12 example-col">
                        <form
                          className="k-form"
                          onSubmit={this.handleSubmitURL}
                        >
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 ">
                              <label className="k-form-field">
                                <span>Video Link</span>
                                <Input
                                  name="url"
                                  onChange={this.handleFieldChange}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 ">
                              <div
                                className="text-center"
                                style={{ margin: 10 }}
                              >
                                <Button
                                  type="Submit"
                                  className="k-button k-primary"
                                >
                                  Add Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <strong>All images</strong>
                  </CardHeader>
                  <CardBody>
                    <div className="row example-wrapper">
                      <div className="col-xs-12 col-sm-12 example-col">
                        {this.state.data.map((value, index) => {
                          return (
                            <img
                              src={value.path}
                              alt="new"
                              onClick={() =>
                                this.handleDelete({ id: value.id })
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <strong>Video</strong>
                  </CardHeader>
                  <CardBody>
                    <div className="row example-wrapper">
                      <div className="col-xs-12 col-sm-12 example-col">
                        <ReactPlayer
                          url={this.state.dbURL}
                          playing
                          loop
                          controls
                        />
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

export default Images;
