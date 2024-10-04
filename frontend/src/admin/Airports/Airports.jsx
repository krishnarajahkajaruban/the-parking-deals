import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";
import "../../pages/Dashboard/Dashboard.css";
import "../../pages/Dashboard/Dashboard-responsive.css";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { fetchAllAirports } from "../../utils/vendorUtil";

const Airports = () => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loadingNew, setLoadingNew] = useState(false);

  const arrival_terminals = [
    { name: "Terminal 1" },
    { name: "Terminal 2" },
    { name: "Terminal 3" },
    { name: "Terminal 4" },
    { name: "Terminal 5" },
  ];

  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const initialAirportObj = { name: "", terminals: [] };
  const [airportObj, setAirportObj] = useState(initialAirportObj);
  const [showAddError, setShowAddError] = useState(false);
  const [selectedAirportIs, setSelectedAirportId] = useState(null);

  const airports = useSelector((state) => state.vendor.airport);

  const token = useSelector((state) => state.auth.token);

  const handleDeleteVendor = (vendorId) => {
    confirmDialog({
      message: "Are you sure you want to delete the airport data?",
      header: "Airport Delete Confirmation",
      icon: "bi bi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteVendor(vendorId);
      },
    });
  };

  const deleteVendor = async (vendorId) => {
    try {
      await api.delete(`/api/admin/delete-airport/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.current.show({
        severity: "success",
        summary: "Airport Deleted.",
        detail: "You have successfully deleted the airport.",
        life: 3000,
      });
      fetchAllAirports(dispatch);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error deleting vendor.",
        detail: err.response.data.error,
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action_btn_area">
        <Button
          icon="bi bi-pencil-square"
          className="data-view-button"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setAirportObj({
              name: rowData.name,
              terminals: rowData.terminals?.map((t) => {
                return {
                  name: t
                };
              }),
            });
            setSelectedAirportId(rowData._id);
            setShowAddDataModal(true);
          }}
        />

        <Button
          icon="bi bi-trash3"
          className="data-delete-button"
          onClick={() => handleDeleteVendor(rowData._id)}
        />
      </div>
    );
  };

  const createAirport = async (data) => {
    setLoadingNew(true);
    try {
      const response = await api.put(`/api/admin/edit-airport/${selectedAirportIs}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Airport Updated!.",
        detail: "You have successfully updated an airport.",
        life: 3000,
      });
      setAirportObj(initialAirportObj);
      setSelectedAirportId(null);
      setShowAddDataModal(false);
      fetchAllAirports(dispatch);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error update an airport.",
        detail: err.response.data.error,
        life: 3000,
      });
    } finally {
      setLoadingNew(false);
    }
  };

  const handleAddAirport = () => {
    setShowAddError(false);
    if (
      !airportObj.name ||
      !airportObj.terminals.every((selected) =>
        arrival_terminals.some((arrival) => arrival.name === selected.name)
      )
    ) {
      setShowAddError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }
    const payload = {
      name: airportObj.name,
      terminals: airportObj.terminals.map((terminal) => terminal.name),
    };
    createAirport(payload);
  };

  const addDataModalHeader = () => {
    return (
      <div className="modal-header p-2">
        <h1 className="modal-title fs-5">Edit airport</h1>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowAddDataModal(false)}
        ></button>
      </div>
    );
  };

  const addDataModalFooter = () => {
    return (
      <div className="custom_modal_footer p-2">
        <Button
          label="Cancel"
          severity="secondary"
          className="modal_btn"
          onClick={() => setShowAddDataModal(false)}
        />
        <Button
          label={loadingNew ? "Processing" : "Update"}
          className="submit-button modal_btn"
          loading={loadingNew}
          onClick={handleAddAirport}
        />
      </div>
    );
  };

  useEffect(() => {
    fetchAllAirports(dispatch);
  }, [dispatch]);

  return (
    <>
      <Preloader />
      <Toast ref={toast} />

      <div>
        <div className="page_header_area">
          <h4 className="page_heading">Airports</h4>
        </div>

        <div className="page_content">
          {Array.isArray(airports) && airports?.length > 0 ? (
            <div className="dash-table-area">
              <DataTable
                value={airports}
                paginator
                size="small"
                rows={10}
                totalRecords={0}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
                rowHover
                className="dash-table"
              >
                <Column
                  header="Name"
                  field="name"
                  style={{ width: "20%" }}
                  className="capitalize-first-letter"
                ></Column>

                <Column
                  header="Terminals"
                  field="terminals"
                  style={{ width: "20%" }}
                  body={(rowData) =>
                    rowData.terminals.map((t) => {
                      return (
                        <span key={t} className="p-1">
                          {t}
                        </span>
                      );
                    })
                  }
                ></Column>

                <Column
                  body={actionBodyTemplate}
                  alignHeader={"center"}
                  className=""
                  header="Action"
                  style={{ width: "15%" }}
                ></Column>
              </DataTable>
            </div>
          ) : (
            <div className="no_data_found_area">
              <img src="/assets/images/no_data_2.svg" alt="No user data!" />
              <h6>No airport data!</h6>
            </div>
          )}
        </div>
      </div>

      {/*  */}
      <Dialog
        header={addDataModalHeader}
        footer={addDataModalFooter}
        visible={showAddDataModal}
        onHide={() => {
          if (!showAddDataModal) return;
          setShowAddDataModal(false);
        }}
        className="custom-modal modal_dialog modal_dialog_sm"
      >
        <div className="modal-body p-2">
          <div className="data-view-area">
            <div className="row mt-sm-2">
              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="airPortName"
                    className="custom-form-label form-required"
                  >
                    Airport
                  </label>
                  <InputText
                    id="name"
                    className="custom-form-input"
                    placeholder="Enter airport name"
                    name="name"
                    value={airportObj.name}
                    onChange={(e) =>
                      setAirportObj({ ...airportObj, name: e.target.value })
                    }
                  />

                  {showAddError && !airportObj.name && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="airPortName"
                    className="custom-form-label form-required"
                  >
                    Terminals
                  </label>
                  <MultiSelect
                    value={airportObj.terminals}
                    onChange={(e) =>
                      setAirportObj({ ...airportObj, terminals: e.value })
                    }
                    options={arrival_terminals}
                    optionLabel="name"
                    filter
                    placeholder="Select Terminals"
                    className="w-full md:w-20rem"
                    display="chip"
                    invalid={showAddError}
                  />

                  {showAddError &&
                    !airportObj.terminals.every((selected) =>
                      arrival_terminals.some(
                        (arrival) => arrival.name === selected.name
                      )
                    ) && (
                      <small className="text-danger form-error-msg">
                        This field is required
                      </small>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Airports;
