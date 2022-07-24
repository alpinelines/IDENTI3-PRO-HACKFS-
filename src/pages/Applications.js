import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Col, Row, Button, Container } from "react-bootstrap";

import KanbanHeader from "components/KanbanHeader";
import KanbanList from "components/KanbanList";
import KanbanCard from "components/KanbanCard";
import { KanbanCreateModal, KanbanEditModal, KanbanCopyModal, KanbanMoveModal, KanbanEditMembersModal, KanbanEditLabelsModal } from "components/Modals";
import KANBAN_LISTS, { createCard, createList } from "data/kanban";
import { ArchiveIcon, PlusIcon } from "@heroicons/react/solid";

const ArchiveIconHtml = ReactDOMServer.renderToString(
  <ArchiveIcon className="h-50 w-auto" />
);

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary me-3",
    cancelButton: "btn btn-gray"
  },
  buttonsStyling: false
}));

export default () => {
  const [kanbanLists, setKanbanLists] = useState(KANBAN_LISTS);
  const createCardDefaultProps = { listId: kanbanLists[0].id, cardIndex: 0 };
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [createCardProps, setCreateCardProps] = useState(createCardDefaultProps);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [cardToCopy, setCardToCopy] = useState(null);
  const [cardToMove, setCardToMove] = useState(null);
  const [cardToChangeMembers, setCardToChangeMembers] = useState(null);
  const [cardToChangeLabels, setCardToChangeLabels] = useState(null);
  const [listToCopy, setListToCopy] = useState(null);
  const [listToMoveIndex, setListToMoveIndex] = useState(null);

  const toggleCreateListModal = () => {
    setShowCreateListModal(!showCreateListModal);
  };

  const toggleCreateCardModal = (props = {}) => {
    setCreateCardProps({ ...createCardDefaultProps, ...props });
    setShowCreateCardModal(!showCreateCardModal);
  };

  const getCardStyle = (style, snapshot) => {
    const isJustDragging = snapshot.isDragging && !snapshot.isDropAnimating

    if (!isJustDragging) {
      return style;
    }

    return {
      ...style,
      transform: `${style.transform || ""} rotate(6deg)`
    };
  };

  const handleCreateCard = (props = {}) => {
    const listsUpdated = createCardInListAtIndex({ ...createCardProps, ...props });

    toggleCreateCardModal();
    setKanbanLists(listsUpdated);
  };

  const handleCopyCard = (card = {}) => {
    const { listId, title, description, } = card;
    const listsUpdated = createCardInListAtIndex({ listId, title, description });

    setCardToCopy(null);
    setKanbanLists(listsUpdated);
  };

  const handleMoveList = ({ source, destination }) => {
    const lists = [...kanbanLists];
    const [listRemoved] = lists.splice(source.index, 1);
    lists.splice(destination.index, 0, listRemoved);

    setKanbanLists(lists);
    setListToMoveIndex(null);
  };

  const handleCreateList = (props) => {
    const newList = createList(props);
    const listsUpdated = [...kanbanLists, newList];

    setShowCreateListModal(false);
    setKanbanLists(listsUpdated);
    setListToCopy(null);
  };

  const reorderCards = (cards = [], startIndex, endIndex) => {
    const [cardRemoved] = cards.splice(startIndex, 1);
    cards.splice(endIndex, 0, cardRemoved);

    return cards;
  };

  const moveCardFromList = (sList, dList, sIndex, dIndex) => {
    const sCards = [...sList.cards];
    const dCards = [...dList.cards];

    const [cardRemoved] = sCards.splice(sIndex, 1);
    dCards.splice(dIndex, 0, cardRemoved);

    return [
      { ...sList, cards: sCards },
      { ...dList, cards: dCards }
    ];
  };

  const handleDragEnd = (dragResult) => {
    const { source, destination } = dragResult;

    //  dropped outside the list
    if (!destination) {
      return;
    }

    const { droppableId: sListId, index: sCardIndex } = source;
    const { droppableId: dListId, index: dCardIndex } = destination;

    const sList = kanbanLists.find(l => l.id === sListId);
    const dList = kanbanLists.find(l => l.id === dListId);

    if (sListId === dListId) {
      // reorder cards in the list only if card's index changes
      if (sCardIndex !== dCardIndex) {
        const sCardsUpdated = reorderCards(sList.cards, sCardIndex, dCardIndex);
        const listsUpdated = kanbanLists.map(l => l.id === sListId ? { ...l, cards: sCardsUpdated } : l);
        setKanbanLists(listsUpdated);
      }
    } else {
      const [sListUpdated, dListUpdated] = moveCardFromList(sList, dList, sCardIndex, dCardIndex);
      const listsUpdated = kanbanLists.map(l => l.id === sListId ? sListUpdated : l.id === dListId ? dListUpdated : l);
      setKanbanLists(listsUpdated);
    }

    if (cardToMove) {
      setCardToMove(null);
    }
  };

  const removeCardsFromList = (cards) => {
    const cardsGroupedByListId = cards.reduce((acc, card) => {
      const { listId, cardId } = card;

      if (!acc[listId]) acc[listId] = [cardId];
      else acc[listId].push(cardId);

      return acc
    }, {});

    const listsUpdated = kanbanLists.map(l => {
      const cardsToDelete = cardsGroupedByListId[l.id];
      if (!cardsToDelete) return l;

      const cardsUpdated = l.cards.filter(c => !cardsToDelete.includes(c.id));
      return ({ ...l, cards: cardsUpdated });
    });

    return listsUpdated;
  };

  const handleListDelete = async (listId) => {
    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: "Are you sure do you want to delete this list?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      const listsUpdated = kanbanLists.filter(l => l.id !== listId);
      setKanbanLists(listsUpdated);

      await SwalWithBootstrapButtons.fire("Deleted", "The list has been deleted.", "success");
    }
  };

  const handleCardsDelete = async (cards = []) => {
    const cardsNr = cards.length;
    const textMessage = cardsNr === 1
      ? "Are you sure do you want to delete this card?"
      : `Are you sure do you want to delete these ${cardsNr} cards?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      const listsUpdated = removeCardsFromList(cards);
      setKanbanLists(listsUpdated);

      const confirmMessage = cardsNr === 1 ? "The card has been deleted." : "The cards have been deleted.";
      await SwalWithBootstrapButtons.fire("Deleted", confirmMessage, "success");
    }
  };

  const handleArchiveCards = async (cards = []) => {
    const cardsNr = cards.length;
    const textMessage = cardsNr === 1
      ? "Are you sure do you want to archive this card?"
      : `Are you sure do you want to archive these ${cardsNr} cards?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "question",
      iconHtml: ArchiveIconHtml,
      title: "Confirm archivation",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      setCardToEdit(null);
      const listsUpdated = removeCardsFromList(cards);
      setKanbanLists(listsUpdated);

      const confirmMessage = cardsNr === 1 ? "The card has been archived." : "The cards have been archived.";
      await SwalWithBootstrapButtons.fire('Archived', confirmMessage, 'success');
    }
  };

  const handleListTitleChange = ({ id, title }) => {
    const listsUpdated = kanbanLists.map(l => l.id === id ? ({ ...l, title }) : l);
    setKanbanLists(listsUpdated);
  };

  const handleCardChange = (props) => {
    const { listId, cardId, ...otherProps } = props;

    const listsUpdated = kanbanLists.map(l => {
      if (l.id !== listId) return l;

      const cards = l.cards.map(c => c.id === cardId ? ({ ...c, ...otherProps }) : c);
      return { ...l, cards };
    });

    if (cardToEdit) {
      setCardToEdit({ ...cardToEdit, ...otherProps });
    }

    setKanbanLists(listsUpdated);
    setCardToChangeMembers(null);
  };

  const createCardInListAtIndex = (props) => {
    const { listId, cardIndex, ...otherProps } = props;

    const listsUpdated = kanbanLists.map(l => {
      if (listId !== l.id) return l;

      const newCard = createCard(otherProps);
      l.cards.splice(cardIndex, 0, newCard);

      return l;
    });

    return listsUpdated;
  };

  return (
    <>
      {showCreateCardModal && (
        <KanbanCreateModal
          show={showCreateCardModal}
          onHide={toggleCreateCardModal}
          onSubmit={handleCreateCard}
        />
      )}

      {cardToEdit && (
        <KanbanEditModal
          show={true}
          {...cardToEdit}
          onHide={() => setCardToEdit(null)}
          onArchive={(card) => handleArchiveCards([card])}
          onMove={(card) => setCardToMove(card)}
          onEditMembers={(card) => setCardToChangeMembers(card)}
          onEditLabels={(card) => setCardToChangeLabels(card)}
          onChange={handleCardChange}
        />
      )}

      {cardToChangeMembers && (
        <KanbanEditMembersModal
          show={true}
          {...cardToChangeMembers}
          onHide={() => setCardToChangeMembers(null)}
          onSubmit={handleCardChange}
        />
      )}

      {cardToChangeLabels && (
        <KanbanEditLabelsModal
          show={true}
          {...cardToChangeLabels}
          onHide={() => setCardToChangeLabels(null)}
          onSubmit={handleCardChange}
        />
      )}

      {cardToCopy && (
        <KanbanCopyModal
          show={true}
          {...cardToCopy}
          lists={kanbanLists}
          onHide={() => setCardToCopy(null)}
          onSubmit={handleCopyCard}
        />
      )}

      {cardToMove && (
        <KanbanMoveModal
          show={true}
          {...cardToMove}
          lists={kanbanLists}
          onHide={() => setCardToMove(null)}
          onSubmit={handleDragEnd}
        />
      )}

      {showCreateListModal && (
        <KanbanCreateModal
          type="list"
          modalTitle="Add a new list"
          show={showCreateListModal}
          onHide={toggleCreateListModal}
          onSubmit={handleCreateList}
        />
      )}

      {listToCopy && (
        <KanbanCopyModal
          show={true}
          type="list"
          {...listToCopy}
          onHide={() => setListToCopy(null)}
          onSubmit={handleCreateList}
        />
      )}

      {listToMoveIndex !== null && (
        <KanbanMoveModal
          show={true}
          type="list"
          lists={kanbanLists}
          listIndex={listToMoveIndex}
          onHide={() => setListToMoveIndex(null)}
          onSubmit={handleMoveList}
        />
      )}

      <KanbanHeader
        onNewCard={toggleCreateCardModal}
        onArchive={handleArchiveCards}
        onDelete={handleCardsDelete}
      />

      <Container fluid className="kanban-container py-4 px-0">
        <Row className="d-flex flex-nowrap">
          <DragDropContext onDragEnd={handleDragEnd}>
            {kanbanLists.map((list, ind) => {
              const { id: listId, cards } = list;

              return (
                <Droppable index={ind} droppableId={`${listId}`} key={`kanban-list-${listId}`}>
                  {provided => {
                    const { innerRef: listRef, placeholder, droppableProps } = provided;

                    return (
                      <KanbanList
                        {...list}
                        listRef={listRef}
                        extraProps={droppableProps}
                        onCardAdd={() => toggleCreateCardModal({ listId })}
                        onListCopy={() => setListToCopy(list)}
                        onListMove={() => setListToMoveIndex(ind)}
                        onListDelete={handleListDelete}
                        onTitleChange={handleListTitleChange}
                      >
                        {cards.map((card, index) => {
                          const { id: cardId } = card;

                          return (
                            <Draggable index={index} draggableId={`${cardId}`} key={`kanban-card-${cardId}`}>
                              {(provided, snapshot) => {
                                const { innerRef: cardRef, draggableProps, dragHandleProps } = provided;

                                return (
                                  <KanbanCard
                                    {...card}
                                    cardRef={cardRef}
                                    style={getCardStyle(draggableProps.style, snapshot)}
                                    extraProps={{ ...draggableProps, ...dragHandleProps }}
                                    onDelete={() => handleCardsDelete([{ listId, cardId }])}
                                    onClick={() => setCardToEdit({ listId, index, ...card })}
                                    onEdit={() => setCardToEdit({ listId, index, ...card })}
                                    onCopy={() => setCardToCopy({ listId, ...card })}
                                    onMove={() => setCardToMove({ listId, index })}
                                    onChangeMembers={() => setCardToChangeMembers({ listId, ...card })}
                                    onChangeLabels={() => setCardToChangeLabels({ listId, ...card })}
                                  />
                                );
                              }}
                            </Draggable>
                          )
                        })}

                        {placeholder}
                        <Button
                          variant="outline-gray-500"
                          onClick={() => toggleCreateCardModal({ listId, cardIndex: cards.length })}
                          className="d-inline-flex align-items-center justify-content-center dashed-outline new-card w-100"
                        >
                          <PlusIcon className="icon icon-xs me-2" /> Add another card
                        </Button>
                      </KanbanList>
                    );
                  }}
                </Droppable>
              )
            })}
          </DragDropContext>

          <Col xs={12} lg={6} xl={4} xxl={3}>
            <div className="d-grid">
              <Button
                variant="outline-gray-500"
                onClick={toggleCreateListModal}
                className="d-inline-flex align-items-center justify-content-center dashed-outline new-card w-100"
              >
                <PlusIcon className="icon icon-xs me-2" /> Add another list
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};



