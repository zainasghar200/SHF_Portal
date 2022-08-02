import React, { Component } from "react";
import auth from "../../authentication/auth";
import { Redirect } from "react-router-dom";
import axios from "axios";
import * as ConstClass from "../../common/Constants";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import LoadingScreen from "react-loading-screen";

//import { Redirect } from "react-router-dom";

//import { Link } from "react-router-dom";
// import axios from "axios";
// import Fetch from "react-fetch";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      dataLoading: false
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
  //   // axios
  //   //   .post("http://localhost:56885/Token", {
  //   //     username: data.username,
  //   //     password: data.password,
  //   //     grant_type: "password"
  //   //   })
  //   //   .then(function(response) {
  //   //     console.log(response);
  //   //   })
  //   //   .catch(function(error) {
  //   //     console.log(error);
  //   //   });

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };
    this.setState({
      dataLoading: true
    });
    axios({
      //url: "http://localhost:1337/api/v1/auth/login",
      url: ConstClass.SHF_BACK_END + "auth/login",

      method: "post",
      headers: {
        "Content-Type": "charset=UTF-8"
      },
      data: user
    })
      .then(res => {
        this.setState({
          dataLoading: false
        });
        console.log(res);
        if (res.data.status === 200) {
          localStorage.setItem("userToken", res.data.data.token);
          this.props.history.push("/dashboard");
        } else if (res.data.status === 401) {
          this.addNotification(
            "Authentication Faild!",
            res.data.message,
            ConstClass.NOTIFY_DANGER,
            0
          );
        }
      })

      .catch(function(error) {
        console.log(error);

        this.setState({
          dataLoading: false
        });
      });
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      grant_type: "password",
      [event.target.name]: event.target.value
    });
  };
  render() {
    if (auth.isAuthenticated()) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <LoadingScreen
        loading={this.state.dataLoading}
        spinnerColor="#9ee5f8"
        textColor="#676767"
        //style={{ opacity: 1 }}
      >
        <div className="app flex-row align-items-center">
          <ReactNotification ref={this.notificationDOMRef} />
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form className="k-form" onSubmit={this.handleSubmit}>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            required={true}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            name="password"
                            required={true}
                            onChange={this.handleChange}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">
                              Login
                            </Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </LoadingScreen>
    );
  }
}

export default Login;
