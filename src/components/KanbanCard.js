import React from "react";
import { ClipboardCopyIcon, CreditCardIcon, PencilAltIcon, SelectorIcon, TagIcon, TrashIcon, UserIcon } from "@heroicons/react/solid";
import { Card, Button, Image, Dropdown } from "react-bootstrap";

import KanbanAvatar from "components/KanbanAvatar";

import { usePizzly } from 'services/contextPizzly';


export default (props) => {
  const {authId, myDiscordAPI, connect, fetchProfile, setAuthId} = usePizzly();
  const { cardRef, title, image, members, description, style = {}, extraProps = {} } = props;
  const membersCountDescription = !members.length ? "Unassigned" : members.length === 1 ? "1 Assignee" : `${members.length} Assignees`;

  const onEdit = () => {
    props.onEdit && props.onEdit();
  };

  const onCopy = () => {
    props.onCopy && props.onCopy();
  };

  const onMove = () => {
    props.onMove && props.onMove();
  };

  const onChangeLabels = () => {
    props.onChangeLabels && props.onChangeLabels();
  };

  const onChangeMembers = () => {
    props.onChangeMembers && props.onChangeMembers();
  };

  const onDelete = () => {
    props.onDelete && props.onDelete();
  };

  const onCardClick = (e) => {
    if (e.defaultPrevented) return;

    myDiscordAPI
      .connect()
      .then(({authId}) => {
          console.log('Sucessfully connected!', authId);
          setAuthId(authId);
          props.onClick && props.onClick();
      })
      .catch((err)=> {
          console.error(err);
          alert('Error connecting to Discord');
      });

  };

  const onDropdownClick = (e) => {
    e.preventDefault();
  };
  // Add Margin  
  return (
    <Card border={10} className="p-4" ref={cardRef}{...extraProps} style={{ 
      marginLeft: "10px",
      marginRight: "10px",
      marginBottom: "10px",
      marginTop: "10px",
      width: "22%",


      }} 
      onClick={onCardClick}
      > 
      <Card.Header className="d-flex align-items-center justify-content-between border-0 p-0 mb-3">
        {/* <h5 className="mb-0">{title}</h5> */}
        {image && <Image src={image} width="275px" />}

        <div>
          <Dropdown onClick={onDropdownClick}>

            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-start mt-2 py-1">
              <Dropdown.Item className="d-flex align-items-center" onClick={onEdit}>
                <CreditCardIcon className="icon icon-xs text-gray-400 me-2" /> Open Card
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center" onClick={onCopy}>
                <ClipboardCopyIcon className="icon icon-xs text-gray-400 me-2" /> Copy Card
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center" onClick={onMove}>
                <SelectorIcon className="icon icon-xs text-gray-400 me-2" /> Move Card
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center" onClick={onChangeLabels}>
                <TagIcon className="icon icon-xs text-gray-400 me-2" /> Edit labels
              </Dropdown.Item>
              <Dropdown.Item className="d-flex align-items-center" onClick={onChangeMembers}>
                <UserIcon className="icon icon-xs text-gray-400 me-2" /> Change members
              </Dropdown.Item>

              <Dropdown.Divider as="div" className="my-1" />

              <Dropdown.Item className="d-flex align-items-center" onClick={onDelete}>
                <TrashIcon className="icon icon-xs text-danger me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {/* {image && <Image src={image} className="card-img-top mb-2 mb-lg-3" />} */}

        {/* <p>{description}</p>

        <h5 className="fs-6 fw-normal mt-4">
          {membersCountDescription}
        </h5>

        <div className="avatar-group">
          {members.map(member => <KanbanAvatar key={`card-member-${member.id}`} {...member} />)}
        </div> */}
      </Card.Body>
    </Card>
  );
};