//Blank page Below




// import React, { useState } from "react";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import { AdjustmentsIcon, CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
// import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

// // import { ApplicationsTable } from "components/Tables";
// import USERS_DATA from "data/users";
// import { Routes } from "routes";

// const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
//   customClass: {
//     confirmButton: 'btn btn-primary me-3',
//     cancelButton: 'btn btn-gray'
//   },
//   buttonsStyling: false
// }));

// export default () => {
//   const [applications, setApplications] = useState(USERS_DATA.map(u => ({ ...u, isSelected: false, show: true })));
//   const [searchValue, setSearchValue] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const selectedApplicationsIds = applications.filter(u => u.isSelected).map(u => u.id);
//   const totalApplications = applications.length;
//   const allSelected = selectedApplicationsIds.length === totalApplications;

//   const changeSearchValue = (e) => {
//     const newSearchValue = e.target.value;
//     const newApplications = applications.map(u => ({ ...u, show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) }));

//     setSearchValue(newSearchValue);
//     setApplications(newApplications);
//   };

//   const changeStatusFilter = (e) => {
//     const newStatusFilter = e.target.value;
//     const newApplications = applications.map(u => ({ ...u, show: u.status === newStatusFilter || newStatusFilter === "all" }));
//     setStatusFilter(newStatusFilter);
//     setApplications(newApplications);
//   };

