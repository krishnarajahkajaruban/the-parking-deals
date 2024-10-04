import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";
import { Link, useNavigate } from "react-router-dom";
import "../../pages/Dashboard/Dashboard.css";
import "../../pages/Dashboard/Dashboard-responsive.css";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Editor } from "primereact/editor";

import { SampleVendorData } from "./SampleVendorData";
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { Ripple } from "primereact/ripple";
import { MultiSelect } from "primereact/multiselect";
import { fetchAllAirports } from "../../utils/vendorUtil";

const Vendors = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [showError, setShowError] = useState(false);
  const [vendorsData, setVendorsData] = useState(null);
  const [dataState, setDataState] = useState("Add");
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const serviceTypes = [{ type: "Meet and Greet" }, { type: "Park and Ride" }];
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

  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState(null);
  const [quote, setQuote] = useState(null);
  const [rating, setRating] = useState(0);
  const [dealPercentage, setDealPercentage] = useState(null);
  const [hasCancellationCover, setHasCancellationCover] = useState(false);
  const [cancellationCoverAmount, setCancellationCoverAmount] = useState(null);
  const [facilities, setFacilities] = useState([{ facility: "" }]);
  const [overView, setOverView] = useState("");
  const [dropOffProcedure, setDropOffProcedure] = useState("");
  const [pickUpProcedure, setPickUpProcedure] = useState("");

  const airports = useSelector((state) => state.vendor.airport);

  const intialVendorData = {
    incrementPerDay: 0,
    extraIncrementPerDay: 0,
    airports: null,
    email: "",
    companyName: "",
    serviceType: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    rating: 0,
    overView: null,
    quote: 0,
    finalQuote: 0,
    // cancellationCover: false,
    facilities: [""],
    dropOffProcedure: null,
    pickUpProcedure: null,
    logo: null,
    dealPercentage: 0,
  };

  const [vendorData, setVendorData] = useState(intialVendorData);
  const [emailExists, setEmailExist] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const header = <div className="font-bold mb-3">Password Strength</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="ps-4 mt-0 mb-0 pb-0 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li className="mb-0">Minimum 8 characters</li>
      </ul>
    </>
  );

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    setVendorData({
      ...vendorData,
      [name]: files ? files?.[0] : value,
      ...(name === "quote" && { finalQuote: value }),
    });
    if (name === "email") {
      setShowError(false);
      setEmailExist(false);
      try {
        const response = await api.post("/api/auth/check-user-registerd", {
          email: value,
        });
        console.log(response.data);
        setEmailExist(response.data?.emailExists);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //For image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setLogo(event.target.result);
          const file = e.target.files?.[0];
          setLogoFile(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // For clear image
  const clearImage = () => {
    setLogo(null);
    setLogoFile(null);
    setVendorData({ ...vendorData, logo: null });
  };

  const fetchData = async () => {
    const data = await SampleVendorData.getVendorsData();
    setVendorsData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const createVendor = async (vendorFormData) => {
    setLoading(true);
    try {
      console.log(vendorFormData);
      const response = await api.post(
        "/api/admin/create-vendor",
        vendorFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Vendor Created.",
        detail: "You have successfully created a new vendor.",
        life: 3000,
      });
      setVendorData(intialVendorData);
      setLogo(null);
      setShowVendorModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error creating vendor.",
        detail: err.response.data.error,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (vendorFormData) => {
    setLoading(true);
    try {
      const response = await api.put(
        `/api/admin/update-vendor-info/${selectedVendorId}`,
        vendorFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Vendor Updated.",
        detail: "You have successfully updated the vendor details.",
        life: 3000,
      });
      setVendorData(intialVendorData);
      setLogo(null);
      setShowVendorModal(false);
      setSelectedVendorId(null);
      fetchData();
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error updating vendor.",
        detail: err.response.data.error,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    if (
      !vendorData.logo ||
      !vendorData.companyName ||
      !vendorData.email ||
      !vendorData.mobileNumber ||
      !vendorData.password ||
      !vendorData.confirmPassword ||
      vendorData.quote === 0 ||
      vendorData.incrementPerDay === 0 ||
      vendorData.extraIncrementPerDay === 0 ||
      !vendorData.airports ||
      vendorData.finalQuote === 0 ||
      !vendorData.serviceType ||
      vendorData.rating === 0 ||
      vendorData.facilities.length === 0 ||
      !vendorData.overView ||
      !vendorData.dropOffProcedure ||
      !vendorData.pickUpProcedure ||
      vendorData.dealPercentage === 0
    ) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }
    if (vendorData.password !== vendorData.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Password & Confirm Password do not match!",
        life: 3000,
      });
      return;
    }
    if (vendorData.password.length < 8) {
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Password must be atleast 8 characters long!",
        life: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("logo", vendorData.logo);
    formData.append("email", vendorData.email);
    formData.append("companyName", vendorData.companyName);
    formData.append("serviceType", vendorData.serviceType);
    formData.append("password", vendorData.password);
    formData.append("mobileNumber", vendorData.mobileNumber);
    formData.append("rating", vendorData.rating);
    formData.append("dealPercentage", vendorData.dealPercentage);
    formData.append("overView", vendorData.overView);
    formData.append("quote", vendorData.quote);
    formData.append("incrementPerDay", vendorData.incrementPerDay);
    formData.append("extraIncrementPerDay", vendorData.extraIncrementPerDay);
    formData.append("finalQuote", vendorData.finalQuote);
    // formData.append("cancellationCover", vendorData.cancellationCover);
    formData.append("facilities", JSON.stringify(vendorData.facilities));
    formData.append(
      "airports",
      JSON.stringify(
        Array.isArray(vendorData.airports)
          ? vendorData.airports.map((ap) => ap.id)
          : []
      )
    );
    formData.append("dropOffProcedure", vendorData.dropOffProcedure);
    formData.append("pickUpProcedure", vendorData.pickUpProcedure);

    await createVendor(formData);
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    console.log(vendorData);
    setShowError(false);
    if (
      !vendorData.companyName ||
      !vendorData.email ||
      !vendorData.mobileNumber ||
      vendorData.quote === 0 ||
      vendorData.incrementPerDay === 0 ||
      vendorData.extraIncrementPerDay === 0 ||
      !vendorData.airports ||
      vendorData.finalQuote === 0 ||
      !vendorData.serviceType ||
      vendorData.rating === 0 ||
      vendorData.dealPercentage === 0 ||
      vendorData.facilities.length === 0 ||
      !vendorData.overView ||
      !vendorData.dropOffProcedure ||
      !vendorData.pickUpProcedure
    ) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }

    const formData = new FormData();
    vendorData.logo && formData.append("logo", vendorData.logo);
    formData.append("email", vendorData.email);
    formData.append("companyName", vendorData.companyName);
    formData.append("serviceType", vendorData.serviceType);
    formData.append("mobileNumber", vendorData.mobileNumber);
    formData.append("rating", vendorData.rating);
    formData.append("dealPercentage", vendorData.dealPercentage);
    formData.append("overView", vendorData.overView);
    formData.append("quote", vendorData.quote);
    formData.append("incrementPerDay", vendorData.incrementPerDay);
    formData.append("extraIncrementPerDay", vendorData.extraIncrementPerDay);
    formData.append("finalQuote", vendorData.finalQuote);
    // formData.append("cancellationCover", vendorData.cancellationCover);
    formData.append("facilities", JSON.stringify(vendorData.facilities));
    formData.append(
      "airports",
      JSON.stringify(
        Array.isArray(vendorData.airports)
          ? vendorData.airports.map((ap) => ap.id)
          : []
      )
    );
    formData.append("dropOffProcedure", vendorData.dropOffProcedure);
    formData.append("pickUpProcedure", vendorData.pickUpProcedure);

    await updateVendor(formData);
  };

  const handleDeleteVendor = (vendorId) => {
    confirmDialog({
      message: "Are you sure you want to delete the vendor data?",
      header: "User Delete Confirmation",
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
      await api.delete(`/api/admin/delete-vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.current.show({
        severity: "success",
        summary: "Vendor Deleted.",
        detail: "You have successfully deleted the vendor.",
        life: 3000,
      });
      fetchData();
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
            setVendorData({
              email: rowData?.email,
              companyName: rowData?.companyName,
              serviceType: rowData?.serviceType,
              mobileNumber: rowData?.mobileNumber,
              rating: rowData?.rating,
              dealPercentage: rowData?.dealPercentage,
              overView: rowData?.overView,
              quote:
                rowData?.quote === 0 ? rowData?.finalQuote : rowData?.quote,
              finalQuote: rowData?.finalQuote,
              // cancellationCover: rowData?.cancellationCover,
              facilities:
                rowData?.facilities?.length > 0 ? rowData?.facilities : [""],
              airports: rowData?.airports?.length > 0 ? rowData?.airports : null,
              incrementPerDay: rowData?.incrementPerDay,
              extraIncrementPerDay: rowData?.extraIncrementPerDay,
              dropOffProcedure: rowData?.dropOffProcedure,
              pickUpProcedure: rowData?.pickUpProcedure,
              logo: null,
              password: "",
              confirmPassword: "",
            });
            setLogo(rowData?.dp);
            setShowVendorModal(true);
            setDataState("Edit");
            setSelectedVendorId(rowData._id);
          }}
        />

        <Button
          icon="bi bi-trash3"
          className="data-delete-button"
          onClick={() => handleDeleteVendor(rowData._id)}
        />
        <Button
          icon="bi bi-calendar3"
          className="data-view-button"
          tooltip="Bookings"
          tooltipOptions={{ position: "top" }}
          onClick={() => navigate(`/vendors/bookings/${rowData._id}`)}
        />
      </div>
    );
  };

  const vendorModalHeader = () => {
    return (
      <div className="modal-header p-2">
        <h1 className="modal-title fs-5" id="bookingDetailModalLabel">
          {dataState === "Add" ? "Create" : "Edit"}&nbsp;vendor detail
        </h1>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowVendorModal(false)}
        ></button>
      </div>
    );
  };

  const userModalFooter = () => {
    return (
      <div className="custom_modal_footer p-2">
        <Button
          label="Cancel"
          severity="secondary"
          className="modal_btn"
          onClick={() => setShowVendorModal(false)}
        />
        <Button
          label={
            loading ? "Processing" : dataState === "Add" ? "Save" : "Update"
          }
          className="submit-button modal_btn"
          loading={loading}
          onClick={
            dataState === "Add" ? handleCreateVendor : handleUpdateVendor
          }
        />
      </div>
    );
  };

  const cancellationCoverBody = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        {rowData.cancellationCover ? (
          <strong className="text-center text-success">Available</strong>
        ) : (
          <strong className="text-center text-danger">Not available</strong>
        )}
      </div>
    );
  };

  const ratingBody = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const addFacility = () => {
    setFacilities([...facilities, ""]);
    setVendorData({ ...vendorData, facilities: [...facilities, ""] });
  };

  const removeFacility = (index) => {
    const updatedFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(updatedFacilities);
    setVendorData({ ...vendorData, facilities: updatedFacilities });
  };

  const handleFacilityChange = (index, value) => {
    const updatedFacilities = vendorData.facilities.map((facility, i) =>
      i === index ? value : facility
    );
    setFacilities(updatedFacilities);
    setVendorData({ ...vendorData, facilities: updatedFacilities });
  };

  const createAirport = async (data) => {
    setLoadingNew(true);
    try {
      const response = await api.post(`/api/admin/create-airport`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Airport Created!.",
        detail: "You have successfully created an airport.",
        life: 3000,
      });
      setAirportObj(initialAirportObj);
      setShowAddDataModal(false);
      fetchAllAirports(dispatch);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error create an airport.",
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
        <h1 className="modal-title fs-5">Add new airport</h1>
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
          label={loadingNew ? "Processing" : "Add"}
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

  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
      <Preloader />
      <Toast ref={toast} />

      <div>
        <div className="page_header_area">
          <h4 className="page_heading">Vendors</h4>
          <Button
            label="Add vendor"
            icon="bi bi-plus-circle"
            className="btn_primary"
            onClick={() => {
              setLogo(null);
              setVendorData(intialVendorData);
              setShowVendorModal(true);
              setDataState("Add");
            }}
          />
        </div>

        <div className="page_content">
          {vendorsData?.length > 0 ? (
            <div className="dash-table-area">
              <DataTable
                value={vendorsData}
                paginator
                size="small"
                rows={rows}
                totalRecords={totalRecords}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
                rowHover
                className="dash-table"
              >
                <Column
                  header="Name"
                  field="companyName"
                  style={{ width: "20%" }}
                ></Column>

                <Column
                  header="Type"
                  field="serviceType"
                  style={{ width: "20%" }}
                ></Column>

                <Column
                  header="Rating"
                  body={ratingBody}
                  style={{ width: "20%" }}
                ></Column>

                {/* <Column
                  header="Cancellation Cover"
                  alignHeader={"center"}
                  body={cancellationCoverBody}
                  style={{ width: "15%" }}
                ></Column> */}

                <Column
                  header="Quote"
                  field="finalQuote"
                  style={{ width: "10%" }}
                  body={(rowData) => `£ ${rowData.finalQuote}`}
                />
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
              <h6>No user data!</h6>
            </div>
          )}
        </div>
      </div>

      {/* User create/edit modal */}
      <Dialog
        header={vendorModalHeader}
        footer={userModalFooter}
        visible={showVendorModal}
        onHide={() => {
          if (!showVendorModal) return;
          setShowVendorModal(false);
        }}
        className="custom-modal modal_dialog modal_dialog_md"
      >
        <div className="modal-body p-2">
          <div className="data-view-area">
            <div className="row">
              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <div className="form_img_upload_area">
                    <h6 className="logo_label">Logo</h6>
                    <div className="form_img_upload">
                      <input
                        type="file"
                        name="logo"
                        accept=".jpg, .png,"
                        className="form_img_upload_input"
                        id="logo"
                        onChange={(e) => {
                          handleImageChange(e);
                          handleChange(e);
                        }}
                      />
                      <label
                        htmlFor="logo"
                        className={`form_img_upload_label ${
                          logo ? "uploaded" : ""
                        }`}
                        style={{ backgroundImage: logo ? `url(${logo})` : `` }}
                      >
                        {!logo && (
                          <div className="upload_icon">
                            <i className="bi bi-camera-fill"></i>
                          </div>
                        )}
                      </label>
                      {logo ? (
                        <button
                          className="upload_clear_button mt-2"
                          onClick={clearImage}
                        >
                          Clear
                        </button>
                      ) : (
                        <label
                          htmlFor="profileImage"
                          className="add_image_label mt-2"
                        >
                          Add image
                        </label>
                      )}
                      {showError && !logo && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="col-12 col-xl-4 col-sm-6">
                  <div className="custom-form-group mb-sm-4 mb-3">
                    <label
                      htmlFor="airport"
                      className="custom-form-label form-required"
                    >
                      Select airport:{" "}
                    </label>
                    <MultiSelect
                      value={vendorData.airports}
                      onChange={(e) =>
                        setVendorData({ ...vendorData, airports: e.value })
                      }
                      options={
                        Array.isArray(airports)
                          ? airports.map((ap) => {
                              return {
                                name: capitalizeFirstLetter(ap.name),
                                id: ap._id,
                              };
                            })
                          : []
                      }
                      optionLabel="name"
                      filter
                      placeholder="Select Airports"
                      className="w-full md:w-20rem"
                      display="chip"
                      invalid={showError}
                    />
                    {showError && !vendorData.airports && (
                      <small className="text-danger form-error-msg">
                        This field is required
                      </small>
                    )}

                    <button
                      className="add_data_btn p-ripple"
                      onClick={() => setShowAddDataModal(true)}
                    >
                      <i className="bi bi-plus-lg me-1"></i>
                      Add new airport
                      <Ripple />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="name"
                    className="custom-form-label form-required"
                  >
                    Name
                  </label>
                  <InputText
                    id="name"
                    className="custom-form-input"
                    placeholder="Name"
                    name="companyName"
                    value={vendorData.companyName}
                    onChange={handleChange}
                  />

                  {showError && !vendorData.companyName && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="verify_email"
                    className="custom-form-label form-required"
                  >
                    Email
                  </label>
                  <InputText
                    id="email"
                    keyfilter="email"
                    className="custom-form-input"
                    placeholder="Enter your email address"
                    name="email"
                    value={vendorData.email}
                    onChange={handleChange}
                  />
                  {showError && !vendorData.email && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                  <small className="text-danger form-error-msg">
                    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorData.email) &&
                    vendorData.email
                      ? "Enter valid email"
                      : ""}
                  </small>
                  <small className="text-danger form-error-msg">
                    {emailExists ? "Email already exists" : ""}
                  </small>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="mobileNumber"
                    className="custom-form-label form-required"
                  >
                    Mobile Number
                  </label>
                  <InputText
                    id="mobileNumber"
                    keyfilter="num"
                    className="custom-form-input"
                    placeholder="Enter your mobile number"
                    name="mobileNumber"
                    value={vendorData.mobileNumber}
                    onChange={handleChange}
                  />
                  {showError && !vendorData.mobileNumber && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                  <small className="text-danger form-error-msg">
                    {!/^\d{9,}$/.test(vendorData.mobileNumber) &&
                    vendorData.mobileNumber
                      ? "Enter valid phone number"
                      : ""}
                  </small>
                </div>
              </div>

              {dataState === "Add" && (
                <>
                  <div className="col-12 col-sm-6">
                    <div className="custom-form-group mb-3 mb-sm-4">
                      <label
                        htmlFor="password"
                        className="custom-form-label form-required"
                      >
                        Password
                      </label>
                      <Password
                        id="password"
                        className="custom-form-input"
                        placeholder="Enter your password"
                        name="password"
                        value={vendorData.password}
                        onChange={handleChange}
                        header={header}
                        footer={footer}
                        toggleMask
                      />
                      {showError && !vendorData.password && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                      <small className="text-danger form-error-msg">
                        {vendorData.password.length < 8 && vendorData.password
                          ? "Password must be atleast 8 characters long"
                          : ""}
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="custom-form-group mb-3 mb-sm-4">
                      <label
                        htmlFor="confirmPassword"
                        className="custom-form-label form-required"
                      >
                        Confirm Password
                      </label>
                      <Password
                        id="confirmPassword"
                        className="custom-form-input"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={vendorData.confirmPassword}
                        onChange={handleChange}
                        header={header}
                        footer={footer}
                        toggleMask
                      />
                      {showError && !vendorData.confirmPassword && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                      <small className="text-danger text-capitalized form-error-message">
                        {vendorData.password !== vendorData.confirmPassword &&
                        vendorData.confirmPassword
                          ? "Password & Confirm Password must be equal"
                          : ""}
                      </small>
                    </div>
                  </div>
                </>
              )}

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="quote"
                    className="custom-form-label form-required"
                  >
                    Quote
                  </label>
                  <InputNumber
                    id="quote"
                    className="custom-form-input"
                    placeholder="Quote"
                    name="quote"
                    value={parseInt(vendorData.quote)}
                    onValueChange={handleChange}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                  />
                  {showError && vendorData.quote === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="discountQuote"
                    className="custom-form-label form-required"
                  >
                    Discount Quote
                  </label>
                  <InputNumber
                    id="discountQuote"
                    className="custom-form-input"
                    placeholder="Discount Quote"
                    name="finalQuote"
                    value={parseInt(vendorData.finalQuote)}
                    onValueChange={handleChange}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                  />
                  {showError && vendorData.finalQuote === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="type"
                    className="custom-form-label form-required"
                  >
                    Service type
                  </label>
                  <Dropdown
                    id="type"
                    name="serviceType"
                    value={{ type: vendorData.serviceType }}
                    onChange={(e) =>
                      setVendorData({
                        ...vendorData,
                        serviceType: e.value?.type,
                      })
                    }
                    options={serviceTypes}
                    optionLabel="type"
                    placeholder="Select type"
                    className="w-full w-100 custom-form-dropdown"
                    showClear
                  />
                  {showError && !vendorData.serviceType && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="quote"
                    className="custom-form-label form-required"
                  >
                    Rating
                  </label>
                  <InputNumber
                    id="rating"
                    className="custom-form-input"
                    placeholder="Rating"
                    name="rating"
                    value={parseInt(vendorData.rating)}
                    onValueChange={handleChange}
                    maxFractionDigits={1}
                    useGrouping={false}
                    mode="decimal"
                    min={0}
                    max={5}
                    step={0.1}
                    suffix="⭐"
                  />

                  {showError && vendorData.rating === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="dealPercentage"
                    className="custom-form-label form-required"
                  >
                    Deal percentage
                  </label>
                  <InputNumber
                    id="dealPercentage"
                    className="custom-form-input"
                    placeholder="Percentage"
                    name="dealPercentage"
                    value={parseInt(vendorData.dealPercentage)}
                    onValueChange={handleChange}
                    maxFractionDigits={2}
                    useGrouping={false}
                    mode="decimal"
                    min={0}
                    max={100}
                    step={0.1}
                    suffix="%"
                  />

                  {showError && vendorData.dealPercentage === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="incrementPerDay"
                    className="custom-form-label form-required"
                  >
                    Quote increment per day
                  </label>
                  <InputNumber
                    id="incrementPerDay"
                    className="custom-form-input"
                    placeholder="Quote increment per day"
                    name="incrementPerDay"
                    value={parseInt(vendorData.incrementPerDay)}
                    onValueChange={handleChange}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                  />
                  {showError && vendorData.incrementPerDay === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="extraIncrementPerDay"
                    className="custom-form-label form-required"
                  >
                    Quote increment after 30 days
                  </label>
                  <InputNumber
                    id="extraIncrementPerDay"
                    className="custom-form-input"
                    placeholder="Quote increment after 30 days"
                    name="extraIncrementPerDay"
                    value={parseInt(vendorData.extraIncrementPerDay)}
                    onValueChange={handleChange}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                  />
                  {showError && vendorData.extraIncrementPerDay === 0 && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="custom-form-group mb-3 mb-sm-4">
                  {/* <label htmlFor="quote" className="custom-form-label">
                                        Cancellation cover 
                                    </label>
                                    <InputNumber
                                        id="cancellationCoverAmount"
                                        className="custom-form-input"
                                        placeholder="Cancellation cover amount"
                                        name="cancellationCoverAmount"
                                        value={cancellationCoverAmount}
                                        onValueChange={(e) => setCancellationCoverAmount(e.value)}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
                                        disabled={!hasCancellationCover}
                                    /> */}

                  {/* {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    } */}

                  {/* <div className="d-flex align-content-center mt-2">
                    <Checkbox
                      inputId="cancellationCover"
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          cancellationCover: e.checked,
                        })
                      }
                      checked={vendorData.cancellationCover}
                    ></Checkbox>
                    <label
                      htmlFor="cancellationCover"
                      className="ms-2 custom-form-label cursor-pointer"
                    >
                      Cancellation cover
                    </label>
                  </div> */}
                </div>
              </div>

              {vendorData.facilities.map((facility, index) => (
                <div className="col-12" key={index}>
                  <div className="custom-form-group mb-3 mb-sm-4">
                    <label
                      htmlFor={`name-${index}`}
                      className="custom-form-label form-required"
                    >
                      Facility {index + 1}
                    </label>
                    <InputText
                      id={`name-${index}`}
                      className="custom-form-input mb-2"
                      placeholder="Facility"
                      name={`name-${index}`}
                      value={facility}
                      onChange={(e) =>
                        handleFacilityChange(index, e.target.value)
                      }
                    />

                    <div className="d-flex">
                      <Button
                        className="add_more_btn submit-button plain modal_btn p-1 pe-2 ps-2 me-2"
                        onClick={addFacility}
                        icon="bi bi-plus-lg"
                        severity="danger"
                        label="Add"
                      />
                      {facilities.length > 1 && index !== 0 && (
                        <Button
                          className="add_more_btn modal_btn p-1 pe-2 ps-2"
                          onClick={() => removeFacility(index)}
                          icon="bi bi-dash-lg"
                          severity="danger"
                          label="Remove"
                        />
                      )}
                    </div>

                    {showError && vendorData.facilities.length === 0 && (
                      <small className="text-danger form-error-msg">
                        This field is required
                      </small>
                    )}
                  </div>
                </div>
              ))}

              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="overView"
                    className="custom-form-label form-required"
                  >
                    Overview
                  </label>
                  <Editor
                    id="overView"
                    placeholder="Enter the overview about the company"
                    value={vendorData.overView}
                    onTextChange={(e) =>
                      setVendorData({ ...vendorData, overView: e.htmlValue })
                    }
                    style={{ height: "300px" }}
                  />

                  {showError && !vendorData.overView && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="dropOffProcedure"
                    className="custom-form-label form-required"
                  >
                    Drop off procedure
                  </label>
                  <Editor
                    id="dropOffProcedure"
                    placeholder="Enter the drop-off procedure for bookings"
                    value={vendorData.dropOffProcedure}
                    onTextChange={(e) =>
                      setVendorData({
                        ...vendorData,
                        dropOffProcedure: e.htmlValue,
                      })
                    }
                    style={{ height: "300px" }}
                  />

                  {showError && !vendorData.dropOffProcedure && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="pickUpProcedure"
                    className="custom-form-label form-required"
                  >
                    Pickup procedure
                  </label>
                  <Editor
                    id="pickUpProcedure"
                    value={vendorData.pickUpProcedure}
                    placeholder="Enter the pick-up procedure for bookings"
                    onTextChange={(e) =>
                      setVendorData({
                        ...vendorData,
                        pickUpProcedure: e.htmlValue,
                      })
                    }
                    style={{ height: "300px" }}
                  />

                  {showError && !vendorData.pickUpProcedure && (
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

export default Vendors;
