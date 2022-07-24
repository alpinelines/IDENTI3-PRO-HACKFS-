import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { DeviceMobileIcon, InboxInIcon, PaperClipIcon, ReplyIcon } from "@heroicons/react/solid";
import { Col, Row, Card, Form, Image, Button, FormLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { createMessage } from "data/conversation";

import { Routes } from "routes";
import { useOrbis } from "services/context";
// import messages from "data/messages";

export default () => {
  const messageRef = useRef([]);
  const { 
    messageService: { 
      orbis,
      getUser,
      conversation,
      setConversation,
      createConversation,
      messages,
      loadMessages,
      decryptMessage,
      send
    } 
  } = useOrbis();
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const currentDate = moment().format("Do of MMMM, YYYY");

  useEffect(() => {
    loadMessages();
    const handleGetUser = async () => {
      const res = await getUser();
      setUser(res);
    }
    handleGetUser();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault()

    // const newMessage = createMessage(message);
    // setConversation([...conversation, newMessage]);

    await send(message);
    await loadMessages();

    setMessage("");
  };

  const MyMessage = (props) => {
    const { creator, timestamp, content } = props;
    const [body, setBody] = useState("");
    
    useEffect(() => {
      const decrypt = async () => {
        let res = await decryptMessage(content)
        console.log({ creator, user })
        setBody(res);
      }; 
      decrypt();
    }, [content]);

    return (
      <Card border="0" className="shadow bg-gray-800 text-white p-4 ms-md-5 ms-lg-6 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="font-small">
            <span className="fw-bold">{creator.name}</span>
            <span className="fw-normal text-gray-300 ms-2">{timestamp}</span>
          </span>
          <div className="d-none d-sm-block">
            <Button variant="link" className="text-white">
              <DeviceMobileIcon className="icon icon-xs" />
            </Button>
          </div>
        </div>
        <p className="text-gray-300 m-0">
          {body}
          {/* {encryptedMessage} */}
        </p>
      </Card>
    );
  };

  const Message = (props) => {
    const { creator, timestamp, content } = props;
    const [body, setBody] = useState("");

    useEffect(() => {
      const decrypt = async () => {
        let res = await decryptMessage(content)
        console.log({ creator, user })
        setBody(res);
      }; 
      decrypt();
    }, [content]);

    return (
      <Card border="0" className="shadow p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="font-small">
            <Card.Link href="#">
              {/* <Image src={creator.image} className="avatar-sm img-fluid rounded-circle me-2" /> */}
              <span className="fw-bold">{creator}</span>
            </Card.Link>
            <span className="fw-normal ms-2">{timestamp}</span>
          </span>
          <div className="d-none d-sm-block">
            <Button variant="link" className="text-dark">
              <DeviceMobileIcon className="icon icon-xs" />
            </Button>
          </div>
        </div>
        <p className="m-0">
          {body}
          {/* {encryptedMessage} */}
        </p>
      </Card>
    );
  };

  function CreateConversation({createConversation}) {
    const [loading, setLoading] = useState(false);
    const [did, setDid] = useState("did:pkh:eip155:1:0x222bc13f54b2f14e41945c9f2f3b9f00b4ec9b40");
  
    const onDIDChange = ({ target: { value } }) => {
      setDid(value);
    };
    
    return(
      <>
        {/** You can use this did to test: did:pkh:eip155:1:0x222bc13f54b2f14e41945c9f2f3b9f00b4ec9b40 */}
        <h4 className="text-center w-100 mt-5">Create Conversation</h4>
          <div className="d-flex justify-content-center align-items-center">
            <Form className="mt-5 mb-2 w-50" onSubmit={createConversation}>
              <FormLabel className="text-center w-100">Recipient DID</FormLabel>
              <Form.Control
                    required
                    rows="1"
                    as="textarea"
                    maxLength="3500"
                    value={did}
                    onChange={onDIDChange}
                    placeholder=""
                    className="border-0 shadow mb-2"
                  />
            </Form>
          </div>
            {loading ?
              <Button variant="secondary" className="d-inline-flex align-items-center text-dark">Loading...</Button>
            :
              <div className="d-flex justify-content-center align-items-center mt-1 mb-5">
                  <Button variant="secondary" onClick={() => {
                    createConversation(did)
                    loadMessages(conversation)
                  }} className="d-inline-flex align-items-center text-dark">
                    <ReplyIcon className="icon icon-sm me-2" /> Create conversation
                  </Button>
              </div>
            }
      </>
    );
  }

  return (
    <>
      <Row className="justify-content-center mt-3">
        <Col xs={12} className="d-flex justify-content-between flex-column flex-sm-row mt-4 mb-2">
          <Card.Link as={Link} to={Routes.Messages.path} className="fw-bold text-dark hover:underline d-inline-flex align-items-center mb-2 mb-lg-0">
            <InboxInIcon className="icon icon-xs me-2" /> Back to messages
          </Card.Link>
          <small className="text-muted fw-normal">
            Messages from {currentDate}
          </small>
        </Col>
        <Col xs={12}>
          {conversation !== undefined ? 
            messages.map(c => {
              return c.creator === user.did
              ? <MyMessage key={`my-message-${c.id}`} {...c} />
              : <Message key={`message-${c.id}`} {...c} />
            }) :
            <CreateConversation createConversation={createConversation}/>
          }
          {conversation &&
            <Form className="mt-4 mb-5" onSubmit={sendMessage}>
              <Form.Control
                required
                rows="6"
                as="textarea"
                maxLength="1000"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Your Message"
                className="border-0 shadow mb-4"
              />

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="file-field">
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">
                      <PaperClipIcon className="icon icon-lg text-gray-400 me-3" />
                      <input type="file" />
                      <div className="d-block text-left d-sm-block">
                        <div className="fw-normal text-dark mb-lg-1">Attach File</div>
                        <div className="text-gray small pe-3 pe-lg-11 d-none d-md-inline">
                          Supported files are: jpg, jpeg, png, doc, pdf, gif, zip, rare, tar, txt, xls, docx, xlsx, odt
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="secondary" type="submit" className="d-inline-flex align-items-center text-dark">
                    <ReplyIcon className="icon icon-sm me-2" /> Reply
                  </Button>
                </div>
              </div>
            </Form>
          }
        </Col>
      </Row>
    </>
  );
};