//   const selectAllApplications = () => {
//     const newApplications = selectedApplicationsIds.length === totalApplications ?
//       applications.map(u => ({ ...u, isSelected: false })) :
//       applications.map(u => ({ ...u, isSelected: true }));

//     setApplications(newApplications);
//   };

//   const selectApplication = (id) => {
//     const newApplications = applications.map(u => u.id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
//     setApplications(newApplications);
//   };

//   const deleteApplications = async (ids) => {
//     const usersToBeDeleted = ids ? ids : selectedApplicationsIds;
//     const usersNr = usersToBeDeleted.length;
//     const textMessage = usersNr === 1
//       ? "Are you sure do you want to delete this application?"
//       : `Are you sure do you want to delete these ${usersNr} applications?`;

//     const result = await SwalWithBootstrapButtons.fire({
//       icon: "error",
//       title: "Confirm deletion",
//       text: textMessage,
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       cancelButtonText: "Cancel"
//     });

//     if (result.isConfirmed) {
//       const newApplications = applications.filter(f => !usersToBeDeleted.includes(f.id));
//       const confirmMessage = usersNr === 1 ? "The application has been deleted." : "The applications have been deleted.";

//       setApplications(newApplications);
//       await SwalWithBootstrapButtons.fire('Deleted', confirmMessage, 'success');
//     }
//   };

