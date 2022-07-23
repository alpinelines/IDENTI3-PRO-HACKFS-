
import React, { useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AdjustmentsIcon, CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { ApplicationsTable } from "components/Tables";
import USERS_DATA from "data/applications";
import { Routes } from "routes";

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

export default () => {
  const [applications, setApplications] = useState(USERS_DATA.map(u => ({ ...u, isSelected: false, show: true })));
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const selectedApplicationsIds = applications.filter(u => u.isSelected).map(u => u.id);
  const totalApplications = applications.length;
  const allSelected = selectedApplicationsIds.length === totalApplications;

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newApplications = applications.map(u => ({ ...u, show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) }));

    setSearchValue(newSearchValue);
    setApplications(newApplications);
  };

  const changeStatusFilter = (e) => {
    const newStatusFilter = e.target.value;
    const newApplications = applications.map(u => ({ ...u, show: u.status === newStatusFilter || newStatusFilter === "all" }));
    setStatusFilter(newStatusFilter);
    setApplications(newApplications);
  };

  const selectAllApplications = () => {
    const newApplications = selectedApplicationsIds.length === totalApplications ?
      applications.map(u => ({ ...u, isSelected: false })) :
      applications.map(u => ({ ...u, isSelected: true }));

    setApplications(newApplications);
  };

  const selectApplication = (id) => {
    const newApplications = applications.map(u => u.id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setApplications(newApplications);
  };

  const deleteApplications = async (ids) => {
    const usersToBeDeleted = ids ? ids : selectedApplicationsIds;
    const usersNr = usersToBeDeleted.length;
    const textMessage = usersNr === 1
      ? "Are you sure do you want to delete this application?"
      : `Are you sure do you want to delete these ${usersNr} applications?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      const newApplications = applications.filter(f => !usersToBeDeleted.includes(f.id));
      const confirmMessage = usersNr === 1 ? "The application has been deleted." : "The applications have been deleted.";

      setApplications(newApplications);
      await SwalWithBootstrapButtons.fire('Deleted', confirmMessage, 'success');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Applications List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Applications List</h4>
          <p className="mb-0">Your web analytics dashboard template.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center">
            <PlusIcon className="icon icon-xs me-2" /> New Application
          </Button>
          <ButtonGroup className="ms-2 ms-lg-3">
            <Button variant="outline-gray-600" size="sm">Share</Button>
            <Button variant="outline-gray-600" size="sm">Export</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={9} lg={8} className="d-md-flex">
            <InputGroup className="me-2 me-lg-3 fmxw-300">
              <InputGroup.Text>
                <SearchIcon className="icon icon-xs" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search applications"
                value={searchValue}
                onChange={changeSearchValue}
              />
            </InputGroup>
            <Form.Select value={statusFilter} className="fmxw-200 d-none d-md-inline" onChange={changeStatusFilter}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </Form.Select>
          </Col>
          <Col xs={3} lg={4} className="d-flex justify-content-end">
            <ButtonGroup>
              <Dropdown className="me-1">
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
                  <AdjustmentsIcon className="icon icon-sm" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end pb-0">
                  <span className="small ps-3 fw-bold text-dark">
                    Show
                  </span>
                  <Dropdown.Item className="d-flex align-items-center fw-bold">
                    10 <CheckIcon className="icon icon-xxs ms-auto" />
                  </Dropdown.Item>
                  <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                  <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
                  <CogIcon className="icon icon-sm" />
                  <span className="visually-hidden">Toggle Dropdown</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-end pb-0">
                  <span className="small ps-3 fw-bold text-dark">
                    Show
                  </span>
                  <Dropdown.Item className="d-flex align-items-center fw-bold">
                    10 <CheckIcon className="icon icon-xxs ms-auto" />
                  </Dropdown.Item>
                  <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                  <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

      <ApplicationsTable
        applications={applications.filter(u => u.show)}
        allSelected={allSelected}
        selectApplication={selectApplication}
        deleteApplications={deleteApplications}
        selectAllApplications={selectAllApplications}
      />
    </>
  );
};
