
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

import { getUsers } from "../../actions/userActions";
import RegisterActions from "./RegisterActions";
import './ViewUsers.css';


class ViewUsers extends Component {

  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  componentWillMount() {
    this.props.getUsers();

  }

  render() {

    const { users, loading } = this.props.users;
    let userItems;
    const usersData = [];
    if (users === null || loading) {
      userItems = <Spinner />
    } else {

      if (users.length > 0) {


        // const userData = users.map((user, index) => ({
        //   avatar: <img src={user.avatar} alt="" className="img-thumbnail rounded-circle img " />,
        //   username: user.name.firstName + " " + user.name.lastName,
        //   type: user.userType,
        //   view: (
        //     <Link to={/viewusers/ + user._id} ><div className="btn btn-info btn-sm ">View Account</div> </Link>
        //   ),
        //   blocked: whenBlock[index],
        //   college: user.college ? user.college : <div>None</div>
        // }));




        users.map(user => {
          let path;
          if (user.avatar === "/images/User.png") {
            path = "/images/User.png"
          }
          else {
            path = "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" + user.avatar;
          }

          if (user._id !== this.props.auth.user.id) {
            usersData.push({
              avatar: <img src={path} alt="" className="img-thumbnail user_img" />,
              username: user.name.firstName + " " + user.name.lastName,
              type: user.userType,
              view: (
                <Link to={/viewusers/ + user._id} ><div className="btn btn-outline-info btn-sm ">View Account</div> </Link>

              ),
              blocked: user.isBlock === 0 ? <div className="badge badge-success btn-sm">Active</div > : <div className="badge badge-danger btn-sm " >
                Blocked</div>,
              college: user.college ? user.college : <div>None</div>

            })
          }

        })







        userItems = (

          <MaterialTable
            columns={[
              { title: "Avatar", field: "avatar" },
              { title: "Name", field: "username" },
              { title: "Type", field: "type" },
              { title: "College", field: "college" },
              { title: "Status", field: "blocked" },
              { title: "View Account", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 20, 30, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 30
            }}
            data={usersData}
            title="User Data"

          />
        );
      }



      else {
        userItems = <h4>No users found...</h4>
      }
    }
    // <script> {(function fairyDustCursor() {

    //   var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
    //   var width = window.innerWidth;
    //   var height = window.innerHeight;
    //   var cursor = { x: width / 2, y: width / 2 };
    //   var particles = [];

    //   function init() {
    //     bindEvents();
    //     loop();
    //   }

    //   // Bind events that are needed
    //   function bindEvents() {
    //     document.addEventListener('mousemove', onMouseMove);
    //     document.addEventListener('touchmove', onTouchMove);
    //     document.addEventListener('touchstart', onTouchMove);

    //     window.addEventListener('resize', onWindowResize);
    //   }

    //   function onWindowResize(e) {
    //     width = window.innerWidth;
    //     height = window.innerHeight;
    //   }

    //   function onTouchMove(e) {
    //     if (e.touches.length > 0) {
    //       for (var i = 0; i < e.touches.length; i++) {
    //         addParticle(e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
    //       }
    //     }
    //   }

    //   function onMouseMove(e) {
    //     cursor.x = e.clientX;
    //     cursor.y = e.clientY;

    //     addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
    //   }

    //   function addParticle(x, y, color) {
    //     var particle = new Particle();
    //     particle.init(x, y, color);
    //     particles.push(particle);
    //   }

    //   function updateParticles() {

    //     // Updated
    //     for (var i = 0; i < particles.length; i++) {
    //       particles[i].update();
    //     }

    //     // Remove dead particles
    //     for (var i = particles.length - 1; i >= 0; i--) {
    //       if (particles[i].lifeSpan < 0) {
    //         particles[i].die();
    //         particles.splice(i, 1);
    //       }
    //     }

    //   }

    //   function loop() {
    //     requestAnimationFrame(loop);
    //     updateParticles();
    //   }

    //   /**
    //    * Particles
    //    */

    //   function Particle() {

    //     this.character = "*";
    //     this.lifeSpan = 90; //ms
    //     this.initialStyles = {
    //       "position": "absolute",
    //       "display": "block",
    //       "pointerEvents": "none",
    //       "z-index": "10000000",
    //       "fontSize": "40px",
    //       "will-change": "transform"
    //     };

    //     // Init, and set properties
    //     this.init = function (x, y, color) {

    //       this.velocity = {
    //         x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
    //         y: 1
    //       };

    //       this.position = { x: x - 10, y: y - 20 };
    //       this.initialStyles.color = color;
    //       console.log(color);

    //       this.element = document.createElement('span');
    //       this.element.innerHTML = this.character;
    //       applyProperties(this.element, this.initialStyles);
    //       this.update();

    //       document.body.appendChild(this.element);
    //     };

    //     this.update = function () {
    //       this.position.x += this.velocity.x;
    //       this.position.y += this.velocity.y;
    //       this.lifeSpan--;

    //       this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
    //     }

    //     this.die = function () {
    //       this.element.parentNode.removeChild(this.element);
    //     }

    //   }

    //   /**
    //    * Utils
    //    */

    //   // Applies css `properties` to an element.
    //   function applyProperties(target, properties) {
    //     for (var key in properties) {
    //       target.style[key] = properties[key];
    //     }
    //   }

    //   init();
    // })()}
    // </script>
    return (


      <div className="profiles">

        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="usersBg ">
              <div className="light-overlay p-2">
                <div className="display-4 text-center mb-1">Users
                <p className="lead text-center ">
                    User list of Accounts
                </p>

                </div>
              </div>
            </div>
            <br />
            <RegisterActions />
            {userItems}
          </div>
        </div>
      </div>

    )
  }
}

ViewUsers.protoTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,

})

export default connect(mapStateToProps, { getUsers })(ViewUsers);