//   return (
//     <>
//       <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
//         <div className="d-block mb-4 mb-md-0">
//           <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
//             <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
//             <Breadcrumb.Item>Volt</Breadcrumb.Item>
//             <Breadcrumb.Item active>Applications List</Breadcrumb.Item>
//           </Breadcrumb>
//           <h4>Applications List</h4>
//           <p className="mb-0">Your web analytics dashboard template.</p>
//         </div>
//         <div className="btn-toolbar mb-2 mb-md-0">
//           <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center">
//             <PlusIcon className="icon icon-xs me-2" /> New Application
//           </Button>
//           <ButtonGroup className="ms-2 ms-lg-3">
//             <Button variant="outline-gray-600" size="sm">Share</Button>
//             <Button variant="outline-gray-600" size="sm">Export</Button>
//           </ButtonGroup>
//         </div>
//       </div>

//       <div className="table-settings mb-4">
//         <Row className="justify-content-between align-items-center">
//           <Col xs={9} lg={8} className="d-md-flex">
//             <InputGroup className="me-2 me-lg-3 fmxw-300">
//               <InputGroup.Text>
//                 <SearchIcon className="icon icon-xs" />
//               </InputGroup.Text>
//               <Form.Control
//                 type="text"
//                 placeholder="Search applications"
//                 value={searchValue}
//                 onChange={changeSearchValue}
//               />
//             </InputGroup>
//             <Form.Select value={statusFilter} className="fmxw-200 d-none d-md-inline" onChange={changeStatusFilter}>
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//               <option value="suspended">Suspended</option>
//             </Form.Select>
//           </Col>
//           <Col xs={3} lg={4} className="d-flex justify-content-end">
//             <ButtonGroup>
//               <Dropdown className="me-1">
//                 <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
//                   <AdjustmentsIcon className="icon icon-sm" />
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className="dropdown-menu-end pb-0">
//                   <span className="small ps-3 fw-bold text-dark">
//                     Show
//                   </span>
//                   <Dropdown.Item className="d-flex align-items-center fw-bold">
//                     10 <CheckIcon className="icon icon-xxs ms-auto" />
//                   </Dropdown.Item>
//                   <Dropdown.Item className="fw-bold">20</Dropdown.Item>
//                   <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//               <Dropdown>
//                 <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
//                   <CogIcon className="icon icon-sm" />
//                   <span className="visually-hidden">Toggle Dropdown</span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-end pb-0">
//                   <span className="small ps-3 fw-bold text-dark">
//                     Show
//                   </span>
//                   <Dropdown.Item className="d-flex align-items-center fw-bold">
//                     10 <CheckIcon className="icon icon-xxs ms-auto" />
//                   </Dropdown.Item>
//                   <Dropdown.Item className="fw-bold">20</Dropdown.Item>
//                   <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </ButtonGroup>
//           </Col>
//         </Row>
//       </div>

//       {/* <ApplicationsTable
//         applications={applications.filter(u => u.show)}
//         allSelected={allSelected}
//         selectApplication={selectApplication}
//         deleteApplications={deleteApplications}
//         selectAllApplications={selectAllApplications}
//       /> */}
//     </>
//   );
// };
