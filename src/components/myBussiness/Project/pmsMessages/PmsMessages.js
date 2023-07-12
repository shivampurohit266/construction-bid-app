import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Breadcrumb from "../../../shared/Breadcrumb";
import Sidebar from "../../../shared/Sidebar";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Files from 'react-files';
import Attachment from '../../../../images/Vector-8.png';
import "./PmsMessage.scss";
import socketIO from 'socket.io-client';
import { io } from 'socket.io-client';

const socket = socketIO.connect('https://appv2.proppu.com',{
  autoConnect: false
});
// const socket = io('https://appv2.proppu.com');
console.log(socket.on(),"newsocket");

const PmsMessages = () => {
  const params = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [fileAttach, setFileAttach] = useState('');
  const [user, setUser] = useState('You');
  const [messages, setMessages] = useState([
    {
      name: "Rishabh bula",
      text: "Hello!",
      img: "",
    },
    {
      name: "Rishabh bula",
      text: "How are you",
      img: "",
    },
    {
      name: "Other",
      text: "Hi",
      img: "",
    },
    {
      name: "Other",
      text: "I'am Fine",
      img: "",
    },
    {
      name: "Other",
      text: "What about you",
      img: "",
    },
    {
      name: "Rishabh bula",
      text: "Same here",
      img: "",
    },
  ]);
  console.log(user);
  useEffect(() => {
    function onConnect() {
      // setIsConnected(true);
      console.log("newConnected");
    }

    function onDisconnect() {
      // setIsConnected(false);
      console.log("newDisconected");
    }
    
    localStorage.setItem("userName","Rishabh bula")
    function onFooEvent(value) {
      // setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if(newMessage || fileAttach){
      let allMessages = [...messages]
      let result1 = {
        name: "Rishabh bula",
        text: newMessage,
        img: fileAttach,
      }
      let result2 = {
        name: "Other",
        text: newMessage,
        img: fileAttach,
      }
      if(user === "You"){
      allMessages.push(result1)
      setMessages(allMessages)
      }else{
        allMessages.push(result2)
      setMessages(allMessages)
      }
      setNewMessage("")
      setFileAttach('')
      console.log(allMessages,"new");
    }
    console.log(messages,"new");
  }
  return (
    <div>
      {/* <Breadcrumb>
        <Link
          to="/manage-projects"
          className="breadcrumb-item active"
          aria-current="page"
        >
          Project
        </Link>
        <li className="breadcrumb-item active" aria-current="page">
          {params.title}
        </li>
      </Breadcrumb> */}
            <Link to={"/manage-projects"}>
              <button className="chat-back-button btn">Back</button>
            </Link>
      <div className="main-content">
        {/* <Sidebar dataFromParent={window.location.pathname} /> */}
        <div className="chat">
          {/* Side chat baar */}
          <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          <p>User 1</p>
          <p>User 2</p>
          <p>User 3</p>
          <p>User 4</p>
        </div>
      </div>
    </div>
          {/*This shows messages sent from you*/}
          <div className="message__container">
          {messages.map((message,idx) =>{
          return(
          message.name === localStorage.getItem('userName') ? (
            <div className="message__chats" key={idx}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
                {message.img && <img src={message.img[0].preview.url} />}
              </div>
            </div>
          ) : (
            <div className="message__chats" key={idx}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
                {message.img && <img src={message.img[0].preview.url} />}
              </div>
            </div>
          )
          )})}
            {/*This shows messages received by you*/}

            {/*This is triggered when a user is typing*/}
            <div className="message__status">
              <p>Someone is typing...</p>
              {fileAttach && <img width={150} src={fileAttach[0].preview.url} />}
            </div>
            <div className="chat__footer">
            <input defaultChecked={user === "You"} onChange={(e) => setUser(e.target.value)} type="radio" id="you" name="fav_language" value="You" />
             <label for="you">You</label>
            <input defaultChecked={user === "Other"} onChange={(e) => setUser(e.target.value)} type="radio" id="other" name="fav_language" value="Other" />
             <label for="other">Other</label>
              <form className="form" onSubmit={handleSubmit}>

                  <input
                  type="text"
                  placeholder="Write message"
                  className="message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div
                  style={{
                    display: 'flex',
                    width: '94px',
                    height: '35px',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: ' #F3F3F3',
                    marginRight: '2rem',
                  }}
                >
                  <Files
                    className='files-dropzone'
                    onChange={(e) => setFileAttach(e)}
                    // onError={(e) => onFilesError(e)}
                    accepts={[
                      'image/gif',
                      '.doc ',
                      '.docx',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                      '.pdf',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    // clickable={edit}
                  >
                    <img
                      src={Attachment}
                      alt='attachment'
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div style={{ textAlign: 'center', marginLeft: '2rem' }}>
                      Attach
                    </div>
                  </Files>
                </div>

                <button className="sendBtn">SEND</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(PmsMessages);
